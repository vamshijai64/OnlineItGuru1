import { create } from 'zustand';
import { createCourse, CreateCourseData, fetchAdminCategories, fetchAdminCourses, fetchAdminInterviewQuestions, fetchAdminOffers, fetchAdminReviews } from '@/lib/admin-api';
import axios from 'axios';

interface AdminState {
    isLoading: boolean;
    error: string | null;
    successMessage: string | null;
    adminCategories: any[];
    adminCourses: any[];
    adminOffers: any[];
    adminInterviewQuestions: any[];
    adminReviews: any[];
    coursePagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    } | null;
    interviewPagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    } | null;
    reviewPagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    } | null;
    
    createCourse: (data: CreateCourseData) => Promise<{ success: boolean; message?: string }>;
    fetchCategories: () => Promise<void>;
    fetchAllCourses: (page?: number) => Promise<void>;
    fetchOffers: () => Promise<void>;
    fetchInterviewQuestions: (page?: number) => Promise<void>;
    fetchReviews: (page?: number) => Promise<void>;
    clearMessages: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
    isLoading: false,
    error: null,
    successMessage: null,
    adminCategories: [],
    adminCourses: [],
    adminOffers: [],
    adminInterviewQuestions: [],
    adminReviews: [],
    coursePagination: null,
    interviewPagination: null,
    reviewPagination: null,

    createCourse: async (data: CreateCourseData) => {
        set({ isLoading: true, error: null, successMessage: null });
        try {
            const response = await createCourse(data);
            if (response.success) {
                set({ isLoading: false, successMessage: response.message || 'Course created successfully' });
                return { success: true, message: response.message };
            }
            throw new Error(response.message || 'Failed to create course');
        } catch (error: any) {
            let message = 'An unexpected error occurred';
            if (axios.isAxiosError(error) && error.response) {
                message = error.response.data?.message || message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            set({ error: message, isLoading: false });
            return { success: false, message };
        }
    },

    fetchCategories: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchAdminCategories();
            if (response.success) {
                set({ adminCategories: response.data || [], isLoading: false });
            }
        } catch (error: any) {
            set({ isLoading: false });
        }
    },

    fetchAllCourses: async (page = 1) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchAdminCourses(page);
            if (response.success) {
                // Handle the data structure with items and pagination
                const items = response.data?.items || [];
                const pagination = response.data?.pagination || null;
                    
                set({ 
                    adminCourses: items, 
                    coursePagination: pagination,
                    isLoading: false 
                });
            }
        } catch (error: any) {
            set({ isLoading: false });
        }
    },

    fetchOffers: async () => {
        set({ isLoading: true, error: null });
        try {
            // If the endpoint doesn't exist yet, we'll use mock data as fallback
            const response = await fetchAdminOffers();
            if (response.success) {
                set({ adminOffers: response.data || [], isLoading: false });
            }
        } catch (error: any) {
            // Mock data fallback for development
            const mockOffers = [
                { id: 1, price: 12000, live_price: 9999, from_date: '2026-04-01', to_date: '2026-04-30', message: 'April Special Discount' },
                { id: 2, price: 15000, live_price: 11000, from_date: '2026-05-01', to_date: '2026-05-15', message: 'Early Bird Summer Offer' }
            ];
            set({ adminOffers: mockOffers, isLoading: false });
        }
    },

    fetchInterviewQuestions: async (page = 1) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchAdminInterviewQuestions(page);
            if (response.success) {
                const items = response.data?.items || [];
                const pagination = response.data?.pagination || null;
                set({ 
                    adminInterviewQuestions: items, 
                    interviewPagination: pagination,
                    isLoading: false 
                });
            }
        } catch (error: any) {
            set({ isLoading: false });
        }
    },

    fetchReviews: async (page = 1) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchAdminReviews(page);
            if (response.success) {
                const items = response.data?.items || [];
                const pagination = response.data?.pagination || null;
                set({ 
                    adminReviews: items, 
                    reviewPagination: pagination,
                    isLoading: false 
                });
            }
        } catch (error: any) {
            set({ isLoading: false });
        }
    },

    clearMessages: () => set({ error: null, successMessage: null })
}));
