"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../models/User");
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
// GET /api/users/me
router.get("/me", auth_1.authenticate, async (req, res) => {
    try {
        await (0, db_1.connectDB)();
        const user = await User_1.User.findById(req.user.userId).lean();
        if (!user)
            throw new errorHandler_1.AppError("User not found", 404);
        res.json({ success: true, data: user });
    }
    catch (err) {
        if (err instanceof errorHandler_1.AppError)
            return res.status(err.statusCode).json({ success: false, error: err.message });
        console.error("User GET error:", err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
// PUT /api/users/me
router.put("/me", auth_1.authenticate, async (req, res) => {
    try {
        const body = req.body;
        const allowed = ["name", "fitnessGoal", "activityLevel", "height", "weight", "bio", "isPublic", "image", "integrations"];
        const updates = {};
        for (const key of allowed) {
            if (body[key] !== undefined)
                updates[key] = body[key];
        }
        await (0, db_1.connectDB)();
        const user = await User_1.User.findByIdAndUpdate(req.user.userId, { $set: updates }, { new: true }).lean();
        res.json({ success: true, data: user });
    }
    catch (err) {
        console.error("User PUT error:", err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
// PUT /api/users/integrations
router.put("/integrations", auth_1.authenticate, async (req, res) => {
    try {
        const { integration, enabled } = req.body;
        const valid = ["appleHealth", "googleFit", "fitbit", "strava"];
        if (!valid.includes(integration)) {
            throw new errorHandler_1.AppError("Invalid integration", 400);
        }
        await (0, db_1.connectDB)();
        const user = await User_1.User.findByIdAndUpdate(req.user.userId, { $set: { [`integrations.${integration}`]: enabled } }, { new: true }).lean();
        res.json({ success: true, data: { integrations: user?.integrations } });
    }
    catch (err) {
        if (err instanceof errorHandler_1.AppError)
            return res.status(err.statusCode).json({ success: false, error: err.message });
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map