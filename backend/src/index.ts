import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { connectDB } from "./db";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

// Routes
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import workoutRoutes from "./routes/workouts";
import nutritionRoutes from "./routes/nutrition";
import postRoutes from "./routes/posts";
import challengeRoutes from "./routes/challenges";
import progressRoutes from "./routes/progress";
import dashboardRoutes from "./routes/dashboard";
import aiCoachRoutes from "./routes/ai-coach";
import leaderboardRoutes from "./routes/leaderboard";

const app = express();

// ─── Middleware ───
app.use(cors({
  origin: env.FRONTEND_URL || "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Database Connection Middleware for Serverless ───
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
  } catch (error) {
    console.error("⚠️ MongoDB connection error:", error);
  }
  next();
});

// ─── Health Check ───
app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "FitSync API is running", environment: env.NODE_ENV });
});

// ─── Routes ───
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai-coach", aiCoachRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// ─── Error Handling ───
app.use(notFoundHandler);
app.use(errorHandler);

// ─── Start Server (Local Development) ───
async function start() {
  try {
    await connectDB();
  } catch (error) {
    console.error("⚠️  MongoDB connection failed, starting without database:", error);
  }
  app.listen(env.PORT, () => {
    console.log(`\n🚀 FitSync API Server`);
    console.log(`   URL: http://localhost:${env.PORT}`);
    console.log(`   Health: http://localhost:${env.PORT}/api/health`);
    console.log(`   Environment: ${env.NODE_ENV}\n`);
  });
}

if (!process.env.VERCEL) {
  start();
}

export default app;
