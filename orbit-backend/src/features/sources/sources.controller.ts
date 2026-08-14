import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { updateSourceSchema } from "./sources.validation.js";
import * as sourcesService from "./sources.service.js";
import { ApiError } from "../../utils/ApiError.js";
import { isOAuthConnector } from "../oauth/oauth.registry.js";
import type { SourceId } from "../../types/index.js";

export const listSourcesController = asyncHandler(async (req: Request, res: Response) => {
  const sources = await sourcesService.listSources(req.userId!);
  res.status(200).json(sources);
});

export const updateSourceController = asyncHandler(async (req: Request, res: Response) => {
  const input = updateSourceSchema.parse(req.body);

  // gmail/google-calendar/google-drive/github are real OAuth connectors now —
  // this generic PATCH must not be able to fake a "connected" state (or wipe
  // a real one) for them. Those go through /oauth/:connectorId/authorize and
  // /oauth/:connectorId/disconnect instead, which actually manage tokens.
  if (isOAuthConnector(req.params.id)) {
    throw ApiError.badRequest(
      `${req.params.id} is a real connector — use /oauth/${req.params.id}/authorize or /oauth/${req.params.id}/disconnect instead of PATCH /sources/:id.`
    );
  }

  const source = await sourcesService.updateSourceStatus(
    req.userId!,
    req.params.id as SourceId,
    input.status
  );
  res.status(200).json(source);
});
