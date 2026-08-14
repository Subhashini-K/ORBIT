/**
 * Creates (or resets) a demo account with the same rich, mostly-connected
 * state the frontend's original mock fixtures showed — useful for local
 * development and for demos, without needing to click through Connect on
 * every source by hand.
 *
 * Usage: npm run seed
 */
import { connectDB, disconnectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Source } from "../models/Source.js";
import { Automation } from "../models/Automation.js";
import { Activity } from "../models/Activity.js";
import { Memory } from "../models/Memory.js";
import { hashPassword } from "../utils/password.js";
import { SOURCE_LABELS } from "../utils/sourceLabels.js";
import type { SourceId } from "../types/index.js";

const DEMO_EMAIL = "demo@orbit.app";
const DEMO_PASSWORD = "OrbitDemo123!";

const CONNECTED_SOURCES: Array<{ sourceId: SourceId; meta: string }> = [
  { sourceId: "gmail", meta: "120 new" },
  { sourceId: "google-calendar", meta: "Upcoming: 3" },
  { sourceId: "google-drive", meta: "234 files" },
  { sourceId: "photos", meta: "1,345 photos" },
  { sourceId: "notes", meta: "56 notes" },
  { sourceId: "spotify", meta: "Recently played" },
  { sourceId: "whatsapp", meta: "23 unread" },
];

async function seed() {
  await connectDB();

  await User.deleteOne({ email: DEMO_EMAIL });
  const passwordHash = await hashPassword(DEMO_PASSWORD);
  const user = await User.create({ name: "Subhashini Kumar", email: DEMO_EMAIL, passwordHash });
  const userId = user.id;

  await Promise.all([
    Source.deleteMany({ userId }),
    Automation.deleteMany({ userId }),
    Activity.deleteMany({ userId }),
    Memory.deleteMany({ userId }),
  ]);

  const allSourceIds = Object.keys(SOURCE_LABELS) as SourceId[];
  await Source.insertMany(
    allSourceIds.map((sourceId) => {
      const connected = CONNECTED_SOURCES.find((s) => s.sourceId === sourceId);
      return {
        userId,
        sourceId,
        name: SOURCE_LABELS[sourceId],
        status: connected ? "connected" : "disconnected",
        meta: connected?.meta,
        lastSyncedAt: connected ? new Date() : undefined,
      };
    })
  );

  await Automation.insertMany([
    { userId, slug: "inbox-digest", name: "Inbox digest", description: "Summarizes your most important unread emails every morning.", brand: "gmail", enabled: true, frequency: "Daily at 8:00 AM", lastRun: new Date() },
    { userId, slug: "meeting-prep", name: "Meeting prep reminders", description: "Sends a heads-up with relevant notes 15 minutes before each meeting.", brand: "google-calendar", enabled: true, frequency: "15 min before events", lastRun: new Date() },
    { userId, slug: "file-backup", name: "Smart file backup", description: "Organizes and backs up new Drive files into dated project folders.", brand: "google-drive", enabled: false, frequency: "Whenever a file is added" },
    { userId, slug: "notes-digest", name: "Weekly notes digest", description: "Rolls up everything you jotted down this week into one summary.", brand: "notes", enabled: true, frequency: "Every Sunday, 6:00 PM", lastRun: new Date() },
    { userId, slug: "focus-playlist", name: "Focus playlist trigger", description: "Starts your focus playlist automatically when a work block begins.", brand: "spotify", enabled: false, frequency: "On calendar focus blocks" },
    { userId, slug: "whatsapp-digest", name: "Unread message digest", description: "One tidy summary of unread chats instead of scattered notifications.", brand: "whatsapp", enabled: true, frequency: "Daily at 7:00 PM", lastRun: new Date() },
    { userId, slug: "photo-tagging", name: "Auto-tag memories", description: "Tags and organizes new photos by people, places, and events.", brand: "photos", enabled: true, frequency: "When new photos sync", lastRun: new Date() },
    { userId, slug: "memory-refresh", name: "Context refresh", description: "Re-indexes what Orbit has learned so answers stay up to date.", brand: "memory", enabled: true, frequency: "Nightly at 2:00 AM", lastRun: new Date() },
  ]);

  const hoursAgo = (h: number) => new Date(Date.now() - h * 60 * 60 * 1000);
  await Activity.insertMany([
    { userId, sourceId: "gmail", message: "Gmail connected", createdAt: hoursAgo(0.03) },
    { userId, sourceId: "google-drive", message: "Drive file synced", createdAt: hoursAgo(0.25) },
    { userId, sourceId: "google-calendar", message: "Calendar event created", createdAt: hoursAgo(1) },
    { userId, sourceId: "notes", message: "Notes updated", createdAt: hoursAgo(2) },
    { userId, sourceId: "whatsapp", message: "Unread chats summarized", createdAt: hoursAgo(20) },
    { userId, sourceId: "photos", message: "12 new photos tagged", createdAt: hoursAgo(30) },
    { userId, sourceId: "gmail", message: "3 emails flagged as important", createdAt: hoursAgo(50) },
    { userId, sourceId: "google-calendar", message: "Meeting prep reminder sent", createdAt: hoursAgo(70) },
    { userId, sourceId: "spotify", message: "Focus playlist started", createdAt: hoursAgo(96) },
    { userId, sourceId: "google-drive", message: "Project folder reorganized", createdAt: hoursAgo(140) },
  ]);

  const daysAgo = (d: number) => new Date(Date.now() - d * 24 * 60 * 60 * 1000);
  await Memory.insertMany([
    { userId, title: "Flagged an important email", description: "Orbit noticed a message from your advisor about the IEEE submission deadline.", brand: "gmail", occurredAt: daysAgo(0) },
    { userId, title: "Reviewed today's schedule", description: "3 events today, including a review meeting that moved to Thursday.", brand: "google-calendar", occurredAt: daysAgo(0) },
    { userId, title: "Summarized unread chats", description: "23 unread messages condensed into a 3-line summary.", brand: "whatsapp", occurredAt: daysAgo(1) },
    { userId, title: "Weekly notes digest generated", description: "Rolled up 12 notes from this week into a single summary.", brand: "notes", occurredAt: daysAgo(2) },
    { userId, title: "Context refreshed", description: "Re-indexed everything Orbit has learned so far.", brand: "memory", occurredAt: daysAgo(9) },
  ]);

  console.log("Seeded demo account:");
  console.log(`  email:    ${DEMO_EMAIL}`);
  console.log(`  password: ${DEMO_PASSWORD}`);

  await disconnectDB();
}

seed().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});
