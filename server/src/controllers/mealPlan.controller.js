/**
 * Meal Plan Controller
 * ====================
 * Handles meal planning and scheduling endpoints.
 */

const MealPlan = require('../models/MealPlan');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Get current week's meal plan
 * @route   GET /api/meal-plans/current
 * @access  Private
 */
const getCurrentPlan = asyncHandler(async (req, res) => {
  const plan = await MealPlan.getCurrentWeekPlan(req.user._id);

  sendSuccess(res, 200, 'Current meal plan retrieved', { plan });
});

/**
 * @desc    Get meal plan by ID
 * @route   GET /api/meal-plans/:id
 * @access  Private
 */
const getPlan = asyncHandler(async (req, res) => {
  const plan = await MealPlan.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!plan) {
    throw ApiError.notFound('Meal plan not found');
  }

  sendSuccess(res, 200, 'Meal plan retrieved', { plan });
});

/**
 * @desc    Get all meal plans (with pagination)
 * @route   GET /api/meal-plans
 * @access  Private
 */
const getPlans = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, templates = 'false' } = req.query;

  const query = {
    user: req.user._id,
    isTemplate: templates === 'true',
  };

  const plans = await MealPlan.find(query)
    .sort({ weekStart: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit, 10));

  const total = await MealPlan.countDocuments(query);

  sendSuccess(res, 200, 'Meal plans retrieved', {
    plans,
    pagination: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * @desc    Add meal to a day
 * @route   POST /api/meal-plans/:planId/days/:dayOfWeek/meals
 * @access  Private
 */
const addMeal = asyncHandler(async (req, res) => {
  const { planId, dayOfWeek } = req.params;
  const { name, mealType, time, foods, notes } = req.body;

  const plan = await MealPlan.findOne({
    _id: planId,
    user: req.user._id,
  });

  if (!plan) {
    throw ApiError.notFound('Meal plan not found');
  }

  const day = plan.days.find(d => d.dayOfWeek === parseInt(dayOfWeek, 10));
  if (!day) {
    throw ApiError.badRequest('Invalid day of week');
  }

  day.meals.push({
    name,
    mealType,
    time,
    foods: foods || [],
    notes,
  });

  // Recalculate totals
  day.totalCalories = day.meals.reduce((sum, meal) => 
    sum + meal.foods.reduce((s, f) => s + (f.calories || 0), 0), 0);
  day.totalProtein = day.meals.reduce((sum, meal) => 
    sum + meal.foods.reduce((s, f) => s + (f.protein || 0), 0), 0);
  day.totalCarbs = day.meals.reduce((sum, meal) => 
    sum + meal.foods.reduce((s, f) => s + (f.carbs || 0), 0), 0);
  day.totalFat = day.meals.reduce((sum, meal) => 
    sum + meal.foods.reduce((s, f) => s + (f.fat || 0), 0), 0);

  await plan.save();

  sendSuccess(res, 201, 'Meal added to plan', {
    meal: day.meals[day.meals.length - 1],
    dayTotals: {
      calories: day.totalCalories,
      protein: day.totalProtein,
      carbs: day.totalCarbs,
      fat: day.totalFat,
    },
  });
});

/**
 * @desc    Update meal in plan
 * @route   PUT /api/meal-plans/:planId/days/:dayOfWeek/meals/:mealId
 * @access  Private
 */
const updateMeal = asyncHandler(async (req, res) => {
  const { planId, dayOfWeek, mealId } = req.params;
  const { name, mealType, time, foods, notes, isCompleted } = req.body;

  const plan = await MealPlan.findOne({
    _id: planId,
    user: req.user._id,
  });

  if (!plan) {
    throw ApiError.notFound('Meal plan not found');
  }

  const day = plan.days.find(d => d.dayOfWeek === parseInt(dayOfWeek, 10));
  if (!day) {
    throw ApiError.badRequest('Invalid day of week');
  }

  const meal = day.meals.id(mealId);
  if (!meal) {
    throw ApiError.notFound('Meal not found');
  }

  // Update fields
  if (name) meal.name = name;
  if (mealType) meal.mealType = mealType;
  if (time) meal.time = time;
  if (foods) meal.foods = foods;
  if (notes !== undefined) meal.notes = notes;
  if (isCompleted !== undefined) {
    meal.isCompleted = isCompleted;
    if (isCompleted) meal.completedAt = new Date();
  }

  // Recalculate totals
  day.totalCalories = day.meals.reduce((sum, m) => 
    sum + m.foods.reduce((s, f) => s + (f.calories || 0), 0), 0);
  day.totalProtein = day.meals.reduce((sum, m) => 
    sum + m.foods.reduce((s, f) => s + (f.protein || 0), 0), 0);
  day.totalCarbs = day.meals.reduce((sum, m) => 
    sum + m.foods.reduce((s, f) => s + (f.carbs || 0), 0), 0);
  day.totalFat = day.meals.reduce((sum, m) => 
    sum + m.foods.reduce((s, f) => s + (f.fat || 0), 0), 0);

  await plan.save();

  sendSuccess(res, 200, 'Meal updated', { meal });
});

/**
 * @desc    Delete meal from plan
 * @route   DELETE /api/meal-plans/:planId/days/:dayOfWeek/meals/:mealId
 * @access  Private
 */
const deleteMeal = asyncHandler(async (req, res) => {
  const { planId, dayOfWeek, mealId } = req.params;

  const plan = await MealPlan.findOne({
    _id: planId,
    user: req.user._id,
  });

  if (!plan) {
    throw ApiError.notFound('Meal plan not found');
  }

  const day = plan.days.find(d => d.dayOfWeek === parseInt(dayOfWeek, 10));
  if (!day) {
    throw ApiError.badRequest('Invalid day of week');
  }

  const mealIndex = day.meals.findIndex(m => m._id.toString() === mealId);
  if (mealIndex === -1) {
    throw ApiError.notFound('Meal not found');
  }

  day.meals.splice(mealIndex, 1);

  // Recalculate totals
  day.totalCalories = day.meals.reduce((sum, m) => 
    sum + m.foods.reduce((s, f) => s + (f.calories || 0), 0), 0);
  day.totalProtein = day.meals.reduce((sum, m) => 
    sum + m.foods.reduce((s, f) => s + (f.protein || 0), 0), 0);

  await plan.save();

  sendSuccess(res, 200, 'Meal deleted');
});

/**
 * @desc    Mark meal as completed
 * @route   POST /api/meal-plans/:planId/days/:dayOfWeek/meals/:mealId/complete
 * @access  Private
 */
const completeMeal = asyncHandler(async (req, res) => {
  const { planId, dayOfWeek, mealId } = req.params;

  const plan = await MealPlan.findOne({
    _id: planId,
    user: req.user._id,
  });

  if (!plan) {
    throw ApiError.notFound('Meal plan not found');
  }

  const day = plan.days.find(d => d.dayOfWeek === parseInt(dayOfWeek, 10));
  if (!day) {
    throw ApiError.badRequest('Invalid day of week');
  }

  const meal = day.meals.id(mealId);
  if (!meal) {
    throw ApiError.notFound('Meal not found');
  }

  meal.isCompleted = true;
  meal.completedAt = new Date();

  await plan.save();

  sendSuccess(res, 200, 'Meal marked as completed', { meal });
});

/**
 * @desc    Save current plan as template
 * @route   POST /api/meal-plans/:planId/save-template
 * @access  Private
 */
const saveAsTemplate = asyncHandler(async (req, res) => {
  const { planId } = req.params;
  const { templateName } = req.body;

  const plan = await MealPlan.findOne({
    _id: planId,
    user: req.user._id,
  });

  if (!plan) {
    throw ApiError.notFound('Meal plan not found');
  }

  // Create template from plan
  const template = new MealPlan({
    user: req.user._id,
    name: templateName || `Template: ${plan.name}`,
    weekStart: new Date(0),
    weekEnd: new Date(0),
    days: plan.days.map(day => ({
      dayOfWeek: day.dayOfWeek,
      meals: day.meals.map(meal => ({
        name: meal.name,
        mealType: meal.mealType,
        time: meal.time,
        foods: meal.foods,
        notes: meal.notes,
        isCompleted: false,
      })),
    })),
    isTemplate: true,
    templateName: templateName || plan.name,
    targetCalories: plan.targetCalories,
  });

  await template.save();

  sendSuccess(res, 201, 'Template saved', { template });
});

/**
 * @desc    Apply template to current week
 * @route   POST /api/meal-plans/apply-template/:templateId
 * @access  Private
 */
const applyTemplate = asyncHandler(async (req, res) => {
  const { templateId } = req.params;

  const template = await MealPlan.findOne({
    _id: templateId,
    user: req.user._id,
    isTemplate: true,
  });

  if (!template) {
    throw ApiError.notFound('Template not found');
  }

  const plan = await MealPlan.getCurrentWeekPlan(req.user._id);

  // Apply template meals to current plan
  for (const templateDay of template.days) {
    const planDay = plan.days.find(d => d.dayOfWeek === templateDay.dayOfWeek);
    if (planDay) {
      planDay.meals = templateDay.meals.map(meal => ({
        name: meal.name,
        mealType: meal.mealType,
        time: meal.time,
        foods: meal.foods,
        notes: meal.notes,
        isCompleted: false,
      }));

      // Recalculate totals
      planDay.totalCalories = planDay.meals.reduce((sum, m) => 
        sum + m.foods.reduce((s, f) => s + (f.calories || 0), 0), 0);
      planDay.totalProtein = planDay.meals.reduce((sum, m) => 
        sum + m.foods.reduce((s, f) => s + (f.protein || 0), 0), 0);
      planDay.totalCarbs = planDay.meals.reduce((sum, m) => 
        sum + m.foods.reduce((s, f) => s + (f.carbs || 0), 0), 0);
      planDay.totalFat = planDay.meals.reduce((sum, m) => 
        sum + m.foods.reduce((s, f) => s + (f.fat || 0), 0), 0);
    }
  }

  await plan.save();

  sendSuccess(res, 200, 'Template applied', { plan });
});

module.exports = {
  getCurrentPlan,
  getPlan,
  getPlans,
  addMeal,
  updateMeal,
  deleteMeal,
  completeMeal,
  saveAsTemplate,
  applyTemplate,
};

