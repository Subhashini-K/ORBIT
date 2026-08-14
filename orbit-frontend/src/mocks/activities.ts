import type { ActivityItem } from "@/types";

/** Static fixture for GET /activities — swap for a real fetch in Phase 2. */
export const MOCK_ACTIVITIES: ActivityItem[] = [
  { id: "1", sourceId: "gmail", message: "Gmail connected", timestamp: "2 min ago" },
  { id: "2", sourceId: "google-drive", message: "Drive file synced", timestamp: "15 min ago" },
  { id: "3", sourceId: "google-calendar", message: "Calendar event created", timestamp: "1 hr ago" },
  { id: "4", sourceId: "notes", message: "Notes updated", timestamp: "2 hrs ago" },
];
