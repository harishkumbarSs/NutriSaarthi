/**
 * Authentication Middleware
 * =========================
 * Protects routes that require a logged-in user.
 * 
 * How JWT Authentication Works:
 * 1. User logs in with email/password
 * 2. Server validates and returns a JWT token
 * 3. Client stores token (localStorage/cookies)
 * 4. Client sends token with each request in Authorization header
 * 5. This middleware verifies the token and attaches user to request
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Protect routes - User must be logged in
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  // Format: "Bearer <token>"
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Extract token (remove "Bearer " prefix)
    token = authHeader.split(' ')[1];
  }

  // If no token found, user is not authenticated
  if (!token) {
    throw ApiError.unauthorized('Access denied. Please log in.');
  }

  try {
    // Verify the token
    // jwt.verify will throw an error if token is invalid or expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID from token payload
    // Select password field explicitly since we excluded it in schema
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      throw ApiError.unauthorized('User no longer exists');
    }

    if (!user.isActive) {
      throw ApiError.unauthorized('Account has been deactivated');
    }

    // Attach user to request object for use in route handlers
    req.user = user;
    
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      throw ApiError.unauthorized('Invalid token');
    }
    if (error.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Token has expired. Please log in again.');
    }
    throw error;
  }
});

/**
 * Optional authentication - Get user if logged in, but don't require it
 * Useful for routes that behave differently for logged-in users
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
    } catch (error) {
      // Token invalid, but that's okay for optional auth
      // Just continue without setting req.user
    }
  }

  next();
});

/**
 * Generate JWT token for a user
 * @param {string} userId - The user's MongoDB _id
 * @returns {string} - Signed JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { userId }, // Payload - data stored in token
    process.env.JWT_SECRET, // Secret key to sign the token
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } // Token expiration
  );
};

module.exports = {
  protect,
  optionalAuth,
  generateToken,
};

