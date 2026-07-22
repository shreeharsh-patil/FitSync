"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const db_1 = require("../db");
const env_1 = require("../config/env");
const errorHandler_1 = require("../middleware/errorHandler");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// POST /api/auth/signup
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            throw new errorHandler_1.AppError("Missing required fields", 400);
        }
        if (password.length < 6) {
            throw new errorHandler_1.AppError("Password must be at least 6 characters", 400);
        }
        await (0, db_1.connectDB)();
        const existing = await User_1.User.findOne({ email: email.toLowerCase() });
        if (existing) {
            throw new errorHandler_1.AppError("Email already in use", 409);
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const user = await User_1.User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
        });
        const token = jsonwebtoken_1.default.sign({ userId: user._id.toString(), email: user.email, role: user.role }, env_1.env.JWT_SECRET, { expiresIn: env_1.env.JWT_EXPIRES_IN });
        res.status(201).json({
            success: true,
            data: {
                token,
                user: { id: user._id, name: user.name, email: user.email, role: user.role },
            },
        });
    }
    catch (err) {
        if (err instanceof errorHandler_1.AppError) {
            res.status(err.statusCode).json({ success: false, error: err.message });
        }
        else {
            console.error("Signup error:", err);
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    }
});
// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new errorHandler_1.AppError("Email and password are required", 400);
        }
        await (0, db_1.connectDB)();
        const user = await User_1.User.findOne({ email: email.toLowerCase() }).select("+password");
        if (!user || !user.password) {
            throw new errorHandler_1.AppError("Invalid email or password", 401);
        }
        const isValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isValid) {
            throw new errorHandler_1.AppError("Invalid email or password", 401);
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id.toString(), email: user.email, role: user.role }, env_1.env.JWT_SECRET, { expiresIn: env_1.env.JWT_EXPIRES_IN });
        res.json({
            success: true,
            data: {
                token,
                user: { id: user._id, name: user.name, email: user.email, role: user.role, image: user.image },
            },
        });
    }
    catch (err) {
        if (err instanceof errorHandler_1.AppError) {
            res.status(err.statusCode).json({ success: false, error: err.message });
        }
        else {
            console.error("Login error:", err);
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    }
});
// GET /api/auth/me
router.get("/me", auth_1.authenticate, async (req, res) => {
    try {
        await (0, db_1.connectDB)();
        const user = await User_1.User.findById(req.user.userId).lean();
        if (!user) {
            throw new errorHandler_1.AppError("User not found", 404);
        }
        res.json({ success: true, data: user });
    }
    catch (err) {
        if (err instanceof errorHandler_1.AppError) {
            res.status(err.statusCode).json({ success: false, error: err.message });
        }
        else {
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map