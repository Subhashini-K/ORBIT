import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import {
  authorizeController,
  googleCallbackController,
  githubCallbackController,
  disconnectController,
} from "./oauth.controller.js";

export const oauthRouter = Router();

// Public — these are hit by the browser being redirected from Google/GitHub,
// not by our own frontend, so there's no bearer token to check here. Trust
// instead comes from the single-use `state` value (see oauth.service.ts).
oauthRouter.get("/google/callback", googleCallbackController);
oauthRouter.get("/github/callback", githubCallbackController);

// Protected — initiated by the logged-in user from the Sources page.
oauthRouter.get("/:connectorId/authorize", requireAuth, authorizeController);
oauthRouter.post("/:connectorId/disconnect", requireAuth, disconnectController);
