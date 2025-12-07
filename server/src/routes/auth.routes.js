/**
 * Authentication Routes
 * =====================
 * Defines all endpoints for user authentication and profile management.
 * 
 * Route Structure:
 * - POST   /api/auth/register  - Create new account
 * - POST   /api/auth/login     - Login to account
 * - POST   /api/auth/refresh   - Refresh access token
 * - POST   /api/auth/logout    - Logout (invalidate refresh token)
 * - GET    /api/auth/me        - Get current user profile
 * - PUT    /api/auth/profile   - Update profile
 * - PUT    /api/auth/targets   - Update nutrition targets
 * - PUT    /api/auth/password  - Change password
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

// Import controller functions
const {
  register,
  login,
  refreshAccessToken,
  logout,
  getMe,
  updateProfile,
  updateTargets,
  changePassword,
} = require('../controllers/auth.controller');

// Import middleware
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

// ============================================
// VALIDATION RULES
// ============================================

const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
];

const refreshValidation = [
  body('userId')
    .notEmpty().withMessage('User ID is required')
    .isMongoId().withMessage('Invalid user ID'),
];

const profileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  
  body('profile.age')
    .optional()
    .isInt({ min: 1, max: 150 }).withMessage('Age must be between 1 and 150'),
  
  body('profile.height')
    .optional()
    .isFloat({ min: 50, max: 300 }).withMessage('Height must be between 50 and 300 cm'),
  
  body('profile.weight')
    .optional()
    .isFloat({ min: 20, max: 500 }).withMessage('Weight must be between 20 and 500 kg'),
  
  body('profile.gender')
    .optional()
    .isIn(['male', 'female', 'other', 'prefer-not-to-say'])
    .withMessage('Invalid gender option'),
  
  body('profile.activityLevel')
    .optional()
    .isIn(['sedentary', 'light', 'moderate', 'active', 'very-active'])
    .withMessage('Invalid activity level'),
  
  body('profile.goal')
    .optional()
    .isIn(['lose-weight', 'maintain', 'gain-weight', 'build-muscle'])
    .withMessage('Invalid goal option'),
];

const targetsValidation = [
  body('calories')
    .optional()
    .isInt({ min: 500, max: 10000 }).withMessage('Calories must be between 500 and 10000'),
  
  body('protein')
    .optional()
    .isInt({ min: 0, max: 500 }).withMessage('Protein must be between 0 and 500g'),
  
  body('carbs')
    .optional()
    .isInt({ min: 0, max: 1000 }).withMessage('Carbs must be between 0 and 1000g'),
  
  body('fat')
    .optional()
    .isInt({ min: 0, max: 500 }).withMessage('Fat must be between 0 and 500g'),
];

const passwordValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];

// ============================================
// ROUTES
// ============================================

// Public routes (no login required)
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/refresh', refreshValidation, validate, refreshAccessToken);

// Protected routes (login required)
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, profileValidation, validate, updateProfile);
router.put('/targets', protect, targetsValidation, validate, updateTargets);
router.put('/password', protect, passwordValidation, validate, changePassword);

module.exports = router;
