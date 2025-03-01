"use client";

import { useEffect, useState, useCallback } from 'react';
import { fetchReports } from '@/lib/api';
import { IReport } from '@shared/types/report';

export const useReports = () => {
    const [state, setState] = useState<{
        reports: IReport[];
        loading: boolean;
        error: string | null;
    }>({
        reports: [],
        loading: true,
        error: null,
    });

    const loadData = useCallback(async (signal?: AbortSignal) => {
        try {
            setState(prev => ({ ...prev, loading: true }));
            const data = await fetchReports({ signal });
            setState({ reports: data, loading: false, error: null });
        } catch (err) {
            if (!signal?.aborted) {
                setState({
                    reports: [],
                    loading: false,
                    error: err instanceof Error ? err.message : 'Ошибка загрузки',
                });
            }
        }
    }, []);

    useEffect(() => {
        const abortController = new AbortController();
        loadData(abortController.signal);
        return () => abortController.abort();
    }, [loadData]);

    return state;
};