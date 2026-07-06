import { test as base } from '@playwright/test';

import MainPage from '@e2e/pages/main.page';

const test = base.extend<{
    mainPage: MainPage;
}>({
    mainPage: async ({ page }, use) => {
        await use(new MainPage(page));
    },
});

export { test };
export { expect } from '@playwright/test';
