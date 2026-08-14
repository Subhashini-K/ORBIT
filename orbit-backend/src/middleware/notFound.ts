import type { Request, Response } from "express";

export function notFound(req: Request, res: Response) {
  res.status(404).json({ message: `No route matches ${req.method} ${req.originalUrl}` });
}
