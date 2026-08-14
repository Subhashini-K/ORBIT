import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { AuthResponse, User } from "../types";
import { authStorage } from "./authStorage";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  setSession: (auth: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => authStorage.getUser());

  const setSession = useCallback((auth: AuthResponse) => {
    authStorage.save(auth);
    setUser(auth.user);
  }, []);

  const logout = useCallback(() => {
    authStorage.clear();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, setSession, logout }),
    [user, setSession, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
