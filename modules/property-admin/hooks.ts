// Property Admin Module - TanStack Query Hooks
// This file contains all TanStack Query hooks for the property admin module

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { propertyAdminApi } from './api';
import type { UpdateUnitStatusRequest } from './types';

// ---------------------------------------------------------------------------
// Query Keys
// ---------------------------------------------------------------------------
// Following the hierarchical pattern: ['property-admin', resource, ...params]
// This structure enables efficient cache invalidation and query management
export const propertyAdminKeys = {
  all: ['property-admin'] as const,
  properties: () => [...propertyAdminKeys.all, 'properties'] as const,
  propertiesList: (filters: any) => [...propertyAdminKeys.properties(), 'list', filters] as const,
  property: (id: string) => [...propertyAdminKeys.properties(), id] as const,
  propertyUnits: (id: string) => [...propertyAdminKeys.property(id), 'units'] as const,
  analytics: () => [...propertyAdminKeys.all, 'analytics'] as const,
  analyticsPeriod: (period: string) => [...propertyAdminKeys.analytics(), period] as const,
  agents: () => [...propertyAdminKeys.all, 'agents'] as const,
};

// ---------------------------------------------------------------------------
// Query Hooks
// ---------------------------------------------------------------------------

/**
 * Properties Query Hook
 * Fetches all properties with pagination, filtering, and sorting support
 * 
 * @param params - Query parameters
 * @param params.page - Page number (default: 1)
 * @param params.pageSize - Number of items per page (default: 10)
 * @param params.filter - Optional filter string
 * @param params.sort - Optional sort field
 * @param params.enabled - Optional flag to enable/disable query (default: true)
 * @returns TanStack Query result with properties data
 */
export function useProperties(params: {
  page?: number;
  pageSize?: number;
  filter?: string;
  sort?: string;
  enabled?: boolean;
} = {}) {
  return useQuery({
    queryKey: propertyAdminKeys.propertiesList(params),
    queryFn: () =>
      propertyAdminApi.getProperties({
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        filter: params.filter,
        sort: params.sort,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    enabled: params.enabled !== false,
  });
}

/**
 * Single Property Query Hook
 * Fetches a single property by ID
 * 
 * @param propertyId - Property ID
 * @param options - Query options
 * @param options.enabled - Optional flag to enable/disable query (default: true if propertyId exists)
 * @returns TanStack Query result with property data
 */
export function useProperty(
  propertyId: string,
  options: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: propertyAdminKeys.property(propertyId),
    queryFn: () => propertyAdminApi.getProperty(propertyId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    enabled: options.enabled !== false && !!propertyId,
  });
}

/**
 * Property Units Query Hook
 * Fetches all units for a specific property
 * 
 * @param propertyId - Property ID
 * @param options - Query options
 * @param options.enabled - Optional flag to enable/disable query (default: true if propertyId exists)
 * @returns TanStack Query result with units data
 */
export function usePropertyUnits(
  propertyId: string,
  options: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: propertyAdminKeys.propertyUnits(propertyId),
    queryFn: () => propertyAdminApi.getPropertyUnits(propertyId),
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent for unit status)
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    enabled: options.enabled !== false && !!propertyId,
  });
}

/**
 * Analytics Query Hook
 * Fetches analytics data for specified period
 * 
 * @param period - Time period ('daily' | 'weekly' | 'monthly' | 'yearly')
 * @param options - Query options
 * @param options.enabled - Optional flag to enable/disable query (default: true)
 * @returns TanStack Query result with analytics data
 */
export function useAnalytics(
  period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly',
  options: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: propertyAdminKeys.analyticsPeriod(period),
    queryFn: () => propertyAdminApi.getAnalytics({ period }),
    staleTime: 1 * 60 * 1000, // 1 minute (fresher data for analytics)
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    enabled: options.enabled !== false,
  });
}

/**
 * Agents Query Hook
 * Fetches all agents
 * 
 * @param options - Query options
 * @param options.enabled - Optional flag to enable/disable query (default: true)
 * @returns TanStack Query result with agents data
 */
export function useAgents(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: propertyAdminKeys.agents(),
    queryFn: () => propertyAdminApi.getAgents(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    enabled: options.enabled !== false,
  });
}

// ---------------------------------------------------------------------------
// Mutation Hooks
// ---------------------------------------------------------------------------

/**
 * Update Unit Status Mutation Hook
 * Updates a unit's status with optimistic updates
 * 
 * Features:
 * - Optimistic update: UI updates immediately before server confirmation
 * - Error revert: Reverts to previous state if update fails
 * - Cache invalidation: Refreshes related queries on success
 * - Property count recalculation: Updates occupancy metrics optimistically
 * 
 * @returns TanStack Query mutation result
 */
export function useUpdateUnitStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUnitStatusRequest) =>
      propertyAdminApi.updateUnitStatus(data),

    // Optimistic update: update UI before server confirmation
    onMutate: async (variables) => {
      // Find the property ID for this unit by searching all cached unit queries
      let propertyId: string | null = null;

      // Search through all property units queries to find the unit
      const queryCache = queryClient.getQueryCache();
      const allQueries = queryCache.getAll();

      for (const query of allQueries) {
        const queryKey = query.queryKey;
        // Check if this is a propertyUnits query
        if (
          queryKey[0] === 'property-admin' &&
          queryKey[1] === 'properties' &&
          queryKey.length >= 3 &&
          queryKey[queryKey.length - 1] === 'units'
        ) {
          const data = query.state.data as any;
          if (data?.units) {
            const unit = data.units.find((u: any) => u.id === variables.unitId);
            if (unit) {
              // Extract property ID from query key
              propertyId = queryKey[2] as string;
              break;
            }
          }
        }
      }

      if (!propertyId) {
        // If we can't find the property ID, skip optimistic update
        return { previousUnits: null, propertyId: null };
      }

      // Cancel outgoing refetches for this property's units
      await queryClient.cancelQueries({
        queryKey: propertyAdminKeys.propertyUnits(propertyId),
      });

      // Snapshot previous value
      const previousUnits = queryClient.getQueryData(
        propertyAdminKeys.propertyUnits(propertyId)
      );

      // Optimistically update UI with recalculated property counts
      queryClient.setQueryData(
        propertyAdminKeys.propertyUnits(propertyId),
        (old: any) => {
          if (!old) return old;

          // Update the unit status
          const updatedUnits = old.units.map((unit: any) =>
            unit.id === variables.unitId
              ? {
                  ...unit,
                  status: variables.newStatus,
                  lastUpdated: new Date().toISOString(),
                  updatedBy: variables.updatedBy,
                }
              : unit
          );

          // Recalculate property counts based on new unit statuses
          const occupiedCount = updatedUnits.filter(
            (u: any) => u.status === 'occupied'
          ).length;
          const vacantCount = updatedUnits.filter(
            (u: any) => u.status === 'vacant' || u.status === 'vacant_soon'
          ).length;
          const occupancyRate =
            old.property.totalUnits > 0
              ? (occupiedCount / old.property.totalUnits) * 100
              : 0;

          // Calculate monthly rentals (sum of occupied unit prices)
          const monthlyRentals = updatedUnits
            .filter((u: any) => u.status === 'occupied')
            .reduce((sum: number, u: any) => sum + u.price, 0);

          return {
            units: updatedUnits,
            property: {
              ...old.property,
              occupiedUnits: occupiedCount,
              vacantUnits: vacantCount,
              occupancyRate,
              monthlyRentals,
              updatedAt: new Date().toISOString(),
            },
          };
        }
      );

      return { previousUnits, propertyId };
    },

    // Revert optimistic update on error
    onError: (err, variables, context: any) => {
      if (context?.previousUnits && context?.propertyId) {
        // Restore the previous state
        queryClient.setQueryData(
          propertyAdminKeys.propertyUnits(context.propertyId),
          context.previousUnits
        );
      }
    },

    // Invalidate and refetch on success
    onSuccess: (data) => {
      // Invalidate property units query
      queryClient.invalidateQueries({
        queryKey: propertyAdminKeys.propertyUnits(data.unit.propertyId),
      });

      // Invalidate property query (counts changed)
      queryClient.invalidateQueries({
        queryKey: propertyAdminKeys.property(data.unit.propertyId),
      });

      // Invalidate analytics query (overall stats changed)
      queryClient.invalidateQueries({
        queryKey: propertyAdminKeys.analytics(),
      });

      // Invalidate properties list (property counts changed)
      queryClient.invalidateQueries({
        queryKey: propertyAdminKeys.properties(),
      });
    },
  });
}

/**
 * Create Property Mutation Hook
 * Creates a new property
 * 
 * @returns TanStack Query mutation result
 */
export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => propertyAdminApi.createProperty(data),
    onSuccess: () => {
      // Invalidate properties list
      queryClient.invalidateQueries({
        queryKey: propertyAdminKeys.properties(),
      });

      // Invalidate analytics (new property affects stats)
      queryClient.invalidateQueries({
        queryKey: propertyAdminKeys.analytics(),
      });
    },
  });
}

/**
 * Archive Property Mutation Hook
 * Archives a property
 * 
 * @returns TanStack Query mutation result
 */
export function useArchiveProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyId: string) =>
      propertyAdminApi.archiveProperty(propertyId),
    onSuccess: () => {
      // Invalidate properties list
      queryClient.invalidateQueries({
        queryKey: propertyAdminKeys.properties(),
      });

      // Invalidate analytics (archived property affects stats)
      queryClient.invalidateQueries({
        queryKey: propertyAdminKeys.analytics(),
      });
    },
  });
}

/**
 * Hire Agent Mutation Hook
 * Hires a new agent
 * 
 * @returns TanStack Query mutation result
 */
export function useHireAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => propertyAdminApi.hireAgent(data),
    onSuccess: () => {
      // Invalidate agents list
      queryClient.invalidateQueries({
        queryKey: propertyAdminKeys.agents(),
      });
    },
  });
}

