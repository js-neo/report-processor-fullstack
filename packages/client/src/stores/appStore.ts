// packages/client/src/stores/appStore.ts

import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import {
    getAuthToken,
    setAuthToken as setServiceAuthToken,
    clearAuthToken as clearServiceAuthToken
} from '@/services/authService';
import { ClientManager } from 'shared';

type AuthState = {
    user: ClientManager | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
};

type AuthActions = {
    initialize: () => Promise<void>;
    login: (user: ClientManager, token: string) => void;
    logout: () => void;
    clearError: () => void;
    refreshUser: () => Promise<void>;
};

type AuthStore = AuthState & {
    actions: AuthActions;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
    user: null,
    token: null,
    isLoading: false,
    error: null,

    actions: {
        initialize: async () => {
            try {
                set({ isLoading: true, error: null });
                const token = getAuthToken();

                if (!token) {
                    set({ user: null, token: null, isLoading: false });
                    return;
                }

                const user = await fetchUserData(token);
                set({ user, token, isLoading: false });
            } catch (error) {
                set({
                    error: error instanceof Error ? error.message : 'Authentication failed',
                    isLoading: false
                });
                get().actions.logout();
            }
        },

        login: (user, token) => {
            set({ user, token, error: null });
            setServiceAuthToken(token);
        },

        logout: () => {
            set({ user: null, token: null });
            clearServiceAuthToken();
            window.location.href = '/auth/login';
        },

        clearError: () => set({ error: null }),

        refreshUser: async () => {
            const { token, user: currentUser } = get();
            if (!token || !currentUser) return;

            try {
                const response = await fetch("/api/auth/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to refresh');
                }
                const newUserData = await response.json();

                set({ user: {
                    ...currentUser,
                    ...newUserData,
                    objectRef: newUserData.objectRef ?? currentUser.objectRef
                    }, isLoading: false });
            } catch (error) {
                set({
                    error: error instanceof Error ? error.message : 'Failed to refresh user',
                    isLoading: false
                });
            }
        }
    }
}));

export const useUser = () => useAuthStore(useShallow(state => state.user));
export const useAuthToken = () => useAuthStore(useShallow(state => state.token));
export const useAuthLoading = () => useAuthStore(state => state.isLoading);
export const useAuthError = () => useAuthStore(useShallow(state => state.error));
export const useIsAuthenticated = () =>
    useAuthStore(useShallow(state => !!state.token && !!state.user));
export const useAuthActions = () => useAuthStore(useShallow(state => state.actions));

export const useAuthState = () => {
    return useAuthStore(
        useShallow((state) => ({
            user: state.user,
            token: state.token,
            isLoading: state.isLoading,
            error: state.error
        }))
    );
};

const fetchUserData = async (token: string): Promise<ClientManager> => {
    try {
        const response = await fetch('/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Session expired');
            }
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch user data');
        }

        const data = await response.json();

        return {
            managerId: data.managerId,
            fullName: data.fullName,
            telegram_username: data.telegram_username,
            position: data.position,
            phone: data.phone,
            objectRef: data.objectRef ?? null,
            role: data.role
        };
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        throw error;
    }
};