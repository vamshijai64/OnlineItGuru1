import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'https://onlineitguru.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
axiosClient.interceptors.request.use(
    (config) => {
        // Here you can inject tokens if needed, e.g., from localStorage
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Global error handling, e.g., redirect to login on 401
        if (error.response && error.response.status === 401) {
            // handle unauthorized access
            console.error("Unauthorized access. Redirecting or logging out.");
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
