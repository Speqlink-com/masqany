/**
 * Vehicle Management Module - Zustand Store
 * 
 * This file contains client-side state management for vehicle UI interactions.
 * Server state is managed by TanStack Query - this store is for UI state only.
 */

import { create } from "zustand";
import type { VehicleStore } from "./types";

export const useVehicleStore = create<VehicleStore>((set) => ({
  // ============================================================================
  // Active Vehicle State
  // ============================================================================
  
  activeVehicleId: null,
  setActiveVehicleId: (id) => set({ activeVehicleId: id }),
  
  // ============================================================================
  // Registration Form State
  // ============================================================================
  
  registrationForm: {},
  updateRegistrationForm: (data) =>
    set((state) => ({
      registrationForm: { ...state.registrationForm, ...data },
    })),
  clearRegistrationForm: () => set({ registrationForm: {} }),
  
  // ============================================================================
  // Search and Filter State
  // ============================================================================
  
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  vehicleTypeFilter: null,
  setVehicleTypeFilter: (type) => set({ vehicleTypeFilter: type }),
  
  statusFilter: null,
  setStatusFilter: (status) => set({ statusFilter: status }),
  
  verificationFilter: null,
  setVerificationFilter: (status) => set({ verificationFilter: status }),
  
  clearFilters: () =>
    set({
      searchQuery: "",
      vehicleTypeFilter: null,
      statusFilter: null,
      verificationFilter: null,
    }),
  
  // ============================================================================
  // Upload Progress State
  // ============================================================================
  
  uploadProgress: {},
  setUploadProgress: (key, progress) =>
    set((state) => ({
      uploadProgress: { ...state.uploadProgress, [key]: progress },
    })),
  clearUploadProgress: (key) =>
    set((state) => {
      const { [key]: _, ...rest } = state.uploadProgress;
      return { uploadProgress: rest };
    }),
}));
