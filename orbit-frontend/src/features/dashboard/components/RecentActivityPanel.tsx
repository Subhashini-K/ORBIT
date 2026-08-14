import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { BrandIcon, type BrandKey } from "@/components/common/BrandIcon";
import { useActivities } from "../hooks";
import type { SourceId } from "@/types";

const BRAND_BY_SOURCE: Record<SourceId, BrandKey> = {
  gmail: "gmail",
  "google-calendar": "google-calendar",
  "google-drive": "google-drive",
  github: "github",
  photos: "photos",
  notes: "notes",
  spotify: "spotify",
  whatsapp: "whatsapp",
};

export function RecentActivityPanel() {
  const { data: activities, isLoading } = useActivities();

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center gap-2">
        <Zap className="h-4 w-4 text-orbit-amber" />
        <h2 className="font-display text-base font-semibold text-white">Recent Activity</h2>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : activities && activities.length > 0 ? (
        <ul className="space-y-4">
          {activities.map((activity, i) => (
            <motion.li
              key={activity.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3"
            >
              <BrandIcon brand={BRAND_BY_SOURCE[activity.sourceId]} size={32} className="h-8 w-8 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] text-slate-200">{activity.message}</p>
              </div>
              <span className="shrink-0 text-[11px] text-slate-500">{activity.timestamp}</span>
            </motion.li>
          ))}
        </ul>
      ) : (
        <EmptyState icon={Zap} title="No recent activity" description="Once you connect a source, updates will show up here." />
      )}
    </Card>
  );
}
