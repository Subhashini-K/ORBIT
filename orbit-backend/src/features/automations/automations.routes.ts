import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { listAutomationsController, updateAutomationController } from "./automations.controller.js";

export const automationsRouter = Router();

automationsRouter.use(requireAuth);
automationsRouter.get("/", listAutomationsController);
automationsRouter.patch("/:id", updateAutomationController);
