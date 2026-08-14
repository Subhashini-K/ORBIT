import { apiFetch } from "@/lib/apiClient";
import type { ActivityItem, DashboardStats } from "@/types";

/** Real implementation of GET /dashboard and GET /activities. */

export async function getDashboardStats(): Promise<DashboardStats> {
  return apiFetch<DashboardStats>("/dashboard");
}

export async function getActivities(): Promise<ActivityItem[]> {
  return apiFetch<ActivityItem[]>("/activities");
}
