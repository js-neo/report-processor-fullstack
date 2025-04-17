// packages/client/src/hooks/useUnfilledReports.ts
"use client";

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchUnfilledReports } from '@/lib/api';
import { IReport } from 'shared';

interface PaginationState {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface UnfilledReportsParams {
    objectId: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sort?: 'asc' | 'desc';
    status?: 'task' | 'workers' | 'time' | 'all';
}

export const useUnfilledReports = (initialParams?: Partial<UnfilledReportsParams>) => {
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

    const loadReports = useCallback(async (params: UnfilledReportsParams, signal?: AbortSignal) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetchUnfilledReports(
                params.objectId,
                {
                    startDate: params.startDate,
                    endDate: params.endDate,
                    page: params.page,
                    limit: params.limit,
                    sort: params.sort,
                    status: params.status
                },
                { signal }
            );

            setReports(response.data);
            setPagination({
                page: response.page,
                limit: response.limit,
                total: response.total,
                totalPages: response.totalPages
            });
        } catch (err) {
            if (signal?.aborted) return;
            setError(err instanceof Error ? err.message : 'Ошибка загрузки отчетов');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const abortController = new AbortController();
        const params: UnfilledReportsParams = {
            objectId: initialParams?.objectId || '',
            startDate: searchParams.get('start') || undefined,
            endDate: searchParams.get('end') || undefined,
            page: Number(searchParams.get('page')) || 1,
            limit: Number(searchParams.get('limit')) || 10,
            sort: (searchParams.get('sort') as 'asc' | 'desc') || 'desc',
            status: (searchParams.get('status') as 'task' | 'workers' | 'time' | 'all') || 'all'
        };

        if (params.objectId) {
            loadReports(params, abortController.signal);
        }

        return () => abortController.abort();
    }, [searchParams, initialParams?.objectId, loadReports]);

    const updatePagination = useCallback((newPage: number, newLimit?: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        if (newLimit) params.set('limit', newLimit.toString());
        window.history.pushState(null, '', `?${params.toString()}`);
    }, [searchParams]);

    return {
        reports,
        setReports,
        loading,
        error,
        pagination,
        updatePagination
    };
};