import { useMutation } from "@tanstack/react-query";
import type { ApiError } from "@/lib/apiClient";
import type { AuthResponse, OAuthProvider } from "../types";

interface OAuthCallbackParams {
  token: string;
  user: string; // JSON stringified User
}

interface OAuthLoginOptions {
  mode?: "login" | "signup";
}

export function useOAuthLogin() {
  return useMutation<void, ApiError, { provider: OAuthProvider; options?: OAuthLoginOptions }>({
    mutationFn: async ({ provider, options }) => {
      const mode = options?.mode ?? "login";
      // Pass mode via state parameter to survive the OAuth redirect round-trip
      const state = btoa(JSON.stringify({ mode }));
      window.location.href = `${import.meta.env.VITE_API_URL ?? "http://localhost:4000"}/auth/oauth/${provider}?state=${encodeURIComponent(state)}`;
    },
  });
}

export function useOAuthCallback() {
  return useMutation<AuthResponse, ApiError, OAuthCallbackParams>({
    mutationFn: async (params) => {
      // The backend already did the OAuth flow and redirected to our callback page
      // with token and user in URL params. We just need to return the parsed result.
      const user = JSON.parse(params.user);
      return { user, token: params.token };
    },
  });
}