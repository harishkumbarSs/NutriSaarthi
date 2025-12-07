/**
 * Water Intake Model
 * ==================
 * Tracks daily water consumption for each user.
 */

const mongoose = require('mongoose');

const waterEntrySchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative'],
    max: [5000, 'Amount seems too high'],
  },
  unit: {
    type: String,
    enum: ['ml', 'glass', 'bottle', 'liter'],
    default: 'ml',
  },
  time: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
    maxlength: 100,
  },
});

const waterIntakeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    entries: [waterEntrySchema],
    totalMl: {
      type: Number,
      default: 0,
    },
    target: {
      type: Number,
      default: 2000, // 2 liters default
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
waterIntakeSchema.index({ user: 1, date: -1 }, { unique: true });

// Convert units to ml
const toMl = (amount, unit) => {
  const conversions = {
    ml: 1,
    glass: 250,
    bottle: 500,
    liter: 1000,
  };
  return amount * (conversions[unit] || 1);
};

// Pre-save: Calculate total
waterIntakeSchema.pre('save', function (next) {
  this.totalMl = this.entries.reduce((sum, entry) => {
    return sum + toMl(entry.amount, entry.unit);
  }, 0);
  next();
});

// Static: Get or create today's record
waterIntakeSchema.statics.getOrCreateToday = async function (userId, target = 2000) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let record = await this.findOne({ user: userId, date: today });

  if (!record) {
    record = await this.create({
      user: userId,
      date: today,
      entries: [],
      target,
    });
  }

  return record;
};

// Virtual: Progress percentage
waterIntakeSchema.virtual('progress').get(function () {
  return Math.min(100, Math.round((this.totalMl / this.target) * 100));
});

// Virtual: Glasses equivalent
waterIntakeSchema.virtual('glasses').get(function () {
  return Math.round(this.totalMl / 250 * 10) / 10;
});

waterIntakeSchema.set('toJSON', { virtuals: true });
waterIntakeSchema.set('toObject', { virtuals: true });

const WaterIntake = mongoose.model('WaterIntake', waterIntakeSchema);

module.exports = WaterIntake;

