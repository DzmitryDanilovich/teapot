import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { oAuthProxy } from 'better-auth/plugins';

import prisma from './prisma';

export const auth = betterAuth({
    baseURL:
        process.env['BETTER_AUTH_URL'] ??
        (process.env['VERCEL_URL'] && `https://${process.env['VERCEL_URL']}`),
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
        oAuthProxy({ productionURL: process.env['PRODUCTION_URL'] }),
        nextCookies(),
    ],
});
