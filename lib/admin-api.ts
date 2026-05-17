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

export interface UpdateUserData extends Partial<CreateUserData> {}

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

export interface UpdateReviewData extends Partial<CreateReviewData> {}

export interface CreateCourseData {
  title: string;
  slug: string;
  status: string;
  subtitle: string;
  description: string;
  previewImage: string;
  demoVideo: string;
  categoryId: string;
  duration: string;
  liveProjects: string;
  trainingFormat: string;
  price: number;
  livePrice: number;
  rating: number;
  totalLearners: number;
  resources: string;
  assignments: string;
  syllabus: string;
  totalReviews: number;
  extraUrls: string;
  extraUrlTitle: string;
  youtubeDemo: string;
  courseType: string;
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

export interface UpdateContentData extends Partial<CreateContentData> {}

export interface AdminResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export const createCourse = async (data: CreateCourseData): Promise<AdminResponse<any>> => {
  const response = await axiosClient.post<AdminResponse<any>>('/admin/courses', data);
  return response.data;
};

export const fetchAdminCategories = async (): Promise<AdminResponse<any[]>> => {
    const response = await axiosClient.get<AdminResponse<any[]>>('/public/categories');
    return response.data;
};

export const fetchAdminCourses = async (page: number = 1, limit: number = 12): Promise<AdminResponse<any>> => {
    const response = await axiosClient.get<AdminResponse<any>>(`/public/courses?page=${page}&limit=${limit}`);
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

export const updateSectionPositions = async (courseId: string, positions: {id: string, position: number}[]): Promise<AdminResponse<any>> => {
    // Mock the response if the backend endpoint doesn't exist yet
    // return axiosClient.post(`/admin/course-sections/reorder`, { courseId, positions });
    return new Promise(resolve => setTimeout(() => resolve({ success: true, message: "Positions updated" }), 500));
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
