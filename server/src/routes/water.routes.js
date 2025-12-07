/**
 * Water Intake Routes
 * ===================
 * Endpoints for water tracking.
 * 
 * Routes:
 * - GET    /api/water/today    - Get today's intake
 * - GET    /api/water/history  - Get intake history
 * - POST   /api/water          - Add water entry
 * - POST   /api/water/quick    - Quick add (presets)
 * - PUT    /api/water/target   - Update daily target
 * - DELETE /api/water/:entryId - Delete entry
 */

const express = require('express');
const { body, query } = require('express-validator');
const router = express.Router();

const {
  getToday,
  addEntry,
  quickAdd,
  deleteEntry,
  getHistory,
  updateTarget,
} = require('../controllers/water.controller');

const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

// All routes require authentication
router.use(protect);

// Validation rules
const addValidation = [
  body('amount')
    .isFloat({ min: 1, max: 5000 })
    .withMessage('Amount must be between 1 and 5000'),
  body('unit')
    .optional()
    .isIn(['ml', 'glass', 'bottle', 'liter'])
    .withMessage('Invalid unit'),
];

const quickValidation = [
  body('preset')
    .isIn(['small', 'glass', 'bottle', 'large'])
    .withMessage('Invalid preset'),
];

const targetValidation = [
  body('target')
    .isInt({ min: 500, max: 10000 })
    .withMessage('Target must be between 500 and 10000 ml'),
];

const historyValidation = [
  query('days')
    .optional()
    .isInt({ min: 1, max: 90 })
    .withMessage('Days must be between 1 and 90'),
];

// Routes
router.get('/today', getToday);
router.get('/history', historyValidation, validate, getHistory);
router.post('/', addValidation, validate, addEntry);
router.post('/quick', quickValidation, validate, quickAdd);
router.put('/target', targetValidation, validate, updateTarget);
router.delete('/:entryId', deleteEntry);

module.exports = router;

