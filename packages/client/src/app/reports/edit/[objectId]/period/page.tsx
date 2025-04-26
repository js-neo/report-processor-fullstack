// packages/client/src/app/reports/edit/[objectId]/period/page.tsx

import { EditReportsTable } from "@/app/dashboard/reports/components/EditReportsForm/EditReportsTable";
import { Suspense } from 'react';
import LoadingSpinner from "@/components/Common/LoadingSpinner";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

interface PageProps {
    params: { objectId: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function AllReportsPage({ params, searchParams }: PageProps) {
    const awaitedParams = await params;
    const awaitedSearchParams = await searchParams;

    const safeSearchParams = {
        status: Array.isArray(awaitedSearchParams.status) ? awaitedSearchParams.status[0] : awaitedSearchParams.status,
        sort: Array.isArray(awaitedSearchParams.sort) ? awaitedSearchParams.sort[0] : awaitedSearchParams.sort,
        limit: Array.isArray(awaitedSearchParams.limit) ? awaitedSearchParams.limit[0] : awaitedSearchParams.limit,
        page: Array.isArray(awaitedSearchParams.page) ? awaitedSearchParams.page[0] : awaitedSearchParams.page,
        start: Array.isArray(awaitedSearchParams.start) ? awaitedSearchParams.start[0] : awaitedSearchParams.start,
        end: Array.isArray(awaitedSearchParams.end) ? awaitedSearchParams.end[0] : awaitedSearchParams.end,
    };

    const decodedObjectId = decodeURIComponent(awaitedParams.objectId);

    return (
        <div className="p-4 space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Незаполненные отчеты
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Период: {safeSearchParams.start} - {safeSearchParams.end}
                </p>
            </header>
            <Suspense fallback={
                <div className="flex justify-center py-8">
                    <LoadingSpinner className="h-8 w-8" />
                </div>
            }>
                <EditReportsTable
                    objectId={decodedObjectId}
                    searchParams={safeSearchParams}
                />
            </Suspense>
        </div>
    );
}