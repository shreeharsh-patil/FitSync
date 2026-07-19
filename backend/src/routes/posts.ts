import { Router, Response } from "express";
import { Post } from "../models/Post";
import { User } from "../models/User";
import { connectDB } from "../db";
import { AuthRequest } from "../types";
import { authenticate, optionalAuth } from "../middleware/auth";

const router = Router();

// GET /api/posts
router.get("/", async (_req, res: Response) => {
  try {
    await connectDB();
    const posts = await Post.find()
      .sort({ createdAt: -1 }).limit(50)
      .populate("userId", "name image")
      .populate("comments.userId", "name image")
      .lean();
    res.json({ success: true, data: posts });
  } catch (err) {
    console.error("Posts GET error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/posts
router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) {
      return res.status(400).json({ success: false, error: "Content is required" });
    }
    await connectDB();
    const post = await Post.create({ userId: req.user!.userId, content: content.trim() });
    await User.findByIdAndUpdate(req.user!.userId, { $inc: { xp: 5 } });
    const populated = await Post.findById(post._id).populate("userId", "name image").lean();
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    console.error("Posts POST error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/posts/:id/like
router.post("/:id/like", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await connectDB();
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ success: false, error: "Post not found" });

    const userId = req.user!.userId;
    const alreadyLiked = post.likedBy.some((uid: any) => uid.toString() === userId);

    if (alreadyLiked) {
      post.likedBy = post.likedBy.filter((uid: any) => uid.toString() !== userId);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      post.likedBy.push(userId as any);
      post.likes += 1;
    }
    await post.save();
    res.json({ success: true, data: { likes: post.likes, liked: !alreadyLiked } });
  } catch (err) {
    console.error("Like error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/posts/:id/comment
router.post("/:id/comment", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ success: false, error: "Content is required" });
    const { id } = req.params;
    await connectDB();

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ success: false, error: "Post not found" });

    post.comments.push({ userId: req.user!.userId as any, content: content.trim(), createdAt: new Date() });
    await post.save();
    res.status(201).json({ success: true, data: { message: "Comment added" } });
  } catch (err) {
    console.error("Comment error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;
