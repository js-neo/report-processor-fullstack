// packages/client/src/app/api/auth/validate/route.ts

import {NextRequest, NextResponse} from 'next/server';
import { BASE_URL } from '@/config';

console.log('___________Proxying to______________:', `${BASE_URL}/auth/validate`);

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const cookie = req.cookies.get('accessToken')?.value;

        if (!cookie) {
            return NextResponse.json({ valid: false }, { status: 401 });
        }

        const response = await fetch(`${BASE_URL}/auth/validate`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookie}`
            },
            credentials: 'include'
        });

        if (!response.ok) {
            return NextResponse.json(
                { valid: false },
                { status: response.status }
            );
        }

        const data = await response.json();

        console.log('Proxying to:', `${BASE_URL}/auth/validate`);
        console.log('Response status:', response.status);
        console.log('Response body_validate:', data);
        return NextResponse.json(data);
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { valid: false, error: `Validation failed: ${error.message}` },
                { status: 500 }
            );
        }
    }
}