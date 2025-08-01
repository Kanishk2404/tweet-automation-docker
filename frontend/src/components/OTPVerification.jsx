import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const OTPVerification = ({ email, purpose, onSuccess, onBack }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleOtpChange = (index, value) => {
        if (value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Auto-focus next input
            if (value && index < 5) {
                const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`);
                if (nextInput) nextInput.focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');

        if (otpString.length !== 6) {
            toast.error('Please enter a 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const endpoint = purpose === 'registration' ? '/api/auth/verify-signup' : '/api/auth/verify-reset-password';
            const response = await axios.post(`http://localhost:5000${endpoint}`, {
                email,
                otp: otpString
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            toast.success(purpose === 'registration' ? 'Account created successfully!' : 'OTP verified successfully!');
            onSuccess(response.data.user || response.data);
        } catch (err) {
            if (err.response) {
                toast.error(err.response.data.error || 'OTP verification failed');
            } else if (err.request) {
                toast.error('Network error. Please try again.');
            } else {
                toast.error('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setResendLoading(true);
        try {
            const endpoint = purpose === 'registration' ? '/api/auth/resend-signup-otp' : '/api/auth/resend-reset-otp';
            await axios.post(`http://localhost:5000${endpoint}`, { email }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            toast.success('OTP sent successfully!');
            setCountdown(60);
        } catch (err) {
            if (err.response) {
                toast.error(err.response.data.error || 'Failed to resend OTP');
            } else {
                toast.error('Network error. Please try again.');
            }
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Verify OTP
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        We've sent a 6-digit code to {email}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Enter OTP
                        </label>
                        <div className="flex justify-center space-x-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    name={`otp-${index}`}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg font-semibold"
                                    placeholder="0"
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading || otp.join('').length !== 6}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </div>

                    <div className="text-center space-y-2">
                        <button
                            type="button"
                            onClick={handleResendOTP}
                            disabled={resendLoading || countdown > 0}
                            className="text-indigo-600 hover:text-indigo-500 text-sm disabled:opacity-50"
                        >
                            {resendLoading ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                        </button>

                        <div>
                            <button
                                type="button"
                                onClick={onBack}
                                className="text-gray-600 hover:text-gray-500 text-sm"
                            >
                                ← Back
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OTPVerification; 