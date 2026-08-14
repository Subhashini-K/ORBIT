import { z } from "zod";

export const updateAutomationSchema = z.object({
  enabled: z.boolean(),
});

export type UpdateAutomationInput = z.infer<typeof updateAutomationSchema>;
