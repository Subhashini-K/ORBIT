/**
 * These shapes are deliberately kept identical to the frontend's
 * src/types/index.ts and each feature's types.ts, so response bodies from
 * this API can be consumed by the existing mock-shaped frontend hooks
 * without any frontend changes.
 */

export type SourceId =
  | "gmail"
  | "google-calendar"
  | "google-drive"
  | "github"
  | "photos"
  | "notes"
  | "spotify"
  | "whatsapp";

export type SourceStatus = "connected" | "disconnected" | "error" | "syncing";

export type BrandKey = SourceId | "memory";

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: PublicUser;
  token: string;
}

export interface ProfileResponse extends PublicUser {}

export interface UpdateProfileBody {
  name?: string;
  email?: string;
}

export interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
}
