// client/src/services/authService.ts

const API_TIMEOUT = 10000;

export const getAuthToken = () => {
    return document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1];
};

const fetchWithTimeout = async (url: string, options: RequestInit = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (err) {
        clearTimeout(timeoutId);
        throw err;
    }
};

export const signIn = async (email: string, password: string) => {
    try {
        const response = await fetchWithTimeout('/api/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({email, password}),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Ошибка авторизации');
        }
        console.log("data_service: ", data);
        if (data.accessToken) {
            console.log("accessToken: ", data.accessToken);
            localStorage.setItem('accessToken', data.accessToken);
        }

        return data;
    } catch (err) {
        let errorMessage = 'Ошибка соединения';

        if (err instanceof Error) {
            errorMessage = err.name === 'AbortError'
                ? 'Превышено время ожидания ответа сервера'
                : err.message;
        }

        throw new Error(errorMessage);
    }
};

export const logout = () => {

    localStorage.removeItem('accessToken');

    document.cookie = 'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = '/auth/login';
};

/*
export const refreshToken = async () => {
    try {
        const response = await fetchWithTimeout('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include'
        });
    } catch (err) {

    }
};
*/