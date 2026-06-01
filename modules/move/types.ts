/**
 * Move Module - TypeScript Type Definitions
 * Enterprise-grade Map & Moving Service types
 */

// ============================================================================
// Vehicle Types
// ============================================================================

export type VehicleType = "pickup" | "mini_truck" | "truck"

export interface Vehicle {
  id: string
  type: VehicleType
  licensePlate: string
  capacity: {
    weight: number // kg
    volume: number // cubic meters
  }
  status: "available" | "busy" | "offline"
}

export interface AvailableVehicle {
  id: string
  vehicleId: string
  driverId: string
  type: VehicleType
  currentLocation: Coordinates
  estimatedArrival: number // minutes
  distance: number // kilometers
  price: number
  currency: string
}

// ============================================================================
// Location Types
// ============================================================================

export interface Coordinates {
  longitude: number
  latitude: number
}

export interface Location {
  id?: string
  name: string
  address: string
  coordinates: Coordinates
  type: "property" | "custom" | "saved"
}

// ============================================================================
// Route Types
// ============================================================================

export interface RouteGeometry {
  type: "LineString"
  coordinates: [number, number][] // [longitude, latitude]
}

export interface DistanceMarker {
  coordinate: [number, number]
  distance: number // kilometers from origin
}

export interface Route {
  id: string
  origin: Coordinates
  destination: Coordinates
  geometry: RouteGeometry
  distance: number // kilometers
  duration: number // minutes
  distanceMarkers: DistanceMarker[]
  cachedAt?: string // ISO timestamp for offline routes
}

// ============================================================================
// Booking Types
// ============================================================================

export type MoveStatus =
  | "pending" // Awaiting payment
  | "confirmed" // Payment successful, driver assigned
  | "in_transit" // Driver en route or moving items
  | "completed" // Move finished
  | "cancelled" // User or system cancelled

export interface MoveBooking {
  id: string
  userId: string
  vehicleId: string
  driverId?: string
  pickupLocation: Location
  dropoffLocation: Location
  vehicleType: VehicleType
  scheduledAt: string // ISO timestamp
  estimatedPrice: number
  finalPrice?: number
  currency: string
  status: MoveStatus
  paymentId?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

// ============================================================================
// Request/Response Payloads
// ============================================================================

export interface CreateMovePayload {
  pickupLocation: Location
  dropoffLocation: Location
  vehicleType: VehicleType
  scheduledAt: string // ISO timestamp (min: now + 2 hours, max: now + 30 days)
  notes?: string
}

export interface VehicleAvailabilityRequest {
  location: Coordinates
  vehicleType?: VehicleType // Optional filter
  radius?: number // Search radius in km (default: 10)
}

export interface RouteRequest {
  origin: Coordinates
  destination: Coordinates
  profile?: "driving" | "walking" // Default: driving
}

export interface PriceEstimateRequest {
  pickupLocation: Coordinates
  dropoffLocation: Coordinates
  vehicleType: VehicleType
}

export interface PriceEstimateResponse {
  basePrice: number
  distancePrice: number
  totalPrice: number
  currency: string
  breakdown: {
    baseFee: number
    perKmRate: number
    distance: number
  }
}

// ============================================================================
// Payment Types
// ============================================================================

export type PaymentMethod = "mpesa" | "card"
export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "timeout"

export interface PaymentRequest {
  bookingId: string
  amount: number
  currency: string
  method: PaymentMethod
  phoneNumber?: string // Required for M-Pesa
  cardToken?: string // Required for card payment
}

export interface PaymentResponse {
  id: string
  bookingId: string
  status: PaymentStatus
  transactionId?: string
  message?: string
  createdAt: string
}

// ============================================================================
// UI State (Zustand Store)
// ============================================================================

export interface MoveUIState {
  // Destination modal
  isDestinationModalVisible: boolean
  selectedDestination: Location | null
  selectedVehicleType: VehicleType | null

  // Vehicle selection
  selectedVehicle: AvailableVehicle | null

  // Bottom sheet
  sheetPosition: 0.2 | 0.5 | 0.8

  // Map viewport
  mapRegion: {
    latitude: number
    longitude: number
    zoom: number
  }

  // Actions
  openDestinationModal: () => void
  closeDestinationModal: () => void
  setDestination: (location: Location, vehicleType: VehicleType) => void
  selectVehicle: (vehicle: AvailableVehicle | null) => void
  setSheetPosition: (position: 0.2 | 0.5 | 0.8) => void
  setMapRegion: (region: MoveUIState["mapRegion"]) => void
  reset: () => void
}
