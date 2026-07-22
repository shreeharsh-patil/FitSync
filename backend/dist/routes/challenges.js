"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Challenge_1 = require("../models/Challenge");
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /api/challenges
router.get("/", async (_req, res) => {
    try {
        await (0, db_1.connectDB)();
        const challenges = await Challenge_1.Challenge.find({ endDate: { $gte: new Date() } })
            .sort({ startDate: 1 }).lean();
        res.json({ success: true, data: challenges });
    }
    catch (err) {
        console.error("Challenges GET error:", err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
// POST /api/challenges (join or create)
router.post("/", auth_1.authenticate, async (req, res) => {
    try {
        const userId = req.user.userId;
        const body = req.body;
        await (0, db_1.connectDB)();
        // Join existing
        if (body.challengeId) {
            const challenge = await Challenge_1.Challenge.findById(body.challengeId);
            if (!challenge)
                return res.status(404).json({ success: false, error: "Challenge not found" });
            const alreadyJoined = challenge.participants.some((p) => p.userId.toString() === userId);
            if (alreadyJoined)
                return res.status(409).json({ success: false, error: "Already joined" });
            challenge.participants.push({ userId: userId, progress: 0, joinedAt: new Date() });
            await challenge.save();
            return res.json({ success: true, data: challenge });
        }
        // Create new
        const challenge = await Challenge_1.Challenge.create({
            name: body.name,
            description: body.description,
            startDate: body.startDate || new Date(),
            endDate: body.endDate,
            rules: body.rules,
            participants: [{ userId, progress: 0, joinedAt: new Date() }],
        });
        res.status(201).json({ success: true, data: challenge });
    }
    catch (err) {
        console.error("Challenges POST error:", err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.default = router;
//# sourceMappingURL=challenges.js.map