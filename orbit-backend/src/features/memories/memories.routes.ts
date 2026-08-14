import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { listMemoriesController } from "./memories.controller.js";

export const memoriesRouter = Router();

memoriesRouter.use(requireAuth);
memoriesRouter.get("/", listMemoriesController);
