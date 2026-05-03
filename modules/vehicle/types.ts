/**
 * Vehicle Management Module - Type Definitions
 * 
 * This file contains all TypeScript interfaces and types for the vehicle management feature.
 * Follows the Masqany architecture with strict type safety.
 */

// ============================================================================
// Enums and Union Types
// ============================================================================

export type VehicleType = "truck" | "mini_truck" | "pickup";

export type VehicleStatus = 
  | "available" 
  | "unavailable" 
  | "in_service" 
  | "under_maintenance";

export type VerificationStatus = 
  | "pending_verification" 
  | "verified" 
  | "rejected";

export type DocumentType = 
  | "insurance" 
  | "driving_license" 
  | "inspection_certificate";

export type PaymentMethod = "mpesa" | "bank_transfer" | "cash";

export type EventType =
  | "created" 
  | "verified" 
  | "rejected" 
  | "status_changed" 
  | "document_updated" 
  | "assignment_completed"
  | "set_active"
  | "set_inactive";

// ============================================================================
// Core Vehicle Interfaces
// ============================================================================

export interface Vehicle {
  id: string;
  driverId: string;
  driverName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  phone: string;
  email: string;
  vehicleType: VehicleType;
  plateNumber: string;
  capacity: number;
  capacityUnit: "kg" | "cubic_meters";
  nationalId: string;
  documents: {
    insurance: VehicleDocument;
    drivingLicense: VehicleDocument;
    inspectionCertificate?: VehicleDocument;
  };
  photos: string[]; // Array of photo URLs
  paymentMethod: PaymentMethod;
  paymentDetails: PaymentDetails;
  serviceZones: string[]; // Array of city names
  status: VehicleStatus;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  isActive: boolean; // Is this the driver's active vehicle
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface PaymentDetails {
  mpesaNumber?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
}

export interface VehicleDocument {
  id: string;
  vehicleId: string;
  type: DocumentType;
  url: string;
  expirationDate?: string;
  uploadedAt: string;
}

export interface VehiclePhoto {
  id: string;
  vehicleId: string;
  url: string;
  uploadedAt: string;
}

export interface VehicleHistoryEvent {
  id: string;
  vehicleId: string;
  eventType: EventType;
  description: string;
  performedBy: string; // User ID or "system"
  performedByName?: string; // Admin name for verification events
  metadata?: Record<string, any>;
  timestamp: string;
}

// ============================================================================
// Request Payload Interfaces
// ============================================================================

export interface VehicleRegistrationPayload {
  driverName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  vehicleType: VehicleType;
  plateNumber: string;
  capacity: number;
  capacityUnit: "kg" | "cubic_meters";
  nationalId: string;
  insuranceDocument: File | { uri: string; type: string; name: string };
  insuranceExpirationDate?: string;
  drivingLicense: File | { uri: string; type: string; name: string };
  inspectionCertificate?: File | { uri: string; type: string; name: string };
  inspectionExpirationDate?: string;
  photos: Array<File | { uri: string; type: string; name: string }>;
  paymentMethod: PaymentMethod;
  paymentDetails: PaymentDetails;
  serviceZones: string[];
}

export interface VehicleUpdatePayload {
  capacity?: number;
  capacityUnit?: "kg" | "cubic_meters";
  serviceZones?: string[];
  paymentMethod?: PaymentMethod;
  paymentDetails?: PaymentDetails;
  photos?: Array<File | { uri: string; type: string; name: string }>;
}

export interface VehicleStatusUpdatePayload {
  status: VehicleStatus;
}

export interface AdminApprovalPayload {
  approved: boolean;
  rejectionReason?: string;
}

// ============================================================================
// Filter and Search Interfaces
// ============================================================================

export interface VehicleFilters {
  vehicleType?: VehicleType;
  status?: VehicleStatus;
  verificationStatus?: VerificationStatus;
  searchQuery?: string;
}

// ============================================================================
// Document Expiration Interfaces
// ============================================================================

export interface DocumentExpirationWarning {
  vehicleId: string;
  plateNumber: string;
  documentType: DocumentType;
  expirationDate: string;
  daysUntilExpiration: number;
  isExpired: boolean;
}

// ============================================================================
// Validation Result Interfaces
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// ============================================================================
// API Response Interfaces
// ============================================================================

export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number | null;
  code: string | null;
  fieldErrors?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// Zustand Store Interfaces
// ============================================================================

export interface VehicleStore {
  // Active vehicle ID (client state)
  activeVehicleId: string | null;
  setActiveVehicleId: (id: string | null) => void;
  
  // Registration form state
  registrationForm: Partial<VehicleRegistrationPayload>;
  updateRegistrationForm: (data: Partial<VehicleRegistrationPayload>) => void;
  clearRegistrationForm: () => void;
  
  // Search and filter state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  vehicleTypeFilter: VehicleType | null;
  setVehicleTypeFilter: (type: VehicleType | null) => void;
  statusFilter: VehicleStatus | null;
  setStatusFilter: (status: VehicleStatus | null) => void;
  verificationFilter: VerificationStatus | null;
  setVerificationFilter: (status: VerificationStatus | null) => void;
  clearFilters: () => void;
  
  // Upload progress
  uploadProgress: Record<string, number>;
  setUploadProgress: (key: string, progress: number) => void;
  clearUploadProgress: (key: string) => void;
}

// ============================================================================
// Constants
// ============================================================================

export const KENYAN_CITIES = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Eldoret",
  "Thika",
  "Malindi",
  "Kitale",
  "Garissa",
  "Kakamega",
] as const;

export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  truck: "Truck",
  mini_truck: "Mini Truck",
  pickup: "Pickup",
};

export const VEHICLE_STATUS_LABELS: Record<VehicleStatus, string> = {
  available: "Available",
  unavailable: "Unavailable",
  in_service: "In Service",
  under_maintenance: "Under Maintenance",
};

export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, string> = {
  pending_verification: "Pending",
  verified: "Verified",
  rejected: "Rejected",
};
