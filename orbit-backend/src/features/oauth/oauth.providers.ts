import { env } from "../../config/env.js";
import { ApiError } from "../../utils/ApiError.js";
import type { OAuthProviderName } from "./oauth.registry.js";

export interface TokenExchangeResult {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date; // undefined = doesn't expire
  scope?: string;
}

export interface OAuthProvider {
  /** Throws if this provider's env vars aren't configured yet. */
  assertConfigured(): void;
  buildAuthorizeUrl(scopes: string[], state: string): string;
  exchangeCode(code: string): Promise<TokenExchangeResult>;
  refreshAccessToken(refreshToken: string): Promise<TokenExchangeResult>;
  /** Best-effort — disconnect should still succeed locally if this fails. */
  revoke(accessToken: string): Promise<void>;
}

function assertConfigured(name: string, clientId: string, clientSecret: string) {
  if (!clientId || !clientSecret) {
    throw ApiError.badRequest(
      `${name} OAuth isn't configured on the server yet. Set the ${name.toUpperCase()}_CLIENT_ID / ${name.toUpperCase()}_CLIENT_SECRET environment variables and restart the server.`
    );
  }
}

// ---------------------------------------------------------------------------
// Google — used by gmail, google-calendar, google-drive
// ---------------------------------------------------------------------------

const google: OAuthProvider = {
  assertConfigured() {
    assertConfigured("google", env.google.clientId, env.google.clientSecret);
  },

  buildAuthorizeUrl(scopes, state) {
    const params = new URLSearchParams({
      client_id: env.google.clientId,
      redirect_uri: env.google.redirectUri,
      response_type: "code",
      access_type: "offline", // request a refresh token
      prompt: "consent", // force the consent screen so we reliably get a refresh_token every time
      include_granted_scopes: "true", // incremental auth across gmail/calendar/drive
      scope: scopes.join(" "),
      state,
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  },

  async exchangeCode(code) {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: env.google.clientId,
        client_secret: env.google.clientSecret,
        redirect_uri: env.google.redirectUri,
        grant_type: "authorization_code",
      }),
    });
    if (!res.ok) {
      throw ApiError.badRequest(`Google rejected the authorization code (${res.status}).`);
    }
    const data = (await res.json()) as {
      access_token: string;
      refresh_token?: string;
      expires_in?: number;
      scope?: string;
    };
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : undefined,
      scope: data.scope,
    };
  },

  async refreshAccessToken(refreshToken) {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id: env.google.clientId,
        client_secret: env.google.clientSecret,
        grant_type: "refresh_token",
      }),
    });
    if (!res.ok) {
      throw ApiError.unauthorized("Google refused to refresh the access token. Reconnect this source.");
    }
    const data = (await res.json()) as { access_token: string; expires_in?: number; scope?: string };
    return {
      accessToken: data.access_token,
      // Google doesn't reissue a refresh_token on refresh — the caller keeps the original.
      expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : undefined,
      scope: data.scope,
    };
  },

  async revoke(accessToken) {
    await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(accessToken)}`, {
      method: "POST",
    }).catch(() => undefined);
  },
};

// ---------------------------------------------------------------------------
// GitHub — used by github
// ---------------------------------------------------------------------------

const github: OAuthProvider = {
  assertConfigured() {
    assertConfigured("github", env.github.clientId, env.github.clientSecret);
  },

  buildAuthorizeUrl(scopes, state) {
    const params = new URLSearchParams({
      client_id: env.github.clientId,
      redirect_uri: env.github.redirectUri,
      scope: scopes.join(" "),
      state,
      allow_signup: "true",
    });
    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  },

  async exchangeCode(code) {
    const res = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      body: new URLSearchParams({
        code,
        client_id: env.github.clientId,
        client_secret: env.github.clientSecret,
        redirect_uri: env.github.redirectUri,
      }),
    });
    if (!res.ok) {
      throw ApiError.badRequest(`GitHub rejected the authorization code (${res.status}).`);
    }
    const data = (await res.json()) as { access_token?: string; scope?: string; error?: string };
    if (!data.access_token) {
      throw ApiError.badRequest(`GitHub OAuth error: ${data.error ?? "no access token returned"}.`);
    }
    // Standard GitHub OAuth App tokens don't expire and have no refresh token.
    return { accessToken: data.access_token, scope: data.scope };
  },

  async refreshAccessToken() {
    // GitHub OAuth App tokens don't expire, so this should never be called.
    throw ApiError.badRequest("GitHub tokens don't support refresh — reconnect this source instead.");
  },

  async revoke(accessToken) {
    const credentials = Buffer.from(`${env.github.clientId}:${env.github.clientSecret}`).toString("base64");
    await fetch(`https://api.github.com/applications/${env.github.clientId}/grant`, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ access_token: accessToken }),
    }).catch(() => undefined);
  },
};

export const PROVIDERS: Record<OAuthProviderName, OAuthProvider> = { google, github };
