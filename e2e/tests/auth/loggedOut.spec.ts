import { test, expect } from '@e2e/fixtures/login.fixture';
import { LOGGED_OUT_USER } from '@e2e/setup/users';

test.use({ storageState: { cookies: [], origins: [] } });

test('navigate to login page', { tag: '@smoke' }, async ({ page }) => {
    await page.goto('/');

    const loginButton = page.getByRole('link', { name: 'Log In' });
    await loginButton.click();

    await expect(page).toHaveURL('/login');
});

test('sign up a new user', async ({ page, loginPage }) => {
    await loginPage.navigate();

    await loginPage.signUp('Test User', 'test@example.com', '12qw!@QW');

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('button', { name: 'Log Out' })).toBeVisible();
});

test('log in an existing user', async ({ page, loginPage }) => {
    await loginPage.navigate();

    await loginPage.logIn(LOGGED_OUT_USER.email, LOGGED_OUT_USER.password);

    await expect(page).toHaveURL('/');

    await expect(page.getByRole('button', { name: 'Log Out' })).toBeVisible();
});

test(
    'log in with invalid credentials',
    { tag: '@smoke' },
    async ({ page, loginPage }) => {
        await loginPage.navigate();

        await loginPage.logIn('invalid@example.com', 'invalidpassword');

        await expect(page).toHaveURL('/login');
        await expect(page.getByText('Invalid email or password')).toBeVisible();
    },
);

test(
    'cannot access log page when logged out',
    { tag: '@smoke' },
    async ({ page }) => {
        await page.goto('/log');

        await expect(page).toHaveURL('/login');
    },
);

test(
    'cannot access teas page when logged out',
    { tag: '@smoke' },
    async ({ page }) => {
        await page.goto('/teas');

        await expect(page).toHaveURL('/login');
    },
);
