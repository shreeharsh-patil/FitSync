const mongoose = require('mongoose');

const RoutineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  routine: { type: String, default: "Custom Routine" }, // Focus category
  repinfo: { type: String, required: true }, // e.g. "4 sets x 12 reps"
  exercises: [{
    name: String,
    reps: String,
    note: String
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Routine', RoutineSchema);
