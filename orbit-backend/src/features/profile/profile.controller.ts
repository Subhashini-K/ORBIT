import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as profileService from "./profile.service.js";
import { updateProfileSchema, changePasswordSchema } from "./profile.validation.js";

export const getProfileController = asyncHandler(async (req: Request, res: Response) => {
  const profile = await profileService.getProfile(req.userId!);
  res.status(200).json(profile);
});

export const updateProfileController = asyncHandler(async (req: Request, res: Response) => {
  const { body } = updateProfileSchema.parse(req);
  const profile = await profileService.updateProfile(req.userId!, body);
  res.status(200).json(profile);
});

export const changePasswordController = asyncHandler(async (req: Request, res: Response) => {
  const { body } = changePasswordSchema.parse(req);
  await profileService.changePassword(req.userId!, body);
  res.status(200).json({ message: "Password updated successfully." });
});

export const deleteAccountController = asyncHandler(async (req: Request, res: Response) => {
  await profileService.deleteAccount(req.userId!);
  res.status(200).json({ message: "Account deleted successfully." });
});
