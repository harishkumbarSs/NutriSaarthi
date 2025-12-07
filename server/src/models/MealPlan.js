/**
 * Meal Plan Model
 * ===============
 * Weekly meal planning and scheduling.
 */

const mongoose = require('mongoose');

const plannedMealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true,
  },
  time: {
    type: String, // HH:mm format
    required: true,
  },
  foods: [{
    name: String,
    servingSize: Number,
    servingUnit: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    foodId: String, // Reference to food database
  }],
  notes: {
    type: String,
    maxlength: 500,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  completedAt: Date,
});

const dayPlanSchema = new mongoose.Schema({
  dayOfWeek: {
    type: Number, // 0-6 (Sunday-Saturday)
    required: true,
    min: 0,
    max: 6,
  },
  date: Date,
  meals: [plannedMealSchema],
  totalCalories: {
    type: Number,
    default: 0,
  },
  totalProtein: {
    type: Number,
    default: 0,
  },
  totalCarbs: {
    type: Number,
    default: 0,
  },
  totalFat: {
    type: Number,
    default: 0,
  },
});

const mealPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      default: 'My Meal Plan',
    },
    weekStart: {
      type: Date,
      required: true,
    },
    weekEnd: {
      type: Date,
      required: true,
    },
    days: [dayPlanSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    isTemplate: {
      type: Boolean,
      default: false,
    },
    templateName: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    targetCalories: {
      type: Number,
      default: 2000,
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
mealPlanSchema.index({ user: 1, weekStart: -1 });
mealPlanSchema.index({ user: 1, isTemplate: 1 });

// Calculate day totals
dayPlanSchema.pre('save', function (next) {
  this.totalCalories = 0;
  this.totalProtein = 0;
  this.totalCarbs = 0;
  this.totalFat = 0;

  for (const meal of this.meals) {
    for (const food of meal.foods) {
      this.totalCalories += food.calories || 0;
      this.totalProtein += food.protein || 0;
      this.totalCarbs += food.carbs || 0;
      this.totalFat += food.fat || 0;
    }
  }
  next();
});

// Get current week's plan
mealPlanSchema.statics.getCurrentWeekPlan = async function (userId) {
  const today = new Date();
  const dayOfWeek = today.getDay();
  
  // Calculate week start (Sunday)
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - dayOfWeek);
  weekStart.setHours(0, 0, 0, 0);
  
  // Calculate week end (Saturday)
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  let plan = await this.findOne({
    user: userId,
    weekStart: { $gte: weekStart },
    weekEnd: { $lte: new Date(weekEnd.getTime() + 24 * 60 * 60 * 1000) },
    isTemplate: false,
  });

  if (!plan) {
    // Create new week plan
    plan = await this.create({
      user: userId,
      name: `Week of ${weekStart.toLocaleDateString()}`,
      weekStart,
      weekEnd,
      days: Array.from({ length: 7 }, (_, i) => ({
        dayOfWeek: i,
        date: new Date(weekStart.getTime() + i * 24 * 60 * 60 * 1000),
        meals: [],
      })),
    });
  }

  return plan;
};

// Virtual: week summary
mealPlanSchema.virtual('weekSummary').get(function () {
  let totalCalories = 0;
  let mealsPlanned = 0;
  let mealsCompleted = 0;

  for (const day of this.days) {
    totalCalories += day.totalCalories;
    for (const meal of day.meals) {
      mealsPlanned++;
      if (meal.isCompleted) mealsCompleted++;
    }
  }

  return {
    totalCalories,
    avgCalories: this.days.length > 0 ? Math.round(totalCalories / this.days.length) : 0,
    mealsPlanned,
    mealsCompleted,
    completionRate: mealsPlanned > 0 ? Math.round((mealsCompleted / mealsPlanned) * 100) : 0,
  };
});

mealPlanSchema.set('toJSON', { virtuals: true });
mealPlanSchema.set('toObject', { virtuals: true });

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);

module.exports = MealPlan;

