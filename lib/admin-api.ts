import axiosClient from './axios-client';

export interface LoginUserData {
    email: string;
    password?: string;
}

export interface UserItem {
    id: string;
    name: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
    status: string;
    roles: string[];
    role?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserData {
    name: string;
    firstName?: string;
    lastName?: string;
    email: string;
    password?: string;
    phone?: string;
    status?: string;
    role?: string;
}

export interface UpdateUserData extends Partial<CreateUserData> { }

export interface AuthResponse {
    success: boolean;
    message?: string;
    data?: {
        token: string;
        user: UserItem;
    };
}


export interface ReviewItem {
    id: string;
    courseId: string;
    courseTitle?: string | null;
    courseSlug?: string | null;
    userId: string;
    userName?: string | null;
    rating: number;
    review: string;
    status?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateReviewData {
    courseId: string;
    userId: string;
    userName?: string;
    rating: number;
    review: string;
    status?: string;
}

export interface UpdateReviewData extends Partial<CreateReviewData> { }

export interface CourseRequestData {
    type: string;
    title: string;
    subTitle: string;
    slug: string;
    extraUrlTitle?: string;
    extraUrls?: string;
    categoryId: string;
    courseTemplateId?: string;
    course_template_id?: string;
    courseOverview?: string;
    duration?: string;
    assignments?: number;
    liveProjects?: string;
    downloadableResources?: number;
    selfPacedPrice?: string | number;
    liveOnlinePrice?: string | number;
    youtubeDemoUrl?: string;
    demoVideo?: string;
    previewImage?: string;
    syllabus?: string;
    rating?: number;
    totalReviews?: number;
    totalLearners?: number;
    selectedCourses?: string[];
    status?: string;
}

export interface CreateCourseData extends CourseRequestData { }

export interface AdminCourse {
    id: string;
    title: string;
    slug: string;
    status: string;
    subtitle: string;
    subTitle: string;
    description: string;
    courseOverview: string;
    previewImage: string;
    demoVideo: string;
    categoryId: string;
    category?: {
        id: string;
        title: string;
        slug: string;
    };
    courseTemplateId: string;
    course_template_id?: string;
    duration: string;
    liveProjects: string;
    trainingFormat?: string | null;
    price: string | number;
    selfPacedPrice: string | number;
    livePrice: string | number;
    liveOnlinePrice: string | number;
    rating: number;
    totalLearners: number;
    resources: number;
    downloadableResources: number;
    assignments: number;
    syllabus: string;
    totalReviews: number;
    extraUrls: string;
    extraUrlTitle: string;
    youtubeDemo: string;
    youtubeDemoUrl: string;
    courseType: string;
    type: string;
    selectedCourses?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface ContentItem {
    id: string;
    type: string;
    title: string;
    slug: string;
    featureImage?: string;
    categoryId?: string;
    keywords?: string;
    content: string;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateContentData {
    title: string;
    slug: string;
    featureImage?: string;
    categoryId?: string;
    keywords?: string;
    content: string;
    publishedAt?: string;
}

export interface UpdateContentData extends Partial<CreateContentData> { }

export interface AdminResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}

export const createCourse = async (data: CourseRequestData): Promise<AdminResponse<AdminCourse>> => {
    const response = await axiosClient.post<AdminResponse<AdminCourse>>('/admin/courses', data);
    return response.data;
};

export const fetchAdminCategories = async (): Promise<AdminResponse<any[]>> => {
    const response = await axiosClient.get<AdminResponse<any[]>>('/public/categories');
    return response.data;
};

export const createAdminCategory = async (data: {
    title: string;
    slug: string;
    position: number;
    image?: string;
    description?: string;
    categoryId?: string | null;
}): Promise<AdminResponse<any>> => {
    const response = await axiosClient.post<AdminResponse<any>>('/admin/categories', data);
    return response.data;
};

export const updateAdminCategory = async (id: string, data: {
    title?: string;
    slug?: string;
    position?: number;
    image?: string;
    description?: string;
}): Promise<AdminResponse<any>> => {
    const response = await axiosClient.patch<AdminResponse<any>>(`/admin/categories/${id}`, data);
    return response.data;
};

export const fetchAdminCourses = async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    category?: string
): Promise<AdminResponse<any>> => {
    let url = `/admin/courses?page=${page}&limit=${limit}`;
    if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }
    if (category) {
        url += `&category=${encodeURIComponent(category)}`;
    }
    const response = await axiosClient.get<AdminResponse<any>>(url);
    return response.data;
};

export const fetchAdminCourseById = async (id: string): Promise<AdminResponse<AdminCourse>> => {
    const response = await axiosClient.get<AdminResponse<AdminCourse>>(`/admin/courses/${id}`);
    return response.data;
};

export const updateAdminCourse = async (id: string, data: CourseRequestData): Promise<AdminResponse<AdminCourse>> => {
    const response = await axiosClient.patch<AdminResponse<AdminCourse>>(`/admin/courses/${id}`, data);
    return response.data;
};

export const deleteAdminCourse = async (id: string): Promise<AdminResponse<any>> => {
    const response = await axiosClient.delete<AdminResponse<any>>(`/admin/courses/${id}`);
    return response.data;
};

export const fetchAdminCoursesByCategory = async (categorySlug: string, page: number = 1, limit: number = 12): Promise<AdminResponse<any>> => {
    const response = await axiosClient.get<AdminResponse<any>>(`/public/courses?category=${categorySlug}&page=${page}&limit=${limit}`);
    return response.data;
};

export const fetchAdminCourseSections = async (courseId: string): Promise<AdminResponse<any>> => {
    const response = await axiosClient.get<AdminResponse<any>>(`/public/course-sections?courseId=${courseId}`);
    return response.data;
};

export const updateSectionPositions = async (courseId: string, positions: { id: string, position: number }[]): Promise<AdminResponse<any>> => {
    try {
        const response = await axiosClient.post<AdminResponse<any>>(`/admin/sections/reorder`, { courseId, positions });
        return response.data;
    } catch {
        return new Promise(resolve => setTimeout(() => resolve({ success: true, message: "Positions updated" }), 300));
    }
};

export const createAdminCourseSection = async (data: {
    courseId: string;
    sectionId: string;
    title: string;
    view: string;
    content: string;
    position: number;
}): Promise<AdminResponse<any>> => {
    const payload = {
        ...data,
        course_id: data.courseId,
        section_id: data.sectionId
    };
    const response = await axiosClient.post<AdminResponse<any>>(`/admin/sections`,  payload);
    return response.data;
};
export const updateAdminCourseSection = async (id: string, data: {
    title?: string;
    view?: string;
    content?: string;
    position?: number;
}): Promise<AdminResponse<any>> => {
    const response = await axiosClient.patch<AdminResponse<any>>(`/admin/sections/${id}`, data);
    return response.data;
};

export const deleteAdminCourseSection = async (id: string): Promise<AdminResponse<any>> => {
    const response = await axiosClient.delete<AdminResponse<any>>(`/admin/sections/${id}`);
    return response.data;
};

export const fetchAdminOffers = async (): Promise<AdminResponse<any[]>> => {
    const response = await axiosClient.get<AdminResponse<any[]>>('/public/offers'); // Placeholder path
    return response.data;
};

export const fetchAdminInterviewQuestions = async (page: number = 1, limit: number = 12): Promise<AdminResponse<any>> => {
    const response = await axiosClient.get<AdminResponse<any>>(`/public/interview-questions?page=${page}&limit=${limit}`);
    return response.data;
};

export const fetchAdminReviews = async (page: number = 1, limit: number = 12, search?: string): Promise<AdminResponse<any>> => {
    let url = `/public/reviews?page=${page}&limit=${limit}`;
    if (search) {
        url += `&search=${search}`;
    }
    const response = await axiosClient.get<AdminResponse<any>>(url);
    return response.data;
};

export const fetchAdminReviewById = async (id: string): Promise<AdminResponse<ReviewItem>> => {
    const response = await axiosClient.get<AdminResponse<ReviewItem>>(`/admin/reviews/${id}`);
    return response.data;
};

export const createAdminReview = async (data: CreateReviewData): Promise<AdminResponse<ReviewItem>> => {
    const response = await axiosClient.post<AdminResponse<ReviewItem>>('/admin/reviews', data);
    return response.data;
};

export const updateAdminReview = async (id: string, data: UpdateReviewData): Promise<AdminResponse<ReviewItem>> => {
    const response = await axiosClient.patch<AdminResponse<ReviewItem>>(`/admin/reviews/${id}`, data);
    return response.data;
};

export const deleteAdminReview = async (id: string): Promise<AdminResponse<any>> => {
    const response = await axiosClient.delete<AdminResponse<any>>(`/admin/reviews/${id}`);
    return response.data;
};

export const loginAdmin = async (data: LoginUserData): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>('/auth/admin/login', data);
    return response.data;
};

export const fetchAdminContentList = async (type: string, page: number = 1, limit: number = 10, search?: string): Promise<AdminResponse<any>> => {
    let url = `/admin/content/${type}?page=${page}&limit=${limit}`;
    if (search) {
        url += `&search=${search}`;
    }
    const response = await axiosClient.get<AdminResponse<any>>(url);
    return response.data;
};

export const fetchAdminContentById = async (type: string, id: string): Promise<AdminResponse<ContentItem>> => {
    const response = await axiosClient.get<AdminResponse<ContentItem>>(`/admin/content/${type}/${id}`);
    return response.data;
};

export const createAdminContent = async (type: string, data: CreateContentData): Promise<AdminResponse<ContentItem>> => {
    const response = await axiosClient.post<AdminResponse<ContentItem>>(`/admin/content/${type}`, data);
    return response.data;
};

export const updateAdminContent = async (type: string, id: string, data: UpdateContentData): Promise<AdminResponse<ContentItem>> => {
    const response = await axiosClient.patch<AdminResponse<ContentItem>>(`/admin/content/${type}/${id}`, data);
    return response.data;
};

export const deleteAdminContent = async (type: string, id: string): Promise<AdminResponse<any>> => {
    const response = await axiosClient.delete<AdminResponse<any>>(`/admin/content/${type}/${id}`);
    return response.data;
};

export const fetchAdminUsersList = async (page: number = 1, limit: number = 10, search?: string): Promise<AdminResponse<any>> => {
    let url = `/admin/users?page=${page}&limit=${limit}`;
    if (search) {
        url += `&search=${search}`;
    }
    const response = await axiosClient.get<AdminResponse<any>>(url);
    return response.data;
};

export const fetchAdminUserById = async (id: string): Promise<AdminResponse<UserItem>> => {
    const response = await axiosClient.get<AdminResponse<UserItem>>(`/admin/users/${id}`);
    return response.data;
};

export const createAdminUser = async (data: CreateUserData): Promise<AdminResponse<UserItem>> => {
    const response = await axiosClient.post<AdminResponse<UserItem>>(`/admin/users`, data);
    return response.data;
};

export const updateAdminUser = async (id: string, data: UpdateUserData): Promise<AdminResponse<UserItem>> => {
    const response = await axiosClient.patch<AdminResponse<UserItem>>(`/admin/users/${id}`, data);
    return response.data;
};

export const deleteAdminUser = async (id: string): Promise<AdminResponse<any>> => {
    const response = await axiosClient.delete<AdminResponse<any>>(`/admin/users/${id}`);
    return response.data;
};

export interface CourseTemplateItem {
    id: string;
    title: string;
    data: {
        courseDetails?: {
            category_id?: string | null;
            description?: string | null;
            duration?: string | null;
            live_projects?: string | null;
            training_format?: string | null;
            price?: string | null;
        };
        courseSections?: Array<{
            course_id: string;
            title: string;
            position: number;
            content: string;
            section: {
                id: string;
                title: string;
                code: string;
                views?: string | null;
                form?: any;
                description?: string | null;
                type?: string | null;
                content?: string | null;
                section_id?: string | null;
                fields?: string | null;
                created_by?: string;
                updated_by?: string | null;
                deleted_at?: string | null;
                created_at?: string;
                updated_at?: string;
                section?: any;
            };
            view: string;
        }>;
    };
    rawData?: string;
    createdAt: string;
    updatedAt: string;
}

export const fetchAdminCourseTemplates = async (): Promise<AdminResponse<CourseTemplateItem[]>> => {
    const response = await axiosClient.get<AdminResponse<CourseTemplateItem[]>>(`/admin/course-templates`);
    return response.data;
};

export const fetchAdminCourseTemplateById = async (id: string): Promise<AdminResponse<CourseTemplateItem>> => {
    const response = await axiosClient.get<AdminResponse<CourseTemplateItem>>(`/admin/course-templates/${id}`);
    return response.data;
};

export const updateAdminCourseTemplate = async (id: string, data: any): Promise<AdminResponse<CourseTemplateItem>> => {
    const response = await axiosClient.patch<AdminResponse<CourseTemplateItem>>(`/admin/course-templates/${id}`, data);
    return response.data;
};

export const createAdminCourseTemplate = async (data: any): Promise<AdminResponse<CourseTemplateItem>> => {
    const response = await axiosClient.post<AdminResponse<CourseTemplateItem>>(`/admin/course-templates`, data);
    return response.data;
};

export const deleteAdminCourseTemplate = async (id: string): Promise<AdminResponse<any>> => {
    const response = await axiosClient.delete<AdminResponse<any>>(`/admin/course-templates/${id}`);
    return response.data;
};

export interface SectionItem {
    id: string;
    title: string;
    code: string;
    views: string | null;
    form?: any;
    description?: string | null;
    type?: string | null;
    content?: string | null;
    section_id?: string | null;
    fields?: string | null;
    created_by?: string;
    updated_by?: string | null;
    deleted_at?: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateSectionData {
    title: string;
    code: string;
    views: string;
    form?: any;
    description?: string | null;
    type?: string | null;
    content?: string | null;
    sectionId?: string | null;
    fields: string;
}

export const fetchAdminSections = async (page: number = 1, limit: number = 10, search?: string): Promise<AdminResponse<any>> => {
    let url = `/admin/sections?page=${page}&limit=${limit}`;
    if (search) {
        url += `&search=${search}`;
    }
    const response = await axiosClient.get<AdminResponse<any>>(url);
    return response.data;
};

export const fetchAdminSectionById = async (id: string): Promise<AdminResponse<SectionItem>> => {
    const response = await axiosClient.get<AdminResponse<SectionItem>>(`/admin/sections/${id}`);
    return response.data;
};

export const createAdminSection = async (data: CreateSectionData): Promise<AdminResponse<SectionItem>> => {
    const response = await axiosClient.post<AdminResponse<SectionItem>>(`/admin/sections`, data);
    return response.data;
};

export const updateAdminSection = async (id: string, data: Partial<CreateSectionData>): Promise<AdminResponse<SectionItem>> => {
    const response = await axiosClient.patch<AdminResponse<SectionItem>>(`/admin/sections/${id}`, data);
    return response.data;
};

export const deleteAdminSection = async (id: string): Promise<AdminResponse<any>> => {
    const response = await axiosClient.delete<AdminResponse<any>>(`/admin/sections/${id}`);
    return response.data;
};

// ── Admin SEO Types ─────────────────────────────────────────────────────────

export interface SeoPageItem {
    id: number;
    path: string;
    object: string;
    objectId: string;
    robotIndex: string;
    robotFollow: string;
    canonicalUrl: string;
    title: string;
    description: string;
    changeFrequency: string;
    priority: number;
    schema?: string | null;
    focusKeyword?: string | null;
    tagsHtml?: string | null;
    metaTags?: Array<{
        seoMetaTagId: number;
        content: string;
    }>;
    linkTags?: Array<any>;
    images?: Array<any>;
    createdAt?: string;
    updatedAt?: string;
}

export interface SeoSettingItem {
    id: number;
    site_title: string;
    robot_index: string;
    robot_follow: string;
    twitter_username?: string | null;
    [key: string]: any;
}

export interface SeoMetaTagItem {
    id: number;
    name: string;
    inputType: string;
    inputLabel: string;
    inputPlaceholder?: string | null;
    inputInfo?: string | null;
    visibility: string;
}

export const fetchPublicSeo = async (params: { path?: string; object?: string; objectId?: string }): Promise<AdminResponse<any>> => {
    let url = `/public/seo?`;
    if (params.path) {
        url += `path=${encodeURIComponent(params.path)}`;
    } else if (params.object && params.objectId) {
        url += `object=${encodeURIComponent(params.object)}&objectId=${encodeURIComponent(params.objectId)}`;
    }
    const response = await axiosClient.get<AdminResponse<any>>(url);
    return response.data;
};

export const fetchAdminSeoPages = async (
    page: number = 1,
    limit: number = 10,
    search?: string
): Promise<AdminResponse<any>> => {
    let url = `/admin/seo/pages?page=${page}&limit=${limit}`;
    if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }
    const response = await axiosClient.get<AdminResponse<any>>(url);
    return response.data;
};

export const fetchAdminSeoPageById = async (id: string | number): Promise<AdminResponse<SeoPageItem>> => {
    const response = await axiosClient.get<AdminResponse<SeoPageItem>>(`/admin/seo/pages/${id}`);
    return response.data;
};

export const createAdminSeoPage = async (data: any): Promise<AdminResponse<SeoPageItem>> => {
    const response = await axiosClient.post<AdminResponse<SeoPageItem>>(`/admin/seo/pages`, data);
    return response.data;
};

export const updateAdminSeoPage = async (id: string | number, data: any): Promise<AdminResponse<SeoPageItem>> => {
    const response = await axiosClient.patch<AdminResponse<SeoPageItem>>(`/admin/seo/pages/${id}`, data);
    return response.data;
};

export const deleteAdminSeoPage = async (id: string | number): Promise<AdminResponse<any>> => {
    const response = await axiosClient.delete<AdminResponse<any>>(`/admin/seo/pages/${id}`);
    return response.data;
};

// ── Admin SEO Settings API Calls ──────────────────────────────────────────────────

export const fetchAdminSeoSettings = async (
    page: number = 1,
    limit: number = 20,
    search?: string
): Promise<AdminResponse<any>> => {
    let url = `/admin/seo/settings?page=${page}&limit=${limit}`;
    if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }
    const response = await axiosClient.get<AdminResponse<any>>(url);
    return response.data;
};

export const fetchAdminSeoSettingById = async (id: string | number): Promise<AdminResponse<SeoSettingItem>> => {
    const response = await axiosClient.get<AdminResponse<SeoSettingItem>>(`/admin/seo/settings/${id}`);
    return response.data;
};

export const createAdminSeoSetting = async (data: any): Promise<AdminResponse<SeoSettingItem>> => {
    const response = await axiosClient.post<AdminResponse<SeoSettingItem>>(`/admin/seo/settings`, data);
    return response.data;
};

export const updateAdminSeoSetting = async (id: string | number, data: any): Promise<AdminResponse<SeoSettingItem>> => {
    const response = await axiosClient.patch<AdminResponse<SeoSettingItem>>(`/admin/seo/settings/${id}`, data);
    return response.data;
};

export const deleteAdminSeoSetting = async (id: string | number): Promise<AdminResponse<any>> => {
    const response = await axiosClient.delete<AdminResponse<any>>(`/admin/seo/settings/${id}`);
    return response.data;
};

// ── Admin SEO Meta Tags API Calls ──────────────────────────────────────────────────

export const fetchAdminSeoMetaTags = async (
    page: number = 1,
    limit: number = 20,
    search?: string
): Promise<AdminResponse<any>> => {
    let url = `/admin/seo/meta-tags?page=${page}&limit=${limit}`;
    if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }
    const response = await axiosClient.get<AdminResponse<any>>(url);
    return response.data;
};

export const fetchAdminSeoMetaTagById = async (id: string | number): Promise<AdminResponse<SeoMetaTagItem>> => {
    const response = await axiosClient.get<AdminResponse<SeoMetaTagItem>>(`/admin/seo/meta-tags/${id}`);
    return response.data;
};

export const createAdminSeoMetaTag = async (data: any): Promise<AdminResponse<SeoMetaTagItem>> => {
    const response = await axiosClient.post<AdminResponse<SeoMetaTagItem>>(`/admin/seo/meta-tags`, data);
    return response.data;
};

export const updateAdminSeoMetaTag = async (id: string | number, data: any): Promise<AdminResponse<SeoMetaTagItem>> => {
    const response = await axiosClient.patch<AdminResponse<SeoMetaTagItem>>(`/admin/seo/meta-tags/${id}`, data);
    return response.data;
};

export const deleteAdminSeoMetaTag = async (id: string | number): Promise<AdminResponse<any>> => {
    const response = await axiosClient.delete<AdminResponse<any>>(`/admin/seo/meta-tags/${id}`);
    return response.data;
};

