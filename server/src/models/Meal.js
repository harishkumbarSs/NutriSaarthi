/**
 * Meal Model
 * ==========
 * Stores all meals/food items logged by users.
 * 
 * Each meal entry contains:
 * - What food was eaten
 * - Nutritional information
 * - When it was consumed
 * - Which meal category (breakfast, lunch, dinner, snack)
 */

const mongoose = require('mongoose');

/**
 * Meal Schema Definition
 */
const mealSchema = new mongoose.Schema(
  {
    // Reference to the user who logged this meal
    // ObjectId is a unique identifier in MongoDB
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Links to User model
      required: true,
      index: true, // Index for faster queries by user
    },

    // Basic meal information
    name: {
      type: String,
      required: [true, 'Meal name is required'],
      trim: true,
      maxlength: [100, 'Meal name cannot exceed 100 characters'],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },

    // Meal category/type
    mealType: {
      type: String,
      required: [true, 'Meal type is required'],
      enum: {
        values: ['breakfast', 'lunch', 'dinner', 'snack'],
        message: 'Meal type must be breakfast, lunch, dinner, or snack',
      },
    },

    // Nutritional Information
    nutrition: {
      calories: {
        type: Number,
        required: [true, 'Calories are required'],
        min: [0, 'Calories cannot be negative'],
        max: [10000, 'Calories seem unrealistic'],
      },
      protein: {
        type: Number,
        default: 0,
        min: [0, 'Protein cannot be negative'],
      },
      carbs: {
        type: Number,
        default: 0,
        min: [0, 'Carbs cannot be negative'],
      },
      fat: {
        type: Number,
        default: 0,
        min: [0, 'Fat cannot be negative'],
      },
      fiber: {
        type: Number,
        default: 0,
        min: [0, 'Fiber cannot be negative'],
      },
      sugar: {
        type: Number,
        default: 0,
        min: [0, 'Sugar cannot be negative'],
      },
      sodium: {
        type: Number, // in mg
        default: 0,
        min: [0, 'Sodium cannot be negative'],
      },
    },

    // Portion/serving information
    servingSize: {
      amount: {
        type: Number,
        default: 1,
        min: [0.1, 'Serving size must be at least 0.1'],
      },
      unit: {
        type: String,
        default: 'serving',
        enum: ['g', 'ml', 'oz', 'cup', 'tbsp', 'tsp', 'piece', 'serving'],
      },
    },

    // When was this meal consumed
    consumedAt: {
      type: Date,
      required: [true, 'Consumption date/time is required'],
      default: Date.now,
      index: true, // Index for date-based queries
    },

    // Optional image URL for the meal
    imageUrl: {
      type: String,
      default: null,
    },

    // Food tags for categorization and search
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],

    // Notes or comments
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },

    // Is this a favorite meal? (for quick re-logging)
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ============================================
// COMPOUND INDEXES
// ============================================
// Compound indexes speed up queries that filter on multiple fields

// Index for querying user's meals by date (most common query)
mealSchema.index({ user: 1, consumedAt: -1 }); // -1 = descending (newest first)

// Index for querying user's meals by type and date
mealSchema.index({ user: 1, mealType: 1, consumedAt: -1 });

// Index for date range queries (dashboard analytics)
mealSchema.index({ user: 1, consumedAt: 1 });

// ============================================
// VIRTUAL FIELDS
// ============================================

/**
 * Calculate total macros (protein + carbs + fat) in grams
 */
mealSchema.virtual('totalMacros').get(function () {
  return this.nutrition.protein + this.nutrition.carbs + this.nutrition.fat;
});

/**
 * Get the date portion only (without time)
 */
mealSchema.virtual('consumedDate').get(function () {
  return this.consumedAt.toISOString().split('T')[0];
});

// ============================================
// STATIC METHODS
// ============================================
// Static methods are called on the Model itself (Meal.method())

/**
 * Get daily summary for a user
 * @param {ObjectId} userId - User's ID
 * @param {Date} date - Date to get summary for
 */
mealSchema.statics.getDailySummary = async function (userId, date) {
  // Create start and end of day
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // Aggregation pipeline to sum up nutrition
  const summary = await this.aggregate([
    {
      // Match meals for this user on this date
      $match: {
        user: userId,
        consumedAt: { $gte: startOfDay, $lte: endOfDay },
      },
    },
    {
      // Group all matched documents and sum the fields
      $group: {
        _id: null,
        totalCalories: { $sum: '$nutrition.calories' },
        totalProtein: { $sum: '$nutrition.protein' },
        totalCarbs: { $sum: '$nutrition.carbs' },
        totalFat: { $sum: '$nutrition.fat' },
        totalFiber: { $sum: '$nutrition.fiber' },
        totalSugar: { $sum: '$nutrition.sugar' },
        totalSodium: { $sum: '$nutrition.sodium' },
        mealCount: { $sum: 1 },
      },
    },
  ]);

  // Return summary or default values
  return summary[0] || {
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    totalFiber: 0,
    totalSugar: 0,
    totalSodium: 0,
    mealCount: 0,
  };
};

/**
 * Get meals by date range with aggregation
 * @param {ObjectId} userId - User's ID
 * @param {Date} startDate - Start of range
 * @param {Date} endDate - End of range
 */
mealSchema.statics.getMealsByDateRange = async function (userId, startDate, endDate) {
  return await this.aggregate([
    {
      $match: {
        user: userId,
        consumedAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      // Group by date
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$consumedAt' },
        },
        totalCalories: { $sum: '$nutrition.calories' },
        totalProtein: { $sum: '$nutrition.protein' },
        totalCarbs: { $sum: '$nutrition.carbs' },
        totalFat: { $sum: '$nutrition.fat' },
        mealCount: { $sum: 1 },
        meals: { $push: '$$ROOT' },
      },
    },
    {
      $sort: { _id: -1 }, // Sort by date descending
    },
  ]);
};

// Create and export the model
const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;

