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

export const fetchUnfilledReports = async (
    objectId: string,
    options?: {
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
        sort?: 'asc' | 'desc';
        status?: 'task' | 'workers' | 'time' | 'all';
    },
    fetchOptions?: RequestInit
): Promise<ApiListResponse<IReport>> => {
    try {
        const params = new URLSearchParams();

        if (options?.startDate) params.append('start', options.startDate);
        if (options?.endDate) params.append('end', options.endDate);
        if (options?.page) params.append('page', options.page.toString());
        if (options?.limit) params.append('limit', options.limit.toString());
        if (options?.sort) params.append('sort', options.sort);
        if (options?.status) params.append('status', options.status);

        const response = await fetch(
            `${BASE_URL}/reports/unfilled/${encodeURIComponent(objectId)}/period?${params}`,
            {
                headers: getAuthHeaders(),
                ...fetchOptions
            }
        );

        const data = await handleApiError<{
            data: IReport[];
            pagination: {
                total: number;
                page: number;
                limit: number;
                totalPages: number;
            }
        }>(response);

        return {
            data: data.data,
            ...data.pagination
        };
    } catch (error) {
        console.error('Error fetching unfilled reports:', error);
        throw error;
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