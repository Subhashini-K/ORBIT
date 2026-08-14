import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { listSourcesController, updateSourceController } from "./sources.controller.js";

export const sourcesRouter = Router();

sourcesRouter.use(requireAuth);
sourcesRouter.get("/", listSourcesController);
sourcesRouter.patch("/:id", updateSourceController);
