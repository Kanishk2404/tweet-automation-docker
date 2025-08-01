import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Login from './Login';
import Signup from './Signup';
import OTPVerification from './OTPVerification';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState('login'); // login, signup, otp, forgot-password, reset-password
    const [otpEmail, setOtpEmail] = useState('');
    const [otpPurpose, setOtpPurpose] = useState('');

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/auth/me', {
                withCredentials: true
            });

            setIsAuthenticated(true);
        } catch (err) {
            setIsAuthenticated(false);
            // Reset view to login when not authenticated
            setCurrentView('login');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (user) => {
        toast.success('Login successful!');
        setIsAuthenticated(true);
        // Reset view state after successful login
        setCurrentView('login');
        setOtpEmail('');
        setOtpPurpose('');
    };

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/logout', {}, {
                withCredentials: true
            });
            toast.success('Logged out successfully');
            setIsAuthenticated(false);
            // Reset all view state after logout
            setCurrentView('login');
            setOtpEmail('');
            setOtpPurpose('');
        } catch (err) {
            toast.error('Error during logout');
            // Even if logout fails, reset the state
            setIsAuthenticated(false);
            setCurrentView('login');
            setOtpEmail('');
            setOtpPurpose('');
        }
    };

    const switchToSignup = () => {
        setCurrentView('signup');
    };

    const switchToLogin = () => {
        setCurrentView('login');
        // Clear OTP state when switching to login
        setOtpEmail('');
        setOtpPurpose('');
    };

    const showForgotPassword = () => {
        setCurrentView('forgot-password');
    };

    const showOTP = (email, purpose = 'registration') => {
        setOtpEmail(email);
        setOtpPurpose(purpose);
        setCurrentView('otp');
    };

    const handleOTPSuccess = (user) => {
        if (otpPurpose === 'registration') {
            toast.success('Account created successfully!');
            setIsAuthenticated(true);
            // Reset view state after successful registration
            setCurrentView('login');
            setOtpEmail('');
            setOtpPurpose('');
        } else {
            setCurrentView('reset-password');
        }
    };

    const handleResetPasswordSuccess = () => {
        toast.success('Password reset successfully!');
        setCurrentView('login');
        // Clear OTP state after password reset
        setOtpEmail('');
        setOtpPurpose('');
    };

    const goBack = () => {
        if (currentView === 'otp') {
            setCurrentView(otpPurpose === 'registration' ? 'signup' : 'forgot-password');
        } else if (currentView === 'reset-password') {
            setCurrentView('otp');
        } else if (currentView === 'forgot-password') {
            setCurrentView('login');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        switch (currentView) {
            case 'signup':
                return <Signup onLogin={handleLogin} onSwitchToLogin={switchToLogin} onShowOTP={showOTP} />;
            case 'otp':
                return (
                    <OTPVerification
                        email={otpEmail}
                        purpose={otpPurpose}
                        onSuccess={handleOTPSuccess}
                        onBack={goBack}
                    />
                );
            case 'forgot-password':
                return <ForgotPassword onBack={goBack} onShowOTP={showOTP} />;
            case 'reset-password':
                return <ResetPassword email={otpEmail} onSuccess={handleResetPasswordSuccess} onBack={goBack} />;
            default:
                return (
                    <Login
                        onLogin={handleLogin}
                        onSwitchToSignup={switchToSignup}
                        onShowForgotPassword={showForgotPassword}
                    />
                );
        }
    }

    return (
        <div>
            <div className="bg-gray-100 p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-semibold">Tweet Automator</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>
            </div>
            {children}
        </div>
    );
};

export default ProtectedRoute; 