import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as insightsService from "./insights.service.js";

export const getInsightsController = asyncHandler(async (req: Request, res: Response) => {
  const insights = await insightsService.getInsights(req.userId!);
  res.status(200).json(insights);
});
