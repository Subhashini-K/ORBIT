import { OAUTH_CONNECTOR_IDS } from "../../models/OAuthToken.js";

export type ConnectorId = (typeof OAUTH_CONNECTOR_IDS)[number];
export type OAuthProviderName = "google" | "github";

interface ConnectorConfig {
  provider: OAuthProviderName;
  scopes: string[];
  displayName: string;
}

/**
 * Single source of truth for "what does this connector need". Gmail,
 * Google Calendar and Google Drive all authenticate against the same
 * Google OAuth client (one Client ID/secret, one redirect URI) but request
 * different scopes — Google supports this as incremental authorization, so
 * connecting one doesn't grant the others.
 */
export const CONNECTOR_REGISTRY: Record<ConnectorId, ConnectorConfig> = {
  gmail: {
    provider: "google",
    scopes: ["https://www.googleapis.com/auth/gmail.readonly"],
    displayName: "Gmail",
  },
  "google-calendar": {
    provider: "google",
    scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
    displayName: "Google Calendar",
  },
  "google-drive": {
    provider: "google",
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    displayName: "Google Drive",
  },
  github: {
    provider: "github",
    scopes: ["read:user", "repo"],
    displayName: "GitHub",
  },
};

export function isOAuthConnector(sourceId: string): sourceId is ConnectorId {
  return (OAUTH_CONNECTOR_IDS as readonly string[]).includes(sourceId);
}

export function getConnectorConfig(connectorId: ConnectorId): ConnectorConfig {
  return CONNECTOR_REGISTRY[connectorId];
}
