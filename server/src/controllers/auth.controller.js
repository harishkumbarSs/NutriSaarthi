/**
 * Authentication Controller
 * =========================
 * Handles user registration, login, token refresh, and profile operations.
 */

const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const { 
  generateToken, 
  generateTokens, 
  verifyRefreshToken, 
  clearRefreshToken,
  REFRESH_TOKEN_EXPIRY_DAYS 
} = require('../middleware/auth');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  
  if (existingUser) {
    throw ApiError.conflict('An account with this email already exists');
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
  });

  // Generate both access and refresh tokens
  const { accessToken, refreshToken } = await generateTokens(user._id);

  // Set refresh token in httpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
  });

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
    token: accessToken,
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw ApiError.badRequest('Please provide email and password');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (!user.isActive) {
    throw ApiError.unauthorized('Your account has been deactivated');
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Generate both access and refresh tokens
  const { accessToken, refreshToken } = await generateTokens(user._id);

  // Set refresh token in httpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
  });

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
    token: accessToken,
  });
});

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 * @access  Public (with valid refresh token)
 */
const refreshAccessToken = asyncHandler(async (req, res) => {
  // Get refresh token from cookie or body
  const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
  const userId = req.body.userId;

  if (!refreshToken || !userId) {
    throw ApiError.unauthorized('Refresh token and user ID required');
  }

  // Verify refresh token
  const user = await verifyRefreshToken(userId, refreshToken);

  if (!user) {
    throw ApiError.unauthorized('Invalid or expired refresh token. Please log in again.');
  }

  if (!user.isActive) {
    throw ApiError.unauthorized('Account has been deactivated');
  }

  // Generate new tokens (token rotation for security)
  const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user._id);

  // Set new refresh token in httpOnly cookie
  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
  });

  sendSuccess(res, 200, 'Token refreshed successfully', {
    token: accessToken,
    refreshToken: newRefreshToken,
  });
});

/**
 * @desc    Logout user (invalidate refresh token)
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  await clearRefreshToken(req.user._id);

  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  sendSuccess(res, 200, 'Logged out successfully');
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
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

  const updates = {};

  if (name) updates.name = name;
  if (avatar !== undefined) updates.avatar = avatar;
  if (profile) updates.profile = { ...req.user.profile.toObject(), ...profile };
  if (preferences) updates.preferences = { ...req.user.preferences.toObject(), ...preferences };

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (profile) {
    const calculatedCalories = user.calculateDailyCalories();
    user.dailyTargets.calories = calculatedCalories;
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

  const user = await User.findById(req.user._id).select('+password');
  const isValid = await user.comparePassword(currentPassword);
  
  if (!isValid) {
    throw ApiError.unauthorized('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  // Generate new tokens after password change
  const { accessToken, refreshToken } = await generateTokens(user._id);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
  });

  sendSuccess(res, 200, 'Password changed successfully', { token: accessToken });
});

module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
  getMe,
  updateProfile,
  updateTargets,
  changePassword,
};
