import axiosClient from './axios-client';

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
