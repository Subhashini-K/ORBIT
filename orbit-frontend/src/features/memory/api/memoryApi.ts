import { apiFetch } from "@/lib/apiClient";
import type { MemoryItem } from "../types";

/** Real implementation of GET /memories. */
export async function getMemories(): Promise<MemoryItem[]> {
  return apiFetch<MemoryItem[]>("/memories");
}
