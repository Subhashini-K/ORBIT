import type { SourceId } from "@/types";

/** The subset of SourceId that has a real OAuth connector wired up (mirrors the backend's OAUTH_CONNECTOR_IDS). */
export const REAL_CONNECTOR_IDS = ["gmail", "google-calendar", "google-drive", "github"] as const;

export type ConnectorId = (typeof REAL_CONNECTOR_IDS)[number];

export function isRealConnector(sourceId: SourceId): sourceId is ConnectorId {
  return (REAL_CONNECTOR_IDS as readonly string[]).includes(sourceId);
}
