/**
 * Property Admin Store Tests
 * Basic verification tests for the Zustand store
 */

import { selectIsSidebarOpen, selectIsStatusModalOpen, usePropertyAdminStore } from '../store';
import { Property, Unit } from '../types';

describe('PropertyAdminStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const store = usePropertyAdminStore.getState();
    store.closeSidebar();
    store.closeStatusModal();
    store.clearSelections();
  });

  describe('Sidebar State', () => {
    it('should initialize with sidebar closed', () => {
      const state = usePropertyAdminStore.getState();
      expect(state.isSidebarOpen).toBe(false);
    });

    it('should open sidebar', () => {
      const store = usePropertyAdminStore.getState();
      store.openSidebar();
      expect(usePropertyAdminStore.getState().isSidebarOpen).toBe(true);
    });

    it('should close sidebar', () => {
      const store = usePropertyAdminStore.getState();
      store.openSidebar();
      store.closeSidebar();
      expect(usePropertyAdminStore.getState().isSidebarOpen).toBe(false);
    });

    it('should toggle sidebar', () => {
      const store = usePropertyAdminStore.getState();
      expect(usePropertyAdminStore.getState().isSidebarOpen).toBe(false);
      store.toggleSidebar();
      expect(usePropertyAdminStore.getState().isSidebarOpen).toBe(true);
      store.toggleSidebar();
      expect(usePropertyAdminStore.getState().isSidebarOpen).toBe(false);
    });
  });

  describe('Modal State', () => {
    it('should initialize with modal closed', () => {
      const state = usePropertyAdminStore.getState();
      expect(state.isStatusModalOpen).toBe(false);
    });

    it('should open status modal', () => {
      const store = usePropertyAdminStore.getState();
      store.openStatusModal();
      expect(usePropertyAdminStore.getState().isStatusModalOpen).toBe(true);
    });

    it('should close status modal', () => {
      const store = usePropertyAdminStore.getState();
      store.openStatusModal();
      store.closeStatusModal();
      expect(usePropertyAdminStore.getState().isStatusModalOpen).toBe(false);
    });
  });

  describe('Selection State', () => {
    const mockProperty: Property = {
      id: 'prop-001',
      name: 'Test Property',
      type: '2_bedroom',
      location: {
        estate: 'Kilimani',
        county: 'Nairobi',
        coordinates: [36.7821, -1.2921],
      },
      totalUnits: 40,
      occupiedUnits: 35,
      vacantUnits: 5,
      occupancyRate: 87.5,
      pricePerUnit: 45000,
      monthlyRentals: 1575000,
      currency: 'KES',
      rating: 4.5,
      totalViews: 1234,
      propertyIcon: 'test-icon.webp',
      ownerId: 'owner-001',
      agentIds: ['agent-001'],
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-20T14:45:00Z',
    };

    const mockUnit: Unit = {
      id: 'unit-001',
      propertyId: 'prop-001',
      roomNumber: 'A1',
      status: 'occupied',
      bedrooms: 2,
      bathrooms: 2,
      size: 1200,
      price: 45000,
      tenantId: 'tenant-001',
      leaseStartDate: '2024-01-01T00:00:00Z',
      leaseEndDate: '2024-12-31T23:59:59Z',
      lastUpdated: '2024-01-15T10:30:00Z',
      updatedBy: 'owner-001',
    };

    it('should initialize with no selections', () => {
      const state = usePropertyAdminStore.getState();
      expect(state.selectedProperty).toBeNull();
      expect(state.selectedUnit).toBeNull();
      expect(state.selectedUnits).toEqual([]);
    });

    it('should set selected property', () => {
      const store = usePropertyAdminStore.getState();
      store.setSelectedProperty(mockProperty);
      expect(usePropertyAdminStore.getState().selectedProperty).toEqual(mockProperty);
    });

    it('should set selected unit', () => {
      const store = usePropertyAdminStore.getState();
      store.setSelectedUnit(mockUnit);
      expect(usePropertyAdminStore.getState().selectedUnit).toEqual(mockUnit);
    });

    it('should toggle unit selection', () => {
      const store = usePropertyAdminStore.getState();
      
      // Add unit
      store.toggleUnitSelection('unit-001');
      expect(usePropertyAdminStore.getState().selectedUnits).toEqual(['unit-001']);
      
      // Add another unit
      store.toggleUnitSelection('unit-002');
      expect(usePropertyAdminStore.getState().selectedUnits).toEqual(['unit-001', 'unit-002']);
      
      // Remove first unit
      store.toggleUnitSelection('unit-001');
      expect(usePropertyAdminStore.getState().selectedUnits).toEqual(['unit-002']);
    });

    it('should clear all selections', () => {
      const store = usePropertyAdminStore.getState();
      
      // Set some selections
      store.setSelectedProperty(mockProperty);
      store.setSelectedUnit(mockUnit);
      store.toggleUnitSelection('unit-001');
      store.toggleUnitSelection('unit-002');
      
      // Clear all
      store.clearSelections();
      
      const state = usePropertyAdminStore.getState();
      expect(state.selectedProperty).toBeNull();
      expect(state.selectedUnit).toBeNull();
      expect(state.selectedUnits).toEqual([]);
    });
  });

  describe('Selectors', () => {
    it('should select sidebar open state', () => {
      const store = usePropertyAdminStore.getState();
      expect(selectIsSidebarOpen(store)).toBe(false);
      
      store.openSidebar();
      const updatedStore = usePropertyAdminStore.getState();
      expect(selectIsSidebarOpen(updatedStore)).toBe(true);
    });

    it('should select modal open state', () => {
      const store = usePropertyAdminStore.getState();
      expect(selectIsStatusModalOpen(store)).toBe(false);
      
      store.openStatusModal();
      const updatedStore = usePropertyAdminStore.getState();
      expect(selectIsStatusModalOpen(updatedStore)).toBe(true);
    });
  });
});
