// packages/client/src/app/api/auth/login/route.ts

import { NextResponse } from 'next/server';
import { BASE_URL } from '@/lib/api';

export async function POST(req: Request) {
    try {
        const { telegram_username, password } = await req.json();
        console.log({ telegram_username, password });

        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ telegram_username, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json(
                { error: error.message || 'Authentication failed' },
                { status: response.status }
            );
        }

        const { data } = await response.json();

        const responseWithCookie = NextResponse.json({
            success: true,
            data: {
                accessToken: data.accessToken,
                user: {
                    managerId: data.managerId,
                    fullName: data.fullName,
                    telegram_username: data.telegram_username,
                    role: data.role,
                    objectRef: data.objectRef
                }
            }
        });

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