"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Progress_1 = require("../models/Progress");
const Workout_1 = require("../models/Workout");
const Nutrition_1 = require("../models/Nutrition");
const User_1 = require("../models/User");
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /api/progress
router.get("/", auth_1.authenticate, async (req, res) => {
    try {
        await (0, db_1.connectDB)();
        const limit = parseInt(req.query.limit) || 50;
        const entries = await Progress_1.Progress.find({ userId: req.user.userId })
            .sort({ logDate: -1 }).limit(limit).lean();
        const totalWorkouts = await Workout_1.Workout.countDocuments({ userId: req.user.userId });
        const workoutAgg = await Workout_1.Workout.aggregate([
            { $match: { userId: req.user.userId } },
            { $group: { _id: null, totalVolume: { $sum: "$volume" } } },
        ]);
        const nutritionAgg = await Nutrition_1.Nutrition.aggregate([
            { $match: { userId: req.user.userId } },
            { $group: { _id: null, totalCalories: { $sum: "$totalCalories" } } },
        ]);
        res.json({
            success: true,
            data: {
                entries,
                stats: {
                    totalWorkouts,
                    totalVolume: workoutAgg[0]?.totalVolume || 0,
                    totalCalories: nutritionAgg[0]?.totalCalories || 0,
                },
            },
        });
    }
    catch (err) {
        console.error("Progress GET error:", err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
// POST /api/progress
router.post("/", auth_1.authenticate, async (req, res) => {
    try {
        await (0, db_1.connectDB)();
        const entry = await Progress_1.Progress.create({ userId: req.user.userId, ...req.body });
        await User_1.User.findByIdAndUpdate(req.user.userId, { $inc: { xp: 2 } });
        res.status(201).json({ success: true, data: entry });
    }
    catch (err) {
        console.error("Progress POST error:", err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.default = router;
//# sourceMappingURL=progress.js.map