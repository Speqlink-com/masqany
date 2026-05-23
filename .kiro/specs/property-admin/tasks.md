# Implementation Plan: Property Admin Module

## Overview

The Property Admin Module is a comprehensive property management dashboard for property owners and agents in the Masqany mobile app. This implementation follows the established module pattern with TanStack Query for server state, Zustand for client state, and TypeScript for type safety.

**Key Features:**
- Dashboard with analytics cards, action buttons, and property list
- Individual property/units screen with 4-per-row grid layout
- Status change modal for unit management
- Sidebar menu with role-based navigation
- Mock API with realistic dummy data
- Optimistic updates for better UX
- Property-based tests for calculation logic

**Technical Stack:**
- Module Pattern: `modules/property-admin/` (api.ts, hooks.ts, types.ts, store.ts, index.ts)
- Server State: TanStack Query
- Client State: Zustand
- Styling: NativeWind/Tailwind with design tokens
- Navigation: Expo Router
- Testing: Jest + fast-check for property-based tests

## Tasks

- [x] 1. Set up module foundation and type definitions
  - [x] 1.1 Create module directory structure
    - Create `modules/property-admin/` directory
    - Create placeholder files: types.ts, api.ts, hooks.ts, store.ts, index.ts
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6_

  - [x] 1.2 Define TypeScript interfaces in types.ts
    - Define Property interface with all fields (id, name, type, location, units, pricing, metadata, ownership, timestamps)
    - Define PropertyType union type (bedsitter, 1_bedroom, 2_bedroom, 3_bedroom, 4_bedroom_plus, studio, penthouse)
    - Define Unit interface with all fields (id, propertyId, roomNumber, status, details, tenant info, metadata)
    - Define UnitStatus union type ('occupied' | 'vacant' | 'vacant_soon')
    - Define Analytics interface (totalProperties, totalUnits, occupiedUnits, vacantUnits, occupancyRate, totalViews, totalRevenue, period, dates)
    - Define Agent interface (id, name, email, phone, avatar, assignedProperties, totalProperties, rating, hireDate, status)
    - Define API response types (PropertiesResponse, UnitsResponse, UpdateUnitStatusRequest, UpdateUnitStatusResponse)
    - Export all interfaces and types
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5, 19.6, 19.7, 19.8, 19.9, 19.10, 19.11, 19.12, 19.13, 19.14, 19.15, 19.16, 19.17, 19.18_

  - [ ]* 1.3 Write property-based test for occupancy rate calculation
    - **Property 1: Occupancy Rate Calculation**
    - **Validates: Requirements 26.1, 26.7**
    - Use fast-check to generate random occupiedUnits (0-1000) and totalUnits (1-1000)
    - Verify: occupancyRate = (occupiedUnits / totalUnits) * 100
    - Verify: occupancyRate is between 0 and 100
    - Run 100 iterations minimum
    - _Requirements: 27.1, 27.2_

  - [ ]* 1.4 Write property-based test for unit count invariant
    - **Property 2: Unit Count Invariant**
    - **Validates: Requirements 26.2, 26.16**
    - Use fast-check to generate random totalUnits and occupiedUnits
    - Verify: occupiedUnits + vacantUnits = totalUnits (always)
    - Run 100 iterations minimum
    - _Requirements: 27.3, 27.4_

- [x] 2. Create mock data and API layer
  - [x] 2.1 Create mock data in assets/data/property-admin.ts
    - Create mockProperties array with 5 properties (varied types, locations, occupancy rates)
    - Create mockUnits object with units for each property (40 units for prop-001, 24 for prop-002, etc.)
    - Include units with all status types (occupied, vacant, vacant_soon)
    - Create mockAnalytics object with realistic numbers
    - Create mockAgents array with 3-5 agents
    - Use actual icon paths from assets/icons/
    - Include varied locations (Kilimani, Westlands, Karen, Lavington, Runda)
    - Include varied pricing (KES 25000-75000 per unit)
    - _Requirements: 22.1, 22.3, 22.4, 22.5, 22.6, 22.7, 22.8, 22.9, 22.10, 22.11, 22.12_

  - [x] 2.2 Implement API functions in api.ts
    - Import apiClient from lib/api/client.ts
    - Implement getProperties with pagination, filtering, sorting
    - Implement getProperty by ID
    - Implement getPropertyUnits by property ID
    - Implement getAnalytics with period parameter
    - Implement getAgents
    - Implement updateUnitStatus with optimistic update support
    - Implement createProperty
    - Implement archiveProperty
    - Implement hireAgent
    - Add network delay simulation (300-800ms)
    - Add 10% failure rate for testing error handling
    - Export propertyAdminApi object with all functions
    - _Requirements: 18.2, 18.8, 18.9, 22.2, 22.14, 22.15, 22.16, 22.17_

  - [ ]* 2.3 Write property-based test for monthly rentals calculation
    - **Property 3: Monthly Rentals Calculation**
    - **Validates: Requirements 26.3**
    - Use fast-check to generate random unit prices
    - Verify: monthlyRentals = sum of all occupied unit prices
    - Run 100 iterations minimum
    - _Requirements: 27.5, 27.6_

- [x] 3. Implement TanStack Query hooks layer
  - [x] 3.1 Define query keys in hooks.ts
    - Define propertyAdminKeys object with hierarchical structure
    - Define keys: all, properties, propertiesList, property, propertyUnits, analytics, analyticsPeriod, agents
    - Use const arrays for type safety
    - Follow pattern: ['property-admin', resource, ...params]
    - _Requirements: 18.10, 20.10, 20.11, 26.18_

  - [x] 3.2 Implement query hooks
    - Implement useProperties with pagination, filtering, sorting support
    - Implement useProperty for single property by ID
    - Implement usePropertyUnits for units by property ID
    - Implement useAnalytics with period parameter (daily, weekly, monthly, yearly)
    - Implement useAgents
    - Configure staleTime: 5 minutes for properties, 1 minute for analytics, 2 minutes for units
    - Configure gcTime: 30 minutes
    - Configure retry: 2 retries
    - Add enabled flag for conditional queries
    - _Requirements: 18.3, 18.7, 18.11, 20.1, 20.2, 20.3, 20.4, 20.5, 20.13, 20.14, 20.15, 20.16, 20.17, 20.18_

  - [x] 3.3 Implement mutation hooks with optimistic updates
    - Implement useUpdateUnitStatus with onMutate, onError, onSuccess
    - Implement optimistic update: cancel queries, snapshot previous, update cache
    - Implement error revert: restore previous state on error
    - Implement success invalidation: invalidate propertyUnits, property, analytics queries
    - Implement useCreateProperty with query invalidation
    - Implement useArchiveProperty with query invalidation
    - Implement useHireAgent with query invalidation
    - _Requirements: 18.11, 20.6, 20.7, 20.8, 20.9, 20.12, 26.19, 26.20_

  - [ ]* 3.4 Write property-based test for query key structure
    - **Property 10: Query Key Structure**
    - **Validates: Requirements 26.18**
    - Use fast-check to generate random parameters
    - Verify: all query keys match pattern ['property-admin', resource, ...params]
    - Run 100 iterations minimum
    - _Requirements: 27.9, 27.10_

  - [ ]* 3.5 Write property-based test for optimistic update round-trip
    - **Property 7: Optimistic Update Round-Trip**
    - **Validates: Requirements 26.19**
    - Use fast-check to generate random unit arrays and status changes
    - Simulate optimistic update and error revert
    - Verify: state after error revert = state before optimistic update
    - Run 100 iterations minimum
    - _Requirements: 27.19, 27.20_

- [x] 4. Implement Zustand store for UI state
  - [x] 4.1 Create PropertyAdminStore in store.ts
    - Define store interface with state and actions
    - Implement state: isSidebarOpen, isStatusModalOpen, selectedProperty, selectedUnit, selectedUnits
    - Implement sidebar actions: openSidebar, closeSidebar, toggleSidebar
    - Implement modal actions: openStatusModal, closeStatusModal
    - Implement selection actions: setSelectedProperty, setSelectedUnit, toggleUnitSelection, clearSelections
    - Export usePropertyAdminStore hook
    - Export selectors: selectIsSidebarOpen, selectIsStatusModalOpen, selectSelectedProperty, selectSelectedUnit, selectSelectedUnits
    - _Requirements: 18.4, 18.12, 18.13, 21.1, 21.2, 21.3, 21.4, 21.5, 21.6, 21.7, 21.8, 21.9, 21.10, 21.11, 21.12, 21.13, 21.14, 21.15, 21.16, 21.17_

  - [x] 4.2 Create module index.ts with re-exports
    - Re-export all types from types.ts
    - Re-export propertyAdminApi from api.ts
    - Re-export all hooks from hooks.ts
    - Re-export usePropertyAdminStore and selectors from store.ts
    - _Requirements: 18.6, 18.15, 28.1_

- [x] 5. Build core reusable components
  - [x] 5.1 Create GradientHeader component
    - Create components/property-admin/GradientHeader.tsx
    - Implement variant prop: 'dashboard' | 'units'
    - Implement gradient background from #5DE0E6 to #004AAD (25% screen height)
    - Dashboard variant: menu icon, home icon, Masqany logo, notification icon
    - Units variant: property icon, title, search icon, location, total rooms, switch property button, price, monthly rentals, occupancy ratio
    - All icons 24x24px, white color
    - Use LinearGradient from expo-linear-gradient
    - Use design tokens from constants/tokens.ts
    - _Requirements: 1.5, 1.6, 1.7, 1.8, 1.9, 1.10, 1.11, 1.12, 1.13, 1.14, 1.15, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10, 6.11, 6.12, 6.13, 6.14, 6.15, 6.16, 6.17, 6.18, 6.19, 6.20, 6.21, 6.22, 6.23, 6.24, 6.25, 23.1, 23.3, 23.4, 23.5, 23.17_

  - [x] 5.2 Create AnalyticsCard component
    - Create components/property-admin/AnalyticsCard.tsx
    - Implement props: icon, value, label, onPress
    - Background: #f3f4f3 with rounded corners and shadow
    - Icon at top (32x32px)
    - Value: font-poppins-bold, 24px, #000000
    - Label: font-inter-medium, 13px, #545454
    - Tappable with activeOpacity 0.8
    - Use React.memo for performance
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 3.11, 3.12, 3.13, 3.14, 3.15, 3.16, 3.17, 3.18, 3.19, 3.20, 3.21, 3.22, 23.6, 23.10, 23.11, 23.14_

  - [x] 5.3 Create PropertyCard component
    - Create components/property-admin/PropertyCard.tsx
    - Implement props: property, onPress
    - Size: 280px width, 180px height
    - Background: #f3f4f3 with shadow
    - Property type badge (top-left, #28b4f9, white text, rounded)
    - House icon (40x40px)
    - Property name (font-inter-semibold, 16px)
    - Location with icon (14x14px)
    - Total units count
    - Bill per unit (font-inter-bold, 15px, #28b4f9)
    - Rating with star icon
    - 16px spacing between cards
    - Use React.memo for performance
    - _Requirements: 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 5.11, 5.12, 5.13, 5.14, 5.15, 5.16, 5.17, 5.18, 5.19, 5.20, 5.21, 5.22, 5.23, 5.24, 5.25, 5.26, 5.27, 5.28, 5.29, 5.30, 23.2, 23.6, 23.10, 23.11, 23.13, 23.14_

  - [x] 5.4 Create RoomCard component
    - Create components/property-admin/RoomCard.tsx
    - Implement props: unit, onPress
    - Square card with equal width/height, rounded corners (12px)
    - Background color based on status: occupied (#22C55E), vacant (#28b4f9), vacant_soon (#F59E0B)
    - Status icon at top (28x28px, white)
    - Room number (font-inter-bold, 18px, white)
    - Status text (font-inter-medium, 12px, white)
    - Tick mark icon at bottom
    - 8px spacing between cards
    - Use React.memo for performance
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 7.10, 7.11, 7.12, 7.13, 7.14, 7.15, 7.16, 7.17, 7.18, 7.19, 7.20, 7.21, 7.22, 7.23, 7.24, 7.25, 7.26, 23.7, 23.8, 23.10, 23.11, 23.13, 23.14_

  - [x] 5.5 Create QuickActionButton component
    - Create components/property-admin/QuickActionButton.tsx
    - Implement props: label, onPress
    - Background: #28b4f9, rounded corners (20px)
    - White text, font-inter-semibold, 15px
    - Padding: 12px vertical, 20px horizontal
    - Shadow for depth
    - activeOpacity: 0.8
    - 10px spacing between buttons
    - Wraps to next line on small screens
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10, 4.11, 4.12, 4.13, 4.14, 23.2, 23.10, 23.11, 23.13, 23.14_

  - [x] 5.6 Create SkeletonLoader component
    - Create components/property-admin/SkeletonLoader.tsx
    - Implement variant prop: 'analytics-grid' | 'property-cards' | 'unit-grid'
    - Light gray background (#f3f4f3) with white shimmer animation
    - analytics-grid: 4 placeholder cards in 2x2 grid
    - property-cards: 3 placeholder cards horizontal
    - unit-grid: 12 placeholder cards in 4-column grid
    - Minimum display time: 300ms (prevents flashing)
    - Smooth fade-in/fade-out transitions
    - _Requirements: 24.1, 24.2, 24.3, 24.4, 24.5, 24.6, 24.7, 24.8, 24.9, 24.10, 24.12, 24.13_

  - [x] 5.7 Create EmptyState component
    - Create components/property-admin/EmptyState.tsx
    - Implement variant prop: 'no-properties' | 'no-units' | 'no-agents'
    - Centered illustration
    - Title: font-poppins-semibold, 18px
    - Message: font-inter, 14px, #545454
    - Action button based on variant
    - Button styling matches QuickActionButton
    - _Requirements: 25.7, 25.8, 25.9, 25.10, 25.11, 25.12, 25.13, 23.10, 23.11_

- [x] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Build Dashboard screen
  - [x] 7.1 Create tab navigator layout
    - Create app/(property-admin)/_layout.tsx
    - Implement tab navigator with 5 tabs: home, agents, units, analytics, profile
    - Set home as default active tab
    - Configure tab bar styling with design tokens
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 16.3, 16.4, 16.6, 16.7, 16.8, 16.9_

  - [x] 7.2 Create Dashboard screen structure
    - Create app/(property-admin)/dashboard.tsx
    - Import hooks from modules/property-admin
    - Import store selectors from modules/property-admin
    - Set up ScrollView with pull-to-refresh
    - Add GradientHeader with dashboard variant
    - Add welcome message section
    - Add analytics grid section
    - Add quick actions section
    - Add my properties section
    - _Requirements: 1.1, 1.5, 2.1, 3.1, 4.1, 5.1, 28.1, 28.2_

  - [x] 7.3 Implement welcome message
    - Retrieve property owner name from auth store
    - Display "Welcome back, [Property Owner Name]"
    - Fallback to "Welcome back" if name not available
    - White text, font-inter-semibold, 18px
    - Padding: 20px horizontal
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9_

  - [x] 7.4 Implement analytics grid
    - Use useAnalytics hook to fetch data
    - Display 4 AnalyticsCard components in 2x2 grid
    - Cards: Occupied, Vacant, Occupancy Rate, Views
    - Show SkeletonLoader while loading
    - Show error message on fetch failure with retry button
    - Handle tap on card to navigate to detailed analytics
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 3.11, 3.12, 3.13, 3.14, 3.15, 3.16, 3.17, 3.18, 3.19, 3.20, 3.21, 3.22, 24.2, 24.9, 25.2_

  - [x] 7.5 Implement quick action buttons
    - Display 3 QuickActionButton components horizontally
    - Buttons: My Units, Switch Status, Analytics
    - My Units: navigate to units tab
    - Switch Status: open status modal (openStatusModal from store)
    - Analytics: navigate to analytics tab
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10, 4.11, 4.12, 4.13, 4.14_

  - [x] 7.6 Implement my properties section
    - Use useProperties hook to fetch properties
    - Display section title "My Properties"
    - Display PropertyCard components in horizontal FlatList
    - Show SkeletonLoader while loading
    - Show EmptyState if no properties
    - Show error message on fetch failure with retry button
    - Handle tap on card to navigate to units screen with propertyId
    - Implement FlatList optimizations (removeClippedSubviews, maxToRenderPerBatch, etc.)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 5.11, 5.12, 5.13, 5.14, 5.15, 5.16, 5.17, 5.18, 5.19, 5.20, 5.21, 5.22, 5.23, 5.24, 5.25, 5.26, 5.27, 5.28, 5.29, 5.30, 24.1, 24.8, 25.1, 25.7, 25.8, 25.9, 29.2, 29.3_

  - [ ]* 7.7 Write unit tests for Dashboard screen
    - Test welcome message displays correctly
    - Test analytics cards render with correct data
    - Test quick action buttons navigate correctly
    - Test property cards render and are tappable
    - Test loading states show skeleton loaders
    - Test error states show error messages
    - Test empty state shows when no properties

- [x] 8. Build Units screen with grid layout
  - [x] 8.1 Create Units screen structure
    - Create app/(property-admin)/units/[propertyId].tsx
    - Import hooks from modules/property-admin
    - Import store selectors from modules/property-admin
    - Get propertyId from route params
    - Use usePropertyUnits hook to fetch units
    - Set up ScrollView with pull-to-refresh
    - Add GradientHeader with units variant
    - Add unit grid section
    - _Requirements: 6.1, 6.2, 16.5, 16.13, 16.14, 28.1, 28.2_

  - [x] 8.2 Implement unit grid with FlatList
    - Display RoomCard components in FlatList with numColumns=4
    - Show SkeletonLoader while loading
    - Show EmptyState if no units
    - Show error message on fetch failure with retry button
    - Handle tap on card to open status modal
    - Implement FlatList optimizations (removeClippedSubviews, getItemLayout, etc.)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 7.10, 7.11, 7.12, 7.13, 7.14, 7.15, 7.16, 7.17, 7.18, 7.19, 7.20, 7.21, 7.22, 7.23, 7.24, 7.25, 7.26, 24.3, 24.10, 25.3, 25.10, 25.11, 29.4, 29.5_

  - [ ]* 8.3 Write property-based test for grid layout calculation
    - **Property 11: Grid Layout Calculation**
    - **Validates: Requirements 27.12**
    - Use fast-check to generate random unit counts (0-200)
    - Verify: grid displays ceil(count / 4) rows
    - Run 100 iterations minimum
    - _Requirements: 27.11, 27.12_

  - [ ]* 8.4 Write unit tests for Units screen
    - Test units grid renders correctly
    - Test unit cards are tappable
    - Test loading states show skeleton loaders
    - Test error states show error messages
    - Test empty state shows when no units
    - Test navigation with propertyId param

- [x] 9. Build Status Change Modal
  - [x] 9.1 Create StatusModal component
    - Create components/property-admin/StatusModal.tsx
    - Implement props: isVisible, propertyName, units, selectedUnitId, onClose, onConfirm
    - White background with rounded corners and shadow
    - Property name as title (font-poppins-semibold, 18px)
    - Searchable unit dropdown
    - 3 status cards: Occupied, Soon Vacant, Vacant
    - Single selection (radio button behavior)
    - Selected card: #28b4f9 background, white text
    - Unselected cards: #f3f4f3 background, dark text
    - Cancel and Confirm buttons
    - Dismissible by tapping outside
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 8.10, 8.11, 8.12, 8.13, 8.14, 8.15, 8.16, 8.17, 8.18, 8.19, 8.20, 8.21, 8.22, 8.23, 8.24, 8.25, 8.26, 8.27, 8.28, 8.29, 8.30, 8.31, 8.32, 8.33, 8.34, 8.35_

  - [x] 9.2 Integrate StatusModal with Units screen
    - Use isStatusModalOpen from store
    - Use openStatusModal, closeStatusModal from store
    - Use selectedUnit from store
    - Pass units from usePropertyUnits hook
    - Handle confirm: call useUpdateUnitStatus mutation
    - Show success toast on successful update
    - Show error toast on failed update
    - Close modal on success
    - _Requirements: 8.30, 8.31, 8.32, 8.33, 8.34, 8.35, 25.4, 25.5_

  - [ ]* 9.3 Write property-based test for status transition invariant
    - **Property 6: Status Transition Preserves Unit Count Invariant**
    - **Validates: Requirements 26.11, 26.12, 26.13, 26.14, 26.15**
    - Use fast-check to generate random properties and status changes
    - Verify: occupiedUnits + vacantUnits = totalUnits (before and after)
    - Verify: occupancyRate is recalculated correctly
    - Run 100 iterations minimum
    - _Requirements: 27.3, 27.4_

  - [ ]* 9.4 Write unit tests for StatusModal
    - Test modal opens and closes correctly
    - Test unit dropdown is searchable
    - Test status cards are selectable
    - Test only one status can be selected at a time
    - Test confirm button triggers mutation
    - Test cancel button closes modal without changes
    - Test modal is dismissible by tapping outside

- [x] 10. Build Sidebar Menu with role-based navigation
  - [x] 10.1 Create SidebarMenu component structure
    - Create components/property-admin/SidebarMenu.tsx
    - Implement props: isOpen, userRole, agentCount, onClose, onNavigate
    - Opens from left, occupies 80% screen width
    - Gradient background (#5DE0E6 to #004AAD)
    - Masqany logo at top (centered, 24px padding)
    - Close button at top-right (24x24px)
    - Smooth animation with native driver
    - Swipeable left to open, right to close
    - Dismissible by tapping outside
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.22, 9.23, 9.24, 9.25, 9.26_

  - [x] 10.2 Implement PROPERTIES section
    - Section header: "PROPERTIES" (font-inter-bold, 13px, white with opacity 0.7)
    - Navigation items: Add New Property, All Listings, Archived
    - Icons: add-new-property.png, listing-icon.png, listing-icon.png (with opacity 0.6)
    - Add New Property: navigate to property registration flow
    - All Listings: navigate to all properties screen
    - Archived: navigate to archived properties screen
    - Hide "Add New Property" for Property_Agent role
    - _Requirements: 9.8, 9.9, 9.10, 9.11, 9.12, 9.13, 9.14, 9.15, 9.16, 9.17, 9.18, 9.19, 9.20, 9.21, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 10.10_

  - [x] 10.3 Implement AGENTS section
    - Section header: "AGENTS"
    - Navigation items: My Agents (with count), Hire New Agent
    - Icons: my-agents-icon.png, new-agent.webp
    - My Agents: display agent count in parentheses, navigate to agents list
    - Hire New Agent: navigate to agent hiring flow
    - Hide entire section for Property_Agent role
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8, 11.9, 11.10, 11.11_

  - [x] 10.4 Implement ANALYTICS section
    - Section header: "ANALYTICS"
    - Navigation items: Performance Reports, Market Insights, Tenant Demographics
    - Icons: performance-reports.png, market-insights.png, tenant-demographics.png
    - Performance Reports: navigate to performance reports screen
    - Market Insights: navigate to market insights screen
    - Tenant Demographics: navigate to tenant demographics screen
    - Property_Agent: show only Performance Reports
    - Property_Owner: show all items
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 12.9, 12.10, 12.11_

  - [x] 10.5 Implement FINANCE section
    - Section header: "FINANCE"
    - Navigation items: Transaction History, Invoice Generator
    - Icons: transaction-history.png, invoice-icon.png
    - Transaction History: navigate to transaction history screen
    - Invoice Generator: navigate to invoice generator screen
    - Hide entire section for Property_Agent role
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8_

  - [x] 10.6 Implement SUPPORT section
    - Section header: "SUPPORT"
    - Navigation items: Settings, Support Center
    - Icons: settings.png, support.png
    - Settings: navigate to settings screen
    - Support Center: navigate to support center screen
    - Accessible to both Property_Owner and Property_Agent roles
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7_

  - [x] 10.7 Integrate SidebarMenu with Dashboard
    - Use isSidebarOpen from store
    - Use openSidebar, closeSidebar from store
    - Get userRole from auth store
    - Get agentCount from useAgents hook
    - Handle menu icon tap in GradientHeader
    - Handle navigation and close sidebar
    - _Requirements: 1.16, 9.20, 9.21_

  - [ ]* 10.8 Write property-based test for role permission hierarchy
    - **Property 9: Role Permission Hierarchy**
    - **Validates: Requirements 26.17**
    - Use fast-check to generate random user roles and features
    - Verify: if Property_Agent has access, then Property_Owner has access (or feature is owner-only)
    - Run 100 iterations minimum
    - _Requirements: 27.7, 27.8_

  - [ ]* 10.9 Write unit tests for SidebarMenu
    - Test sidebar opens and closes correctly
    - Test all navigation items are present for Property_Owner
    - Test limited navigation items for Property_Agent
    - Test agent count displays correctly
    - Test navigation items trigger correct routes
    - Test close button closes sidebar
    - Test tapping outside closes sidebar

- [x] 11. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Implement navigation and routing
  - [x] 12.1 Add navigation handlers in Dashboard
    - Handle notification icon tap: navigate to notifications screen
    - Handle home icon tap: scroll to top of dashboard
    - Handle analytics card tap: navigate to analytics tab with metric filter
    - Handle property card tap: navigate to units screen with propertyId
    - _Requirements: 1.17, 1.18, 3.22, 5.28, 16.13_

  - [x] 12.2 Add navigation handlers in Units screen
    - Handle search icon tap: show search/filter modal
    - Handle switch property button tap: show property selection dropdown
    - _Requirements: 6.7, 6.19_

  - [x] 12.3 Implement redirect from property registration
    - Add redirect logic in property registration completion
    - Navigate to property admin dashboard automatically
    - _Requirements: 1.1, 16.1, 16.2_

  - [x] 12.4 Add temporary development access button
    - Add button in auth pages (sign-in, sign-up)
    - Label: "Property Admin (Dev)"
    - Gray background (#f3f4f3), dark text (#000000)
    - Small text: "Development Only"
    - Navigate to property admin dashboard on tap
    - Set mock user in auth store with Property_Owner role
    - Only visible when __DEV__ flag is true
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7, 17.8, 17.9, 17.10, 17.11, 17.12, 17.13_

  - [ ]* 12.5 Write integration tests for navigation flows
    - Test complete flow: dashboard → property card → units screen → status modal → update
    - Test tab navigation preserves state
    - Test back navigation works correctly
    - Test redirect from property registration

- [x] 13. Implement role-based access control
  - [x] 13.1 Create role permission utility functions
    - Create utils/property-admin/permissions.ts
    - Implement canAccessAgents(role): boolean
    - Implement canAccessFinance(role): boolean
    - Implement canAccessMarketInsights(role): boolean
    - Implement canAccessTenantDemographics(role): boolean
    - Implement canAddProperty(role): boolean
    - Implement canArchiveProperty(role): boolean
    - Implement canHireAgent(role): boolean
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8, 15.9, 15.10, 15.11, 15.12, 15.13, 15.14, 15.15_

  - [x] 13.2 Apply role checks in UI components
    - Apply role checks in SidebarMenu for section visibility
    - Apply role checks in Dashboard for feature access
    - Apply role checks in Units screen for actions
    - Hide unauthorized features from UI
    - _Requirements: 15.16, 15.17, 15.19_

  - [x] 13.3 Implement access denied handling
    - Show "Access Denied" message when user attempts unauthorized action
    - Log unauthorized access attempts
    - _Requirements: 15.18_

  - [ ]* 13.4 Write unit tests for role permissions
    - Test Property_Owner has access to all features
    - Test Property_Agent has limited access
    - Test permission functions return correct values
    - Test UI hides unauthorized features

- [x] 14. Implement error handling and loading states
  - [x] 14.1 Add error handling in Dashboard
    - Handle properties fetch error: show error message with retry button
    - Handle analytics fetch error: show error message in analytics cards
    - Handle network error: show "No Internet Connection" banner
    - _Requirements: 25.1, 25.2, 25.6_

  - [x] 14.2 Add error handling in Units screen
    - Handle units fetch error: show error message with retry button
    - Handle unit status update error: show error toast and revert optimistic update
    - Handle network error: show "No Internet Connection" banner
    - _Requirements: 25.3, 25.4, 25.5, 25.6_

  - [x] 14.3 Add loading states with skeleton loaders
    - Show skeleton loaders while fetching properties
    - Show skeleton loaders while fetching analytics
    - Show skeleton loaders while fetching units
    - Minimum display time: 300ms to avoid flashing
    - _Requirements: 24.1, 24.2, 24.3, 24.4, 24.5, 24.6, 24.7, 24.8, 24.9, 24.10, 24.11, 24.12, 24.13_

  - [x] 14.4 Add pull-to-refresh functionality
    - Implement pull-to-refresh in Dashboard ScrollView
    - Implement pull-to-refresh in Units screen ScrollView
    - Use primary blue color (#20A6FD) for refresh indicator
    - _Requirements: 24.14, 24.15_

  - [x] 14.5 Add empty states
    - Show EmptyState when no properties exist
    - Show EmptyState when property has no units
    - Show EmptyState when no agents exist
    - _Requirements: 25.7, 25.8, 25.9, 25.10, 25.11, 25.12, 25.13_

  - [x] 14.6 Implement error logging
    - Log all API errors to monitoring service
    - Log validation errors for analytics
    - Log state errors for debugging
    - Include user context (anonymized)
    - Include device info (OS, version, model)
    - Rate limit to prevent log spam
    - _Requirements: 25.15, 25.16_

  - [x] 14.7 Add specific HTTP error handling
    - 401 Unauthorized: clear auth tokens, redirect to login
    - 403 Forbidden: show "Access Denied" message
    - 404 Not Found: show "Property not found" or "Unit not found"
    - 422 Validation Error: show field-specific error messages
    - 500 Server Error: show "Something went wrong" with retry
    - 503 Service Unavailable: show "Service temporarily unavailable" with auto-retry
    - _Requirements: 25.17, 25.18, 25.19, 25.20_

  - [ ]* 14.8 Write unit tests for error handling
    - Test error messages display correctly
    - Test retry buttons work
    - Test optimistic updates revert on error
    - Test network error banner shows
    - Test HTTP error codes are handled correctly

- [x] 15. Implement performance optimizations
  - [x] 15.1 Add React performance optimizations
    - Memoize PropertyCard, AnalyticsCard, RoomCard components
    - Use Zustand selectors to prevent unnecessary re-renders
    - Implement FlatList optimizations (removeClippedSubviews, maxToRenderPerBatch, windowSize, getItemLayout)
    - _Requirements: 29.2, 29.3, 29.4, 29.5, 29.6, 29.7, 29.13, 29.14_

  - [x] 15.2 Configure TanStack Query optimizations
    - Set staleTime: 5 minutes for properties, 1 minute for analytics, 2 minutes for units
    - Set gcTime: 30 minutes
    - Enable request deduplication (automatic)
    - Implement prefetching for next property on card hover/focus
    - _Requirements: 29.9, 29.10, 29.11, 29.12_

  - [x] 15.3 Optimize images
    - Use expo-image for automatic caching
    - Set cachePolicy: "memory-disk"
    - Add placeholder images for lazy loading
    - Use WebP format for icons
    - Provide @2x and @3x variants
    - _Requirements: 29.15, 29.16_

  - [x] 15.4 Optimize animations
    - Use native driver for all animations
    - Use LayoutAnimation for layout changes
    - Ensure sidebar and modal animations are smooth (60 FPS)
    - _Requirements: 29.8_

  - [x] 15.5 Implement code splitting
    - Lazy load analytics screen
    - Lazy load agents screen
    - Lazy load profile screen
    - _Requirements: 29.19_

  - [ ]* 15.6 Write performance tests
    - Test dashboard renders within 500ms
    - Test property list scrolls at 60 FPS
    - Test unit grid scrolls at 60 FPS
    - Test modal animations are smooth
    - _Requirements: 29.1_

- [x] 16. Implement accessibility features
  - [x] 16.1 Add accessibility labels
    - Add accessible labels to all interactive elements
    - Add accessible labels to all icons
    - Add accessible labels to all buttons
    - Add accessible labels to analytics cards describing metrics
    - Add accessible labels to property cards with key info
    - Add accessible labels to unit cards with room number and status
    - Add accessible labels to status modal options
    - Add accessible labels to sidebar navigation items
    - _Requirements: 30.1, 30.2, 30.3, 30.4, 30.5, 30.6, 30.7, 30.8, 30.9_

  - [x] 16.2 Ensure color accessibility
    - Ensure unit status has text labels (not color-only)
    - Maintain 4.5:1 contrast ratio for text
    - Maintain 3:1 contrast ratio for UI components
    - Add visible focus indicators
    - _Requirements: 30.10, 30.13, 30.14, 30.15_

  - [x] 16.3 Add screen reader support
    - Ensure all content is accessible to screen readers
    - Announce error messages to screen readers
    - Announce loading states to screen readers
    - Announce success messages to screen readers
    - _Requirements: 30.11, 30.16, 30.17, 30.18_

  - [x] 16.4 Implement modal focus management
    - Trap focus within modal when open
    - Return focus to trigger element when modal closes
    - _Requirements: 30.19_

  - [ ]* 16.5 Write accessibility tests
    - Test all interactive elements have minimum 44x44px touch target
    - Test all elements have accessible labels
    - Test contrast ratios meet WCAG standards
    - Test screen reader announcements work

- [ ] 17. Write remaining property-based tests
  - [ ]* 17.1 Write property-based test for property validation constraints
    - **Property 4: Property Validation Constraints**
    - **Validates: Requirements 26.4, 26.5, 26.6, 26.7**
    - Use fast-check to generate random property data
    - Verify: totalUnits > 0
    - Verify: 0 ≤ occupiedUnits ≤ totalUnits
    - Verify: 0 ≤ vacantUnits ≤ totalUnits
    - Verify: 0 ≤ occupancyRate ≤ 100
    - Run 100 iterations minimum
    - _Requirements: 27.1, 27.2_

  - [ ]* 17.2 Write property-based test for unit validation constraints
    - **Property 5: Unit Validation Constraints**
    - **Validates: Requirements 26.8, 26.9, 26.10**
    - Use fast-check to generate random unit data
    - Verify: status ∈ {"occupied", "vacant", "vacant_soon"}
    - Verify: roomNumber is non-empty string
    - Verify: propertyId references an existing property
    - Run 100 iterations minimum
    - _Requirements: 27.1, 27.2_

  - [ ]* 17.3 Write property-based test for query invalidation
    - **Property 8: Query Invalidation on Success**
    - **Validates: Requirements 26.20**
    - Use fast-check to generate random mutations
    - Verify: relevant query keys are invalidated on success
    - Run 100 iterations minimum
    - _Requirements: 27.1, 27.2_

  - [ ]* 17.4 Write property-based test for analytics percentage bounds
    - **Property 12: Analytics Percentage Bounds**
    - **Validates: Requirements 27.14**
    - Use fast-check to generate random analytics data
    - Verify: all displayed percentages are between 0 and 100
    - Run 100 iterations minimum
    - _Requirements: 27.13, 27.14_

  - [ ]* 17.5 Write property-based test for filter subset property
    - **Property 13: Filter Subset Property**
    - **Validates: Requirements 27.16**
    - Use fast-check to generate random property arrays and filters
    - Verify: filtered results ⊆ original data
    - Run 100 iterations minimum
    - _Requirements: 27.15, 27.16_

  - [ ]* 17.6 Write property-based test for sort order correctness
    - **Property 14: Sort Order Correctness**
    - **Validates: Requirements 27.18**
    - Use fast-check to generate random property arrays and sort criteria
    - Verify: result is properly ordered (ascending or descending)
    - Verify: sorting twice produces same result as sorting once (confluence)
    - Run 100 iterations minimum
    - _Requirements: 27.17, 27.18_

- [x] 18. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 19. Create placeholder screens for navigation
  - [x] 19.1 Create Agents tab screen
    - Create app/(property-admin)/agents.tsx
    - Add placeholder content: "Agents Screen - Coming Soon"
    - Add navigation to agents list and hire agent flows
    - _Requirements: 1.2, 1.3, 16.6_

  - [x] 19.2 Create Units tab screen
    - Create app/(property-admin)/units.tsx
    - Add placeholder content: "All Units Across Properties - Coming Soon"
    - Show aggregated view of all units across all properties
    - _Requirements: 1.2, 1.3_

  - [x] 19.3 Create Analytics tab screen
    - Create app/(property-admin)/analytics.tsx
    - Add placeholder content: "Detailed Analytics - Coming Soon"
    - Add sections for Performance Reports, Market Insights, Tenant Demographics
    - _Requirements: 1.2, 1.3, 16.7_

  - [x] 19.4 Create Profile tab screen
    - Create app/(property-admin)/profile.tsx
    - Add placeholder content: "Profile - Coming Soon"
    - Add user profile information and settings
    - _Requirements: 1.2, 1.3, 16.8_

- [x] 20. Final integration and testing
  - [x] 20.1 Test complete user flows
    - Test: Login → Dashboard → View Properties → View Units → Change Status
    - Test: Dashboard → Sidebar → Navigate to different sections
    - Test: Dashboard → Analytics Card → Detailed Analytics
    - Test: Dashboard → Quick Actions → My Units, Switch Status, Analytics
    - _Requirements: 16.1, 16.2, 16.9, 16.10, 16.11, 16.12_

  - [x] 20.2 Test role-based access control
    - Test Property_Owner can access all features
    - Test Property_Agent has limited access
    - Test unauthorized actions show access denied
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8, 15.9, 15.10, 15.11, 15.12, 15.13, 15.14, 15.15, 15.16, 15.17, 15.18, 15.19_

  - [x] 20.3 Test error handling and recovery
    - Test network error handling
    - Test API error handling (401, 403, 404, 422, 500, 503)
    - Test optimistic update error recovery
    - Test retry functionality
    - _Requirements: 25.1, 25.2, 25.3, 25.4, 25.5, 25.6, 25.17, 25.18, 25.19, 25.20_

  - [x] 20.4 Test performance
    - Test dashboard renders within 500ms
    - Test smooth scrolling in property list and unit grid
    - Test smooth animations in sidebar and modal
    - _Requirements: 29.1, 29.2, 29.3, 29.4, 29.5, 29.8_

  - [x] 20.5 Test accessibility
    - Test with screen reader
    - Test keyboard navigation
    - Test focus management
    - Test contrast ratios
    - _Requirements: 30.1, 30.2, 30.3, 30.4, 30.5, 30.6, 30.7, 30.8, 30.9, 30.10, 30.11, 30.12, 30.13, 30.14, 30.15, 30.16, 30.17, 30.18, 30.19, 30.20_

  - [ ]* 20.6 Write integration tests
    - Test complete flow: dashboard → property → units → status change
    - Test error recovery flow
    - Test role-based access flow
    - _Requirements: 28.1, 28.2, 28.3, 28.4, 28.5, 28.6, 28.7, 28.8, 28.9, 28.10, 28.11, 28.12, 28.13, 28.14, 28.15, 28.16, 28.17, 28.18, 28.19, 28.20_

- [x] 21. Final checkpoint and cleanup
  - Ensure all tests pass, ask the user if questions arise.


## Notes

- **Tasks marked with `*` are optional** and can be skipped for faster MVP delivery. These include unit tests, property-based tests, and integration tests.
- **Core implementation tasks** (without `*`) must be completed for the feature to function.
- **Each task references specific requirements** for traceability using the format `_Requirements: X.Y_`.
- **Property-based tests** validate universal correctness properties using fast-check with 100+ iterations.
- **Checkpoints** ensure incremental validation and provide opportunities to ask questions.
- **Module pattern** must be strictly followed: screens import from `modules/property-admin/index.ts` only, never from internal files.
- **Two-layer state** separation is critical: TanStack Query for server state, Zustand for UI state.
- **Design tokens** from `constants/tokens.ts` must be used for all colors, spacing, typography, and shadows.
- **Optimistic updates** improve perceived performance but must be properly reverted on error.
- **Role-based access control** must be enforced in both UI (hide features) and logic (permission checks).
- **Accessibility** is a first-class concern: all interactive elements need labels, proper contrast, and screen reader support.
- **Performance** is critical: use React.memo, FlatList optimizations, and proper TanStack Query configuration.
- **Error handling** must be comprehensive: network errors, API errors, validation errors, and state errors.
- **Mock data** enables development without backend dependency and should be realistic and varied.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["1.3", "1.4", "2.1"] },
    { "id": 2, "tasks": ["2.2", "2.3"] },
    { "id": 3, "tasks": ["3.1", "3.2"] },
    { "id": 4, "tasks": ["3.3", "3.4", "3.5", "4.1"] },
    { "id": 5, "tasks": ["4.2", "5.1", "5.2", "5.3", "5.4", "5.5"] },
    { "id": 6, "tasks": ["5.6", "5.7", "7.1"] },
    { "id": 7, "tasks": ["7.2", "7.3"] },
    { "id": 8, "tasks": ["7.4", "7.5", "7.6", "7.7"] },
    { "id": 9, "tasks": ["8.1", "8.2"] },
    { "id": 10, "tasks": ["8.3", "8.4", "9.1"] },
    { "id": 11, "tasks": ["9.2", "9.3", "9.4"] },
    { "id": 12, "tasks": ["10.1", "10.2", "10.3", "10.4", "10.5", "10.6"] },
    { "id": 13, "tasks": ["10.7", "10.8", "10.9"] },
    { "id": 14, "tasks": ["12.1", "12.2", "12.3", "12.4", "12.5"] },
    { "id": 15, "tasks": ["13.1", "13.2", "13.3", "13.4"] },
    { "id": 16, "tasks": ["14.1", "14.2", "14.3", "14.4", "14.5", "14.6", "14.7", "14.8"] },
    { "id": 17, "tasks": ["15.1", "15.2", "15.3", "15.4", "15.5", "15.6"] },
    { "id": 18, "tasks": ["16.1", "16.2", "16.3", "16.4", "16.5"] },
    { "id": 19, "tasks": ["17.1", "17.2", "17.3", "17.4", "17.5", "17.6"] },
    { "id": 20, "tasks": ["19.1", "19.2", "19.3", "19.4"] },
    { "id": 21, "tasks": ["20.1", "20.2", "20.3", "20.4", "20.5", "20.6"] }
  ]
}
```
