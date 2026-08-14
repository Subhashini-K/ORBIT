import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { getProfileController } from "./profile.controller.js";

export const profileRouter = Router();

profileRouter.use(requireAuth);
profileRouter.get("/", getProfileController);
