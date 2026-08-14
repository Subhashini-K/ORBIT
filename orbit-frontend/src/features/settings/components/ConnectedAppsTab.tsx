import { motion } from "framer-motion";
import { Plug } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrandIcon } from "@/components/common/BrandIcon";
import { Skeleton } from "@/components/ui/skeleton";
import { useSources, useUpdateSource } from "@/features/sources/hooks";
import { useOAuthConnect, useOAuthDisconnect } from "@/features/oauth/hooks";
import { isRealConnector } from "@/features/oauth/constants";
import type { Source } from "@/types";

/**
 * A compact, list-style view of the same source data the Sources page
 * shows as cards — reuses useSources()/useUpdateSource() directly rather
 * than duplicating the data layer. Real connectors (gmail, google-calendar,
 * google-drive, github) go through the OAuth hooks instead of the mock
 * PATCH toggle, same as SourceCard on the Sources page.
 */
export function ConnectedAppsTab() {
  const { data: sources, isLoading } = useSources();
  const updateSource = useUpdateSource();
  const oauthConnect = useOAuthConnect();
  const oauthDisconnect = useOAuthDisconnect();

  function handleConnect(source: Source) {
    if (isRealConnector(source.id)) {
      oauthConnect.mutate(source.id);
    } else {
      updateSource.mutate({ id: source.id, status: "connected" });
    }
  }

  function handleDisconnect(source: Source) {
    if (isRealConnector(source.id)) {
      oauthDisconnect.mutate(source.id);
    } else {
      updateSource.mutate({ id: source.id, status: "disconnected" });
    }
  }

  const isPending = updateSource.isPending || oauthConnect.isPending || oauthDisconnect.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected apps</CardTitle>
        <CardDescription>
          Manage which sources Orbit can read from. Full details live on the Sources page.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-white/[0.06] p-3.5">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
            ))
          : sources?.map((source, i) => {
              const isConnected = source.status === "connected";
              return (
                <motion.div
                  key={source.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5"
                >
                  <div className="flex items-center gap-3">
                    <BrandIcon brand={source.id} size={36} className="h-9 w-9" />
                    <div>
                      <p className="text-sm font-medium text-white">{source.name}</p>
                      <p className="text-xs text-slate-500">
                        {isConnected ? source.meta ?? "Connected" : "Not connected"}
                      </p>
                    </div>
                  </div>
                  {isConnected ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnect(source)}
                      loading={isPending}
                    >
                      Disconnect
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => handleConnect(source)} loading={isPending}>
                      <Plug className="h-3.5 w-3.5" />
                      Connect
                    </Button>
                  )}
                </motion.div>
              );
            })}
      </CardContent>
    </Card>
  );
}
