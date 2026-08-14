import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/common/EmptyState";
import { useMemories } from "../hooks/useMemories";
import { MemoryTimeline, MemoryTimelineSkeleton } from "../components";

export default function MemoryPage() {
  const { data: memories, isLoading, isError, refetch } = useMemories();

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="font-display text-xl font-semibold text-white sm:text-2xl">Memory</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Everything Orbit has noticed and learned across your connected sources.
          </p>
        </div>

        {isError ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-2xl border border-destructive/20 p-8 text-center"
          >
            <p className="text-sm text-red-300">Couldn't load your memory timeline.</p>
            <button
              onClick={() => refetch()}
              className="focus-ring mt-3 text-sm font-medium text-orbit-cyan hover:text-orbit-cyan/80"
            >
              Try again
            </button>
          </motion.div>
        ) : isLoading ? (
          <MemoryTimelineSkeleton />
        ) : memories && memories.length > 0 ? (
          <MemoryTimeline memories={memories} />
        ) : (
          <EmptyState
            icon={Clock}
            title="Nothing here yet"
            description="Once Orbit starts learning from your connected sources, key moments will show up here."
          />
        )}
      </div>
    </AppShell>
  );
}
