import { Types } from "mongoose";
import { Activity } from "../../models/Activity.js";
import { SOURCE_LABELS } from "../../utils/sourceLabels.js";
import type { BrandKey, SourceId } from "../../types/index.js";

export interface WeeklyActivityPoint {
  day: string;
  events: number;
}
export interface SourceShare {
  brand: BrandKey;
  label: string;
  value: number;
}
export interface InsightsSummary {
  totalEvents: number;
  weeklyChangePercent: number;
  busiestDay: string;
  mostActiveSource: string;
}
export interface InsightsResponse {
  summary: InsightsSummary;
  weeklyActivity: WeeklyActivityPoint[];
  sourceShare: SourceShare[];
}

// Date.getDay() is Sunday-first (0=Sun); the frontend's chart expects
// Monday-first order (matching its original mock fixture), so these are
// kept separate: one for looking up which bucket a Date falls into, one
// for the order the response is actually returned in.
const JS_DAY_INDEX_TO_LABEL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const OUTPUT_DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

/**
 * All of this is real aggregation over real Activity documents — no AI
 * involved. It answers "what actually happened", not "what it means",
 * which is exactly the boundary Phase 1 draws around this project.
 */
export async function getInsights(userId: string): Promise<InsightsResponse> {
  const now = new Date();
  const sevenDaysAgo = startOfDay(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
  const fourteenDaysAgo = startOfDay(new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000));

  const [lastWeekDocs, priorWeekCount, sourceCounts] = await Promise.all([
    Activity.find({ userId, createdAt: { $gte: sevenDaysAgo } }).select("sourceId createdAt"),
    Activity.countDocuments({ userId, createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo } }),
    Activity.aggregate<{ _id: string; count: number }>([
      { $match: { userId: new Types.ObjectId(userId), createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: "$sourceId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);

  // Weekly activity: bucket the last 7 days' events by day-of-week.
  const dayBuckets = new Map<string, number>(OUTPUT_DAY_ORDER.map((d) => [d, 0]));
  for (const doc of lastWeekDocs) {
    const label = JS_DAY_INDEX_TO_LABEL[doc.createdAt.getDay()];
    dayBuckets.set(label, (dayBuckets.get(label) ?? 0) + 1);
  }
  const weeklyActivity: WeeklyActivityPoint[] = OUTPUT_DAY_ORDER.map((day) => ({
    day,
    events: dayBuckets.get(day) ?? 0,
  }));

  // Source share: percentage of this week's events per source.
  const totalEvents = lastWeekDocs.length;
  const sourceShare: SourceShare[] = sourceCounts.map((row) => {
    const sourceId = row._id as SourceId;
    return {
      brand: sourceId,
      label: SOURCE_LABELS[sourceId] ?? sourceId,
      value: totalEvents === 0 ? 0 : Math.round((row.count / totalEvents) * 100),
    };
  });

  const busiestDay = weeklyActivity.reduce((max, d) => (d.events > max.events ? d : max), weeklyActivity[0]).day;
  const mostActiveSource = sourceShare[0]?.label ?? "—";
  const weeklyChangePercent =
    priorWeekCount === 0 ? (totalEvents > 0 ? 100 : 0) : Math.round(((totalEvents - priorWeekCount) / priorWeekCount) * 100);

  return {
    summary: { totalEvents, weeklyChangePercent, busiestDay, mostActiveSource },
    weeklyActivity,
    sourceShare,
  };
}
