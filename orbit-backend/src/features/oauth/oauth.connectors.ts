import { Memory } from "../../models/Memory.js";
import { recordActivity } from "../activities/activities.service.js";
import { ApiError } from "../../utils/ApiError.js";
import type { ConnectorId } from "./oauth.registry.js";

export interface SyncResult {
  itemCount: number;
  meta: string; // short status text shown on the Source card, e.g. "5 new"
}

async function githubHeaders(accessToken: string) {
  return {
    Authorization: `Bearer ${accessToken}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "orbit-app",
  };
}

async function syncGmail(userId: string, accessToken: string): Promise<SyncResult> {
  const listRes = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5&labelIds=INBOX",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!listRes.ok) throw ApiError.badRequest(`Gmail request failed (${listRes.status}).`);
  const list = (await listRes.json()) as { messages?: Array<{ id: string }> };
  const messages = list.messages ?? [];

  for (const { id } of messages) {
    const msgRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!msgRes.ok) continue;
    const msg = (await msgRes.json()) as {
      internalDate?: string;
      payload?: { headers?: Array<{ name: string; value: string }> };
    };
    const headers = msg.payload?.headers ?? [];
    const subject = headers.find((h) => h.name === "Subject")?.value || "(no subject)";
    const from = headers.find((h) => h.name === "From")?.value || "Unknown sender";
    const occurredAt = msg.internalDate ? new Date(Number(msg.internalDate)) : new Date();

    await recordActivity(userId, "gmail", `New email from ${from}: ${subject}`);
    await Memory.create({
      userId,
      title: subject,
      description: `Email from ${from}`,
      brand: "gmail",
      occurredAt,
    });
  }

  return { itemCount: messages.length, meta: `${messages.length} new` };
}

async function syncGoogleCalendar(userId: string, accessToken: string): Promise<SyncResult> {
  const params = new URLSearchParams({
    maxResults: "5",
    orderBy: "startTime",
    singleEvents: "true",
    timeMin: new Date().toISOString(),
  });
  const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw ApiError.badRequest(`Google Calendar request failed (${res.status}).`);
  const data = (await res.json()) as {
    items?: Array<{
      summary?: string;
      description?: string;
      location?: string;
      start?: { dateTime?: string; date?: string };
    }>;
  };
  const events = data.items ?? [];

  for (const event of events) {
    const title = event.summary || "Untitled event";
    const occurredAt = event.start?.dateTime ? new Date(event.start.dateTime) : new Date(event.start?.date ?? Date.now());

    await recordActivity(userId, "google-calendar", `Upcoming: ${title}`);
    await Memory.create({
      userId,
      title,
      description: event.location || event.description || "No additional details",
      brand: "google-calendar",
      occurredAt,
    });
  }

  return { itemCount: events.length, meta: `Upcoming: ${events.length}` };
}

async function syncGoogleDrive(userId: string, accessToken: string): Promise<SyncResult> {
  const params = new URLSearchParams({
    pageSize: "5",
    orderBy: "modifiedTime desc",
    fields: "files(id,name,modifiedTime,mimeType)",
  });
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw ApiError.badRequest(`Google Drive request failed (${res.status}).`);
  const data = (await res.json()) as {
    files?: Array<{ name: string; mimeType: string; modifiedTime: string }>;
  };
  const files = data.files ?? [];

  for (const file of files) {
    await recordActivity(userId, "google-drive", `File updated: ${file.name}`);
    await Memory.create({
      userId,
      title: file.name,
      description: file.mimeType,
      brand: "google-drive",
      occurredAt: new Date(file.modifiedTime),
    });
  }

  return { itemCount: files.length, meta: `${files.length} files` };
}

async function syncGitHub(userId: string, accessToken: string): Promise<SyncResult> {
  const res = await fetch("https://api.github.com/user/repos?sort=updated&per_page=5", {
    headers: await githubHeaders(accessToken),
  });
  if (!res.ok) throw ApiError.badRequest(`GitHub request failed (${res.status}).`);
  const repos = (await res.json()) as Array<{
    full_name: string;
    description: string | null;
    updated_at: string;
  }>;

  for (const repo of repos) {
    await recordActivity(userId, "github", `Repo updated: ${repo.full_name}`);
    await Memory.create({
      userId,
      title: repo.full_name,
      description: repo.description || "No description",
      brand: "github",
      occurredAt: new Date(repo.updated_at),
    });
  }

  return { itemCount: repos.length, meta: `${repos.length} repos` };
}

const SYNC_HANDLERS: Record<ConnectorId, (userId: string, accessToken: string) => Promise<SyncResult>> = {
  gmail: syncGmail,
  "google-calendar": syncGoogleCalendar,
  "google-drive": syncGoogleDrive,
  github: syncGitHub,
};

/** Dispatches to the right connector's fetch+normalize routine. */
export async function runSync(connectorId: ConnectorId, userId: string, accessToken: string): Promise<SyncResult> {
  return SYNC_HANDLERS[connectorId](userId, accessToken);
}
