import {ApiListResponse, getAuthHeaders, handleApiError} from "@/lib/utils/apiUtils";
import {IObject} from "shared";
import {BASE_URL} from "@/config";

export const objectAPI = {
    fetchObjects: async (
        options?: RequestInit
    ): Promise<ApiListResponse<IObject>> => {
        const response = await fetch(`${BASE_URL}/objects`, {
            headers: getAuthHeaders(),
            credentials: 'include',
            ...options
        });

        return handleApiError(response);
    },
    createObject: async (objectData: {
        name: string;
        address: string;
    }) => {
        const response = await fetch(`${BASE_URL}/objects`, {
            method: 'POST',
            headers: {...getAuthHeaders(), 'Content-Type': 'application/json'},
            body: JSON.stringify(objectData),
            credentials: 'include'
        });
        return handleApiError(response);
    }
}
