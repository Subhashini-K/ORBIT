import { apiFetch } from "@/lib/apiClient";
import type { AuthResponse, ForgotPasswordPayload, LoginPayload, SignupPayload } from "../types";

/**
 * Real implementation of:
 *   POST /auth/login
 *   POST /auth/signup
 *   POST /auth/forgot-password
 *
 * Talks to the orbit-backend server (see VITE_API_URL). Response shapes are
 * identical to what the original mock layer returned, so nothing above this
 * file — hooks, forms, pages — needed to change.
 */

export async function loginRequest(payload: LoginPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: payload,
    auth: false,
  });
}

export async function signupRequest(payload: SignupPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/signup", {
    method: "POST",
    body: payload,
    auth: false,
  });
}

export async function forgotPasswordRequest(
  payload: ForgotPasswordPayload
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/forgot-password", {
    method: "POST",
    body: payload,
    auth: false,
  });
}
