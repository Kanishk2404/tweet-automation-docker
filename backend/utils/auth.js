const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production';

// Generate access token (15 minutes)
const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
};

// Generate refresh token (7 days)
const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// Hash password
const hashPassword = async (password) => {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
};

// Compare password
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// Verify access token
const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

// Verify refresh token
const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET);
    } catch (error) {
        return null;
    }
};

// Authentication middleware
const authenticateToken = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = verifyAccessToken(accessToken);
    if (!decoded) {
        return res.status(403).json({ error: 'Invalid or expired access token' });
    }

    try {
        const user = await User.findByPk(decoded.userId);
        if (!user) {
            return res.status(403).json({ error: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ error: 'Authentication error' });
    }
};

// Refresh token middleware
const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token required' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
        return res.status(403).json({ error: 'Invalid or expired refresh token' });
    }

    try {
        const user = await User.findByPk(decoded.userId);
        if (!user) {
            return res.status(403).json({ error: 'User not found' });
        }

        // Generate new tokens
        const newAccessToken = generateAccessToken(user.id);
        const newRefreshToken = generateRefreshToken(user.id);

        // Set new tokens in HTTP-only cookies
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            message: 'Tokens refreshed successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(500).json({ error: 'Token refresh error' });
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    hashPassword,
    comparePassword,
    verifyAccessToken,
    verifyRefreshToken,
    authenticateToken,
    refreshToken
}; 