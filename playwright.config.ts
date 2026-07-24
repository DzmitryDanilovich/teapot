import path from 'node:path';

import { defineConfig, devices, PlaywrightTestConfig } from '@playwright/test';
import dotenv from 'dotenv';

import {
    seedUserStorageStatePath,
    e2eUserStorageStatePath,
} from './e2e/constants';

const isCI = process.env.CI;
const isProduction = process.env.isProduction === 'true';

dotenv.config({
    path: path.resolve(__dirname, `.env${isCI ? '' : '.e2e'}`),
    override: true,
});

const port = process.env.PORT || 3001;

if (isCI && !process.env.baseURL) {
    throw new Error(
        'baseURL is not defined. Please set the baseURL environment variable.',
    );
}

const commonConfig = {
    testDir: './e2e',
    fullyParallel: true,
};

const ciConfig: PlaywrightTestConfig = {
    ...commonConfig,
    retries: 2,
    reporter: [['github'], ['html']],
    use: {
        baseURL: process.env.baseURL,
        screenshot: 'only-on-failure',
        trace: 'on-first-retry',
    },
};

const nonProductionConfig: PlaywrightTestConfig = {
    projects: [
        {
            name: 'auth seed',
            testMatch: 'auth.setup.ts',
        },
        {
            name: 'teas seed',
            testMatch: 'teas.setup.ts',
            use: {
                ...devices['Desktop Chrome'],
                storageState: seedUserStorageStatePath,
            },
            dependencies: ['auth seed'],
        },
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                storageState: seedUserStorageStatePath,
            },
            dependencies: ['auth seed', 'teas seed'],
        },
    ],
};

const ciProductionConfig: PlaywrightTestConfig = {
    ...ciConfig,

    projects: [
        {
            name: 'auth setup',
            testMatch: 'auth-prod.setup.ts',
            use: {
                ...devices['Desktop Chrome'],
            },
        },
        {
            name: 'chromium',
            grep: /@smoke/,
            use: {
                ...devices['Desktop Chrome'],
                storageState: e2eUserStorageStatePath,
            },
            dependencies: ['auth setup'],
        },
    ],
};

const ciPreviewConfig: PlaywrightTestConfig = {
    ...ciConfig,
    ...nonProductionConfig,

    use: {
        ...ciConfig.use,
        extraHTTPHeaders: {
            'x-vercel-protection-bypass':
                process.env.vercelAutomationBypassSecret || '',
            'x-vercel-set-bypass-cookie': 'true',
        },
    },
};

const localConfig: PlaywrightTestConfig = {
    ...commonConfig,
    ...nonProductionConfig,
    globalSetup: './e2e/setup/global-setup.ts',
    retries: 0,
    reporter: [['list'], ['html']],
    use: {
        baseURL: `http://localhost:${port}`,
        screenshot: 'only-on-failure',
        trace: 'on',
    },

    webServer: {
        command: `pnpm build && pnpm start --port ${port}`,
        url: `http://localhost:${port}`,
        reuseExistingServer: false,
    },
};

const getConfig = (): PlaywrightTestConfig => {
    if (isCI) {
        return isProduction ? ciProductionConfig : ciPreviewConfig;
    }

    return localConfig;
};

export default defineConfig(getConfig());
