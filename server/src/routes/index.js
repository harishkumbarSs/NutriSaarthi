/**
 * API Routes Index
 * ================
 * Central place to register all API routes.
 * This keeps our main index.js clean and organized.
 */

const express = require('express');
const router = express.Router();

// We'll add routes as we build each feature:
// router.use('/auth', require('./auth.routes'));
// router.use('/meals', require('./meal.routes'));
// router.use('/users', require('./user.routes'));
// router.use('/dashboard', require('./dashboard.routes'));

// Placeholder route
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'NutriSaarthi API v1',
    endpoints: {
      health: 'GET /api/health',
      auth: 'Coming soon...',
      meals: 'Coming soon...',
      dashboard: 'Coming soon...',
    },
  });
});

module.exports = router;

