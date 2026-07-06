import { test as setup } from '@playwright/test';

import { LOGGED_OUT_USER, SEED_USER, seedUserStorageStatePath } from './users';

setup('create test user', async ({ request }) => {
    await request.post('/api/auth/sign-up/email', {
        data: SEED_USER,
    });
    await request.storageState({ path: seedUserStorageStatePath });
});

setup('create logged out test user', async ({ request }) => {
    await request.post('/api/auth/sign-up/email', {
        data: LOGGED_OUT_USER,
    });
});
