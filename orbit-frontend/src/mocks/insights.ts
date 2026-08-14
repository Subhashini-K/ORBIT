import type { InsightsData } from "@/features/insights/types";

/** Static fixture — swap for a real GET /insights in a later phase. */
export const MOCK_INSIGHTS: InsightsData = {
  summary: {
    totalEvents: 342,
    weeklyChangePercent: 18,
    busiestDay: "Wednesday",
    mostActiveSource: "Gmail",
  },
  weeklyActivity: [
    { day: "Mon", events: 38 },
    { day: "Tue", events: 52 },
    { day: "Wed", events: 71 },
    { day: "Thu", events: 44 },
    { day: "Fri", events: 63 },
    { day: "Sat", events: 21 },
    { day: "Sun", events: 15 },
  ],
  sourceShare: [
    { brand: "gmail", label: "Gmail", value: 32 },
    { brand: "google-calendar", label: "Calendar", value: 21 },
    { brand: "google-drive", label: "Drive", value: 16 },
    { brand: "whatsapp", label: "WhatsApp", value: 14 },
    { brand: "notes", label: "Notes", value: 10 },
    { brand: "photos", label: "Photos", value: 7 },
  ],
};
