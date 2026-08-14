import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { useInsights } from "../hooks/useInsights";
import { InsightSummaryCards, ActivityBarChart, SourceDistributionChart } from "../components";

export default function InsightsPage() {
  const { data, isLoading, isError, refetch } = useInsights();

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="font-display text-xl font-semibold text-white sm:text-2xl">Insights</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          How your attention is spread across sources — based on mock data for now.
        </p>
      </div>

      {isError ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-2xl border border-destructive/20 p-8 text-center"
        >
          <p className="text-sm text-red-300">Couldn't load your insights.</p>
          <button
            onClick={() => refetch()}
            className="focus-ring mt-3 text-sm font-medium text-orbit-cyan hover:text-orbit-cyan/80"
          >
            Try again
          </button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <InsightSummaryCards summary={data?.summary} isLoading={isLoading} />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <ActivityBarChart data={data?.weeklyActivity} isLoading={isLoading} />
            <SourceDistributionChart data={data?.sourceShare} isLoading={isLoading} />
          </div>
        </div>
      )}
    </AppShell>
  );
}
