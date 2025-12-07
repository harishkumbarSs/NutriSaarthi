/**
 * Error Handler Middleware
 * ========================
 * Centralized error handling for the entire application.
 * This catches all errors and sends consistent responses.
 */

const ApiError = require('../utils/ApiError');

/**
 * Convert non-ApiError errors to ApiError
 * This ensures all errors have a status code
 */
const normalizeError = (err) => {
  // If it's already an ApiError, return as-is
  if (err instanceof ApiError) {
    return err;
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return ApiError.badRequest(messages.join(', '));
  }

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return ApiError.conflict(`${field} already exists`);
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return ApiError.badRequest(`Invalid ${err.path}: ${err.value}`);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return ApiError.unauthorized('Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return ApiError.unauthorized('Token has expired');
  }

  // Default to internal server error
  return ApiError.internal(err.message || 'Something went wrong');
};

/**
 * Global error handler middleware
 * Must have 4 parameters for Express to recognize it
 */
const errorHandler = (err, req, res, next) => {
  // Normalize the error
  const error = normalizeError(err);

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      message: error.message,
      statusCode: error.statusCode,
      stack: err.stack,
    });
  }

  // Send error response
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
    }),
  });
};

module.exports = errorHandler;

