import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export const proxy = async (request: NextRequest) => {
    const session = await auth.api.getSession({
        headers: request.headers
    });

    if (!session) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
};

export const config = {
    matcher: ['/log', '/teas']
}
