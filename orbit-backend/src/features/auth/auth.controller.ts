import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { loginSchema, signupSchema, forgotPasswordSchema } from "./auth.validation.js";
import * as authService from "./auth.service.js";
import { env } from "../../config/env.js";

export const loginController = asyncHandler(async (req: Request, res: Response) => {
  const input = loginSchema.parse(req.body);
  const result = await authService.login(input);
  res.status(200).json(result);
});

export const signupController = asyncHandler(async (req: Request, res: Response) => {
  const input = signupSchema.parse(req.body);
  const result = await authService.signup(input);
  res.status(201).json(result);
});

export const forgotPasswordController = asyncHandler(async (req: Request, res: Response) => {
  const input = forgotPasswordSchema.parse(req.body);
  const result = await authService.forgotPassword(input.email);
  res.status(200).json(result);
});

// --- OAuth Auth (Sign in with Google/GitHub) ---

/** Step 1: Redirect user to Google/GitHub for authentication. */
export const oauthAuthController = asyncHandler(async (req: Request, res: Response) => {
  const { provider } = req.params; // "google" | "github"
  const { state } = req.query; // May contain { mode: "login" | "signup" }

  // Build backend URL for OAuth redirect_uri (must match registered URI in Google/GitHub console)
  const backendUrl = `${req.protocol}://${req.get("host")}`;

  if (provider === "google") {
    const { google } = await import("../oauth/oauth.providers.js");
    google.assertConfigured();
    const url = google.buildAuthUrlForLogin(backendUrl, state as string);
    return res.redirect(url);
  }

  if (provider === "github") {
    const { github } = await import("../oauth/oauth.providers.js");
    github.assertConfigured();
    const url = github.buildAuthUrlForLogin(backendUrl, state as string);
    return res.redirect(url);
  }

  throw new Error(`Unknown provider: ${provider}`);
});

/** Step 2: Handle callback from Google/GitHub after user authenticates. */
export const oauthCallbackController = asyncHandler(async (req: Request, res: Response) => {
  const { provider } = req.params; // "google" | "github"
  const { code, error, state } = req.query as Record<string, string | undefined>;

  // Build backend URL for OAuth exchange (must match the redirect_uri used in step 1)
  const backendUrl = `${req.protocol}://${req.get("host")}`;

  // Decode state to get mode (login | signup)
  let mode: "login" | "signup" = "login";
  if (state) {
    try {
      const decoded = JSON.parse(Buffer.from(state, "base64").toString());
      if (decoded.mode === "signup" || decoded.mode === "login") {
        mode = decoded.mode;
      }
    } catch {
      // Ignore invalid state, default to login
    }
  }
  console.log("[DEBUG] OAuth mode:", mode, "state:", state);

  if (error) {
    const msg = error === "access_denied" ? "Authorization was cancelled." : error;
    return res.redirect(`${env.frontendUrl}/login?error=${encodeURIComponent(msg)}`);
  }

  if (!code) {
    return res.redirect(`${env.frontendUrl}/login?error=${encodeURIComponent("Missing authorization code.")}`);
  }

  let result;
  try {
    if (provider === "google") {
      const { google } = await import("../oauth/oauth.providers.js");
      google.assertConfigured();
      const tokens = await google.exchangeCodeForLogin(code, backendUrl);
      const profile = await google.getProfile(tokens.accessToken);
      console.log("[DEBUG] Google profile:", { id: profile.id, email: profile.email, name: profile.name });
      result = await authService.findOrCreateOAuthUser("google", profile.id, profile.email, profile.name, profile.picture, mode);
    } else if (provider === "github") {
      const { github } = await import("../oauth/oauth.providers.js");
      github.assertConfigured();
      const tokens = await github.exchangeCodeForLogin(code, backendUrl);
      const profile = await github.getProfile(tokens.accessToken);
      console.log("[DEBUG] GitHub profile:", { id: profile.id, email: profile.email, name: profile.name });
      result = await authService.findOrCreateOAuthUser("github", profile.id.toString(), profile.email, profile.name, profile.avatar_url, mode);
    } else {
      throw new Error(`Unknown provider: ${provider}`);
    }
  } catch (err) {
    // Handle specific errors that should redirect with error message
    if (err instanceof ApiError && err.status === 409) {
      // Email conflict - redirect to login with error
      return res.redirect(`${env.frontendUrl}/login?error=${encodeURIComponent(err.message)}`);
    }
    // Re-throw other errors to be handled by the global error handler
    throw err;
  }

  // Redirect to frontend with token - our frontend route is /auth/callback
  const params = new URLSearchParams({
    token: result.token,
    user: JSON.stringify(result.user),
  });
  res.redirect(`${env.frontendUrl}/auth/callback?${params.toString()}`);
});
