/**
 * Food Controller
 * ===============
 * Handles food search and nutrition lookup endpoints.
 */

const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const ApiError = require('../utils/ApiError');
const {
  searchFoods,
  getFoodById,
  getCategories,
  getFoodsByCategory,
} = require('../services/foodDatabase.service');

/**
 * @desc    Search foods by name
 * @route   GET /api/foods/search
 * @access  Private
 * @query   q - search query (required)
 * @query   limit - max results (default 25)
 * @query   includeUSDA - include USDA results (default true)
 */
const search = asyncHandler(async (req, res) => {
  const { q, limit = 25, includeUSDA = 'true' } = req.query;

  if (!q || q.trim().length < 2) {
    throw ApiError.badRequest('Search query must be at least 2 characters');
  }

  const results = await searchFoods(q.trim(), {
    limit: parseInt(limit, 10),
    includeUSDA: includeUSDA === 'true',
  });

  sendSuccess(res, 200, 'Search completed', results);
});

/**
 * @desc    Get food details by ID
 * @route   GET /api/foods/:id
 * @access  Private
 */
const getFood = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const food = await getFoodById(id);

  if (!food) {
    throw ApiError.notFound('Food not found');
  }

  sendSuccess(res, 200, 'Food retrieved', { food });
});

/**
 * @desc    Get all food categories
 * @route   GET /api/foods/categories
 * @access  Private
 */
const listCategories = asyncHandler(async (req, res) => {
  const categories = getCategories();

  sendSuccess(res, 200, 'Categories retrieved', { categories });
});

/**
 * @desc    Get foods by category
 * @route   GET /api/foods/category/:category
 * @access  Private
 */
const byCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;

  const foods = getFoodsByCategory(category);

  if (foods.length === 0) {
    throw ApiError.notFound('No foods found in this category');
  }

  sendSuccess(res, 200, 'Foods retrieved', { 
    category,
    foods,
    count: foods.length,
  });
});

/**
 * @desc    Get popular/common foods
 * @route   GET /api/foods/popular
 * @access  Private
 */
const getPopular = asyncHandler(async (req, res) => {
  // Return a curated list of popular foods
  const { searchFoods: search } = require('../services/foodDatabase.service');
  
  const results = await search('', { limit: 15, includeUSDA: false });

  sendSuccess(res, 200, 'Popular foods retrieved', {
    foods: results.foods,
    count: results.foods.length,
  });
});

module.exports = {
  search,
  getFood,
  listCategories,
  byCategory,
  getPopular,
};

