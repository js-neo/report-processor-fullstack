// packages/client/src/hooks/useAllReports.ts

"use client";

import { useEffect, useState, useCallback, useMemo } from 'react';
import { fetchAllReports } from '@/lib/api';
import { IReport } from 'shared';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface PaginationState {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface AllReportsParams {
    objectId: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sort?: 'asc' | 'desc';
    status?: 'all' | 'filled' | 'unfilled' | 'task' | 'workers' | 'time';
}

export const useAllReports = (params: AllReportsParams) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [reports, setReports] = useState<IReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationState>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
    });

    const [abortController, setAbortController] = useState<AbortController | null>(null);

    const memoizedParams = useMemo(() => params, [
        params.objectId,
        params.startDate,
        params.endDate,
        params.page,
        params.limit,
        params.sort,
        params.status
    ]);

    const loadReports = useCallback(async (signal?: AbortSignal) => {
        try {
            setLoading(true);
            setError(null);

            if (abortController) {
                abortController.abort();
            }

            const controller = new AbortController();
            setAbortController(controller);

            const response = await fetchAllReports({
                objectId: params.objectId,
                startDate: params.startDate,
                endDate: params.endDate,
                page: params.page?.toString(),
                limit: params.limit?.toString(),
                sort: params.sort,
                status: params.status
            }, { signal: signal || controller.signal });

            setReports(response.data);
            setPagination({
                page: response.page,
                limit: response.limit,
                total: response.total,
                totalPages: response.totalPages
            });
        } catch (err) {
            if (err instanceof Error) {
                if (err.name !== 'AbortError') {
                    setError(err.message);
                }
            } else {
                setError('Ошибка загрузки отчетов');
            }
        } finally {
            setLoading(false);
        }
    }, [params, abortController]);

    useEffect(() => {
        loadReports();

        return () => {
            if (abortController) {
                abortController.abort();
            }
        };
    }, [memoizedParams]);

    const updatePagination = useCallback((newPage: number, newLimit?: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());

        if (newLimit) {
            params.set('limit', newLimit.toString());
            params.set('page', '1');
        }

        router.replace(`${pathname}?${params.toString()}`);
    }, [searchParams, pathname, router]);

    return {
        reports,
        setReports,
        loading,
        error,
        pagination,
        updatePagination,
        loadReports
    };
};