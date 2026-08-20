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
  // --- New methods for login flow ---
  buildAuthUrlForLogin(backendUrl: string, state?: string): string;
  exchangeCodeForLogin(code: string, backendUrl: string): Promise<TokenExchangeResult>;
  getProfile(accessToken: string): Promise<OAuthProfile>;
}

export interface OAuthProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
  avatar_url?: string;
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

export const google: OAuthProvider = {
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

  // --- Login flow methods ---
  buildAuthUrlForLogin(backendUrl: string, state?: string) {
    const params = new URLSearchParams({
      client_id: env.google.clientId,
      redirect_uri: `${backendUrl}/auth/oauth/callback/google`,
      response_type: "code",
      access_type: "offline",
      prompt: "select_account consent", // Force account picker + consent screen
      scope: "openid email profile",
      state: state ?? crypto.randomUUID(),
      // Force account picker - empty login_hint prevents auto-selection
      login_hint: "",
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  },

  async exchangeCodeForLogin(code: string, backendUrl: string) {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: env.google.clientId,
        client_secret: env.google.clientSecret,
        redirect_uri: `${backendUrl}/auth/oauth/callback/google`,
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

  async getProfile(accessToken: string): Promise<OAuthProfile> {
    const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
      throw ApiError.unauthorized("Failed to fetch Google profile.");
    }
    const data = await res.json() as { sub: string; email: string; name: string; picture?: string };
    // Google uses 'sub' as the unique identifier, map it to 'id'
    return {
      id: data.sub,
      email: data.email,
      name: data.name,
      picture: data.picture,
    };
  },
};

// ---------------------------------------------------------------------------
// GitHub — used by github
// ---------------------------------------------------------------------------

export const github: OAuthProvider = {
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

  // --- Login flow methods ---
  buildAuthUrlForLogin(backendUrl: string, state?: string) {
    const params = new URLSearchParams({
      client_id: env.github.clientId,
      redirect_uri: `${backendUrl}/auth/oauth/callback/github`,
      scope: "read:user user:email",
      state: state ?? crypto.randomUUID(),
      allow_signup: "true",
    });
    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  },

  async exchangeCodeForLogin(code: string, backendUrl: string) {
    const res = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      body: new URLSearchParams({
        code,
        client_id: env.github.clientId,
        client_secret: env.github.clientSecret,
        redirect_uri: `${backendUrl}/auth/oauth/callback/github`,
      }),
    });
    if (!res.ok) {
      throw ApiError.badRequest(`GitHub rejected the authorization code (${res.status}).`);
    }
    const data = (await res.json()) as { access_token?: string; scope?: string; error?: string };
    if (!data.access_token) {
      throw ApiError.badRequest(`GitHub OAuth error: ${data.error ?? "no access token returned"}.`);
    }
    return { accessToken: data.access_token, scope: data.scope };
  },

  async getProfile(accessToken: string): Promise<OAuthProfile> {
    // Get user info
    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github+json" },
    });
    if (!userRes.ok) {
      throw ApiError.unauthorized("Failed to fetch GitHub profile.");
    }
    const user = await userRes.json() as { id: number; name: string | null; login: string; avatar_url: string };

    // Get primary email
    const emailRes = await fetch("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github+json" },
    });
    let email = "";
    if (emailRes.ok) {
      const emails = await emailRes.json() as Array<{ email: string; primary: boolean; verified: boolean }>;
      const primary = emails.find((e) => e.primary && e.verified);
      email = primary?.email || emails[0]?.email || "";
    }

    return {
      id: user.id.toString(),
      email,
      name: user.name || user.login,
      avatar_url: user.avatar_url,
    };
  },
};

export const PROVIDERS: Record<OAuthProviderName, OAuthProvider> = { google, github };
