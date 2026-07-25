import process from 'node:process';

import { test as setup, expect } from '@playwright/test';

import { e2eUserStorageStatePath } from '@e2e/constants';

export const E2E_USER = {
    email: process.env.e2eUserEmail,
    password: process.env.e2eUserPassword,
};

setup('sign in e2e user', async ({ request, baseURL }) => {
    const response = await request.post('/api/auth/sign-in/email', {
        data: E2E_USER,
        headers: { origin: baseURL ?? '' },
    });

    expect(response.ok()).toBeTruthy();

    await request.storageState({ path: e2eUserStorageStatePath });
});
