import { Page } from '@playwright/test';

import { TeaType } from '@/generated/prisma/client';

class LogTeaPage {
    readonly teaNameInput;
    readonly teaTypeSelect;
    readonly teaOriginInput;
    readonly storeUrlInput;
    readonly saveButton;

    constructor(private readonly page: Page) {
        this.teaNameInput = page.getByPlaceholder('Tea Name');
        this.teaTypeSelect = page.getByPlaceholder('Tea Type');
        this.teaOriginInput = page.getByPlaceholder('Tea Origin');
        this.storeUrlInput = page.getByPlaceholder('Store URL');
        this.saveButton = page.getByRole('button', { name: 'Save' });
    }

    async navigate() {
        await this.page.goto('/log');
    }

    async logTea(
        teaName: string,
        teaType: TeaType,
        teaOrigin: string,
        storeUrl: string,
    ) {
        await this.teaNameInput.fill(teaName);
        await this.teaTypeSelect.click();
        await this.page.getByRole('option', { name: teaType }).click();
        await this.teaOriginInput.fill(teaOrigin);
        await this.storeUrlInput.fill(storeUrl);
        await this.saveButton.click();
    }
}

export default LogTeaPage;
