import { Router, Response } from "express";
import { User } from "../models/User";
import { connectDB } from "../db";

const router = Router();

// GET /api/leaderboard
router.get("/", async (_req, res: Response) => {
  try {
    await connectDB();
    const leaders = await User.find({ isPublic: true })
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
  } catch (err) {
    console.error("Leaderboard GET error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;
