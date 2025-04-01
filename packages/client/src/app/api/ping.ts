// app/api/ping.ts

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
const PING_TIMEOUT = 5000;

export async function GET() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), PING_TIMEOUT);

    try {
        const response = await fetch('https://report-processor-fullstack.onrender.com/health', {
            signal: controller.signal,
        });

        const responseData = {
            status: response.ok ? 'ok' : 'error',
            code: response.status,
            timestamp: new Date().toISOString()
        };

        console.log('Ping result:', responseData);
        return NextResponse.json(responseData);

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Ping failed:', errorMessage);

        return NextResponse.json(
            {
                status: 'error',
                code: 503,
                error: errorMessage
            },
            { status: 200 }
        );
    } finally {
        clearTimeout(timeoutId);
    }
}