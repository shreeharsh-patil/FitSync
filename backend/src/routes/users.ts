import { Router, Response } from "express";
import { User } from "../models/User";
import { connectDB } from "../db";
import { AuthRequest } from "../types";
import { authenticate } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";

const router = Router();

// GET /api/users/me
router.get("/me", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await connectDB();
    const user = await User.findById(req.user!.userId).lean();
    if (!user) throw new AppError("User not found", 404);
    res.json({ success: true, data: user });
  } catch (err) {
    if (err instanceof AppError) return res.status(err.statusCode).json({ success: false, error: err.message });
    console.error("User GET error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// PUT /api/users/me
router.put("/me", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const body = req.body;
    const allowed = ["name", "fitnessGoal", "activityLevel", "height", "weight", "bio", "isPublic", "image", "integrations"];
    const updates: Record<string, any> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) updates[key] = body[key];
    }

    await connectDB();
    const user = await User.findByIdAndUpdate(req.user!.userId, { $set: updates }, { new: true }).lean();
    res.json({ success: true, data: user });
  } catch (err) {
    console.error("User PUT error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// PUT /api/users/integrations
router.put("/integrations", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { integration, enabled } = req.body;
    const valid = ["appleHealth", "googleFit", "fitbit", "strava"];
    if (!valid.includes(integration)) {
      throw new AppError("Invalid integration", 400);
    }
    await connectDB();
    const user = await User.findByIdAndUpdate(
      req.user!.userId,
      { $set: { [`integrations.${integration}`]: enabled } },
      { new: true }
    ).lean();
    res.json({ success: true, data: { integrations: user?.integrations } });
  } catch (err) {
    if (err instanceof AppError) return res.status(err.statusCode).json({ success: false, error: err.message });
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;
