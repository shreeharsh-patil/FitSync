"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Try .env.local first (standard local dev), fallback to .env
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env.local") });
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
exports.env = {
    PORT: parseInt(process.env.PORT || "5000", 10),
    NODE_ENV: process.env.NODE_ENV || "development",
    MONGODB_URI: process.env.MONGODB_URI || "",
    JWT_SECRET: process.env.JWT_SECRET || "dev-jwt-secret-change-in-production",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
};
// Validate required env vars
const required = ["MONGODB_URI"];
for (const key of required) {
    if (!exports.env[key]) {
        console.error(`❌ Missing required environment variable: ${key}`);
        console.error(`   Copy .env.example to .env and fill in the values.`);
        process.exit(1);
    }
}
//# sourceMappingURL=env.js.map