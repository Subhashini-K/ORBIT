import { motion } from "framer-motion";
import { Workflow, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Automation } from "../types";

interface AutomationsSummaryBarProps {
  automations?: Automation[];
  isLoading: boolean;
}

export function AutomationsSummaryBar({ automations, isLoading }: AutomationsSummaryBarProps) {
  const total = automations?.length ?? 0;
  const active = automations?.filter((a) => a.enabled).length ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass mb-6 flex items-center justify-between rounded-2xl p-5"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-orbit shadow-glow-purple">
          <Workflow className="h-5 w-5 text-white" />
        </div>
        <div>
          {isLoading ? (
            <Skeleton className="h-5 w-28" />
          ) : (
            <p className="font-display text-base font-semibold text-white">
              {active} of {total} automations active
            </p>
          )}
          <p className="text-xs text-slate-400">Orbit acts on your behalf only for what you turn on.</p>
        </div>
      </div>
      <Zap className="hidden h-5 w-5 text-slate-600 sm:block" />
    </motion.div>
  );
}
