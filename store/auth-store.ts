import { create } from 'zustand';
import { registerUser, loginUser, loginAdmin, fetchUserProfile, RegisterUserData, LoginUserData, UserResponse } from '../lib/auth-api';
import axios from 'axios';

interface AuthState {
    user: UserResponse | null;
    isLoading: boolean;
    error: string | null;
    register: (data: RegisterUserData) => Promise<{ success: boolean; message?: string }>;
    login: (data: LoginUserData) => Promise<{ success: boolean; message?: string }>;
    loginAdmin: (data: LoginUserData) => Promise<{ success: boolean; message?: string }>;
    fetchProfile: (id: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
}

const TOKEN_KEY = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY ?? 'oit_auth_token';

const setAuthToken = (token: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
        document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=86400; SameSite=Lax`;
    }
};

const removeAuthToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
    }
};


export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: false,
    error: null,

    register: async (data: RegisterUserData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await registerUser(data);
            if (response.success && response.data) {
                const { user, token } = response.data;
                setAuthToken(token);
                set({ user: user, isLoading: false });
                return { success: true, message: response.message };
            }
            throw new Error(response.message || 'Registration failed');
        } catch (error: any) {
            let message = 'An unexpected error occurred during registration';
            if (axios.isAxiosError(error) && error.response) {
                message = error.response.data?.message || message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            set({ error: message, isLoading: false });
            return { success: false, message };
        }
    },

    login: async (data: LoginUserData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await loginUser(data);
            if (response.success && response.data) {
                const { user, token } = response.data;
                setAuthToken(token);
                set({ user: user, isLoading: false });
                return { success: true, message: response.message };
            }
            throw new Error(response.message || 'Login failed');
        } catch (error: any) {
            let message = 'An unexpected error occurred during login';
            if (axios.isAxiosError(error) && error.response) {
                message = error.response.data?.message || message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            set({ error: message, isLoading: false });
            return { success: false, message };
        }
    },

    loginAdmin: async (data: LoginUserData) => {
        set({ isLoading: true, error: null });
        
        try {
            const response = await loginAdmin(data);
            if (response.success && response.data) {
                const { user, token } = response.data;
                setAuthToken(token);
                set({ user: user, isLoading: false });
                return { success: true, message: response.message };
            }
            throw new Error(response.message || 'Admin login failed');
        } catch (error: any) {
            let message = 'An unexpected error occurred during admin login';
            if (axios.isAxiosError(error) && error.response) {
                message = error.response.data?.message || message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            set({ error: message, isLoading: false });
            return { success: false, message };
        }
    },

    fetchProfile: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchUserProfile(id);
            if (response.success && response.data) {
                set({ user: response.data.user, isLoading: false });
                return { success: true, message: response.message };
            }
            throw new Error(response.message || 'Failed to fetch profile');
        } catch (error: any) {
            let message = 'An unexpected error occurred while fetching profile';
            if (axios.isAxiosError(error) && error.response) {
                message = error.response.data?.message || message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            set({ error: message, isLoading: false });
            return { success: false, message };
        }
    },

    logout: () => {
        removeAuthToken();
        set({ user: null, error: null });
    }
}));
