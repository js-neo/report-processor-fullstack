// packages/client/src/lib/api.ts

import { EmployeeReportsResponse, ObjectReportResponse } from "shared";

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ApiErrorResponse {
    success: boolean;
    message: string;
    details?: Record<string, unknown>;
    suggestion?: string;
}

interface ApiListResponse<T> {
    data: T[];
    total: number;
}

interface Worker {
    _id: string;
    name: string;
    workerId: string;
    objectId: string;
    position?: string;
}

interface Object {
    _id: string;
    name: string;
    address?: string;
}

const getAuthHeaders = (): HeadersInit => {
    const token = typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;

    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

const handleError = async (response: Response): Promise<Response> => {
    if (!response.ok) {
        try {
            const errorData: ApiErrorResponse = await response.json();
            console.error('API Error:', errorData);

            let errorMessage = errorData.message || `HTTP Error ${response.status}`;

            if (errorData.details) {
                errorMessage += `\nDetails: ${JSON.stringify(errorData.details, null, 2)}`;
            }

            if (errorData.suggestion) {
                errorMessage += `\nSuggestion: ${errorData.suggestion}`;
            }

            throw new Error(errorMessage);
        } catch (error) {
            console.error('Failed to parse error response:', error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('Не удалось обработать ошибку сервера');
        }
    }
    return response;
};

export const fetchEmployeeReports = async (
    workerName: string,
    startDate: string,
    endDate: string,
    options?: RequestInit
): Promise<EmployeeReportsResponse> => {
    const params = new URLSearchParams({
        start: startDate,
        end: endDate
    });

    const response = await fetch(
        `${BASE_URL}/reports/workers/${decodeURIComponent(workerName)}/period?${params}`,
        {
            headers: getAuthHeaders(),
            ...options
        }
    );

    await handleError(response);
    const data = await response.json();
    console.log("data_Api: ", data);
    return data
};

export const fetchObjectReport = async (
    objectName: string,
    startDate: string,
    endDate: string,
    options?: RequestInit
): Promise<ObjectReportResponse> => {
    const params = new URLSearchParams({
        start: startDate,
        end: endDate
    });

    const response = await fetch(
        `${BASE_URL}/reports/objects/${decodeURIComponent(objectName)}/period?${params}`,
        {
            headers: getAuthHeaders(),
            ...options
        }
    );

    await handleError(response);
    return response.json();
};

export const fetchWorkers = async (
    options?: RequestInit
): Promise<ApiListResponse<Worker>> => {
    const response = await fetch(`${BASE_URL}/workers`, {
        headers: getAuthHeaders(),
        credentials: 'include',
        ...options
    });

    await handleError(response);
    return response.json();
};

export const fetchObjects = async (
    options?: RequestInit
): Promise<ApiListResponse<Object>> => {
    const response = await fetch(`${BASE_URL}/objects`, {
        headers: getAuthHeaders(),
        credentials: 'include',
        ...options
    });

    await handleError(response);
    return response.json();
};

export const fetchReports = async (
    options?: RequestInit
): Promise<EmployeeReportsResponse> => {
    try {
        const response = await fetch(`${BASE_URL}/reports`, {
            headers: getAuthHeaders(),
            ...options
        });

        await handleError(response);
        return response.json();
    } catch (error) {
        console.error('Fetch reports error:', error);
        throw error;
    }
};

export type { Worker, Object, ApiListResponse };