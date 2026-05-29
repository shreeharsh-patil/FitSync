const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dayName: { type: String, required: true }, // e.g. "MON", "TUE"
  dayNum: { type: Number, required: true }, // e.g. 14, 15
  steps: { type: Number, default: 0 },
  km: { type: Number, default: 0.0 },
  activeMin: { type: Number, default: 0 },
  recovery: { type: Number, default: 70 },
  sleep: { type: String, default: "7.0" },
  bpm: { type: Number, default: 60 },
  water: { type: Number, default: 0 },
  sets: { type: Number, default: 0 },
  reps: { type: Number, default: 0 },
  chest: { type: Number, default: 0 },
  triceps: { type: Number, default: 0 },
  shoulders: { type: Number, default: 0 },
  workout: { type: String, default: "Rest Day" },
  calories: { type: Number, default: 0 },
  runMiles: { type: Number, default: 0.0 }
});

// Ensure unique entry per user per dayNum
ActivityLogSchema.index({ userId: 1, dayNum: 1 }, { unique: true });

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
