import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import {
  getProfileController,
  updateProfileController,
  changePasswordController,
  deleteAccountController,
} from "./profile.controller.js";

export const profileRouter = Router();

profileRouter.use(requireAuth);
profileRouter.get("/", getProfileController);
profileRouter.patch("/", updateProfileController);
profileRouter.post("/change-password", changePasswordController);
profileRouter.delete("/", deleteAccountController);
