import React from 'react';
import { Navigate } from 'react-router-dom';
import LandingPage from '../components/LandingPage';
import Login from '../components/Login';
import Signup from '../components/Signup';
import OTPVerification from '../components/OTPVerification';
import ForgotPassword from '../components/ForgotPassword';
import ResetPassword from '../components/ResetPassword';
import { useAuth } from '../contexts/AuthContext';
import { AUTH_VIEWS } from '../utils/constants';

const HomePage = () => {
    const {
        isAuthenticated,
        currentView,
        otpEmail,
        otpPurpose,
        handleLogin,
        switchToSignup,
        switchToLogin,
        showForgotPassword,
        showOTP,
        handleOTPSuccess,
        handleResetPasswordSuccess,
        goBack,
    } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    if (currentView === AUTH_VIEWS.LOGIN || currentView === AUTH_VIEWS.SIGNUP || currentView === AUTH_VIEWS.OTP || currentView === AUTH_VIEWS.FORGOT_PASSWORD || currentView === AUTH_VIEWS.RESET_PASSWORD) {
        return (
            <div className="min-h-screen bg-gray-50">
                {currentView === AUTH_VIEWS.SIGNUP && (
                    <Signup onLogin={handleLogin} onSwitchToLogin={switchToLogin} onShowOTP={showOTP} />
                )}
                {currentView === AUTH_VIEWS.OTP && (
                    <OTPVerification
                        email={otpEmail}
                        purpose={otpPurpose}
                        onSuccess={handleOTPSuccess}
                        onBack={goBack}
                    />
                )}
                {currentView === AUTH_VIEWS.FORGOT_PASSWORD && (
                    <ForgotPassword onBack={goBack} onShowOTP={showOTP} />
                )}
                {currentView === AUTH_VIEWS.RESET_PASSWORD && (
                    <ResetPassword email={otpEmail} onSuccess={handleResetPasswordSuccess} onBack={goBack} />
                )}
                {currentView === AUTH_VIEWS.LOGIN && (
                    <Login
                        onLogin={handleLogin}
                        onSwitchToSignup={switchToSignup}
                        onShowForgotPassword={showForgotPassword}
                    />
                )}
            </div>
        );
    }

    return <LandingPage />;
};

export default HomePage; 