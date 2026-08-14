/**
 * Mock API layer for Phase 1.
 *
 * There is no real backend yet. Every "endpoint" below simulates the
 * network — latency, the occasional failure, and a JSON response shape —
 * so feature code (hooks, components) is written exactly the way it will
 * be once real endpoints exist. Swapping this for `fetch("/api/...")`
 * later should not require touching any component.
 */

export const API_ENDPOINTS = {
  login: "POST /auth/login",
  signup: "POST /auth/signup",
  forgotPassword: "POST /auth/forgot-password",
  dashboard: "GET /dashboard",
  sources: "GET /sources",
  updateSource: "PATCH /sources/:id",
  activities: "GET /activities",
  profile: "GET /profile",
} as const;

/** Simulates realistic network latency. */
export function delay<T>(value: T, ms = 700): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export class MockApiError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.name = "MockApiError";
    this.status = status;
  }
}
