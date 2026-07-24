import { test as setup, expect } from '@playwright/test';

import { seedUserStorageStatePath } from '@e2e/constants';

import { LOGGED_OUT_USER, SEED_USER } from './users';

setup('create test user', async ({ request, baseURL }) => {
    const response = await request.post('/api/auth/sign-up/email', {
        data: SEED_USER,
        headers: { origin: baseURL ?? '' },
    });

    expect(response.ok()).toBeTruthy();

    await request.storageState({ path: seedUserStorageStatePath });
});

setup('create logged out test user', async ({ request, baseURL }) => {
    const response = await request.post('/api/auth/sign-up/email', {
        data: LOGGED_OUT_USER,
        headers: { origin: baseURL ?? '' },
    });

    expect(response.ok()).toBeTruthy();
});
