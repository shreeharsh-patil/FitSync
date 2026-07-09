import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Workout } from "@/lib/models/Workout";

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

    const workout = await Workout.create({
      userId: session.user.id,
      ...body,
    });

    return NextResponse.json(workout, { status: 201 });
  } catch (error) {
    console.error("Workout POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
