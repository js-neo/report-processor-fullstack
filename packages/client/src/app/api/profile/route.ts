// packages/client/src/app/api/profile/route.ts

import { NextResponse } from 'next/server';
import { BASE_URL } from '@/lib/api';

export async function PATCH(req: Request) {
    try {
        console.log('Received PATCH request to /api/profile');
        const token = req.headers.get('Authorization')?.replace('Bearer ', '');
        const body = await req.json();
        console.log('Request body:', body);

        if (!body._id) {
            console.warn('Missing objectId in request');
            return NextResponse.json(
                { error: 'Object ID is required' },
                { status: 400 }
            );
        }

        console.log('Forwarding request to backend:', {
            url: `${BASE_URL}/managers/me/object`,
            objectId: body._id
        });

        const response = await fetch(`${BASE_URL}/managers/me/object`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ objectId: body._id })
        });

        console.log('Backend response status:', response.status);

        if (!response.ok) {
            const error = await response.text();
            console.error('Backend error:', error);
            return NextResponse.json(
                { error: error || 'Failed to update manager object' },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('Backend success response:', data);
        return NextResponse.json(data);
    } catch (error) {
        console.error('API route error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}