const mongoose = require('mongoose');

const WeightLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weight: { type: Number, required: true }, // stored in kg
  date: { type: String, required: true }, // e.g. "May 29"
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WeightLog', WeightLogSchema);
