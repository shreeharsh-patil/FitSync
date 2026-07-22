"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Post_1 = require("../models/Post");
const User_1 = require("../models/User");
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /api/posts
router.get("/", async (_req, res) => {
    try {
        await (0, db_1.connectDB)();
        const posts = await Post_1.Post.find()
            .sort({ createdAt: -1 }).limit(50)
            .populate("userId", "name image")
            .populate("comments.userId", "name image")
            .lean();
        res.json({ success: true, data: posts });
    }
    catch (err) {
        console.error("Posts GET error:", err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
// POST /api/posts
router.post("/", auth_1.authenticate, async (req, res) => {
    try {
        const { content } = req.body;
        if (!content?.trim()) {
            return res.status(400).json({ success: false, error: "Content is required" });
        }
        await (0, db_1.connectDB)();
        const post = await Post_1.Post.create({ userId: req.user.userId, content: content.trim() });
        await User_1.User.findByIdAndUpdate(req.user.userId, { $inc: { xp: 5 } });
        const populated = await Post_1.Post.findById(post._id).populate("userId", "name image").lean();
        res.status(201).json({ success: true, data: populated });
    }
    catch (err) {
        console.error("Posts POST error:", err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
// POST /api/posts/:id/like
router.post("/:id/like", auth_1.authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        await (0, db_1.connectDB)();
        const post = await Post_1.Post.findById(id);
        if (!post)
            return res.status(404).json({ success: false, error: "Post not found" });
        const userId = req.user.userId;
        const alreadyLiked = post.likedBy.some((uid) => uid.toString() === userId);
        if (alreadyLiked) {
            post.likedBy = post.likedBy.filter((uid) => uid.toString() !== userId);
            post.likes = Math.max(0, post.likes - 1);
        }
        else {
            post.likedBy.push(userId);
            post.likes += 1;
        }
        await post.save();
        res.json({ success: true, data: { likes: post.likes, liked: !alreadyLiked } });
    }
    catch (err) {
        console.error("Like error:", err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
// POST /api/posts/:id/comment
router.post("/:id/comment", auth_1.authenticate, async (req, res) => {
    try {
        const { content } = req.body;
        if (!content?.trim())
            return res.status(400).json({ success: false, error: "Content is required" });
        const { id } = req.params;
        await (0, db_1.connectDB)();
        const post = await Post_1.Post.findById(id);
        if (!post)
            return res.status(404).json({ success: false, error: "Post not found" });
        post.comments.push({ userId: req.user.userId, content: content.trim(), createdAt: new Date() });
        await post.save();
        res.status(201).json({ success: true, data: { message: "Comment added" } });
    }
    catch (err) {
        console.error("Comment error:", err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.default = router;
//# sourceMappingURL=posts.js.map