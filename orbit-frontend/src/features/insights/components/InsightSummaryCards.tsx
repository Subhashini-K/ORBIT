import { motion } from "framer-motion";
import { Activity, TrendingUp, CalendarDays, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { InsightsSummary } from "../types";

interface InsightSummaryCardsProps {
  summary?: InsightsSummary;
  isLoading: boolean;
}

export function InsightSummaryCards({ summary, isLoading }: InsightSummaryCardsProps) {
  const cards = [
    {
      icon: Activity,
      label: "Total events tracked",
      value: summary ? summary.totalEvents.toLocaleString() : "—",
      iconBg: "from-orbit-blue to-orbit-cyan",
    },
    {
      icon: TrendingUp,
      label: "Change vs. last week",
      value: summary ? `${summary.weeklyChangePercent > 0 ? "+" : ""}${summary.weeklyChangePercent}%` : "—",
      iconBg: "from-orbit-emerald to-green-600",
    },
    {
      icon: CalendarDays,
      label: "Busiest day",
      value: summary?.busiestDay ?? "—",
      iconBg: "from-amber-400 to-orange-500",
    },
    {
      icon: Sparkles,
      label: "Most active source",
      value: summary?.mostActiveSource ?? "—",
      iconBg: "from-orbit-purple to-orbit-violet",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass flex flex-col gap-3 rounded-2xl p-5"
        >
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.iconBg} shadow-glow-blue`}>
            <card.icon className="h-4.5 w-4.5 text-white" />
          </div>
          {isLoading ? (
            <Skeleton className="h-6 w-16" />
          ) : (
            <p className="font-display text-xl font-bold text-white">{card.value}</p>
          )}
          <p className="text-xs text-slate-400">{card.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
