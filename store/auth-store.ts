import { create } from 'zustand';
import { registerUser, loginUser, fetchUserProfile, RegisterUserData, LoginUserData, UserResponse } from '../lib/auth-api';
import axios from 'axios';

interface AuthState {
    user: UserResponse | null;
    isLoading: boolean;
    error: string | null;
    register: (data: RegisterUserData) => Promise<{ success: boolean; message?: string }>;
    login: (data: LoginUserData) => Promise<{ success: boolean; message?: string }>;
    fetchProfile: (id: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: false,
    error: null,

    register: async (data: RegisterUserData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await registerUser(data);
            if (response.success && response.user) {
                set({ user: response.user, isLoading: false });
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
            if (response.success && response.user) {
                set({ user: response.user, isLoading: false });
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

    fetchProfile: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchUserProfile(id);
            if (response.success && response.user) {
                set({ user: response.user, isLoading: false });
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
        set({ user: null, error: null });
    }
}));
