import { Router, Response } from "express";
import { Progress } from "../models/Progress";
import { Workout } from "../models/Workout";
import { Nutrition } from "../models/Nutrition";
import { User } from "../models/User";
import { connectDB } from "../db";
import { AuthRequest } from "../types";
import { authenticate } from "../middleware/auth";

const router = Router();

// GET /api/progress
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await connectDB();
    const limit = parseInt(req.query.limit as string) || 50;

    const entries = await Progress.find({ userId: req.user!.userId })
      .sort({ logDate: -1 }).limit(limit).lean();

    const totalWorkouts = await Workout.countDocuments({ userId: req.user!.userId });
    const workoutAgg = await Workout.aggregate([
      { $match: { userId: req.user!.userId } },
      { $group: { _id: null, totalVolume: { $sum: "$volume" } } },
    ]);
    const nutritionAgg = await Nutrition.aggregate([
      { $match: { userId: req.user!.userId } },
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
  } catch (err) {
    console.error("Progress GET error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/progress
router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await connectDB();
    const entry = await Progress.create({ userId: req.user!.userId, ...req.body });
    await User.findByIdAndUpdate(req.user!.userId, { $inc: { xp: 2 } });
    res.status(201).json({ success: true, data: entry });
  } catch (err) {
    console.error("Progress POST error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;
