import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Progress } from "@/lib/models/Progress";
import { Workout } from "@/lib/models/Workout";
import { Nutrition } from "@/lib/models/Nutrition";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    const entries = await Progress.find({ userId: session.user.id })
      .sort({ logDate: -1 })
      .limit(limit)
      .lean();

    // Aggregate stats
    const totalWorkouts = await Workout.countDocuments({ userId: session.user.id });
    const workoutAgg = await Workout.aggregate([
      { $match: { userId: session.user.id } },
      { $group: { _id: null, totalVolume: { $sum: "$volume" } } },
    ]);

    const nutritionAgg = await Nutrition.aggregate([
      { $match: { userId: session.user.id } },
      { $group: { _id: null, totalCalories: { $sum: "$totalCalories" } } },
    ]);

    return NextResponse.json({
      entries,
      stats: {
        totalWorkouts,
        totalVolume: workoutAgg[0]?.totalVolume || 0,
        totalCalories: nutritionAgg[0]?.totalCalories || 0,
      },
    });
  } catch (error) {
    console.error("Progress GET error:", error);
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

    const entry = await Progress.create({
      userId: session.user.id,
      ...body,
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("Progress POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
