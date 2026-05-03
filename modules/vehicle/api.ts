/**
 * Vehicle Management Module - API Layer
 * 
 * This file contains all API calls for vehicle operations.
 * Uses the shared apiClient from lib/api/client.ts.
 * No component should call these functions directly - use hooks instead.
 */

import { apiClient } from "@/lib/api/client";
import type {
    DocumentExpirationWarning,
    DocumentType,
    Vehicle,
    VehicleDocument,
    VehicleFilters,
    VehicleHistoryEvent,
    VehicleStatusUpdatePayload,
} from "./types";

// ============================================================================
// Vehicle CRUD Operations
// ============================================================================

/**
 * Create new vehicle registration
 * POST /vehicles
 */
export const createVehicle = (payload: FormData) =>
  apiClient
    .post<Vehicle>("/vehicles", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);

/**
 * Get all vehicles for authenticated driver
 * GET /vehicles
 */
export const getVehicles = (filters?: VehicleFilters) =>
  apiClient
    .get<Vehicle[]>("/vehicles", { params: filters })
    .then((r) => r.data);

/**
 * Get single vehicle by ID
 * GET /vehicles/:id
 */
export const getVehicle = (id: string) =>
  apiClient
    .get<Vehicle>(`/vehicles/${id}`)
    .then((r) => r.data);

/**
 * Update vehicle information
 * PUT /vehicles/:id
 */
export const updateVehicle = (id: string, payload: FormData) =>
  apiClient
    .put<Vehicle>(`/vehicles/${id}`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);

/**
 * Delete vehicle (soft delete)
 * DELETE /vehicles/:id
 */
export const deleteVehicle = (id: string) =>
  apiClient
    .delete<{ success: boolean }>(`/vehicles/${id}`)
    .then((r) => r.data);

// ============================================================================
// Vehicle Status Operations
// ============================================================================

/**
 * Set vehicle as active
 * POST /vehicles/:id/set-active
 */
export const setActiveVehicle = (id: string) =>
  apiClient
    .post<Vehicle>(`/vehicles/${id}/set-active`)
    .then((r) => r.data);

/**
 * Update vehicle status (available, unavailable, etc.)
 * PATCH /vehicles/:id/status
 */
export const updateVehicleStatus = (
  id: string,
  payload: VehicleStatusUpdatePayload
) =>
  apiClient
    .patch<Vehicle>(`/vehicles/${id}/status`, payload)
    .then((r) => r.data);

// ============================================================================
// Vehicle History
// ============================================================================

/**
 * Get vehicle history events
 * GET /vehicles/:id/history
 */
export const getVehicleHistory = (id: string) =>
  apiClient
    .get<VehicleHistoryEvent[]>(`/vehicles/${id}/history`)
    .then((r) => r.data);

// ============================================================================
// Document and Photo Operations
// ============================================================================

/**
 * Upload additional photos to existing vehicle
 * POST /vehicles/:id/photos
 */
export const uploadPhotos = (id: string, formData: FormData) =>
  apiClient
    .post<{ photoUrls: string[] }>(`/vehicles/${id}/photos`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);

/**
 * Update a specific document (insurance, license, inspection)
 * PUT /vehicles/:id/documents/:type
 */
export const updateDocument = (
  id: string,
  documentType: DocumentType,
  formData: FormData
) =>
  apiClient
    .put<VehicleDocument>(
      `/vehicles/${id}/documents/${documentType}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    )
    .then((r) => r.data);

/**
 * Get document expiration warnings for all driver's vehicles
 * GET /vehicles/expirations
 */
export const getExpirationWarnings = () =>
  apiClient
    .get<DocumentExpirationWarning[]>("/vehicles/expirations")
    .then((r) => r.data);

// ============================================================================
// Admin Operations
// ============================================================================

/**
 * Get all vehicles pending verification (Admin only)
 * GET /admin/vehicles
 */
export const getAdminVehicles = (filters?: VehicleFilters) =>
  apiClient
    .get<Vehicle[]>("/admin/vehicles", { params: filters })
    .then((r) => r.data);

/**
 * Approve vehicle registration (Admin only)
 * POST /admin/vehicles/:id/approve
 */
export const approveVehicle = (id: string) =>
  apiClient
    .post<Vehicle>(`/admin/vehicles/${id}/approve`)
    .then((r) => r.data);

/**
 * Reject vehicle registration with reason (Admin only)
 * POST /admin/vehicles/:id/reject
 */
export const rejectVehicle = (id: string, reason: string) =>
  apiClient
    .post<Vehicle>(`/admin/vehicles/${id}/reject`, { reason })
    .then((r) => r.data);

// ============================================================================
// Exported API Object
// ============================================================================

export const vehicleApi = {
  // CRUD
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
  
  // Status
  setActiveVehicle,
  updateVehicleStatus,
  
  // History
  getVehicleHistory,
  
  // Documents & Photos
  uploadPhotos,
  updateDocument,
  getExpirationWarnings,
  
  // Admin
  getAdminVehicles,
  approveVehicle,
  rejectVehicle,
};
