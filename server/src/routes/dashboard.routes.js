/**
 * Dashboard Routes
 * ================
 * Analytics and summary endpoints for the dashboard.
 * 
 * Route Structure:
 * - GET /api/dashboard           - Complete dashboard data (optimized)
 * - GET /api/dashboard/today     - Today's nutrition summary
 * - GET /api/dashboard/trends    - Calorie trends over time
 * - GET /api/dashboard/macros    - Macro nutrient breakdown
 * - GET /api/dashboard/meal-distribution - Meal type distribution
 * - GET /api/dashboard/weekly-overview   - Weekly summary
 */

const express = require('express');
const { query } = require('express-validator');
const router = express.Router();

// Import controller functions
const {
  getTodaySummary,
  getCalorieTrends,
  getMacroBreakdown,
  getMealDistribution,
  getWeeklyOverview,
  getDashboardData,
} = require('../controllers/dashboard.controller');

// Import middleware
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

// ============================================
// VALIDATION RULES
// ============================================

const trendsValidation = [
  query('period')
    .optional()
    .isIn(['7d', '14d', '30d', '90d'])
    .withMessage('Period must be 7d, 14d, 30d, or 90d'),
];

const macrosValidation = [
  query('date')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date must be in YYYY-MM-DD format'),
  query('period')
    .optional()
    .isIn(['day', 'week', 'month'])
    .withMessage('Period must be day, week, or month'),
];

const distributionValidation = [
  query('days')
    .optional()
    .isInt({ min: 1, max: 90 })
    .withMessage('Days must be between 1 and 90'),
];

// ============================================
// ROUTES
// ============================================

// All dashboard routes require authentication
router.use(protect);

// Main dashboard endpoint (optimized single call)
router.get('/', getDashboardData);

// Individual analytics endpoints
router.get('/today', getTodaySummary);
router.get('/trends', trendsValidation, validate, getCalorieTrends);
router.get('/macros', macrosValidation, validate, getMacroBreakdown);
router.get('/meal-distribution', distributionValidation, validate, getMealDistribution);
router.get('/weekly-overview', getWeeklyOverview);

module.exports = router;

