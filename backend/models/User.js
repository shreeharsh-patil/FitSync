const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  level: { type: Number, default: 42 },
  fitnessGoal: { 
    type: String, 
    enum: ['WEIGHT_LOSS', 'MUSCLE_GAIN', 'ENDURANCE', 'FLEXIBILITY', 'GENERAL'],
    default: 'GENERAL'
  },
  height: { type: Number, default: 175 },
  weight: { type: Number, default: 68.0 },
  targetBmi: { type: Number, default: 21.5 },
  avatar: { type: String, default: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANOmh7jFGIMlEymlm5qyXZ_-gkcHgYS-46pUy9xs-ZWni1tGrbTMaJs_S6GEFNakfHaGCFTG5voxDH5DqKKzXEr33PUXAcNGMVgM-Azc3_Ld7gMfOq24fAjo6YPDdSZ4av83pzCU7lVk4mv3YNeD07eh5iv_813c2EpNwEUAP7sPkoGkbfOpE5MEJYuZefdAOoqx1zj0hYiPh2pzz3MFndBE-BB2Bj3nAb6LRi3gPLW3LsWF5nhYJeBTr4x0MmbNrpGQs0AC6-kAjW' },
  goals: {
    steps: { type: Number, default: 10000 },
    calories: { type: Number, default: 700 },
    hydration: { type: Number, default: 8 },
    sleep: { type: Number, default: 8.0 },
    activeMin: { type: Number, default: 60 }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
