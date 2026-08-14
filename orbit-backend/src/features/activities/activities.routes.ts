import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { listActivitiesController } from "./activities.controller.js";

export const activitiesRouter = Router();

activitiesRouter.use(requireAuth);
activitiesRouter.get("/", listActivitiesController);
