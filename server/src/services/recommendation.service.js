/**
 * Recommendation Service
 * ======================
 * Rule-based nutrition recommendation engine.
 * 
 * This service analyzes:
 * - User's daily consumption vs targets
 * - User's goals (lose weight, maintain, gain)
 * - Eating patterns and habits
 * 
 * And provides actionable recommendations.
 */

const Meal = require('../models/Meal');
const User = require('../models/User');

/**
 * Recommendation categories with priority levels
 */
const PRIORITY = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

const CATEGORY = {
  CALORIE: 'calorie',
  PROTEIN: 'protein',
  CARBS: 'carbs',
  FAT: 'fat',
  HYDRATION: 'hydration',
  MEAL_TIMING: 'meal_timing',
  BALANCE: 'balance',
  GOAL: 'goal',
};

/**
 * Generate daily recommendations based on user's data
 * @param {ObjectId} userId - User's ID
 * @returns {Array} Array of recommendation objects
 */
const generateDailyRecommendations = async (userId) => {
  const user = await User.findById(userId);
  const targets = user.dailyTargets;
  const profile = user.profile;
  const goal = profile.goal || 'maintain';

  // Get today's consumption
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaySummary = await Meal.getDailySummary(userId, today);

  // Get last 7 days for pattern analysis
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weeklyMeals = await Meal.find({
    user: userId,
    consumedAt: { $gte: weekAgo },
  }).lean();

  const recommendations = [];

  // ============================================
  // CALORIE RECOMMENDATIONS
  // ============================================
  const caloriePercentage = (todaySummary.totalCalories / targets.calories) * 100;
  const currentHour = new Date().getHours();

  if (caloriePercentage === 0 && currentHour >= 10) {
    recommendations.push({
      category: CATEGORY.CALORIE,
      priority: PRIORITY.HIGH,
      title: "Haven't logged any meals today",
      message: "Start your day right by logging your breakfast! Consistent tracking helps you reach your goals faster.",
      action: "Log your first meal",
      icon: "🍳",
    });
  } else if (caloriePercentage < 30 && currentHour >= 14) {
    recommendations.push({
      category: CATEGORY.CALORIE,
      priority: PRIORITY.HIGH,
      title: "Low calorie intake for this time of day",
      message: `You've only consumed ${Math.round(caloriePercentage)}% of your daily target. Remember to eat regular meals to maintain energy levels.`,
      action: "Plan your remaining meals",
      icon: "⚡",
    });
  } else if (caloriePercentage > 100) {
    const overBy = todaySummary.totalCalories - targets.calories;
    
    if (goal === 'lose-weight') {
      recommendations.push({
        category: CATEGORY.CALORIE,
        priority: PRIORITY.HIGH,
        title: "Daily calorie target exceeded",
        message: `You're ${overBy} calories over your target. Consider a light dinner and some physical activity.`,
        action: "Plan a lighter dinner",
        icon: "⚠️",
      });
    } else {
      recommendations.push({
        category: CATEGORY.CALORIE,
        priority: PRIORITY.LOW,
        title: "Above your calorie target",
        message: `You're ${overBy} calories over today. This is fine occasionally, but try to balance it out over the week.`,
        action: null,
        icon: "📊",
      });
    }
  } else if (caloriePercentage >= 80 && caloriePercentage <= 100) {
    recommendations.push({
      category: CATEGORY.CALORIE,
      priority: PRIORITY.LOW,
      title: "Great calorie balance! 🎯",
      message: "You're on track with your daily calorie goal. Keep up the excellent work!",
      action: null,
      icon: "✅",
    });
  }

  // ============================================
  // PROTEIN RECOMMENDATIONS
  // ============================================
  const proteinPercentage = (todaySummary.totalProtein / targets.protein) * 100;

  if (proteinPercentage < 50 && currentHour >= 18) {
    recommendations.push({
      category: CATEGORY.PROTEIN,
      priority: PRIORITY.HIGH,
      title: "Protein intake is low",
      message: `Only ${Math.round(proteinPercentage)}% of your protein target. Try adding lean meats, eggs, legumes, or dairy to your next meal.`,
      action: "Add protein-rich foods",
      icon: "💪",
      suggestions: ["Chicken breast", "Greek yogurt", "Lentils", "Eggs", "Paneer", "Tofu"],
    });
  } else if (goal === 'build-muscle' && proteinPercentage < 80 && currentHour >= 15) {
    recommendations.push({
      category: CATEGORY.PROTEIN,
      priority: PRIORITY.MEDIUM,
      title: "Boost your protein for muscle gain",
      message: "For muscle building, aim for higher protein. Consider a protein-rich snack or supplement.",
      action: "Add a protein snack",
      icon: "🏋️",
    });
  }

  // ============================================
  // MACRO BALANCE RECOMMENDATIONS
  // ============================================
  const totalMacros = todaySummary.totalProtein + todaySummary.totalCarbs + todaySummary.totalFat;
  
  if (totalMacros > 0) {
    const proteinRatio = (todaySummary.totalProtein / totalMacros) * 100;
    const carbsRatio = (todaySummary.totalCarbs / totalMacros) * 100;
    const fatRatio = (todaySummary.totalFat / totalMacros) * 100;

    if (carbsRatio > 70) {
      recommendations.push({
        category: CATEGORY.BALANCE,
        priority: PRIORITY.MEDIUM,
        title: "High carbohydrate ratio",
        message: "Your meals are carb-heavy today. Try adding more protein and healthy fats for better satiety.",
        action: "Balance with protein",
        icon: "⚖️",
      });
    }

    if (fatRatio > 50) {
      recommendations.push({
        category: CATEGORY.FAT,
        priority: PRIORITY.MEDIUM,
        title: "High fat intake",
        message: "Today's meals are high in fat. Consider lighter options for your remaining meals.",
        action: "Choose lighter options",
        icon: "🥗",
      });
    }
  }

  // ============================================
  // MEAL TIMING RECOMMENDATIONS
  // ============================================
  if (weeklyMeals.length > 0) {
    // Analyze meal timing patterns
    const breakfastMeals = weeklyMeals.filter((m) => m.mealType === 'breakfast');
    const snackMeals = weeklyMeals.filter((m) => m.mealType === 'snack');

    if (breakfastMeals.length < 3) {
      recommendations.push({
        category: CATEGORY.MEAL_TIMING,
        priority: PRIORITY.MEDIUM,
        title: "Breakfast skipping detected",
        message: "You've skipped breakfast on several days this week. A healthy breakfast can boost metabolism and energy.",
        action: "Plan breakfast ahead",
        icon: "🌅",
      });
    }

    if (snackMeals.length > 10) {
      recommendations.push({
        category: CATEGORY.MEAL_TIMING,
        priority: PRIORITY.LOW,
        title: "Frequent snacking",
        message: "You're snacking frequently. Consider if these are mindful choices or could be consolidated into main meals.",
        action: "Review snacking habits",
        icon: "🍿",
      });
    }
  }

  // ============================================
  // GOAL-SPECIFIC RECOMMENDATIONS
  // ============================================
  switch (goal) {
    case 'lose-weight':
      if (todaySummary.totalFiber < targets.fiber * 0.5) {
        recommendations.push({
          category: CATEGORY.GOAL,
          priority: PRIORITY.MEDIUM,
          title: "Increase fiber intake",
          message: "Fiber helps you feel full longer. Add vegetables, fruits, and whole grains to support your weight loss goal.",
          action: "Add fiber-rich foods",
          icon: "🥬",
          suggestions: ["Broccoli", "Oats", "Apples", "Beans", "Brown rice"],
        });
      }
      break;

    case 'gain-weight':
    case 'build-muscle':
      if (caloriePercentage < 90 && currentHour >= 20) {
        recommendations.push({
          category: CATEGORY.GOAL,
          priority: PRIORITY.HIGH,
          title: "Need more calories for your goal",
          message: "You're under your calorie target. Add a calorie-dense snack to support your weight/muscle gain goal.",
          action: "Add calorie-dense foods",
          icon: "🥜",
          suggestions: ["Nuts", "Peanut butter", "Avocado", "Cheese", "Banana shake"],
        });
      }
      break;

    case 'maintain':
      if (Math.abs(caloriePercentage - 100) <= 10) {
        recommendations.push({
          category: CATEGORY.GOAL,
          priority: PRIORITY.LOW,
          title: "Perfect maintenance! 🎯",
          message: "You're right on track with your maintenance calories. Great job staying consistent!",
          action: null,
          icon: "🏆",
        });
      }
      break;
  }

  // ============================================
  // HYDRATION REMINDER (Time-based)
  // ============================================
  if (currentHour >= 12 && currentHour <= 18) {
    recommendations.push({
      category: CATEGORY.HYDRATION,
      priority: PRIORITY.LOW,
      title: "Stay hydrated",
      message: `Aim for ${targets.water} glasses of water today. Proper hydration aids digestion and metabolism.`,
      action: "Drink a glass of water",
      icon: "💧",
    });
  }

  // Sort by priority (highest first)
  recommendations.sort((a, b) => b.priority - a.priority);

  return recommendations;
};

/**
 * Generate meal suggestions based on remaining nutrition needs
 * @param {ObjectId} userId - User's ID
 * @param {string} mealType - Type of meal (breakfast, lunch, dinner, snack)
 * @returns {Array} Array of meal suggestion objects
 */
const getMealSuggestions = async (userId, mealType) => {
  const user = await User.findById(userId);
  const targets = user.dailyTargets;
  const preferences = user.preferences;
  const goal = user.profile.goal;

  // Get today's consumption
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaySummary = await Meal.getDailySummary(userId, today);

  // Calculate remaining needs
  const remaining = {
    calories: Math.max(0, targets.calories - todaySummary.totalCalories),
    protein: Math.max(0, targets.protein - todaySummary.totalProtein),
    carbs: Math.max(0, targets.carbs - todaySummary.totalCarbs),
    fat: Math.max(0, targets.fat - todaySummary.totalFat),
  };

  // Meal database (simplified - in production, this would come from a food database)
  const mealDatabase = {
    breakfast: [
      { name: "Oatmeal with Fruits", calories: 300, protein: 10, carbs: 50, fat: 8, tags: ["vegetarian", "fiber-rich"] },
      { name: "Eggs & Toast", calories: 350, protein: 18, carbs: 30, fat: 16, tags: ["high-protein"] },
      { name: "Greek Yogurt Parfait", calories: 280, protein: 15, carbs: 35, fat: 8, tags: ["vegetarian", "high-protein"] },
      { name: "Avocado Toast", calories: 320, protein: 8, carbs: 28, fat: 22, tags: ["vegetarian", "healthy-fats"] },
      { name: "Protein Smoothie", calories: 350, protein: 25, carbs: 40, fat: 8, tags: ["high-protein", "quick"] },
      { name: "Poha with Vegetables", calories: 280, protein: 6, carbs: 45, fat: 10, tags: ["vegetarian", "indian"] },
      { name: "Idli with Sambar", calories: 250, protein: 8, carbs: 42, fat: 5, tags: ["vegetarian", "indian", "low-fat"] },
    ],
    lunch: [
      { name: "Grilled Chicken Salad", calories: 450, protein: 35, carbs: 20, fat: 25, tags: ["high-protein", "low-carb"] },
      { name: "Dal Rice Bowl", calories: 500, protein: 15, carbs: 75, fat: 12, tags: ["vegetarian", "indian"] },
      { name: "Paneer Tikka Wrap", calories: 480, protein: 22, carbs: 45, fat: 22, tags: ["vegetarian", "indian"] },
      { name: "Quinoa Buddha Bowl", calories: 420, protein: 18, carbs: 55, fat: 15, tags: ["vegetarian", "balanced"] },
      { name: "Chicken Biryani", calories: 550, protein: 28, carbs: 60, fat: 20, tags: ["indian", "high-protein"] },
      { name: "Vegetable Stir Fry", calories: 380, protein: 12, carbs: 45, fat: 16, tags: ["vegetarian", "quick"] },
    ],
    dinner: [
      { name: "Grilled Fish with Vegetables", calories: 400, protein: 32, carbs: 25, fat: 18, tags: ["high-protein", "low-carb"] },
      { name: "Chicken Curry with Roti", calories: 480, protein: 28, carbs: 45, fat: 18, tags: ["indian", "high-protein"] },
      { name: "Palak Paneer with Rice", calories: 520, protein: 18, carbs: 55, fat: 24, tags: ["vegetarian", "indian"] },
      { name: "Lentil Soup with Bread", calories: 350, protein: 16, carbs: 50, fat: 8, tags: ["vegetarian", "fiber-rich"] },
      { name: "Egg Curry with Chapati", calories: 420, protein: 20, carbs: 40, fat: 18, tags: ["indian", "high-protein"] },
      { name: "Mixed Vegetable Khichdi", calories: 380, protein: 12, carbs: 60, fat: 10, tags: ["vegetarian", "indian", "comfort"] },
    ],
    snack: [
      { name: "Mixed Nuts (handful)", calories: 180, protein: 5, carbs: 8, fat: 16, tags: ["healthy-fats", "quick"] },
      { name: "Apple with Peanut Butter", calories: 200, protein: 5, carbs: 25, fat: 10, tags: ["vegetarian", "quick"] },
      { name: "Protein Bar", calories: 220, protein: 15, carbs: 25, fat: 8, tags: ["high-protein", "convenient"] },
      { name: "Hummus with Carrots", calories: 150, protein: 5, carbs: 18, fat: 7, tags: ["vegetarian", "fiber-rich"] },
      { name: "Boiled Eggs (2)", calories: 140, protein: 12, carbs: 1, fat: 10, tags: ["high-protein", "low-carb"] },
      { name: "Chana Chaat", calories: 180, protein: 8, carbs: 28, fat: 5, tags: ["vegetarian", "indian"] },
    ],
  };

  const meals = mealDatabase[mealType] || [];

  // Filter based on dietary preferences
  let filteredMeals = [...meals];
  
  if (preferences.dietType === 'vegetarian' || preferences.dietType === 'vegan') {
    filteredMeals = filteredMeals.filter((m) => 
      m.tags.includes('vegetarian') || m.tags.includes('vegan')
    );
  }

  // Score meals based on nutritional fit
  const scoredMeals = filteredMeals.map((meal) => {
    let score = 100;

    // Penalize if meal exceeds remaining calories significantly
    if (meal.calories > remaining.calories * 1.2) {
      score -= 30;
    }

    // Bonus for good protein content when protein is needed
    if (remaining.protein > 20 && meal.protein >= 15) {
      score += 20;
    }

    // Goal-specific scoring
    if (goal === 'lose-weight' && meal.calories <= remaining.calories * 0.4) {
      score += 15;
    }
    if (goal === 'build-muscle' && meal.protein >= 20) {
      score += 20;
    }

    return { ...meal, score };
  });

  // Sort by score and return top 5
  scoredMeals.sort((a, b) => b.score - a.score);
  
  return {
    mealType,
    remainingNutrition: remaining,
    suggestions: scoredMeals.slice(0, 5).map((m) => ({
      name: m.name,
      nutrition: {
        calories: m.calories,
        protein: m.protein,
        carbs: m.carbs,
        fat: m.fat,
      },
      tags: m.tags,
      matchScore: m.score,
    })),
  };
};

/**
 * Get weekly insights and patterns
 * @param {ObjectId} userId - User's ID
 * @returns {Object} Weekly insights
 */
const getWeeklyInsights = async (userId) => {
  const user = await User.findById(userId);
  const targets = user.dailyTargets;

  // Get last 7 days of meals
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  weekAgo.setHours(0, 0, 0, 0);

  const meals = await Meal.find({
    user: userId,
    consumedAt: { $gte: weekAgo },
  }).lean();

  // Calculate daily totals
  const dailyTotals = {};
  meals.forEach((meal) => {
    const dateKey = meal.consumedAt.toISOString().split('T')[0];
    if (!dailyTotals[dateKey]) {
      dailyTotals[dateKey] = { calories: 0, protein: 0, carbs: 0, fat: 0, meals: 0 };
    }
    dailyTotals[dateKey].calories += meal.nutrition.calories;
    dailyTotals[dateKey].protein += meal.nutrition.protein;
    dailyTotals[dateKey].carbs += meal.nutrition.carbs;
    dailyTotals[dateKey].fat += meal.nutrition.fat;
    dailyTotals[dateKey].meals += 1;
  });

  const days = Object.values(dailyTotals);
  const daysTracked = days.length;

  if (daysTracked === 0) {
    return {
      message: "Not enough data for weekly insights. Keep logging your meals!",
      insights: [],
    };
  }

  const insights = [];

  // Average daily calories
  const avgCalories = Math.round(days.reduce((sum, d) => sum + d.calories, 0) / daysTracked);
  const calorieDeviation = Math.abs(avgCalories - targets.calories);
  
  if (calorieDeviation <= targets.calories * 0.1) {
    insights.push({
      type: 'positive',
      title: 'Consistent Calorie Intake',
      message: `You averaged ${avgCalories} calories/day, right on target!`,
      icon: '🎯',
    });
  } else if (avgCalories < targets.calories * 0.8) {
    insights.push({
      type: 'warning',
      title: 'Under-eating Trend',
      message: `You averaged ${avgCalories} calories/day, below your ${targets.calories} target.`,
      icon: '⚠️',
    });
  }

  // Protein achievement
  const avgProtein = Math.round(days.reduce((sum, d) => sum + d.protein, 0) / daysTracked);
  if (avgProtein >= targets.protein * 0.9) {
    insights.push({
      type: 'positive',
      title: 'Great Protein Intake',
      message: `Averaged ${avgProtein}g protein daily - well done!`,
      icon: '💪',
    });
  }

  // Tracking consistency
  if (daysTracked >= 6) {
    insights.push({
      type: 'positive',
      title: 'Excellent Consistency',
      message: `You tracked meals on ${daysTracked}/7 days this week!`,
      icon: '🌟',
    });
  } else if (daysTracked <= 3) {
    insights.push({
      type: 'suggestion',
      title: 'Track More Consistently',
      message: 'Try to log meals every day for better insights and progress.',
      icon: '📝',
    });
  }

  // Meal frequency
  const avgMeals = Math.round(days.reduce((sum, d) => sum + d.meals, 0) / daysTracked);
  if (avgMeals < 3) {
    insights.push({
      type: 'suggestion',
      title: 'Low Meal Frequency',
      message: 'Consider spreading calories across 3-4 meals for better energy.',
      icon: '🍽️',
    });
  }

  return {
    period: '7 days',
    daysTracked,
    averages: {
      calories: avgCalories,
      protein: avgProtein,
      mealsPerDay: avgMeals,
    },
    insights,
  };
};

module.exports = {
  generateDailyRecommendations,
  getMealSuggestions,
  getWeeklyInsights,
};

