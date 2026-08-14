import { z } from "zod";

export const updateSourceSchema = z.object({
  status: z.enum(["connected", "disconnected", "error", "syncing"]),
});

export type UpdateSourceInput = z.infer<typeof updateSourceSchema>;
