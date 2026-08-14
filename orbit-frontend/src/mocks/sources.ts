import type { Source } from "@/types";

/** Static fixture for GET /sources — swap for a real fetch in Phase 2. */
export const MOCK_SOURCES: Source[] = [
  { id: "gmail", name: "Gmail", status: "connected", meta: "120 new" },
  { id: "google-calendar", name: "Google Calendar", status: "connected", meta: "Upcoming: 3" },
  { id: "google-drive", name: "Google Drive", status: "connected", meta: "234 files" },
  { id: "github", name: "GitHub", status: "disconnected" },
  { id: "photos", name: "Photos", status: "connected", meta: "1,345 photos" },
  { id: "notes", name: "Notes", status: "connected", meta: "56 notes" },
  { id: "spotify", name: "Spotify", status: "connected", meta: "Recently played" },
  { id: "whatsapp", name: "WhatsApp", status: "connected", meta: "23 unread" },
];
