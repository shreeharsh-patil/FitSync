import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Challenge } from "@/lib/models/Challenge";

export async function GET() {
  try {
    await connectDB();
    const challenges = await Challenge.find({ endDate: { $gte: new Date() } })
      .sort({ startDate: 1 })
      .lean();

    return NextResponse.json({ challenges });
  } catch (error) {
    console.error("Challenges GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user!.id;
    const body = await req.json();
    await connectDB();

    // If joining an existing challenge
    if (body.challengeId) {
      const challenge = await Challenge.findById(body.challengeId);
      if (!challenge) {
        return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
      }

      const alreadyJoined = challenge.participants.some(
        (p: any) => p.userId.toString() === userId
      );

      if (alreadyJoined) {
        return NextResponse.json({ error: "Already joined" }, { status: 409 });
      }

      challenge.participants.push({
        userId: userId as any,
        progress: 0,
        joinedAt: new Date(),
      });

      await challenge.save();
      return NextResponse.json(challenge);
    }

    // Creating a new challenge
    const challenge = await Challenge.create({
      name: body.name,
      description: body.description,
      startDate: body.startDate || new Date(),
      endDate: body.endDate,
      rules: body.rules,
      participants: [{ userId, progress: 0, joinedAt: new Date() }],
    });

    return NextResponse.json(challenge, { status: 201 });
  } catch (error) {
    console.error("Challenges POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
