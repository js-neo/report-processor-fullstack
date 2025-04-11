// packages/client/src/app/api/reports/unfilled/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchUnfilledReports } from '@/lib/api';

export async function GET(req: NextRequest) {
    try {
        const objectRef = req.nextUrl.searchParams.get('objectId');

        if (!objectRef) {
            return NextResponse.json(
                { error: 'objectId is required' },
                { status: 400 }
            );
        }

        const reports = await fetchUnfilledReports(objectRef);
        console.log("reports: ", reports);
        return NextResponse.json(reports);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}