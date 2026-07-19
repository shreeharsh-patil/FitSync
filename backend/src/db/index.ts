import mongoose from "mongoose";
import { env } from "../config/env";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalCache = global as unknown as { mongooseCache?: MongooseCache };
const cached: MongooseCache = globalCache.mongooseCache ?? { conn: null, promise: null };

if (!globalCache.mongooseCache) {
  globalCache.mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(env.MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
  } catch (e) {
    cached.promise = null;
    console.error("❌ MongoDB connection error:", e);
    throw e;
  }

  return cached.conn;
}

mongoose.connection.on("disconnected", () => {
  console.log("⚠️  MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB error:", err);
});
