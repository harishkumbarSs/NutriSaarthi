/**
 * Recommendation Controller
 * =========================
 * Exposes recommendation service via API endpoints.
 */

const {
  generateDailyRecommendations,
  getMealSuggestions,
  getWeeklyInsights,
} = require('../services/recommendation.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');

/**
 * @desc    Get daily personalized recommendations
 * @route   GET /api/recommendations
 * @access  Private
 */
const getRecommendations = asyncHandler(async (req, res) => {
  const recommendations = await generateDailyRecommendations(req.user._id);

  sendSuccess(res, 200, 'Recommendations generated', {
    count: recommendations.length,
    recommendations,
  });
});

/**
 * @desc    Get meal suggestions for a specific meal type
 * @route   GET /api/recommendations/meals/:mealType
 * @access  Private
 */
const getSuggestions = asyncHandler(async (req, res) => {
  const { mealType } = req.params;
  
  const validTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
  if (!validTypes.includes(mealType)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid meal type. Use: breakfast, lunch, dinner, or snack',
    });
  }

  const suggestions = await getMealSuggestions(req.user._id, mealType);

  sendSuccess(res, 200, `${mealType} suggestions retrieved`, suggestions);
});

/**
 * @desc    Get weekly insights and patterns
 * @route   GET /api/recommendations/insights
 * @access  Private
 */
const getInsights = asyncHandler(async (req, res) => {
  const insights = await getWeeklyInsights(req.user._id);

  sendSuccess(res, 200, 'Weekly insights generated', insights);
});

module.exports = {
  getRecommendations,
  getSuggestions,
  getInsights,
};

