/**
 * Dashboard Routes
 * ================
 * Analytics and summary endpoints for the dashboard.
 * Includes Redis caching for performance optimization.
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
const { cacheMiddleware } = require('../middleware/cacheMiddleware');

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
// CACHE CONFIGURATION
// ============================================

// Cache dashboard data for 2 minutes
const dashboardCache = cacheMiddleware({
  ttl: 120,
  userSpecific: true,
});

// Cache trends for 5 minutes (less frequently updated)
const trendsCache = cacheMiddleware({
  ttl: 300,
  userSpecific: true,
});

// ============================================
// ROUTES
// ============================================

// All dashboard routes require authentication
router.use(protect);

// Main dashboard endpoint (optimized single call)
router.get('/', dashboardCache, getDashboardData);

// Individual analytics endpoints
router.get('/today', dashboardCache, getTodaySummary);
router.get('/trends', trendsCache, trendsValidation, validate, getCalorieTrends);
router.get('/macros', dashboardCache, macrosValidation, validate, getMacroBreakdown);
router.get('/meal-distribution', trendsCache, distributionValidation, validate, getMealDistribution);
router.get('/weekly-overview', trendsCache, getWeeklyOverview);

module.exports = router;
