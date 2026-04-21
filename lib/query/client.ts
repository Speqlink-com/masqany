/**
 * TanStack Query client — centralized, mobile-optimized configuration.
 *
 * Design decisions:
 * - staleTime 5 min: avoids redundant refetches on mobile where data rarely
 *   changes between brief navigation events.
 * - gcTime 10 min: keeps cached data in memory longer to survive tab switches.
 * - retry 2: enough resilience for Kenya's intermittent connectivity without
 *   hammering a slow connection.
 * - refetchOnWindowFocus false: mobile apps don't have "window focus" in the
 *   browser sense; this prevents spurious refetches on app foreground.
 * - networkMode 'offlineFirst': allows queries to run from cache when offline
 *   rather than immediately erroring.
 */

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,        // 5 minutes
      gcTime: 1000 * 60 * 10,          // 10 minutes
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      networkMode: "offlineFirst",
    },
    mutations: {
      retry: 1,
      networkMode: "offlineFirst",
    },
  },
});
