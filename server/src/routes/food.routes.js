/**
 * Food Routes
 * ===========
 * Endpoints for food search and nutrition lookup.
 * 
 * Routes:
 * - GET /api/foods/search     - Search foods by name
 * - GET /api/foods/popular    - Get popular foods
 * - GET /api/foods/categories - Get all categories
 * - GET /api/foods/category/:category - Get foods by category
 * - GET /api/foods/:id        - Get food details by ID
 */

const express = require('express');
const router = express.Router();

const {
  search,
  getFood,
  listCategories,
  byCategory,
  getPopular,
} = require('../controllers/food.controller');

const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Search and browse routes
router.get('/search', search);
router.get('/popular', getPopular);
router.get('/categories', listCategories);
router.get('/category/:category', byCategory);

// Get specific food
router.get('/:id', getFood);

module.exports = router;

