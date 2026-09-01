import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

import { LOCALES } from '@messages/constants';

const nextConfig: NextConfig = {
    distDir: process.env.NEXT_DIST_DIR || '.next',
};

const withNextIntl = createNextIntlPlugin({
    experimental: {
        createMessagesDeclaration: LOCALES.map((locale) => `./messages/${locale}.json`),
    },
});

export default withNextIntl(nextConfig);
    