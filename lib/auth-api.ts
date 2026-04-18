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
    email: string;
    password?: string;
    name?: string;
    loginType?: string;
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

export interface AuthResponse {
    success: boolean;
    message?: string;
    user?: UserResponse;
}

export const registerUser = async (data: RegisterUserData): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>('/users/register', data);
    return response.data;
};

export const loginUser = async (data: LoginUserData): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>('/users/login', data);
    return response.data;
};

export const fetchUserProfile = async (id: string): Promise<AuthResponse> => {
    const response = await axiosClient.get<AuthResponse>(`/users/profile/${id}`);
    return response.data;
};

