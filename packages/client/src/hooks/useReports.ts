// packages/client/src/hooks/useReports.ts

"use client";

import { useEffect, useState, useCallback, useMemo } from 'react';
import {
    fetchEmployeeReports,
    fetchObjectReport,
    fetchObjects,
    fetchWorkers
} from '@/lib/api';
import {EmployeeReportsResponse, IObject, IWorker, ObjectReportResponse} from "shared";

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

type ReportState<T extends ReportParams> =
    T extends { type: 'employee' } ? { response: EmployeeReportsResponse | null; loading: boolean; error: string | null } :
        T extends { type: 'object' } ? { response: ObjectReportResponse | null; loading: boolean; error: string | null } :
            never;

export const useReports = <T extends ReportParams>(params: T): ReportState<T> => {
    const { type, startDate, endDate } = params;

    const { workerName, objectName } = useMemo(() => {
        if (type === 'employee') {
            return {
                workerName: (params as Extract<T, { type: 'employee' }>).workerName,
                objectName: undefined
            };
        }
        return {
            workerName: undefined,
            objectName: (params as Extract<T, { type: 'object' }>).objectName
        };
    }, [type, params]);

    const primaryIdentifier = useMemo(
        () => type === 'employee' ? workerName : objectName,
        [type, workerName, objectName]
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

export const useWorkers = () => {
    const [workers, setWorkers] = useState<IWorker[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetchWorkers();
                setWorkers(response.data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message || 'Ошибка загрузки данных');
                } else {
                    setError('Ошибка загрузки данных');
                }
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return { workers, loading, error };
};

export const useObjects = () => {
    const [objects, setObjects] = useState<IObject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetchObjects();
                setObjects(response.data);
                console.log("objects_hook: ", response.data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message || 'Ошибка загрузки данных');
                } else {
                    setError('Ошибка загрузки данных');
                }
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return { objects, loading, error };
};