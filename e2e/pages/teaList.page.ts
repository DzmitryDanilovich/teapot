import { Page } from '@playwright/test';

class TeaListPage {
    readonly teaList;
    readonly teaListItems;

    constructor(private readonly page: Page) {
        this.teaList = this.page.getByRole('list');
        this.teaListItems = this.teaList.getByRole('listitem');
    }

    async navigate() {
        await this.page.goto('/teas');
    }

    getTeaListItemByName(name: string) {
        return this.teaListItems.filter({ hasText: name }).first();
    }

    async openTeaListItemByName(name: string) {
        const teaListItem = this.getTeaListItemByName(name);
        await teaListItem.getByRole('link', { name: 'View Details' }).click();
    }
}

export default TeaListPage;
