import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

/** Central error handler — must be registered last, after all routes. */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    res.status(422).json({
      message: "Validation failed.",
      errors: err.flatten().fieldErrors,
    });
    return;
  }

  if (err instanceof ApiError) {
    res.status(err.status).json({ message: err.message, details: err.details });
    return;
  }

  console.error("[unhandled error]", err);
  res.status(500).json({
    message: "Something went wrong.",
    ...(env.nodeEnv === "development" && { stack: (err as Error)?.stack }),
  });
}
