import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ForgotPassword = ({ onBack, onShowOTP }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post('http://localhost:5000/api/auth/forgot-password', {
                email
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            toast.success('OTP sent to your email!');
            onShowOTP(email, 'reset-password');
        } catch (err) {
            if (err.response) {
                toast.error(err.response.data.error || 'Failed to send OTP');
            } else if (err.request) {
                toast.error('Network error. Please try again.');
            } else {
                toast.error('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Forgot Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your email to receive a reset code
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="sr-only">Email address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : 'Send Reset Code'}
                        </button>
                    </div>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={onBack}
                            className="text-indigo-600 hover:text-indigo-500 text-sm"
                        >
                            ← Back to Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword; 