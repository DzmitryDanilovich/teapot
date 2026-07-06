import { test, expect } from '@e2e/fixtures/main.fixture';

test('navigate to the main page', async ({ mainPage }) => {
    await mainPage.navigate();

    await expect(mainPage.logTeaButton).toBeVisible();
    await expect(mainPage.teaListButton).toBeVisible();
});

test('navigate to the Log Tea page from the main page', async ({
    page,
    mainPage,
}) => {
    await mainPage.navigate();

    await mainPage.logTeaButton.click();

    await expect(page).toHaveURL('/log');
});

test('navigate to the Tea List page from the main page', async ({
    page,
    mainPage,
}) => {
    await mainPage.navigate();

    await mainPage.teaListButton.click();

    await expect(page).toHaveURL('/teas');
});
