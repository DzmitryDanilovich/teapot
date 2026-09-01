import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

export default getRequestConfig(
    async ({ requestLocale: requestLocalePromise }) => {
        const requestLocale = await requestLocalePromise;

        const locale = hasLocale(routing.locales, requestLocale)
            ? requestLocale
            : routing.defaultLocale;

        return {
            locale,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            messages: (await import(`@messages/${locale}.json`)).default,
        };
    },
);
