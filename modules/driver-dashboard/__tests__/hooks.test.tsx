/**
 * Driver Dashboard Module - Hooks Tests
 * 
 * Tests for TanStack Query hooks including mutation hooks.
 */

import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type React from 'react';
import { useAcceptMove, useRejectMove, useStartMove } from '../hooks';
import type { AcceptMovePayload, RejectMovePayload, StartMovePayload } from '../types';

// Create a wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Driver Dashboard Mutation Hooks', () => {
  describe('useAcceptMove', () => {
    it('should be defined and return mutation object', () => {
      const { result } = renderHook(() => useAcceptMove(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
      expect(result.current.isIdle).toBe(true);
    });

    it('should have correct mutation properties', () => {
      const { result } = renderHook(() => useAcceptMove(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(false);
    });
  });

  describe('useRejectMove', () => {
    it('should be defined and return mutation object', () => {
      const { result } = renderHook(() => useRejectMove(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
      expect(result.current.isIdle).toBe(true);
    });

    it('should have correct mutation properties', () => {
      const { result } = renderHook(() => useRejectMove(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(false);
    });
  });

  describe('useStartMove', () => {
    it('should be defined and return mutation object', () => {
      const { result } = renderHook(() => useStartMove(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
      expect(result.current.isIdle).toBe(true);
    });

    it('should have correct mutation properties', () => {
      const { result } = renderHook(() => useStartMove(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(false);
    });
  });

  describe('Mutation Hook Types', () => {
    it('useAcceptMove should accept AcceptMovePayload', () => {
      const { result } = renderHook(() => useAcceptMove(), {
        wrapper: createWrapper(),
      });

      const payload: AcceptMovePayload = {
        moveRequestId: 'test-move-123',
        driverId: 'driver-456',
        acceptedAt: new Date().toISOString(),
      };

      // This should compile without errors
      expect(() => result.current.mutate(payload)).not.toThrow();
    });

    it('useRejectMove should accept RejectMovePayload', () => {
      const { result } = renderHook(() => useRejectMove(), {
        wrapper: createWrapper(),
      });

      const payload: RejectMovePayload = {
        moveRequestId: 'test-move-123',
        driverId: 'driver-456',
        rejectionReason: 'Not available',
      };

      // This should compile without errors
      expect(() => result.current.mutate(payload)).not.toThrow();
    });

    it('useStartMove should accept StartMovePayload', () => {
      const { result } = renderHook(() => useStartMove(), {
        wrapper: createWrapper(),
      });

      const payload: StartMovePayload = {
        activeMoveId: 'active-move-789',
        driverId: 'driver-456',
        startedAt: new Date().toISOString(),
        currentLocation: {
          latitude: -1.286389,
          longitude: 36.817223,
        },
      };

      // This should compile without errors
      expect(() => result.current.mutate(payload)).not.toThrow();
    });
  });
});
