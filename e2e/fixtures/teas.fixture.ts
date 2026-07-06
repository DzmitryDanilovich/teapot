import { test as base } from '@playwright/test';

import LogTeaPage from '@e2e/pages/logTea.page';
import TeaPage from '@e2e/pages/tea.page';
import TeaListPage from '@e2e/pages/teaList.page';

const test = base.extend<{
    logTeaPage: LogTeaPage;
    teaPage: TeaPage;
    teaListPage: TeaListPage;
}>({
    logTeaPage: async ({ page }, use) => {
        await use(new LogTeaPage(page));
    },
    teaPage: async ({ page }, use) => {
        await use(new TeaPage(page));
    },
    teaListPage: async ({ page }, use) => {
        await use(new TeaListPage(page));
    },
});

export { test };
export { expect } from '@playwright/test';
