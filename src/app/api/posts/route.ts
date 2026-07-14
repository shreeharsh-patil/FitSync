import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Post } from "@/lib/models/Post";
import { User } from "@/lib/models/User";

export async function GET() {
  try {
    await connectDB();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("userId", "name image")
      .populate("comments.userId", "name image")
      .lean();

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Posts GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await req.json();
    if (!content?.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    await connectDB();
    const post = await Post.create({
      userId: session.user.id,
      content: content.trim(),
    });

    // Award XP for posting
    await User.findByIdAndUpdate(session.user.id, { $inc: { xp: 5 } });

    const populated = await Post.findById(post._id).populate("userId", "name image").lean();

    return NextResponse.json(populated, { status: 201 });
  } catch (error) {
    console.error("Posts POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
