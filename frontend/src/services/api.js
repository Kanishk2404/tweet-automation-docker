import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auth API calls
export const authAPI = {
    // Check authentication status
    checkAuth: () => api.get('/auth/me'),

    // Login
    login: (credentials) => api.post('/auth/login', credentials),

    // Signup
    signup: (userData) => api.post('/auth/signup', userData),

    // Logout
    logout: () => api.post('/auth/logout'),

    // Forgot password
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),

    // Verify OTP
    verifySignupOTP: (data) => api.post('/auth/verify-signup', data),
    verifyResetOTP: (data) => api.post('/auth/verify-reset-password', data),

    // Reset password
    resetPassword: (data) => api.post('/auth/reset-password', data),

    // Resend OTP
    resendSignupOTP: (email) => api.post('/auth/resend-signup-otp', { email }),
    resendResetOTP: (email) => api.post('/auth/resend-reset-otp', { email }),
};

// Add request interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle common errors here
        if (error.response?.status === 401) {
            // Handle unauthorized access
            console.log('Unauthorized access');
        }
        return Promise.reject(error);
    }
);

export default api; 