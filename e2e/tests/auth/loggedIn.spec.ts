import { test, expect } from '@e2e/fixtures/login.fixture';
import { SEED_TEA } from '@e2e/setup/teas';
import { LOGGED_OUT_USER } from '@e2e/setup/users';

test.use({ storageState: { cookies: [], origins: [] } });

test('log out a logged in user', async ({ page, loginPage }) => {
    await loginPage.navigate();

    await loginPage.logIn(LOGGED_OUT_USER.email, LOGGED_OUT_USER.password);

    const logOutButton = page.getByRole('button', { name: 'Log Out' });
    await logOutButton.click();

    await expect(page).toHaveURL('/login');

    await expect(page.getByRole('link', { name: 'Log In' })).toBeVisible();
});

test("cannot see other user's teas", async ({ page, loginPage }) => {
    await loginPage.navigate();

    await loginPage.logIn(LOGGED_OUT_USER.email, LOGGED_OUT_USER.password);

    await expect(page).toHaveURL('/');

    await page.goto('/teas');

    await expect(page).toHaveURL('/teas');
    await expect(page.getByText(SEED_TEA.name)).not.toBeVisible();
});
