/**
 * Meal Plan Routes
 * ================
 * Endpoints for meal planning and scheduling.
 */

const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();

const {
  getCurrentPlan,
  getPlan,
  getPlans,
  addMeal,
  updateMeal,
  deleteMeal,
  completeMeal,
  saveAsTemplate,
  applyTemplate,
} = require('../controllers/mealPlan.controller');

const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

// All routes require authentication
router.use(protect);

// Validation rules
const addMealValidation = [
  param('dayOfWeek')
    .isInt({ min: 0, max: 6 })
    .withMessage('Day must be 0-6 (Sunday-Saturday)'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Meal name is required')
    .isLength({ max: 100 })
    .withMessage('Name too long'),
  body('mealType')
    .isIn(['breakfast', 'lunch', 'dinner', 'snack'])
    .withMessage('Invalid meal type'),
  body('time')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Time must be in HH:mm format'),
];

const updateMealValidation = [
  param('dayOfWeek')
    .isInt({ min: 0, max: 6 })
    .withMessage('Day must be 0-6'),
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 }),
  body('mealType')
    .optional()
    .isIn(['breakfast', 'lunch', 'dinner', 'snack']),
  body('time')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
];

// Routes
router.get('/current', getCurrentPlan);
router.get('/', getPlans);
router.get('/:id', getPlan);

// Meal management within plans
router.post('/:planId/days/:dayOfWeek/meals', addMealValidation, validate, addMeal);
router.put('/:planId/days/:dayOfWeek/meals/:mealId', updateMealValidation, validate, updateMeal);
router.delete('/:planId/days/:dayOfWeek/meals/:mealId', deleteMeal);
router.post('/:planId/days/:dayOfWeek/meals/:mealId/complete', completeMeal);

// Templates
router.post('/:planId/save-template', saveAsTemplate);
router.post('/apply-template/:templateId', applyTemplate);

module.exports = router;

