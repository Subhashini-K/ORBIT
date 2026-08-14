import { motion } from "framer-motion";
import { Check, Plug, AlertTriangle, RefreshCw } from "lucide-react";
import { BrandIcon } from "@/components/common/BrandIcon";
import { Button } from "@/components/ui/button";
import { useUpdateSource } from "../hooks/useSources";
import { useOAuthConnect, useOAuthDisconnect } from "@/features/oauth/hooks";
import { isRealConnector } from "@/features/oauth/constants";
import type { Source } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_COPY: Record<Source["status"], { label: string; dotClass: string }> = {
  connected: { label: "Connected", dotClass: "bg-orbit-emerald" },
  disconnected: { label: "Not connected", dotClass: "bg-slate-500" },
  error: { label: "Needs attention", dotClass: "bg-destructive" },
  syncing: { label: "Syncing…", dotClass: "bg-orbit-amber" },
};

interface SourceCardProps {
  source: Source;
  index: number;
}

export function SourceCard({ source, index }: SourceCardProps) {
  // gmail/google-calendar/google-drive/github are real OAuth connectors —
  // they redirect to the provider's consent screen instead of flipping a
  // status flag. Everything else (photos, notes, spotify, whatsapp) is
  // still the original mock PATCH-based toggle.
  const updateSource = useUpdateSource();
  const oauthConnect = useOAuthConnect();
  const oauthDisconnect = useOAuthDisconnect();

  const status = STATUS_COPY[source.status];
  const isConnected = source.status === "connected";
  const isError = source.status === "error";
  const isPending = isRealConnector(source.id)
    ? oauthConnect.isPending || oauthDisconnect.isPending
    : updateSource.isPending;
  const hasError = isRealConnector(source.id)
    ? oauthConnect.isError || oauthDisconnect.isError
    : updateSource.isError;

  function handleConnect() {
    if (isRealConnector(source.id)) {
      oauthConnect.mutate(source.id);
    } else {
      updateSource.mutate({ id: source.id, status: "connected" });
    }
  }

  function handleDisconnect() {
    if (isRealConnector(source.id)) {
      oauthDisconnect.mutate(source.id);
    } else {
      updateSource.mutate({ id: source.id, status: "disconnected" });
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      whileHover={{ y: -3 }}
      className={cn(
        "glass group relative flex flex-col gap-4 rounded-2xl p-5 transition-colors",
        isConnected ? "hover:border-white/20" : "hover:border-white/15"
      )}
    >
      <div className="flex items-start justify-between">
        <BrandIcon brand={source.id} size={48} glow className="h-12 w-12" />
        <span
          className={cn(
            "flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium",
            isError ? "text-red-300" : isConnected ? "text-emerald-300" : "text-slate-400"
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", status.dotClass)} />
          {status.label}
        </span>
      </div>

      <div className="flex-1">
        <h3 className="font-display text-[15px] font-semibold text-white">{source.name}</h3>
        <p className="mt-0.5 text-[13px] text-slate-400">
          {isConnected
            ? source.meta ?? "Synced and up to date"
            : isError
            ? "Reconnect to resume syncing"
            : "Connect to let Orbit see this source"}
        </p>
      </div>

      {isConnected ? (
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="flex-1" disabled>
            <Check className="h-3.5 w-3.5" />
            Connected
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisconnect}
            loading={isPending}
            className="shrink-0"
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button size="sm" className="w-full" onClick={handleConnect} loading={isPending}>
          {isError ? <RefreshCw className="h-3.5 w-3.5" /> : <Plug className="h-3.5 w-3.5" />}
          {isError ? "Reconnect" : "Connect"}
        </Button>
      )}

      {hasError && (
        <p className="flex items-center gap-1.5 text-[11px] text-red-400">
          <AlertTriangle className="h-3 w-3" />
          Couldn't update this source. Try again.
        </p>
      )}
    </motion.div>
  );
}
