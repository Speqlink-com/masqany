/**
 * Move Module - Zustand Store
 * UI state management for map viewport, selections, and modal visibility
 */

import { create } from "zustand"
import type { AvailableVehicle, Location, MoveUIState, VehicleType } from "../types"

const initialState = {
  isDestinationModalVisible: false,
  selectedDestination: null,
  selectedVehicleType: null,
  selectedVehicle: null,
  sheetPosition: 0.5 as const,
  mapRegion: {
    latitude: -1.2921, // Nairobi center
    longitude: 36.8219,
    zoom: 12,
  },
}

export const useMoveStore = create<MoveUIState>((set) => ({
  ...initialState,

  openDestinationModal: () => set({ isDestinationModalVisible: true }),

  closeDestinationModal: () => set({ isDestinationModalVisible: false }),

  setDestination: (location: Location, vehicleType: VehicleType) =>
    set({
      selectedDestination: location,
      selectedVehicleType: vehicleType,
      isDestinationModalVisible: false,
    }),

  selectVehicle: (vehicle: AvailableVehicle | null) => set({ selectedVehicle: vehicle }),

  setSheetPosition: (position: 0.2 | 0.5 | 0.8) => set({ sheetPosition: position }),

  setMapRegion: (region: MoveUIState["mapRegion"]) => set({ mapRegion: region }),

  reset: () => set(initialState),
}))
