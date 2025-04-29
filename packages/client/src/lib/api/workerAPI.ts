// packages/client/src/lib/api/workerAPI.ts

import { IWorker } from "shared";
import { ApiListResponse, getAuthHeaders, handleApiError } from "@/lib/utils/apiUtils";
import { BASE_URL } from "@/config";

export const workerAPI = {
    getAllWorkers: async (
        options?: RequestInit
    ): Promise<ApiListResponse<IWorker>> => {
        const response = await fetch(`${BASE_URL}/workers`, {
            headers: getAuthHeaders(),
            credentials: 'include',
            ...options
        });
        return handleApiError<ApiListResponse<IWorker>>(response);
    },

    createWorker: async (workerData: {
        name: string;
        position: string;
        salary_rate: number;
        objectRef?: string | null;
        telegram_username: string;
    }) => {
        const response = await fetch(`${BASE_URL}/workers`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(workerData),
            credentials: 'include'
        });
        return handleApiError(response);
    },

    updateAssignment: async (
        workerId: string,
        payload: { action: 'assign' | 'unassign', userObjectId?: string }
    ) => {
        const response = await fetch(`${BASE_URL}/workers/${workerId}/object`, {
            method: 'PATCH',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            credentials: 'include'
        });
        return handleApiError(response);
    }
};
