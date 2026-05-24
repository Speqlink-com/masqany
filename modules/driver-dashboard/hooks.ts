/**
 * Driver Dashboard Module - TanStack Query Hooks
 * 
 * All data fetching and mutations for the driver dashboard.
 * Server state management layer.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { driverDashboardApi } from './api';
import { useDriverDashboardStore } from './store';
import type { AcceptMovePayload, RejectMovePayload, StartMovePayload } from './types';

// ============================================================================
// Query Keys
// ============================================================================

export const driverDashboardKeys = {
  all: ['driver-dashboard'] as const,
  dashboard: () => [...driverDashboardKeys.all, 'dashboard'] as const,
  profile: () => [...driverDashboardKeys.all, 'profile'] as const,
  metrics: () => [...driverDashboardKeys.all, 'metrics'] as const,
  activeMoves: () => [...driverDashboardKeys.all, 'active-moves'] as const,
  upcomingMoves: () => [...driverDashboardKeys.all, 'upcoming-moves'] as const,
};

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Fetch complete dashboard data
 */
export const useDriverDashboard = () => {
  return useQuery({
    queryKey: driverDashboardKeys.dashboard(),
    queryFn: async () => {
      const response = await driverDashboardApi.fetchDashboardData();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

/**
 * Fetch driver profile
 */
export const useDriverProfile = () => {
  return useQuery({
    queryKey: driverDashboardKeys.profile(),
    queryFn: async () => {
      const response = await driverDashboardApi.fetchDriverProfile();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Fetch driver metrics
 */
export const useDriverMetrics = () => {
  return useQuery({
    queryKey: driverDashboardKeys.metrics(),
    queryFn: async () => {
      const response = await driverDashboardApi.fetchDriverMetrics();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Fetch active moves (shorter staleTime for real-time feel)
 */
export const useActiveMoves = () => {
  return useQuery({
    queryKey: driverDashboardKeys.activeMoves(),
    queryFn: async () => {
      const response = await driverDashboardApi.fetchActiveMoves();
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 30 * 60 * 1000,
    retry: 2,
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

/**
 * Fetch upcoming move requests (shorter staleTime for real-time feel)
 */
export const useUpcomingMoves = () => {
  return useQuery({
    queryKey: driverDashboardKeys.upcomingMoves(),
    queryFn: async () => {
      const response = await driverDashboardApi.fetchUpcomingMoves();
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 30 * 60 * 1000,
    retry: 2,
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Accept a move request with optimistic updates
 */
export const useAcceptMove = () => {
  const queryClient = useQueryClient();
  const { addOptimisticUpdate, removeOptimisticUpdate } = useDriverDashboardStore();

  return useMutation({
    mutationFn: (payload: AcceptMovePayload) => driverDashboardApi.acceptMove(payload),
    
    onMutate: async (payload) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: driverDashboardKeys.upcomingMoves() });

      // Snapshot previous value
      const previousMoves = queryClient.getQueryData(driverDashboardKeys.upcomingMoves());

      // Optimistically update: remove from upcoming moves
      queryClient.setQueryData(driverDashboardKeys.upcomingMoves(), (old: any) => {
        if (!old) return old;
        return old.filter((move: any) => move.id !== payload.moveRequestId);
      });

      // Store in optimistic updates map
      const moveToAccept = (previousMoves as any)?.find((m: any) => m.id === payload.moveRequestId);
      if (moveToAccept) {
        addOptimisticUpdate(payload.moveRequestId, moveToAccept);
      }

      return { previousMoves };
    },

    onError: (error, payload, context) => {
      // Rollback on error
      if (context?.previousMoves) {
        queryClient.setQueryData(driverDashboardKeys.upcomingMoves(), context.previousMoves);
      }
      removeOptimisticUpdate(payload.moveRequestId);
    },

    onSuccess: (data, payload) => {
      // Remove from optimistic updates
      removeOptimisticUpdate(payload.moveRequestId);
      
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: driverDashboardKeys.upcomingMoves() });
      queryClient.invalidateQueries({ queryKey: driverDashboardKeys.activeMoves() });
      queryClient.invalidateQueries({ queryKey: driverDashboardKeys.dashboard() });
    },
  });
};

/**
 * Reject a move request with optimistic updates
 */
export const useRejectMove = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RejectMovePayload) => driverDashboardApi.rejectMove(payload),
    
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: driverDashboardKeys.upcomingMoves() });

      const previousMoves = queryClient.getQueryData(driverDashboardKeys.upcomingMoves());

      // Optimistically remove from list
      queryClient.setQueryData(driverDashboardKeys.upcomingMoves(), (old: any) => {
        if (!old) return old;
        return old.filter((move: any) => move.id !== payload.moveRequestId);
      });

      return { previousMoves };
    },

    onError: (error, payload, context) => {
      if (context?.previousMoves) {
        queryClient.setQueryData(driverDashboardKeys.upcomingMoves(), context.previousMoves);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: driverDashboardKeys.upcomingMoves() });
      queryClient.invalidateQueries({ queryKey: driverDashboardKeys.dashboard() });
    },
  });
};

/**
 * Start an active move
 */
export const useStartMove = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: StartMovePayload) => driverDashboardApi.startMove(payload),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: driverDashboardKeys.activeMoves() });
      queryClient.invalidateQueries({ queryKey: driverDashboardKeys.dashboard() });
    },
  });
};
