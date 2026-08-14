import type { BrandKey } from "@/components/common/BrandIcon";

export interface MemoryItem {
  id: string;
  title: string;
  description: string;
  brand: BrandKey;
  date: string; // ISO date, used for day grouping
  time: string; // display time, e.g. "9:41 AM"
}
