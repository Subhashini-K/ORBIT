import { Source } from "../../models/Source.js";
import { Automation } from "../../models/Automation.js";
import { Activity } from "../../models/Activity.js";
import { Memory } from "../../models/Memory.js";

export interface DashboardStatsResponse {
  connectedSources: number;
  dataPointsIndexed: number;
  contextUnderstanding: number;
  automationsActive: number;
}

export async function getDashboardStats(userId: string): Promise<DashboardStatsResponse> {
  const [totalSources, connectedSources, automationsActive, activityCount, memoryCount] = await Promise.all([
    Source.countDocuments({ userId }),
    Source.countDocuments({ userId, status: "connected" }),
    Automation.countDocuments({ userId, enabled: true }),
    Activity.countDocuments({ userId }),
    Memory.countDocuments({ userId }),
  ]);

  // "Context understanding" is a placeholder proxy — not a real comprehension
  // score, since there is no Context Fusion Engine yet. It's simply the
  // share of a user's sources Orbit currently has visibility into, so the
  // number is honest rather than invented. Replace once the CFE ships.
  const contextUnderstanding = totalSources === 0 ? 0 : Math.round((connectedSources / totalSources) * 100);

  return {
    connectedSources,
    dataPointsIndexed: activityCount + memoryCount,
    contextUnderstanding,
    automationsActive,
  };
}
