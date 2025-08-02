import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Navbar = ({ isAuthenticated, onLogout, onShowAuth }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/logout', {}, {
                withCredentials: true
            });
            onLogout();
            toast.success('Logged out successfully');
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Logout failed');
        }
    };

    const handleSignIn = () => {
        onShowAuth('login');
        navigate('/');
    };

    const handleGetStarted = () => {
        onShowAuth('signup');
        navigate('/');
    };

    const handleDashboard = () => {
        navigate('/dashboard');
    };

    const handleProfile = () => {
        navigate('/profile');
    };

    const handleHome = () => {
        if (isAuthenticated) {
            navigate('/dashboard');
        } else {
            onShowAuth('landing');
            navigate('/');
        }
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Left side - Brand */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <button
                                onClick={handleHome}
                                className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
                            >
                                TweetGenie
                            </button>
                        </div>
                    </div>

                    {/* Middle - Navigation Links (Desktop) */}
                    {!isAuthenticated && (
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Home
                            </a>
                            <a href="#" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                About
                            </a>
                            <a href="#" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Pricing
                            </a>
                            <a href="#" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Contact Us
                            </a>
                        </div>
                    )}

                    {isAuthenticated && (
                        <div className="hidden md:flex items-center space-x-8">
                            <button
                                onClick={handleDashboard}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/dashboard'
                                        ? 'text-indigo-600 bg-indigo-50'
                                        : 'text-gray-700 hover:text-indigo-600'
                                    }`}
                            >
                                Dashboard
                            </button>
                        </div>
                    )}

                    {/* Right side - Auth buttons or User menu */}
                    <div className="flex items-center space-x-4">
                        {!isAuthenticated ? (
                            <>
                                <button
                                    onClick={handleSignIn}
                                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={handleGetStarted}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Get Started
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleProfile}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/profile'
                                            ? 'text-indigo-600 bg-indigo-50'
                                            : 'text-gray-700 hover:text-indigo-600'
                                        }`}
                                >
                                    Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        )}

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-700 hover:text-indigo-600 focus:outline-none focus:text-indigo-600"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {!isAuthenticated ? (
                                <>
                                    <a href="#" className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">
                                        Home
                                    </a>
                                    <a href="#" className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">
                                        About
                                    </a>
                                    <a href="#" className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">
                                        Pricing
                                    </a>
                                    <a href="#" className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">
                                        Contact Us
                                    </a>
                                    <button
                                        onClick={handleSignIn}
                                        className="text-gray-700 hover:text-indigo-600 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        onClick={handleGetStarted}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                                    >
                                        Get Started
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleDashboard}
                                        className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/dashboard'
                                                ? 'text-indigo-600 bg-indigo-50'
                                                : 'text-gray-700 hover:text-indigo-600'
                                            }`}
                                    >
                                        Dashboard
                                    </button>
                                    <button
                                        onClick={handleProfile}
                                        className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/profile'
                                                ? 'text-indigo-600 bg-indigo-50'
                                                : 'text-gray-700 hover:text-indigo-600'
                                            }`}
                                    >
                                        Profile
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-600 hover:bg-red-700 text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                                    >
                                        Logout
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar; 