// packages/client/src/app/api/auth/me/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { BASE_URL } from '@/lib/api';

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('accessToken')?.value ||
            req.headers.get('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const response = await fetch(`${BASE_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401) {
            return NextResponse.json(
                { error: 'Session expired' },
                { status: 401 }
            );
        }

        if (!response.ok) {
            const error = await response.text();
            return NextResponse.json(
                { error: error || 'Failed to fetch user data' },
                { status: response.status }
            );
        }

        const data = await response.json();

        if (!data.data?.managerId) {
            return NextResponse.json(
                { error: 'Invalid user data structure' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            managerId: data.data.managerId,
            fullName: data.data.fullName,
            telegram_username: data.data.telegram_username,
            objectRef: data.data.objectRef,
            role: data.data.role
        });

    } catch (error) {
        console.error('[API/me] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}