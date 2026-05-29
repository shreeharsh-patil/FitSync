const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fats: { type: Number, default: 0 },
  type: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'], default: 'Snack' },
  time: { type: String, required: true },
  img: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Meal', MealSchema);
