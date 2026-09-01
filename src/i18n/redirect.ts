import { getLocale } from 'next-intl/server';

import { redirect as intlRedirect } from './navigation';

export const redirect = async (href: string) => {
    const locale = await getLocale();
    return intlRedirect({ href, locale });
};
