import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Login = ({ onLogin, onSwitchToSignup, onShowForgotPassword }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email: formData.email,
                password: formData.password
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            toast.success('Login successful!');
            onLogin(response.data.user);
        } catch (err) {
            if (err.response) {
                toast.error(err.response.data.error || 'Login failed. Please try again.');
            } else if (err.request) {
                toast.error('Network error. Please check your connection and try again.');
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>

                    <div className="text-center space-y-2">
                        <button
                            type="button"
                            onClick={onSwitchToSignup}
                            className="text-indigo-600 hover:text-indigo-500 text-sm"
                        >
                            Don't have an account? Sign up
                        </button>

                        <div>
                            <button
                                type="button"
                                onClick={onShowForgotPassword}
                                className="text-gray-600 hover:text-gray-500 text-sm"
                            >
                                Forgot your password?
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login; 