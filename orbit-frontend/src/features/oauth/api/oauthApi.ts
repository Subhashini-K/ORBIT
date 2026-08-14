import { apiFetch } from "@/lib/apiClient";
import type { ConnectorId } from "../constants";

/** Asks the backend for a ready-to-use Google/GitHub consent URL for this connector. */
export async function getAuthorizeUrl(connectorId: ConnectorId): Promise<{ url: string }> {
  return apiFetch<{ url: string }>(`/oauth/${connectorId}/authorize`);
}

/** Revokes and removes the stored token for this connector. */
export async function disconnectConnector(connectorId: ConnectorId): Promise<{ id: ConnectorId; status: string }> {
  return apiFetch<{ id: ConnectorId; status: string }>(`/oauth/${connectorId}/disconnect`, {
    method: "POST",
  });
}
