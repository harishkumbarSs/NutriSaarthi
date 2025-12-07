/**
 * Meal Controller
 * ===============
 * Handles all CRUD operations for meals.
 * 
 * CRUD = Create, Read, Update, Delete
 * These are the basic operations for any data in an application.
 */

const Meal = require('../models/Meal');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendPaginated } = require('../utils/response');

/**
 * @desc    Create a new meal entry
 * @route   POST /api/meals
 * @access  Private
 */
const createMeal = asyncHandler(async (req, res) => {
  // Add the user ID from the auth token
  const mealData = {
    ...req.body,
    user: req.user._id,
  };

  // Create the meal
  const meal = await Meal.create(mealData);

  sendSuccess(res, 201, 'Meal logged successfully!', { meal });
});

/**
 * @desc    Get all meals for the logged-in user with pagination
 * @route   GET /api/meals
 * @access  Private
 * 
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10, max: 50)
 * - sort: Sort field (default: -consumedAt = newest first)
 * - mealType: Filter by meal type
 * - startDate: Filter meals from this date
 * - endDate: Filter meals until this date
 * - favorite: Filter favorites only (true/false)
 */
const getMeals = asyncHandler(async (req, res) => {
  // Parse query parameters with defaults
  const page = parseInt(req.query.page, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50); // Max 50
  const skip = (page - 1) * limit;

  // Build filter query
  const filter = { user: req.user._id };

  // Filter by meal type
  if (req.query.mealType) {
    filter.mealType = req.query.mealType;
  }

  // Filter by date range
  if (req.query.startDate || req.query.endDate) {
    filter.consumedAt = {};
    
    if (req.query.startDate) {
      filter.consumedAt.$gte = new Date(req.query.startDate);
    }
    
    if (req.query.endDate) {
      const endDate = new Date(req.query.endDate);
      endDate.setHours(23, 59, 59, 999);
      filter.consumedAt.$lte = endDate;
    }
  }

  // Filter favorites
  if (req.query.favorite === 'true') {
    filter.isFavorite = true;
  }

  // Build sort object
  // Format: "field" for ascending, "-field" for descending
  const sortField = req.query.sort || '-consumedAt';
  const sortOrder = sortField.startsWith('-') ? -1 : 1;
  const sortKey = sortField.replace('-', '');
  const sort = { [sortKey]: sortOrder };

  // Execute query with pagination
  const [meals, total] = await Promise.all([
    Meal.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(), // .lean() returns plain JS objects (faster, less memory)
    Meal.countDocuments(filter),
  ]);

  sendPaginated(res, 'Meals retrieved successfully', {
    data: meals,
    page,
    limit,
    total,
  });
});

/**
 * @desc    Get a single meal by ID
 * @route   GET /api/meals/:id
 * @access  Private
 */
const getMealById = asyncHandler(async (req, res) => {
  const meal = await Meal.findOne({
    _id: req.params.id,
    user: req.user._id, // Ensure user owns this meal
  });

  if (!meal) {
    throw ApiError.notFound('Meal not found');
  }

  sendSuccess(res, 200, 'Meal retrieved successfully', { meal });
});

/**
 * @desc    Update a meal
 * @route   PUT /api/meals/:id
 * @access  Private
 */
const updateMeal = asyncHandler(async (req, res) => {
  // Find the meal first
  let meal = await Meal.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!meal) {
    throw ApiError.notFound('Meal not found');
  }

  // Remove fields that shouldn't be updated
  const { user, _id, createdAt, updatedAt, ...updateData } = req.body;

  // Update the meal
  meal = await Meal.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  sendSuccess(res, 200, 'Meal updated successfully', { meal });
});

/**
 * @desc    Delete a meal
 * @route   DELETE /api/meals/:id
 * @access  Private
 */
const deleteMeal = asyncHandler(async (req, res) => {
  const meal = await Meal.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!meal) {
    throw ApiError.notFound('Meal not found');
  }

  sendSuccess(res, 200, 'Meal deleted successfully');
});

/**
 * @desc    Toggle favorite status
 * @route   PATCH /api/meals/:id/favorite
 * @access  Private
 */
const toggleFavorite = asyncHandler(async (req, res) => {
  const meal = await Meal.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!meal) {
    throw ApiError.notFound('Meal not found');
  }

  meal.isFavorite = !meal.isFavorite;
  await meal.save();

  sendSuccess(res, 200, `Meal ${meal.isFavorite ? 'added to' : 'removed from'} favorites`, {
    isFavorite: meal.isFavorite,
  });
});

/**
 * @desc    Get meals by specific date (helper for calendar view)
 * @route   GET /api/meals/date/:date
 * @access  Private
 */
const getMealsByDate = asyncHandler(async (req, res) => {
  const { date } = req.params; // Format: YYYY-MM-DD

  // Parse the date and create start/end of day
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // Get meals and group by meal type
  const meals = await Meal.find({
    user: req.user._id,
    consumedAt: { $gte: startOfDay, $lte: endOfDay },
  }).sort({ consumedAt: 1 });

  // Get daily summary
  const summary = await Meal.getDailySummary(req.user._id, new Date(date));

  // Group meals by type
  const grouped = {
    breakfast: meals.filter((m) => m.mealType === 'breakfast'),
    lunch: meals.filter((m) => m.mealType === 'lunch'),
    dinner: meals.filter((m) => m.mealType === 'dinner'),
    snack: meals.filter((m) => m.mealType === 'snack'),
  };

  sendSuccess(res, 200, 'Meals for date retrieved successfully', {
    date,
    summary,
    meals: grouped,
    total: meals.length,
  });
});

/**
 * @desc    Duplicate a meal (quick re-log)
 * @route   POST /api/meals/:id/duplicate
 * @access  Private
 */
const duplicateMeal = asyncHandler(async (req, res) => {
  // Find the original meal
  const originalMeal = await Meal.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!originalMeal) {
    throw ApiError.notFound('Meal not found');
  }

  // Create a copy with current timestamp
  const newMealData = {
    user: req.user._id,
    name: originalMeal.name,
    description: originalMeal.description,
    mealType: req.body.mealType || originalMeal.mealType,
    nutrition: originalMeal.nutrition,
    servingSize: originalMeal.servingSize,
    consumedAt: req.body.consumedAt || new Date(),
    imageUrl: originalMeal.imageUrl,
    tags: originalMeal.tags,
    notes: originalMeal.notes,
    // Don't copy isFavorite
  };

  const newMeal = await Meal.create(newMealData);

  sendSuccess(res, 201, 'Meal duplicated successfully', { meal: newMeal });
});

/**
 * @desc    Bulk delete meals
 * @route   DELETE /api/meals/bulk
 * @access  Private
 */
const bulkDeleteMeals = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw ApiError.badRequest('Please provide an array of meal IDs');
  }

  // Delete only meals belonging to this user
  const result = await Meal.deleteMany({
    _id: { $in: ids },
    user: req.user._id,
  });

  sendSuccess(res, 200, `${result.deletedCount} meal(s) deleted successfully`);
});

module.exports = {
  createMeal,
  getMeals,
  getMealById,
  updateMeal,
  deleteMeal,
  toggleFavorite,
  getMealsByDate,
  duplicateMeal,
  bulkDeleteMeals,
};

