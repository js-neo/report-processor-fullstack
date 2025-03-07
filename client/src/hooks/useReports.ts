// client/src/hooks/useReports.ts

"use client";

import { useEffect, useState, useCallback } from 'react';
import {
    fetchEmployeeReports,
    fetchObjectReport
} from '@/lib/api';
import { EmployeeReportsResponse} from "@shared/types/api";
import { ObjectReportResponse } from "@shared/types/api";

type ReportParams =
    | {
    type: 'employee';
    workerName: string;
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
        response: T extends { type: 'employee' } ? EmployeeReportsResponse :
            T extends { type: 'object' } ? ObjectReportResponse :
                never;
        loading: boolean;
        error: string | null;
    }>({
        response: null as any,
        loading: true,
        error: null,
    });

    const loadData = useCallback(async (signal?: AbortSignal) => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));

            let result;
            if (params.type === 'employee') {
                result = await fetchEmployeeReports(
                    params.workerName,
                    params.startDate,
                    params.endDate,
                    { signal }
                );
                console.log("result_useReports: ", result);
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
                response: result as any,
                loading: false,
                error: null
            });
        } catch (err) {
            console.log("error", err);
            if (!signal?.aborted) {
                let errorMessage = 'Ошибка загрузки';

                if (typeof err === 'object' && err !== null) {
                    if ('message' in err && typeof err.message === 'string') {
                        errorMessage = err.message;
                        console.log("errorMessage:", errorMessage);
                    }
                } else if (typeof err === 'string') {
                    errorMessage = err;
                    console.log("errorMessage_err:", errorMessage);
                }

                setState({
                    response: null as any,
                    loading: false,
                    error: errorMessage
                });
            }
        }
    }, [
        params.type,
        params.type === 'employee' ? params.workerName : null,
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