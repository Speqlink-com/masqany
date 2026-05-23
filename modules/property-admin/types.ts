// Property Admin Module - Type Definitions
// This file contains all TypeScript interfaces for the property admin module

/**
 * Property Type Union
 * Represents the different types of properties available
 */
export type PropertyType =
  | 'bedsitter'
  | '1_bedroom'
  | '2_bedroom'
  | '3_bedroom'
  | '4_bedroom_plus'
  | 'studio'
  | 'penthouse';

/**
 * Unit Status Union
 * Represents the current status of a unit
 */
export type UnitStatus = 'occupied' | 'vacant' | 'vacant_soon';

/**
 * Property Interface
 * Represents a property in the system with all its details
 */
export interface Property {
  // Basic Information
  id: string;
  name: string;
  type: PropertyType;

  // Location
  location: {
    estate: string;
    county: string;
    coordinates: [number, number]; // [longitude, latitude]
  };

  // Units
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  occupancyRate: number; // Calculated: (occupiedUnits / totalUnits) * 100

  // Pricing
  pricePerUnit: number;
  monthlyRentals: number; // Calculated: sum of all occupied unit prices
  currency: string; // e.g., "KES"

  // Metadata
  rating: number; // 0-5
  totalViews: number;
  propertyIcon: string; // Path to icon asset

  // Ownership
  ownerId: string;
  agentIds: string[];

  // Timestamps
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

/**
 * Unit Interface
 * Represents an individual unit within a property
 */
export interface Unit {
  // Basic Information
  id: string;
  propertyId: string;
  roomNumber: string; // Customizable: "A5", "B12", "101", "Room 1"
  status: UnitStatus;

  // Unit Details
  bedrooms: number;
  bathrooms: number;
  size?: number; // Square feet
  price: number;

  // Tenant Information
  tenantId?: string;
  leaseStartDate?: string; // ISO date string
  leaseEndDate?: string; // ISO date string

  // Metadata
  lastUpdated: string; // ISO date string
  updatedBy: string; // User ID who last updated
}

/**
 * Analytics Interface
 * Represents aggregated analytics data for properties
 */
export interface Analytics {
  // Aggregated Metrics
  totalProperties: number;
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  occupancyRate: number; // (occupiedUnits / totalUnits) * 100

  // Performance
  totalViews: number;
  totalRevenue: number;

  // Time Period
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string; // ISO date string
  endDate: string; // ISO date string
}

/**
 * Agent Interface
 * Represents a property agent who manages properties
 */
export interface Agent {
  // Basic Information
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;

  // Assignment
  assignedProperties: string[]; // Property IDs
  totalProperties: number;

  // Performance
  rating: number; // 0-5

  // Status
  hireDate: string; // ISO date string
  status: 'active' | 'inactive';
}

/**
 * API Response Types
 */

/**
 * PropertiesResponse
 * Response structure for fetching multiple properties with pagination
 */
export interface PropertiesResponse {
  properties: Property[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
  };
}

/**
 * UnitsResponse
 * Response structure for fetching units of a specific property
 */
export interface UnitsResponse {
  units: Unit[];
  property: Property;
}

/**
 * UpdateUnitStatusRequest
 * Request structure for updating a unit's status
 */
export interface UpdateUnitStatusRequest {
  unitId: string;
  newStatus: UnitStatus;
  updatedBy: string;
}

/**
 * UpdateUnitStatusResponse
 * Response structure after updating a unit's status
 */
export interface UpdateUnitStatusResponse {
  unit: Unit;
  property: Property; // Updated property with new counts
}

