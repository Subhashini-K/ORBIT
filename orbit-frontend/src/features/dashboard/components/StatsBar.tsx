import { motion } from "framer-motion";
import { Share2, FileStack, BrainCircuit, Zap, type LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "../hooks";

interface StatDef {
  icon: LucideIcon;
  value: (n: ReturnType<typeof useDashboardStats>["data"]) => string;
  label: string;
  status: string;
  dotClass: string;
  iconBg: string;
}

const STATS: StatDef[] = [
  {
    icon: Share2,
    value: (s) => `${s?.connectedSources ?? 0}`,
    label: "Connected Sources",
    status: "All systems operational",
    dotClass: "bg-orbit-emerald",
    iconBg: "from-orbit-blue to-orbit-cyan",
  },
  {
    icon: FileStack,
    value: (s) => (s ? s.dataPointsIndexed.toLocaleString() : "0"),
    label: "Data Points Indexed",
    status: "Updated just now",
    dotClass: "bg-orbit-blue",
    iconBg: "from-blue-500 to-indigo-500",
  },
  {
    icon: BrainCircuit,
    value: (s) => `${s?.contextUnderstanding ?? 0}%`,
    label: "Context Understanding",
    status: "High relevance",
    dotClass: "bg-orbit-purple",
    iconBg: "from-orbit-purple to-orbit-violet",
  },
  {
    icon: Zap,
    value: (s) => `${s?.automationsActive ?? 0}`,
    label: "Automations Active",
    status: "Running smoothly",
    dotClass: "bg-orbit-amber",
    iconBg: "from-amber-400 to-orange-500",
  },
];

export function StatsBar() {
  const { data, isLoading } = useDashboardStats();

  return (
    <div className="glass grid grid-cols-2 gap-x-4 gap-y-5 rounded-2xl p-5 sm:grid-cols-4 sm:gap-6 sm:p-6">
      {STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          className="flex items-center gap-3"
        >
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${stat.iconBg} shadow-glow-blue`}>
            <stat.icon className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            {isLoading ? (
              <Skeleton className="h-6 w-12" />
            ) : (
              <p className="font-display text-xl font-bold text-white sm:text-2xl">{stat.value(data)}</p>
            )}
            <p className="truncate text-xs text-slate-400">{stat.label}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${stat.dotClass}`} />
              <span className="truncate">{stat.status}</span>
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
