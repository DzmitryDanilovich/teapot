import { test as base } from '@playwright/test';

import LoginPage from '@e2e/pages/login.page';

const test = base.extend<{
    loginPage: LoginPage;
}>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
});

export { test };
export { expect } from '@playwright/test';
