import { apiFetch } from "@/lib/apiClient";
import type { Automation } from "../types";

/** Real implementation of GET /automations and PATCH /automations/:id. */

export async function getAutomations(): Promise<Automation[]> {
  return apiFetch<Automation[]>("/automations");
}

export async function setAutomationEnabled(id: string, enabled: boolean): Promise<Automation> {
  return apiFetch<Automation>(`/automations/${id}`, {
    method: "PATCH",
    body: { enabled },
  });
}
