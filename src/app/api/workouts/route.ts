import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Workout } from "@/lib/models/Workout";
import { User } from "@/lib/models/User";

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

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const workouts = await Workout.find({ userId: session.user.id })
      .sort({ logDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Workout.countDocuments({ userId: session.user.id });

    return NextResponse.json({ workouts, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Workouts GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await connectDB();

    // Calculate total volume from exercises (sum of weight * reps * sets)
    const volume = (body.exercises || []).reduce((total: number, ex: any) => {
      const sets = ex.sets || [];
      const exerciseVol = sets.reduce((sum: number, s: any) => sum + (s.weight || 0) * (s.reps || 0), 0);
      return total + exerciseVol;
    }, 0);

    const workout = await Workout.create({
      userId: session.user.id,
      ...body,
      volume,
    });

    // Award XP and update streak
    const xpEarned = 10 + Math.floor(volume / 500);
    const user = await User.findById(session.user.id);
    if (user) {
      const lastWorkout = await Workout.findOne({ userId: session.user.id })
        .sort({ logDate: -1 })
        .skip(1)
        .lean();
      const streakData = calculateStreak(lastWorkout?.logDate || null, user.streak);
      const newTotalXp = user.xp + xpEarned;
      const newLevel = calculateLevel(newTotalXp);
      await User.findByIdAndUpdate(session.user.id, {
        $set: {
          xp: newTotalXp,
          level: newLevel,
          streak: streakData.streak,
          longestStreak: Math.max(user.longestStreak, streakData.longestStreak),
        },
      });
    }

    return NextResponse.json(workout, { status: 201 });
  } catch (error) {
    console.error("Workout POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
