// packages/client/src/lib/api.ts

import {EmployeeReportsResponse, IObject, IReport, ObjectReportResponse} from "shared";
import {getAuthHeaders, handleApiError, ApiListResponse} from "@/lib/utils/apiUtils";
import {BASE_URL} from "@/config";

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
    return handleApiError(response);
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

export const fetchUnfilledReports = async (objectId: string): Promise<IReport[]> => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/reports/unfilled?objectId=${objectId}`
        );

        return handleApiError(response);
    } catch (error) {
        console.error('Error fetching unfilled reports:', error);
        throw error;
    }
};

export type { ApiListResponse };