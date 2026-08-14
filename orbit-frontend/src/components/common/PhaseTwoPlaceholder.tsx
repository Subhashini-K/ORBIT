import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface PhaseTwoPlaceholderProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

/**
 * Placeholder used by feature pages that have a route + folder scaffolded
 * for Phase 1, but whose full implementation is planned for a later phase.
 * Keeps the app fully navigable end-to-end while signalling what's next.
 */
export function PhaseTwoPlaceholder({ icon: Icon, title, description }: PhaseTwoPlaceholderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-20 text-center"
    >
      <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-orbit shadow-glow-blue">
        <Icon className="h-7 w-7 text-white" />
      </div>
      <h2 className="font-display text-xl font-semibold text-white">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      <div className="mt-5 flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-orbit-cyan">
        <Sparkles className="h-3.5 w-3.5" />
        Scaffolded for Phase 2
      </div>
    </motion.div>
  );
}
