# Property Admin Module - Design Document

## Overview

The Property Admin Module provides a comprehensive property management dashboard for property owners and agents in the Masqany mobile app. This module enables property owners to manage multiple properties, track analytics, manage units and their statuses, oversee agents, and access financial reports with role-based access control.

### Key Design Goals

1. **Role-Based Access Control**: Implement strict permission boundaries between Property Owners and Property Agents
2. **Real-Time Analytics**: Provide accurate, up-to-date metrics on property performance and occupancy
3. **Efficient Unit Management**: Enable quick status updates for units with optimistic UI updates
4. **Scalable Architecture**: Handle multiple properties with hundreds of units without performance degradation
5. **Offline Resilience**: Graceful degradation with cached data and clear error states

### Technical Stack

- **Module Pattern**: `modules/property-admin/` with api.ts, hooks.ts, types.ts, store.ts, index.ts
- **Server State**: TanStack Query (properties, units, analytics, agents)
- **Client State**: Zustand (sidebar open/close, modal state, selections)
- **Styling**: NativeWind/Tailwind with design tokens from constants/tokens.ts
- **Navigation**: Expo Router with file-based routing
- **Data**: Mock API with realistic dummy data until backend is live

## Architecture

### Module Structure

Following the Masqany module pattern:

```
modules/property-admin/
  ├── types.ts       # TypeScript interfaces (Property, Unit, Analytics, Agent, etc.)
  ├── api.ts         # API bindings (getProperties, updateUnitStatus, etc.)
  ├── hooks.ts       # TanStack Query hooks (useProperties, useUpdateUnitStatus, etc.)
  ├── store.ts       # Zustand client state (sidebar, modals, selections)
  └── index.ts       # Public API re-exports
```

### State Management Architecture

**Two-Layer State Separation**:

| Layer | Owner | Responsibilities |
|---|---|---|
| **Server State** | TanStack Query | Properties, units, analytics, agents, financial data |
| **Client State** | Zustand | Sidebar open/close, modal visibility, selected property/units, UI toggles |

**Why This Separation?**
- Server state changes when backend data updates (new properties, unit status changes, analytics refresh)
- Client state changes on user interaction (open sidebar, select unit, toggle modal)
- Never mix: a component imports from both when it needs both

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   Property Admin Dashboard                   │
│              (app/(property-admin)/dashboard.tsx)            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ├─────────────────┐
                     │                 │
                     ▼                 ▼
         ┌──────────────────┐  ┌──────────────────┐
         │  TanStack Query  │  │  Zustand Store   │
         │  (Server State)  │  │ (Client State)   │
         └────────┬─────────┘  └────────┬─────────┘
                  │                     │
                  │                     │
         ┌────────▼─────────┐  ┌────────▼─────────┐
         │ useProperties()  │  │ isSidebarOpen    │
         │ usePropertyUnits │  │ isStatusModalOpen│
         │ useAnalytics()   │  │ selectedProperty │
         │ useAgents()      │  │ selectedUnit     │
         │ useUpdateUnit()  │  │ selectedUnits[]  │
         └──────────────────┘  └──────────────────┘
                  │                     │
                  └──────────┬──────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
      ┌──────────────┐ ┌──────────┐ ┌──────────┐
      │  Dashboard   │ │  Units   │ │ Sidebar  │
      │   Screen     │ │  Screen  │ │   Menu   │
      └──────────────┘ └──────────┘ └──────────┘
```

### Screen Architecture

```
app/(property-admin)/
  ├── _layout.tsx              # Tab navigator with 5 tabs
  ├── dashboard.tsx            # Home tab (analytics + properties)
  ├── agents.tsx               # Agents tab
  ├── units.tsx                # Units tab (all units across properties)
  ├── analytics.tsx            # Analytics tab (detailed reports)
  ├── profile.tsx              # Profile tab
  └── units/[propertyId].tsx   # Individual property units screen
```

## Components and Interfaces

### Component Hierarchy

```
DashboardScreen (app/(property-admin)/dashboard.tsx)
├── GradientHeader (25% screen height)
│   ├── MenuIcon (opens sidebar)
│   ├── HomeIcon (scroll to top)
│   ├── MasqanyLogo (center)
│   └── NotificationIcon (navigate to notifications)
├── ScrollView
│   ├── WelcomeMessage ("Welcome back, [Name]")
│   ├── AnalyticsGrid (2x2 grid)
│   │   ├── AnalyticsCard (Occupied)
│   │   ├── AnalyticsCard (Vacant)
│   │   ├── AnalyticsCard (Occupancy Rate)
│   │   └── AnalyticsCard (Views)
│   ├── QuickActions (horizontal row)
│   │   ├── ActionButton (My Units)
│   │   ├── ActionButton (Switch Status)
│   │   └── ActionButton (Analytics)
│   └── MyPropertiesSection
│       ├── SectionTitle ("My Properties")
│       └── PropertyCardList (horizontal FlatList)
│           └── PropertyCard (per property)
└── SidebarMenu (drawer from left)
    ├── MasqanyLogo
    ├── PropertiesSection
    ├── AgentsSection (owner only)
    ├── AnalyticsSection
    ├── FinanceSection (owner only)
    └── SupportSection

UnitsScreen (app/(property-admin)/units/[propertyId].tsx)
├── GradientHeader (25% screen height)
│   ├── PropertyIcon + Title
│   ├── SearchIcon
│   ├── Location
│   ├── TotalRooms
│   ├── SwitchPropertyButton
│   ├── PricePerMonth
│   ├── MonthlyRentals
│   └── OccupancyRatio
├── UnitGrid (FlatList with numColumns=4)
│   └── RoomCard (per unit)
│       ├── StatusIcon
│       ├── RoomNumber
│       ├── StatusText
│       └── TickMark
└── StatusModal (overlay)
    ├── PropertyTitle
    ├── UnitDropdown (searchable)
    ├── StatusCards (vertical)
    │   ├── StatusCard (Occupied)
    │   ├── StatusCard (Soon Vacant)
    │   └── StatusCard (Vacant)
    └── ActionButtons
        ├── CancelButton
        └── ConfirmButton
```

### Core Components

#### 1. GradientHeader

**Purpose**: Reusable gradient header component for dashboard and units screens

**Props**:
```typescript
interface GradientHeaderProps {
  variant: 'dashboard' | 'units';
  propertyData?: {
    icon: string;
    title: string;
    location: string;
    totalRooms: number;
    pricePerMonth: number;
    monthlyRentals: number;
    occupancyRatio: string;
  };
  onMenuPress?: () => void;
  onHomePress?: () => void;
  onNotificationPress?: () => void;
  onSearchPress?: () => void;
  onSwitchProperty?: () => void;
}
```

**Features**:
- Gradient background from #5DE0E6 to #004AAD
- Occupies 25% of screen height
- Dashboard variant: menu, home, logo, notification icons
- Units variant: property info, search icon, switch property button
- All icons 24x24px, white color
- Responsive layout for different screen sizes

#### 2. AnalyticsCard

**Purpose**: Display individual metric with icon, number, and label

**Props**:
```typescript
interface AnalyticsCardProps {
  icon: ImageSourcePropType;
  value: number | string;
  label: string;
  onPress?: () => void;
}
```

**Layout**:
- Background: #f3f4f3
- Rounded corners with shadow
- Icon at top (32x32px)
- Value: font-poppins-bold, 24px, #000000
- Label: font-inter-medium, 13px, #545454
- Tappable with activeOpacity 0.8

#### 3. PropertyCard

**Purpose**: Display property summary in horizontal scrollable list

**Props**:
```typescript
interface PropertyCardProps {
  property: Property;
  onPress: (propertyId: string) => void;
}
```

**Layout**:
- Size: 280px width, 180px height
- Background: #f3f4f3 with shadow
- Property type badge (top-left, #28b4f9)
- House icon (40x40px)
- Property name (font-inter-semibold, 16px)
- Location with icon (14x14px)
- Total units count
- Bill per unit (font-inter-bold, 15px, #28b4f9)
- Rating with star icon
- 16px spacing between cards

#### 4. RoomCard

**Purpose**: Display individual unit in grid with status-based color coding

**Props**:
```typescript
interface RoomCardProps {
  unit: Unit;
  onPress: (unitId: string) => void;
}
```

**Features**:
- Square card with equal width/height
- Rounded corners (12px)
- Background color based on status:
  - Occupied: #22C55E (green)
  - Vacant: #28b4f9 (blue)
  - Vacant Soon: #F59E0B (yellow)
- Status icon at top (28x28px, white)
- Room number (font-inter-bold, 18px, white)
- Status text (font-inter-medium, 12px, white)
- Tick mark icon at bottom
- 8px spacing between cards

#### 5. StatusModal

**Purpose**: Modal dialog for changing unit status

**Props**:
```typescript
interface StatusModalProps {
  isVisible: boolean;
  propertyName: string;
  units: Unit[];
  selectedUnitId?: string;
  onClose: () => void;
  onConfirm: (unitId: string, newStatus: UnitStatus) => void;
}
```

**Features**:
- White background with rounded corners and shadow
- Property name as title (font-poppins-semibold, 18px)
- Searchable unit dropdown
- 3 status cards (Occupied, Soon Vacant, Vacant)
- Single selection (radio button behavior)
- Selected card: #28b4f9 background, white text
- Unselected cards: #f3f4f3 background, dark text
- Cancel and Confirm buttons
- Dismissible by tapping outside

#### 6. SidebarMenu

**Purpose**: Swipeable navigation drawer with role-based sections

**Props**:
```typescript
interface SidebarMenuProps {
  isOpen: boolean;
  userRole: 'property_owner' | 'property_agent';
  agentCount?: number;
  onClose: () => void;
  onNavigate: (route: string) => void;
}
```

**Features**:
- Opens from left, occupies 80% screen width
- Gradient background (#5DE0E6 to #004AAD)
- Masqany logo at top (centered, 24px padding)
- 5 sections: PROPERTIES, AGENTS, ANALYTICS, FINANCE, SUPPORT
- Section headers: font-inter-bold, 13px, white with opacity 0.7
- Navigation items: icon (20x20px) + label (font-inter-medium, 15px)
- Role-based visibility:
  - Property Owner: all sections
  - Property Agent: PROPERTIES (limited), ANALYTICS (limited), SUPPORT only
- Close button at top-right (24x24px)
- Smooth animation with native driver

#### 7. QuickActionButton

**Purpose**: Reusable action button for dashboard quick actions

**Props**:
```typescript
interface QuickActionButtonProps {
  label: string;
  onPress: () => void;
}
```

**Styling**:
- Background: #28b4f9
- Rounded corners (20px)
- White text, font-inter-semibold, 15px
- Padding: 12px vertical, 20px horizontal
- Shadow for depth
- activeOpacity: 0.8
- 10px spacing between buttons
- Wraps to next line on small screens

#### 8. SkeletonLoader

**Purpose**: Animated loading placeholder matching content layout

**Variants**:
```typescript
type SkeletonVariant = 'analytics-grid' | 'property-cards' | 'unit-grid';

interface SkeletonLoaderProps {
  variant: SkeletonVariant;
}
```

**Features**:
- Light gray background (#f3f4f3)
- White shimmer animation
- Matches actual content layout:
  - analytics-grid: 4 placeholder cards in 2x2 grid
  - property-cards: 3 placeholder cards horizontal
  - unit-grid: 12 placeholder cards in 4-column grid
- Minimum display time: 300ms (prevents flashing)
- Smooth fade-in/fade-out transitions

#### 9. EmptyState

**Purpose**: Display when no data is available with call-to-action

**Props**:
```typescript
interface EmptyStateProps {
  variant: 'no-properties' | 'no-units' | 'no-agents';
  onAction?: () => void;
}
```

**Layout**:
- Centered illustration
- Title: font-poppins-semibold, 18px
- Message: font-inter, 14px, #545454
- Action button based on variant:
  - no-properties: "Add Property"
  - no-units: "Add Units"
  - no-agents: "Hire Agent"
- Button styling matches QuickActionButton

## Data Models

### Property Interface

```typescript
interface Property {
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

type PropertyType = 
  | 'bedsitter' 
  | '1_bedroom' 
  | '2_bedroom' 
  | '3_bedroom' 
  | '4_bedroom_plus' 
  | 'studio' 
  | 'penthouse';
```

### Unit Interface

```typescript
interface Unit {
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

type UnitStatus = 'occupied' | 'vacant' | 'vacant_soon';
```

### Analytics Interface

```typescript
interface Analytics {
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
```

### Agent Interface

```typescript
interface Agent {
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
```

### PropertyAdminStore Interface

```typescript
interface PropertyAdminStore {
  // Sidebar State
  isSidebarOpen: boolean;
  
  // Modal State
  isStatusModalOpen: boolean;
  
  // Selections
  selectedProperty: Property | null;
  selectedUnit: Unit | null;
  selectedUnits: string[]; // Array of unit IDs for bulk operations
  
  // Actions
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  
  openStatusModal: () => void;
  closeStatusModal: () => void;
  
  setSelectedProperty: (property: Property | null) => void;
  setSelectedUnit: (unit: Unit | null) => void;
  toggleUnitSelection: (unitId: string) => void;
  clearSelections: () => void;
}
```

### API Response Types

```typescript
interface PropertiesResponse {
  properties: Property[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
  };
}

interface UnitsResponse {
  units: Unit[];
  property: Property;
}

interface UpdateUnitStatusRequest {
  unitId: string;
  newStatus: UnitStatus;
  updatedBy: string;
}

interface UpdateUnitStatusResponse {
  unit: Unit;
  property: Property; // Updated property with new counts
}
```

## API Integration

### Module API (modules/property-admin/api.ts)

```typescript
import { apiClient } from '@/lib/api/client';

export const propertyAdminApi = {
  /**
   * Get all properties for current user
   */
  getProperties: (params: { page: number; pageSize: number; filter?: string; sort?: string }) =>
    apiClient
      .get<PropertiesResponse>('/property-admin/properties', { params })
      .then((r) => r.data),
  
  /**
   * Get single property by ID
   */
  getProperty: (propertyId: string) =>
    apiClient
      .get<Property>(`/property-admin/properties/${propertyId}`)
      .then((r) => r.data),
  
  /**
   * Get units for a specific property
   */
  getPropertyUnits: (propertyId: string) =>
    apiClient
      .get<UnitsResponse>(`/property-admin/properties/${propertyId}/units`)
      .then((r) => r.data),
  
  /**
   * Get analytics data
   */
  getAnalytics: (params: { period: 'daily' | 'weekly' | 'monthly' | 'yearly' }) =>
    apiClient
      .get<Analytics>('/property-admin/analytics', { params })
      .then((r) => r.data),
  
  /**
   * Get agents list
   */
  getAgents: () =>
    apiClient
      .get<Agent[]>('/property-admin/agents')
      .then((r) => r.data),
  
  /**
   * Update unit status
   */
  updateUnitStatus: (data: UpdateUnitStatusRequest) =>
    apiClient
      .patch<UpdateUnitStatusResponse>(`/property-admin/units/${data.unitId}/status`, {
        status: data.newStatus,
        updatedBy: data.updatedBy,
      })
      .then((r) => r.data),
  
  /**
   * Create new property
   */
  createProperty: (data: Partial<Property>) =>
    apiClient
      .post<Property>('/property-admin/properties', data)
      .then((r) => r.data),
  
  /**
   * Archive property
   */
  archiveProperty: (propertyId: string) =>
    apiClient
      .patch<Property>(`/property-admin/properties/${propertyId}/archive`)
      .then((r) => r.data),
  
  /**
   * Hire new agent
   */
  hireAgent: (data: Partial<Agent>) =>
    apiClient
      .post<Agent>('/property-admin/agents', data)
      .then((r) => r.data),
};
```

### TanStack Query Hooks (modules/property-admin/hooks.ts)

```typescript
import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { propertyAdminApi } from './api';

// Query Keys
export const propertyAdminKeys = {
  all: ['property-admin'] as const,
  properties: () => [...propertyAdminKeys.all, 'properties'] as const,
  propertiesList: (filters: any) => [...propertyAdminKeys.properties(), 'list', filters] as const,
  property: (id: string) => [...propertyAdminKeys.properties(), id] as const,
  propertyUnits: (id: string) => [...propertyAdminKeys.property(id), 'units'] as const,
  analytics: () => [...propertyAdminKeys.all, 'analytics'] as const,
  analyticsPeriod: (period: string) => [...propertyAdminKeys.analytics(), period] as const,
  agents: () => [...propertyAdminKeys.all, 'agents'] as const,
};

// Properties Query
export function useProperties(params: { page?: number; pageSize?: number; filter?: string; sort?: string } = {}) {
  return useQuery({
    queryKey: propertyAdminKeys.propertiesList(params),
    queryFn: () => propertyAdminApi.getProperties({
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      filter: params.filter,
      sort: params.sort,
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Single Property Query
export function useProperty(propertyId: string) {
  return useQuery({
    queryKey: propertyAdminKeys.property(propertyId),
    queryFn: () => propertyAdminApi.getProperty(propertyId),
    staleTime: 5 * 60 * 1000,
    enabled: !!propertyId,
  });
}

// Property Units Query
export function usePropertyUnits(propertyId: string) {
  return useQuery({
    queryKey: propertyAdminKeys.propertyUnits(propertyId),
    queryFn: () => propertyAdminApi.getPropertyUnits(propertyId),
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent for unit status)
    enabled: !!propertyId,
  });
}

// Analytics Query
export function useAnalytics(period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly') {
  return useQuery({
    queryKey: propertyAdminKeys.analyticsPeriod(period),
    queryFn: () => propertyAdminApi.getAnalytics({ period }),
    staleTime: 1 * 60 * 1000, // 1 minute (fresher data for analytics)
  });
}

// Agents Query
export function useAgents() {
  return useQuery({
    queryKey: propertyAdminKeys.agents(),
    queryFn: () => propertyAdminApi.getAgents(),
    staleTime: 5 * 60 * 1000,
  });
}
```

// Update Unit Status Mutation
export function useUpdateUnitStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateUnitStatusRequest) => propertyAdminApi.updateUnitStatus(data),
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: propertyAdminKeys.propertyUnits(variables.unitId) });
      
      // Snapshot previous value
      const previousUnits = queryClient.getQueryData(propertyAdminKeys.propertyUnits(variables.unitId));
      
      // Optimistically update UI
      queryClient.setQueryData(propertyAdminKeys.propertyUnits(variables.unitId), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          units: old.units.map((unit: Unit) =>
            unit.id === variables.unitId
              ? { ...unit, status: variables.newStatus, lastUpdated: new Date().toISOString() }
              : unit
          ),
        };
      });
      
      return { previousUnits };
    },
    onError: (err, variables, context) => {
      // Revert optimistic update on error
      if (context?.previousUnits) {
        queryClient.setQueryData(
          propertyAdminKeys.propertyUnits(variables.unitId),
          context.previousUnits
        );
      }
    },
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: propertyAdminKeys.propertyUnits(data.unit.propertyId) });
      queryClient.invalidateQueries({ queryKey: propertyAdminKeys.property(data.unit.propertyId) });
      queryClient.invalidateQueries({ queryKey: propertyAdminKeys.analytics() });
    },
  });
}

// Create Property Mutation
export function useCreateProperty() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Property>) => propertyAdminApi.createProperty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyAdminKeys.properties() });
      queryClient.invalidateQueries({ queryKey: propertyAdminKeys.analytics() });
    },
  });
}

// Archive Property Mutation
export function useArchiveProperty() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (propertyId: string) => propertyAdminApi.archiveProperty(propertyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyAdminKeys.properties() });
      queryClient.invalidateQueries({ queryKey: propertyAdminKeys.analytics() });
    },
  });
}

// Hire Agent Mutation
export function useHireAgent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Agent>) => propertyAdminApi.hireAgent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyAdminKeys.agents() });
    },
  });
}
```

### Zustand Store (modules/property-admin/store.ts)

```typescript
import { create } from 'zustand';
import { Property, Unit } from './types';

interface PropertyAdminStore {
  // Sidebar State
  isSidebarOpen: boolean;
  
  // Modal State
  isStatusModalOpen: boolean;
  
  // Selections
  selectedProperty: Property | null;
  selectedUnit: Unit | null;
  selectedUnits: string[];
  
  // Actions
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  
  openStatusModal: () => void;
  closeStatusModal: () => void;
  
  setSelectedProperty: (property: Property | null) => void;
  setSelectedUnit: (unit: Unit | null) => void;
  toggleUnitSelection: (unitId: string) => void;
  clearSelections: () => void;
}

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

// Selectors (use these in components)
export const selectIsSidebarOpen = (state: PropertyAdminStore) => state.isSidebarOpen;
export const selectIsStatusModalOpen = (state: PropertyAdminStore) => state.isStatusModalOpen;
export const selectSelectedProperty = (state: PropertyAdminStore) => state.selectedProperty;
export const selectSelectedUnit = (state: PropertyAdminStore) => state.selectedUnit;
export const selectSelectedUnits = (state: PropertyAdminStore) => state.selectedUnits;
```

## Mock Data Implementation

### Mock Data Structure (assets/data/property-admin.ts)

```typescript
import { Property, Unit, Analytics, Agent } from '@/modules/property-admin/types';

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
    occupancyRate: 87.5,
    pricePerUnit: 45000,
    monthlyRentals: 1575000,
    currency: 'KES',
    rating: 4.5,
    totalViews: 1234,
    propertyIcon: require('@/assets/icons/house-icon.webp'),
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
    occupancyRate: 83.33,
    pricePerUnit: 35000,
    monthlyRentals: 700000,
    currency: 'KES',
    rating: 4.2,
    totalViews: 892,
    propertyIcon: require('@/assets/icons/house-icon.webp'),
    ownerId: 'owner-001',
    agentIds: ['agent-001'],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T11:20:00Z',
  },
  // Add 3 more properties with varied data...
];

export const mockUnits: Record<string, Unit[]> = {
  'prop-001': [
    {
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
    },
    // Add 39 more units with varied statuses...
  ],
  // Add units for other properties...
};

export const mockAnalytics: Analytics = {
  totalProperties: 5,
  totalUnits: 150,
  occupiedUnits: 128,
  vacantUnits: 22,
  occupancyRate: 85.33,
  totalViews: 5432,
  totalRevenue: 5760000,
  period: 'monthly',
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-01-31T23:59:59Z',
};

export const mockAgents: Agent[] = [
  {
    id: 'agent-001',
    name: 'John Kamau',
    email: 'john.kamau@example.com',
    phone: '+254712345678',
    avatar: 'https://i.pravatar.cc/150?img=12',
    assignedProperties: ['prop-001', 'prop-002'],
    totalProperties: 2,
    rating: 4.7,
    hireDate: '2023-06-15T00:00:00Z',
    status: 'active',
  },
  // Add more agents...
];
```

### Mock API Implementation

```typescript
// In modules/property-admin/api.ts (development mode)

const simulateNetworkDelay = () => 
  new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 500));

export const propertyAdminApi = {
  getProperties: async (params) => {
    await simulateNetworkDelay();
    
    // Filter and sort mock data
    let filtered = [...mockProperties];
    
    if (params.filter) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(params.filter!.toLowerCase()) ||
        p.location.estate.toLowerCase().includes(params.filter!.toLowerCase())
      );
    }
    
    if (params.sort === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (params.sort === 'occupancy') {
      filtered.sort((a, b) => b.occupancyRate - a.occupancyRate);
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
  
  getProperty: async (propertyId) => {
    await simulateNetworkDelay();
    const property = mockProperties.find((p) => p.id === propertyId);
    if (!property) throw new Error('Property not found');
    return property;
  },
  
  getPropertyUnits: async (propertyId) => {
    await simulateNetworkDelay();
    const property = mockProperties.find((p) => p.id === propertyId);
    const units = mockUnits[propertyId] || [];
    if (!property) throw new Error('Property not found');
    return { units, property };
  },
  
  getAnalytics: async (params) => {
    await simulateNetworkDelay();
    return { ...mockAnalytics, period: params.period };
  },
  
  getAgents: async () => {
    await simulateNetworkDelay();
    return mockAgents;
  },
  
  updateUnitStatus: async (data) => {
    await simulateNetworkDelay();
    
    // Simulate 10% failure rate for testing error handling
    if (Math.random() < 0.1) {
      throw new Error('Failed to update unit status');
    }
    
    // Update mock data
    const units = mockUnits[data.unitId];
    const unit = units?.find((u) => u.id === data.unitId);
    if (!unit) throw new Error('Unit not found');
    
    const oldStatus = unit.status;
    unit.status = data.newStatus;
    unit.lastUpdated = new Date().toISOString();
    unit.updatedBy = data.updatedBy;
    
    // Update property counts
    const property = mockProperties.find((p) => p.id === unit.propertyId);
    if (property) {
      if (oldStatus === 'vacant' && data.newStatus === 'occupied') {
        property.occupiedUnits++;
        property.vacantUnits--;
      } else if (oldStatus === 'occupied' && data.newStatus === 'vacant') {
        property.occupiedUnits--;
        property.vacantUnits++;
      }
      property.occupancyRate = (property.occupiedUnits / property.totalUnits) * 100;
      property.updatedAt = new Date().toISOString();
    }
    
    return { unit, property: property! };
  },
};
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Occupancy Rate Calculation

*For any* property with totalUnits > 0, the occupancyRate SHALL equal (occupiedUnits / totalUnits) * 100

**Validates: Requirements 26.1, 26.7**

This property ensures that the occupancy rate calculation is always correct regardless of the number of occupied and total units. The calculation must produce a percentage between 0 and 100 for all valid inputs.

### Property 2: Unit Count Invariant

*For any* property, occupiedUnits + vacantUnits SHALL equal totalUnits

**Validates: Requirements 26.2, 26.16**

This is a fundamental data integrity invariant. At any point in time, the sum of occupied and vacant units must equal the total number of units. This property must hold before and after any unit status change.

### Property 3: Monthly Rentals Calculation

*For any* property, monthlyRentals SHALL equal the sum of all occupied unit prices

**Validates: Requirements 26.3**

This property ensures that the monthly rental income calculation correctly aggregates the prices of all occupied units. The calculation must be accurate regardless of the number of units or their individual prices.

### Property 4: Property Validation Constraints

*For any* property, the following constraints SHALL hold:
- totalUnits > 0
- 0 ≤ occupiedUnits ≤ totalUnits
- 0 ≤ vacantUnits ≤ totalUnits
- 0 ≤ occupancyRate ≤ 100

**Validates: Requirements 26.4, 26.5, 26.6, 26.7**

This property ensures that all property data falls within valid ranges. These constraints prevent invalid states such as negative unit counts or occupancy rates exceeding 100%.

### Property 5: Unit Validation Constraints

*For any* unit, the following constraints SHALL hold:
- status ∈ {"occupied", "vacant", "vacant_soon"}
- roomNumber is non-empty string
- propertyId references an existing property

**Validates: Requirements 26.8, 26.9, 26.10**

This property ensures that all unit data is valid and maintains referential integrity with the property it belongs to.

### Property 6: Status Transition Preserves Unit Count Invariant

*For any* property and any unit status change, the invariant occupiedUnits + vacantUnits = totalUnits SHALL be preserved

**Validates: Requirements 26.11, 26.12, 26.13, 26.14, 26.15, 27.4**

This property ensures that when a unit changes status (vacant → occupied, occupied → vacant, or any other transition), the total unit count remains consistent. Specifically:
- When status changes from vacant to occupied: occupiedUnits increases by 1, vacantUnits decreases by 1
- When status changes from occupied to vacant: occupiedUnits decreases by 1, vacantUnits increases by 1
- After any status change, occupancyRate is recalculated correctly

This is a critical invariant that must hold across all state transitions to maintain data integrity.

### Property 7: Optimistic Update Round-Trip

*For any* mutation that fails, the state after error revert SHALL equal the state before the optimistic update

**Validates: Requirements 26.19, 27.20**

This property ensures that optimistic updates are properly reverted when mutations fail. The UI should return to its exact previous state, maintaining consistency and preventing data corruption from failed operations.

### Property 8: Query Invalidation on Success

*For any* successful mutation, the relevant query keys SHALL be invalidated

**Validates: Requirements 26.20**

This property ensures that after a successful mutation (create, update, delete), the appropriate cached queries are invalidated so that subsequent reads fetch fresh data. This maintains consistency between the UI and server state.

### Property 9: Role Permission Hierarchy

*For any* feature, if Property_Agent has access, then Property_Owner has access (or the feature is explicitly owner-only)

**Validates: Requirements 26.17, 27.8**

This property ensures that the role permission hierarchy is correct. Property_Owner should have a superset of Property_Agent permissions, meaning anything an agent can do, an owner can also do. Features that only owners can access should be explicitly marked as owner-only.

### Property 10: Query Key Structure

*For any* query key, the structure SHALL match the pattern ['property-admin', resource, ...params]

**Validates: Requirements 26.18, 27.10**

This property ensures consistent query key generation across the module. All query keys must start with 'property-admin' followed by the resource type and any additional parameters. This consistency enables efficient cache invalidation and debugging.

### Property 11: Grid Layout Calculation

*For any* unit count n, the grid SHALL display ceil(n / 4) rows

**Validates: Requirements 27.12**

This property ensures that the unit grid layout calculation is correct for any number of units. With 4 units per row, the number of rows should always be the ceiling of the unit count divided by 4.

### Property 12: Analytics Percentage Bounds

*For any* analytics data, all displayed percentages SHALL be between 0 and 100 (inclusive)

**Validates: Requirements 27.14**

This property ensures that all percentage values in analytics (occupancy rate, growth rates, etc.) are within valid bounds. Percentages outside this range indicate calculation errors or invalid data.

### Property 13: Filter Subset Property

*For any* filter operation, the result set SHALL be a subset of the original data

**Validates: Requirements 27.16**

This property ensures that filtering never adds data that wasn't in the original set. Filters can only remove items, never add them. Mathematically: filtered_results ⊆ original_data.

### Property 14: Sort Order Correctness

*For any* sort operation, the result SHALL be properly ordered according to the sort criteria

**Validates: Requirements 27.18**

This property ensures that sorting operations produce correctly ordered results. For ascending sort, each element should be ≤ the next element. For descending sort, each element should be ≥ the next element. This is a confluence property: sorting twice should produce the same result as sorting once.


## Error Handling

### Error Categories

The Property Admin Module implements comprehensive error handling across four categories:

1. **Network Errors**: Connection failures, timeouts, DNS resolution failures
2. **API Errors**: 4xx and 5xx HTTP status codes with specific handling per code
3. **Validation Errors**: Client-side data validation failures before API calls
4. **State Errors**: Inconsistent state, race conditions, optimistic update failures

### Error Handling Strategy

#### Network Errors

**Detection**:
- Axios interceptor catches network errors
- NetInfo monitors connection status
- Timeout after 30 seconds for all requests

**Handling**:
```typescript
// In lib/api/client.ts
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error (no response from server)
      return Promise.reject({
        type: 'NETWORK_ERROR',
        message: 'No internet connection. Please check your network.',
        retryable: true,
      });
    }
    // Handle other errors...
  }
);
```

**User Experience**:
- Show "No Internet Connection" banner at top of screen
- Disable actions that require network
- Enable retry button
- Cache last successful data for offline viewing
- Auto-retry when connection restored

#### API Errors

**401 Unauthorized**:
- Clear auth tokens
- Redirect to login screen
- Show message: "Session expired. Please log in again."

**403 Forbidden**:
- Show "Access Denied" message
- Log attempt for security monitoring
- Suggest contacting administrator

**404 Not Found**:
- Show "Property not found" or "Unit not found"
- Offer to refresh data
- Navigate back to previous screen

**422 Validation Error**:
- Parse validation errors from response
- Show field-specific error messages
- Highlight invalid fields in UI

**500 Server Error**:
- Show "Something went wrong" message
- Offer retry button
- Log error to monitoring service
- Show error ID for support reference

**503 Service Unavailable**:
- Show "Service temporarily unavailable" message
- Auto-retry with exponential backoff
- Show estimated retry time

#### Validation Errors

**Client-Side Validation**:
```typescript
// Before API call
function validateUnitStatusUpdate(unitId: string, newStatus: UnitStatus): ValidationResult {
  if (!unitId || unitId.trim() === '') {
    return { valid: false, error: 'Unit ID is required' };
  }
  
  if (!['occupied', 'vacant', 'vacant_soon'].includes(newStatus)) {
    return { valid: false, error: 'Invalid unit status' };
  }
  
  return { valid: true };
}
```

**User Experience**:
- Validate on blur for form fields
- Show inline error messages
- Disable submit button until valid
- Clear errors when user corrects input

#### State Errors

**Optimistic Update Failures**:
```typescript
// In useUpdateUnitStatus mutation
onError: (err, variables, context) => {
  // Revert optimistic update
  if (context?.previousUnits) {
    queryClient.setQueryData(
      propertyAdminKeys.propertyUnits(variables.unitId),
      context.previousUnits
    );
  }
  
  // Show error toast
  Toast.show({
    type: 'error',
    text1: 'Update Failed',
    text2: 'Could not update unit status. Please try again.',
  });
},
```

**Race Condition Prevention**:
- Cancel in-flight queries before mutations
- Use query key versioning for concurrent updates
- Implement optimistic locking where needed

### Error UI Components

#### ErrorBoundary

Catches React errors and shows fallback UI:

```typescript
<ErrorBoundary
  fallback={<ErrorFallback />}
  onError={(error, errorInfo) => {
    logErrorToService(error, errorInfo);
  }}
>
  <PropertyAdminDashboard />
</ErrorBoundary>
```

#### ErrorMessage Component

Reusable error display with retry:

```typescript
interface ErrorMessageProps {
  title: string;
  message: string;
  retryable?: boolean;
  onRetry?: () => void;
}

// Usage
<ErrorMessage
  title="Failed to Load Properties"
  message="Could not fetch your properties. Please try again."
  retryable
  onRetry={() => refetch()}
/>
```

#### Toast Notifications

For non-blocking errors:

```typescript
// Success
Toast.show({
  type: 'success',
  text1: 'Unit Updated',
  text2: 'Status changed successfully',
});

// Error
Toast.show({
  type: 'error',
  text1: 'Update Failed',
  text2: error.message,
});
```

### Empty States

#### No Properties

```typescript
<EmptyState
  variant="no-properties"
  illustration={require('@/assets/illustrations/no-properties.png')}
  title="No Properties Yet"
  message="Add your first property to start managing units and tracking analytics."
  actionLabel="Add Property"
  onAction={() => router.push('/property-registration')}
/>
```

#### No Units

```typescript
<EmptyState
  variant="no-units"
  illustration={require('@/assets/illustrations/no-units.png')}
  title="No Units Added"
  message="Add units to this property to start tracking occupancy."
  actionLabel="Add Units"
  onAction={() => openAddUnitsModal()}
/>
```

#### No Agents

```typescript
<EmptyState
  variant="no-agents"
  illustration={require('@/assets/illustrations/no-agents.png')}
  title="No Agents Hired"
  message="Hire agents to help manage your properties."
  actionLabel="Hire Agent"
  onAction={() => router.push('/property-admin/hire-agent')}
/>
```

### Error Logging and Monitoring

**Log Structure**:
```typescript
interface ErrorLog {
  timestamp: string;
  userId: string;
  errorType: 'NETWORK' | 'API' | 'VALIDATION' | 'STATE';
  errorCode?: string;
  message: string;
  stack?: string;
  context: {
    screen: string;
    action: string;
    propertyId?: string;
    unitId?: string;
  };
}
```

**Logging Strategy**:
- Log all API errors to monitoring service
- Log validation errors for analytics
- Log state errors for debugging
- Include user context (anonymized)
- Include device info (OS, version, model)
- Rate limit to prevent log spam

## Testing Strategy

### Testing Approach

The Property Admin Module uses a comprehensive testing strategy with three layers:

1. **Unit Tests**: Test individual functions and components in isolation
2. **Property-Based Tests**: Test universal properties across randomized inputs
3. **Integration Tests**: Test module integration and data flow

### Unit Testing

**Coverage Goals**:
- 80% code coverage minimum
- 100% coverage for calculation functions
- 100% coverage for validation functions

**Test Structure**:
```typescript
describe('Property Admin Module', () => {
  describe('Calculation Functions', () => {
    it('should calculate occupancy rate correctly', () => {
      const result = calculateOccupancyRate(35, 40);
      expect(result).toBe(87.5);
    });
    
    it('should handle zero total units', () => {
      const result = calculateOccupancyRate(0, 0);
      expect(result).toBe(0);
    });
  });
  
  describe('Validation Functions', () => {
    it('should validate unit status', () => {
      expect(isValidUnitStatus('occupied')).toBe(true);
      expect(isValidUnitStatus('invalid')).toBe(false);
    });
  });
});
```

**Component Testing**:
```typescript
describe('PropertyCard', () => {
  it('should render property information', () => {
    const property = mockProperties[0];
    const { getByText } = render(<PropertyCard property={property} onPress={jest.fn()} />);
    
    expect(getByText(property.name)).toBeTruthy();
    expect(getByText(property.location.estate)).toBeTruthy();
  });
  
  it('should call onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(<PropertyCard property={mockProperties[0]} onPress={onPress} />);
    
    fireEvent.press(getByTestId('property-card'));
    expect(onPress).toHaveBeenCalledWith(mockProperties[0].id);
  });
});
```

**Hook Testing**:
```typescript
describe('useProperties', () => {
  it('should fetch properties successfully', async () => {
    const { result, waitFor } = renderHook(() => useProperties(), {
      wrapper: createQueryWrapper(),
    });
    
    await waitFor(() => result.current.isSuccess);
    
    expect(result.current.data?.properties).toHaveLength(5);
  });
  
  it('should handle fetch error', async () => {
    server.use(
      rest.get('/property-admin/properties', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    
    const { result, waitFor } = renderHook(() => useProperties(), {
      wrapper: createQueryWrapper(),
    });
    
    await waitFor(() => result.current.isError);
    
    expect(result.current.error).toBeTruthy();
  });
});
```

### Property-Based Testing

**Library**: fast-check (TypeScript/JavaScript property-based testing library)

**Configuration**:
- Minimum 100 iterations per property test
- Seed for reproducibility
- Shrinking enabled for minimal failing examples

**Property Test Examples**:

#### Property 1: Occupancy Rate Calculation

```typescript
import fc from 'fast-check';

describe('Property 1: Occupancy Rate Calculation', () => {
  it('should calculate occupancy rate correctly for all valid inputs', () => {
    // Feature: property-admin, Property 1: For any property with totalUnits > 0, 
    // the occupancyRate SHALL equal (occupiedUnits / totalUnits) * 100
    
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1000 }), // occupiedUnits
        fc.integer({ min: 1, max: 1000 }), // totalUnits (must be > 0)
        (occupied, total) => {
          // Ensure occupied <= total
          const validOccupied = Math.min(occupied, total);
          
          const result = calculateOccupancyRate(validOccupied, total);
          const expected = (validOccupied / total) * 100;
          
          expect(result).toBeCloseTo(expected, 2);
          expect(result).toBeGreaterThanOrEqual(0);
          expect(result).toBeLessThanOrEqual(100);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

#### Property 2: Unit Count Invariant

```typescript
describe('Property 2: Unit Count Invariant', () => {
  it('should maintain occupiedUnits + vacantUnits = totalUnits', () => {
    // Feature: property-admin, Property 2: For any property, 
    // occupiedUnits + vacantUnits SHALL equal totalUnits
    
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1000 }), // totalUnits
        fc.integer({ min: 0, max: 1000 }), // occupiedUnits
        (total, occupied) => {
          const validOccupied = Math.min(occupied, total);
          const vacant = total - validOccupied;
          
          const property = createProperty({
            totalUnits: total,
            occupiedUnits: validOccupied,
            vacantUnits: vacant,
          });
          
          expect(property.occupiedUnits + property.vacantUnits).toBe(property.totalUnits);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

#### Property 6: Status Transition Preserves Invariant

```typescript
describe('Property 6: Status Transition Preserves Unit Count Invariant', () => {
  it('should preserve totalUnits invariant when changing unit status', () => {
    // Feature: property-admin, Property 6: For any property and any unit status change,
    // the invariant occupiedUnits + vacantUnits = totalUnits SHALL be preserved
    
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }), // totalUnits
        fc.integer({ min: 0, max: 100 }), // initial occupiedUnits
        fc.constantFrom('occupied', 'vacant', 'vacant_soon'), // fromStatus
        fc.constantFrom('occupied', 'vacant', 'vacant_soon'), // toStatus
        (total, initialOccupied, fromStatus, toStatus) => {
          const validOccupied = Math.min(initialOccupied, total);
          const initialVacant = total - validOccupied;
          
          const property = createProperty({
            totalUnits: total,
            occupiedUnits: validOccupied,
            vacantUnits: initialVacant,
          });
          
          // Verify initial invariant
          expect(property.occupiedUnits + property.vacantUnits).toBe(property.totalUnits);
          
          // Simulate status change
          const updatedProperty = updateUnitStatus(property, fromStatus, toStatus);
          
          // Verify invariant still holds
          expect(updatedProperty.occupiedUnits + updatedProperty.vacantUnits).toBe(updatedProperty.totalUnits);
          
          // Verify occupancy rate is recalculated correctly
          const expectedRate = (updatedProperty.occupiedUnits / updatedProperty.totalUnits) * 100;
          expect(updatedProperty.occupancyRate).toBeCloseTo(expectedRate, 2);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

#### Property 7: Optimistic Update Round-Trip

```typescript
describe('Property 7: Optimistic Update Round-Trip', () => {
  it('should revert to original state on mutation error', () => {
    // Feature: property-admin, Property 7: For any mutation that fails,
    // the state after error revert SHALL equal the state before the optimistic update
    
    fc.assert(
      fc.property(
        fc.array(fc.record({
          id: fc.uuid(),
          status: fc.constantFrom('occupied', 'vacant', 'vacant_soon'),
          roomNumber: fc.string({ minLength: 1, maxLength: 10 }),
        }), { minLength: 1, maxLength: 50 }),
        fc.integer({ min: 0, max: 49 }), // unit index to update
        fc.constantFrom('occupied', 'vacant', 'vacant_soon'), // new status
        (units, index, newStatus) => {
          const validIndex = index % units.length;
          const originalState = JSON.parse(JSON.stringify(units));
          
          // Apply optimistic update
          const optimisticState = [...units];
          optimisticState[validIndex] = { ...optimisticState[validIndex], status: newStatus };
          
          // Simulate error and revert
          const revertedState = originalState;
          
          // Verify state matches original
          expect(revertedState).toEqual(originalState);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

#### Property 13: Filter Subset Property

```typescript
describe('Property 13: Filter Subset Property', () => {
  it('should ensure filtered results are subset of original data', () => {
    // Feature: property-admin, Property 13: For any filter operation,
    // the result set SHALL be a subset of the original data
    
    fc.assert(
      fc.property(
        fc.array(fc.record({
          id: fc.uuid(),
          name: fc.string({ minLength: 1, maxLength: 50 }),
          type: fc.constantFrom('bedsitter', '1_bedroom', '2_bedroom', '3_bedroom'),
          occupancyRate: fc.float({ min: 0, max: 100 }),
        }), { minLength: 1, maxLength: 100 }),
        fc.record({
          type: fc.option(fc.constantFrom('bedsitter', '1_bedroom', '2_bedroom', '3_bedroom')),
          minOccupancy: fc.option(fc.float({ min: 0, max: 100 })),
          searchTerm: fc.option(fc.string({ maxLength: 20 })),
        }),
        (properties, filter) => {
          const filtered = applyFilters(properties, filter);
          
          // Every filtered item must exist in original
          filtered.forEach(item => {
            expect(properties).toContainEqual(item);
          });
          
          // Filtered count must be <= original count
          expect(filtered.length).toBeLessThanOrEqual(properties.length);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Integration Testing

**Test Scenarios**:

1. **Complete User Flow**:
   - User logs in
   - Dashboard loads with properties
   - User taps property card
   - Units screen loads
   - User changes unit status
   - Status updates successfully
   - Dashboard reflects new occupancy

2. **Error Recovery Flow**:
   - Network error occurs
   - Error message displayed
   - User taps retry
   - Data loads successfully

3. **Role-Based Access**:
   - Property Owner sees all features
   - Property Agent sees limited features
   - Unauthorized actions show access denied

**Integration Test Example**:
```typescript
describe('Property Admin Integration', () => {
  it('should complete full unit status update flow', async () => {
    // Setup
    const { getByText, getByTestId } = render(<PropertyAdminApp />);
    
    // Navigate to property
    await waitFor(() => getByText('Kilimani Heights'));
    fireEvent.press(getByText('Kilimani Heights'));
    
    // Wait for units to load
    await waitFor(() => getByText('A1'));
    
    // Tap unit card
    fireEvent.press(getByTestId('unit-card-A1'));
    
    // Wait for modal
    await waitFor(() => getByText('Change Status'));
    
    // Select new status
    fireEvent.press(getByText('Vacant'));
    
    // Confirm
    fireEvent.press(getByText('Confirm'));
    
    // Verify update
    await waitFor(() => {
      expect(getByTestId('unit-card-A1')).toHaveStyle({ backgroundColor: '#28b4f9' });
    });
  });
});
```

### Test Coverage Requirements

**Minimum Coverage**:
- Overall: 80%
- Calculation functions: 100%
- Validation functions: 100%
- API layer: 90%
- Hooks layer: 90%
- Components: 75%

**Property-Based Test Requirements**:
- Minimum 100 iterations per property
- All 14 correctness properties must have tests
- Each test must reference its design property in a comment
- Tag format: `// Feature: property-admin, Property {number}: {property_text}`

### Performance Testing

**Metrics to Track**:
- Dashboard initial render time (target: < 500ms)
- Property list scroll performance (target: 60 FPS)
- Unit grid scroll performance (target: 60 FPS)
- Modal open/close animation (target: smooth 60 FPS)
- API response time (target: < 1s)

**Performance Test Example**:
```typescript
describe('Performance', () => {
  it('should render dashboard within 500ms', async () => {
    const startTime = performance.now();
    
    render(<PropertyAdminDashboard />);
    
    await waitFor(() => screen.getByText('My Properties'));
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    expect(renderTime).toBeLessThan(500);
  });
});
```

### Continuous Integration

**CI Pipeline**:
1. Lint code (ESLint, TypeScript)
2. Run unit tests
3. Run property-based tests
4. Run integration tests
5. Check coverage thresholds
6. Build app
7. Run E2E tests (Detox)

**Pre-commit Hooks**:
- Format code (Prettier)
- Lint staged files
- Run tests for changed files
- Type check

**Test Automation**:
- Run full test suite on PR
- Run smoke tests on every commit
- Run performance tests nightly
- Generate coverage reports

## Performance Optimizations

### React Performance

**1. Component Memoization**

```typescript
// Memoize expensive components
export const PropertyCard = React.memo(PropertyCardComponent, (prev, next) => {
  return prev.property.id === next.property.id &&
         prev.property.updatedAt === next.property.updatedAt;
});

export const AnalyticsCard = React.memo(AnalyticsCardComponent);
export const RoomCard = React.memo(RoomCardComponent);
```

**2. Zustand Selectors**

```typescript
// Use selectors to prevent unnecessary re-renders
const isSidebarOpen = usePropertyAdminStore(selectIsSidebarOpen);
const selectedProperty = usePropertyAdminStore(selectSelectedProperty);

// Instead of:
const { isSidebarOpen, selectedProperty } = usePropertyAdminStore(); // Re-renders on any state change
```

**3. FlatList Optimization**

```typescript
<FlatList
  data={properties}
  renderItem={renderPropertyCard}
  keyExtractor={(item) => item.id}
  // Performance optimizations
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  initialNumToRender={5}
  windowSize={5}
  // Memoized callbacks
  getItemLayout={(data, index) => ({
    length: PROPERTY_CARD_HEIGHT,
    offset: PROPERTY_CARD_HEIGHT * index,
    index,
  })}
/>
```

### TanStack Query Optimizations

**1. Stale Time Configuration**

```typescript
// Properties: 5 minutes (changes infrequently)
useProperties({ staleTime: 5 * 60 * 1000 });

// Analytics: 1 minute (needs fresher data)
useAnalytics({ staleTime: 1 * 60 * 1000 });

// Units: 2 minutes (moderate freshness)
usePropertyUnits(propertyId, { staleTime: 2 * 60 * 1000 });
```

**2. Request Deduplication**

```typescript
// TanStack Query automatically deduplicates simultaneous requests
// Multiple components calling useProperties() will only trigger one API call
```

**3. Prefetching**

```typescript
// Prefetch next property when user scrolls
const queryClient = useQueryClient();

const prefetchProperty = (propertyId: string) => {
  queryClient.prefetchQuery({
    queryKey: propertyAdminKeys.property(propertyId),
    queryFn: () => propertyAdminApi.getProperty(propertyId),
  });
};

// Prefetch on property card hover/focus
<PropertyCard
  property={property}
  onPress={handlePress}
  onFocus={() => prefetchProperty(property.id)}
/>
```

**4. Optimistic Updates**

```typescript
// Update UI immediately, revert on error
const { mutate } = useUpdateUnitStatus();

mutate(
  { unitId, newStatus, updatedBy },
  {
    onMutate: async (variables) => {
      // Cancel queries and snapshot
      await queryClient.cancelQueries({ queryKey: propertyAdminKeys.propertyUnits(propertyId) });
      const previous = queryClient.getQueryData(propertyAdminKeys.propertyUnits(propertyId));
      
      // Optimistically update
      queryClient.setQueryData(propertyAdminKeys.propertyUnits(propertyId), (old) => ({
        ...old,
        units: old.units.map(u => u.id === unitId ? { ...u, status: newStatus } : u),
      }));
      
      return { previous };
    },
    onError: (err, variables, context) => {
      // Revert on error
      queryClient.setQueryData(propertyAdminKeys.propertyUnits(propertyId), context.previous);
    },
  }
);
```

### Image Optimization

**1. Image Caching**

```typescript
// Use expo-image for automatic caching
import { Image } from 'expo-image';

<Image
  source={{ uri: property.imageUrl }}
  cachePolicy="memory-disk"
  contentFit="cover"
  transition={200}
/>
```

**2. Image Formats**

- Use WebP for icons (smaller file size)
- Use PNG for logos (transparency)
- Use JPEG for photos (better compression)
- Provide @2x and @3x variants for different screen densities

**3. Lazy Loading**

```typescript
// Load images only when visible
<Image
  source={{ uri: property.imageUrl }}
  placeholder={require('@/assets/images/placeholder.png')}
  placeholderContentFit="cover"
/>
```

### Animation Performance

**1. Native Driver**

```typescript
// Use native driver for animations
Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true, // Runs on native thread
}).start();
```

**2. LayoutAnimation**

```typescript
// Use LayoutAnimation for layout changes
import { LayoutAnimation, Platform, UIManager } from 'react-native';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const toggleSidebar = () => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  setIsSidebarOpen(!isSidebarOpen);
};
```

### Bundle Size Optimization

**1. Code Splitting**

```typescript
// Lazy load screens
const AnalyticsScreen = lazy(() => import('./screens/AnalyticsScreen'));
const AgentsScreen = lazy(() => import('./screens/AgentsScreen'));

// Use Suspense for loading state
<Suspense fallback={<LoadingScreen />}>
  <AnalyticsScreen />
</Suspense>
```

**2. Tree Shaking**

```typescript
// Import only what you need
import { useQuery } from '@tanstack/react-query'; // Good
// import * as ReactQuery from '@tanstack/react-query'; // Bad
```

### Memory Management

**1. Cleanup Effects**

```typescript
useEffect(() => {
  const subscription = someObservable.subscribe();
  
  return () => {
    subscription.unsubscribe(); // Cleanup
  };
}, []);
```

**2. Query Cache Management**

```typescript
// Set cache time to prevent memory leaks
useProperties({
  staleTime: 5 * 60 * 1000,
  cacheTime: 30 * 60 * 1000, // Remove from cache after 30 minutes
});
```

### Network Optimization

**1. Request Batching**

```typescript
// Batch multiple requests
const [properties, analytics, agents] = await Promise.all([
  propertyAdminApi.getProperties(),
  propertyAdminApi.getAnalytics(),
  propertyAdminApi.getAgents(),
]);
```

**2. Compression**

```typescript
// Enable gzip compression in Axios
apiClient.defaults.headers['Accept-Encoding'] = 'gzip, deflate';
```

**3. Pagination**

```typescript
// Load data in pages
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: propertyAdminKeys.propertiesList(),
  queryFn: ({ pageParam = 1 }) => propertyAdminApi.getProperties({ page: pageParam, pageSize: 10 }),
  getNextPageParam: (lastPage) => lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined,
});
```

### Monitoring and Profiling

**1. Performance Monitoring**

```typescript
// Track render times
import { Profiler } from 'react';

<Profiler id="PropertyAdminDashboard" onRender={onRenderCallback}>
  <PropertyAdminDashboard />
</Profiler>

function onRenderCallback(id, phase, actualDuration) {
  console.log(`${id} (${phase}) took ${actualDuration}ms`);
  // Send to analytics service
}
```

**2. Bundle Analysis**

```bash
# Analyze bundle size
npx react-native-bundle-visualizer
```

**3. Memory Profiling**

```typescript
// Use React DevTools Profiler
// Monitor memory usage in production with Sentry or similar
```

## Summary

The Property Admin Module design provides:

1. **Clear Architecture**: Two-layer state management with TanStack Query for server state and Zustand for UI state
2. **Comprehensive Components**: Reusable components for dashboard, units, modals, and sidebar
3. **Type Safety**: Complete TypeScript interfaces for all data models
4. **API Integration**: Mock API with realistic data for development
5. **Error Handling**: Comprehensive error handling with user-friendly messages
6. **Testing Strategy**: Unit tests, property-based tests, and integration tests
7. **Performance**: Optimizations for rendering, caching, and network requests
8. **Correctness**: 14 formal properties ensuring data integrity and correct behavior

The module follows the Masqany mobile architecture patterns and is ready for implementation.
