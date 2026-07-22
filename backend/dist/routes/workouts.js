"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Workout_1 = require("../models/Workout");
const User_1 = require("../models/User");
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
function calculateLevel(xp) {
    return Math.floor(xp / 1000) + 1;
}
function calculateStreak(lastWorkoutDate, currentStreak) {
    if (!lastWorkoutDate)
        return { streak: 1, longestStreak: 1 };
    const now = new Date();
    const last = new Date(lastWorkoutDate);
    const diffDays = Math.floor((now.getTime() - last.getTime()) / 86400000);
    if (diffDays <= 1)
        return { streak: currentStreak + 1, longestStreak: currentStreak + 1 };
    return { streak: 1, longestStreak: currentStreak };
}
// GET /api/workouts
router.get("/", auth_1.authenticate, async (req, res) => {
    try {
        await (0, db_1.connectDB)();
        const limit = parseInt(req.query.limit) || 20;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        const workouts = await Workout_1.Workout.find({ userId: req.user.userId })
            .sort({ logDate: -1 }).skip(skip).limit(limit).lean();
        const total = await Workout_1.Workout.countDocuments({ userId: req.user.userId });
        res.json({ success: true, data: workouts, total, page, pages: Math.ceil(total / limit) });
    }
    catch (err) {
        console.error("Workouts GET error:", err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
// POST /api/workouts
router.post("/", auth_1.authenticate, async (req, res) => {
    try {
        const body = req.body;
        await (0, db_1.connectDB)();
        const volume = (body.exercises || []).reduce((total, ex) => {
            const sets = ex.sets || [];
            return total + sets.reduce((sum, s) => sum + (s.weight || 0) * (s.reps || 0), 0);
        }, 0);
        const workout = await Workout_1.Workout.create({ userId: req.user.userId, ...body, volume });
        // Award XP and update streak
        const xpEarned = 10 + Math.floor(volume / 500);
        const user = await User_1.User.findById(req.user.userId);
        if (user) {
            const lastWorkout = await Workout_1.Workout.findOne({ userId: req.user.userId }).sort({ logDate: -1 }).skip(1).lean();
            const streakData = calculateStreak(lastWorkout?.logDate || null, user.streak);
            const newTotalXp = user.xp + xpEarned;
            const newLevel = calculateLevel(newTotalXp);
            await User_1.User.findByIdAndUpdate(req.user.userId, {
                $set: { xp: newTotalXp, level: newLevel, streak: streakData.streak, longestStreak: Math.max(user.longestStreak, streakData.longestStreak) },
            });
        }
        res.status(201).json({ success: true, data: workout });
    }
    catch (err) {
        console.error("Workout POST error:", err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.default = router;
//# sourceMappingURL=workouts.js.map