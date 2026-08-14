import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSources, updateSource } from "../api/sourcesApi";
import type { SourceId, SourceStatus } from "@/types";

export const sourcesQueryKey = ["sources"] as const;

export function useSources() {
  return useQuery({
    queryKey: sourcesQueryKey,
    queryFn: getSources,
  });
}

export function useUpdateSource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: SourceId; status: SourceStatus }) => updateSource(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sourcesQueryKey });
    },
  });
}
