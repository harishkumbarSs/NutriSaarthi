/**
 * API Response Utilities
 * ======================
 * These helper functions ensure consistent API response formatting.
 * 
 * Why consistent responses?
 * - Frontend always knows what to expect
 * - Easier to handle errors and success cases
 * - Professional API design
 */

/**
 * Send a success response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code (200, 201, etc.)
 * @param {string} message - Success message
 * @param {object} data - Data to send (optional)
 */
const sendSuccess = (res, statusCode, message, data = null) => {
  const response = {
    success: true,
    message,
  };

  // Only add data field if we have data to send
  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send an error response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code (400, 401, 404, 500, etc.)
 * @param {string} message - Error message
 * @param {object} errors - Validation errors or additional info (optional)
 */
const sendError = (res, statusCode, message, errors = null) => {
  const response = {
    success: false,
    message,
  };

  // Add validation errors if provided
  if (errors !== null) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send a paginated response
 * @param {object} res - Express response object
 * @param {string} message - Success message
 * @param {object} options - Pagination options
 */
const sendPaginated = (res, message, { data, page, limit, total }) => {
  const totalPages = Math.ceil(total / limit);
  
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
};

module.exports = {
  sendSuccess,
  sendError,
  sendPaginated,
};

