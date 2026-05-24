/**
 * Driver Dashboard Module - Zustand Store
 * 
 * Manages UI state for the driver dashboard.
 * Server state is managed by TanStack Query in hooks.ts.
 */

import { create } from 'zustand';
import type { MoveRequest } from './types';

interface DriverDashboardStore {
  // State
  isRefreshing: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
  optimisticUpdates: Map<string, MoveRequest>;

  // Actions
  setRefreshing: (isRefreshing: boolean) => void;
  setConnectionStatus: (status: 'connected' | 'disconnected' | 'reconnecting') => void;
  addOptimisticUpdate: (moveRequestId: string, moveRequest: MoveRequest) => void;
  removeOptimisticUpdate: (moveRequestId: string) => void;
  clearOptimisticUpdates: () => void;
}

export const useDriverDashboardStore = create<DriverDashboardStore>((set) => ({
  // Initial state
  isRefreshing: false,
  connectionStatus: 'connected',
  optimisticUpdates: new Map(),

  // Actions
  setRefreshing: (isRefreshing) => set({ isRefreshing }),

  setConnectionStatus: (status) => set({ connectionStatus: status }),

  addOptimisticUpdate: (moveRequestId, moveRequest) =>
    set((state) => {
      const newUpdates = new Map(state.optimisticUpdates);
      newUpdates.set(moveRequestId, moveRequest);
      return { optimisticUpdates: newUpdates };
    }),

  removeOptimisticUpdate: (moveRequestId) =>
    set((state) => {
      const newUpdates = new Map(state.optimisticUpdates);
      newUpdates.delete(moveRequestId);
      return { optimisticUpdates: newUpdates };
    }),

  clearOptimisticUpdates: () => set({ optimisticUpdates: new Map() }),
}));

// Selectors for performance optimization
export const selectIsRefreshing = (state: DriverDashboardStore) => state.isRefreshing;
export const selectConnectionStatus = (state: DriverDashboardStore) => state.connectionStatus;
export const selectOptimisticUpdates = (state: DriverDashboardStore) => state.optimisticUpdates;
