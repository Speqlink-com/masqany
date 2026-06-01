# Requirements Document

## Introduction

Enterprise-grade Map & Moving Service module for Masqany mobile app. Transforms the prototype map implementation into a production-ready system supporting two core functions: relocation services (moving) and property navigation. The module provides real-time location tracking, route visualization, vehicle booking, payment processing, and seamless integration with existing property listings.

## Glossary

- **Move_Service**: The relocation service system that connects users with moving vehicles
- **Map_Module**: The map display and interaction system
- **Vehicle_Selector**: The UI component for choosing vehicle types and viewing availability
- **Route_Visualizer**: The system that displays navigation routes on the map
- **Payment_Gateway**: The system handling M-Pesa and card payment processing
- **Location_Tracker**: The GPS-based real-time location tracking system
- **Property_Navigator**: The system that displays routes from user location to properties
- **Destination_Modal**: The full-screen interface for selecting move destinations
- **Bottom_Sheet**: The scrollable overlay component displaying move options and vehicle details
- **Tab_Bar_Protection**: The fixed 100px blue bar (#3fbdfd) at the bottom of the screen
- **User_Location**: The current GPS coordinates of the user
- **Driver_Location**: The real-time GPS coordinates of available drivers
- **Property_Marker**: Map marker indicating vacant property locations
- **Driver_Marker**: Map marker indicating driver locations
- **STK_Push**: M-Pesa payment initiation mechanism

## Requirements

### Requirement 1: Moving Service Initialization

**User Story:** As a user, I want to initiate a moving service request, so that I can relocate items with professional movers.

#### Acceptance Criteria

1. WHEN the move screen loads, THE Bottom_Sheet SHALL display "Move with Masqany" title
2. THE Bottom_Sheet SHALL display the User_Location as the current location
3. THE Bottom_Sheet SHALL provide a destination selection control
4. THE Bottom_Sheet SHALL scroll smoothly over the Map_Module without blocking map interactions
5. THE Tab_Bar_Protection SHALL remain visible and fixed at 100px height with color #3fbdfd

### Requirement 2: Destination Selection Interface

**User Story:** As a user, I want to select my moving destination, so that I can specify where items should be delivered.

#### Acceptance Criteria

1. WHEN the user taps the destination selection control, THE Destination_Modal SHALL open in full-screen mode
2. THE Destination_Modal SHALL display a close button
3. THE Destination_Modal SHALL pre-select the User_Location as the current location
4. THE Destination_Modal SHALL provide a search input for filtering destinations
5. THE Destination_Modal SHALL display suggested locations with distance in kilometers from User_Location
6. THE Destination_Modal SHALL separate location entries with thin black divider lines
7. THE Destination_Modal SHALL provide vehicle type selection options (pickup, mini truck, etc.)
8. WHEN a destination and vehicle type are selected, THE Destination_Modal SHALL close and return to the map view

### Requirement 3: Vehicle Availability Display

**User Story:** As a user, I want to see available vehicles with pricing, so that I can choose the best option for my move.

#### Acceptance Criteria

1. WHEN a destination and vehicle type are selected, THE Map_Module SHALL display Driver_Marker icons for available vehicles
2. THE Route_Visualizer SHALL display a blue route line between each Driver_Location and User_Location
3. THE Bottom_Sheet SHALL display a scrollable list of available vehicles with prices
4. FOR EACH available vehicle, THE Bottom_Sheet SHALL display the vehicle type, price, and estimated arrival time in minutes
5. THE Map_Module SHALL display distance markers along the route lines

### Requirement 4: Vehicle Selection and Confirmation

**User Story:** As a user, I want to select a specific vehicle and confirm my booking, so that I can secure the moving service.

#### Acceptance Criteria

1. WHEN a user selects a vehicle from the Bottom_Sheet, THE Bottom_Sheet SHALL display estimated arrival time in minutes
2. THE Bottom_Sheet SHALL display the User_Location
3. THE Bottom_Sheet SHALL display the total price
4. THE Bottom_Sheet SHALL provide a "Confirm Move" button
5. WHEN the user taps "Confirm Move", THE Move_Service SHALL navigate to the payment screen

### Requirement 5: Payment Processing

**User Story:** As a user, I want to pay for my moving service, so that I can complete the booking.

#### Acceptance Criteria

1. WHEN the payment screen loads, THE Payment_Gateway SHALL display the Masqany logo
2. THE Payment_Gateway SHALL provide a phone number input field
3. THE Payment_Gateway SHALL display a "Pay KES [amount]" button with the total price
4. WHEN the user taps the pay button with a valid phone number, THE Payment_Gateway SHALL initiate an STK_Push to the provided number
5. THE Payment_Gateway SHALL provide a debit card payment option
6. THE Payment_Gateway SHALL provide a "Cancel move" option
7. WHEN payment is successful, THE Move_Service SHALL confirm the booking

### Requirement 6: Property Navigation

**User Story:** As a user, I want to navigate to a property from the map, so that I can visit properties I'm interested in.

#### Acceptance Criteria

1. WHEN a user taps "View on Map" from a property listing, THE Map_Module SHALL navigate to the map screen
2. THE Route_Visualizer SHALL display a blue route line from User_Location to the property coordinates
3. THE Map_Module SHALL display the distance in kilometers
4. THE Map_Module SHALL display the estimated travel time in minutes
5. THE Property_Navigator SHALL center the map viewport to show both User_Location and the property location

### Requirement 7: Real-Time Location Tracking

**User Story:** As a user, I want my location tracked in real-time, so that the system provides accurate routes and distances.

#### Acceptance Criteria

1. WHEN the Map_Module loads, THE Location_Tracker SHALL request foreground location permissions
2. WHEN permissions are granted, THE Location_Tracker SHALL obtain the User_Location with GPS accuracy
3. THE Location_Tracker SHALL update the User_Location every 5 seconds while the map is active
4. WHEN the User_Location changes, THE Route_Visualizer SHALL recalculate and update displayed routes
5. IF location permissions are denied, THE Map_Module SHALL display a fallback location (Nairobi center: 36.8219, -1.2921)

### Requirement 8: Map Marker Display

**User Story:** As a user, I want to see property and driver locations on the map, so that I can understand spatial relationships.

#### Acceptance Criteria

1. THE Map_Module SHALL display Property_Marker icons for all vacant properties
2. WHILE a moving service request is active, THE Map_Module SHALL display Driver_Marker icons for available drivers
3. WHEN a Property_Marker is tapped, THE Map_Module SHALL zoom to the property location with zoom level 16
4. THE Map_Module SHALL animate marker selections with 900ms duration
5. THE Map_Module SHALL use icons from /assets/icons/ directory

### Requirement 9: Route Visualization

**User Story:** As a user, I want to see routes on the map, so that I can understand the path to my destination.

#### Acceptance Criteria

1. WHEN a route is calculated, THE Route_Visualizer SHALL display the route as a blue line with color #20A6FD
2. THE Route_Visualizer SHALL display distance markers at regular intervals along the route
3. THE Route_Visualizer SHALL animate route drawing with smooth transitions
4. WHEN multiple drivers are available, THE Route_Visualizer SHALL display routes from each Driver_Location to User_Location
5. THE Route_Visualizer SHALL adjust map viewport to show the entire route with appropriate padding

### Requirement 10: Offline Route Caching

**User Story:** As a user, I want previously viewed routes cached, so that I can view them without network connectivity.

#### Acceptance Criteria

1. WHEN a route is successfully calculated, THE Route_Visualizer SHALL cache the route geometry in local storage
2. WHEN network connectivity is unavailable, THE Route_Visualizer SHALL attempt to load routes from cache
3. THE Route_Visualizer SHALL cache up to 50 most recent routes
4. WHEN cache exceeds 50 routes, THE Route_Visualizer SHALL remove the oldest cached route
5. THE Route_Visualizer SHALL display a visual indicator when displaying cached routes

### Requirement 11: Performance Optimization

**User Story:** As a user, I want smooth map interactions, so that the app feels responsive and professional.

#### Acceptance Criteria

1. THE Map_Module SHALL maintain 60 frames per second during scrolling and zooming
2. THE Bottom_Sheet SHALL scroll at 60 frames per second
3. WHEN rendering more than 100 Property_Marker icons, THE Map_Module SHALL use marker clustering
4. THE Map_Module SHALL debounce map movement events to 100ms intervals
5. THE Map_Module SHALL lazy-load map tiles as the user pans

### Requirement 12: Module Architecture Compliance

**User Story:** As a developer, I want the module to follow the established architecture, so that it integrates seamlessly with the codebase.

#### Acceptance Criteria

1. THE Move_Service SHALL implement modules/move/api.ts with pure HTTP calls
2. THE Move_Service SHALL implement modules/move/hooks.ts with TanStack Query hooks
3. THE Move_Service SHALL implement modules/move/types.ts with all TypeScript interfaces
4. THE Move_Service SHALL implement modules/move/index.ts exporting the public API
5. THE Move_Service SHALL use TanStack Query for all server state (vehicle availability, pricing, routes)
6. THE Move_Service SHALL use Zustand for UI state (map viewport, selected vehicle, bottom sheet position)
7. THE Move_Service SHALL NOT import from other modules except through shared/ or lib/
8. THE Move_Service SHALL use the single Axios instance from lib/api/client.ts

### Requirement 13: State Management

**User Story:** As a developer, I want clear state management boundaries, so that the module is maintainable and predictable.

#### Acceptance Criteria

1. THE Move_Service SHALL store vehicle availability data in TanStack Query cache
2. THE Move_Service SHALL store pricing data in TanStack Query cache
3. THE Move_Service SHALL store route geometry in TanStack Query cache
4. THE Move_Service SHALL store map viewport state in Zustand store
5. THE Move_Service SHALL store selected vehicle state in Zustand store
6. THE Move_Service SHALL store bottom sheet snap position in Zustand store
7. THE Move_Service SHALL store destination modal visibility in Zustand store
8. THE Move_Service SHALL invalidate vehicle availability cache every 30 seconds

### Requirement 14: Payment Integration

**User Story:** As a developer, I want payment processing integrated correctly, so that transactions are secure and reliable.

#### Acceptance Criteria

1. THE Payment_Gateway SHALL validate phone numbers match Kenyan format (+254XXXXXXXXX)
2. WHEN initiating STK_Push, THE Payment_Gateway SHALL send booking_id, amount, and phone_number to the backend
3. THE Payment_Gateway SHALL poll payment status every 2 seconds for up to 60 seconds
4. WHEN payment succeeds, THE Payment_Gateway SHALL invalidate booking queries
5. WHEN payment fails, THE Payment_Gateway SHALL display the error message from the backend
6. THE Payment_Gateway SHALL support card payment through the existing payment module
7. IF payment times out after 60 seconds, THE Payment_Gateway SHALL display a timeout message

### Requirement 15: Location Services Integration

**User Story:** As a developer, I want location services properly integrated, so that GPS tracking is reliable and battery-efficient.

#### Acceptance Criteria

1. THE Location_Tracker SHALL use expo-location library for GPS access
2. THE Location_Tracker SHALL request foreground permissions only (not background)
3. THE Location_Tracker SHALL use accuracy level "balanced" (not "high" to save battery)
4. WHEN the map screen is not active, THE Location_Tracker SHALL stop location updates
5. WHEN the map screen becomes active, THE Location_Tracker SHALL resume location updates
6. THE Location_Tracker SHALL handle permission denial gracefully with fallback coordinates

### Requirement 16: Design System Compliance

**User Story:** As a developer, I want the module to use the design system, so that visual consistency is maintained.

#### Acceptance Criteria

1. THE Move_Service SHALL use color tokens from constants/tokens.ts (no hardcoded hex values except Tab_Bar_Protection)
2. THE Move_Service SHALL use NativeWind/Tailwind classes for styling
3. THE Move_Service SHALL use icons from /assets/icons/ directory
4. THE Move_Service SHALL use primary-700 (#20A6FD) for route lines
5. THE Move_Service SHALL use the Tab_Bar_Protection color #3fbdfd for the bottom bar
6. THE Move_Service SHALL use spacing tokens for consistent padding and margins
7. THE Move_Service SHALL use typography tokens for text styles

### Requirement 17: Error Handling

**User Story:** As a user, I want clear error messages, so that I understand what went wrong and how to fix it.

#### Acceptance Criteria

1. WHEN location permissions are denied, THE Map_Module SHALL display "Location access required for moving services"
2. WHEN no vehicles are available, THE Bottom_Sheet SHALL display "No vehicles available in your area"
3. WHEN route calculation fails, THE Route_Visualizer SHALL display "Unable to calculate route"
4. WHEN payment fails, THE Payment_Gateway SHALL display the specific error from the backend
5. WHEN network is unavailable, THE Move_Service SHALL display "No internet connection. Some features may be limited."
6. THE Move_Service SHALL log all errors to the analytics system
7. THE Move_Service SHALL provide a retry mechanism for failed operations

### Requirement 18: Accessibility

**User Story:** As a user with accessibility needs, I want the module to be accessible, so that I can use moving services independently.

#### Acceptance Criteria

1. THE Bottom_Sheet SHALL provide accessibility labels for all interactive elements
2. THE Destination_Modal SHALL support screen reader navigation
3. THE Vehicle_Selector SHALL announce vehicle details when focused
4. THE Payment_Gateway SHALL provide clear labels for form inputs
5. THE Map_Module SHALL provide text alternatives for visual route information
6. THE Move_Service SHALL support minimum touch target size of 44x44 points

### Requirement 19: Testing Support

**User Story:** As a developer, I want mock data available, so that I can develop and test without backend dependencies.

#### Acceptance Criteria

1. THE Move_Service SHALL provide mock vehicle availability data in assets/data/move.ts
2. THE Move_Service SHALL provide mock pricing data in assets/data/move.ts
3. THE Move_Service SHALL provide mock route geometry in assets/data/move.ts
4. THE Move_Service SHALL provide mock driver locations in assets/data/move.ts
5. THE Move_Service SHALL support toggling between mock and real API data via environment variable
6. THE Move_Service SHALL match mock data structure to actual API responses

### Requirement 20: Future Move Scheduling

**User Story:** As a user, I want to schedule moves for later, so that I can plan relocations in advance.

#### Acceptance Criteria

1. THE Destination_Modal SHALL provide a "Schedule for later" option
2. WHEN "Schedule for later" is selected, THE Destination_Modal SHALL display a date/time picker
3. THE Move_Service SHALL validate scheduled times are at least 2 hours in the future
4. THE Move_Service SHALL validate scheduled times are within 30 days
5. WHEN a move is scheduled, THE Move_Service SHALL store the booking with scheduled_time field
6. THE Move_Service SHALL display scheduled moves in a separate "Upcoming Moves" section
