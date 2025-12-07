/**
 * Custom API Error Class
 * ======================
 * This extends JavaScript's built-in Error class to add:
 * - HTTP status codes
 * - Success flag for consistent API responses
 * 
 * Why do we need this?
 * - Standard Error doesn't have status codes
 * - We want consistent error handling across the app
 * - Makes our error responses predictable for the frontend
 */

class ApiError extends Error {
  /**
   * Create a new API Error
   * @param {string} message - Error message to display
   * @param {number} statusCode - HTTP status code (400, 401, 404, 500, etc.)
   */
  constructor(message, statusCode) {
    // Call the parent Error constructor with the message
    super(message);
    
    // Add our custom properties
    this.statusCode = statusCode;
    this.success = false;
    
    // This ensures the error stack trace starts from where we created the error
    // (not from inside this constructor)
    Error.captureStackTrace(this, this.constructor);
  }

  // Factory methods for common error types
  // These make our code more readable

  /**
   * 400 Bad Request - User sent invalid data
   */
  static badRequest(message = 'Bad Request') {
    return new ApiError(message, 400);
  }

  /**
   * 401 Unauthorized - User not logged in
   */
  static unauthorized(message = 'Unauthorized') {
    return new ApiError(message, 401);
  }

  /**
   * 403 Forbidden - User logged in but not allowed
   */
  static forbidden(message = 'Forbidden') {
    return new ApiError(message, 403);
  }

  /**
   * 404 Not Found - Resource doesn't exist
   */
  static notFound(message = 'Resource not found') {
    return new ApiError(message, 404);
  }

  /**
   * 409 Conflict - Resource already exists
   */
  static conflict(message = 'Resource already exists') {
    return new ApiError(message, 409);
  }

  /**
   * 500 Internal Server Error - Something broke on our end
   */
  static internal(message = 'Internal Server Error') {
    return new ApiError(message, 500);
  }
}

module.exports = ApiError;

