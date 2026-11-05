import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error.js"

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // 必须 4 个参数，即使 next 没用到也要写，否则 Express 不认
  void next;

  if( err instanceof AppError){
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message
      },
    });
    return;
  }
  console.error(`[UNEXPECTED] ${req.method} ${req.originalUrl}`, err);
  res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Internal Server Error" },
  });
}