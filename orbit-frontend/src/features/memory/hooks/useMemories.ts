import { useQuery } from "@tanstack/react-query";
import { getMemories } from "../api/memoryApi";

export function useMemories() {
  return useQuery({
    queryKey: ["memories"],
    queryFn: getMemories,
  });
}
