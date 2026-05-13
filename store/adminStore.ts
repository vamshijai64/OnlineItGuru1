import { create } from 'zustand';
import { 
    createCourse, CreateCourseData, fetchAdminCategories, fetchAdminCourses, 
    fetchAdminInterviewQuestions, fetchAdminOffers, fetchAdminReviews, 
    fetchAdminCoursesByCategory, fetchAdminCourseSections, updateSectionPositions,
    fetchAdminContentList, fetchAdminContentById, createAdminContent, 
    updateAdminContent, deleteAdminContent, CreateContentData, UpdateContentData, ContentItem,
    fetchAdminUsersList, fetchAdminUserById, createAdminUser, updateAdminUser, deleteAdminUser, CreateUserData, UpdateUserData, UserItem
} from '@/lib/admin-api';
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
    categoryCourses: any[];
    courseSections: any[];
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

    adminContent: ContentItem[];
    contentPagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    } | null;
    currentContentItem: ContentItem | null;

    adminUsers: UserItem[];
    usersPagination: {
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
    fetchCoursesByCategory: (categorySlug: string, page?: number) => Promise<void>;
    fetchCourseSections: (courseId: string) => Promise<void>;
    updateCourseSectionPositions: (courseId: string, positions: {id: string, position: number}[]) => Promise<boolean>;
    
    fetchContentList: (type: string, page?: number, limit?: number, search?: string) => Promise<void>;
    fetchContentById: (type: string, id: string) => Promise<void>;
    createContentItem: (type: string, data: CreateContentData) => Promise<{ success: boolean; message?: string }>;
    updateContentItem: (type: string, id: string, data: UpdateContentData) => Promise<{ success: boolean; message?: string }>;
    deleteContentItem: (type: string, id: string) => Promise<{ success: boolean; message?: string }>;
    
    fetchUsersList: (page?: number, limit?: number, search?: string) => Promise<void>;
    createUserItem: (data: CreateUserData) => Promise<{ success: boolean; message?: string }>;
    updateUserItem: (id: string, data: UpdateUserData) => Promise<{ success: boolean; message?: string }>;
    deleteUserItem: (id: string) => Promise<{ success: boolean; message?: string }>;
    
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
    categoryCourses: [],
    courseSections: [],
    coursePagination: null,
    interviewPagination: null,
    reviewPagination: null,
    adminContent: [],
    contentPagination: null,
    currentContentItem: null,
    adminUsers: [],
    usersPagination: null,

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

    fetchCoursesByCategory: async (categorySlug: string, page = 1) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchAdminCoursesByCategory(categorySlug, page);
            if (response.success) {
                const items = response.data?.items || [];
                const pagination = response.data?.pagination || null;
                set({ 
                    categoryCourses: items, 
                    coursePagination: pagination,
                    isLoading: false 
                });
            }
        } catch (error: any) {
            set({ isLoading: false });
        }
    },

    fetchCourseSections: async (courseId: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchAdminCourseSections(courseId);
            if (response.success) {
                set({ 
                    courseSections: response.data || [], 
                    isLoading: false 
                });
            }
        } catch (error: any) {
            set({ isLoading: false });
        }
    },

    updateCourseSectionPositions: async (courseId: string, positions: {id: string, position: number}[]) => {
        set({ isLoading: true, error: null });
        try {
            const response = await updateSectionPositions(courseId, positions);
            if (response.success) {
                // Fetch the updated sections
                const updatedResponse = await fetchAdminCourseSections(courseId);
                set({ 
                    courseSections: updatedResponse.data || [], 
                    isLoading: false,
                    successMessage: 'Section positions updated successfully'
                });
                return true;
            }
            throw new Error('Failed to update positions');
        } catch (error: any) {
            set({ isLoading: false, error: error.message });
            return false;
        }
    },

    fetchContentList: async (type: string, page = 1, limit = 10, search?: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchAdminContentList(type, page, limit, search);
            if (response.success) {
                const items = response.data?.items || [];
                const pagination = response.data?.pagination || null;
                set({ 
                    adminContent: items, 
                    contentPagination: pagination,
                    isLoading: false 
                });
            }
        } catch (error: any) {
            set({ isLoading: false });
        }
    },

    fetchContentById: async (type: string, id: string) => {
        set({ isLoading: true, error: null, currentContentItem: null });
        try {
            const response = await fetchAdminContentById(type, id);
            if (response.success) {
                set({ 
                    currentContentItem: response.data || null, 
                    isLoading: false 
                });
            }
        } catch (error: any) {
            set({ isLoading: false });
        }
    },

    createContentItem: async (type: string, data: CreateContentData) => {
        set({ isLoading: true, error: null, successMessage: null });
        try {
            const response = await createAdminContent(type, data);
            if (response.success) {
                set({ isLoading: false, successMessage: response.message || 'Content created successfully' });
                return { success: true, message: response.message };
            }
            throw new Error(response.message || 'Failed to create content');
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

    updateContentItem: async (type: string, id: string, data: UpdateContentData) => {
        set({ isLoading: true, error: null, successMessage: null });
        try {
            const response = await updateAdminContent(type, id, data);
            if (response.success) {
                set({ isLoading: false, successMessage: response.message || 'Content updated successfully' });
                return { success: true, message: response.message };
            }
            throw new Error(response.message || 'Failed to update content');
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

    deleteContentItem: async (type: string, id: string) => {
        set({ isLoading: true, error: null, successMessage: null });
        try {
            const response = await deleteAdminContent(type, id);
            if (response.success) {
                set({ isLoading: false, successMessage: response.message || 'Content deleted successfully' });
                return { success: true, message: response.message };
            }
            throw new Error(response.message || 'Failed to delete content');
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

    fetchUsersList: async (page = 1, limit = 10, search?: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchAdminUsersList(page, limit, search);
            if (response.success) {
                let items = [];
                let pagination = null;
                
                if (Array.isArray(response.data)) {
                    items = response.data;
                } else if (response.data && response.data.items) {
                    items = response.data.items;
                    pagination = response.data.pagination;
                } else if (response.data && response.data.users) {
                    items = response.data.users;
                    pagination = response.data.pagination || null;
                }
                
                set({ 
                    adminUsers: items, 
                    usersPagination: pagination,
                    isLoading: false 
                });
            }
        } catch (error: any) {
            set({ isLoading: false });
        }
    },

    createUserItem: async (data: CreateUserData) => {
        set({ isLoading: true, error: null, successMessage: null });
        try {
            const response = await createAdminUser(data);
            if (response.success) {
                set({ isLoading: false, successMessage: response.message || 'User created successfully' });
                return { success: true, message: response.message };
            }
            throw new Error(response.message || 'Failed to create user');
        } catch (error: any) {
            let message = 'An unexpected error occurred';
            if (axios.isAxiosError(error) && error.response) {
                message = error.response.data?.message || message;
                if (error.response.data?.details && Array.isArray(error.response.data.details)) {
                    const detailMessages = error.response.data.details.map((d: any) => `${d.path}: ${d.message}`).join('\n');
                    message = `${message}:\n${detailMessages}`;
                }
            } else if (error instanceof Error) {
                message = error.message;
            }
            set({ error: message, isLoading: false });
            return { success: false, message };
        }
    },

    updateUserItem: async (id: string, data: UpdateUserData) => {
        set({ isLoading: true, error: null, successMessage: null });
        try {
            const response = await updateAdminUser(id, data);
            if (response.success) {
                set({ isLoading: false, successMessage: response.message || 'User updated successfully' });
                return { success: true, message: response.message };
            }
            throw new Error(response.message || 'Failed to update user');
        } catch (error: any) {
            let message = 'An unexpected error occurred';
            if (axios.isAxiosError(error) && error.response) {
                message = error.response.data?.message || message;
                if (error.response.data?.details && Array.isArray(error.response.data.details)) {
                    const detailMessages = error.response.data.details.map((d: any) => `${d.path}: ${d.message}`).join('\n');
                    message = `${message}:\n${detailMessages}`;
                }
            } else if (error instanceof Error) {
                message = error.message;
            }
            set({ error: message, isLoading: false });
            return { success: false, message };
        }
    },

    deleteUserItem: async (id: string) => {
        set({ isLoading: true, error: null, successMessage: null });
        try {
            const response = await deleteAdminUser(id);
            if (response.success) {
                set({ isLoading: false, successMessage: response.message || 'User deleted successfully' });
                return { success: true, message: response.message };
            }
            throw new Error(response.message || 'Failed to delete user');
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

    clearMessages: () => set({ error: null, successMessage: null })
}));
