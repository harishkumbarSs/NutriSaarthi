/**
 * Dashboard Controller
 * ====================
 * Provides analytics and summary data for the dashboard.
 * 
 * Key Features:
 * - Daily nutrition summary
 * - Weekly/Monthly trends
 * - Macro breakdown analysis
 * - Progress towards goals
 */

const Meal = require('../models/Meal');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');

/**
 * @desc    Get today's nutrition summary
 * @route   GET /api/dashboard/today
 * @access  Private
 */
const getTodaySummary = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // Get today's summary
  const summary = await Meal.getDailySummary(req.user._id, today);

  // Get user's daily targets
  const user = await User.findById(req.user._id);
  const targets = user.dailyTargets;

  // Calculate progress percentages
  const progress = {
    calories: Math.round((summary.totalCalories / targets.calories) * 100),
    protein: Math.round((summary.totalProtein / targets.protein) * 100),
    carbs: Math.round((summary.totalCarbs / targets.carbs) * 100),
    fat: Math.round((summary.totalFat / targets.fat) * 100),
    fiber: Math.round((summary.totalFiber / targets.fiber) * 100),
  };

  // Get remaining amounts
  const remaining = {
    calories: Math.max(0, targets.calories - summary.totalCalories),
    protein: Math.max(0, targets.protein - summary.totalProtein),
    carbs: Math.max(0, targets.carbs - summary.totalCarbs),
    fat: Math.max(0, targets.fat - summary.totalFat),
    fiber: Math.max(0, targets.fiber - summary.totalFiber),
  };

  sendSuccess(res, 200, "Today's summary retrieved", {
    date: today.toISOString().split('T')[0],
    consumed: {
      calories: summary.totalCalories,
      protein: summary.totalProtein,
      carbs: summary.totalCarbs,
      fat: summary.totalFat,
      fiber: summary.totalFiber,
      sugar: summary.totalSugar,
      sodium: summary.totalSodium,
    },
    targets,
    progress,
    remaining,
    mealCount: summary.mealCount,
  });
});

/**
 * @desc    Get calorie trends for specified period
 * @route   GET /api/dashboard/trends
 * @access  Private
 * 
 * Query Parameters:
 * - period: '7d', '14d', '30d', '90d' (default: '7d')
 */
const getCalorieTrends = asyncHandler(async (req, res) => {
  const periods = {
    '7d': 7,
    '14d': 14,
    '30d': 30,
    '90d': 90,
  };

  const period = periods[req.query.period] || 7;
  
  // Calculate date range
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - period + 1);
  startDate.setHours(0, 0, 0, 0);

  // Aggregate meals by date
  const trends = await Meal.aggregate([
    {
      $match: {
        user: req.user._id,
        consumedAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$consumedAt' },
        },
        calories: { $sum: '$nutrition.calories' },
        protein: { $sum: '$nutrition.protein' },
        carbs: { $sum: '$nutrition.carbs' },
        fat: { $sum: '$nutrition.fat' },
        mealCount: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // Fill in missing dates with zeros
  const trendMap = new Map(trends.map((t) => [t._id, t]));
  const filledTrends = [];
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const dayData = trendMap.get(dateStr) || {
      _id: dateStr,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      mealCount: 0,
    };
    
    filledTrends.push({
      date: dateStr,
      calories: dayData.calories,
      protein: dayData.protein,
      carbs: dayData.carbs,
      fat: dayData.fat,
      mealCount: dayData.mealCount,
    });
  }

  // Calculate averages
  const totalDays = filledTrends.length;
  const daysWithMeals = filledTrends.filter((d) => d.mealCount > 0).length;
  
  const totals = filledTrends.reduce(
    (acc, day) => ({
      calories: acc.calories + day.calories,
      protein: acc.protein + day.protein,
      carbs: acc.carbs + day.carbs,
      fat: acc.fat + day.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const averages = {
    calories: Math.round(totals.calories / (daysWithMeals || 1)),
    protein: Math.round(totals.protein / (daysWithMeals || 1)),
    carbs: Math.round(totals.carbs / (daysWithMeals || 1)),
    fat: Math.round(totals.fat / (daysWithMeals || 1)),
  };

  sendSuccess(res, 200, `${period}-day trends retrieved`, {
    period: req.query.period || '7d',
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    trends: filledTrends,
    summary: {
      totalDays,
      daysWithMeals,
      totals,
      averages,
    },
  });
});

/**
 * @desc    Get macro breakdown analysis
 * @route   GET /api/dashboard/macros
 * @access  Private
 * 
 * Query Parameters:
 * - date: specific date (default: today)
 * - period: 'day', 'week', 'month' (default: 'day')
 */
const getMacroBreakdown = asyncHandler(async (req, res) => {
  let startDate, endDate;
  const period = req.query.period || 'day';

  if (req.query.date) {
    startDate = new Date(req.query.date);
  } else {
    startDate = new Date();
  }

  switch (period) {
    case 'week':
      // Get start of week (Sunday)
      startDate.setDate(startDate.getDate() - startDate.getDay());
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      break;
    case 'month':
      // Get start of month
      startDate.setDate(1);
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0); // Last day of month
      break;
    default: // 'day'
      endDate = new Date(startDate);
  }

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  // Aggregate macro data
  const macroData = await Meal.aggregate([
    {
      $match: {
        user: req.user._id,
        consumedAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: null,
        totalCalories: { $sum: '$nutrition.calories' },
        totalProtein: { $sum: '$nutrition.protein' },
        totalCarbs: { $sum: '$nutrition.carbs' },
        totalFat: { $sum: '$nutrition.fat' },
        totalFiber: { $sum: '$nutrition.fiber' },
        totalSugar: { $sum: '$nutrition.sugar' },
      },
    },
  ]);

  const data = macroData[0] || {
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    totalFiber: 0,
    totalSugar: 0,
  };

  // Calculate calorie distribution from macros
  // Protein = 4 cal/g, Carbs = 4 cal/g, Fat = 9 cal/g
  const caloriesFromProtein = data.totalProtein * 4;
  const caloriesFromCarbs = data.totalCarbs * 4;
  const caloriesFromFat = data.totalFat * 9;
  const totalMacroCalories = caloriesFromProtein + caloriesFromCarbs + caloriesFromFat;

  const distribution = {
    protein: totalMacroCalories > 0 
      ? Math.round((caloriesFromProtein / totalMacroCalories) * 100) 
      : 0,
    carbs: totalMacroCalories > 0 
      ? Math.round((caloriesFromCarbs / totalMacroCalories) * 100) 
      : 0,
    fat: totalMacroCalories > 0 
      ? Math.round((caloriesFromFat / totalMacroCalories) * 100) 
      : 0,
  };

  sendSuccess(res, 200, 'Macro breakdown retrieved', {
    period,
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    totals: {
      calories: data.totalCalories,
      protein: data.totalProtein,
      carbs: data.totalCarbs,
      fat: data.totalFat,
      fiber: data.totalFiber,
      sugar: data.totalSugar,
    },
    distribution,
    caloriesFromMacros: {
      protein: caloriesFromProtein,
      carbs: caloriesFromCarbs,
      fat: caloriesFromFat,
    },
  });
});

/**
 * @desc    Get meal type distribution
 * @route   GET /api/dashboard/meal-distribution
 * @access  Private
 */
const getMealDistribution = asyncHandler(async (req, res) => {
  const period = parseInt(req.query.days, 10) || 7;
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - period + 1);
  startDate.setHours(0, 0, 0, 0);

  const distribution = await Meal.aggregate([
    {
      $match: {
        user: req.user._id,
        consumedAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: '$mealType',
        count: { $sum: 1 },
        totalCalories: { $sum: '$nutrition.calories' },
        avgCalories: { $avg: '$nutrition.calories' },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  // Calculate percentages
  const totalMeals = distribution.reduce((sum, d) => sum + d.count, 0);
  
  const enriched = distribution.map((d) => ({
    mealType: d._id,
    count: d.count,
    percentage: totalMeals > 0 ? Math.round((d.count / totalMeals) * 100) : 0,
    totalCalories: Math.round(d.totalCalories),
    avgCalories: Math.round(d.avgCalories),
  }));

  sendSuccess(res, 200, 'Meal distribution retrieved', {
    period: `${period} days`,
    totalMeals,
    distribution: enriched,
  });
});

/**
 * @desc    Get weekly overview (for dashboard cards)
 * @route   GET /api/dashboard/weekly-overview
 * @access  Private
 */
const getWeeklyOverview = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const targets = user.dailyTargets;

  // Get last 7 days
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    days.push(date);
  }

  // Get summary for each day
  const weekData = await Promise.all(
    days.map(async (date) => {
      const summary = await Meal.getDailySummary(req.user._id, date);
      return {
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        calories: summary.totalCalories,
        target: targets.calories,
        percentage: Math.round((summary.totalCalories / targets.calories) * 100),
        mealsLogged: summary.mealCount,
      };
    })
  );

  // Calculate week totals and averages
  const weekTotals = weekData.reduce(
    (acc, day) => ({
      calories: acc.calories + day.calories,
      mealsLogged: acc.mealsLogged + day.mealsLogged,
    }),
    { calories: 0, mealsLogged: 0 }
  );

  const daysWithMeals = weekData.filter((d) => d.mealsLogged > 0).length;

  sendSuccess(res, 200, 'Weekly overview retrieved', {
    days: weekData,
    summary: {
      totalCalories: weekTotals.calories,
      avgCaloriesPerDay: Math.round(weekTotals.calories / (daysWithMeals || 1)),
      totalMeals: weekTotals.mealsLogged,
      daysTracked: daysWithMeals,
      weeklyTarget: targets.calories * 7,
      weeklyProgress: Math.round((weekTotals.calories / (targets.calories * 7)) * 100),
    },
  });
});

/**
 * @desc    Get comprehensive dashboard data in a single call
 * @route   GET /api/dashboard
 * @access  Private
 * 
 * This is optimized to reduce multiple API calls from frontend
 */
const getDashboardData = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const targets = user.dailyTargets;

  // Today's date range
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  // Week start (7 days ago)
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);

  // Run all queries in parallel for performance
  const [
    todaySummary,
    weeklyData,
    recentMeals,
    mealTypeStats,
  ] = await Promise.all([
    // Today's summary
    Meal.getDailySummary(req.user._id, today),
    
    // Weekly aggregation
    Meal.aggregate([
      {
        $match: {
          user: req.user._id,
          consumedAt: { $gte: weekStart, $lte: endOfToday },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$consumedAt' } },
          calories: { $sum: '$nutrition.calories' },
          mealCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    
    // Recent meals (last 5)
    Meal.find({ user: req.user._id })
      .sort({ consumedAt: -1 })
      .limit(5)
      .lean(),
    
    // Meal type distribution
    Meal.aggregate([
      {
        $match: {
          user: req.user._id,
          consumedAt: { $gte: weekStart },
        },
      },
      {
        $group: {
          _id: '$mealType',
          count: { $sum: 1 },
          calories: { $sum: '$nutrition.calories' },
        },
      },
    ]),
  ]);

  // Calculate today's progress
  const todayProgress = {
    calories: {
      consumed: todaySummary.totalCalories,
      target: targets.calories,
      remaining: Math.max(0, targets.calories - todaySummary.totalCalories),
      percentage: Math.min(100, Math.round((todaySummary.totalCalories / targets.calories) * 100)),
    },
    protein: {
      consumed: todaySummary.totalProtein,
      target: targets.protein,
      percentage: Math.min(100, Math.round((todaySummary.totalProtein / targets.protein) * 100)),
    },
    carbs: {
      consumed: todaySummary.totalCarbs,
      target: targets.carbs,
      percentage: Math.min(100, Math.round((todaySummary.totalCarbs / targets.carbs) * 100)),
    },
    fat: {
      consumed: todaySummary.totalFat,
      target: targets.fat,
      percentage: Math.min(100, Math.round((todaySummary.totalFat / targets.fat) * 100)),
    },
  };

  sendSuccess(res, 200, 'Dashboard data retrieved', {
    user: {
      name: user.name,
      goal: user.profile.goal,
      dailyTargets: targets,
    },
    today: {
      ...todayProgress,
      mealCount: todaySummary.mealCount,
    },
    weeklyChart: weeklyData.map((d) => ({
      date: d._id,
      calories: d.calories,
      mealCount: d.mealCount,
    })),
    recentMeals: recentMeals.map((m) => ({
      id: m._id,
      name: m.name,
      mealType: m.mealType,
      calories: m.nutrition.calories,
      consumedAt: m.consumedAt,
    })),
    mealTypeDistribution: mealTypeStats.map((s) => ({
      type: s._id,
      count: s.count,
      totalCalories: s.calories,
    })),
  });
});

module.exports = {
  getTodaySummary,
  getCalorieTrends,
  getMacroBreakdown,
  getMealDistribution,
  getWeeklyOverview,
  getDashboardData,
};

