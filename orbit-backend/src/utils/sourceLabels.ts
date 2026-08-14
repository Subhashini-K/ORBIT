import type { SourceId } from "../types/index.js";

/** Single source of truth for source display names, shared across seeding and insights. */
export const SOURCE_LABELS: Record<SourceId, string> = {
  gmail: "Gmail",
  "google-calendar": "Google Calendar",
  "google-drive": "Google Drive",
  github: "GitHub",
  photos: "Photos",
  notes: "Notes",
  spotify: "Spotify",
  whatsapp: "WhatsApp",
};
