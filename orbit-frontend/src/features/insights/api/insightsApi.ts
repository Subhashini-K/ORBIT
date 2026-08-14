import { apiFetch } from "@/lib/apiClient";
import type { InsightsData } from "../types";

/** Real implementation of GET /insights. */
export async function getInsights(): Promise<InsightsData> {
  return apiFetch<InsightsData>("/insights");
}
