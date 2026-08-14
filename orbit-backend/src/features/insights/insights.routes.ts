import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { getInsightsController } from "./insights.controller.js";

export const insightsRouter = Router();

insightsRouter.use(requireAuth);
insightsRouter.get("/", getInsightsController);
