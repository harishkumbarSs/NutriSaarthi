/**
 * Async Handler Wrapper
 * =====================
 * This is a utility function that wraps our async route handlers.
 * 
 * Why do we need this?
 * - Express doesn't automatically catch errors in async functions
 * - Without this, we'd need try-catch in EVERY route handler
 * - This wrapper catches errors and passes them to our error middleware
 * 
 * Before (repetitive):
 * ```
 * app.get('/users', async (req, res, next) => {
 *   try {
 *     const users = await User.find();
 *     res.json(users);
 *   } catch (error) {
 *     next(error);
 *   }
 * });
 * ```
 * 
 * After (clean):
 * ```
 * app.get('/users', asyncHandler(async (req, res) => {
 *   const users = await User.find();
 *   res.json(users);
 * }));
 * ```
 */

/**
 * Wraps an async function and catches any errors
 * @param {Function} fn - The async route handler function
 * @returns {Function} - A wrapped function that catches errors
 */
const asyncHandler = (fn) => {
  // Return a new function that Express will use as the route handler
  return (req, res, next) => {
    // Execute the async function and catch any errors
    // Promise.resolve() ensures we can handle both sync and async functions
    Promise.resolve(fn(req, res, next)).catch(next);
    // .catch(next) is shorthand for .catch((error) => next(error))
    // This passes any error to Express's error handling middleware
  };
};

module.exports = asyncHandler;

