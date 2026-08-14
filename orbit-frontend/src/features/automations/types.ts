import type { BrandKey } from "@/components/common/BrandIcon";

export interface Automation {
  id: string;
  name: string;
  description: string;
  brand: BrandKey;
  enabled: boolean;
  frequency: string;
  lastRun?: string;
}
