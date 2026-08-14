import type { DashboardStats } from "@/types";

/** Static fixture for GET /dashboard — swap for a real fetch in Phase 2. */
export const MOCK_DASHBOARD_STATS: DashboardStats = {
  connectedSources: 7,
  dataPointsIndexed: 1245,
  contextUnderstanding: 98,
  automationsActive: 12,
};
