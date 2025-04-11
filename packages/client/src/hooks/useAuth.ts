// packages/client/src/hooks/useAuth.ts

"use client";

import { useCallback, useEffect, useState } from 'react';
import { getAuthToken, clearAuthToken } from '@/services/authService';
import { useRouter } from 'next/navigation';
import { ClientManager } from "shared";

type AuthUser = ClientManager;

interface UseAuthResult {
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
    refreshAuth: () => Promise<void>;
    isAuthenticated: boolean;
}

export const fetchUserData = async (token: string): Promise<AuthUser> => {
    const response = await fetch('/api/auth/me', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (response.status === 401) {
        clearAuthToken();
        throw new Error('Session expired. Please login again');
    }

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!data?.managerId) {
        throw new Error('Invalid user data format');
    }

    if (!data.objectRef || typeof data.objectRef !== 'object') {
        data.objectRef = null;
    }

    return {
        managerId: data.managerId,
        fullName: data.fullName,
        telegram_username: data.telegram_username,
        objectRef: data.objectRef ?? null,
        role: data.role
    };
};

export const useAuth = (): UseAuthResult => {
    const router = useRouter();
    const [state, setState] = useState<{
        user: AuthUser | null;
        loading: boolean;
        error: string | null;
    }>({
        user: null,
        loading: true,
        error: null,
    });


    const checkAuth = useCallback(async (): Promise<void> => {
        try {
            setState(prev => ({ ...prev, loading: true }));

            const token = getAuthToken();
            if (!token) {
                setState({ user: null, loading: false, error: null });
                return;
            }

            const userData = await fetchUserData(token);
            setState({
                user: userData,
                loading: false,
                error: null
            });

        } catch (err) {
            console.error('Auth error:', err);
            clearAuthToken();
            setState({
                user: null,
                loading: false,
                error: err instanceof Error ? err.message : 'Authentication failed'
            });
        }
    }, []);

    const refreshAuth = useCallback(async (): Promise<void> => {
        await checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        let isActive = true;

        (async () => {
            try {
                await checkAuth();
            } catch (error) {
                if (isActive) {
                    console.error('Auth initialization error:', error);
                }
            }
        })();

        return () => {
            isActive = false;
        };
    }, [checkAuth]);

    useEffect(() => {
        if (!state.loading && !state.user && !state.error) {
            const currentPath = window.location.pathname;
            if (!currentPath.startsWith('/auth')) {
                router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
            }
        }
    }, [state.user, state.loading, state.error, router]);

    return {
        user: state.user,
        loading: state.loading,
        error: state.error,
        refreshAuth,
        isAuthenticated: !!state.user,
    };
};