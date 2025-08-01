const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
    generateAccessToken,
    generateRefreshToken,
    hashPassword,
    comparePassword,
    authenticateToken
} = require('../utils/auth');

const router = express.Router();

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via email (mock implementation)
const sendOTPEmail = (email, otp) => {
    console.log(`OTP ${otp} sent to ${email}`);
    // In production, integrate with email service like SendGrid, AWS SES, etc.
};

// Signup with OTP
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Generate and store OTP
        const otp = generateOTP();
        otpStore.set(email, {
            otp,
            name,
            password: await hashPassword(password),
            purpose: 'registration',
            createdAt: new Date()
        });

        // Send OTP via email
        sendOTPEmail(email, otp);

        res.json({ message: 'OTP sent to your email' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Verify signup OTP
router.post('/verify-signup', async (req, res) => {
    try {
        const { email, otp } = req.body;

        const storedData = otpStore.get(email);
        if (!storedData || storedData.purpose !== 'registration') {
            return res.status(400).json({ error: 'Invalid OTP or email' });
        }

        if (storedData.otp !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        // Check if OTP is expired (15 minutes)
        const now = new Date();
        const otpAge = now - storedData.createdAt;
        if (otpAge > 15 * 60 * 1000) {
            otpStore.delete(email);
            return res.status(400).json({ error: 'OTP expired' });
        }

        // Create user
        const user = await User.create({
            name: storedData.name,
            email,
            password: storedData.password
        });

        // Clear OTP
        otpStore.delete(email);

        // Generate tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Set cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            message: 'User created successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Verify signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Resend signup OTP
router.post('/resend-signup-otp', async (req, res) => {
    try {
        const { email } = req.body;

        const storedData = otpStore.get(email);
        if (!storedData || storedData.purpose !== 'registration') {
            return res.status(400).json({ error: 'No pending registration found' });
        }

        // Generate new OTP
        const otp = generateOTP();
        storedData.otp = otp;
        storedData.createdAt = new Date();

        // Send OTP via email
        sendOTPEmail(email, otp);

        res.json({ message: 'OTP resent successfully' });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Email not found' });
        }

        // Generate and store OTP
        const otp = generateOTP();
        otpStore.set(email, {
            otp,
            purpose: 'reset-password',
            createdAt: new Date()
        });

        // Send OTP via email
        sendOTPEmail(email, otp);

        res.json({ message: 'OTP sent to your email' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Verify reset password OTP
router.post('/verify-reset-password', async (req, res) => {
    try {
        const { email, otp } = req.body;

        const storedData = otpStore.get(email);
        if (!storedData || storedData.purpose !== 'reset-password') {
            return res.status(400).json({ error: 'Invalid OTP or email' });
        }

        if (storedData.otp !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        // Check if OTP is expired (15 minutes)
        const now = new Date();
        const otpAge = now - storedData.createdAt;
        if (otpAge > 15 * 60 * 1000) {
            otpStore.delete(email);
            return res.status(400).json({ error: 'OTP expired' });
        }

        res.json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Verify reset password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Reset password
router.post('/reset-password', async (req, res) => {
    try {
        const { email, password } = req.body;

        const storedData = otpStore.get(email);
        if (!storedData || storedData.purpose !== 'reset-password') {
            return res.status(400).json({ error: 'No pending password reset found' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        // Update user password
        const hashedPassword = await hashPassword(password);
        await User.update(
            { password: hashedPassword },
            { where: { email } }
        );

        // Clear OTP
        otpStore.delete(email);

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Resend reset password OTP
router.post('/resend-reset-otp', async (req, res) => {
    try {
        const { email } = req.body;

        const storedData = otpStore.get(email);
        if (!storedData || storedData.purpose !== 'reset-password') {
            return res.status(400).json({ error: 'No pending password reset found' });
        }

        // Generate new OTP
        const otp = generateOTP();
        storedData.otp = otp;
        storedData.createdAt = new Date();

        // Send OTP via email
        sendOTPEmail(email, otp);

        res.json({ message: 'OTP resent successfully' });
    } catch (error) {
        console.error('Resend reset OTP error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
});

// Get current user
router.get('/me', authenticateToken, (req, res) => {
    res.json({
        user: {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        }
    });
});

// Refresh token
router.post('/refresh', (req, res) => {
    const { refreshToken } = require('../utils/auth');
    return refreshToken(req, res);
});

module.exports = router; 