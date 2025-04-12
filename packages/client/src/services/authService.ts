// packages/client/src/services/authService.ts

const API_TIMEOUT = 10000;

interface SignInParams {
    telegram_username: string;
    password: string;
}

interface SignUpParams {
    fullName: string;
    telegram_username: string;
    password: string;
    objectRef: string;
}

export const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') return null;

    const cookieToken = document.cookie
        .split('; ')
        .find(row => row.trim().startsWith('accessToken='))
        ?.split('=')[1];

    return cookieToken || localStorage.getItem('accessToken');
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

export const setAuthToken = (token: string): void => {
    if (typeof window === 'undefined') return;

    const cookieOptions = [
        `Path=/`,
        `SameSite=Lax`,
        `Max-Age=86400`,
        process.env.NODE_ENV === 'production' ? 'Secure' : ''
    ].filter(Boolean).join('; ');
    document.cookie = `accessToken=${token}; ${cookieOptions}`;
    localStorage.setItem('accessToken', token);
};

export const clearAuthToken = (): void => {
    if (typeof window === 'undefined') return;

    document.cookie = 'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    localStorage.removeItem('accessToken');
};

export const signIn = async ({ telegram_username, password }: SignInParams) => {
    try {
        const response = await fetchWithTimeout('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ telegram_username, password })
        });

        const data = await response.json();
        console.log("data_service: ", data);

        if (!response.ok) {
            throw new Error(data.message || 'Authentication failed');
        }
        if (data?.data.accessToken) {
            setAuthToken(data?.data.accessToken);
        }

        return data;
    } catch (err) {
        let errorMessage = 'Connection error';
        if (err instanceof Error) {
            errorMessage = err.name === 'AbortError'
                ? 'Server response timeout'
                : err.message;
        }
        throw new Error(errorMessage);
    }
};

export const signUp = async ({ fullName, telegram_username, password, objectRef }: SignUpParams) => {
    try {
        const response = await fetchWithTimeout('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullName,
                telegram_username,
                password,
                objectRef
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        if (data.accessToken) {
            setAuthToken(data.accessToken);
        }

        return data;
    } catch (err) {
        let errorMessage = 'Connection error';
        if (err instanceof Error) {
            errorMessage = err.name === 'AbortError'
                ? 'Server response timeout'
                : err.message;
        }
        throw new Error(errorMessage);
    }
};

export const validateSession = async (): Promise<boolean> => {
    try {
        const token = getAuthToken();
        if (!token) return false;

        const response = await fetchWithTimeout('/api/auth/validate', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.ok;
    } catch (err) {
        console.error('Session validation error:', err);
        return false;
    }
};

export const logout = (): void => {
    clearAuthToken();
    window.location.href = '/auth/login';
};

