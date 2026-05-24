/**
 * Driver Dashboard Module - Type Definitions
 * 
 * All TypeScript interfaces and types for the driver dashboard module.
 */

// ============================================================================
// Core Domain Models
// ============================================================================

export interface DriverProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePhotoUrl: string;
  isVerified: boolean;
  excellenceRating: number; // 0-5
  currentLocation: string;
  vehicleId?: string;
  licenseNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface DriverMetrics {
  totalTrips: number;
  weeklyIncome: number; // in KES
  totalClients: number;
  totalDistanceKm: number;
  lastUpdated: string;
}

export type MoveStatus = 'accepted' | 'in_progress' | 'completed';

export interface ActiveMove {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  houseType: string;
  pickupLocation: string;
  destinationLocation: string;
  scheduledStartTime: string; // ISO 8601
  status: MoveStatus;
  isUrgent: boolean;
  minutesUntilStart?: number;
  serviceCost: number;
  createdAt: string;
}

export type MoveRequestStatus = 'available' | 'accepted' | 'rejected';

export interface MoveRequest {
  id: string;
  clientId: string;
  clientName: string;
  unitType: string; // e.g., "2 Bedroom", "Studio"
  serviceCost: number; // in KES
  pickupLocation: string;
  destinationLocation: string;
  timeAllocated: number; // in hours
  scheduledDate: string; // ISO 8601 date
  scheduledTime: string; // HH:mm format
  status: MoveRequestStatus;
  createdAt: string;
}

export interface DashboardData {
  profile: DriverProfile;
  metrics: DriverMetrics;
  activeMoves: ActiveMove[];
  upcomingMoves: MoveRequest[];
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
  };
}

// ============================================================================
// Mutation Payloads
// ============================================================================

export interface AcceptMovePayload {
  moveRequestId: string;
  driverId: string;
  acceptedAt: string;
}

export interface RejectMovePayload {
  moveRequestId: string;
  driverId: string;
  rejectionReason?: string;
}

export interface StartMovePayload {
  activeMoveId: string;
  driverId: string;
  startedAt: string;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
}

// ============================================================================
// UI State Types
// ============================================================================

export interface DriverDashboardUIState {
  isRefreshing: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
  optimisticUpdates: Map<string, MoveRequest>;
}
