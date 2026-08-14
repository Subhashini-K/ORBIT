import { useMemo } from "react";
import { motion } from "framer-motion";
import { BrandIcon } from "@/components/common/BrandIcon";
import type { MemoryItem } from "../types";

function dayLabel(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  if (sameDay(date, today)) return "Today";
  if (sameDay(date, yesterday)) return "Yesterday";
  return date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}

function groupByDay(items: MemoryItem[]): Array<{ label: string; items: MemoryItem[] }> {
  const groups: Array<{ label: string; items: MemoryItem[] }> = [];
  for (const item of items) {
    const label = dayLabel(item.date);
    const existing = groups.find((g) => g.label === label);
    if (existing) existing.items.push(item);
    else groups.push({ label, items: [item] });
  }
  return groups;
}

export function MemoryTimeline({ memories }: { memories: MemoryItem[] }) {
  const groups = useMemo(() => groupByDay(memories), [memories]);

  return (
    <div className="space-y-8">
      {groups.map((group, groupIndex) => (
        <div key={group.label}>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">{group.label}</p>
          <div className="relative space-y-6 border-l border-white/[0.08] pl-6">
            {group.items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: groupIndex * 0.05 + i * 0.04 }}
                className="relative"
              >
                <span className="absolute -left-[29px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-space-900 ring-2 ring-white/10">
                  <span className="h-1.5 w-1.5 rounded-full bg-orbit-cyan" />
                </span>

                <div className="glass flex items-start gap-3 rounded-xl p-4 transition-colors hover:border-white/20">
                  <BrandIcon brand={item.brand} size={36} className="h-9 w-9 shrink-0" glow />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-[13.5px] font-medium text-white">{item.title}</h3>
                      <span className="shrink-0 text-[11px] text-slate-500">{item.time}</span>
                    </div>
                    <p className="mt-0.5 text-[12.5px] leading-relaxed text-slate-400">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
