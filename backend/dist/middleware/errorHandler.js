"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.errorHandler = errorHandler;
exports.notFoundHandler = notFoundHandler;
const env_1 = require("../config/env");
class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
function errorHandler(err, _req, res, _next) {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            error: err.message,
        });
        return;
    }
    console.error("❌ Unhandled error:", err);
    res.status(500).json({
        success: false,
        error: env_1.env.NODE_ENV === "production" ? "Internal server error" : err.message,
    });
}
function notFoundHandler(_req, res) {
    res.status(404).json({
        success: false,
        error: "Route not found",
    });
}
//# sourceMappingURL=errorHandler.js.map