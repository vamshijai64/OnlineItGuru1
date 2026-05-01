import axiosClient from './axios-client';

export interface LoginUserData {
  email: string;
  password?: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
      token: string;
      user: UserResponse;
  };
}


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

export const fetchAdminReviews = async (page: number = 1, limit: number = 12): Promise<AdminResponse<any>> => {
    const response = await axiosClient.get<AdminResponse<any>>(`/public/reviews?page=${page}&limit=${limit}`);
    return response.data;
};

export const loginAdmin = async (data: LoginUserData): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>('/auth/admin/login', data);
    return response.data;
};
