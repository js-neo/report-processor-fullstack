// client/src/lib/api.ts

import { IReport } from '@shared/types/report';
import { ObjectReport } from '@/interfaces/object.interface';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const defaultHeaders = {
    'Content-Type': 'application/json',
};

const handleError = async (response: Response) => {
    if (!response.ok) {
        try {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        } catch (e) {
            throw new Error(`Request failed: ${response.statusText}`);
        }
    }
    return response;
};

export const fetchEmployeeReports = async (
    username: string,
    startDate: string,
    endDate: string,
    options?: RequestInit
): Promise<IReport[]> => {
    const params = new URLSearchParams({ start: startDate, end: endDate });

    const response = await fetch(
        `${BASE_URL}/reports/user/${encodeURIComponent(username)}?${params}`,
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
): Promise<ObjectReport> => {
    const params = new URLSearchParams({ start: startDate, end: endDate });

    const response = await fetch(
        `${BASE_URL}/reports/object/${encodeURIComponent(objectName)}?${params}`,
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
): Promise<IReport[]> => {
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