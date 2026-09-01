import { i18n, locales } from '@better-auth/i18n';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { oAuthProxy } from 'better-auth/plugins';

import prisma from './prisma';

export const auth = betterAuth({
    baseURL:
        process.env['BETTER_AUTH_URL'] ??
        (process.env['VERCEL_URL'] && `https://${process.env['VERCEL_URL']}`),
    trustedOrigins: process.env['VERCEL_URL']
        ? [`https://${process.env['VERCEL_URL']}`]
        : [],
    database: prismaAdapter(prisma, { provider: 'postgresql' }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            enabled: true,
            clientId: process.env['GOOGLE_CLIENT_ID']!,
            clientSecret: process.env['GOOGLE_CLIENT_SECRET']!,
        },
    },
    plugins: [
        i18n({
            translations: {
                en: locales.en,
                pl: locales.pl,
                be: {
                    USER_NOT_FOUND: 'Карыстальнік не знойдзены',
                    INVALID_EMAIL_OR_PASSWORD:
                        'Няправільная электронная пошта або пароль',
                    INVALID_PASSWORD: 'Няправільны пароль',
                    CREDENTIAL_ACCOUNT_NOT_FOUND: 'Уліковы запіс не знойдзены',
                    EMAIL_NOT_VERIFIED: 'Электронная пошта не пацверджан',
                    SESSION_EXPIRED: 'Сесія скончылася',
                },
                ru: locales.ru,
            },
            detection: ['cookie', 'header'],
            localeCookie: 'NEXT_LOCALE',
        }),
        oAuthProxy({ productionURL: process.env['PRODUCTION_URL'] }),
        nextCookies(),
    ],
});
