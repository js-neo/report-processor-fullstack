// packages/client/src/lib/api/workerAPI.ts

import {IWorker} from "shared";
import {ApiListResponse, getAuthHeaders, handleApiError} from "@/lib/utils/apiUtils";
import {BASE_URL} from "@/config";


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
    updateAssignment: async (
        workerId: string, payload: {action: 'assign' | 'unassign', userObjectId?: string}) => {
            const response = await fetch(`${BASE_URL}/workers/${workerId}/object`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload),
            });
            return handleApiError(response);
        }
}

