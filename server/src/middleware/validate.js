/**
 * Validation Middleware
 * =====================
 * Checks for validation errors from express-validator
 * and returns appropriate error responses.
 */

const { validationResult } = require('express-validator');
const { sendError } = require('../utils/response');

/**
 * Validate request and return errors if any
 * This middleware should be used AFTER validation rules
 */
const validate = (req, res, next) => {
  // Get validation errors from the request
  const errors = validationResult(req);

  // If no errors, continue to the next middleware/controller
  if (errors.isEmpty()) {
    return next();
  }

  // Extract error messages
  const extractedErrors = errors.array().map((err) => ({
    field: err.path,
    message: err.msg,
  }));

  // Send validation error response
  return sendError(res, 400, 'Validation failed', extractedErrors);
};

module.exports = validate;

