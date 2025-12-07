/**
 * Water Intake Controller
 * =======================
 * Handles water intake tracking endpoints.
 */

const WaterIntake = require('../models/WaterIntake');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Get today's water intake
 * @route   GET /api/water/today
 * @access  Private
 */
const getToday = asyncHandler(async (req, res) => {
  const target = req.user.dailyTargets?.water * 250 || 2000; // Convert glasses to ml
  const record = await WaterIntake.getOrCreateToday(req.user._id, target);

  sendSuccess(res, 200, 'Today\'s water intake retrieved', {
    date: record.date,
    entries: record.entries,
    totalMl: record.totalMl,
    target: record.target,
    progress: record.progress,
    glasses: record.glasses,
  });
});

/**
 * @desc    Add water entry
 * @route   POST /api/water
 * @access  Private
 */
const addEntry = asyncHandler(async (req, res) => {
  const { amount, unit = 'ml', note } = req.body;

  if (!amount || amount <= 0) {
    throw ApiError.badRequest('Please provide a valid amount');
  }

  const target = req.user.dailyTargets?.water * 250 || 2000;
  const record = await WaterIntake.getOrCreateToday(req.user._id, target);

  record.entries.push({
    amount,
    unit,
    note,
    time: new Date(),
  });

  await record.save();

  sendSuccess(res, 201, 'Water entry added', {
    entry: record.entries[record.entries.length - 1],
    totalMl: record.totalMl,
    progress: record.progress,
    glasses: record.glasses,
  });
});

/**
 * @desc    Quick add water (preset amounts)
 * @route   POST /api/water/quick
 * @access  Private
 */
const quickAdd = asyncHandler(async (req, res) => {
  const { preset } = req.body; // glass, bottle, small, large

  const presets = {
    small: { amount: 150, unit: 'ml', note: 'Small glass' },
    glass: { amount: 250, unit: 'ml', note: 'Standard glass' },
    bottle: { amount: 500, unit: 'ml', note: 'Bottle' },
    large: { amount: 750, unit: 'ml', note: 'Large bottle' },
  };

  const selected = presets[preset];
  if (!selected) {
    throw ApiError.badRequest('Invalid preset. Use: small, glass, bottle, large');
  }

  const target = req.user.dailyTargets?.water * 250 || 2000;
  const record = await WaterIntake.getOrCreateToday(req.user._id, target);

  record.entries.push({
    ...selected,
    time: new Date(),
  });

  await record.save();

  sendSuccess(res, 201, `Added ${selected.note}`, {
    entry: record.entries[record.entries.length - 1],
    totalMl: record.totalMl,
    progress: record.progress,
    glasses: record.glasses,
  });
});

/**
 * @desc    Delete water entry
 * @route   DELETE /api/water/:entryId
 * @access  Private
 */
const deleteEntry = asyncHandler(async (req, res) => {
  const { entryId } = req.params;

  const target = req.user.dailyTargets?.water * 250 || 2000;
  const record = await WaterIntake.getOrCreateToday(req.user._id, target);

  const entryIndex = record.entries.findIndex(
    e => e._id.toString() === entryId
  );

  if (entryIndex === -1) {
    throw ApiError.notFound('Entry not found');
  }

  record.entries.splice(entryIndex, 1);
  await record.save();

  sendSuccess(res, 200, 'Entry deleted', {
    totalMl: record.totalMl,
    progress: record.progress,
  });
});

/**
 * @desc    Get water history (last N days)
 * @route   GET /api/water/history
 * @access  Private
 */
const getHistory = asyncHandler(async (req, res) => {
  const { days = 7 } = req.query;
  const daysNum = parseInt(days, 10);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysNum);
  startDate.setHours(0, 0, 0, 0);

  const records = await WaterIntake.find({
    user: req.user._id,
    date: { $gte: startDate },
  }).sort({ date: -1 });

  // Calculate stats
  const totalDays = records.length;
  const totalMl = records.reduce((sum, r) => sum + r.totalMl, 0);
  const avgMl = totalDays > 0 ? Math.round(totalMl / totalDays) : 0;
  const goalsHit = records.filter(r => r.totalMl >= r.target).length;

  sendSuccess(res, 200, 'Water history retrieved', {
    records: records.map(r => ({
      date: r.date,
      totalMl: r.totalMl,
      target: r.target,
      progress: r.progress,
      glasses: r.glasses,
      entryCount: r.entries.length,
    })),
    stats: {
      totalDays,
      totalMl,
      avgMl,
      avgGlasses: Math.round(avgMl / 250 * 10) / 10,
      goalsHit,
      goalPercentage: totalDays > 0 ? Math.round((goalsHit / totalDays) * 100) : 0,
    },
  });
});

/**
 * @desc    Update water target
 * @route   PUT /api/water/target
 * @access  Private
 */
const updateTarget = asyncHandler(async (req, res) => {
  const { target } = req.body; // in ml

  if (!target || target < 500 || target > 10000) {
    throw ApiError.badRequest('Target must be between 500ml and 10,000ml');
  }

  // Update today's record
  const record = await WaterIntake.getOrCreateToday(req.user._id, target);
  record.target = target;
  await record.save();

  sendSuccess(res, 200, 'Target updated', {
    target: record.target,
    progress: record.progress,
  });
});

module.exports = {
  getToday,
  addEntry,
  quickAdd,
  deleteEntry,
  getHistory,
  updateTarget,
};

