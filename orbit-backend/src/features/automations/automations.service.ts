import { Automation } from "../../models/Automation.js";
import { ApiError } from "../../utils/ApiError.js";
import type { BrandKey } from "../../types/index.js";

export interface AutomationResponse {
  id: string; // the stable slug, matching what the frontend calls "id"
  name: string;
  description: string;
  brand: BrandKey;
  enabled: boolean;
  frequency: string;
  lastRun?: string;
}

function toResponse(doc: {
  slug: string;
  name: string;
  description: string;
  brand: string;
  enabled: boolean;
  frequency: string;
  lastRun?: Date | null;
}): AutomationResponse {
  return {
    id: doc.slug,
    name: doc.name,
    description: doc.description,
    brand: doc.brand as BrandKey,
    enabled: doc.enabled,
    frequency: doc.frequency,
    lastRun: doc.lastRun?.toISOString(),
  };
}

export async function listAutomations(userId: string): Promise<AutomationResponse[]> {
  const docs = await Automation.find({ userId }).sort({ name: 1 });
  return docs.map(toResponse);
}

export async function setAutomationEnabled(
  userId: string,
  slug: string,
  enabled: boolean
): Promise<AutomationResponse> {
  const doc = await Automation.findOne({ userId, slug });
  if (!doc) {
    throw ApiError.notFound(`Unknown automation: ${slug}`);
  }

  doc.enabled = enabled;
  if (enabled) doc.lastRun = new Date();
  await doc.save();

  return toResponse(doc);
}
