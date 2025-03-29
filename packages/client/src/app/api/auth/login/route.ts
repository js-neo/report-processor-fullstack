// client/src/app/api/auth/login/route.ts

import { NextResponse } from 'next/server';
import { BASE_URL } from '@/lib/api';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });


        if (!response.ok) {
            const error = await response.json().catch(() => ({
                message: 'Unknown error occurred'
            }));

            console.log("error: ", error.message);

            return NextResponse.json(
                { error: error.message || 'Authentication failed' },
                {
                    status: response.status,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        const {data} = await response.json();

        const nextResponse = NextResponse.json({
            ...data,
            accessToken: data.accessToken
        });

        nextResponse.cookies.set({
            name: 'accessToken',
            value: data.accessToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
            maxAge: 60 * 60 * 24,
        });


        return nextResponse;

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}