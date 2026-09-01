import { test, expect } from '@e2e/fixtures/main.fixture';

test('navigate to the main page', { tag: '@smoke' }, async ({ mainPage }) => {
    await mainPage.navigate();

    await expect(mainPage.logTeaButton).toBeVisible();
    await expect(mainPage.teaListButton).toBeVisible();
});

test(
    'navigate to the Log Tea page from the main page',
    { tag: '@smoke' },
    async ({ page, mainPage }) => {
        await mainPage.navigate();

        await mainPage.logTeaButton.click();

        await expect(page).toHaveURL('/log');
    },
);

test(
    'navigate to the Tea List page from the main page',
    { tag: '@smoke' },
    async ({ page, mainPage }) => {
        await mainPage.navigate();

        await mainPage.teaListButton.click();

        await expect(page).toHaveURL('/teas');
    },
);

test(
    'change language from the main page',
    { tag: '@smoke' },
    async ({ page, mainPage }) => {
        await mainPage.navigate();

        await page.getByRole('button', { name: 'Language' }).click();
        await page.getByText('Polski').click();

        await expect(page).toHaveURL('/pl');
        await expect(
            page.getByRole('link', { name: 'Przejdź do herbat' }),
        ).toBeVisible();
        await expect(
            page.getByRole('link', { name: 'Dodaj wpis' }),
        ).toBeVisible();
    },
);

test(
    'change theme from the main page',
    { tag: '@smoke' },
    async ({ page, mainPage }) => {
        await mainPage.navigate();

        await expect(page.locator('html')).toHaveClass(/light/);

        await page.getByRole('button', { name: 'Toggle Theme' }).click();

        await expect(page.locator('html')).toHaveClass(/dark/);
    },
);
