import { create } from 'zustand';
import {
    createCourse, CreateCourseData, CourseRequestData, AdminCourse, fetchAdminCourseById,
    updateAdminCourse, deleteAdminCourse, fetchAdminCategories, createAdminCategory, updateAdminCategory, fetchAdminCourses,
    fetchAdminInterviewQuestions, fetchAdminOffers, fetchAdminReviews,
    fetchAdminCoursesByCategory, updateSectionPositions,
    fetchAdminContentList, fetchAdminContentById, createAdminContent,
    updateAdminContent, deleteAdminContent, CreateContentData, UpdateContentData, ContentItem,
    fetchAdminUsersList, fetchAdminUserById, createAdminUser, updateAdminUser, deleteAdminUser, CreateUserData, UpdateUserData, UserItem,
    fetchAdminReviewById, createAdminReview, updateAdminReview, deleteAdminReview, CreateReviewData, UpdateReviewData, ReviewItem,
    CourseTemplateItem, fetchAdminCourseTemplates, fetchAdminCourseTemplateById, updateAdminCourseTemplate,
    createAdminCourseTemplate, deleteAdminCourseTemplate,
    SectionItem, CreateSectionData, fetchAdminSections, fetchAdminSectionById, createAdminSection, updateAdminSection, deleteAdminSection,
    createAdminCourseSection, updateAdminCourseSection, deleteAdminCourseSection
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
    currentReviewItem: ReviewItem | null;

    adminUsers: UserItem[];
    usersPagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    } | null;

    adminCourseTemplates: CourseTemplateItem[];

    adminSections: SectionItem[];
    sectionsPagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        view: string;
    } | null;

    createCourse: (data: CourseRequestData) => Promise<{ success: boolean; message?: string }>;
    fetchCategories: () => Promise<void>;
    createCategory: (data: { title: string; slug: string; position: number; image?: string; description?: string; categoryId?: string | null }) => Promise<{ success: boolean; message?: string }>;
    updateCategory: (id: string, data: { title?: string; slug?: string; position?: number; image?: string; description?: string }) => Promise<{ success: boolean; message?: string }>;
    fetchAllCourses: (page?: number, limit?: number, search?: string, category?: string) => Promise<void>;
    fetchCourseById: (id: string) => Promise<AdminCourse | null>;
    updateCourse: (id: string, data: CourseRequestData) => Promise<{ success: boolean; message?: string }>;
    deleteCourse: (id: string) => Promise<{ success: boolean; message?: string }>;
    fetchOffers: () => Promise<void>;
    fetchInterviewQuestions: (page?: number) => Promise<void>;
    fetchReviews: (page?: number, limit?: number, search?: string) => Promise<void>;
    fetchReviewById: (id: string) => Promise<void>;
    createReviewItem: (data: CreateReviewData) => Promise<{ success: boolean; message?: string }>;
    updateReviewItem: (id: string, data: UpdateReviewData) => Promise<{ success: boolean; message?: string }>;
    deleteReviewItem: (id: string) => Promise<{ success: boolean; message?: string }>;
    fetchCoursesByCategory: (categorySlug: string, page?: number) => Promise<void>;
    fetchCourseSections: (courseId: string) => Promise<void>;
    updateCourseSectionPositions: (courseId: string, positions: { id: string, position: number }[]) => Promise<boolean>;
    createCourseSectionItem: (data: { courseId: string; sectionId: string; title: string; view: string; content: string; position: number }) => Promise<{ success: boolean; message?: string }>;
    updateCourseSectionItem: (id: string, data: { title?: string; view?: string; content?: string; position?: number }, courseId?: string) => Promise<{ success: boolean; message?: string }>;
    deleteCourseSectionItem: (id: string, courseId?: string) => Promise<{ success: boolean; message?: string }>;
    fetchContentList: (type: string, page?: number, limit?: number, search?: string) => Promise<void>;
    fetchContentById: (type: string, id: string) => Promise<void>;
    createContentItem: (type: string, data: CreateContentData) => Promise<{ success: boolean; message?: string }>;
    updateContentItem: (type: string, id: string, data: UpdateContentData) => Promise<{ success: boolean; message?: string }>;
    deleteContentItem: (type: string, id: string) => Promise<{ success: boolean; message?: string }>;

    fetchUsersList: (page?: number, limit?: number, search?: string) => Promise<void>;
    createUserItem: (data: CreateUserData) => Promise<{ success: boolean; message?: string }>;
    updateUserItem: (id: string, data: UpdateUserData) => Promise<{ success: boolean; message?: string }>;
    deleteUserItem: (id: string) => Promise<{ success: boolean; message?: string }>;

    fetchCourseTemplates: () => Promise<void>;
    fetchCourseTemplateById: (id: string) => Promise<CourseTemplateItem | null>;
    updateCourseTemplate: (id: string, data: any) => Promise<{ success: boolean; message?: string }>;
    createCourseTemplate: (data: any) => Promise<{ success: boolean; message?: string }>;
    deleteCourseTemplate: (id: string) => Promise<{ success: boolean; message?: string }>;

    fetchSections: (page?: number, limit?: number, search?: string) => Promise<void>;
    fetchSectionById: (id: string) => Promise<SectionItem | null>;
    createSectionItem: (data: CreateSectionData) => Promise<{ success: boolean; message?: string }>;
    updateSectionItem: (id: string, data: Partial<CreateSectionData>) => Promise<{ success: boolean; message?: string }>;
    deleteSectionItem: (id: string) => Promise<{ success: boolean; message?: string }>;

    clearMessages: () => void;
}

export const useAdminStore = create<AdminState>()((set, get) => ({
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
    currentReviewItem: null,
    adminUsers: [],
    usersPagination: null,
    adminCourseTemplates: [],
    adminSections: [],
    sectionsPagination: null,

    createCourse: async (data: CourseRequestData) => {
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

    createCategory: async (data) => {
        set({ isLoading: true, error: null, successMessage: null });
        try {
            const response = await createAdminCategory(data);
            if (response.success) {
                set({ isLoading: false, successMessage: 'Category created successfully' });
                return { success: true, message: 'Category created successfully' };
            }
            throw new Error(response.message || 'Failed to create category');
        } catch (error: any) {
            const message = axios.isAxiosError(error) && error.response
                ? error.response.data?.message || 'An unexpected error occurred'
                : error instanceof Error ? error.message : 'An unexpected error occurred';
            set({ error: message, isLoading: false });
            return { success: false, message };
        }
    },

    updateCategory: async (id, data) => {
        set({ isLoading: true, error: null, successMessage: null });
        try {
            const response = await updateAdminCategory(id, data);
            if (response.success) {
                set({ isLoading: false, successMessage: 'Category updated successfully' });
                return { success: true, message: 'Category updated successfully' };
            }
            throw new Error(response.message || 'Failed to update category');
        } catch (error: any) {
            const message = axios.isAxiosError(error) && error.response
                ? error.response.data?.message || 'An unexpected error occurred'
                : error instanceof Error ? error.message : 'An unexpected error occurred';
            set({ error: message, isLoading: false });
            return { success: false, message };
        }
    },

    fetchAllCourses: async (page?: number, limit?: number, search?: string, category?: string) => {
        set({ isLoading: true, error: null });
        try {
            if (page !== undefined) {
                const response = await fetchAdminCourses(page, limit || 10, search, category);
                if (response.success) {
                    set({
                        adminCourses: response.data?.items || response.data?.courses || [],
                        coursePagination: response.data?.pagination || null,
                        isLoading: false
                    });
                } else {
                    set({ isLoading: false });
                }
            } else {
                // Fetch page 1 with larger limit to get all for dropdowns
                const response = await fetchAdminCourses(1, 100, search, category);
                if (response.success) {
                    let allItems = response.data?.items || response.data?.courses || [];
                    const pagination = response.data?.pagination || null;

                    if (pagination && pagination.totalPages > 1) {
                        const promises = [];
                        for (let p = 2; p <= pagination.totalPages; p++) {
                            promises.push(fetchAdminCourses(p, 100, search, category));
                        }
                        const results = await Promise.all(promises);
                        results.forEach(res => {
                            if (res.success) {
                                const items = res.data?.items || res.data?.courses || [];
                                allItems = [...allItems, ...items];
                            }
                        });
                    }

                    set({
                        adminCourses: allItems,
                        coursePagination: pagination,
                        isLoading: false
                    });
                } else {
                    set({ isLoading: false });
                }
            }
        } catch (error: any) {
            set({ isLoading: false });
        }
    },


    fetchCourseById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchAdminCourseById(id);
            if (response.success && response.data) {
                // The course response already embeds courseSections — populate the
                // store so CourseSections.tsx renders immediately without a separate fetch.
                const sections = (response.data as any).courseSections;
                if (Array.isArray(sections)) {
                    set({ courseSections: sections, isLoading: false });
                } else {
                    set({ isLoading: false });
                }
                return response.data;
            }
            throw new Error(response.message || 'Failed to fetch course');
        } catch (error: any) {
            let message = 'An unexpected error occurred';
            if (axios.isAxiosError(error) && error.response) {
                message = error.response.data?.message || message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            set({ error: message, isLoading: false });
            return null;
        }
    },

    updateCourse: async (id: string, data: CourseRequestData) => {
        set({ isLoading: true, error: null, successMessage: null });
        try {
            const response = await updateAdminCourse(id, data);
            if (response.success) {
                set({ isLoading: false, successMessage: response.message || 'Course updated successfully' });
                return { success: true, message: response.message };
            }
            throw new Error(response.message || 'Failed to update course');
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

    deleteCourse: async (id: string) => {
        set({ isLoading: true, error: null, successMessage: null });
        try {
            const response = await deleteAdminCourse(id);
            if (response.success) {
                set({ isLoading: false, successMessage: response.message || 'Course deleted successfully' });
                return { success: true, message: response.message };
            }
            throw new Error(response.message || 'Failed to delete course');
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

    fetchReviews: async (page = 1, limit = 12, search?: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchAdminReviews(page, limit, search);
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

    fetchReviewById: async (id: string) => {
        set({ isLoading: true, error: null, currentReviewItem: null });
        try {
            const response = await fetchAdminReviewById(id);
            if (response.success) {
                set({ currentReviewItem: response.data || null, isLoading: false });
            }
        } catch (error: any) {
            set({ isLoading: false });
        }
    },

    createReviewItem: async (data: CreateReviewData) => {
        set({ isLoading: true, error: null, successMessage: null });
        try {
            const response = await createAdminReview(data);
            if (response.success) {
                set({ isLoading: false, successMessage: response.message || 'Review created successfully' });
                return { success: true, message: response.message };
            }
            throw new Error(response.message || 'Failed to create review');
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

    updateReviewItem: async (id: string, data: UpdateReviewData) => {
        set({ isLoading: true, error: null, successMessage: null });
        try {
            const response = await updateAdminReview(id, data);
            if (response.success) {
                set({ isLoading: false, successMessage: response.message || 'Review updated successfully' });
                return { success: true, message: response.message };
            }
            throw new Error(response.message || 'Failed to update review');
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

    deleteReviewItem: async (id: string) => {
        set({ isLoading: true, error: null, successMessage: null });
        try {
            const response = await deleteAdminReview(id);
            if (response.success) {
                set({ isLoading: false, successMessage: response.message || 'Review deleted successfully' });
                return { success: true, message: response.message };
            }
            throw new Error(response.message || 'Failed to delete review');
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

    fetchCourseSections: async (_courseId: string) => {
        // No backend endpoint for fetching course-sections; sections are managed
        // via the parent course PATCH. This is intentionally a no-op.
    },

    updateCourseSectionPositions: async (courseId: string, positions: { id: string, position: number }[]) => {
        set({ isLoading: true, error: null });
        try {
            const currentSections = get().courseSections || [];
            const updatedSections = currentSections.map((s: any) => {
                const posObj = positions.find(p => p.id === s.id || p.id === s.sectionId || p.id === s.section_id);
                if (posObj) {
                    return { ...s, position: posObj.position };
                }
                return s;
            }).sort((a: any, b: any) => a.position - b.position);

            // Use the dedicated reorder endpoint — NOT updateAdminCourse.
            // Calling updateAdminCourse with a partial payload (only courseSections)
            // triggers a full SQL UPDATE on the courses table which hits the
            // NOT NULL constraint on the `description` column.
            const response = await updateSectionPositions(courseId, positions);
            if (response.success) {
                set({
                    courseSections: updatedSections,
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

    fetchCourseTemplates: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchAdminCourseTemplates();
            if (response.success) {
                const templates = response.data || [];
                set({ adminCourseTemplates: templates, isLoading: false });

                // Proactive self-healing migration for legacy templates lacking top-level section_id
                for (const template of templates) {
                    let needsMigration = false;
                    let courseDetails = {};
                    let courseSections: any[] = [];

                    if (template && template.data) {
                        let parsedData = template.data;
                        if (typeof parsedData === 'string') {
                            try {
                                parsedData = JSON.parse(parsedData);
                            } catch { }
                        }
                        if (typeof parsedData === 'object' && parsedData !== null) {
                            courseDetails = parsedData.courseDetails || {};
                            courseSections = parsedData.courseSections || [];
                        }
                    }

                    if (Array.isArray(courseSections) && courseSections.length > 0) {
                        const migratedSections = courseSections.map((sec: any) => {
                            const sId = sec.section_id || sec.sectionId || sec.section?.id || sec.section?.section_id;
                            if (sId && (!sec.section_id || !sec.sectionId)) {
                                needsMigration = true;
                            }
                            return {
                                ...sec,
                                section_id: sId,
                                sectionId: sId,
                                section: sec.section ? {
                                    ...sec.section,
                                    id: sId,
                                    section_id: sId
                                } : null
                            };
                        });

                        if (needsMigration) {
                            console.log(`[Migration] Migrating course template "${template.title}" (${template.id}) to include top-level section_id properties.`);
                            const payload = {
                                title: template.title,
                                courseDetails,
                                courseSections: migratedSections
                            };
                            updateAdminCourseTemplate(template.id, payload).then((res) => {
                                if (res.success) {
                                    console.log(`[Migration] Successfully updated course template "${template.title}"`);
                                    fetchAdminCourseTemplates().then((refreshRes) => {
                                        if (refreshRes.success) {
                                            set({ adminCourseTemplates: refreshRes.data || [] });
                                        }
                                    });
                                }
                            }).catch(err => {
                                console.error(`[Migration] Failed to migrate template "${template.title}":`, err);
                            });
                        }
                    }
                }
            } else {
                set({ isLoading: false });
            }
        } catch (error: any) {
            let message = 'An unexpected error occurred';
            if (axios.isAxiosError(error) && error.response) {
                message = error.response.data?.message || message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            set({ error: message, isLoading: false });
        }
    },

    fetchCourseTemplateById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchAdminCourseTemplateById(id);
            if (response.success && response.data) {
                set({ isLoading: false });
                return response.data;
            }
            throw new Error(response.message || 'Failed to fetch course template');
        } catch (error: any) {
            let message = 'An unexpected error occurred';
            if (axios.isAxiosError(error) && error.response) {
                message = error.response.data?.message || message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            set({ error: message, isLoading: false });
            return null;
        }
    },

    updateCourseTemplate: async (id: string, data: any) => {
        set({ isLoading: true, error: null, successMessage: null });
        try {
            const response = await updateAdminCourseTemplate(id, data);
            if (response.success) {
                set({ isLoading: false, successMessage: response.message || 'Course template updated successfully' });
                return { success: true, message: response.message };
            }
            throw new Error(response.message || 'Failed to update course template');
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

    createCourseTemplate: async (data: any) => {
        set({ isLoading: true, error: null, successMessage: null });
        try {
            const response = await createAdminCourseTemplate(data);
            if (response.success) {
                set({ isLoading: false, successMessage: response.message || 'Course template created successfully' });
                return { success: true, message: response.message };
            }
            throw new Error(response.message || 'Failed to create course template');
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

    deleteCourseTemplate: async (id: string) => {
        set({ isLoading: true, error: null, successMessage: null });
        try {
            const response = await deleteAdminCourseTemplate(id);
            if (response.success) {
                set({ isLoading: false, successMessage: response.message || 'Course template deleted successfully' });
                return { success: true, message: response.message };
            }
            throw new Error(response.message || 'Failed to delete course template');
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

    // fetchSections: async (page = 1, limit = 10, search?: string) => {
    //     set({ isLoading: true, error: null });
    //     try {
    //         const response = await fetchAdminSections(page, limit, search);
    //         if (response.success) {
    //             set({ 
    //                 adminSections: response.data?.items || response.data?.sections || (Array.isArray(response.data) ? response.data : []), 
    //                 sectionsPagination: response.data?.pagination || null, 
    //                 isLoading: false 
    //             });
    //         } else {
    //             set({ isLoading: false });
    //         }
    //     } catch (error: any) {
    //         let message = 'An unexpected error occurred';
    //         if (axios.isAxiosError(error) && error.response) {
    //             message = error.response.data?.message || message;
    //         } else if (error instanceof Error) {
    //             message = error.message;
    //         }
    //         set({ error: message, isLoading: false });
    //     }
    // },
    fetchSections: async (page = 1, limit = 10, search?: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchAdminSections(page, limit, search);
            if (response.success) {
                set({
                    adminSections: response.data?.items || response.data?.sections || (Array.isArray(response.data) ? response.data : []),
                    sectionsPagination: response.data?.pagination || null,
                    isLoading: false
                });
            } else {
                set({ isLoading: false });
            }
        } catch (error: any) {
            set({ isLoading: false, error: error?.message });
        }
    },
    fetchSectionById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchAdminSectionById(id);
            if (response.success && response.data) {
                set({ isLoading: false });
                return response.data;
            }
            throw new Error(response.message || 'Failed to fetch section');
        } catch (error: any) {
            let message = 'An unexpected error occurred';
            if (axios.isAxiosError(error) && error.response) {
                message = error.response.data?.message || message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            set({ error: message, isLoading: false });
            return null;
        }
    },

    createSectionItem: async (data: CreateSectionData) => {
        set({ isLoading: true, error: null, successMessage: null });
        try {
            const response = await createAdminSection(data);
            if (response.success) {
                set({ isLoading: false, successMessage: response.message || 'Section created successfully' });
                return { success: true, message: response.message };
            }
            throw new Error(response.message || 'Failed to create section');
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

    // updateSectionItem: async (id: string, data: Partial<CreateSectionData>) => {
    //     set({ isLoading: true, error: null, successMessage: null });
    //     try {
    //         const response = await updateAdminSection(id, data);
    //         if (response.success) {
    //             set({ isLoading: false, successMessage: response.message || 'Section updated successfully' });
    //             return { success: true, message: response.message };
    //         }
    //         throw new Error(response.message || 'Failed to update section');
    //     } catch (error: any) {
    //         let message = 'An unexpected error occurred';
    //         if (axios.isAxiosError(error) && error.response) {
    //             message = error.response.data?.message || message;
    //         } else if (error instanceof Error) {
    //             message = error.message;
    //         }
    //         set({ error: message, isLoading: false });
    //         return { success: false, message };
    //     }
    // },
    updateSectionItem: async (id: string, data: Partial<CreateSectionData>) => {
        set({ isLoading: true, error: null, successMessage: null });
        try {
            // Hits PATCH /api/v1/admin/sections/:id directly
            const response = await updateAdminSection(id, data);
            if (response.success) {
                set({ isLoading: false, successMessage: response.message || 'Section definition adjusted' });
                return { success: true, message: response.message };
            }
            throw new Error(response.message || 'Failed to update section definition');
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            return { success: false, message: error.message };
        }
    },
    deleteSectionItem: async (id: string) => {
        set({ isLoading: true, error: null, successMessage: null });
        try {
            const response = await deleteAdminSection(id);
            if (response.success) {
                set({ isLoading: false, successMessage: response.message || 'Section deleted successfully' });
                return { success: true, message: response.message };
            }
            throw new Error(response.message || 'Failed to delete section');
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

    createCourseSectionItem: async (data: { courseId: string; sectionId: string; title: string; view: string; content: string; position: number }) => {
        set({ isLoading: true, error: null, successMessage: null });
        try {
            const courseId = data.courseId;

            // Fetch the full live course so we can spread all required fields
            // (e.g. `description`) into the PATCH payload and avoid the NOT NULL error.
            const courseResponse = await fetchAdminCourseById(courseId);
            if (!courseResponse.success || !courseResponse.data) {
                throw new Error('Could not load course data for section create');
            }
            const liveCourse = courseResponse.data;

            const currentSections = get().courseSections || [];

            const newSection = {
                courseId: courseId,
                course_id: courseId,
                sectionId: data.sectionId,
                section_id: data.sectionId,
                title: data.title,
                view: data.view,
                content: data.content || "[]",
                position: data.position ?? currentSections.length
            };

            const updatedSections = [...currentSections, newSection].sort((a: any, b: any) => a.position - b.position);

            const response = await updateAdminCourse(courseId, {
                ...liveCourse,
                courseSections: updatedSections
            } as any);
            if (response.success) {
                const freshSections = (response.data as any)?.courseSections;
                set({
                    courseSections: Array.isArray(freshSections) ? freshSections : updatedSections,
                    isLoading: false,
                    successMessage: 'Course section created successfully'
                });
                return { success: true, message: 'Course section created successfully' };
            }
            throw new Error(response.message || 'Failed to create course section');
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

    updateCourseSectionItem: async (id: string, data: { title?: string; view?: string; content?: string; position?: number }, courseId?: string) => {
        set({ isLoading: true, error: null, successMessage: null });
        try {
            const currentSections = get().courseSections || [];
            const targetSection = currentSections.find((s: any) => s.id === id || s.sectionId === id || s.section_id === id);
            const resolvedCourseId = courseId || targetSection?.courseId || targetSection?.course_id;

            if (!resolvedCourseId) {
                throw new Error('Course ID not found for the section update');
            }

            // Fetch the full live course so we can spread all required fields
            // (e.g. `description`) into the PATCH payload and avoid the NOT NULL error.
            const courseResponse = await fetchAdminCourseById(resolvedCourseId);
            if (!courseResponse.success || !courseResponse.data) {
                throw new Error('Could not load course data for section update');
            }
            const liveCourse = courseResponse.data;

            // Build updatedSections from the LIVE server sections (matching by sectionId)
            // so we always send current IDs that the backend knows about.
            const liveSections: any[] = (liveCourse as any).courseSections || currentSections;
            const updatedSections = liveSections.map((s: any) => {
                const isTarget =
                    s.id === id ||
                    s.sectionId === id ||
                    s.sectionid === id;

                if (isTarget) {
                    return { ...s, ...data, courseId: resolvedCourseId, course_id: resolvedCourseId };
                }
                return s;
            });

            const response = await updateAdminCourse(resolvedCourseId, {
                ...liveCourse,
                courseSections: updatedSections
            } as any);
            if (response.success) {
                // The backend recreates sections with new IDs and may reset content.
                // Re-apply our edit on top of the fresh server sections by matching sectionId.
                const freshSections: any[] = (response.data as any)?.courseSections;
                let finalSections = updatedSections;
                if (Array.isArray(freshSections)) {
                    finalSections = freshSections.map((fresh: any) => {
                        const wasTarget =
                            targetSection &&
                            (fresh.sectionId === targetSection.sectionId ||
                                fresh.id === targetSection.id);
                        if (wasTarget) {
                            return { ...fresh, ...data };
                        }
                        return fresh;
                    });
                }
                set({ courseSections: finalSections, isLoading: false, successMessage: 'Course section updated successfully' });
                return { success: true, message: 'Course section updated successfully' };
            }
            throw new Error(response.message || 'Failed to update course section');

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

    deleteCourseSectionItem: async (id: string, courseId?: string) => {
        set({ isLoading: true, error: null, successMessage: null });
        try {
            const currentSections = get().courseSections || [];
            const targetSection = currentSections.find((s: any) => s.id === id || s.sectionId === id || s.section_id === id);
            const resolvedCourseId = courseId || targetSection?.courseId || targetSection?.course_id;

            if (!resolvedCourseId) {
                throw new Error('Course ID not found for the section deletion');
            }

            // Fetch the full live course so we can spread all required fields
            // (e.g. `description`) into the PATCH payload and avoid the NOT NULL error.
            const courseResponse = await fetchAdminCourseById(resolvedCourseId);
            if (!courseResponse.success || !courseResponse.data) {
                throw new Error('Could not load course data for section deletion');
            }
            const liveCourse = courseResponse.data;

            const remainingSections = currentSections
                .filter((s: any) => s.id !== id && s.sectionId !== id && s.section_id !== id)
                .map((s: any, idx: number) => ({ ...s, position: idx }));

            const response = await updateAdminCourse(resolvedCourseId, {
                ...liveCourse,
                courseSections: remainingSections
            } as any);
            if (response.success) {
                const freshSections = (response.data as any)?.courseSections;
                set({
                    courseSections: Array.isArray(freshSections) ? freshSections : remainingSections,
                    isLoading: false,
                    successMessage: 'Course section deleted successfully'
                });
                return { success: true, message: 'Course section deleted successfully' };
            }
            throw new Error(response.message || 'Failed to delete course section');
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
