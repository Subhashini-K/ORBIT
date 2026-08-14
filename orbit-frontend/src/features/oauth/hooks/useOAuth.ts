import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuthorizeUrl, disconnectConnector } from "../api/oauthApi";
import { sourcesQueryKey } from "@/features/sources/hooks/useSources";
import type { ConnectorId } from "../constants";

/**
 * Kicks off the real OAuth flow: fetches a Google/GitHub consent URL from
 * the backend, then does a full-page redirect there. There's no "success"
 * to return to the caller — the browser leaves the app entirely until the
 * provider redirects back to /oauth/callback.
 */
export function useOAuthConnect() {
  return useMutation({
    mutationFn: async (connectorId: ConnectorId) => {
      const { url } = await getAuthorizeUrl(connectorId);
      window.location.href = url;
    },
  });
}

export function useOAuthDisconnect() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (connectorId: ConnectorId) => disconnectConnector(connectorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sourcesQueryKey });
    },
  });
}
