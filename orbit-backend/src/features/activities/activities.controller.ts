import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as activitiesService from "./activities.service.js";

export const listActivitiesController = asyncHandler(async (req: Request, res: Response) => {
  const activities = await activitiesService.listRecentActivities(req.userId!);
  res.status(200).json(activities);
});
