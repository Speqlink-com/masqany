// Property Admin Module - Mock Data
// This file contains realistic mock data for development and testing

import { Agent, Analytics, Property, Unit } from '@/modules/property-admin/types';

/**
 * Mock Properties
 * 5 properties with varied types, locations, and occupancy rates
 */
export const mockProperties: Property[] = [
  {
    id: 'prop-001',
    name: 'Kilimani Heights',
    type: '2_bedroom',
    location: {
      estate: 'Kilimani',
      county: 'Nairobi',
      coordinates: [36.7821, -1.2921],
    },
    totalUnits: 40,
    occupiedUnits: 35,
    vacantUnits: 5,
    occupancyRate: 87.5, // (35 / 40) * 100
    pricePerUnit: 45000,
    monthlyRentals: 1575000, // 35 * 45000
    currency: 'KES',
    rating: 4.5,
    totalViews: 1234,
    propertyIcon: 'assets/icons/house-icon.webp',
    ownerId: 'owner-001',
    agentIds: ['agent-001', 'agent-002'],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
  },
  {
    id: 'prop-002',
    name: 'Westlands Residency',
    type: '1_bedroom',
    location: {
      estate: 'Westlands',
      county: 'Nairobi',
      coordinates: [36.8097, -1.2676],
    },
    totalUnits: 24,
    occupiedUnits: 20,
    vacantUnits: 4,
    occupancyRate: 83.33, // (20 / 24) * 100
    pricePerUnit: 35000,
    monthlyRentals: 700000, // 20 * 35000
    currency: 'KES',
    rating: 4.2,
    totalViews: 892,
    propertyIcon: 'assets/icons/house-icon.webp',
    ownerId: 'owner-001',
    agentIds: ['agent-001'],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T11:20:00Z',
  },
  {
    id: 'prop-003',
    name: 'Karen Gardens',
    type: '3_bedroom',
    location: {
      estate: 'Karen',
      county: 'Nairobi',
      coordinates: [36.7073, -1.3197],
    },
    totalUnits: 30,
    occupiedUnits: 28,
    vacantUnits: 2,
    occupancyRate: 93.33, // (28 / 30) * 100
    pricePerUnit: 75000,
    monthlyRentals: 2100000, // 28 * 75000
    currency: 'KES',
    rating: 4.8,
    totalViews: 2156,
    propertyIcon: 'assets/icons/house-icon.webp',
    ownerId: 'owner-001',
    agentIds: ['agent-002', 'agent-003'],
    createdAt: '2023-12-05T08:15:00Z',
    updatedAt: '2024-01-22T16:30:00Z',
  },
  {
    id: 'prop-004',
    name: 'Lavington Suites',
    type: 'bedsitter',
    location: {
      estate: 'Lavington',
      county: 'Nairobi',
      coordinates: [36.7685, -1.2833],
    },
    totalUnits: 50,
    occupiedUnits: 38,
    vacantUnits: 12,
    occupancyRate: 76.0, // (38 / 50) * 100
    pricePerUnit: 25000,
    monthlyRentals: 950000, // 38 * 25000
    currency: 'KES',
    rating: 4.0,
    totalViews: 1567,
    propertyIcon: 'assets/icons/house-icon.webp',
    ownerId: 'owner-001',
    agentIds: ['agent-003'],
    createdAt: '2024-01-20T12:00:00Z',
    updatedAt: '2024-01-25T09:45:00Z',
  },
  {
    id: 'prop-005',
    name: 'Runda Villas',
    type: '4_bedroom_plus',
    location: {
      estate: 'Runda',
      county: 'Nairobi',
      coordinates: [36.8167, -1.2167],
    },
    totalUnits: 20,
    occupiedUnits: 18,
    vacantUnits: 2,
    occupancyRate: 90.0, // (18 / 20) * 100
    pricePerUnit: 120000,
    monthlyRentals: 2160000, // 18 * 120000
    currency: 'KES',
    rating: 4.9,
    totalViews: 3421,
    propertyIcon: 'assets/icons/house-icon.webp',
    ownerId: 'owner-001',
    agentIds: ['agent-001', 'agent-004'],
    createdAt: '2023-11-10T14:20:00Z',
    updatedAt: '2024-01-19T11:15:00Z',
  },
];

/**
 * Mock Units
 * Units for each property with varied statuses
 */
export const mockUnits: Record<string, Unit[]> = {
  // Kilimani Heights - 40 units (35 occupied, 5 vacant)
  'prop-001': [
    // Occupied units (35)
    ...Array.from({ length: 35 }, (_, i) => ({
      id: `unit-001-${String(i + 1).padStart(3, '0')}`,
      propertyId: 'prop-001',
      roomNumber: `A${i + 1}`,
      status: 'occupied' as const,
      bedrooms: 2,
      bathrooms: 2,
      size: 1200,
      price: 45000,
      tenantId: `tenant-001-${String(i + 1).padStart(3, '0')}`,
      leaseStartDate: '2024-01-01T00:00:00Z',
      leaseEndDate: '2024-12-31T23:59:59Z',
      lastUpdated: '2024-01-15T10:30:00Z',
      updatedBy: 'owner-001',
    })),
    // Vacant units (5)
    ...Array.from({ length: 5 }, (_, i) => ({
      id: `unit-001-${String(i + 36).padStart(3, '0')}`,
      propertyId: 'prop-001',
      roomNumber: `A${i + 36}`,
      status: 'vacant' as const,
      bedrooms: 2,
      bathrooms: 2,
      size: 1200,
      price: 45000,
      lastUpdated: '2024-01-20T14:45:00Z',
      updatedBy: 'owner-001',
    })),
  ],

  // Westlands Residency - 24 units (20 occupied, 2 vacant_soon, 2 vacant)
  'prop-002': [
    // Occupied units (20)
    ...Array.from({ length: 20 }, (_, i) => ({
      id: `unit-002-${String(i + 1).padStart(3, '0')}`,
      propertyId: 'prop-002',
      roomNumber: `B${i + 1}`,
      status: 'occupied' as const,
      bedrooms: 1,
      bathrooms: 1,
      size: 800,
      price: 35000,
      tenantId: `tenant-002-${String(i + 1).padStart(3, '0')}`,
      leaseStartDate: '2024-01-01T00:00:00Z',
      leaseEndDate: '2024-12-31T23:59:59Z',
      lastUpdated: '2024-01-10T09:00:00Z',
      updatedBy: 'agent-001',
    })),
    // Vacant soon units (2)
    ...Array.from({ length: 2 }, (_, i) => ({
      id: `unit-002-${String(i + 21).padStart(3, '0')}`,
      propertyId: 'prop-002',
      roomNumber: `B${i + 21}`,
      status: 'vacant_soon' as const,
      bedrooms: 1,
      bathrooms: 1,
      size: 800,
      price: 35000,
      tenantId: `tenant-002-${String(i + 21).padStart(3, '0')}`,
      leaseStartDate: '2023-06-01T00:00:00Z',
      leaseEndDate: '2024-02-28T23:59:59Z',
      lastUpdated: '2024-01-18T11:20:00Z',
      updatedBy: 'agent-001',
    })),
    // Vacant units (2)
    ...Array.from({ length: 2 }, (_, i) => ({
      id: `unit-002-${String(i + 23).padStart(3, '0')}`,
      propertyId: 'prop-002',
      roomNumber: `B${i + 23}`,
      status: 'vacant' as const,
      bedrooms: 1,
      bathrooms: 1,
      size: 800,
      price: 35000,
      lastUpdated: '2024-01-18T11:20:00Z',
      updatedBy: 'agent-001',
    })),
  ],

  // Karen Gardens - 30 units (28 occupied, 2 vacant)
  'prop-003': [
    // Occupied units (28)
    ...Array.from({ length: 28 }, (_, i) => ({
      id: `unit-003-${String(i + 1).padStart(3, '0')}`,
      propertyId: 'prop-003',
      roomNumber: `C${i + 1}`,
      status: 'occupied' as const,
      bedrooms: 3,
      bathrooms: 2,
      size: 1500,
      price: 75000,
      tenantId: `tenant-003-${String(i + 1).padStart(3, '0')}`,
      leaseStartDate: '2024-01-01T00:00:00Z',
      leaseEndDate: '2024-12-31T23:59:59Z',
      lastUpdated: '2023-12-05T08:15:00Z',
      updatedBy: 'agent-002',
    })),
    // Vacant units (2)
    ...Array.from({ length: 2 }, (_, i) => ({
      id: `unit-003-${String(i + 29).padStart(3, '0')}`,
      propertyId: 'prop-003',
      roomNumber: `C${i + 29}`,
      status: 'vacant' as const,
      bedrooms: 3,
      bathrooms: 2,
      size: 1500,
      price: 75000,
      lastUpdated: '2024-01-22T16:30:00Z',
      updatedBy: 'agent-002',
    })),
  ],

  // Lavington Suites - 50 units (38 occupied, 5 vacant_soon, 7 vacant)
  'prop-004': [
    // Occupied units (38)
    ...Array.from({ length: 38 }, (_, i) => ({
      id: `unit-004-${String(i + 1).padStart(3, '0')}`,
      propertyId: 'prop-004',
      roomNumber: `${i + 1}`,
      status: 'occupied' as const,
      bedrooms: 0,
      bathrooms: 1,
      size: 400,
      price: 25000,
      tenantId: `tenant-004-${String(i + 1).padStart(3, '0')}`,
      leaseStartDate: '2024-01-01T00:00:00Z',
      leaseEndDate: '2024-12-31T23:59:59Z',
      lastUpdated: '2024-01-20T12:00:00Z',
      updatedBy: 'agent-003',
    })),
    // Vacant soon units (5)
    ...Array.from({ length: 5 }, (_, i) => ({
      id: `unit-004-${String(i + 39).padStart(3, '0')}`,
      propertyId: 'prop-004',
      roomNumber: `${i + 39}`,
      status: 'vacant_soon' as const,
      bedrooms: 0,
      bathrooms: 1,
      size: 400,
      price: 25000,
      tenantId: `tenant-004-${String(i + 39).padStart(3, '0')}`,
      leaseStartDate: '2023-07-01T00:00:00Z',
      leaseEndDate: '2024-02-28T23:59:59Z',
      lastUpdated: '2024-01-25T09:45:00Z',
      updatedBy: 'agent-003',
    })),
    // Vacant units (7)
    ...Array.from({ length: 7 }, (_, i) => ({
      id: `unit-004-${String(i + 44).padStart(3, '0')}`,
      propertyId: 'prop-004',
      roomNumber: `${i + 44}`,
      status: 'vacant' as const,
      bedrooms: 0,
      bathrooms: 1,
      size: 400,
      price: 25000,
      lastUpdated: '2024-01-25T09:45:00Z',
      updatedBy: 'agent-003',
    })),
  ],

  // Runda Villas - 20 units (18 occupied, 1 vacant_soon, 1 vacant)
  'prop-005': [
    // Occupied units (18)
    ...Array.from({ length: 18 }, (_, i) => ({
      id: `unit-005-${String(i + 1).padStart(3, '0')}`,
      propertyId: 'prop-005',
      roomNumber: `Villa ${i + 1}`,
      status: 'occupied' as const,
      bedrooms: 4,
      bathrooms: 3,
      size: 2500,
      price: 120000,
      tenantId: `tenant-005-${String(i + 1).padStart(3, '0')}`,
      leaseStartDate: '2024-01-01T00:00:00Z',
      leaseEndDate: '2024-12-31T23:59:59Z',
      lastUpdated: '2023-11-10T14:20:00Z',
      updatedBy: 'agent-001',
    })),
    // Vacant soon unit (1)
    {
      id: 'unit-005-019',
      propertyId: 'prop-005',
      roomNumber: 'Villa 19',
      status: 'vacant_soon' as const,
      bedrooms: 4,
      bathrooms: 3,
      size: 2500,
      price: 120000,
      tenantId: 'tenant-005-019',
      leaseStartDate: '2023-05-01T00:00:00Z',
      leaseEndDate: '2024-02-28T23:59:59Z',
      lastUpdated: '2024-01-19T11:15:00Z',
      updatedBy: 'agent-001',
    },
    // Vacant unit (1)
    {
      id: 'unit-005-020',
      propertyId: 'prop-005',
      roomNumber: 'Villa 20',
      status: 'vacant' as const,
      bedrooms: 4,
      bathrooms: 3,
      size: 2500,
      price: 120000,
      lastUpdated: '2024-01-19T11:15:00Z',
      updatedBy: 'agent-001',
    },
  ],
};

/**
 * Mock Analytics
 * Aggregated analytics data across all properties
 */
export const mockAnalytics: Analytics = {
  totalProperties: 5,
  totalUnits: 164, // 40 + 24 + 30 + 50 + 20
  occupiedUnits: 139, // 35 + 20 + 28 + 38 + 18
  vacantUnits: 25, // 5 + 4 + 2 + 12 + 2
  occupancyRate: 84.76, // (139 / 164) * 100
  totalViews: 9270, // 1234 + 892 + 2156 + 1567 + 3421
  totalRevenue: 7485000, // 1575000 + 700000 + 2100000 + 950000 + 2160000
  period: 'monthly',
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-01-31T23:59:59Z',
};

/**
 * Mock Agents
 * Property agents managing the properties
 */
export const mockAgents: Agent[] = [
  {
    id: 'agent-001',
    name: 'John Kamau',
    email: 'john.kamau@masqany.com',
    phone: '+254712345678',
    avatar: 'https://i.pravatar.cc/150?img=12',
    assignedProperties: ['prop-001', 'prop-002', 'prop-005'],
    totalProperties: 3,
    rating: 4.7,
    hireDate: '2023-06-15T00:00:00Z',
    status: 'active',
  },
  {
    id: 'agent-002',
    name: 'Mary Wanjiku',
    email: 'mary.wanjiku@masqany.com',
    phone: '+254723456789',
    avatar: 'https://i.pravatar.cc/150?img=45',
    assignedProperties: ['prop-001', 'prop-003'],
    totalProperties: 2,
    rating: 4.9,
    hireDate: '2023-08-20T00:00:00Z',
    status: 'active',
  },
  {
    id: 'agent-003',
    name: 'David Omondi',
    email: 'david.omondi@masqany.com',
    phone: '+254734567890',
    avatar: 'https://i.pravatar.cc/150?img=33',
    assignedProperties: ['prop-003', 'prop-004'],
    totalProperties: 2,
    rating: 4.5,
    hireDate: '2023-09-10T00:00:00Z',
    status: 'active',
  },
  {
    id: 'agent-004',
    name: 'Grace Akinyi',
    email: 'grace.akinyi@masqany.com',
    phone: '+254745678901',
    avatar: 'https://i.pravatar.cc/150?img=27',
    assignedProperties: ['prop-005'],
    totalProperties: 1,
    rating: 4.8,
    hireDate: '2023-10-05T00:00:00Z',
    status: 'active',
  },
  {
    id: 'agent-005',
    name: 'Peter Mwangi',
    email: 'peter.mwangi@masqany.com',
    phone: '+254756789012',
    avatar: 'https://i.pravatar.cc/150?img=51',
    assignedProperties: [],
    totalProperties: 0,
    rating: 4.3,
    hireDate: '2024-01-15T00:00:00Z',
    status: 'active',
  },
];
