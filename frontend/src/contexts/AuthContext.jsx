import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { AUTH_VIEWS } from '../utils/constants';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState(AUTH_VIEWS.LANDING);
    const [otpEmail, setOtpEmail] = useState('');
    const [otpPurpose, setOtpPurpose] = useState('');

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            await authAPI.checkAuth();
            setIsAuthenticated(true);
        } catch (err) {
            setIsAuthenticated(false);
            setCurrentView(AUTH_VIEWS.LANDING);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (user) => {
        toast.success('Login successful!');
        setIsAuthenticated(true);
        setCurrentView(AUTH_VIEWS.LANDING);
        setOtpEmail('');
        setOtpPurpose('');
    };

    const handleLogout = async () => {
        try {
            await authAPI.logout();
            toast.success('Logged out successfully');
            setIsAuthenticated(false);
            setCurrentView(AUTH_VIEWS.LANDING);
            setOtpEmail('');
            setOtpPurpose('');
        } catch (err) {
            toast.error('Error during logout');
            setIsAuthenticated(false);
            setCurrentView(AUTH_VIEWS.LANDING);
            setOtpEmail('');
            setOtpPurpose('');
        }
    };

    const switchToSignup = () => {
        setCurrentView(AUTH_VIEWS.SIGNUP);
    };

    const switchToLogin = () => {
        setCurrentView(AUTH_VIEWS.LOGIN);
        setOtpEmail('');
        setOtpPurpose('');
    };

    const showForgotPassword = () => {
        setCurrentView(AUTH_VIEWS.FORGOT_PASSWORD);
    };

    const showOTP = (email, purpose = 'registration') => {
        setOtpEmail(email);
        setOtpPurpose(purpose);
        setCurrentView(AUTH_VIEWS.OTP);
    };

    const handleOTPSuccess = (user) => {
        if (otpPurpose === 'registration') {
            toast.success('Account created successfully!');
            setIsAuthenticated(true);
            setCurrentView(AUTH_VIEWS.LANDING);
            setOtpEmail('');
            setOtpPurpose('');
        } else {
            setCurrentView(AUTH_VIEWS.RESET_PASSWORD);
        }
    };

    const handleResetPasswordSuccess = () => {
        toast.success('Password reset successfully!');
        setCurrentView(AUTH_VIEWS.LOGIN);
        setOtpEmail('');
        setOtpPurpose('');
    };

    const goBack = () => {
        if (currentView === AUTH_VIEWS.OTP) {
            setCurrentView(otpPurpose === 'registration' ? AUTH_VIEWS.SIGNUP : AUTH_VIEWS.FORGOT_PASSWORD);
        } else if (currentView === AUTH_VIEWS.RESET_PASSWORD) {
            setCurrentView(AUTH_VIEWS.OTP);
        } else if (currentView === AUTH_VIEWS.FORGOT_PASSWORD) {
            setCurrentView(AUTH_VIEWS.LOGIN);
        }
    };

    const showAuth = (view) => {
        setCurrentView(view);
    };

    const value = {
        isAuthenticated,
        loading,
        currentView,
        otpEmail,
        otpPurpose,
        handleLogin,
        handleLogout,
        switchToSignup,
        switchToLogin,
        showForgotPassword,
        showOTP,
        handleOTPSuccess,
        handleResetPasswordSuccess,
        goBack,
        showAuth,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 