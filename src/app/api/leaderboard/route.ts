import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";

export async function GET() {
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

    return NextResponse.json({ leaders: ranked });
  } catch (error) {
    console.error("Leaderboard GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
