import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { Workout } from "@/lib/models/Workout";
import { Nutrition } from "@/lib/models/Nutrition";
import { Post } from "@/lib/models/Post";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = session.user.id;

    // Get user profile
    const user = await User.findById(userId).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get workout stats
    const totalWorkouts = await Workout.countDocuments({ userId });
    const recentWorkouts = await Workout.find({ userId })
      .sort({ logDate: -1 })
      .limit(4)
      .lean();

    const volumeAgg = await Workout.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$volume" } } },
    ]);
    const totalVolume = volumeAgg[0]?.total || 0;

    // Get weekly workouts count
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const weeklyWorkouts = await Workout.countDocuments({
      userId,
      logDate: { $gte: weekStart },
    });

    // Get today's nutrition totals
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayMeals = await Nutrition.find({
      userId,
      logDate: { $gte: today, $lt: tomorrow },
    }).lean();

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

    // Count achievements (posts + workout milestones)
    const totalPosts = await Post.countDocuments({ userId });

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
        level: user.level,
        xp: user.xp,
        streak: user.streak,
        fitnessGoal: user.fitnessGoal,
      },
      stats: {
        totalWorkouts,
        totalVolume,
        weeklyWorkouts,
        totalMeals: todayMeals.length,
        totalPosts,
      },
      dailyNutrition,
      recentWorkouts: recentWorkouts.map((w) => ({
        id: w._id,
        name: w.name,
        duration: w.duration,
        volume: w.volume,
        logDate: w.logDate,
        difficulty: w.difficulty,
      })),
    });
  } catch (error) {
    console.error("Dashboard GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
