import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['en', 'pl', 'be', 'ru'],
    defaultLocale: 'en',
    localePrefix: 'as-needed',
});
