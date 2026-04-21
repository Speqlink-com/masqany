/**
 * Offline handling — PLACEHOLDER.
 *
 * Strategy for Masqany given Kenya's network conditions:
 *
 * 1. TanStack Query's `networkMode: "offlineFirst"` already serves cached
 *    data when offline — this is the first line of defense.
 *
 * 2. For write operations (bookings, messages) that fail offline, we will
 *    implement a mutation queue using AsyncStorage that replays on reconnect.
 *
 * 3. NetInfo (@react-native-community/netinfo) will be used to:
 *    - Show a non-intrusive offline banner
 *    - Pause non-critical background refetches
 *    - Trigger cache revalidation on reconnect
 *
 * 4. Critical read data (saved properties, active bookings) will be
 *    persisted to AsyncStorage via @tanstack/query-async-storage-persister
 *    so the app is usable without any network.
 *
 * TODO: implement when core features are stable.
 */

export const offlineManager = {
  init: () => {
    // TODO: set up NetInfo listener and mutation queue
    console.warn("[offlineManager] Offline handling not yet implemented");
  },
};
