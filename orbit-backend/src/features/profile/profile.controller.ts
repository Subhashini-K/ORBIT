import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as profileService from "./profile.service.js";

export const getProfileController = asyncHandler(async (req: Request, res: Response) => {
  const profile = await profileService.getProfile(req.userId!);
  res.status(200).json(profile);
});
