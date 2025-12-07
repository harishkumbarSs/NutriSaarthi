/**
 * User Model
 * ==========
 * Defines the structure of a user in our database.
 * 
 * What is a Mongoose Schema?
 * - It's like a blueprint for our data
 * - Defines what fields a user can have
 * - Validates data before saving to database
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema Definition
 * Each field has:
 * - type: What kind of data (String, Number, etc.)
 * - required: Must this field have a value?
 * - unique: Can only one user have this value?
 * - default: What value if none provided?
 */
const userSchema = new mongoose.Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true, // Removes whitespace from both ends
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // No two users can have same email
      lowercase: true, // Converts to lowercase before saving
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't include password in queries by default
    },

    // Profile Information
    avatar: {
      type: String,
      default: null,
    },

    // Health & Nutrition Goals
    profile: {
      age: {
        type: Number,
        min: [1, 'Age must be positive'],
        max: [150, 'Age seems unrealistic'],
      },
      gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer-not-to-say'],
      },
      height: {
        type: Number, // in cm
        min: [50, 'Height must be at least 50 cm'],
        max: [300, 'Height seems unrealistic'],
      },
      weight: {
        type: Number, // in kg
        min: [20, 'Weight must be at least 20 kg'],
        max: [500, 'Weight seems unrealistic'],
      },
      activityLevel: {
        type: String,
        enum: ['sedentary', 'light', 'moderate', 'active', 'very-active'],
        default: 'moderate',
      },
      goal: {
        type: String,
        enum: ['lose-weight', 'maintain', 'gain-weight', 'build-muscle'],
        default: 'maintain',
      },
    },

    // Daily Nutrition Targets (calculated or custom)
    dailyTargets: {
      calories: { type: Number, default: 2000 },
      protein: { type: Number, default: 50 }, // grams
      carbs: { type: Number, default: 250 }, // grams
      fat: { type: Number, default: 65 }, // grams
      fiber: { type: Number, default: 25 }, // grams
      water: { type: Number, default: 8 }, // glasses
    },

    // Dietary Preferences
    preferences: {
      dietType: {
        type: String,
        enum: ['none', 'vegetarian', 'vegan', 'keto', 'paleo', 'mediterranean'],
        default: 'none',
      },
      allergies: [{
        type: String,
        trim: true,
      }],
      dislikedFoods: [{
        type: String,
        trim: true,
      }],
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },
    
    lastLogin: {
      type: Date,
    },
  },
  {
    // Schema Options
    timestamps: true, // Adds createdAt and updatedAt automatically
    toJSON: { virtuals: true }, // Include virtual fields when converting to JSON
    toObject: { virtuals: true },
  }
);

// ============================================
// INDEXES
// ============================================
// Indexes speed up queries - like a book's index helps you find pages faster

userSchema.index({ email: 1 }); // 1 = ascending order

// ============================================
// MIDDLEWARE (Pre/Post Hooks)
// ============================================

/**
 * Pre-save hook: Hash password before saving
 * 
 * Why hash passwords?
 * - If database is breached, hackers can't see real passwords
 * - bcrypt is a one-way hash - can't be reversed
 * - Each hash includes a "salt" making rainbow table attacks useless
 */
userSchema.pre('save', async function () {
  // Only hash if password was modified (or is new)
  // This prevents re-hashing already hashed passwords
  if (!this.isModified('password')) {
    return;
  }

  // Generate salt (random data added to password)
  // 12 is the "cost factor" - higher = more secure but slower
  const salt = await bcrypt.genSalt(12);
  
  // Hash the password with the salt
  this.password = await bcrypt.hash(this.password, salt);
});

// ============================================
// INSTANCE METHODS
// ============================================
// Methods available on individual user documents

/**
 * Compare entered password with hashed password in database
 * @param {string} candidatePassword - Password to check
 * @returns {boolean} - True if passwords match
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  // bcrypt.compare handles the hashing and comparison
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Calculate BMI (Body Mass Index)
 * Formula: weight(kg) / height(m)²
 */
userSchema.methods.calculateBMI = function () {
  if (!this.profile.weight || !this.profile.height) {
    return null;
  }
  
  const heightInMeters = this.profile.height / 100;
  const bmi = this.profile.weight / (heightInMeters * heightInMeters);
  
  return Math.round(bmi * 10) / 10; // Round to 1 decimal
};

/**
 * Calculate recommended daily calories based on profile
 * Uses Mifflin-St Jeor Equation (most accurate for most people)
 */
userSchema.methods.calculateDailyCalories = function () {
  const { age, gender, height, weight, activityLevel, goal } = this.profile;
  
  if (!age || !gender || !height || !weight) {
    return this.dailyTargets.calories; // Return default
  }

  // Base Metabolic Rate (BMR)
  let bmr;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Activity multipliers
  const activityMultipliers = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'active': 1.725,
    'very-active': 1.9,
  };

  // Total Daily Energy Expenditure (TDEE)
  let tdee = bmr * (activityMultipliers[activityLevel] || 1.55);

  // Adjust for goal
  const goalAdjustments = {
    'lose-weight': -500, // 500 calorie deficit
    'maintain': 0,
    'gain-weight': 300,
    'build-muscle': 400,
  };

  tdee += goalAdjustments[goal] || 0;

  return Math.round(tdee);
};

// ============================================
// VIRTUAL FIELDS
// ============================================
// Computed properties that don't get saved to database

userSchema.virtual('bmi').get(function () {
  return this.calculateBMI();
});

// Create and export the model
// 'User' becomes 'users' collection in MongoDB (pluralized, lowercase)
const User = mongoose.model('User', userSchema);

module.exports = User;

