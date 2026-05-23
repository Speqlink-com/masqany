/**
 * Property Admin Store — Zustand store for client-side UI state.
 *
 * Owns: sidebar open/close state, modal visibility, selected property/unit,
 * and other transient UI concerns for the property admin module.
 *
 * Rule: Server state (properties, units, analytics) belongs in TanStack Query.
 *       Client state (UI toggles, selections) belongs here.
 */

import { create } from 'zustand';
import { Property, Unit } from './types';

/**
 * PropertyAdminStore Interface
 * Defines the shape of the property admin client state store
 */
interface PropertyAdminStore {
  // Sidebar State
  isSidebarOpen: boolean;

  // Modal State
  isStatusModalOpen: boolean;

  // Selections
  selectedProperty: Property | null;
  selectedUnit: Unit | null;
  selectedUnits: string[]; // Array of unit IDs for bulk operations

  // Sidebar Actions
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;

  // Modal Actions
  openStatusModal: () => void;
  closeStatusModal: () => void;

  // Selection Actions
  setSelectedProperty: (property: Property | null) => void;
  setSelectedUnit: (unit: Unit | null) => void;
  toggleUnitSelection: (unitId: string) => void;
  clearSelections: () => void;
}

/**
 * usePropertyAdminStore
 * Main Zustand store hook for property admin UI state
 */
export const usePropertyAdminStore = create<PropertyAdminStore>((set, get) => ({
  // Initial State
  isSidebarOpen: false,
  isStatusModalOpen: false,
  selectedProperty: null,
  selectedUnit: null,
  selectedUnits: [],

  // Sidebar Actions
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  // Modal Actions
  openStatusModal: () => set({ isStatusModalOpen: true }),
  closeStatusModal: () => set({ isStatusModalOpen: false }),

  // Selection Actions
  setSelectedProperty: (property) => set({ selectedProperty: property }),
  setSelectedUnit: (unit) => set({ selectedUnit: unit }),
  toggleUnitSelection: (unitId) =>
    set((state) => ({
      selectedUnits: state.selectedUnits.includes(unitId)
        ? state.selectedUnits.filter((id) => id !== unitId)
        : [...state.selectedUnits, unitId],
    })),
  clearSelections: () =>
    set({
      selectedProperty: null,
      selectedUnit: null,
      selectedUnits: [],
    }),
}));

// ---------------------------------------------------------------------------
// Selectors
// Use these in components for efficient subscriptions to specific state slices
// ---------------------------------------------------------------------------

/**
 * selectIsSidebarOpen
 * Selector for sidebar open state
 */
export const selectIsSidebarOpen = (state: PropertyAdminStore) => state.isSidebarOpen;

/**
 * selectIsStatusModalOpen
 * Selector for status modal open state
 */
export const selectIsStatusModalOpen = (state: PropertyAdminStore) => state.isStatusModalOpen;

/**
 * selectSelectedProperty
 * Selector for currently selected property
 */
export const selectSelectedProperty = (state: PropertyAdminStore) => state.selectedProperty;

/**
 * selectSelectedUnit
 * Selector for currently selected unit
 */
export const selectSelectedUnit = (state: PropertyAdminStore) => state.selectedUnit;

/**
 * selectSelectedUnits
 * Selector for array of selected unit IDs (for bulk operations)
 */
export const selectSelectedUnits = (state: PropertyAdminStore) => state.selectedUnits;

