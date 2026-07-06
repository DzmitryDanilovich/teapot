import { Page } from '@playwright/test';

import { TeaType } from '@/generated/prisma/client';

class TeaPage {
    readonly name;
    readonly type;
    readonly origin;
    readonly storeUrl;

    readonly editButton;
    readonly deleteButton;
    readonly saveButton;

    readonly nameInput;
    readonly typeSelect;
    readonly originInput;
    readonly storeUrlInput;

    constructor(private readonly page: Page) {
        this.name = page.getByRole('heading', { level: 2 });
        this.type = page.getByTestId('tea-type');
        this.origin = page.getByTestId('tea-origin');
        this.storeUrl = page.getByTestId('tea-store-url');

        this.editButton = page.getByRole('button', { name: 'Edit' });
        this.deleteButton = page.getByRole('button', { name: 'Delete' });
        this.saveButton = page.getByRole('button', { name: 'Save' });

        this.nameInput = page.getByPlaceholder('Tea Name');
        this.typeSelect = page.getByPlaceholder('Tea Type');
        this.originInput = page.getByPlaceholder('Tea Origin');
        this.storeUrlInput = page.getByPlaceholder('Store URL');
    }

    async navigate(teaId: string) {
        await this.page.goto(`/teas/${teaId}`);
    }

    async editTea(
        name: string,
        type: TeaType,
        origin: string,
        storeUrl: string,
    ) {
        await this.editButton.click();
        await this.nameInput.fill(name);
        await this.typeSelect.click();
        await this.page.getByRole('option', { name: type }).click();
        await this.originInput.fill(origin);
        await this.storeUrlInput.fill(storeUrl);
        await this.saveButton.click();
    }

    async deleteTea() {
        await this.deleteButton.click();
    }
}

export default TeaPage;
