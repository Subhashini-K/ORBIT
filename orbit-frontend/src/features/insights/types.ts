import type { BrandKey } from "@/components/common/BrandIcon";

export interface WeeklyActivityPoint {
  day: string; // "Mon", "Tue", ...
  events: number;
}

export interface SourceShare {
  brand: BrandKey;
  label: string;
  value: number; // percentage share, sums to ~100 across all entries
}

export interface InsightsSummary {
  totalEvents: number;
  weeklyChangePercent: number; // e.g. +12 or -4
  busiestDay: string;
  mostActiveSource: string;
}

export interface InsightsData {
  summary: InsightsSummary;
  weeklyActivity: WeeklyActivityPoint[];
  sourceShare: SourceShare[];
}
