/**
 * Rate Limiter Middleware
 * =======================
 * Protects API from abuse by limiting request frequency.
 * 
 * Different limits for different routes:
 * - General API: 100 requests per 15 minutes
 * - Auth routes: 5 requests per 15 minutes (stricter)
 * - Password reset: 3 requests per hour (very strict)
 */

const rateLimit = require('express-rate-limit');

/**
 * General API Rate Limiter
 * Applies to all API routes
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests. Please try again in 15 minutes.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  
  // Skip rate limiting for certain conditions (e.g., whitelisted IPs)
  skip: (req) => {
    // Skip for health check endpoint
    if (req.path === '/api/health') return true;
    return false;
  },
  
  // Custom key generator (default uses IP)
  keyGenerator: (req) => {
    return req.ip || req.headers['x-forwarded-for'] || 'unknown';
  },
});

/**
 * Strict Rate Limiter for Authentication Routes
 * Prevents brute force attacks on login/register
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Only 5 attempts per 15 minutes
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Count all requests
});

/**
 * Very Strict Limiter for Password Reset
 * Prevents abuse of password reset functionality
 */
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Only 3 attempts per hour
  message: {
    success: false,
    message: 'Too many password reset attempts. Please try again in 1 hour.',
    retryAfter: '1 hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Account Creation Limiter
 * Prevents spam account creation
 */
const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Only 3 accounts per hour per IP
  message: {
    success: false,
    message: 'Too many accounts created. Please try again in 1 hour.',
    retryAfter: '1 hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * API Intensive Operations Limiter
 * For heavy operations like analytics/reports
 */
const heavyOperationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: {
    success: false,
    message: 'Too many requests for this operation. Please wait a moment.',
    retryAfter: '1 minute',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
  createAccountLimiter,
  heavyOperationLimiter,
};

