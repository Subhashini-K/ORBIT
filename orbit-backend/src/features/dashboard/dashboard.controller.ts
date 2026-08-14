import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as dashboardService from "./dashboard.service.js";

export const getDashboardController = asyncHandler(async (req: Request, res: Response) => {
  const stats = await dashboardService.getDashboardStats(req.userId!);
  res.status(200).json(stats);
});
