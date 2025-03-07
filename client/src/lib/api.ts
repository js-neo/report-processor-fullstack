// client/src/lib/api.ts

import { EmployeeReportsResponse, ObjectReportResponse } from "@shared/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const defaultHeaders = {
    'Content-Type': 'application/json',
};

interface ApiErrorResponse {
    success: boolean;
    message: string;
    details?: Record<string, any>;
    suggestion?: string;
}
function isError(error: unknown): error is { message: string } {
    return typeof error === 'object' && error !== null && 'message' in error;
}

const handleError = async (response: Response): Promise<Response> => {
    if (!response.ok) {
        try {
            const errorData: ApiErrorResponse = await response.json();
            console.error('API Error:', errorData);

            let errorMessage = errorData.message || `HTTP error! Status: ${response.status}`;
            if (errorData.details) {
                errorMessage += `\nDetails: ${JSON.stringify(errorData.details, null, 2)}`;
            }
            if (errorData.suggestion) {
                errorMessage += `\nSuggestion: ${errorData.suggestion}`;
            }

            throw new Error(errorMessage);
        } catch (e) {
            console.error('Failed to parse error response:', e);

            // type guard для проверки
            if (isError(e)) {
                throw new Error(`Request failed: ${e.message}`);
            } else {
                throw new Error(`Request failed: Unknown error occurred`);
            }
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
    const params = new URLSearchParams({ start: startDate, end: endDate });

    const response = await fetch(
        `${BASE_URL}/reports/workers/${encodeURIComponent(workerName)}/period?${params}`,
        {
            headers: defaultHeaders,
            ...options
        }
    );

    await handleError(response);
    return response.json();
};

export const fetchObjectReport = async (
    objectName: string,
    startDate: string,
    endDate: string,
    options?: RequestInit
): Promise<ObjectReportResponse> => {
    const params = new URLSearchParams({ start: startDate, end: endDate });

    const response = await fetch(
        `${BASE_URL}/reports/objects/${encodeURIComponent(objectName)}/period?${params}`,
        {
            headers: defaultHeaders,
            ...options
        }
    );

    await handleError(response);
    return response.json();
};

export const fetchReports = async (
    options?: RequestInit
): Promise<EmployeeReportsResponse> => {
    try {
        const response = await fetch(`${BASE_URL}/reports`, {
            headers: defaultHeaders,
            ...options
        });

        await handleError(response);
        return await response.json();
    } catch (error) {
        console.error('Fetch reports error:', error);
        throw error;
    }
};