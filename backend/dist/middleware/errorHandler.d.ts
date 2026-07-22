import { Request, Response, NextFunction } from "express";
export declare class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode?: number);
}
export declare function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void;
export declare function notFoundHandler(_req: Request, res: Response): void;
//# sourceMappingURL=errorHandler.d.ts.map