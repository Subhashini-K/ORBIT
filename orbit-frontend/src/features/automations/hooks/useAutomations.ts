import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAutomations, setAutomationEnabled } from "../api/automationsApi";

export const automationsQueryKey = ["automations"] as const;

export function useAutomations() {
  return useQuery({
    queryKey: automationsQueryKey,
    queryFn: getAutomations,
  });
}

export function useToggleAutomation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) => setAutomationEnabled(id, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationsQueryKey });
    },
  });
}
