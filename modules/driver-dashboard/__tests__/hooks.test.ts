/**
 * Driver Dashboard Module - Hooks Tests
 * 
 * Tests for TanStack Query hooks including mutation hooks.
 */

import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
});
