# Implementation Plan: Driver Dashboard Module

## Overview

This implementation plan breaks down the Driver Dashboard module into discrete, actionable tasks following the Masqany architecture pattern. The module provides drivers with a comprehensive interface to manage moving service operations, view performance metrics, and handle job requests through a first-come-first-serve allocation system.

The implementation uses TypeScript with React Native, TanStack Query for server state, Zustand for client state, and NativeWind for styling with design tokens.

## Tasks

- [x] 1. Set up module structure and type definitions
  - Create `modules/driver-dashboard/` directory
  - Create `types.ts` with all TypeScript interfaces: `DriverProfile`, `DriverMetrics`, `ActiveMove`, `MoveRequest`, `DashboardData`, `ApiResponse`, `AcceptMovePayload`, `RejectMovePayload`, `StartMovePayload`
  - Create `index.ts` to export all public APIs
  - _Requirements: 10.1, 10.4_

- [x] 2. Implement API layer
  - [x] 2.1 Create API functions in `api.ts`
    - Import `apiClient` from `lib/api/client.ts`
    - Implement `fetchDashboardData()` - GET `/driver/dashboard`
    - Implement `fetchDriverProfile()` - GET `/driver/profile`
    - Implement `fetchDriverMetrics()` - GET `/driver/metrics`
    - Implement `fetchActiveMoves()` - GET `/driver/moves/active`
    - Implement `fetchUpcomingMoves()` - GET `/driver/moves/upcoming`
    - Implement `acceptMove(moveId)` - POST `/driver/moves/:id/accept`
    - Implement `rejectMove(moveId)` - POST `/driver/moves/:id/reject`
    - Implement `startMove(moveId, location)` - POST `/driver/moves/:id/start`
    - _Requirements: 10.1, 6.1, 13.4, 13.5_

- [x] 3. Implement TanStack Query hooks
  - [x] 3.1 Create query hooks in `hooks.ts`
    - Define query keys: `driverDashboardKeys`
    - Implement `useDriverDashboard()` hook with 5min staleTime
    - Implement `useDriverProfile()` hook
    - Implement `useDriverMetrics()` hook
    - Implement `useActiveMoves()` hook with 30s staleTime
    - Implement `useUpcomingMoves()` hook with 30s staleTime
    - Configure retry logic: 2 retries with exponential backoff
    - _Requirements: 10.2, 14.2_

  - [x] 3.2 Create mutation hooks in `hooks.ts`
    - Implement `useAcceptMove()` mutation with optimistic updates
    - Implement `useRejectMove()` mutation with optimistic updates
    - Implement `useStartMove()` mutation
    - Configure error handling with rollback on failure
    - Implement query invalidation after successful mutations
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 13.4, 13.5, 14.3_

- [x] 4. Implement Zustand store for UI state
  - Create `store.ts` with Zustand store
  - Add state: `isRefreshing`, `connectionStatus`, `optimisticUpdates`
  - Add actions: `setRefreshing()`, `setConnectionStatus()`, `addOptimisticUpdate()`, `removeOptimisticUpdate()`
  - _Requirements: 10.3, 8.2, 14.4_

- [x] 5. Create mock data for development
  - Create `constants/data/driver-dashboard.ts`
  - Add `mockDriverProfile` with sample driver data
  - Add `mockDriverMetrics` with sample performance metrics
  - Add `mockActiveMoves` array with 2 sample active moves (one urgent)
  - Add `mockUpcomingMoves` array with 3 sample move requests
  - Export all mock data
  - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [~] 6. Checkpoint - Verify module foundation
  - Ensure all types compile without errors
  - Ensure API functions are properly typed
  - Ensure hooks export correctly from index.ts
  - Ask the user if questions arise

- [x] 7. Create layout components
  - [x] 7.1 Create StatusBarProtection component
    - Create `components/driver-dashboard/StatusBarProtection.tsx`
    - Implement with height 3.5% of screen height
    - Apply background color #20A6FD using design tokens
    - _Requirements: 1.2, 11.2_

  - [x] 7.2 Create TabBarProtection component
    - Create `components/driver-dashboard/TabBarProtection.tsx`
    - Implement with height 100px
    - Apply background color #3fbdfd using design tokens
    - _Requirements: 1.3, 11.2_

- [x] 8. Create DriverProfileCard component
  - Create `components/driver-dashboard/DriverProfileCard.tsx`
  - Accept props: `profile` (DriverProfile type)
  - Display driver profile photo with Image component
  - Display verified badge conditionally using `verified-check-icon.webp` from `constants/icons.ts`
  - Display excellence rating with `review-star-icon.webp` icon
  - Display current location with `location.png` icon
  - Apply width ~50% screen width, height 50px
  - Apply linear gradient background from #5ed0e6 to #004aad at 90 degrees using design tokens
  - Use NativeWind classes for styling
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 11.1, 11.2, 11.3_

- [x] 9. Create MetricsCard component
  - Create `components/driver-dashboard/MetricsCard.tsx`
  - Accept props: `icon`, `label`, `value`, `unit`
  - Display icon from props
  - Display label and formatted value with unit
  - Apply linear gradient background from #5ed0e6 to #004aad at 90 degrees
  - Apply rounded corners and shadow styling using design tokens
  - Use NativeWind classes for styling
  - _Requirements: 3.6, 11.1, 11.2_

- [x] 10. Create MetricsGrid component
  - Create `components/driver-dashboard/MetricsGrid.tsx`
  - Accept props: `metrics` (DriverMetrics type)
  - Render 4 MetricsCard components in 2x2 grid layout
  - Trip card with `trip-metrics.png` icon showing total trips
  - Income card with `income-metrics.png` icon showing weekly income in KES
  - Clients card with `client-metrics` icon showing total clients
  - Distance card with `km-icon.png` icon showing total kilometers
  - Apply responsive spacing using design tokens
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 15.2_

- [x] 11. Create SectionHeader component
  - Create `components/driver-dashboard/SectionHeader.tsx`
  - Accept props: `icon`, `title`, `actionText`, `onActionPress`
  - Display icon and title text
  - Display optional action text as touchable link
  - Use typography tokens for text styling
  - _Requirements: 4.1, 5.1, 11.2_

- [x] 12. Create ActiveMoveCard component
  - Create `components/driver-dashboard/ActiveMoveCard.tsx`
  - Accept props: `move` (ActiveMove type), `onStartMove`, `onMessage`, `onCall`
  - Display "STARTS SOON" badge with `urgent.png` icon when `isUrgent` is true
  - Display countdown timer with `time.png` icon showing `minutesUntilStart`
  - Display client name, location, house type, pickup location, destination location
  - Create three action buttons: "Start Move", message button with `message.webp` icon, call button with `call-icon`
  - Apply background color #E1E6E8, rounded corners, and shadow styling
  - Ensure all buttons meet 44x44 minimum touch target size
  - Use NativeWind classes for styling
  - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.6, 13.1, 13.2, 13.3, 15.4_

- [x] 13. Create UpcomingMoveCard component
  - Create `components/driver-dashboard/UpcomingMoveCard.tsx`
  - Accept props: `moveRequest` (MoveRequest type), `onConfirm`, `onReject`
  - Display request icon, client name, unit type, service cost in KES
  - Display pickup location, destination location, time allocated
  - Display date and time formatted appropriately
  - Create two action buttons: "Confirm" and "Reject"
  - Apply background color #E1E6E8, rounded corners, and shadow styling
  - Ensure all buttons meet 44x44 minimum touch target size
  - Use NativeWind classes for styling
  - _Requirements: 5.2, 5.3, 5.4, 5.5, 13.4, 13.5, 15.4_

- [x] 14. Checkpoint - Verify all components render
  - Ensure all components compile without TypeScript errors
  - Ensure all components use design tokens correctly
  - Ensure all icon and image imports work from constants
  - Ask the user if questions arise

- [x] 15. Create main dashboard screen
  - [x] 15.1 Create dashboard screen file
    - Create `app/(driver)/dashboard.tsx`
    - Import all hooks from `modules/driver-dashboard`
    - Import all components from `components/driver-dashboard`
    - Set up ScrollView with full-screen background using `app-full-screen.webp` from `constants/images.ts`
    - _Requirements: 1.1, 11.4_

  - [x] 15.2 Implement screen layout structure
    - Add StatusBarProtection at top
    - Add header section with menu icon (left) and notification icon (right)
    - Add DriverProfileCard section
    - Add MetricsGrid section
    - Add "Active moves!!" section with SectionHeader
    - Add ActiveMoveCard list
    - Add "Upcoming moves" section with SectionHeader and "view all" link
    - Add UpcomingMoveCard list
    - Add TabBarProtection at bottom
    - _Requirements: 1.4, 1.5_

  - [x] 15.3 Implement data fetching and state management
    - Use `useDriverDashboard()` hook to fetch all dashboard data
    - Use `useAcceptMove()` mutation for confirming move requests
    - Use `useRejectMove()` mutation for rejecting move requests
    - Use `useStartMove()` mutation for starting active moves
    - Handle loading states with loading indicators
    - Handle error states with error messages and retry buttons
    - Handle empty states when no moves available
    - _Requirements: 7.1, 7.2, 14.1, 14.2, 14.3_

  - [x] 15.4 Implement pull-to-refresh functionality
    - Add RefreshControl to ScrollView
    - Connect to Zustand store `isRefreshing` state
    - Trigger `refetch()` on pull-to-refresh gesture
    - Update loading state during refresh
    - Handle refresh errors appropriately
    - Prevent multiple simultaneous refreshes
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 15.5 Implement action button handlers
    - Implement `handleStartMove()` to navigate to move execution screen
    - Implement `handleMessage()` to open chat with client
    - Implement `handleCall()` to initiate phone call
    - Implement `handleConfirmMove()` to accept move request with optimistic update
    - Implement `handleRejectMove()` to reject move request
    - Add error handling for all actions
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 14.3_

- [x] 16. Implement responsive layout adjustments
  - Use Dimensions API to get screen dimensions
  - Apply percentage-based widths for DriverProfileCard (~50%)
  - Ensure MetricsGrid adapts to screen width (2x2 on phones)
  - Ensure all text uses responsive typography tokens
  - Verify all touch targets meet 44x44 minimum size
  - Test on different screen sizes
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [x] 17. Implement error handling and user feedback
  - Add error boundary for component-level errors
  - Display user-friendly error messages for network errors
  - Show "Move already accepted" message for 409 conflicts
  - Show "Session expired" message for 401 errors
  - Display connection status indicator when offline
  - Implement automatic retry for failed operations
  - _Requirements: 6.5, 14.2, 14.3, 14.4, 14.5_

- [x] 18. Add navigation integration
  - Implement navigation to move execution screen on "Start Move"
  - Implement navigation to chat screen on message button
  - Implement phone call initiation on call button
  - Implement tab navigation (Home, Maps, Requests, Profile)
  - Ensure Home tab is highlighted when dashboard is active
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 13.1, 13.2, 13.3_

- [x] 19. Configure mock data toggle
  - Add environment variable `EXPO_PUBLIC_USE_MOCK` to `.env`
  - Implement feature flag in API layer to switch between mock and real data
  - Update hooks to use mock data when flag is enabled
  - Document how to toggle between mock and real API
  - _Requirements: 12.5_

- [x] 20. Checkpoint - End-to-end functionality test
  - Test complete dashboard load with mock data
  - Test pull-to-refresh functionality
  - Test accepting a move request (optimistic update)
  - Test rejecting a move request
  - Test starting an active move
  - Test error handling scenarios
  - Test navigation flows
  - Ensure all tests pass, ask the user if questions arise

- [ ]* 21. Write unit tests for components
  - [ ]* 21.1 Test DriverProfileCard component
    - Test renders with all props correctly
    - Test verified badge shows when isVerified is true
    - Test verified badge hidden when isVerified is false
    - Test excellence rating displays correctly
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ]* 21.2 Test MetricsCard component
    - Test renders with icon, label, value, and unit
    - Test formatting for currency values
    - Test formatting for distance values
    - _Requirements: 3.6_

  - [ ]* 21.3 Test ActiveMoveCard component
    - Test urgent badge shows when isUrgent is true
    - Test countdown timer displays minutesUntilStart
    - Test all action buttons trigger correct callbacks
    - Test touch targets meet minimum size
    - _Requirements: 4.2, 4.3, 4.5, 15.4_

  - [ ]* 21.4 Test UpcomingMoveCard component
    - Test displays all move request details
    - Test Confirm button triggers onConfirm callback
    - Test Reject button triggers onReject callback
    - Test touch targets meet minimum size
    - _Requirements: 5.2, 5.3, 13.4, 13.5, 15.4_

- [ ]* 22. Write unit tests for hooks
  - [ ]* 22.1 Test query hooks
    - Test useDriverDashboard fetches and caches data
    - Test useActiveMoves uses 30s staleTime
    - Test retry logic executes with exponential backoff
    - Test error handling returns normalized errors
    - _Requirements: 10.2, 14.2_

  - [ ]* 22.2 Test mutation hooks
    - Test useAcceptMove applies optimistic update
    - Test useRejectMove removes request from list
    - Test mutations invalidate queries on success
    - Test mutations rollback on error
    - _Requirements: 6.2, 6.3, 14.3_

- [ ]* 23. Write integration tests
  - [ ]* 23.1 Test API integration
    - Test dashboard data fetches successfully
    - Test accept move sends correct payload
    - Test reject move updates server state
    - Test start move navigation works
    - _Requirements: 6.1, 13.4, 13.5, 13.1_

  - [ ]* 23.2 Test navigation integration
    - Test "Start Move" navigates to execution screen
    - Test message button opens chat
    - Test call button initiates phone call
    - Test tab navigation works correctly
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 13.1, 13.2, 13.3_

- [ ]* 24. Write end-to-end tests
  - Test complete user flow: view dashboard → accept move → start move
  - Test pull-to-refresh updates data
  - Test optimistic update applies immediately
  - Test error handling for move already accepted
  - Test navigation between tabs
  - _Requirements: 6.1, 6.2, 6.5, 8.1, 9.1_

- [x] 25. Final checkpoint and documentation
  - Verify all requirements are met
  - Ensure all TypeScript types are properly exported
  - Verify design tokens are used consistently
  - Update module documentation
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP delivery
- All components must use design tokens from `constants/tokens.ts` - no hardcoded colors
- All icons and images must be imported from `constants/icons.ts` and `constants/images.ts`
- The module follows strict Masqany architecture: api.ts → hooks.ts → components → screen
- TypeScript strict mode is enabled - all types must be properly defined
- TanStack Query handles all server state - never call API functions directly from components
- Zustand handles UI state only - keep server and client state separate
- All interactive elements must meet WCAG 2.1 AA accessibility standards
- Pull-to-refresh and optimistic updates provide excellent UX for mobile users
- Mock data allows development without backend dependency
- Real-time updates (WebSocket) are planned for Phase 3 but not included in initial implementation

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1", "4", "5"] },
    { "id": 2, "tasks": ["3.1", "7.1", "7.2"] },
    { "id": 3, "tasks": ["3.2", "8", "9", "11"] },
    { "id": 4, "tasks": ["10", "12", "13"] },
    { "id": 5, "tasks": ["15.1"] },
    { "id": 6, "tasks": ["15.2", "15.3"] },
    { "id": 7, "tasks": ["15.4", "15.5", "16"] },
    { "id": 8, "tasks": ["17", "18", "19"] },
    { "id": 9, "tasks": ["21.1", "21.2", "21.3", "21.4"] },
    { "id": 10, "tasks": ["22.1", "22.2"] },
    { "id": 11, "tasks": ["23.1", "23.2"] },
    { "id": 12, "tasks": ["24"] }
  ]
}
```
