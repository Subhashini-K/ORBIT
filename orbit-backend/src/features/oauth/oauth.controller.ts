import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { env } from "../../config/env.js";
import * as oauthService from "./oauth.service.js";
import { isOAuthConnector } from "./oauth.registry.js";

export const authorizeController = asyncHandler(async (req: Request, res: Response) => {
  const { connectorId } = req.params;
  if (!isOAuthConnector(connectorId)) {
    throw ApiError.notFound(`Unknown connector: ${connectorId}`);
  }

  const url = await oauthService.createAuthorizeUrl(req.userId!, connectorId);
  res.status(200).json({ url });
});

function redirectToFrontend(res: Response, result: { connectorId: string; status: string; message?: string }) {
  const params = new URLSearchParams({ connector: result.connectorId, status: result.status });
  if (result.message) params.set("message", result.message);
  res.redirect(`${env.frontendUrl}/oauth/callback?${params.toString()}`);
}

export const googleCallbackController = asyncHandler(async (req: Request, res: Response) => {
  const { code, state, error } = req.query as Record<string, string | undefined>;
  const result = await oauthService.handleCallback({ providerName: "google", code, state, error });
  redirectToFrontend(res, result);
});

export const githubCallbackController = asyncHandler(async (req: Request, res: Response) => {
  const { code, state, error } = req.query as Record<string, string | undefined>;
  const result = await oauthService.handleCallback({ providerName: "github", code, state, error });
  redirectToFrontend(res, result);
});

export const disconnectController = asyncHandler(async (req: Request, res: Response) => {
  const { connectorId } = req.params;
  if (!isOAuthConnector(connectorId)) {
    throw ApiError.notFound(`Unknown connector: ${connectorId}`);
  }

  await oauthService.disconnectConnector(req.userId!, connectorId);
  res.status(200).json({ id: connectorId, status: "disconnected" });
});
