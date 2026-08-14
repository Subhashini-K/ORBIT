import { Source } from "../../models/Source.js";
import { ApiError } from "../../utils/ApiError.js";
import type { SourceId, SourceStatus } from "../../types/index.js";

export interface SourceResponse {
  id: SourceId;
  name: string;
  status: SourceStatus;
  meta?: string;
  lastSyncedAt?: string;
}

function toResponse(doc: {
  sourceId: string;
  name: string;
  status: string;
  meta?: string | null;
  lastSyncedAt?: Date | null;
}): SourceResponse {
  return {
    id: doc.sourceId as SourceId,
    name: doc.name,
    status: doc.status as SourceStatus,
    meta: doc.meta ?? undefined,
    lastSyncedAt: doc.lastSyncedAt?.toISOString(),
  };
}

export async function listSources(userId: string): Promise<SourceResponse[]> {
  const docs = await Source.find({ userId }).sort({ name: 1 });
  return docs.map(toResponse);
}

export async function updateSourceStatus(
  userId: string,
  sourceId: SourceId,
  status: SourceStatus
): Promise<SourceResponse> {
  const doc = await Source.findOne({ userId, sourceId });
  if (!doc) {
    throw ApiError.notFound(`Unknown source: ${sourceId}`);
  }

  doc.status = status;
  if (status === "connected") {
    doc.lastSyncedAt = new Date();
  }
  await doc.save();

  return toResponse(doc);
}
