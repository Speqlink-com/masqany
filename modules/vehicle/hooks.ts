/**
 * Vehicle Management Module - TanStack Query Hooks
 * 
 * This file contains all data fetching and mutation hooks for vehicle operations.
 * Components should use these hooks, never call the API directly.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { vehicleApi } from "./api";
import { useVehicleStore } from "./store";
import type {
    DocumentType,
    Vehicle,
    VehicleFilters,
    VehicleRegistrationPayload,
    VehicleStatusUpdatePayload,
    VehicleUpdatePayload,
} from "./types";

// ============================================================================
// Query Keys
// ============================================================================

export const vehicleKeys = {
  all: ["vehicles"] as const,
  lists: () => [...vehicleKeys.all, "list"] as const,
  list: (filters?: VehicleFilters) => [...vehicleKeys.lists(), filters] as const,
  details: () => [...vehicleKeys.all, "detail"] as const,
  detail: (id: string) => [...vehicleKeys.details(), id] as const,
  history: (id: string) => [...vehicleKeys.all, "history", id] as const,
  expirations: () => [...vehicleKeys.all, "expirations"] as const,
  admin: () => [...vehicleKeys.all, "admin"] as const,
  adminList: (filters?: VehicleFilters) => [...vehicleKeys.admin(), filters] as const,
};

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Get all vehicles for authenticated driver
 * Cached for 5 minutes
 */
export function useVehicles(filters?: VehicleFilters) {
  return useQuery({
    queryKey: vehicleKeys.list(filters),
    queryFn: () => vehicleApi.getVehicles(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Get single vehicle by ID
 * Cached for 5 minutes
 */
export function useVehicle(id: string) {
  return useQuery({
    queryKey: vehicleKeys.detail(id),
    queryFn: () => vehicleApi.getVehicle(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id,
  });
}

/**
 * Get vehicle history events
 * Cached for 10 minutes
 */
export function useVehicleHistory(id: string) {
  return useQuery({
    queryKey: vehicleKeys.history(id),
    queryFn: () => vehicleApi.getVehicleHistory(id),
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!id,
  });
}

/**
 * Get document expiration warnings
 * Cached for 30 minutes
 */
export function useExpirationWarnings() {
  return useQuery({
    queryKey: vehicleKeys.expirations(),
    queryFn: () => vehicleApi.getExpirationWarnings(),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Get all vehicles pending verification (Admin only)
 * Cached for 2 minutes (fresher for admin)
 */
export function useAdminVehicles(filters?: VehicleFilters) {
  return useQuery({
    queryKey: vehicleKeys.adminList(filters),
    queryFn: () => vehicleApi.getAdminVehicles(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Create new vehicle registration
 * Invalidates vehicle list cache and navigates to dashboard on success
 */
export function useCreateVehicle() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: VehicleRegistrationPayload) => {
      const formData = new FormData();
      
      // Append text fields
      formData.append("driverName", payload.driverName);
      formData.append("dateOfBirth", payload.dateOfBirth);
      formData.append("gender", payload.gender);
      formData.append("vehicleType", payload.vehicleType);
      formData.append("plateNumber", payload.plateNumber);
      formData.append("capacity", payload.capacity.toString());
      formData.append("capacityUnit", payload.capacityUnit);
      formData.append("nationalId", payload.nationalId);
      formData.append("paymentMethod", payload.paymentMethod);
      formData.append("paymentDetails", JSON.stringify(payload.paymentDetails));
      formData.append("serviceZones", JSON.stringify(payload.serviceZones));
      
      // Append files
      formData.append("insuranceDocument", payload.insuranceDocument as any);
      formData.append("drivingLicense", payload.drivingLicense as any);
      if (payload.inspectionCertificate) {
        formData.append("inspectionCertificate", payload.inspectionCertificate as any);
      }
      
      // Append expiration dates
      if (payload.insuranceExpirationDate) {
        formData.append("insuranceExpirationDate", payload.insuranceExpirationDate);
      }
      if (payload.inspectionExpirationDate) {
        formData.append("inspectionExpirationDate", payload.inspectionExpirationDate);
      }
      
      // Append photos
      payload.photos.forEach((photo) => {
        formData.append("photos", photo as any);
      });
      
      return vehicleApi.createVehicle(formData);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: vehicleKeys.lists() });
      router.push("/(tabs)/move" as any); // Navigate to driver dashboard
    },
  });
}

/**
 * Update vehicle information
 * Invalidates vehicle detail and list caches on success
 */
export function useUpdateVehicle(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: VehicleUpdatePayload) => {
      const formData = new FormData();
      
      if (payload.capacity !== undefined) {
        formData.append("capacity", payload.capacity.toString());
      }
      if (payload.capacityUnit) {
        formData.append("capacityUnit", payload.capacityUnit);
      }
      if (payload.serviceZones) {
        formData.append("serviceZones", JSON.stringify(payload.serviceZones));
      }
      if (payload.paymentMethod) {
        formData.append("paymentMethod", payload.paymentMethod);
      }
      if (payload.paymentDetails) {
        formData.append("paymentDetails", JSON.stringify(payload.paymentDetails));
      }
      if (payload.photos) {
        payload.photos.forEach((photo) => {
          formData.append("photos", photo as any);
        });
      }
      
      return vehicleApi.updateVehicle(id, formData);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: vehicleKeys.detail(id) });
      qc.invalidateQueries({ queryKey: vehicleKeys.lists() });
    },
  });
}

/**
 * Delete vehicle (soft delete)
 * Invalidates vehicle list cache and navigates back on success
 */
export function useDeleteVehicle() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) => vehicleApi.deleteVehicle(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: vehicleKeys.lists() });
      router.back();
    },
  });
}

/**
 * Set vehicle as active
 * Updates store and invalidates vehicle list cache on success
 */
export function useSetActiveVehicle() {
  const qc = useQueryClient();
  const { setActiveVehicleId } = useVehicleStore();

  return useMutation({
    mutationFn: (id: string) => vehicleApi.setActiveVehicle(id),
    onSuccess: (data) => {
      setActiveVehicleId(data.id);
      qc.invalidateQueries({ queryKey: vehicleKeys.lists() });
    },
  });
}

/**
 * Update vehicle status (available, unavailable, etc.)
 * Uses optimistic updates for immediate UI feedback
 */
export function useUpdateVehicleStatus(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: VehicleStatusUpdatePayload) =>
      vehicleApi.updateVehicleStatus(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: vehicleKeys.detail(id) });
      qc.invalidateQueries({ queryKey: vehicleKeys.lists() });
    },
    // Optimistic update
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: vehicleKeys.detail(id) });
      const previous = qc.getQueryData(vehicleKeys.detail(id));
      
      qc.setQueryData(vehicleKeys.detail(id), (old: Vehicle | undefined) => {
        if (!old) return old;
        return { ...old, status: payload.status };
      });
      
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        qc.setQueryData(vehicleKeys.detail(id), context.previous);
      }
    },
  });
}

/**
 * Upload additional photos to existing vehicle
 * Invalidates vehicle detail cache on success
 */
export function useUploadPhotos(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (photos: Array<File | { uri: string; type: string; name: string }>) => {
      const formData = new FormData();
      photos.forEach((photo) => {
        formData.append("photos", photo as any);
      });
      return vehicleApi.uploadPhotos(id, formData);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: vehicleKeys.detail(id) });
    },
  });
}

/**
 * Update a specific document (insurance, license, inspection)
 * Invalidates vehicle detail and expiration warnings caches on success
 */
export function useUpdateDocument(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      documentType,
      file,
      expirationDate,
    }: {
      documentType: DocumentType;
      file: File | { uri: string; type: string; name: string };
      expirationDate?: string;
    }) => {
      const formData = new FormData();
      formData.append("document", file as any);
      if (expirationDate) {
        formData.append("expirationDate", expirationDate);
      }
      return vehicleApi.updateDocument(id, documentType, formData);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: vehicleKeys.detail(id) });
      qc.invalidateQueries({ queryKey: vehicleKeys.expirations() });
    },
  });
}

/**
 * Approve vehicle registration (Admin only)
 * Invalidates admin and vehicle detail caches on success
 */
export function useApproveVehicle() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vehicleApi.approveVehicle(id),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: vehicleKeys.admin() });
      qc.invalidateQueries({ queryKey: vehicleKeys.detail(data.id) });
    },
  });
}

/**
 * Reject vehicle registration with reason (Admin only)
 * Invalidates admin and vehicle detail caches on success
 */
export function useRejectVehicle() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      vehicleApi.rejectVehicle(id, reason),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: vehicleKeys.admin() });
      qc.invalidateQueries({ queryKey: vehicleKeys.detail(data.id) });
    },
  });
}
