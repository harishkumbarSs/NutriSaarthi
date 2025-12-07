/**
 * Authentication Middleware
 * =========================
 * Protects routes and handles JWT + Refresh Token authentication.
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// Token expiration times
const ACCESS_TOKEN_EXPIRY = '15m'; // Short-lived access token
const REFRESH_TOKEN_EXPIRY_DAYS = 7; // Long-lived refresh token

/**
 * Protect routes - User must be logged in
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    throw ApiError.unauthorized('Access denied. Please log in.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      throw ApiError.unauthorized('User no longer exists');
    }

    if (!user.isActive) {
      throw ApiError.unauthorized('Account has been deactivated');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw ApiError.unauthorized('Invalid token');
    }
    if (error.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Token has expired. Please refresh your token.');
    }
    throw error;
  }
});

/**
 * Optional authentication
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      }
    } catch {
      // Token invalid, continue without user
    }
  }

  next();
});

/**
 * Generate short-lived access token
 */
const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

/**
 * Generate long-lived refresh token
 * Uses crypto for secure random generation
 */
const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
};

/**
 * Save refresh token to user
 */
const saveRefreshToken = async (userId, refreshToken) => {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);
  
  await User.findByIdAndUpdate(userId, {
    refreshToken: crypto.createHash('sha256').update(refreshToken).digest('hex'),
    refreshTokenExpiry: expiry,
  });
};

/**
 * Verify refresh token
 */
const verifyRefreshToken = async (userId, refreshToken) => {
  const user = await User.findById(userId).select('+refreshToken +refreshTokenExpiry');
  
  if (!user || !user.refreshToken) {
    return null;
  }

  const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
  
  if (user.refreshToken !== hashedToken) {
    return null;
  }

  if (user.refreshTokenExpiry < new Date()) {
    // Token expired, clear it
    await User.findByIdAndUpdate(userId, {
      refreshToken: null,
      refreshTokenExpiry: null,
    });
    return null;
  }

  return user;
};

/**
 * Clear refresh token (logout)
 */
const clearRefreshToken = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    refreshToken: null,
    refreshTokenExpiry: null,
  });
};

/**
 * Generate both tokens (for login/register)
 */
const generateTokens = async (userId) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken();
  
  await saveRefreshToken(userId, refreshToken);
  
  return { accessToken, refreshToken };
};

// Legacy support - generate simple token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = {
  protect,
  optionalAuth,
  generateToken,
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  saveRefreshToken,
  verifyRefreshToken,
  clearRefreshToken,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY_DAYS,
};
