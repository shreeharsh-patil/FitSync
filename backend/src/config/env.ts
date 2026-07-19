import dotenv from "dotenv";
import path from "path";

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const env = {
  PORT: parseInt(process.env.PORT || "5000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI: process.env.MONGODB_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "dev-jwt-secret-change-in-production",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
};

// Validate required env vars
const required = ["MONGODB_URI"] as const;
for (const key of required) {
  if (!env[key]) {
    console.error(`❌ Missing required environment variable: ${key}`);
    console.error(`   Copy .env.example to .env and fill in the values.`);
    process.exit(1);
  }
}
