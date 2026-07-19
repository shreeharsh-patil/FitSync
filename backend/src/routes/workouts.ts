import { Router, Response } from "express";
import { Workout } from "../models/Workout";
import { User } from "../models/User";
import { connectDB } from "../db";
import { AuthRequest } from "../types";
import { authenticate } from "../middleware/auth";

const router = Router();

function calculateLevel(xp: number): number {
  return Math.floor(xp / 1000) + 1;
}

function calculateStreak(lastWorkoutDate: Date | null, currentStreak: number): { streak: number; longestStreak: number } {
  if (!lastWorkoutDate) return { streak: 1, longestStreak: 1 };
  const now = new Date();
  const last = new Date(lastWorkoutDate);
  const diffDays = Math.floor((now.getTime() - last.getTime()) / 86400000);
  if (diffDays <= 1) return { streak: currentStreak + 1, longestStreak: currentStreak + 1 };
  return { streak: 1, longestStreak: currentStreak };
}

// GET /api/workouts
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await connectDB();
    const limit = parseInt(req.query.limit as string) || 20;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    const workouts = await Workout.find({ userId: req.user!.userId })
      .sort({ logDate: -1 }).skip(skip).limit(limit).lean();
    const total = await Workout.countDocuments({ userId: req.user!.userId });

    res.json({ success: true, data: workouts, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("Workouts GET error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/workouts
router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const body = req.body;
    await connectDB();

    const volume = (body.exercises || []).reduce((total: number, ex: any) => {
      const sets = ex.sets || [];
      return total + sets.reduce((sum: number, s: any) => sum + (s.weight || 0) * (s.reps || 0), 0);
    }, 0);

    const workout = await Workout.create({ userId: req.user!.userId, ...body, volume });

    // Award XP and update streak
    const xpEarned = 10 + Math.floor(volume / 500);
    const user = await User.findById(req.user!.userId);
    if (user) {
      const lastWorkout = await Workout.findOne({ userId: req.user!.userId }).sort({ logDate: -1 }).skip(1).lean();
      const streakData = calculateStreak(lastWorkout?.logDate || null, user.streak);
      const newTotalXp = user.xp + xpEarned;
      const newLevel = calculateLevel(newTotalXp);
      await User.findByIdAndUpdate(req.user!.userId, {
        $set: { xp: newTotalXp, level: newLevel, streak: streakData.streak, longestStreak: Math.max(user.longestStreak, streakData.longestStreak) },
      });
    }

    res.status(201).json({ success: true, data: workout });
  } catch (err) {
    console.error("Workout POST error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;
