import { useQuery } from "@tanstack/react-query";
import { getInsights } from "../api/insightsApi";

export function useInsights() {
  return useQuery({
    queryKey: ["insights"],
    queryFn: getInsights,
  });
}
