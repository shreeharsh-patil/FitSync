import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { connectDB } from "../db";
import { env } from "../config/env";
import { AppError } from "../middleware/errorHandler";
import { authenticate } from "../middleware/auth";

const router = Router();

// POST /api/auth/signup
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new AppError("Missing required fields", 400);
    }
    if (password.length < 6) {
      throw new AppError("Password must be at least 6 characters", 400);
    }

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      throw new AppError("Email already in use", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    res.status(201).json({
      success: true,
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      },
    });
  } catch (err) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ success: false, error: err.message });
    } else {
      console.error("Signup error:", err);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !user.password) {
      throw new AppError("Invalid email or password", 401);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    res.json({
      success: true,
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, image: user.image },
      },
    });
  } catch (err) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ success: false, error: err.message });
    } else {
      console.error("Login error:", err);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }
});

// GET /api/auth/me
router.get("/me", authenticate, async (req: Request, res: Response) => {
  try {
    await connectDB();
    const user = await User.findById((req as any).user.userId).lean();
    if (!user) {
      throw new AppError("User not found", 404);
    }
    res.json({ success: true, data: user });
  } catch (err) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ success: false, error: err.message });
    } else {
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }
});

export default router;
