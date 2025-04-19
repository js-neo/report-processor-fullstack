// packages/client/src/app/api/auth/register/route.ts

import { NextResponse } from 'next/server';
import {BASE_URL} from "@/config";

export async function POST(req: Request) {
    try {
        const { fullName, telegram_username, password, objectRef } = await req.json();

        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, telegram_username, password, objectRef }),
        });

        if (!response.ok) {
            console.log("Failed to register user_route: ", response);
            const error = await response.json();
            return NextResponse.json(
                { error: error.message || 'Registration failed' },
                { status: response.status }
            );
        }

        const { data } = await response.json();
        console.log("Register response_route: ", data);

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
        console.log("Response response_route: ", responseWithCookie);
        return responseWithCookie;

    } catch (error) {
        if (error instanceof Error) {
            console.log("Error register_response_route: ", error.message);
        }

        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}