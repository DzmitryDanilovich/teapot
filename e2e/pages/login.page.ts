import { Page } from '@playwright/test';

class LoginPage {
    readonly signUpTabButton;
    readonly nameInput;
    readonly emailInput;
    readonly passwordInput;
    readonly logInButton;
    readonly signUpButton;

    constructor(private readonly page: Page) {
        this.signUpTabButton = page.getByRole('tab', { name: 'Sign Up' });
        this.nameInput = page.getByLabel('Name');
        this.emailInput = page.getByLabel('Email');
        this.passwordInput = page.getByLabel('Password');
        this.logInButton = page.getByRole('button', {
            name: 'Log In',
            exact: true,
        });
        this.signUpButton = page.getByRole('button', { name: 'Sign Up' });
    }

    async navigate() {
        await this.page.goto('/login');
    }

    async signUp(name: string, email: string, password: string) {
        await this.signUpTabButton.click();
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.signUpButton.click();
    }

    async logIn(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.logInButton.click();
    }
}

export default LoginPage;
