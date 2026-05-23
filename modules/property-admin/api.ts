/**
 * Property Admin Module - API Layer
 * 
 * This file contains all API calls for the property admin module.
 * All HTTP calls go through the single apiClient instance from lib/api/client.ts.
 * 
 * Mock Implementation:
 * - Uses mock data from assets/data/property-admin.ts
 * - Simulates network delay (300-800ms)
 * - Simulates 10% failure rate for testing error handling
 * - Implements pagination, filtering, and sorting
 */

import {
    mockAgents,
    mockAnalytics,
    mockProperties,
    mockUnits,
} from '@/assets/data/property-admin';
import {
    Agent,
    Analytics,
    PropertiesResponse,
    Property,
    UnitsResponse,
    UpdateUnitStatusRequest,
    UpdateUnitStatusResponse,
} from './types';

// ---------------------------------------------------------------------------
// Mock API Utilities
// ---------------------------------------------------------------------------

/**
 * Simulate network delay between 300-800ms
 */
const simulateNetworkDelay = (): Promise<void> => {
  const delay = 300 + Math.random() * 500;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

/**
 * Simulate 10% failure rate for testing error handling
 */
const simulateRandomFailure = (): void => {
  if (Math.random() < 0.1) {
    throw new Error('Simulated network error');
  }
};

// ---------------------------------------------------------------------------
// Property Admin API
// ---------------------------------------------------------------------------

export const propertyAdminApi = {
  /**
   * Get all properties for current user with pagination, filtering, and sorting
   * 
   * @param params - Query parameters
   * @param params.page - Page number (1-indexed)
   * @param params.pageSize - Number of items per page
   * @param params.filter - Optional filter string (searches name, estate, county)
   * @param params.sort - Optional sort field ('name' | 'occupancy' | 'rating' | 'views')
   * @returns Promise<PropertiesResponse>
   */
  getProperties: async (params: {
    page: number;
    pageSize: number;
    filter?: string;
    sort?: string;
  }): Promise<PropertiesResponse> => {
    await simulateNetworkDelay();
    simulateRandomFailure();

    // Filter mock data
    let filtered = [...mockProperties];

    if (params.filter) {
      const filterLower = params.filter.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(filterLower) ||
          p.location.estate.toLowerCase().includes(filterLower) ||
          p.location.county.toLowerCase().includes(filterLower)
      );
    }

    // Sort mock data
    if (params.sort === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (params.sort === 'occupancy') {
      filtered.sort((a, b) => b.occupancyRate - a.occupancyRate);
    } else if (params.sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (params.sort === 'views') {
      filtered.sort((a, b) => b.totalViews - a.totalViews);
    }

    // Paginate
    const start = (params.page - 1) * params.pageSize;
    const end = start + params.pageSize;
    const paginated = filtered.slice(start, end);

    return {
      properties: paginated,
      pagination: {
        page: params.page,
        pageSize: params.pageSize,
        total: filtered.length,
        hasMore: end < filtered.length,
      },
    };
  },

  /**
   * Get single property by ID
   * 
   * @param propertyId - Property ID
   * @returns Promise<Property>
   * @throws Error if property not found
   */
  getProperty: async (propertyId: string): Promise<Property> => {
    await simulateNetworkDelay();
    simulateRandomFailure();

    const property = mockProperties.find((p) => p.id === propertyId);
    if (!property) {
      throw new Error('Property not found');
    }

    return property;
  },

  /**
   * Get units for a specific property
   * 
   * @param propertyId - Property ID
   * @returns Promise<UnitsResponse>
   * @throws Error if property not found
   */
  getPropertyUnits: async (propertyId: string): Promise<UnitsResponse> => {
    await simulateNetworkDelay();
    simulateRandomFailure();

    const property = mockProperties.find((p) => p.id === propertyId);
    const units = mockUnits[propertyId] || [];

    if (!property) {
      throw new Error('Property not found');
    }

    return { units, property };
  },

  /**
   * Get analytics data for specified period
   * 
   * @param params - Query parameters
   * @param params.period - Time period ('daily' | 'weekly' | 'monthly' | 'yearly')
   * @returns Promise<Analytics>
   */
  getAnalytics: async (params: {
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  }): Promise<Analytics> => {
    await simulateNetworkDelay();
    simulateRandomFailure();

    // Return mock analytics with requested period
    return {
      ...mockAnalytics,
      period: params.period,
    };
  },

  /**
   * Get all agents
   * 
   * @returns Promise<Agent[]>
   */
  getAgents: async (): Promise<Agent[]> => {
    await simulateNetworkDelay();
    simulateRandomFailure();

    return mockAgents;
  },

  /**
   * Update unit status with optimistic update support
   * 
   * @param data - Update request data
   * @param data.unitId - Unit ID to update
   * @param data.newStatus - New status ('occupied' | 'vacant' | 'vacant_soon')
   * @param data.updatedBy - User ID performing the update
   * @returns Promise<UpdateUnitStatusResponse>
   * @throws Error if unit or property not found
   */
  updateUnitStatus: async (
    data: UpdateUnitStatusRequest
  ): Promise<UpdateUnitStatusResponse> => {
    await simulateNetworkDelay();
    simulateRandomFailure();

    // Find the unit across all properties
    let foundUnit: any = null;
    let foundPropertyId: string | null = null;

    for (const [propertyId, units] of Object.entries(mockUnits)) {
      const unit = units.find((u) => u.id === data.unitId);
      if (unit) {
        foundUnit = unit;
        foundPropertyId = propertyId;
        break;
      }
    }

    if (!foundUnit || !foundPropertyId) {
      throw new Error('Unit not found');
    }

    const property = mockProperties.find((p) => p.id === foundPropertyId);
    if (!property) {
      throw new Error('Property not found');
    }

    // Update unit status
    const oldStatus = foundUnit.status;
    foundUnit.status = data.newStatus;
    foundUnit.lastUpdated = new Date().toISOString();
    foundUnit.updatedBy = data.updatedBy;

    // Recalculate property counts based on status change
    const updatedProperty = { ...property };

    // Adjust counts based on status transition
    if (oldStatus === 'occupied' && data.newStatus !== 'occupied') {
      updatedProperty.occupiedUnits -= 1;
      updatedProperty.vacantUnits += 1;
      updatedProperty.monthlyRentals -= foundUnit.price;
    } else if (oldStatus !== 'occupied' && data.newStatus === 'occupied') {
      updatedProperty.occupiedUnits += 1;
      updatedProperty.vacantUnits -= 1;
      updatedProperty.monthlyRentals += foundUnit.price;
    }

    // Recalculate occupancy rate
    updatedProperty.occupancyRate =
      (updatedProperty.occupiedUnits / updatedProperty.totalUnits) * 100;
    updatedProperty.updatedAt = new Date().toISOString();

    return {
      unit: { ...foundUnit },
      property: updatedProperty,
    };
  },

  /**
   * Create new property
   * 
   * @param data - Partial property data
   * @returns Promise<Property>
   */
  createProperty: async (data: Partial<Property>): Promise<Property> => {
    await simulateNetworkDelay();
    simulateRandomFailure();

    // Generate new property with defaults
    const newProperty: Property = {
      id: `prop-${Date.now()}`,
      name: data.name || 'New Property',
      type: data.type || '1_bedroom',
      location: data.location || {
        estate: 'Unknown',
        county: 'Nairobi',
        coordinates: [36.8219, -1.2921],
      },
      totalUnits: data.totalUnits || 0,
      occupiedUnits: data.occupiedUnits || 0,
      vacantUnits: data.vacantUnits || 0,
      occupancyRate: data.occupancyRate || 0,
      pricePerUnit: data.pricePerUnit || 0,
      monthlyRentals: data.monthlyRentals || 0,
      currency: data.currency || 'KES',
      rating: data.rating || 0,
      totalViews: data.totalViews || 0,
      propertyIcon: data.propertyIcon || 'assets/icons/house-icon.webp',
      ownerId: data.ownerId || 'owner-001',
      agentIds: data.agentIds || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In a real implementation, this would persist to backend
    mockProperties.push(newProperty);

    return newProperty;
  },

  /**
   * Archive property
   * 
   * @param propertyId - Property ID to archive
   * @returns Promise<Property>
   * @throws Error if property not found
   */
  archiveProperty: async (propertyId: string): Promise<Property> => {
    await simulateNetworkDelay();
    simulateRandomFailure();

    const property = mockProperties.find((p) => p.id === propertyId);
    if (!property) {
      throw new Error('Property not found');
    }

    // In a real implementation, this would update the property status
    // For now, just return the property with updated timestamp
    const archivedProperty = {
      ...property,
      updatedAt: new Date().toISOString(),
    };

    return archivedProperty;
  },

  /**
   * Hire new agent
   * 
   * @param data - Partial agent data
   * @returns Promise<Agent>
   */
  hireAgent: async (data: Partial<Agent>): Promise<Agent> => {
    await simulateNetworkDelay();
    simulateRandomFailure();

    // Generate new agent with defaults
    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name: data.name || 'New Agent',
      email: data.email || 'agent@masqany.com',
      phone: data.phone || '+254700000000',
      avatar: data.avatar || 'https://i.pravatar.cc/150?img=1',
      assignedProperties: data.assignedProperties || [],
      totalProperties: data.totalProperties || 0,
      rating: data.rating || 0,
      hireDate: new Date().toISOString(),
      status: data.status || 'active',
    };

    // In a real implementation, this would persist to backend
    mockAgents.push(newAgent);

    return newAgent;
  },
};

