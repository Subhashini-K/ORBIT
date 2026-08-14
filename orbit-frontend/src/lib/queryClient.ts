import { QueryClient } from "@tanstack/react-query";

/**
 * Single shared TanStack Query client for the app.
 * Tuned for a mock-backend phase: short retry, no refetch-on-focus thrashing.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
    mutations: {
      retry: 0,
    },
  },
});
