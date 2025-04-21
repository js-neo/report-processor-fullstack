// packages/client/src/stores/authStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { getAuthToken, clearAuthToken } from '@/services/authService';
import { ClientManager } from 'shared';

type AuthState = {
    user: ClientManager | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    lastCheck: number;
};

type AuthActions = {
    checkAuth: () => Promise<ClientManager | null>;
    refreshAuth: () => Promise<ClientManager | null>;
    setUser: (user: ClientManager | null) => void;
    clearAuth: () => void;
};

const initialState: AuthState = {
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
    lastCheck: 0,
};

export const useAuthStore = create<AuthState & AuthActions>()(
    devtools(
        persist(
            (set, get) => ({
                ...initialState,

                checkAuth: async (): Promise<ClientManager | null> => {
                    try {
                        const currentState = get();

                        if (Date.now() - currentState.lastCheck < 2000) {
                            return currentState.user;
                        }

                        set({ loading: true, error: null, lastCheck: Date.now() });

                        const token = getAuthToken();
                        if (!token) {
                            set({ ...initialState, loading: false });
                            return null;
                        }

                        console.log('Starting auth check...');
                        const userData = await fetchUserData(token);

                        set({
                            user: userData,
                            loading: false,
                            isAuthenticated: true,
                        });
                        return userData;
                    } catch (err) {
                        console.error('Auth error:', err);
                        set({
                            ...initialState,
                            loading: false,
                            error: err instanceof Error ? err.message : 'Authentication failed',
                        });
                        return null;
                    }
                },

                refreshAuth: async (): Promise<ClientManager | null> => {
                    console.log('Refreshing auth...');
                    return get().checkAuth();
                },

                setUser: (user: ClientManager | null) => {
                    set({
                        user,
                        isAuthenticated: !!user,
                    });
                },

                clearAuth: () => {
                    clearAuthToken();
                    set(initialState);
                },
            }),
            {
                name: 'auth-storage',
                partialize: (state) => ({
                    user: state.user,
                    isAuthenticated: state.isAuthenticated
                })
            }
        )
    )
);

async function fetchUserData(token: string): Promise<ClientManager> {
    console.log('Fetching user data...');
    const response = await fetch('/api/auth/me', {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (response.status === 401) {
        clearAuthToken();
        throw new Error('Session expired');
    }

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Auth request failed');
    }

    const data = await response.json();

    if (!data?.managerId) {
        throw new Error('Invalid user data structure');
    }

    return {
        managerId: data.managerId,
        fullName: data.fullName,
        telegram_username: data.telegram_username,
        position: data.position,
        phone: data.phone,
        objectRef: data.objectRef ? data.objectRef  : null,
        role: data.role || 'manager'
    };
}