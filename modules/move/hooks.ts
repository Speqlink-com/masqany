/**
 * Move Module - TanStack Query Hooks
 * Public API for data fetching with proper cache strategies
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { moveApi } from "./api"
import type { Coordinates, CreateMovePayload, VehicleType } from "./types"

// ============================================================================
// Query Keys
// ============================================================================

export const moveKeys = {
  all: ["moves"] as const,

  // Vehicle availability
  vehicles: () => [...moveKeys.all, "vehicles"] as const,
  availableVehicles: (location: Coordinates, type?: VehicleType) =>
    [...moveKeys.vehicles(), "available", location, type] as const,

  // Routes
  routes: () => [...moveKeys.all, "routes"] as const,
  route: (origin: Coordinates, destination: Coordinates) =>
    [...moveKeys.routes(), origin, destination] as const,
  propertyRoute: (propertyId: string, userLocation: Coordinates) =>
    [...moveKeys.routes(), "property", propertyId, userLocation] as const,

  // Bookings
  bookings: () => [...moveKeys.all, "bookings"] as const,
  myBookings: () => [...moveKeys.bookings(), "mine"] as const,
  booking: (id: string) => [...moveKeys.bookings(), id] as const,

  // Price estimates
  estimates: () => [...moveKeys.all, "estimates"] as const,
}

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Get available vehicles near a location
 * Auto-refreshes every 30 seconds for real-time availability
 */
export function useAvailableVehicles(
  location: Coordinates | null,
  vehicleType?: VehicleType
) {
  return useQuery({
    queryKey: moveKeys.availableVehicles(location!, vehicleType),
    queryFn: () => moveApi.getAvailableVehicles({ location: location!, vehicleType }),
    enabled: !!location,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Auto-refetch every 30s
  })
}

/**
 * Calculate route between two points
 * Cached for 5 minutes, stored for 24 hours for offline support
 * Also saves to AsyncStorage for offline access
 */
export function useRoute(origin: Coordinates | null, destination: Coordinates | null) {
  return useQuery({
    queryKey: moveKeys.route(origin!, destination!),
    queryFn: async () => {
      // Try to get from offline cache first
      if (origin && destination) {
        const cachedRoute = await findRoute(origin, destination)
        if (cachedRoute) {
          console.log("Using cached route from AsyncStorage")
          return cachedRoute
        }
      }

      // Fetch from API
      const route = await moveApi.calculateRoute({ origin: origin!, destination: destination! })

      // Save to offline cache
      if (route) {
        await saveRoute(route)
      }

      return route
    },
    enabled: !!origin && !!destination,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24 hours for offline (formerly cacheTime)
  })
}

/**
 * Get route from user location to a property
 * Used for "View on Map" feature from property listings
 */
export function usePropertyRoute(propertyId: string | null, userLocation: Coordinates | null) {
  return useQuery({
    queryKey: moveKeys.propertyRoute(propertyId!, userLocation!),
    queryFn: () => moveApi.getPropertyRoute(propertyId!, userLocation!),
    enabled: !!propertyId && !!userLocation,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Get current user's move bookings
 */
export function useMyBookings() {
  return useQuery({
    queryKey: moveKeys.myBookings(),
    queryFn: moveApi.getMyBookings,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Get a specific booking by ID
 */
export function useBooking(id: string | null) {
  return useQuery({
    queryKey: moveKeys.booking(id!),
    queryFn: () => moveApi.getBookingById(id!),
    enabled: !!id,
    staleTime: 30 * 1000, // 30 seconds
  })
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Estimate price for a move
 */
export function usePriceEstimate() {
  return useMutation({
    mutationFn: moveApi.estimatePrice,
  })
}

/**
 * Create a new move booking
 * Invalidates bookings list on success
 */
export function useCreateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateMovePayload) => moveApi.createBooking(payload),
    onSuccess: (newBooking) => {
      // Invalidate bookings list
      queryClient.invalidateQueries({ queryKey: moveKeys.myBookings() })

      // Optimistically add to cache
      queryClient.setQueryData(moveKeys.booking(newBooking.id), newBooking)
    },
  })
}

/**
 * Cancel a booking
 * Invalidates relevant queries on success
 */
export function useCancelBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => moveApi.cancelBooking(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: moveKeys.myBookings() })
      queryClient.invalidateQueries({ queryKey: moveKeys.booking(id) })
    },
  })
}
