import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Post } from "@/lib/models/Post";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const userId = session.user.id;
    const alreadyLiked = post.likedBy.some((uid: any) => uid.toString() === userId);

    if (alreadyLiked) {
      post.likedBy = post.likedBy.filter((uid: any) => uid.toString() !== userId);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      post.likedBy.push(userId as any);
      post.likes += 1;
    }

    await post.save();

    return NextResponse.json({ likes: post.likes, liked: !alreadyLiked });
  } catch (error) {
    console.error("Like POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
