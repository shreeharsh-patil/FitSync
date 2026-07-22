"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../models/User");
const db_1 = require("../db");
const router = (0, express_1.Router)();
// GET /api/leaderboard
router.get("/", async (_req, res) => {
    try {
        await (0, db_1.connectDB)();
        const leaders = await User_1.User.find({ isPublic: true })
            .select("name image xp level streak")
            .sort({ xp: -1 })
            .limit(50)
            .lean();
        const ranked = leaders.map((user, index) => ({
            rank: index + 1,
            id: user._id,
            name: user.name,
            image: user.image,
            xp: user.xp,
            level: user.level,
            streak: user.streak,
        }));
        res.json({ success: true, data: ranked });
    }
    catch (err) {
        console.error("Leaderboard GET error:", err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.default = router;
//# sourceMappingURL=leaderboard.js.map