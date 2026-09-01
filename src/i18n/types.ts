import type { getTranslations } from 'next-intl/server';

export type Translator = Awaited<ReturnType<typeof getTranslations>>;
