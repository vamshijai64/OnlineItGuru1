import axios from 'axios';

/**
 * Axios client pre-configured with the backend base URL from the environment.
 * The NEXT_PUBLIC_API_URL variable is defined in .env (or .env.local).
 */
const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15_000, // 15 s – surfaced from env for visibility
});

// ── Request Interceptor ─────────────────────────────────────────────────────
axiosClient.interceptors.request.use(
    (config) => {
        // Read auth token from localStorage using the configurable key
        const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY ?? 'oit_auth_token';
        const token =
            typeof window !== 'undefined' ? localStorage.getItem(tokenKey) : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response Interceptor ────────────────────────────────────────────────────
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid – middleware will catch protected routes,
            // but we log here for debugging API calls in client components.
            console.error('[axiosClient] 401 Unauthorized – clearing local token.');
            if (typeof window !== 'undefined') {
                const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY ?? 'oit_auth_token';
                localStorage.removeItem(tokenKey);
                // Optional: redirect to login
                // window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
