import { Memory } from "../../models/Memory.js";
import type { BrandKey } from "../../types/index.js";

export interface MemoryResponse {
  id: string;
  title: string;
  description: string;
  brand: BrandKey;
  date: string; // ISO — the frontend groups these into day buckets itself
  time: string; // short display time, e.g. "9:12 AM"
}

export async function listMemories(userId: string, limit = 30): Promise<MemoryResponse[]> {
  const docs = await Memory.find({ userId }).sort({ occurredAt: -1 }).limit(limit);

  return docs.map((doc) => ({
    id: doc.id,
    title: doc.title,
    description: doc.description,
    brand: doc.brand as BrandKey,
    date: doc.occurredAt.toISOString(),
    time: doc.occurredAt.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
  }));
}
