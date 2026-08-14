import { Source } from "../models/Source.js";
import { Automation } from "../models/Automation.js";
import { SOURCE_LABELS } from "./sourceLabels.js";
import type { SourceId } from "../types/index.js";

/**
 * What a brand-new signup starts with — mirrors the frontend's original
 * mock fixtures (src/mocks/sources.ts, src/mocks/automations.ts) exactly,
 * so a real account looks identical to the demo the frontend shipped with.
 */
const DEFAULT_SOURCE_IDS = Object.keys(SOURCE_LABELS) as SourceId[];

const DEFAULT_AUTOMATIONS = [
  { slug: "inbox-digest", name: "Inbox digest", description: "Summarizes your most important unread emails every morning.", brand: "gmail", frequency: "Daily at 8:00 AM" },
  { slug: "meeting-prep", name: "Meeting prep reminders", description: "Sends a heads-up with relevant notes 15 minutes before each meeting.", brand: "google-calendar", frequency: "15 min before events" },
  { slug: "file-backup", name: "Smart file backup", description: "Organizes and backs up new Drive files into dated project folders.", brand: "google-drive", frequency: "Whenever a file is added" },
  { slug: "notes-digest", name: "Weekly notes digest", description: "Rolls up everything you jotted down this week into one summary.", brand: "notes", frequency: "Every Sunday, 6:00 PM" },
  { slug: "focus-playlist", name: "Focus playlist trigger", description: "Starts your focus playlist automatically when a work block begins.", brand: "spotify", frequency: "On calendar focus blocks" },
  { slug: "whatsapp-digest", name: "Unread message digest", description: "One tidy summary of unread chats instead of scattered notifications.", brand: "whatsapp", frequency: "Daily at 7:00 PM" },
  { slug: "photo-tagging", name: "Auto-tag memories", description: "Tags and organizes new photos by people, places, and events.", brand: "photos", frequency: "When new photos sync" },
  { slug: "memory-refresh", name: "Context refresh", description: "Re-indexes what Orbit has learned so answers stay up to date.", brand: "memory", frequency: "Nightly at 2:00 AM" },
] as const;

export async function seedDefaultSources(userId: string) {
  await Source.insertMany(
    DEFAULT_SOURCE_IDS.map((sourceId) => ({
      userId,
      sourceId,
      name: SOURCE_LABELS[sourceId],
      status: "disconnected" as const,
    }))
  );
}

export async function seedDefaultAutomations(userId: string) {
  await Automation.insertMany(
    DEFAULT_AUTOMATIONS.map((a) => ({ userId, ...a, enabled: false }))
  );
}

/** Called once, right after a new user is created. */
export async function seedNewUserDefaults(userId: string) {
  await Promise.all([seedDefaultSources(userId), seedDefaultAutomations(userId)]);
}
