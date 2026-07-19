import { Router, Response } from "express";
import { Challenge } from "../models/Challenge";
import { connectDB } from "../db";
import { AuthRequest } from "../types";
import { authenticate } from "../middleware/auth";

const router = Router();

// GET /api/challenges
router.get("/", async (_req, res: Response) => {
  try {
    await connectDB();
    const challenges = await Challenge.find({ endDate: { $gte: new Date() } })
      .sort({ startDate: 1 }).lean();
    res.json({ success: true, data: challenges });
  } catch (err) {
    console.error("Challenges GET error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/challenges (join or create)
router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const body = req.body;
    await connectDB();

    // Join existing
    if (body.challengeId) {
      const challenge = await Challenge.findById(body.challengeId);
      if (!challenge) return res.status(404).json({ success: false, error: "Challenge not found" });

      const alreadyJoined = challenge.participants.some((p) => p.userId.toString() === userId);
      if (alreadyJoined) return res.status(409).json({ success: false, error: "Already joined" });

      challenge.participants.push({ userId: userId as any, progress: 0, joinedAt: new Date() });
      await challenge.save();
      return res.json({ success: true, data: challenge });
    }

    // Create new
    const challenge = await Challenge.create({
      name: body.name,
      description: body.description,
      startDate: body.startDate || new Date(),
      endDate: body.endDate,
      rules: body.rules,
      participants: [{ userId, progress: 0, joinedAt: new Date() }],
    });
    res.status(201).json({ success: true, data: challenge });
  } catch (err) {
    console.error("Challenges POST error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;
