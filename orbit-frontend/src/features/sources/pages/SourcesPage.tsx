import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { useSources } from "../hooks/useSources";
import { SourceCard, SourceCardSkeleton, SourcesSummaryBar } from "../components";

export default function SourcesPage() {
  const { data: sources, isLoading, isError, refetch } = useSources();

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="font-display text-xl font-semibold text-white sm:text-2xl">Sources</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Connect the apps you want Orbit to understand. You're always in control of what's linked.
        </p>
      </div>

      <SourcesSummaryBar sources={sources} isLoading={isLoading} />

      {isError ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-2xl border border-destructive/20 p-8 text-center"
        >
          <p className="text-sm text-red-300">Couldn't load your sources.</p>
          <button
            onClick={() => refetch()}
            className="focus-ring mt-3 text-sm font-medium text-orbit-cyan hover:text-orbit-cyan/80"
          >
            Try again
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <SourceCardSkeleton key={i} />)
            : sources?.map((source, i) => <SourceCard key={source.id} source={source} index={i} />)}
        </div>
      )}
    </AppShell>
  );
}
