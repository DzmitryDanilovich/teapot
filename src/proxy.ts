import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { routing } from '@/i18n/routing';
import { auth } from '@/lib/auth';

const authProxy = async (request: NextRequest, response: NextResponse) => {
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    if (!session) {
        const locale = response.headers.get('x-next-intl-locale');
        const prefix = locale ? `/${locale}` : '';
        return NextResponse.redirect(new URL(`${prefix}/login`, request.url));
    }

    return response;
};

const i18nProxy = createMiddleware(routing);

export const proxy = async (request: NextRequest) => {
    const response = i18nProxy(request);

    if (/\/(log|teas)(\/|$)/.test(request.nextUrl.pathname)) {
        return await authProxy(request, response);
    }

    return response;
};

export const config = {
    matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
