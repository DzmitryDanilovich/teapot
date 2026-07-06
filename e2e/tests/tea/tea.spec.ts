import { test, expect } from '@e2e/fixtures/teas.fixture';
import { DELETABLE_TEA, EDITABLE_TEA, SEED_TEA } from '@e2e/setup/teas';

test('log a valid tea', async ({ page, logTeaPage, teaListPage }) => {
    await logTeaPage.navigate();

    await logTeaPage.logTea(
        'Earl Grey',
        'black',
        'China',
        'https://www.example.com/earl-grey',
    );

    await expect(page).toHaveURL('/teas');
    await expect(teaListPage.getTeaListItemByName('Earl Grey')).toBeVisible();
});

test('log a tea with missing required fields', async ({ page, logTeaPage }) => {
    await logTeaPage.navigate();

    await logTeaPage.logTea('', 'green', '', '');

    await expect(page).toHaveURL('/log');
    await expect(page.getByText('Name is required')).toBeVisible();
});

test('log a tea with an invalid URL', async ({ page, logTeaPage }) => {
    await logTeaPage.navigate();

    await logTeaPage.logTea('Green Tea', 'green', 'Japan', 'invalid-url');

    await expect(page).toHaveURL('/log');
    await expect(page.getByText('Store URL must be a valid URL')).toBeVisible();
});

test('open a tea card from the tea list', async ({ teaListPage, teaPage }) => {
    await teaListPage.navigate();

    await teaListPage.openTeaListItemByName(SEED_TEA.name);

    await expect(teaPage.name).toHaveText(SEED_TEA.name);
    await expect(teaPage.type).toHaveText(SEED_TEA.type);
    await expect(teaPage.origin).toHaveText(SEED_TEA.origin);
    await expect(teaPage.storeUrl).toHaveText(SEED_TEA.storeUrl);
});

test('edit a tea', async ({ teaListPage, teaPage }) => {
    await teaListPage.navigate();

    await teaListPage.openTeaListItemByName(EDITABLE_TEA.name);

    await teaPage.editTea(
        'Edited Tea',
        'oolong',
        'Taiwan',
        'https://www.example.com/edited-tea',
    );

    await expect(teaPage.name).toHaveText('Edited Tea');
    await expect(teaPage.type).toHaveText('oolong');
    await expect(teaPage.origin).toHaveText('Taiwan');
    await expect(teaPage.storeUrl).toHaveText(
        'https://www.example.com/edited-tea',
    );
});

test('delete a tea', async ({ teaListPage, teaPage }) => {
    await teaListPage.navigate();

    await teaListPage.openTeaListItemByName(DELETABLE_TEA.name);

    await teaPage.deleteTea();

    await expect(
        teaListPage.getTeaListItemByName(DELETABLE_TEA.name),
    ).not.toBeVisible();
});
