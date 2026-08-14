import { Activity } from "../../models/Activity.js";
import { toRelativeTime } from "../../utils/relativeTime.js";
import type { SourceId } from "../../types/index.js";

export interface ActivityResponse {
  id: string;
  sourceId: SourceId;
  message: string;
  timestamp: string; // pre-formatted relative time, matching the original mock contract
}

export async function listRecentActivities(userId: string, limit = 10): Promise<ActivityResponse[]> {
  const docs = await Activity.find({ userId }).sort({ createdAt: -1 }).limit(limit);
  const now = new Date();

  return docs.map((doc) => ({
    id: doc.id,
    sourceId: doc.sourceId as SourceId,
    message: doc.message,
    timestamp: toRelativeTime(doc.createdAt, now),
  }));
}

export async function recordActivity(userId: string, sourceId: SourceId, message: string) {
  return Activity.create({ userId, sourceId, message });
}
