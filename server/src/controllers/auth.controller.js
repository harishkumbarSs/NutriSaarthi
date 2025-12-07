/**
 * Authentication Controller
 * =========================
 * Handles user registration, login, and profile operations.
 * 
 * Controller = The "brain" that handles business logic
 * - Receives request from route
 * - Processes data (validation, database operations)
 * - Sends response back to client
 */

const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const { generateToken } = require('../middleware/auth');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  
  if (existingUser) {
    throw ApiError.conflict('An account with this email already exists');
  }

  // Create new user
  // Password will be hashed automatically by pre-save hook
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
  });

  // Generate JWT token
  const token = generateToken(user._id);

  // Send response (exclude password)
  sendSuccess(res, 201, 'Registration successful! Welcome to NutriSaarthi.', {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      profile: user.profile,
      dailyTargets: user.dailyTargets,
      preferences: user.preferences,
      createdAt: user.createdAt,
    },
    token,
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    throw ApiError.badRequest('Please provide email and password');
  }

  // Find user by email (include password for comparison)
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Check if account is active
  if (!user.isActive) {
    throw ApiError.unauthorized('Your account has been deactivated');
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Update last login time
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Generate token
  const token = generateToken(user._id);

  // Send response
  sendSuccess(res, 200, 'Login successful!', {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      profile: user.profile,
      dailyTargets: user.dailyTargets,
      preferences: user.preferences,
      lastLogin: user.lastLogin,
    },
    token,
  });
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private (requires login)
 */
const getMe = asyncHandler(async (req, res) => {
  // req.user is set by auth middleware
  const user = await User.findById(req.user._id);

  sendSuccess(res, 200, 'Profile retrieved successfully', {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      profile: user.profile,
      dailyTargets: user.dailyTargets,
      preferences: user.preferences,
      bmi: user.bmi,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    },
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { name, avatar, profile, preferences } = req.body;

  // Fields that can be updated
  const updates = {};

  if (name) updates.name = name;
  if (avatar !== undefined) updates.avatar = avatar;
  if (profile) updates.profile = { ...req.user.profile.toObject(), ...profile };
  if (preferences) updates.preferences = { ...req.user.preferences.toObject(), ...preferences };

  // Update user
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  // Recalculate daily calories if profile was updated
  if (profile) {
    const calculatedCalories = user.calculateDailyCalories();
    
    // Update daily targets with calculated values
    user.dailyTargets.calories = calculatedCalories;
    
    // Calculate macros based on standard ratios
    // Protein: 20% of calories, 4 cal/gram
    // Carbs: 50% of calories, 4 cal/gram
    // Fat: 30% of calories, 9 cal/gram
    user.dailyTargets.protein = Math.round((calculatedCalories * 0.20) / 4);
    user.dailyTargets.carbs = Math.round((calculatedCalories * 0.50) / 4);
    user.dailyTargets.fat = Math.round((calculatedCalories * 0.30) / 9);
    
    await user.save();
  }

  sendSuccess(res, 200, 'Profile updated successfully', {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      profile: user.profile,
      dailyTargets: user.dailyTargets,
      preferences: user.preferences,
      bmi: user.bmi,
    },
  });
});

/**
 * @desc    Update daily nutrition targets
 * @route   PUT /api/auth/targets
 * @access  Private
 */
const updateTargets = asyncHandler(async (req, res) => {
  const { calories, protein, carbs, fat, fiber, water } = req.body;

  const updates = {};
  if (calories !== undefined) updates['dailyTargets.calories'] = calories;
  if (protein !== undefined) updates['dailyTargets.protein'] = protein;
  if (carbs !== undefined) updates['dailyTargets.carbs'] = carbs;
  if (fat !== undefined) updates['dailyTargets.fat'] = fat;
  if (fiber !== undefined) updates['dailyTargets.fiber'] = fiber;
  if (water !== undefined) updates['dailyTargets.water'] = water;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  sendSuccess(res, 200, 'Daily targets updated successfully', {
    dailyTargets: user.dailyTargets,
  });
});

/**
 * @desc    Change password
 * @route   PUT /api/auth/password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw ApiError.badRequest('Please provide current and new password');
  }

  if (newPassword.length < 6) {
    throw ApiError.badRequest('New password must be at least 6 characters');
  }

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');

  // Verify current password
  const isValid = await user.comparePassword(currentPassword);
  
  if (!isValid) {
    throw ApiError.unauthorized('Current password is incorrect');
  }

  // Update password (will be hashed by pre-save hook)
  user.password = newPassword;
  await user.save();

  // Generate new token (invalidates old one)
  const token = generateToken(user._id);

  sendSuccess(res, 200, 'Password changed successfully', { token });
});

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  updateTargets,
  changePassword,
};

