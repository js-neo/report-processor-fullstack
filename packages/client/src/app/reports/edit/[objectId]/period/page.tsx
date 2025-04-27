// packages/client/src/app/reports/edit/[objectId]/period/page.tsx

'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { EditReportsTable } from "@/app/dashboard/reports/components/EditReportsForm/EditReportsTable";
import { Suspense } from 'react';
import LoadingSpinner from "@/components/Common/LoadingSpinner";

export default function EditReportsPage() {
    const params = useParams();
    const searchParams = useSearchParams();

    const objectId = decodeURIComponent(params.objectId as string);

    const safeSearchParams = {
        status: searchParams.get('status') || 'all',
        sort: searchParams.get('sort') || 'desc',
        limit: searchParams.get('limit') || '10',
        page: searchParams.get('page') || '1',
        start: searchParams.get('start') || undefined,
        end: searchParams.get('end') || undefined,
    };

    return (
        <div className="p-4 space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Отчёты для редактирования
                </h1>
                {safeSearchParams.start && safeSearchParams.end && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Период: {safeSearchParams.start} - {safeSearchParams.end}
                    </p>
                )}
            </header>

            <Suspense fallback={
                <div className="flex justify-center py-8">
                    <LoadingSpinner className="h-8 w-8" />
                </div>
            }>
                <EditReportsTable
                    objectId={objectId}
                    searchParams={safeSearchParams}
                />
            </Suspense>
        </div>
    );
}