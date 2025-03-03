"use client";

import { useEffect, useState, useCallback } from 'react';
import {
    fetchEmployeeReports,
    fetchObjectReport
} from '@/lib/api';
import { IReport} from '@/interfaces/report.interface';
import { ObjectReport } from '@/interfaces/object.interface';

type ReportParams =
    | {
    type: 'employee';
    username: string;
    startDate: string;
    endDate: string;
}
    | {
    type: 'object';
    objectName: string;
    startDate: string;
    endDate: string;
};

export const useReports = <T extends ReportParams>(params: T) => {
    const [state, setState] = useState<{
        data: T extends { type: 'employee' } ? IReport[] :
            T extends { type: 'object' } ? ObjectReport :
                never;
        loading: boolean;
        error: string | null;
    }>({
        data: null as any,
        loading: true,
        error: null,
    });

    const loadData = useCallback(async (signal?: AbortSignal) => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));

            let result;
            if (params.type === 'employee') {
                result = await fetchEmployeeReports(
                    params.username,
                    params.startDate,
                    params.endDate,
                    { signal }
                );
            } else if (params.type === 'object') {
                result = await fetchObjectReport(
                    params.objectName,
                    params.startDate,
                    params.endDate,
                    { signal }
                );
            } else {
                throw new Error('Неизвестный тип отчета');
            }

            setState({
                data: result as any,
                loading: false,
                error: null
            });
        } catch (err) {
            if (!signal?.aborted) {
                setState({
                    data: null as any,
                    loading: false,
                    error: err instanceof Error ? err.message : 'Ошибка загрузки'
                });
            }
        }
    }, [
        params.type,
        params.type === 'employee' ? params.username : null,
        params.startDate,
        params.endDate,
        params.type === 'object' ? params.objectName : null
    ].filter(Boolean));

    useEffect(() => {
        const abortController = new AbortController();
        loadData(abortController.signal);
        return () => abortController.abort();
    }, [loadData]);

    return state;
};