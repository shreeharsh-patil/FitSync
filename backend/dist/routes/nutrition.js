"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Nutrition_1 = require("../models/Nutrition");
const User_1 = require("../models/User");
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /api/nutrition
router.get("/", auth_1.authenticate, async (req, res) => {
    try {
        await (0, db_1.connectDB)();
        const dateStr = req.query.date;
        const query = { userId: req.user.userId };
        if (dateStr) {
            const start = new Date(dateStr);
            start.setHours(0, 0, 0, 0);
            const end = new Date(dateStr);
            end.setHours(23, 59, 59, 999);
            query.logDate = { $gte: start, $lte: end };
        }
        const meals = await Nutrition_1.Nutrition.find(query).sort({ logDate: -1 }).lean();
        const dailyTotals = meals.reduce((acc, meal) => {
            acc.calories += meal.totalCalories || 0;
            acc.protein += meal.totalProtein || 0;
            acc.carbs += meal.totalCarbs || 0;
            acc.fat += meal.totalFat || 0;
            acc.waterMl += meal.waterMl || 0;
            return acc;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0, waterMl: 0 });
        res.json({ success: true, data: { meals, dailyTotals } });
    }
    catch (err) {
        console.error("Nutrition GET error:", err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
// POST /api/nutrition
router.post("/", auth_1.authenticate, async (req, res) => {
    try {
        const body = req.body;
        await (0, db_1.connectDB)();
        const foodItems = body.foodItems || [];
        const totals = foodItems.reduce((acc, item) => {
            acc.calories += item.calories || 0;
            acc.protein += item.protein || 0;
            acc.carbs += item.carbs || 0;
            acc.fat += item.fat || 0;
            return acc;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
        const meal = await Nutrition_1.Nutrition.create({
            userId: req.user.userId,
            logDate: body.logDate || new Date(),
            mealType: body.mealType,
            foodItems,
            totalCalories: totals.calories,
            totalProtein: totals.protein,
            totalCarbs: totals.carbs,
            totalFat: totals.fat,
            waterMl: body.waterMl || 0,
            notes: body.notes,
        });
        await User_1.User.findByIdAndUpdate(req.user.userId, { $inc: { xp: 3 } });
        res.status(201).json({ success: true, data: meal });
    }
    catch (err) {
        console.error("Nutrition POST error:", err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.default = router;
//# sourceMappingURL=nutrition.js.map