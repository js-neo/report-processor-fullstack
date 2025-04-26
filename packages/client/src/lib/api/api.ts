// packages/client/src/lib/api.ts

import {EmployeeReportsResponse, IObject, IReport, ObjectReportResponse} from "shared";
import {getAuthHeaders, handleApiError, ApiListResponse} from "@/lib/utils/apiUtils";
import {BASE_URL} from "@/config";

export const fetchEmployeeReports = async (
    workerId: string,
    startDate: string,
    endDate: string,
    options?: RequestInit
): Promise<EmployeeReportsResponse> => {
    const params = new URLSearchParams({
        start: startDate,
        end: endDate
    });

    const response = await fetch(
        `${BASE_URL}/reports/workers/${decodeURIComponent(workerId)}/period?${params}`,
        {
            headers: getAuthHeaders(),
            ...options
        }
    );
    return handleApiError(response);
};

export const fetchObjectReport = async (
    objectId: string,
    startDate: string,
    endDate: string,
    options?: RequestInit
): Promise<ObjectReportResponse> => {
    const params = new URLSearchParams({
        start: startDate,
        end: endDate
    });

    const response = await fetch(
        `${BASE_URL}/reports/objects/${decodeURIComponent(objectId)}/period?${params}`,
        {
            headers: getAuthHeaders(),
            ...options
        }
    );

    return handleApiError(response);
};


export const fetchObjects = async (
    options?: RequestInit
): Promise<ApiListResponse<IObject>> => {
    const response = await fetch(`${BASE_URL}/objects`, {
        headers: getAuthHeaders(),
        credentials: 'include',
        ...options
    });

    return handleApiError(response);
};

export const fetchReports = async (
    options?: RequestInit
): Promise<EmployeeReportsResponse> => {
    try {
        const response = await fetch(`${BASE_URL}/reports`, {
            headers: getAuthHeaders(),
            ...options
        });

        return handleApiError(response);
    } catch (error) {
        console.error('Fetch reports error:', error);
        throw error;
    }
};

export const fetchAllReports = async (
    params: {
        objectId: string;
        startDate?: string;
        endDate?: string;
        page?: string;
        limit?: string;
        sort?: 'asc' | 'desc';
        status?: 'all' | 'filled' | 'unfilled' | 'task' | 'workers' | 'time';
    },
    fetchOptions?: RequestInit & { signal?: AbortSignal }
): Promise<ApiListResponse<IReport>> => {
    try {
        const { objectId, ...options } = params;
        const queryParams = new URLSearchParams();

        Object.entries(options).forEach(([key, value]) => {
            if (value !== undefined) {
                queryParams.append(key, value);
            }
        });

        const url = `${BASE_URL}/reports/edit/${encodeURIComponent(objectId)}/period?${queryParams.toString()}`;
        const response = await fetch(url, {
            headers: getAuthHeaders(),
            ...fetchOptions,
            signal: fetchOptions?.signal
        });

        const responseData = await handleApiError<{
            success: boolean;
            data: IReport[];
            pagination: {
                page: number;
                limit: number;
                totalPages: number;
            };
            total: number;
        }>(response);

        return {
            data: responseData.data,
            total: responseData.total,
            page: responseData.pagination.page,
            limit: responseData.pagination.limit,
            totalPages: responseData.pagination.totalPages
        };
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                console.log('Request was aborted');
                throw error;
            }
            console.error('Error fetching edit reports:', error.message);
            throw new Error(`Failed to fetch reports: ${error.message}`);
        }
        console.error('Unknown error fetching reports:', error);
        throw new Error('Unknown error occurred while fetching reports');
    }
};

export const updateReport = async (
    reportId: string,
    data: {
        task?: string | null;
        workers?: Array<{ workerId: string; name: string }> | null;
        time?: number | null;
    },
    options?: RequestInit
): Promise<IReport> => {

    try {
        const response = await fetch(`${BASE_URL}/reports/${reportId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify({
                analysis: data
            }),
            ...options
        });

        const responseData = await handleApiError<{ data: IReport }>(response);
        return responseData.data;
    } catch (error) {
        console.error('Error updating report:', error);
        throw error;
    }
};

export type { ApiListResponse };