// client/src/hooks/useReports.ts

"use client";

import { useEffect, useState, useCallback } from 'react';
import {
    fetchEmployeeReports,
    fetchObjectReport,
    fetchObjects,
    fetchWorkers
} from '@/lib/api';
import { EmployeeReportsResponse, ObjectReportResponse } from "@shared/index";

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

interface Worker {
    _id: string;
    name: string;
    worker_id: string;
}

interface Object {
    _id: string;
    objectName: string;
}

type ReportState<T extends ReportParams> =
    T extends { type: 'employee' } ? { response: EmployeeReportsResponse | null; loading: boolean; error: string | null } :
        T extends { type: 'object' } ? { response: ObjectReportResponse | null; loading: boolean; error: string | null } :
            never;

export const useReports = <T extends ReportParams>(params: T): ReportState<T> => {
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
            setState(prev => ({ ...prev, loading: true, error: null }));

            let result: EmployeeReportsResponse | ObjectReportResponse;

            if (params.type === 'employee') {
                const { workerName, startDate, endDate } = params as Extract<T, { type: 'employee' }>;
                result = await fetchEmployeeReports(
                    workerName,
                    startDate,
                    endDate,
                    { signal }
                );
            } else {
                const { objectName, startDate, endDate } = params as Extract<T, { type: 'object' }>;
                result = await fetchObjectReport(
                    objectName,
                    startDate,
                    endDate,
                    { signal }
                );
            }

            setState({
                response: result,
                loading: false,
                error: null
            });
        } catch (err) {
            if (!signal?.aborted) {
                let errorMessage = 'Ошибка загрузки';
                if (err instanceof Error) errorMessage = err.message;
                else if (typeof err === 'string') errorMessage = err;

                setState({
                    response: null,
                    loading: false,
                    error: errorMessage
                });
            }
        }
    }, [
        params.type,
        params.type === 'employee' ? params.workerName : params.objectName,
        params.startDate,
        params.endDate
    ]);

    useEffect(() => {
        const abortController = new AbortController();
        loadData(abortController.signal);
        return () => abortController.abort();
    }, [loadData]);

    return state as ReportState<T>;
};

export const useWorkers = () => {
    const [workers, setWorkers] = useState<Worker[]>([]);
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
    const [objects, setObjects] = useState<Object[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetchObjects();
                setObjects(response.data);
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