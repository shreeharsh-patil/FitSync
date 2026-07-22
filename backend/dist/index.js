"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const db_1 = require("./db");
const errorHandler_1 = require("./middleware/errorHandler");
// Routes
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const workouts_1 = __importDefault(require("./routes/workouts"));
const nutrition_1 = __importDefault(require("./routes/nutrition"));
const posts_1 = __importDefault(require("./routes/posts"));
const challenges_1 = __importDefault(require("./routes/challenges"));
const progress_1 = __importDefault(require("./routes/progress"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const ai_coach_1 = __importDefault(require("./routes/ai-coach"));
const leaderboard_1 = __importDefault(require("./routes/leaderboard"));
const app = (0, express_1.default)();
// ─── Middleware ───
app.use((0, cors_1.default)({
    origin: env_1.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
// ─── Health Check ───
app.get("/api/health", (_req, res) => {
    res.json({ success: true, message: "FitSync API is running", environment: env_1.env.NODE_ENV });
});
// ─── Routes ───
app.use("/api/auth", auth_1.default);
app.use("/api/users", users_1.default);
app.use("/api/workouts", workouts_1.default);
app.use("/api/nutrition", nutrition_1.default);
app.use("/api/posts", posts_1.default);
app.use("/api/challenges", challenges_1.default);
app.use("/api/progress", progress_1.default);
app.use("/api/dashboard", dashboard_1.default);
app.use("/api/ai-coach", ai_coach_1.default);
app.use("/api/leaderboard", leaderboard_1.default);
// ─── Error Handling ───
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
// ─── Start Server ───
async function start() {
    try {
        await (0, db_1.connectDB)();
    }
    catch (error) {
        console.error("⚠️  MongoDB connection failed, starting without database:", error);
    }
    app.listen(env_1.env.PORT, () => {
        console.log(`\n🚀 FitSync API Server`);
        console.log(`   URL: http://localhost:${env_1.env.PORT}`);
        console.log(`   Health: http://localhost:${env_1.env.PORT}/api/health`);
        console.log(`   Environment: ${env_1.env.NODE_ENV}\n`);
    });
}
start();
//# sourceMappingURL=index.js.map