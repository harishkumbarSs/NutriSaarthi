/**
 * Meal Routes
 * ===========
 * All API endpoints for meal management.
 * 
 * Route Structure:
 * - POST    /api/meals              - Create new meal
 * - GET     /api/meals              - Get all meals (paginated)
 * - GET     /api/meals/:id          - Get single meal
 * - PUT     /api/meals/:id          - Update meal
 * - DELETE  /api/meals/:id          - Delete meal
 * - PATCH   /api/meals/:id/favorite - Toggle favorite
 * - GET     /api/meals/date/:date   - Get meals by date
 * - POST    /api/meals/:id/duplicate - Duplicate a meal
 * - DELETE  /api/meals/bulk         - Bulk delete meals
 */

const express = require('express');
const { body, param, query } = require('express-validator');
const router = express.Router();

// Import controller functions
const {
  createMeal,
  getMeals,
  getMealById,
  updateMeal,
  deleteMeal,
  toggleFavorite,
  getMealsByDate,
  duplicateMeal,
  bulkDeleteMeals,
} = require('../controllers/meal.controller');

// Import middleware
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

// ============================================
// VALIDATION RULES
// ============================================

const mealValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Meal name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  
  body('mealType')
    .notEmpty().withMessage('Meal type is required')
    .isIn(['breakfast', 'lunch', 'dinner', 'snack'])
    .withMessage('Invalid meal type'),
  
  body('nutrition.calories')
    .notEmpty().withMessage('Calories are required')
    .isFloat({ min: 0, max: 10000 }).withMessage('Calories must be 0-10000'),
  
  body('nutrition.protein')
    .optional()
    .isFloat({ min: 0 }).withMessage('Protein cannot be negative'),
  
  body('nutrition.carbs')
    .optional()
    .isFloat({ min: 0 }).withMessage('Carbs cannot be negative'),
  
  body('nutrition.fat')
    .optional()
    .isFloat({ min: 0 }).withMessage('Fat cannot be negative'),
  
  body('consumedAt')
    .optional()
    .isISO8601().withMessage('Invalid date format'),
  
  body('servingSize.amount')
    .optional()
    .isFloat({ min: 0.1 }).withMessage('Serving size must be at least 0.1'),
  
  body('servingSize.unit')
    .optional()
    .isIn(['g', 'ml', 'oz', 'cup', 'tbsp', 'tsp', 'piece', 'serving'])
    .withMessage('Invalid serving unit'),
];

const mealUpdateValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('Name must be 1-100 characters'),
  
  body('mealType')
    .optional()
    .isIn(['breakfast', 'lunch', 'dinner', 'snack'])
    .withMessage('Invalid meal type'),
  
  body('nutrition.calories')
    .optional()
    .isFloat({ min: 0, max: 10000 }).withMessage('Calories must be 0-10000'),
];

const idValidation = [
  param('id')
    .isMongoId().withMessage('Invalid meal ID'),
];

const dateValidation = [
  param('date')
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be in YYYY-MM-DD format'),
];

const bulkDeleteValidation = [
  body('ids')
    .isArray({ min: 1 }).withMessage('IDs must be a non-empty array')
    .custom((ids) => ids.every((id) => /^[a-fA-F0-9]{24}$/.test(id)))
    .withMessage('All IDs must be valid MongoDB ObjectIds'),
];

// ============================================
// ROUTES
// ============================================

// All meal routes require authentication
router.use(protect);

// Special routes (must be before /:id routes to avoid conflict)
router.get('/date/:date', dateValidation, validate, getMealsByDate);
router.delete('/bulk', bulkDeleteValidation, validate, bulkDeleteMeals);

// Standard CRUD routes
router.route('/')
  .post(mealValidation, validate, createMeal)
  .get(getMeals);

router.route('/:id')
  .get(idValidation, validate, getMealById)
  .put(idValidation, mealUpdateValidation, validate, updateMeal)
  .delete(idValidation, validate, deleteMeal);

// Additional actions
router.patch('/:id/favorite', idValidation, validate, toggleFavorite);
router.post('/:id/duplicate', idValidation, validate, duplicateMeal);

module.exports = router;

