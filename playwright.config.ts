import path from 'node:path';

import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

import { seedUserStorageStatePath } from './e2e/setup/users';

dotenv.config({ path: path.resolve(__dirname, '.env.e2e'), override: true });

const port = process.env.PORT || 3001;

export default defineConfig({
    testDir: './e2e',
    globalSetup: './e2e/setup/global-setup.ts',
    fullyParallel: true,
    reporter: 'html',

    use: {
        baseURL: `http://localhost:${port}`,
        screenshot: 'only-on-failure',
        trace: 'on',
    },

    projects: [
        {
            name: 'auth seed',
            testMatch: 'auth.setup.ts',
        },
        {
            name: 'teas seed',
            testMatch: 'teas.setup.ts',
            use: { ...devices['Desktop Chrome'], storageState: seedUserStorageStatePath },
            dependencies: ['auth seed'],
        },
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'], storageState: seedUserStorageStatePath },
            dependencies: ['auth seed', 'teas seed'],
        },
    ],

    webServer: {
        command: `pnpm build && pnpm start --port ${port}`,
        url: `http://localhost:${port}`,
        reuseExistingServer: false,
    },
});
