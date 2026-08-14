import { authStorage } from "@/features/auth/store/authStorage";

/**
 * Base URL of the real Orbit API server (see the orbit-backend project).
 * Falls back to the standard local dev port so `npm run dev` works
 * out-of-the-box against a locally running backend.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

/** Thrown for any non-2xx response from the real API. */
export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Set to false for endpoints that don't require a bearer token (e.g. /auth/login). */
  auth?: boolean;
}

/**
 * Thin wrapper around fetch: attaches the bearer token, serializes JSON
 * bodies, and normalizes error responses into ApiError so calling code
 * only ever has to handle one error type.
 */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { body, auth = true, headers, ...rest } = options;

  const finalHeaders = new Headers(headers);
  finalHeaders.set("Content-Type", "application/json");

  if (auth) {
    const token = authStorage.getToken();
    if (token) finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "Couldn't reach the Orbit server. Is it running?");
  }

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const message = (payload as { message?: string } | null)?.message ?? `Request failed (${response.status}).`;
    throw new ApiError(response.status, message, (payload as { errors?: unknown } | null)?.errors);
  }

  return payload as T;
}
