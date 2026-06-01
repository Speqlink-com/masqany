/**
 * Move Module - API Layer
 * Pure HTTP calls for vehicle availability, routes, bookings, and payments
 * No React dependencies - only pure functions
 */

import { apiClient } from "@/lib/api/client";
import type {
    AvailableVehicle,
    CreateMovePayload,
    MoveBooking,
    PriceEstimateRequest,
    PriceEstimateResponse,
    Route,
    RouteRequest,
    VehicleAvailabilityRequest,
} from "./types";

export const moveApi = {
  /**
   * Get available vehicles near a location
   */
  getAvailableVehicles: (params: VehicleAvailabilityRequest) =>
    apiClient
      .get<AvailableVehicle[]>("/moves/vehicles/available", { params })
      .then((r) => r.data),

  /**
   * Calculate route between two points
   */
  calculateRoute: (params: RouteRequest) =>
    apiClient.post<Route>("/moves/routes/calculate", params).then((r) => r.data),

  /**
   * Estimate price for a move
   */
  estimatePrice: (params: PriceEstimateRequest) =>
    apiClient.post<PriceEstimateResponse>("/moves/estimate", params).then((r) => r.data),

  /**
   * Create a new move booking
   */
  createBooking: (payload: CreateMovePayload) =>
    apiClient.post<MoveBooking>("/moves/bookings", payload).then((r) => r.data),

  /**
   * Get current user's bookings
   */
  getMyBookings: () =>
    apiClient.get<MoveBooking[]>("/moves/bookings/me").then((r) => r.data),

  /**
   * Get a specific booking by ID
   */
  getBookingById: (id: string) =>
    apiClient.get<MoveBooking>(`/moves/bookings/${id}`).then((r) => r.data),

  /**
   * Cancel a booking
   */
  cancelBooking: (id: string) =>
    apiClient.post(`/moves/bookings/${id}/cancel`).then((r) => r.data),

  /**
   * Get route from user location to a property
   */
  getPropertyRoute: (propertyId: string, userLocation: { latitude: number; longitude: number }) =>
    apiClient
      .post<Route>("/moves/routes/property", {
        propertyId,
        origin: userLocation,
      })
      .then((r) => r.data),
}
