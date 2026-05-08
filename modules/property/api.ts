/**
 * Property module — API bindings.
 * No component calls these directly; they are wrapped by hooks in hooks.ts.
 */

import { apiClient } from "@/lib/api/client";
import type {
    Property,
    PropertyApprovalPayload,
    PropertyListResponse,
    PropertyPayload,
} from "./types";

// ---------------------------------------------------------------------------
// Property API — all HTTP calls for property operations
// ---------------------------------------------------------------------------

export const propertyApi = {
  /**
   * Get all properties for the current user
   */
  getProperties: (params?: { page?: number; pageSize?: number; status?: string }) =>
    apiClient
      .get<PropertyListResponse>("/properties", { params })
      .then((r) => r.data),

  /**
   * Get a single property by ID
   */
  getPropertyById: (id: string) =>
    apiClient.get<Property>(`/properties/${id}`).then((r) => r.data),

  /**
   * Create a new property
   */
  createProperty: (payload: PropertyPayload) =>
    apiClient.post<Property>("/properties", payload).then((r) => r.data),

  /**
   * Update an existing property
   */
  updateProperty: (id: string, payload: Partial<PropertyPayload>) =>
    apiClient.put<Property>(`/properties/${id}`, payload).then((r) => r.data),

  /**
   * Delete a property (soft delete)
   */
  deleteProperty: (id: string) =>
    apiClient.delete(`/properties/${id}`).then((r) => r.data),

  /**
   * Upload property photos
   */
  uploadPhotos: (propertyId: string, photos: FormData) =>
    apiClient
      .post<{ urls: string[] }>(`/properties/${propertyId}/photos`, photos, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data),

  /**
   * Upload property video
   */
  uploadVideo: (propertyId: string, video: FormData) =>
    apiClient
      .post<{ url: string }>(`/properties/${propertyId}/video`, video, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data),

  /**
   * Upload property documents (lease agreement, house rules, etc.)
   */
  uploadDocument: (propertyId: string, document: FormData) =>
    apiClient
      .post<{ url: string }>(`/properties/${propertyId}/documents`, document, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data),

  // ---------------------------------------------------------------------------
  // Admin Operations
  // ---------------------------------------------------------------------------

  /**
   * Get all properties pending verification (admin only)
   */
  getPendingProperties: (params?: { page?: number; pageSize?: number }) =>
    apiClient
      .get<PropertyListResponse>("/admin/properties/pending", { params })
      .then((r) => r.data),

  /**
   * Approve or reject a property (admin only)
   */
  approveProperty: (id: string, payload: PropertyApprovalPayload) =>
    apiClient
      .post<Property>(`/admin/properties/${id}/approve`, payload)
      .then((r) => r.data),

  /**
   * Get all properties (admin only)
   */
  getAllProperties: (params?: { page?: number; pageSize?: number; status?: string }) =>
    apiClient
      .get<PropertyListResponse>("/admin/properties", { params })
      .then((r) => r.data),
};
