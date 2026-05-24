# Requirements Document

## Introduction

The Driver Dashboard module provides drivers with a comprehensive interface to manage their moving service requests, view performance metrics, and handle active and upcoming moves. The dashboard serves as the primary workspace for drivers to monitor their business operations, accept new jobs, and track their service delivery performance.

## Glossary

- **Driver_Dashboard**: The main screen interface that displays driver metrics, active moves, and upcoming move requests
- **Driver_Profile_Card**: A visual component displaying driver identity, verification status, excellence rating, and current location
- **Metrics_Card**: A visual component displaying a single performance metric (trips, income, clients, or distance)
- **Active_Move**: A move request that has been accepted by the driver and is currently in progress or starting soon
- **Upcoming_Move**: A move request available for drivers to accept on a first-come-first-serve basis
- **Move_Request**: A client's request for moving services including pickup location, destination, service cost, and time allocation
- **Excellence_Rating**: A numerical rating representing driver performance and service quality
- **First_Come_First_Serve**: A job allocation system where the first driver to accept a request is assigned the job
- **Status_Bar_Protection**: A colored bar at the top of the screen that provides visual spacing for the device status bar
- **Tab_Bar_Protection**: A colored bar at the bottom of the screen that provides visual spacing for navigation tabs
- **Pull_To_Refresh**: A gesture-based UI pattern where pulling down on the screen triggers a data refresh
- **Optimistic_Update**: A UI update pattern where the interface updates immediately before server confirmation

## Requirements

### Requirement 1: Dashboard Layout Structure

**User Story:** As a driver, I want a well-structured dashboard layout with proper spacing and visual hierarchy, so that I can easily navigate and view all important information.

#### Acceptance Criteria

1. THE Driver_Dashboard SHALL display a full-screen background using the app-full-screen.webp image
2. THE Driver_Dashboard SHALL display a Status_Bar_Protection area with height of 3.5% of screen height and background color #20A6FD
3. THE Driver_Dashboard SHALL display a Tab_Bar_Protection area with height of 100px and background color #3fbdfd at the bottom of the screen
4. THE Driver_Dashboard SHALL display a header section containing a menu icon on the left and a notification icon on the right
5. THE Driver_Dashboard SHALL arrange content sections in the following order: Driver_Profile_Card, Metrics_Cards, Active_Moves section, Upcoming_Moves section

### Requirement 2: Driver Profile Display

**User Story:** As a driver, I want to see my profile information prominently displayed, so that I can verify my identity and current status at a glance.

#### Acceptance Criteria

1. THE Driver_Profile_Card SHALL display the driver's profile photo
2. THE Driver_Profile_Card SHALL display a verified badge using verified-check-icon.webp WHEN the driver is verified
3. THE Driver_Profile_Card SHALL display the driver's Excellence_Rating with review-star-icon.webp
4. THE Driver_Profile_Card SHALL display the driver's current location with location.png icon
5. THE Driver_Profile_Card SHALL have a width of approximately 50% of the screen width and height of 50px
6. THE Driver_Profile_Card SHALL have a linear gradient background from #5ed0e6 to #004aad at 90 degrees

### Requirement 3: Performance Metrics Display

**User Story:** As a driver, I want to view my key performance metrics, so that I can track my business performance and earnings.

#### Acceptance Criteria

1. THE Driver_Dashboard SHALL display exactly 4 Metrics_Cards with uniform size and styling
2. THE Driver_Dashboard SHALL display a trip Metrics_Card showing total trips count with trip-metrics.png icon
3. THE Driver_Dashboard SHALL display a weekly income Metrics_Card showing average weekly earnings with income-metrics.png icon
4. THE Driver_Dashboard SHALL display a clients served Metrics_Card showing total clients count with client-metrics icon
5. THE Driver_Dashboard SHALL display a distance traveled Metrics_Card showing total kilometers with km-icon.png icon
6. WHEN displaying any Metrics_Card, THE Driver_Dashboard SHALL apply rounded corners, a linear gradient background from #5ed0e6 to #004aad at 90 degrees, and appropriate shadow styling

### Requirement 4: Active Moves Management

**User Story:** As a driver, I want to see my active moves with urgency indicators, so that I can prioritize time-sensitive jobs and take appropriate actions.

#### Acceptance Criteria

1. THE Driver_Dashboard SHALL display an "Active moves!!" section header with active-move.png icon and refresh text
2. WHEN an Active_Move starts within a critical time window, THE Driver_Dashboard SHALL display an urgent card with "STARTS SOON" badge using urgent.png icon
3. WHEN displaying an urgent Active_Move, THE Driver_Dashboard SHALL show minutes remaining with time.png icon
4. THE Driver_Dashboard SHALL display for each Active_Move: client name, location, house type, pickup location, destination location
5. THE Driver_Dashboard SHALL display three action buttons for each Active_Move: "Start Move" button, message button with message.webp icon, and call button with call-icon
6. THE Driver_Dashboard SHALL apply #E1E6E8 background color, rounded corners, and shadow styling to each Active_Move card

### Requirement 5: Upcoming Move Requests Display

**User Story:** As a driver, I want to view available move requests with complete details, so that I can evaluate and accept jobs that fit my schedule and preferences.

#### Acceptance Criteria

1. THE Driver_Dashboard SHALL display an "Upcoming moves" section header with upcoming-moves.png icon and "view all" link
2. THE Driver_Dashboard SHALL display for each Move_Request: request icon, client name, unit type, service cost in KES, pickup location, destination location, time allocated, date, and time
3. THE Driver_Dashboard SHALL display two action buttons for each Move_Request: "Confirm" button and "Reject" button
4. THE Driver_Dashboard SHALL apply #E1E6E8 background color, rounded corners, and shadow styling to each Move_Request card
5. WHEN displaying multiple Move_Requests, THE Driver_Dashboard SHALL order them by date and time with earliest requests first

### Requirement 6: First-Come-First-Serve Job Allocation

**User Story:** As a driver, I want to accept available move requests on a first-come-first-serve basis, so that I can secure jobs quickly and fairly.

#### Acceptance Criteria

1. WHEN a driver confirms a Move_Request, THE Driver_Dashboard SHALL immediately send the acceptance to the server
2. WHEN a driver confirms a Move_Request, THE Driver_Dashboard SHALL apply an Optimistic_Update to show the request as accepted before server confirmation
3. WHEN a Move_Request is accepted by another driver, THE Driver_Dashboard SHALL remove the request from the upcoming moves list
4. WHEN a driver rejects a Move_Request, THE Driver_Dashboard SHALL remove the request from their view
5. IF a driver attempts to confirm a Move_Request that was already accepted by another driver, THEN THE Driver_Dashboard SHALL display an error message indicating the job is no longer available

### Requirement 7: Real-Time Updates

**User Story:** As a driver, I want to receive real-time updates for new move requests and status changes, so that I don't miss opportunities and stay informed.

#### Acceptance Criteria

1. WHEN a new Move_Request becomes available, THE Driver_Dashboard SHALL automatically add it to the upcoming moves list without requiring manual refresh
2. WHEN an Active_Move status changes, THE Driver_Dashboard SHALL automatically update the display to reflect the new status
3. WHEN the minutes remaining for an Active_Move changes, THE Driver_Dashboard SHALL update the countdown display
4. THE Driver_Dashboard SHALL maintain a persistent connection for real-time updates WHILE the dashboard screen is active
5. WHEN the real-time connection is lost, THE Driver_Dashboard SHALL attempt to reconnect automatically

### Requirement 8: Pull-to-Refresh Data Synchronization

**User Story:** As a driver, I want to manually refresh my dashboard data, so that I can ensure I'm viewing the most current information.

#### Acceptance Criteria

1. WHEN a driver performs a Pull_To_Refresh gesture, THE Driver_Dashboard SHALL fetch updated data for all dashboard sections
2. WHEN a Pull_To_Refresh is in progress, THE Driver_Dashboard SHALL display a loading indicator
3. WHEN a Pull_To_Refresh completes successfully, THE Driver_Dashboard SHALL update all displayed data and hide the loading indicator
4. WHEN a Pull_To_Refresh fails, THE Driver_Dashboard SHALL display an error message and maintain the existing data
5. THE Driver_Dashboard SHALL prevent multiple simultaneous Pull_To_Refresh operations

### Requirement 9: Navigation Tabs

**User Story:** As a driver, I want to navigate between different sections of the app using tabs, so that I can access all driver features efficiently.

#### Acceptance Criteria

1. THE Driver_Dashboard SHALL display 4 navigation tabs: Home, Maps, Requests, and Profile
2. WHEN the Driver_Dashboard is active, THE Driver_Dashboard SHALL highlight the Home tab as active
3. WHEN a driver taps the Maps tab, THE Driver_Dashboard SHALL navigate to the maps screen
4. WHEN a driver taps the Requests tab, THE Driver_Dashboard SHALL navigate to the requests screen
5. WHEN a driver taps the Profile tab, THE Driver_Dashboard SHALL navigate to the profile screen

### Requirement 10: Module Architecture and State Management

**User Story:** As a developer, I want the driver dashboard module to follow the Masqany architecture pattern, so that the codebase remains consistent and maintainable.

#### Acceptance Criteria

1. THE Driver_Dashboard module SHALL include the following files: api.ts, hooks.ts, types.ts, store.ts, and index.ts
2. THE Driver_Dashboard module SHALL use TanStack Query for managing server state (metrics, active moves, upcoming moves)
3. THE Driver_Dashboard module SHALL use Zustand for managing UI state (refresh status, selected filters)
4. THE Driver_Dashboard module SHALL define all TypeScript types in types.ts with strict mode enabled
5. THE Driver_Dashboard module SHALL export all public APIs through index.ts

### Requirement 11: Styling and Design System

**User Story:** As a developer, I want the driver dashboard to use the Masqany design system, so that the UI is consistent with the rest of the application.

#### Acceptance Criteria

1. THE Driver_Dashboard SHALL use NativeWind/Tailwind classes for all component styling
2. THE Driver_Dashboard SHALL use design tokens from constants/tokens.ts for colors, spacing, and typography
3. THE Driver_Dashboard SHALL use icon assets from constants/icons.ts
4. THE Driver_Dashboard SHALL use image assets from constants/images.ts
5. THE Driver_Dashboard SHALL NOT hardcode any color hex values directly in components

### Requirement 12: Mock Data for Development

**User Story:** As a developer, I want to use mock data during development, so that I can build and test the dashboard without requiring a backend connection.

#### Acceptance Criteria

1. THE Driver_Dashboard module SHALL provide mock data for driver profile information
2. THE Driver_Dashboard module SHALL provide mock data for performance metrics (trips, income, clients, distance)
3. THE Driver_Dashboard module SHALL provide mock data for at least 2 Active_Moves
4. THE Driver_Dashboard module SHALL provide mock data for at least 3 Upcoming_Move requests
5. THE Driver_Dashboard module SHALL allow easy switching between mock data and real API calls through configuration

### Requirement 13: Action Button Interactions

**User Story:** As a driver, I want to interact with move requests through clear action buttons, so that I can efficiently manage my workload.

#### Acceptance Criteria

1. WHEN a driver taps the "Start Move" button on an Active_Move, THE Driver_Dashboard SHALL navigate to the move execution screen
2. WHEN a driver taps the message button on an Active_Move, THE Driver_Dashboard SHALL open the chat interface with the client
3. WHEN a driver taps the call button on an Active_Move, THE Driver_Dashboard SHALL initiate a phone call to the client
4. WHEN a driver taps the "Confirm" button on a Move_Request, THE Driver_Dashboard SHALL send an acceptance request to the server
5. WHEN a driver taps the "Reject" button on a Move_Request, THE Driver_Dashboard SHALL remove the request from the driver's view

### Requirement 14: Error Handling and Loading States

**User Story:** As a driver, I want clear feedback when data is loading or when errors occur, so that I understand the current state of the application.

#### Acceptance Criteria

1. WHEN the Driver_Dashboard is loading initial data, THE Driver_Dashboard SHALL display loading indicators for each section
2. WHEN a data fetch fails, THE Driver_Dashboard SHALL display an error message with a retry option
3. WHEN an action (confirm/reject) fails, THE Driver_Dashboard SHALL display an error message and revert any Optimistic_Updates
4. WHEN the network connection is lost, THE Driver_Dashboard SHALL display a connection status indicator
5. WHEN the network connection is restored, THE Driver_Dashboard SHALL automatically retry failed operations

### Requirement 15: Responsive Layout

**User Story:** As a driver, I want the dashboard to display correctly on different device sizes, so that I can use the app on various mobile devices.

#### Acceptance Criteria

1. THE Driver_Dashboard SHALL adapt the Driver_Profile_Card width to maintain approximately 50% of screen width across different device sizes
2. THE Driver_Dashboard SHALL arrange Metrics_Cards in a grid layout that adapts to screen width (2x2 grid on standard phones)
3. THE Driver_Dashboard SHALL ensure all text remains readable at minimum supported font sizes
4. THE Driver_Dashboard SHALL ensure all touch targets meet minimum size requirements (44x44 points) for accessibility
5. THE Driver_Dashboard SHALL maintain proper spacing and padding across different screen sizes using responsive design tokens
