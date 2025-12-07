/**
 * Recommendation Routes
 * =====================
 * AI-powered nutrition recommendation endpoints.
 * 
 * Route Structure:
 * - GET /api/recommendations              - Daily personalized recommendations
 * - GET /api/recommendations/meals/:type  - Meal suggestions
 * - GET /api/recommendations/insights     - Weekly insights
 */

const express = require('express');
const router = express.Router();

const {
  getRecommendations,
  getSuggestions,
  getInsights,
} = require('../controllers/recommendation.controller');

const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.get('/', getRecommendations);
router.get('/meals/:mealType', getSuggestions);
router.get('/insights', getInsights);

module.exports = router;

