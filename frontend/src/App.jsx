import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import OTPVerification from './components/OTPVerification';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('landing');
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
      setCurrentView('landing');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (user) => {
    toast.success('Login successful!');
    setIsAuthenticated(true);
    setCurrentView('landing');
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
      setCurrentView('landing');
      setOtpEmail('');
      setOtpPurpose('');
    } catch (err) {
      toast.error('Error during logout');
      setIsAuthenticated(false);
      setCurrentView('landing');
      setOtpEmail('');
      setOtpPurpose('');
    }
  };

  const switchToSignup = () => {
    setCurrentView('signup');
  };

  const switchToLogin = () => {
    setCurrentView('login');
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
      setCurrentView('landing');
      setOtpEmail('');
      setOtpPurpose('');
    } else {
      setCurrentView('reset-password');
    }
  };

  const handleResetPasswordSuccess = () => {
    toast.success('Password reset successfully!');
    setCurrentView('login');
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

  const showAuth = (view) => {
    setCurrentView(view);
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

  return (
    <Router>
      <div className="App">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />

        <Navbar
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          onShowAuth={showAuth}
        />

        <Routes>
          <Route path="/" element={
            !isAuthenticated ? (
              currentView === 'login' || currentView === 'signup' || currentView === 'otp' || currentView === 'forgot-password' || currentView === 'reset-password' ? (
                <div className="min-h-screen bg-gray-50">
                  {currentView === 'signup' && (
                    <Signup onLogin={handleLogin} onSwitchToLogin={switchToLogin} onShowOTP={showOTP} />
                  )}
                  {currentView === 'otp' && (
                    <OTPVerification
                      email={otpEmail}
                      purpose={otpPurpose}
                      onSuccess={handleOTPSuccess}
                      onBack={goBack}
                    />
                  )}
                  {currentView === 'forgot-password' && (
                    <ForgotPassword onBack={goBack} onShowOTP={showOTP} />
                  )}
                  {currentView === 'reset-password' && (
                    <ResetPassword email={otpEmail} onSuccess={handleResetPasswordSuccess} onBack={goBack} />
                  )}
                  {currentView === 'login' && (
                    <Login
                      onLogin={handleLogin}
                      onSwitchToSignup={switchToSignup}
                      onShowForgotPassword={showForgotPassword}
                    />
                  )}
                </div>
              ) : (
                <LandingPage currentView={currentView} onShowAuth={showAuth} />
              )
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } />

          <Route path="/dashboard" element={
            isAuthenticated ? (
              <Dashboard />
            ) : (
              <Navigate to="/" replace />
            )
          } />

          <Route path="/profile" element={
            isAuthenticated ? (
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile</h1>
                  <p className="text-gray-600">Profile page coming soon...</p>
                </div>
              </div>
            ) : (
              <Navigate to="/" replace />
            )
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;