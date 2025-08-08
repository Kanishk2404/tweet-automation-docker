// API Configuration
export const API_CONFIG = {
    BASE_URL: 'http://localhost:5000/api',
    TIMEOUT: 10000,
};

// Toast Configuration
export const TOAST_CONFIG = {
    SUCCESS_DURATION: 3000,
    ERROR_DURATION: 4000,
    POSITION: 'top-right',
};

// Route Paths
export const ROUTES = {
    HOME: '/',
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
};

// Auth Views
export const AUTH_VIEWS = {
    LANDING: 'landing',
    LOGIN: 'login',
    SIGNUP: 'signup',
    OTP: 'otp',
    FORGOT_PASSWORD: 'forgot-password',
    RESET_PASSWORD: 'reset-password',
};

// OTP Configuration
export const OTP_CONFIG = {
    LENGTH: 6,
    EXPIRY_MINUTES: 15,
    RESEND_COOLDOWN: 60,
}; 