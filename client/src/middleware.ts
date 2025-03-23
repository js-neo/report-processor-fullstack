// src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = new Set(['/auth/login', '/auth/register']);
const IGNORE_PATHS = ['/_next/', '/favicon.ico'];

export function middleware(request: NextRequest) {
    const token = request.cookies.get('accessToken');
    const { pathname } = request.nextUrl;

    console.log('Middleware triggered for:', pathname);
    console.log('[Middleware] Path:', request.nextUrl.pathname);
    console.log('Token:', token);

    if (IGNORE_PATHS.some(path => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    if (pathname.startsWith('/api')) {
        if (!token && !pathname.includes('/auth')) {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
        return NextResponse.next();
    }

    if (!token && !PUBLIC_PATHS.has(pathname)) {
        return NextResponse.redirect(
            new URL(`/auth/login?redirect=${encodeURIComponent(pathname)}`, request.url)
        );
    }

    if (token && PUBLIC_PATHS.has(pathname)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|api/|_error).*)'
    ],
};