# Property Admin Module - Requirements Document

## Introduction

The Property Admin Module provides a comprehensive property management dashboard for property owners and agents in the Masqany mobile app. This module enables property owners to manage multiple properties, track analytics, manage units and their statuses, oversee agents, and access financial reports. The module implements role-based access control with different permission levels for property owners and agents.

The module follows the Masqany mobile architecture with TanStack Query for server state management (properties, units, analytics data), Zustand for UI state (sidebar, modals, selections), and the established module pattern. The UI implements a dashboard with analytics cards, action buttons, and property list; an individual property/units screen with unit grid (4 per row); a status change modal for unit management; and a sidebar menu with navigation sections.

**Technical Architecture:**
- Module location: `modules/property-admin/`
- Server state: TanStack Query (properties, units, analytics)
- UI state: Zustand (sidebar, modals, selections)
- Styling: NativeWind/Tailwind with design tokens
- Navigation: Expo Router with file-based routing
- Data: Dummy data until backend is live

**Key Screens:**
1. Dashboard with analytics cards, action buttons, and property list
2. Individual property/units screen with unit grid (4 per row)
3. Status change modal for unit management
4. Sidebar menu with navigation sections

**User Roles:**
- Property Owner: Full access to all features
- Property Agent: Limited access to assigned properties only

## Glossary

- **Property_Admin_Module**: The feature module containing API bindings, hooks, and types for property management operations located in `modules/property-admin/`
- **Property_Owner**: User role with full access to all property management features including agent management, full analytics, and financial reports
- **Property_Agent**: User role with limited access to assigned properties only, can manage unit statuses and property gallery but cannot manage agents or access full financial reports
- **Dashboard_Screen**: Main home screen showing analytics cards, quick action buttons, and horizontal scrollable property list
- **Property_Card**: Visual card displaying property information (type, location, units, price, rating) in horizontal scrollable list
- **Unit_Grid**: Grid layout showing individual units with status indicators, 4 units per row
- **Unit_Status**: State of a unit, one of: occupied, vacant, vacant_soon
- **Status_Modal**: Modal dialog for changing unit status with unit selection dropdown and status cards
- **Sidebar_Menu**: Swipeable navigation menu with property, agent, analytics, and finance sections, opens from left side
- **Analytics_Card**: Dashboard card showing key metrics (occupied units, vacant units, occupancy rate, views) in 2x2 grid
- **Occupancy_Rate**: Percentage of occupied units vs total units, calculated as (occupiedUnits / totalUnits) * 100
- **Tab_Navigator**: Bottom tab navigation with 5 tabs (home, agents, units, analytics, profile)
- **Gradient_Header**: Top header with gradient background from #5DE0E6 to #004AAD, occupies 25% of screen height
- **Property_Type_Badge**: Visual badge indicating property type (bedsitter, 1_bedroom, 2_bedroom, etc.)
- **Bill_Per_Unit**: Monthly rental price per individual unit
- **Monthly_Rentals**: Total monthly rental income from a property, calculated as sum of all occupied unit prices
- **Switch_Property**: Action button to change between different properties in unit view
- **Room_Card**: Individual unit card in the unit grid showing status (color-coded), room number, and status icon
- **Room_Number**: Customizable identifier for a unit (e.g., A5, B12, 101, Room 1)
- **Search_Icon**: Icon to search/filter properties or units
- **Notification_Icon**: Icon to view notifications
- **Menu_Icon**: Icon to open sidebar menu (hamburger icon)
- **Home_Icon**: Icon to return to dashboard or scroll to top
- **Masqany_Logo**: Brand logo displayed in header center
- **Action_Button**: Quick action button (My Units, Switch Status, Analytics) below analytics cards
- **Tenant_Demographics**: Analytics showing tenant information and demographics
- **Performance_Reports**: Analytics showing property performance metrics over time
- **Market_Insights**: Analytics showing market trends and data
- **Transaction_History**: Financial records of all transactions
- **Invoice_Generator**: Tool to create and manage invoices
- **Hire_Agent**: Action to add a new agent to manage properties
- **Agent_Count**: Number of agents currently managing properties
- **Archived_Properties**: Properties that are no longer active but retained for historical records
- **Settings**: Configuration options for the admin module
- **Support_Center**: Help and support resources
- **Query_Key**: Structured array identifier for TanStack Query cache entries
- **Mutation**: TanStack Query operation that modifies server data
- **Skeleton_Loader**: Animated placeholder UI shown while data is loading
- **Empty_State**: UI shown when no data is available with call-to-action
- **Optimistic_Update**: UI update before server confirmation for better perceived performance
- **Pull_To_Refresh**: Gesture to manually refresh data by pulling down on scrollable content

## Requirements

### Requirement 1: Dashboard Screen Layout and Navigation

**User Story:** As a property owner, I want a clear dashboard with tab navigation, so that I can access different sections of property management easily.

#### Acceptance Criteria

1. THE Dashboard_Screen SHALL be the default screen after property registration completion
2. THE Dashboard_Screen SHALL implement tab navigation with 5 tabs
3. THE tabs SHALL be: home, agents, units, analytics, profile
4. THE home tab SHALL be the default active tab
5. THE gradient header SHALL occupy 25% of screen height
6. THE gradient SHALL use colors from property-registration.tsx (#5DE0E6 to #004AAD)
7. THE header SHALL display menu icon on the left
8. THE header SHALL display home icon next to menu icon
9. THE header SHALL display Masqany logo in the center
10. THE header SHALL display notification icon on the right
11. THE menu icon SHALL use assets/icons/menu-icon.webp
12. THE home icon SHALL use assets/icons/home-icon.webp
13. THE notification icon SHALL use assets/icons/notification.webp
14. ALL header icons SHALL be white color
15. THE header icons SHALL be 24x24 pixels
16. WHEN user taps menu icon, THE Sidebar_Menu SHALL open from left
17. WHEN user taps notification icon, THE system SHALL navigate to notifications screen
18. WHEN user taps home icon, THE system SHALL scroll to top of dashboard

### Requirement 2: Welcome Message and User Context

**User Story:** As a property owner, I want to see a personalized welcome message, so that I know I'm in the right account.

#### Acceptance Criteria

1. THE Dashboard_Screen SHALL display a welcome message below the header
2. THE welcome message SHALL show "Welcome back, [Property Owner Name]"
3. THE property owner name SHALL be retrieved from auth store
4. THE welcome message SHALL use white text color
5. THE welcome message SHALL use font-inter-semibold, 18px
6. THE welcome message SHALL have padding: 20px horizontal
7. THE welcome message SHALL be positioned at the top of scrollable content
8. WHEN property owner name is not available, THE system SHALL display "Welcome back"
9. THE welcome message SHALL be visible on home tab only

### Requirement 3: Analytics Cards Display

**User Story:** As a property owner, I want to see key metrics at a glance, so that I can quickly assess my property portfolio performance.

#### Acceptance Criteria

1. THE Dashboard_Screen SHALL display 4 analytics cards in a 2x2 grid
2. THE analytics cards SHALL show: occupied units, vacant units, occupancy rate, total views
3. THE occupied card SHALL use assets/icons/occupied-prop-icon.webp
4. THE vacant card SHALL use assets/icons/vacant-prop-icon.webp
5. THE occupancy card SHALL use assets/icons/occupancy-icon.webp
6. THE views card SHALL use assets/icons/view-icon.webp
7. EACH card SHALL have background color #f3f4f3
8. EACH card SHALL have rounded corners with shadow
9. EACH card SHALL display an icon at the top (32x32 pixels)
10. EACH card SHALL display a number below the icon
11. THE number SHALL use font-poppins-bold, 24px, color #000000
12. EACH card SHALL display a label below the number
13. THE label SHALL use font-inter-medium, 13px, color #545454
14. THE occupied card label SHALL be "Occupied"
15. THE vacant card label SHALL be "Vacant"
16. THE occupancy card label SHALL be "Occupancy Rate"
17. THE views card label SHALL be "Views"
18. THE occupancy rate SHALL be displayed as percentage (e.g., "85%")
19. THE cards SHALL have equal width and height
20. THE cards SHALL have 12px spacing between them
21. THE cards SHALL be tappable to view detailed analytics
22. WHEN user taps a card, THE system SHALL navigate to detailed analytics view

### Requirement 4: Quick Action Buttons

**User Story:** As a property owner, I want quick access to common actions, so that I can perform tasks efficiently.

#### Acceptance Criteria

1. THE Dashboard_Screen SHALL display 3 action buttons below analytics cards
2. THE action buttons SHALL be: My Units, Switch Status, Analytics
3. THE buttons SHALL be displayed horizontally with equal spacing
4. EACH button SHALL have background color #28b4f9
5. EACH button SHALL have rounded corners (radius: 20px)
6. EACH button SHALL have white text, font-inter-semibold, 15px
7. EACH button SHALL have padding: 12px vertical, 20px horizontal
8. EACH button SHALL have shadow for depth
9. THE "My Units" button SHALL navigate to units screen
10. THE "Switch Status" button SHALL open Status_Modal
11. THE "Analytics" button SHALL navigate to analytics tab
12. THE buttons SHALL be tappable with activeOpacity 0.8
13. THE buttons SHALL have 10px spacing between them
14. THE buttons SHALL wrap to next line on small screens

### Requirement 5: My Properties Section and Property Cards

**User Story:** As a property owner, I want to see all my properties in a scrollable list, so that I can manage them individually.

#### Acceptance Criteria

1. THE Dashboard_Screen SHALL display "My Properties" section below action buttons
2. THE section title SHALL be "My Properties"
3. THE section title SHALL use font-poppins-semibold, 20px, color #000000
4. THE properties SHALL be displayed as horizontal scrollable cards
5. EACH Property_Card SHALL have background color #f3f4f3
6. EACH Property_Card SHALL have rounded corners with shadow
7. EACH Property_Card SHALL have width 280px, height 180px
8. THE Property_Card SHALL display property type badge at top-left
9. THE property type badge SHALL have background color #28b4f9
10. THE property type badge SHALL have white text, font-inter-medium, 11px
11. THE property type badge SHALL have rounded corners (radius: 12px)
12. THE property type badge SHALL have padding: 4px horizontal, 2px vertical
13. THE Property_Card SHALL display property icon below badge
14. THE property icon SHALL use assets/icons/house-icon.webp
15. THE property icon SHALL be 40x40 pixels
16. THE Property_Card SHALL display property name below icon
17. THE property name SHALL use font-inter-semibold, 16px, color #000000
18. THE Property_Card SHALL display location below name
19. THE location SHALL use assets/icons/location.png icon (14x14 pixels)
20. THE location text SHALL use font-inter, 13px, color #545454
21. THE Property_Card SHALL display total units count
22. THE total units SHALL use font-inter-medium, 13px, color #000000
23. THE Property_Card SHALL display bill per unit
24. THE bill per unit SHALL use font-inter-bold, 15px, color #28b4f9
25. THE Property_Card SHALL display ratings with star icon
26. THE ratings SHALL use font-inter-medium, 13px, color #000000
27. THE Property_Card SHALL be tappable
28. WHEN user taps Property_Card, THE system SHALL navigate to individual property screen
29. THE property cards SHALL have 16px spacing between them
30. THE horizontal scroll SHALL be smooth with momentum

### Requirement 6: Individual Property/Units Screen

**User Story:** As a property owner, I want to view all units in a specific property, so that I can manage unit statuses and details.

#### Acceptance Criteria

1. THE units screen SHALL display gradient header (25% of screen height)
2. THE header SHALL use same gradient as dashboard (#5DE0E6 to #004AAD)
3. THE header SHALL display property icon on the left
4. THE property icon SHALL use assets/icons/house-icon.webp (32x32 pixels)
5. THE header SHALL display property title next to icon
6. THE property title SHALL use font-poppins-semibold, 20px, white color
7. THE header SHALL display search icon on the right
8. THE search icon SHALL use assets/icons/search.png (24x24 pixels)
9. THE header SHALL display location below title
10. THE location SHALL use assets/icons/location.png icon (16x16 pixels)
11. THE location text SHALL use font-inter, 14px, white color
12. THE header SHALL display total rooms count
13. THE total rooms SHALL use font-inter-medium, 14px, white color
14. THE header SHALL display "Switch Property" button
15. THE "Switch Property" button SHALL have white background with opacity 0.3
16. THE button SHALL have white text, font-inter-semibold, 13px
17. THE button SHALL have rounded corners (radius: 20px)
18. THE button SHALL have padding: 8px horizontal, 6px vertical
19. WHEN user taps "Switch Property", THE system SHALL show property selection dropdown
20. THE header SHALL display price per month
21. THE price SHALL use font-poppins-bold, 22px, white color
22. THE header SHALL display monthly rentals total
23. THE monthly rentals SHALL use font-inter-semibold, 16px, white color
24. THE header SHALL display occupancy ratio (e.g., "40/40 occupied")
25. THE occupancy ratio SHALL use font-inter-medium, 14px, white color

### Requirement 7: Unit Grid Display

**User Story:** As a property owner, I want to see all units in a grid layout with status indicators, so that I can quickly identify vacant and occupied units.

#### Acceptance Criteria

1. THE units screen SHALL display units in a grid layout
2. THE grid SHALL show 4 units per row
3. THE grid SHALL be scrollable vertically
4. EACH Room_Card SHALL be square with equal width and height
5. EACH Room_Card SHALL have rounded corners (radius: 12px)
6. THE Room_Card background color SHALL indicate status
7. WHEN unit is occupied, THE background SHALL be green (#22C55E)
8. WHEN unit is vacant, THE background SHALL be blue (#28b4f9)
9. WHEN unit is vacant soon, THE background SHALL be yellow (#F59E0B)
10. THE Room_Card SHALL display status icon at top
11. THE occupied icon SHALL use assets/icons/occupied-prop-icon.webp
12. THE vacant icon SHALL use assets/icons/vacant-prop-icon.webp
13. THE vacant soon icon SHALL use assets/icons/soon-vacant-prop-icon.webp
14. THE status icon SHALL be 28x28 pixels, white color
15. THE Room_Card SHALL display room number below icon
16. THE room number SHALL use font-inter-bold, 18px, white color
17. THE room number SHALL be customizable (e.g., A5, B12, 101)
18. THE Room_Card SHALL display status text below room number
19. THE status text SHALL use font-inter-medium, 12px, white color
20. THE status text SHALL be "Occupied", "Vacant", or "Vacant Soon"
21. THE Room_Card SHALL display tick mark icon at bottom
22. THE tick mark SHALL indicate confirmed status
23. THE Room_Card SHALL be tappable
24. WHEN user taps Room_Card, THE Status_Modal SHALL open
25. THE grid SHALL have 8px spacing between cards
26. THE grid SHALL have 16px padding on sides

### Requirement 8: Status Change Modal

**User Story:** As a property owner, I want to change unit status through a modal dialog, so that I can update unit availability easily.

#### Acceptance Criteria

1. THE Status_Modal SHALL display as overlay on top of units screen
2. THE modal SHALL have white background with rounded corners
3. THE modal SHALL have shadow for depth
4. THE modal SHALL display property name as title
5. THE title SHALL use font-poppins-semibold, 18px, color #000000
6. THE modal SHALL display unit selection dropdown
7. THE dropdown SHALL have search functionality
8. THE dropdown SHALL show all units for the property
9. THE dropdown SHALL display current status for each unit
10. THE modal SHALL display 3 status cards: Occupied, Soon Vacant, Vacant
11. THE status cards SHALL be displayed vertically
12. EACH status card SHALL have icon, label, and selection indicator
13. THE occupied card SHALL use assets/icons/occupied-prop-icon.webp
14. THE vacant card SHALL use assets/icons/vacant-prop-icon.webp
15. THE soon vacant card SHALL use assets/icons/soon-vacant-prop-icon.webp
16. THE status icons SHALL be 32x32 pixels
17. THE status labels SHALL use font-inter-semibold, 15px
18. ONLY one status card SHALL be selectable at a time
19. THE selected card SHALL have blue background (#28b4f9)
20. THE selected card SHALL have white text
21. THE unselected cards SHALL have gray background (#f3f4f3)
22. THE unselected cards SHALL have dark text (#000000)
23. THE modal SHALL display Cancel button
24. THE modal SHALL display Confirm button
25. THE Cancel button SHALL have gray background (#f3f4f3)
26. THE Confirm button SHALL have blue background (#28b4f9)
27. BOTH buttons SHALL have white text, font-inter-semibold, 15px
28. BOTH buttons SHALL have rounded corners (radius: 20px)
29. BOTH buttons SHALL have padding: 12px vertical
30. WHEN user taps Cancel, THE modal SHALL close without changes
31. WHEN user taps Confirm, THE system SHALL update unit status
32. WHEN status update succeeds, THE modal SHALL close
33. WHEN status update succeeds, THE unit grid SHALL refresh
34. WHEN status update fails, THE system SHALL show error message
35. THE modal SHALL be dismissible by tapping outside

### Requirement 9: Sidebar Menu Structure and Navigation

**User Story:** As a property owner, I want a comprehensive sidebar menu, so that I can access all property management features.

#### Acceptance Criteria

1. THE Sidebar_Menu SHALL open from the left side of screen
2. THE sidebar SHALL be swipeable left to open, right to close
3. THE sidebar SHALL have gradient background (#5DE0E6 to #004AAD)
4. THE sidebar SHALL occupy 80% of screen width
5. THE sidebar SHALL display Masqany logo at top
6. THE logo SHALL be centered horizontally
7. THE logo SHALL have 24px padding from top
8. THE sidebar SHALL display navigation sections
9. THE sections SHALL be: PROPERTIES, AGENTS, ANALYTICS, FINANCE, SUPPORT
10. EACH section SHALL have a header label
11. THE section headers SHALL use font-inter-bold, 13px, white color with opacity 0.7
12. THE section headers SHALL have 16px padding from left
13. THE section headers SHALL have 12px padding from top
14. EACH section SHALL have navigation items below header
15. THE navigation items SHALL have icon and label
16. THE navigation icons SHALL be 20x20 pixels, white color
17. THE navigation labels SHALL use font-inter-medium, 15px, white color
18. THE navigation items SHALL have 12px padding vertical, 16px padding horizontal
19. THE navigation items SHALL be tappable with activeOpacity 0.8
20. WHEN user taps navigation item, THE sidebar SHALL close
21. WHEN user taps navigation item, THE system SHALL navigate to corresponding screen
22. THE sidebar SHALL have close button at top-right
23. THE close button SHALL use assets/icons/close-icon.webp (24x24 pixels)
24. WHEN user taps close button, THE sidebar SHALL close
25. WHEN user taps outside sidebar, THE sidebar SHALL close
26. THE sidebar SHALL animate smoothly when opening/closing

### Requirement 10: Sidebar Properties Section

**User Story:** As a property owner, I want to manage my property listings through the sidebar, so that I can add, view, and archive properties.

#### Acceptance Criteria

1. THE PROPERTIES section SHALL have 3 navigation items
2. THE items SHALL be: Add New Property, All Listings, Archived
3. THE "Add New Property" item SHALL use assets/icons/add-new-property.png
4. THE "All Listings" item SHALL use assets/icons/listing-icon.png
5. THE "Archived" item SHALL use assets/icons/listing-icon.png with opacity 0.6
6. WHEN user taps "Add New Property", THE system SHALL navigate to property registration flow
7. WHEN user taps "All Listings", THE system SHALL navigate to all properties screen
8. WHEN user taps "Archived", THE system SHALL navigate to archived properties screen
9. THE navigation items SHALL be accessible to Property_Owner role only
10. WHEN Property_Agent accesses sidebar, THE "Add New Property" SHALL be hidden

### Requirement 11: Sidebar Agents Section

**User Story:** As a property owner, I want to manage agents through the sidebar, so that I can view and hire agents to help manage properties.

#### Acceptance Criteria

1. THE AGENTS section SHALL have 2 navigation items
2. THE items SHALL be: My Agents, Hire New Agent
3. THE "My Agents" item SHALL use assets/icons/my-agents-icon.png
4. THE "My Agents" item SHALL display agent count in parentheses
5. THE agent count SHALL use font-inter-semibold, 15px, white color
6. THE agent count format SHALL be "My Agents (5)"
7. THE "Hire New Agent" item SHALL use assets/icons/new-agent.webp
8. WHEN user taps "My Agents", THE system SHALL navigate to agents list screen
9. WHEN user taps "Hire New Agent", THE system SHALL navigate to agent hiring flow
10. THE AGENTS section SHALL be accessible to Property_Owner role only
11. WHEN Property_Agent accesses sidebar, THE AGENTS section SHALL be hidden

### Requirement 12: Sidebar Analytics Section

**User Story:** As a property owner, I want to access analytics reports through the sidebar, so that I can make data-driven decisions.

#### Acceptance Criteria

1. THE ANALYTICS section SHALL have 3 navigation items
2. THE items SHALL be: Performance Reports, Market Insights, Tenant Demographics
3. THE "Performance Reports" item SHALL use assets/icons/performance-reports.png
4. THE "Market Insights" item SHALL use assets/icons/market-insights.png
5. THE "Tenant Demographics" item SHALL use assets/icons/tenant-demographics.png
6. WHEN user taps "Performance Reports", THE system SHALL navigate to performance reports screen
7. WHEN user taps "Market Insights", THE system SHALL navigate to market insights screen
8. WHEN user taps "Tenant Demographics", THE system SHALL navigate to tenant demographics screen
9. THE Property_Owner SHALL have access to all analytics items
10. THE Property_Agent SHALL have access to Performance Reports only
11. WHEN Property_Agent accesses sidebar, THE "Market Insights" and "Tenant Demographics" SHALL be hidden

### Requirement 13: Sidebar Finance Section

**User Story:** As a property owner, I want to access financial tools through the sidebar, so that I can manage transactions and invoices.

#### Acceptance Criteria

1. THE FINANCE section SHALL have 2 navigation items
2. THE items SHALL be: Transaction History, Invoice Generator
3. THE "Transaction History" item SHALL use assets/icons/transaction-history.png
4. THE "Invoice Generator" item SHALL use assets/icons/invoice-icon.png
5. WHEN user taps "Transaction History", THE system SHALL navigate to transaction history screen
6. WHEN user taps "Invoice Generator", THE system SHALL navigate to invoice generator screen
7. THE FINANCE section SHALL be accessible to Property_Owner role only
8. WHEN Property_Agent accesses sidebar, THE FINANCE section SHALL be hidden

### Requirement 14: Sidebar Support Section

**User Story:** As a property owner or agent, I want to access settings and support through the sidebar, so that I can configure my account and get help.

#### Acceptance Criteria

1. THE SUPPORT section SHALL have 2 navigation items
2. THE items SHALL be: Settings, Support Center
3. THE "Settings" item SHALL use assets/icons/settings.png
4. THE "Support Center" item SHALL use assets/icons/support.png
5. WHEN user taps "Settings", THE system SHALL navigate to settings screen
6. WHEN user taps "Support Center", THE system SHALL navigate to support center screen
7. THE SUPPORT section SHALL be accessible to both Property_Owner and Property_Agent roles

### Requirement 15: Role-Based Access Control

**User Story:** As a system administrator, I want role-based access control, so that property owners and agents have appropriate permissions.

#### Acceptance Criteria

1. THE Property_Admin_Module SHALL support two user roles: Property_Owner and Property_Agent
2. THE Property_Owner SHALL have full access to all features
3. THE Property_Owner SHALL be able to manage agents
4. THE Property_Owner SHALL be able to view all analytics
5. THE Property_Owner SHALL be able to access financial reports
6. THE Property_Owner SHALL be able to add new properties
7. THE Property_Owner SHALL be able to archive properties
8. THE Property_Agent SHALL have limited access to assigned properties only
9. THE Property_Agent SHALL be able to manage unit statuses for assigned properties
10. THE Property_Agent SHALL be able to manage property gallery for assigned properties
11. THE Property_Agent SHALL NOT be able to manage other agents
12. THE Property_Agent SHALL NOT be able to access full financial reports
13. THE Property_Agent SHALL NOT be able to view market insights
14. THE Property_Agent SHALL NOT be able to view tenant demographics
15. THE Property_Agent SHALL be able to view performance reports for assigned properties only
16. THE system SHALL retrieve user role from auth store
17. THE system SHALL enforce role permissions on all screens
18. WHEN user attempts unauthorized action, THE system SHALL show "Access Denied" message
19. THE system SHALL hide unauthorized features from UI based on role

### Requirement 16: Navigation and Routing

**User Story:** As a property owner, I want seamless navigation between screens, so that I can move through the app efficiently.

#### Acceptance Criteria

1. WHEN property registration completes, THE system SHALL redirect to property admin dashboard
2. THE redirect SHALL happen automatically without user action
3. THE system SHALL use Expo Router for all navigation
4. THE dashboard route SHALL be /(property-admin)/dashboard
5. THE units screen route SHALL be /(property-admin)/units/[propertyId]
6. THE agents screen route SHALL be /(property-admin)/agents
7. THE analytics screen route SHALL be /(property-admin)/analytics
8. THE profile screen route SHALL be /(property-admin)/profile
9. THE system SHALL preserve navigation state when switching tabs
10. THE system SHALL support back navigation with hardware back button
11. THE system SHALL support swipe-back gesture on iOS
12. THE navigation transitions SHALL be smooth and responsive
13. THE system SHALL pass property data through route params
14. THE system SHALL validate route params before rendering screens

### Requirement 17: Temporary Development Access

**User Story:** As a developer, I want temporary access to the property admin dashboard, so that I can test features before backend is ready.

#### Acceptance Criteria

1. THE system SHALL add a temporary access button in auth pages
2. THE button SHALL be labeled "Property Admin (Dev)"
3. THE button SHALL have gray background (#f3f4f3)
4. THE button SHALL have dark text (#000000)
5. THE button SHALL be positioned below main auth buttons
6. THE button SHALL have small text indicating "Development Only"
7. WHEN user taps button, THE system SHALL navigate to property admin dashboard
8. THE button SHALL bypass authentication checks
9. THE button SHALL set a mock user in auth store
10. THE mock user SHALL have Property_Owner role
11. THE button SHALL be removed before production release
12. THE button SHALL only be visible in development environment
13. THE system SHALL use __DEV__ flag to control button visibility

### Requirement 18: Property Admin Module Architecture

**User Story:** As a developer, I want the property admin module to follow the established architecture, so that the codebase remains consistent and maintainable.

#### Acceptance Criteria

1. THE Property_Admin_Module SHALL be located in modules/property-admin/
2. THE Property_Admin_Module SHALL contain api.ts for all API calls
3. THE Property_Admin_Module SHALL contain hooks.ts for all TanStack Query hooks
4. THE Property_Admin_Module SHALL contain types.ts for all TypeScript interfaces
5. THE Property_Admin_Module SHALL contain store.ts for Zustand client state
6. THE Property_Admin_Module SHALL contain index.ts that re-exports all public APIs
7. THE screens SHALL NOT call apiClient directly
8. THE screens SHALL only use hooks from Property_Admin_Module for data access
9. THE Property_Admin_Module SHALL use the single Axios instance from lib/api/client.ts
10. THE Property_Admin_Module SHALL define query keys as const arrays in hooks.ts
11. THE Property_Admin_Module SHALL use TanStack Query for all server state management
12. THE Property_Admin_Module SHALL use Zustand for client state (sidebar open/close, modal state, selected units)
13. THE module SHALL follow the two-layer state pattern (server state + client state)
14. THE module SHALL NOT mix server state and client state in same store

### Requirement 19: Data Types and Interfaces

**User Story:** As a developer, I want clear data structures for properties, units, and analytics, so that I can implement the UI consistently.

#### Acceptance Criteria

1. THE Property interface SHALL include: id, name, type, location (estate, county, coordinates)
2. THE Property interface SHALL include: totalUnits, occupiedUnits, vacantUnits, occupancyRate
3. THE Property interface SHALL include: pricePerUnit, monthlyRentals, currency
4. THE Property interface SHALL include: rating, totalViews, propertyIcon
5. THE Property interface SHALL include: ownerId, agentIds, createdAt, updatedAt
6. THE Unit interface SHALL include: id, propertyId, roomNumber, status
7. THE Unit interface SHALL include: bedrooms, bathrooms, size, price
8. THE Unit interface SHALL include: tenantId, leaseStartDate, leaseEndDate
9. THE Unit interface SHALL include: lastUpdated, updatedBy
10. THE UnitStatus type SHALL be: "occupied" | "vacant" | "vacant_soon"
11. THE Analytics interface SHALL include: totalProperties, totalUnits, occupiedUnits, vacantUnits
12. THE Analytics interface SHALL include: occupancyRate, totalViews, totalRevenue
13. THE Analytics interface SHALL include: period (daily, weekly, monthly, yearly)
14. THE Agent interface SHALL include: id, name, email, phone, avatar
15. THE Agent interface SHALL include: assignedProperties, totalProperties, rating
16. THE Agent interface SHALL include: hireDate, status (active, inactive)
17. THE system SHALL use TypeScript strict mode for all types
18. THE system SHALL export types from modules/property-admin/types.ts

### Requirement 20: TanStack Query Hooks

**User Story:** As a developer, I want TanStack Query hooks for data fetching, so that I can manage server state efficiently.

#### Acceptance Criteria

1. THE module SHALL provide useProperties hook for fetching all properties
2. THE module SHALL provide useProperty hook for fetching single property
3. THE module SHALL provide usePropertyUnits hook for fetching units by property
4. THE module SHALL provide useAnalytics hook for fetching analytics data
5. THE module SHALL provide useAgents hook for fetching agents list
6. THE module SHALL provide useUpdateUnitStatus mutation for updating unit status
7. THE module SHALL provide useCreateProperty mutation for adding new property
8. THE module SHALL provide useArchiveProperty mutation for archiving property
9. THE module SHALL provide useHireAgent mutation for hiring new agent
10. THE query keys SHALL be defined as const arrays
11. THE query keys SHALL follow pattern: ['property-admin', 'properties'], ['property-admin', 'property', id]
12. THE mutations SHALL invalidate relevant queries on success
13. THE hooks SHALL implement proper error handling
14. THE hooks SHALL use staleTime of 5 minutes for properties
15. THE hooks SHALL use staleTime of 1 minute for analytics
16. THE hooks SHALL implement retry logic (2 retries)
17. THE hooks SHALL support pagination for properties list
18. THE hooks SHALL support filtering and sorting

### Requirement 21: Zustand Store for UI State

**User Story:** As a developer, I want centralized UI state management, so that I can manage modals, sidebar, and selections efficiently.

#### Acceptance Criteria

1. THE Property_Admin_Store SHALL manage isSidebarOpen (boolean)
2. THE Property_Admin_Store SHALL manage isStatusModalOpen (boolean)
3. THE Property_Admin_Store SHALL manage selectedProperty (Property | null)
4. THE Property_Admin_Store SHALL manage selectedUnit (Unit | null)
5. THE Property_Admin_Store SHALL manage selectedUnits (string[])
6. THE Property_Admin_Store SHALL provide openSidebar action
7. THE Property_Admin_Store SHALL provide closeSidebar action
8. THE Property_Admin_Store SHALL provide toggleSidebar action
9. THE Property_Admin_Store SHALL provide openStatusModal action
10. THE Property_Admin_Store SHALL provide closeStatusModal action
11. THE Property_Admin_Store SHALL provide setSelectedProperty action
12. THE Property_Admin_Store SHALL provide setSelectedUnit action
13. THE Property_Admin_Store SHALL provide toggleUnitSelection action
14. THE Property_Admin_Store SHALL provide clearSelections action
15. THE store SHALL use selectors pattern for all access
16. THE store SHALL keep state flat (no deep nesting)
17. THE store SHALL NOT store server data (properties, units, analytics)

### Requirement 22: Mock API and Dummy Data

**User Story:** As a developer, I want mock data to test the property admin module, so that I can develop without backend dependency.

#### Acceptance Criteria

1. THE system SHALL create mock API endpoints in modules/property-admin/api.ts
2. THE mock API SHALL simulate network delay (300-800ms)
3. THE mock API SHALL return realistic property data
4. THE mock data SHALL include at least 5 properties
5. THE mock data SHALL include properties with different types (bedsitter, 1BR, 2BR, etc.)
6. THE mock data SHALL include properties with different occupancy rates
7. THE mock data SHALL include units with all status types (occupied, vacant, vacant_soon)
8. THE mock data SHALL include realistic analytics numbers
9. THE mock data SHALL include agent information
10. THE mock data SHALL use actual icon paths from assets/icons/
11. THE mock data SHALL include varied locations (different estates and counties)
12. THE mock data SHALL include varied pricing
13. THE system SHALL store mock data in assets/data/property-admin.ts
14. THE mock API SHALL support filtering by property type
15. THE mock API SHALL support sorting by name, price, occupancy
16. THE mock API SHALL simulate successful and failed responses
17. THE mock API SHALL return proper error messages for failures

### Requirement 23: Design Tokens and Styling

**User Story:** As a developer, I want consistent styling using design tokens, so that the UI matches the brand guidelines.

#### Acceptance Criteria

1. THE module SHALL use colors from constants/tokens.ts
2. THE primary blue SHALL be #20A6FD (primary-700)
3. THE secondary blue SHALL be #28B4F9 (primary-600)
4. THE gradient start SHALL be #5DE0E6
5. THE gradient end SHALL be #004AAD (primary-800)
6. THE card background SHALL be #f3f4f3 (light-300)
7. THE success color SHALL be #22C55E (for occupied status)
8. THE warning color SHALL be #F59E0B (for vacant soon status)
9. THE module SHALL use NativeWind/Tailwind classes for styling
10. THE module SHALL use font-inter for body text
11. THE module SHALL use font-poppins for headings
12. THE module SHALL use consistent spacing from tokens (8px, 12px, 16px, 20px, 24px)
13. THE module SHALL use consistent border radius (12px, 20px, full)
14. THE module SHALL use consistent shadows from tokens
15. THE module SHALL NOT hardcode color values
16. THE module SHALL NOT hardcode spacing values
17. THE module SHALL follow the same gradient pattern as property-registration.tsx

### Requirement 24: Loading States and Skeletons

**User Story:** As a property owner, I want clear loading indicators, so that I know when data is being fetched.

#### Acceptance Criteria

1. THE dashboard SHALL show skeleton loaders while fetching properties
2. THE analytics cards SHALL show skeleton loaders while fetching analytics
3. THE units screen SHALL show skeleton loaders while fetching units
4. THE skeleton loaders SHALL match the layout of actual content
5. THE skeleton loaders SHALL have animated shimmer effect
6. THE skeleton loaders SHALL use light gray background (#f3f4f3)
7. THE skeleton loaders SHALL use white shimmer color
8. THE property cards skeleton SHALL show 3 placeholder cards
9. THE analytics cards skeleton SHALL show 4 placeholder cards
10. THE unit grid skeleton SHALL show 12 placeholder cards
11. THE loading state SHALL NOT block user interaction with loaded content
12. THE loading state SHALL have minimum display time of 300ms to avoid flashing
13. WHEN data loads quickly, THE skeleton SHALL still show for 300ms
14. THE system SHALL show refresh indicator on pull-to-refresh
15. THE refresh indicator SHALL use primary blue color (#20A6FD)

### Requirement 25: Error Handling and Edge Cases

**User Story:** As a property owner, I want graceful error handling, so that I have a smooth experience even when things go wrong.

#### Acceptance Criteria

1. WHEN properties fail to load, THE system SHALL show error message with retry button
2. WHEN analytics fail to load, THE system SHALL show error message in analytics cards
3. WHEN units fail to load, THE system SHALL show error message with retry button
4. WHEN unit status update fails, THE system SHALL show error toast
5. WHEN unit status update fails, THE system SHALL revert optimistic update
6. WHEN network is unavailable, THE system SHALL show "No Internet Connection" message
7. WHEN user has no properties, THE system SHALL show empty state
8. THE empty state SHALL have illustration and message
9. THE empty state SHALL have "Add Property" button
10. WHEN property has no units, THE system SHALL show empty state
11. THE empty state SHALL have "Add Units" button
12. WHEN user has no agents, THE agents screen SHALL show empty state
13. THE empty state SHALL have "Hire Agent" button
14. THE error messages SHALL be user-friendly and actionable
15. THE system SHALL log errors to monitoring service
16. THE system SHALL handle API timeout errors gracefully
17. THE system SHALL handle 401 unauthorized errors by redirecting to login
18. THE system SHALL handle 403 forbidden errors with access denied message
19. THE system SHALL handle 404 not found errors with appropriate message
20. THE system SHALL handle 500 server errors with retry option


### Requirement 26: Data Validation and Correctness Properties

**User Story:** As a developer, I want data validation and correctness properties, so that the system maintains data integrity and behaves predictably.

#### Acceptance Criteria

1. FOR ALL properties, THE occupancyRate SHALL equal (occupiedUnits / totalUnits) * 100
2. FOR ALL properties, THE occupiedUnits + vacantUnits SHALL equal totalUnits
3. FOR ALL properties, THE monthlyRentals SHALL equal sum of all occupied unit prices
4. FOR ALL properties, THE totalUnits SHALL be greater than 0
5. FOR ALL properties, THE occupiedUnits SHALL be between 0 and totalUnits (inclusive)
6. FOR ALL properties, THE vacantUnits SHALL be between 0 and totalUnits (inclusive)
7. FOR ALL properties, THE occupancyRate SHALL be between 0 and 100 (inclusive)
8. FOR ALL units, THE status SHALL be one of: "occupied", "vacant", "vacant_soon"
9. FOR ALL units, THE roomNumber SHALL be non-empty string
10. FOR ALL units, THE propertyId SHALL reference an existing property
11. WHEN unit status changes from vacant to occupied, THE property occupiedUnits SHALL increase by 1
12. WHEN unit status changes from vacant to occupied, THE property vacantUnits SHALL decrease by 1
13. WHEN unit status changes from occupied to vacant, THE property occupiedUnits SHALL decrease by 1
14. WHEN unit status changes from occupied to vacant, THE property vacantUnits SHALL increase by 1
15. WHEN unit status changes, THE property occupancyRate SHALL be recalculated correctly
16. FOR ALL analytics data, THE totalUnits SHALL equal sum of occupiedUnits and vacantUnits
17. FOR ALL role checks, THE Property_Owner SHALL have superset of Property_Agent permissions
18. FOR ALL query keys, THE structure SHALL be ['property-admin', resource, ...params]
19. FOR ALL mutations, THE optimistic update SHALL be reverted on error
20. FOR ALL mutations, THE relevant queries SHALL be invalidated on success

### Requirement 27: Property-Based Testing Requirements

**User Story:** As a developer, I want property-based tests for core logic, so that edge cases are automatically discovered.

#### Acceptance Criteria

1. THE system SHALL test occupancy rate calculation with random unit counts
2. THE test SHALL verify: FOR ALL (occupied, total) WHERE total > 0, occupancyRate = (occupied / total) * 100
3. THE system SHALL test unit status transitions preserve total unit count
4. THE test SHALL verify: FOR ALL status changes, occupiedUnits + vacantUnits = totalUnits (invariant)
5. THE system SHALL test monthly rentals calculation with random unit prices
6. THE test SHALL verify: FOR ALL properties, monthlyRentals = sum of occupied unit prices
7. THE system SHALL test role permission checks with random user roles
8. THE test SHALL verify: FOR ALL features, Property_Owner access implies Property_Agent access OR feature is owner-only
9. THE system SHALL test query key generation with random parameters
10. THE test SHALL verify: FOR ALL query keys, structure matches ['property-admin', resource, ...params]
11. THE system SHALL test unit grid layout with random unit counts
12. THE test SHALL verify: FOR ALL unit counts, grid displays ceil(count / 4) rows
13. THE system SHALL test analytics card calculations with random data
14. THE test SHALL verify: FOR ALL analytics, displayed percentages are between 0 and 100
15. THE system SHALL test property filtering with random filter combinations
16. THE test SHALL verify: FOR ALL filters, result set is subset of original data
17. THE system SHALL test property sorting with random sort orders
18. THE test SHALL verify: FOR ALL sort operations, result is properly ordered (confluence property)
19. THE system SHALL test optimistic updates with random mutations
20. THE test SHALL verify: FOR ALL mutations, state before error = state after error revert (round-trip property)

### Requirement 28: Module Integration and Data Flow

**User Story:** As a developer, I want clear data flow between module layers, so that the architecture remains maintainable.

#### Acceptance Criteria

1. THE screens SHALL import hooks from modules/property-admin/index.ts only
2. THE screens SHALL NOT import from modules/property-admin/api.ts directly
3. THE screens SHALL NOT import from modules/property-admin/hooks.ts directly
4. THE hooks.ts SHALL import from modules/property-admin/api.ts only
5. THE hooks.ts SHALL NOT call apiClient directly
6. THE api.ts SHALL import from lib/api/client.ts only
7. THE api.ts SHALL export named functions for each endpoint
8. THE api.ts SHALL NOT contain React hooks
9. THE api.ts SHALL NOT contain component logic
10. THE types.ts SHALL export all interfaces and types
11. THE types.ts SHALL NOT contain implementation logic
12. THE store.ts SHALL manage UI state only
13. THE store.ts SHALL NOT store server data
14. THE store.ts SHALL use selectors pattern for all access
15. THE index.ts SHALL re-export all public APIs
16. THE index.ts SHALL NOT contain implementation logic
17. THE module SHALL NOT import from other feature modules
18. THE module SHALL import from lib/ and shared/ only
19. THE module SHALL follow two-layer state pattern (server + client)
20. THE module SHALL use design tokens from constants/tokens.ts

### Requirement 29: Performance and Optimization

**User Story:** As a property owner, I want fast and responsive UI, so that I can manage properties efficiently.

#### Acceptance Criteria

1. THE dashboard SHALL render initial view within 500ms
2. THE property cards SHALL use FlatList for efficient rendering
3. THE unit grid SHALL use FlatList with numColumns=4 for efficient rendering
4. THE property cards SHALL implement lazy loading for images
5. THE unit grid SHALL implement virtualization for large unit counts
6. THE analytics cards SHALL use React.memo to prevent unnecessary re-renders
7. THE sidebar SHALL use animated transitions with native driver
8. THE modal SHALL use animated transitions with native driver
9. THE TanStack Query SHALL use staleTime of 5 minutes for properties
10. THE TanStack Query SHALL use staleTime of 1 minute for analytics
11. THE TanStack Query SHALL use cacheTime of 30 minutes
12. THE TanStack Query SHALL deduplicate simultaneous requests
13. THE Zustand store SHALL use selectors to prevent unnecessary re-renders
14. THE Zustand store SHALL use shallow comparison for multiple values
15. THE images SHALL be optimized and compressed
16. THE icons SHALL use WebP format where supported
17. THE system SHALL implement pull-to-refresh with 300ms minimum display time
18. THE system SHALL debounce search input with 300ms delay
19. THE system SHALL implement infinite scroll for large property lists
20. THE system SHALL prefetch next page when user scrolls to 80% of current page

### Requirement 30: Accessibility and Usability

**User Story:** As a property owner with accessibility needs, I want accessible UI, so that I can use the app effectively.

#### Acceptance Criteria

1. ALL interactive elements SHALL have minimum touch target size of 44x44 pixels
2. ALL icons SHALL have accessible labels
3. ALL buttons SHALL have accessible labels
4. ALL form inputs SHALL have accessible labels
5. THE analytics cards SHALL have accessible labels describing the metric
6. THE property cards SHALL have accessible labels with property name and key info
7. THE unit cards SHALL have accessible labels with room number and status
8. THE status modal SHALL have accessible labels for all options
9. THE sidebar menu SHALL have accessible labels for all navigation items
10. THE color-coded unit statuses SHALL have text labels (not color-only)
11. THE system SHALL support screen readers
12. THE system SHALL support dynamic font sizing
13. THE system SHALL maintain 4.5:1 contrast ratio for text
14. THE system SHALL maintain 3:1 contrast ratio for UI components
15. THE focus indicators SHALL be visible and clear
16. THE error messages SHALL be announced to screen readers
17. THE loading states SHALL be announced to screen readers
18. THE success messages SHALL be announced to screen readers
19. THE modal dialogs SHALL trap focus within the modal
20. THE navigation SHALL support keyboard navigation where applicable
