import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { getDashboardController } from "./dashboard.controller.js";

export const dashboardRouter = Router();

dashboardRouter.use(requireAuth);
dashboardRouter.get("/", getDashboardController);
