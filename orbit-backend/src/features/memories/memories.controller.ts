import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as memoriesService from "./memories.service.js";

export const listMemoriesController = asyncHandler(async (req: Request, res: Response) => {
  const memories = await memoriesService.listMemories(req.userId!);
  res.status(200).json(memories);
});
