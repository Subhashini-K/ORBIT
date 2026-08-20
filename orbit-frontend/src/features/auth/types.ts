export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  agreedToTerms: boolean;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface AuthFieldErrors {
  name?: string;
  email?: string;
  password?: string;
  agreedToTerms?: string;
  form?: string;
}

// OAuth Auth types
export type OAuthProvider = "google" | "github";
