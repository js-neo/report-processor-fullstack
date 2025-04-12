// packages/client/src/stores/appStore.ts

import {create} from "zustand"
import {setAuthToken, clearAuthToken, getAuthToken} from "@/services/authService";
import {fetchUserData} from "@/hooks/useAuth";
import {ClientManager} from "shared";

type AuthState = {
    user: ClientManager | null;
    token: string | null;
    isAuth: boolean;
};

type AuthActions = {
    checkAuth: () => Promise<void>;
    login: (user: ClientManager | null, token: string) => void;
    logout: () => void;
};

export const useStore = create<AuthState & AuthActions>((set) => ({
    isAuth: false,
    user: null,
    token: null,
    login: (user, token) => {
        set({isAuth: true, user, token});
        setAuthToken(token);
    },
    logout: () => {
        set({isAuth: false, user: null, token: null});
        clearAuthToken();
    },
    checkAuth: async () => {
        const token = getAuthToken();
        if (token) {
            const user = await fetchUserData(token);
            if (user) {
                set({isAuth: true, user, token});
                setAuthToken(token);
            } else {
                set({isAuth: false, user: null, token: null});
                clearAuthToken();
            }
        } else {
            set({isAuth: false, user: null, token: null});
        }
    }
}));