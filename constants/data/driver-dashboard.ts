/**
 * Mock Data for Driver Dashboard Module
 * 
 * Used for development and testing without backend dependency.
 */

import type {
    ActiveMove,
    DashboardData,
    DriverMetrics,
    DriverProfile,
    MoveRequest,
} from '@/modules/driver-dashboard/types';

export const mockDriverProfile: DriverProfile = {
  id: 'driver-001',
  name: 'John Kamau',
  email: 'john.kamau@masqany.com',
  phone: '+254712345678',
  profilePhotoUrl: 'https://i.pravatar.cc/150?img=12',
  isVerified: true,
  excellenceRating: 4.8,
  currentLocation: 'Westlands, Nairobi',
  vehicleId: 'vehicle-001',
  licenseNumber: 'KBZ 123A',
  createdAt: '2023-01-15T08:00:00Z',
  updatedAt: '2024-01-20T10:30:00Z',
};

export const mockDriverMetrics: DriverMetrics = {
  totalTrips: 247,
  weeklyIncome: 45000, // KES
  totalClients: 189,
  totalDistanceKm: 3420,
  lastUpdated: new Date().toISOString(),
};

export const mockActiveMoves: ActiveMove[] = [
  {
    id: 'move-001',
    clientId: 'client-001',
    clientName: 'Sarah Wanjiku',
    clientPhone: '+254722334455',
    houseType: '2 Bedroom',
    pickupLocation: 'Kilimani, Nairobi',
    destinationLocation: 'Karen, Nairobi',
    scheduledStartTime: new Date(Date.now() + 25 * 60 * 1000).toISOString(), // 25 minutes from now
    status: 'accepted',
    isUrgent: true,
    minutesUntilStart: 25,
    serviceCost: 8500,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'move-002',
    clientId: 'client-002',
    clientName: 'David Omondi',
    clientPhone: '+254733445566',
    houseType: 'Studio',
    pickupLocation: 'Parklands, Nairobi',
    destinationLocation: 'Ruaka, Kiambu',
    scheduledStartTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
    status: 'accepted',
    isUrgent: false,
    minutesUntilStart: 180,
    serviceCost: 5500,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockUpcomingMoves: MoveRequest[] = [
  {
    id: 'request-001',
    clientId: 'client-003',
    clientName: 'Mary Njeri',
    unitType: 'Bedsitter',
    serviceCost: 4500,
    pickupLocation: 'Ngong Road, Nairobi',
    destinationLocation: 'Rongai, Kajiado',
    timeAllocated: 3,
    scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    scheduledTime: '09:00',
    status: 'available',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'request-002',
    clientId: 'client-004',
    clientName: 'Peter Mwangi',
    unitType: '3 Bedroom',
    serviceCost: 12000,
    pickupLocation: 'Lavington, Nairobi',
    destinationLocation: 'Runda, Nairobi',
    timeAllocated: 5,
    scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    scheduledTime: '14:00',
    status: 'available',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'request-003',
    clientId: 'client-005',
    clientName: 'Grace Akinyi',
    unitType: '1 Bedroom',
    serviceCost: 6500,
    pickupLocation: 'South B, Nairobi',
    destinationLocation: 'Syokimau, Machakos',
    timeAllocated: 4,
    scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    scheduledTime: '11:30',
    status: 'available',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
];

export const mockDashboardData: DashboardData = {
  profile: mockDriverProfile,
  metrics: mockDriverMetrics,
  activeMoves: mockActiveMoves,
  upcomingMoves: mockUpcomingMoves,
};
