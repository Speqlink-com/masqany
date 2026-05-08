/**
 * Property module — TanStack Query hooks.
 * These are the only entry points for property data in the UI layer.
 */

import { queryClient } from "@/lib/query/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { propertyApi } from "./api";
import type {
    PropertyApprovalPayload,
    PropertyPayload
} from "./types";

// ---------------------------------------------------------------------------
// Query keys — centralized to avoid typos and enable targeted invalidation
// ---------------------------------------------------------------------------
export const propertyKeys = {
  all: ["properties"] as const,
  lists: () => [...propertyKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...propertyKeys.lists(), filters] as const,
  details: () => [...propertyKeys.all, "detail"] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
  pending: () => [...propertyKeys.all, "pending"] as const,
  admin: () => [...propertyKeys.all, "admin"] as const,
};

// ---------------------------------------------------------------------------
// Fetch user's properties
// ---------------------------------------------------------------------------
export function useProperties(params?: {
  page?: number;
  pageSize?: number;
  status?: string;
}) {
  return useQuery({
    queryKey: propertyKeys.list(params),
    queryFn: () => propertyApi.getProperties(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ---------------------------------------------------------------------------
// Fetch single property by ID
// ---------------------------------------------------------------------------
export function useProperty(id: string) {
  return useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: () => propertyApi.getPropertyById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ---------------------------------------------------------------------------
// Create property mutation
// ---------------------------------------------------------------------------
export function useCreateProperty() {
  return useMutation({
    mutationFn: (payload: PropertyPayload) => propertyApi.createProperty(payload),
    onSuccess: (newProperty) => {
      // Invalidate property lists to refetch
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      // Optimistically set the new property in cache
      queryClient.setQueryData(propertyKeys.detail(newProperty.id), newProperty);
    },
  });
}

// ---------------------------------------------------------------------------
// Update property mutation
// ---------------------------------------------------------------------------
export function useUpdateProperty(id: string) {
  return useMutation({
    mutationFn: (payload: Partial<PropertyPayload>) =>
      propertyApi.updateProperty(id, payload),
    onSuccess: (updatedProperty) => {
      // Update the specific property in cache
      queryClient.setQueryData(
        propertyKeys.detail(updatedProperty.id),
        updatedProperty
      );
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
    },
  });
}

// ---------------------------------------------------------------------------
// Delete property mutation
// ---------------------------------------------------------------------------
export function useDeleteProperty() {
  return useMutation({
    mutationFn: (id: string) => propertyApi.deleteProperty(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: propertyKeys.detail(deletedId) });
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
    },
  });
}

// ---------------------------------------------------------------------------
// Upload photos mutation
// ---------------------------------------------------------------------------
export function useUploadPhotos(propertyId: string) {
  return useMutation({
    mutationFn: (photos: FormData) => propertyApi.uploadPhotos(propertyId, photos),
    onSuccess: () => {
      // Invalidate the property to refetch with new photos
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(propertyId) });
    },
  });
}

// ---------------------------------------------------------------------------
// Upload video mutation
// ---------------------------------------------------------------------------
export function useUploadVideo(propertyId: string) {
  return useMutation({
    mutationFn: (video: FormData) => propertyApi.uploadVideo(propertyId, video),
    onSuccess: () => {
      // Invalidate the property to refetch with new video
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(propertyId) });
    },
  });
}

// ---------------------------------------------------------------------------
// Upload document mutation
// ---------------------------------------------------------------------------
export function useUploadDocument(propertyId: string) {
  return useMutation({
    mutationFn: (document: FormData) =>
      propertyApi.uploadDocument(propertyId, document),
    onSuccess: () => {
      // Invalidate the property to refetch with new document
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(propertyId) });
    },
  });
}

// ---------------------------------------------------------------------------
// Admin: Fetch pending properties
// ---------------------------------------------------------------------------
export function usePendingProperties(params?: {
  page?: number;
  pageSize?: number;
}) {
  return useQuery({
    queryKey: propertyKeys.pending(),
    queryFn: () => propertyApi.getPendingProperties(params),
    staleTime: 2 * 60 * 1000, // 2 minutes (fresher for admin)
  });
}

// ---------------------------------------------------------------------------
// Admin: Approve/reject property mutation
// ---------------------------------------------------------------------------
export function useApproveProperty() {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: PropertyApprovalPayload;
    }) => propertyApi.approveProperty(id, payload),
    onSuccess: (updatedProperty) => {
      // Update the specific property in cache
      queryClient.setQueryData(
        propertyKeys.detail(updatedProperty.id),
        updatedProperty
      );
      // Invalidate pending list and all lists
      queryClient.invalidateQueries({ queryKey: propertyKeys.pending() });
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
    },
  });
}

// ---------------------------------------------------------------------------
// Admin: Fetch all properties
// ---------------------------------------------------------------------------
export function useAllProperties(params?: {
  page?: number;
  pageSize?: number;
  status?: string;
}) {
  return useQuery({
    queryKey: propertyKeys.admin(),
    queryFn: () => propertyApi.getAllProperties(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
