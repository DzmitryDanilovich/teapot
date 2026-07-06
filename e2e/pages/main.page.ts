import { Page } from '@playwright/test';

class MainPage {
    readonly logTeaButton;
    readonly teaListButton;

    constructor(private readonly page: Page) {
        this.logTeaButton = this.page.getByRole('link', { name: 'Log' });
        this.teaListButton = this.page.getByRole('link', {
            name: 'Go To Teas',
        });
    }

    async navigate() {
        await this.page.goto('/');
    }
}

export default MainPage;
