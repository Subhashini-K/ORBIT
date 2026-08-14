import { apiFetch } from "@/lib/apiClient";
import type { Source, SourceId, SourceStatus } from "@/types";

/** Real implementation of GET /sources and PATCH /sources/:id. */

export async function getSources(): Promise<Source[]> {
  return apiFetch<Source[]>("/sources");
}

export async function updateSource(id: SourceId, patch: { status: SourceStatus }): Promise<Source> {
  return apiFetch<Source>(`/sources/${id}`, {
    method: "PATCH",
    body: patch,
  });
}
