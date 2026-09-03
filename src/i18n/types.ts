import type { getTranslations } from 'next-intl/server';

export type Translations = Awaited<ReturnType<typeof getTranslations>>;
