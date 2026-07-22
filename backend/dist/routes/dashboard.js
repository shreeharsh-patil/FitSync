"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../models/User");
const Workout_1 = require("../models/Workout");
const Nutrition_1 = require("../models/Nutrition");
const Post_1 = require("../models/Post");
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /api/dashboard
router.get("/", auth_1.authenticate, async (req, res) => {
    try {
        await (0, db_1.connectDB)();
        const userId = req.user.userId;
        const user = await User_1.User.findById(userId).lean();
        if (!user)
            return res.status(404).json({ success: false, error: "User not found" });
        const totalWorkouts = await Workout_1.Workout.countDocuments({ userId });
        const recentWorkouts = await Workout_1.Workout.find({ userId }).sort({ logDate: -1 }).limit(4).lean();
        const volumeAgg = await Workout_1.Workout.aggregate([
            { $match: { userId } },
            { $group: { _id: null, total: { $sum: "$volume" } } },
        ]);
        const totalVolume = volumeAgg[0]?.total || 0;
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);
        const weeklyWorkouts = await Workout_1.Workout.countDocuments({ userId, logDate: { $gte: weekStart } });
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const todayMeals = await Nutrition_1.Nutrition.find({ userId, logDate: { $gte: today, $lt: tomorrow } }).lean();
        const dailyNutrition = todayMeals.reduce((acc, meal) => {
            acc.calories += meal.totalCalories || 0;
            acc.protein += meal.totalProtein || 0;
            acc.carbs += meal.totalCarbs || 0;
            acc.fat += meal.totalFat || 0;
            return acc;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
        const totalPosts = await Post_1.Post.countDocuments({ userId });
        res.json({
            success: true,
            data: {
                user: { name: user.name, email: user.email, image: user.image, level: user.level, xp: user.xp, streak: user.streak, fitnessGoal: user.fitnessGoal },
                stats: { totalWorkouts, totalVolume, weeklyWorkouts, totalMeals: todayMeals.length, totalPosts },
                dailyNutrition,
                recentWorkouts: recentWorkouts.map((w) => ({ id: w._id, name: w.name, duration: w.duration, volume: w.volume, logDate: w.logDate, difficulty: w.difficulty })),
            },
        });
    }
    catch (err) {
        console.error("Dashboard GET error:", err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.default = router;
//# sourceMappingURL=dashboard.js.map