import type { MemoryItem } from "@/features/memory/types";

interface MemorySeed {
  daysAgo: number;
  time: string;
  title: string;
  description: string;
  brand: MemoryItem["brand"];
}

/** Seeds are relative to "now" so the timeline always looks current when the app is run. */
const SEEDS: MemorySeed[] = [
  { daysAgo: 0, time: "9:12 AM", title: "Flagged an important email", brand: "gmail", description: "Orbit noticed a message from your advisor about the IEEE submission deadline and marked it important." },
  { daysAgo: 0, time: "8:00 AM", title: "Reviewed today's schedule", brand: "google-calendar", description: "3 events today, including a review meeting that moved from Wednesday to Thursday." },
  { daysAgo: 1, time: "7:00 PM", title: "Summarized unread chats", brand: "whatsapp", description: "23 unread messages condensed into a 3-line summary — nothing urgent." },
  { daysAgo: 1, time: "3:24 PM", title: "New file detected", brand: "google-drive", description: "\"Orbit_Architecture_v2.pdf\" was added to your shared project folder." },
  { daysAgo: 2, time: "6:00 PM", title: "Weekly notes digest generated", brand: "notes", description: "Rolled up 12 notes from this week into a single summary." },
  { daysAgo: 3, time: "11:45 AM", title: "Tagged new photos", brand: "photos", description: "18 new photos organized by event: \"Project Review Prep\"." },
  { daysAgo: 4, time: "8:00 AM", title: "Meeting prep reminder sent", brand: "google-calendar", description: "A heads-up went out 15 minutes before your team sync." },
  { daysAgo: 5, time: "8:00 AM", title: "Focus playlist started", brand: "spotify", description: "Started your focus playlist automatically for a scheduled work block." },
  { daysAgo: 7, time: "2:15 PM", title: "Connected a new source", brand: "github", description: "GitHub was linked so Orbit can track open issues alongside your calendar." },
  { daysAgo: 9, time: "10:00 AM", title: "Context refreshed", brand: "memory", description: "Re-indexed everything Orbit has learned so far to keep answers current." },
];

function toItem(seed: MemorySeed, index: number): MemoryItem {
  const d = new Date();
  d.setDate(d.getDate() - seed.daysAgo);
  return {
    id: `mem_${index}`,
    title: seed.title,
    description: seed.description,
    brand: seed.brand,
    date: d.toISOString(),
    time: seed.time,
  };
}

/** Static fixture — swap for a real GET /memories in a later phase. */
export const MOCK_MEMORIES: MemoryItem[] = SEEDS.map(toItem);
