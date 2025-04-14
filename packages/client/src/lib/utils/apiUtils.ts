// packages/client/src/lib/utils/apiUtils.ts
export interface ApiErrorResponse {
    success: boolean;
    message: string;
    details?: Record<string, unknown>;
    suggestion?: string;
}


export interface ApiListResponse<T> {
    data: T[];
    total: number;
}

export const getAuthHeaders = (): HeadersInit => {
    const token = typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;

    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const handleApiError = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        try {
            const errorData: ApiErrorResponse = await response.json();
            console.error('Ошибка API:', errorData);

            let errorMessage = errorData.message || `HTTP Ошибка ${response.status}`;

            if (errorData.details) {
                errorMessage += `\nДетали: ${JSON.stringify(errorData.details, null, 2)}`;
            }

            if (errorData.suggestion) {
                errorMessage += `\nРекомендация: ${errorData.suggestion}`;
            }

            throw new Error(errorMessage);
        } catch (error) {
            console.error('Не удалось разобрать ответ с ошибкой:', error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('Не удалось обработать ошибку сервера');
        }
    }
    return await response.json(); // Добавлен await
};