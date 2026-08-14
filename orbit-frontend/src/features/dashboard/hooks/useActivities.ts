import { useQuery } from "@tanstack/react-query";
import { getActivities } from "../api/dashboardApi";

export function useActivities() {
  return useQuery({
    queryKey: ["activities"],
    queryFn: getActivities,
  });
}
