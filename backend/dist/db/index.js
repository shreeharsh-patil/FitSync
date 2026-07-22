"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../config/env");
const globalCache = global;
const cached = globalCache.mongooseCache ?? { conn: null, promise: null };
if (!globalCache.mongooseCache) {
    globalCache.mongooseCache = cached;
}
async function connectDB() {
    if (cached.conn)
        return cached.conn;
    if (!cached.promise) {
        cached.promise = mongoose_1.default.connect(env_1.env.MONGODB_URI, {
            bufferCommands: false,
        });
    }
    try {
        cached.conn = await cached.promise;
        console.log(`✅ MongoDB connected: ${mongoose_1.default.connection.host}`);
    }
    catch (e) {
        cached.promise = null;
        console.error("❌ MongoDB connection error:", e);
        throw e;
    }
    return cached.conn;
}
mongoose_1.default.connection.on("disconnected", () => {
    console.log("⚠️  MongoDB disconnected");
});
mongoose_1.default.connection.on("error", (err) => {
    console.error("❌ MongoDB error:", err);
});
//# sourceMappingURL=index.js.map