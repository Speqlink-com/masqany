/**
 * Mock Data for Move Module
 * Used for development and testing
 */

import type { AvailableVehicle, Location, MoveBooking, Route } from "@/modules/move/types"

export const mockAvailableVehicles: AvailableVehicle[] = [
  {
    id: "av_1",
    vehicleId: "veh_1",
    driverId: "drv_1",
    type: "pickup",
    currentLocation: { latitude: -1.2921, longitude: 36.8219 },
    estimatedArrival: 8,
    distance: 2.3,
    price: 1500,
    currency: "KES",
  },
  {
    id: "av_2",
    vehicleId: "veh_2",
    driverId: "drv_2",
    type: "mini_truck",
    currentLocation: { latitude: -1.285, longitude: 36.82 },
    estimatedArrival: 12,
    distance: 3.5,
    price: 2500,
    currency: "KES",
  },
  {
    id: "av_3",
    vehicleId: "veh_3",
    driverId: "drv_3",
    type: "truck",
    currentLocation: { latitude: -1.29, longitude: 36.825 },
    estimatedArrival: 15,
    distance: 4.1,
    price: 3500,
    currency: "KES",
  },
]

export const mockSuggestedLocations: Location[] = [
  {
    id: "loc_1",
    name: "Westlands",
    address: "Westlands, Nairobi",
    coordinates: { latitude: -1.2676, longitude: 36.8108 },
    type: "custom",
  },
  {
    id: "loc_2",
    name: "Karen",
    address: "Karen, Nairobi",
    coordinates: { latitude: -1.3197, longitude: 36.7078 },
    type: "custom",
  },
  {
    id: "loc_3",
    name: "Kilimani",
    address: "Kilimani, Nairobi",
    coordinates: { latitude: -1.2921, longitude: 36.7878 },
    type: "custom",
  },
  {
    id: "loc_4",
    name: "Lavington",
    address: "Lavington, Nairobi",
    coordinates: { latitude: -1.2833, longitude: 36.7667 },
    type: "custom",
  },
  {
    id: "loc_5",
    name: "Parklands",
    address: "Parklands, Nairobi",
    coordinates: { latitude: -1.2667, longitude: 36.8333 },
    type: "custom",
  },
]

export const mockRoute: Route = {
  id: "route_1",
  origin: { latitude: -1.2921, longitude: 36.8219 },
  destination: { latitude: -1.2864, longitude: 36.8172 },
  geometry: {
    type: "LineString",
    coordinates: [
      [36.8219, -1.2921],
      [36.8195, -1.2893],
      [36.8172, -1.2864],
    ],
  },
  distance: 5.2,
  duration: 12,
  distanceMarkers: [
    { coordinate: [36.8195, -1.2893], distance: 1.0 },
    { coordinate: [36.8183, -1.2878], distance: 2.0 },
    { coordinate: [36.8172, -1.2864], distance: 3.0 },
  ],
}

export const mockBooking: MoveBooking = {
  id: "move_1",
  userId: "user_1",
  vehicleId: "veh_1",
  driverId: "drv_1",
  pickupLocation: {
    name: "Westlands",
    address: "Westlands, Nairobi",
    coordinates: { latitude: -1.2921, longitude: 36.8219 },
    type: "custom",
  },
  dropoffLocation: {
    name: "Karen",
    address: "Karen, Nairobi",
    coordinates: { latitude: -1.2864, longitude: 36.8172 },
    type: "custom",
  },
  vehicleType: "pickup",
  scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  estimatedPrice: 1500,
  currency: "KES",
  status: "pending",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}
