/**
 * Shared, cross-feature types. Feature-specific types (e.g. auth's
 * LoginPayload) live inside their own feature folder instead of here.
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

export interface Source {
  id: SourceId;
  name: string;
  status: SourceStatus;
  meta?: string; // e.g. "120 new", "234 files"
  lastSyncedAt?: string;
}

export interface ActivityItem {
  id: string;
  sourceId: SourceId;
  message: string;
  timestamp: string;
}

export interface DashboardStats {
  connectedSources: number;
  dataPointsIndexed: number;
  contextUnderstanding: number; // percentage
  automationsActive: number;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface UpdateProfileBody {
  name?: string;
  email?: string;
}

export interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
}
