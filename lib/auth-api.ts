import axiosClient from './axios-client';

export interface RegisterUserData {
    email: string;
    password?: string;
    name?: string;
    loginType?: string;
}

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

export const registerUser = async (data: RegisterUserData): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>('/auth/user/register', data);
    return response.data;
};

export const loginUser = async (data: LoginUserData): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>('/auth/user/login', data);
    return response.data;
};

export const loginAdmin = async (data: LoginUserData): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>('/auth/admin/login', data);
    return response.data;
};

export const fetchUserProfile = async (id: string): Promise<AuthResponse> => {
    const response = await axiosClient.get<AuthResponse>(`/auth/user/profile/${id}`);
    return response.data;
};

