import { NextResponse } from 'next/server';
import { BASE_URL } from '@/lib/api';

export async function POST(req: Request) {
    try {
        const { fullName, telegram_username, password, objectRef } = await req.json();

        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, telegram_username, password, objectRef }),
        });

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json(
                { error: error.message || 'Registration failed' },
                { status: response.status }
            );
        }

        const { data } = await response.json();

        const redirectUrl = new URL('/dashboard', req.url);
        const responseWithCookie = NextResponse.redirect(redirectUrl);

        responseWithCookie.cookies.set({
            name: 'accessToken',
            value: data.accessToken,
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 86400,
        });

        return responseWithCookie;

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}