import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { updateAutomationSchema } from "./automations.validation.js";
import * as automationsService from "./automations.service.js";

export const listAutomationsController = asyncHandler(async (req: Request, res: Response) => {
  const automations = await automationsService.listAutomations(req.userId!);
  res.status(200).json(automations);
});

export const updateAutomationController = asyncHandler(async (req: Request, res: Response) => {
  const input = updateAutomationSchema.parse(req.body);
  const automation = await automationsService.setAutomationEnabled(req.userId!, req.params.id, input.enabled);
  res.status(200).json(automation);
});
