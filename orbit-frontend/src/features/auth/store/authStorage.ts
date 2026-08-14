import type { AuthResponse, User } from "../types";

/**
 * Thin persistence layer over localStorage.
 * Isolated here so swapping to httpOnly cookies later touches one file.
 */
const TOKEN_KEY = "orbit.auth.token";
const USER_KEY = "orbit.auth.user";

export const authStorage = {
  save(auth: AuthResponse) {
    localStorage.setItem(TOKEN_KEY, auth.token);
    localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
  },
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  getUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
