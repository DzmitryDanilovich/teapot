import { test as setup } from '@e2e/fixtures/teas.fixture';

import { SEED_TEA, EDITABLE_TEA, DELETABLE_TEA } from './teas';

setup('create test tea', async ({ logTeaPage }) => {
    await logTeaPage.navigate();

    await logTeaPage.logTea(
        SEED_TEA.name,
        SEED_TEA.type,
        SEED_TEA.origin,
        SEED_TEA.storeUrl,
    );
});

setup('create editable test tea', async ({ logTeaPage }) => {
    await logTeaPage.navigate();

    await logTeaPage.logTea(
        EDITABLE_TEA.name,
        EDITABLE_TEA.type,
        EDITABLE_TEA.origin,
        EDITABLE_TEA.storeUrl,
    );
});

setup('create deletable test tea', async ({ logTeaPage }) => {
    await logTeaPage.navigate();

    await logTeaPage.logTea(
        DELETABLE_TEA.name,
        DELETABLE_TEA.type,
        DELETABLE_TEA.origin,
        DELETABLE_TEA.storeUrl,
    );
});
