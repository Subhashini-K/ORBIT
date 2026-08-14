import { motion } from "framer-motion";
import { Plug, PlugZap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Source } from "@/types";

interface SourcesSummaryBarProps {
  sources?: Source[];
  isLoading: boolean;
}

export function SourcesSummaryBar({ sources, isLoading }: SourcesSummaryBarProps) {
  const total = sources?.length ?? 0;
  const connected = sources?.filter((s) => s.status === "connected").length ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass mb-6 flex items-center justify-between rounded-2xl p-5"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-orbit shadow-glow-blue">
          <PlugZap className="h-5 w-5 text-white" />
        </div>
        <div>
          {isLoading ? (
            <Skeleton className="h-5 w-24" />
          ) : (
            <p className="font-display text-base font-semibold text-white">
              {connected} of {total} sources connected
            </p>
          )}
          <p className="text-xs text-slate-400">Orbit only reads from what you connect — disconnect anytime.</p>
        </div>
      </div>
      <Plug className="hidden h-5 w-5 text-slate-600 sm:block" />
    </motion.div>
  );
}
