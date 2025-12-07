/**
 * User Model
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
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
      select: false,
    },

    avatar: {
      type: String,
      default: null,
    },

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
        type: Number,
        min: [50, 'Height must be at least 50 cm'],
        max: [300, 'Height seems unrealistic'],
      },
      weight: {
        type: Number,
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

    dailyTargets: {
      calories: { type: Number, default: 2000 },
      protein: { type: Number, default: 50 },
      carbs: { type: Number, default: 250 },
      fat: { type: Number, default: 65 },
      fiber: { type: Number, default: 25 },
      water: { type: Number, default: 8 },
    },

    preferences: {
      dietType: {
        type: String,
        enum: ['none', 'vegetarian', 'vegan', 'keto', 'paleo', 'mediterranean'],
        default: 'none',
      },
      allergies: [{ type: String, trim: true }],
      dislikedFoods: [{ type: String, trim: true }],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Pre-save hook: Hash password before saving
 */
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw new Error(`Password hashing failed: ${error.message}`);
  }
});

/**
 * Compare entered password with hashed password
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Calculate BMI
 */
userSchema.methods.calculateBMI = function () {
  if (!this.profile.weight || !this.profile.height) {
    return null;
  }
  const heightInMeters = this.profile.height / 100;
  return Math.round((this.profile.weight / (heightInMeters * heightInMeters)) * 10) / 10;
};

/**
 * Calculate recommended daily calories (Mifflin-St Jeor Equation)
 */
userSchema.methods.calculateDailyCalories = function () {
  const { age, gender, height, weight, activityLevel, goal } = this.profile;
  
  if (!age || !gender || !height || !weight) {
    return this.dailyTargets.calories;
  }

  let bmr;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const activityMultipliers = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'active': 1.725,
    'very-active': 1.9,
  };

  let tdee = bmr * (activityMultipliers[activityLevel] || 1.55);

  const goalAdjustments = {
    'lose-weight': -500,
    'maintain': 0,
    'gain-weight': 300,
    'build-muscle': 400,
  };

  tdee += goalAdjustments[goal] || 0;
  return Math.round(tdee);
};

userSchema.virtual('bmi').get(function () {
  return this.calculateBMI();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
