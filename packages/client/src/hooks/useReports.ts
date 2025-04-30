// packages/client/src/hooks/useReports.ts

"use client";

import { useEffect, useState, useCallback, useMemo } from 'react';
import {
    fetchEmployeeReports,
    fetchObjectReport
} from '@/lib/api';
import {EmployeeReportsResponse, ObjectReportResponse} from "shared";

type ReportParams =
    | {
    type: 'employee';
    workerId: string;
    startDate: string;
    endDate: string;
}
    | {
    type: 'object';
    objectId: string;
    startDate: string;
    endDate: string;
};

type ReportState<T extends ReportParams> =
    T extends { type: 'employee' } ?
        { response: EmployeeReportsResponse | null; loading: boolean; error: string | null } :
        T extends { type: 'object' } ?
            { response: ObjectReportResponse | null; loading: boolean; error: string | null } :
            never;

export const useReports = <T extends ReportParams>(params: T): ReportState<T> => {
    const { type, startDate, endDate } = params;

    const { workerId, objectId } = useMemo(() => {
        if (type === 'employee') {
            return {
                workerId: (params as Extract<T, { type: 'employee' }>).workerId,
                objectId: undefined
            };
        }
        return {
            workerId: undefined,
            objectId: (params as Extract<T, { type: 'object' }>).objectId
        };
    }, [type, params]);

    const primaryIdentifier = useMemo(
        () => type === 'employee' ? workerId : objectId,
        [type, workerId, objectId]
    );

    const [state, setState] = useState<{
        response: EmployeeReportsResponse | ObjectReportResponse | null;
        loading: boolean;
        error: string | null;
    }>({
        response: null,
        loading: true,
        error: null,
    });

    const loadData = useCallback(async (signal?: AbortSignal) => {
        try {
            if (!primaryIdentifier) {
                throw new Error('Не указан идентификатор для запроса');
            }

            setState(prev => ({
                ...prev,
                loading: true,
                error: null
            }));

            const result = type === 'employee'
                ? await fetchEmployeeReports(
                    primaryIdentifier,
                    startDate,
                    endDate,
                    { signal }
                )
                : await fetchObjectReport(
                    primaryIdentifier,
                    startDate,
                    endDate,
                    { signal }
                );

            setState({
                response: result,
                loading: false,
                error: null
            });
        } catch (err) {
            if (signal?.aborted) return;

            const errorMessage = err instanceof Error
                ? err.message
                : 'Неизвестная ошибка при загрузке данных';

            setState({
                response: null,
                loading: false,
                error: errorMessage
            });
        }
    }, [
        type,
        primaryIdentifier,
        startDate,
        endDate
    ]);

    const effectDependencies = useMemo(() => ({
        type,
        primaryIdentifier,
        startDate,
        endDate
    }), [type, primaryIdentifier, startDate, endDate]);

    useEffect(() => {
        const abortController = new AbortController();

        if (primaryIdentifier) {
            loadData(abortController.signal);
        } else {
            setState({
                response: null,
                loading: false,
                error: 'Отсутствуют параметры для запроса'
            });
        }

        return () => abortController.abort();
    }, [effectDependencies, loadData, primaryIdentifier]);

    return state as ReportState<T>;
};




