import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { useAutomations } from "../hooks";
import { AutomationCard, AutomationCardSkeleton, AutomationsSummaryBar } from "../components";

export default function AutomationsPage() {
  const { data: automations, isLoading, isError, refetch } = useAutomations();

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="font-display text-xl font-semibold text-white sm:text-2xl">Automations</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Rules that let Orbit act on your behalf. Toggle anything on or off — nothing runs without your say-so.
        </p>
      </div>

      <AutomationsSummaryBar automations={automations} isLoading={isLoading} />

      {isError ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-2xl border border-destructive/20 p-8 text-center"
        >
          <p className="text-sm text-red-300">Couldn't load your automations.</p>
          <button
            onClick={() => refetch()}
            className="focus-ring mt-3 text-sm font-medium text-orbit-cyan hover:text-orbit-cyan/80"
          >
            Try again
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <AutomationCardSkeleton key={i} />)
            : automations?.map((automation, i) => (
                <AutomationCard key={automation.id} automation={automation} index={i} />
              ))}
        </div>
      )}
    </AppShell>
  );
}
