import { Router, Response } from "express";
import { User } from "../models/User";
import { Workout } from "../models/Workout";
import { Nutrition } from "../models/Nutrition";
import { Post } from "../models/Post";
import { connectDB } from "../db";
import { AuthRequest } from "../types";
import { authenticate } from "../middleware/auth";

const router = Router();

// GET /api/dashboard
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await connectDB();
    const userId = req.user!.userId;

    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    const totalWorkouts = await Workout.countDocuments({ userId });
    const recentWorkouts = await Workout.find({ userId }).sort({ logDate: -1 }).limit(4).lean();

    const volumeAgg = await Workout.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$volume" } } },
    ]);
    const totalVolume = volumeAgg[0]?.total || 0;

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const weeklyWorkouts = await Workout.countDocuments({ userId, logDate: { $gte: weekStart } });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayMeals = await Nutrition.find({ userId, logDate: { $gte: today, $lt: tomorrow } }).lean();
    const dailyNutrition = todayMeals.reduce(
      (acc, meal) => {
        acc.calories += meal.totalCalories || 0;
        acc.protein += meal.totalProtein || 0;
        acc.carbs += meal.totalCarbs || 0;
        acc.fat += meal.totalFat || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    const totalPosts = await Post.countDocuments({ userId });

    res.json({
      success: true,
      data: {
        user: { name: user.name, email: user.email, image: user.image, level: user.level, xp: user.xp, streak: user.streak, fitnessGoal: user.fitnessGoal },
        stats: { totalWorkouts, totalVolume, weeklyWorkouts, totalMeals: todayMeals.length, totalPosts },
        dailyNutrition,
        recentWorkouts: recentWorkouts.map((w) => ({ id: w._id, name: w.name, duration: w.duration, volume: w.volume, logDate: w.logDate, difficulty: w.difficulty })),
      },
    });
  } catch (err) {
    console.error("Dashboard GET error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;
