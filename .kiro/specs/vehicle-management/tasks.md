# Implementation Plan: Vehicle Management Module

## Overview

This implementation plan breaks down the Vehicle Management Module into discrete, actionable coding tasks. The module provides comprehensive vehicle registration, management, and verification functionality for the Masqany mobile app. Implementation follows the established architecture with TanStack Query for server state, Zustand for client state, and the standard module pattern.

The implementation is organized into logical phases: module setup, reusable components, registration screen, vehicle management screens, admin screens, and integration features. Each task builds incrementally on previous work, with checkpoints to ensure quality and catch issues early.

## Tasks

- [x] 1. Set up vehicle module structure and core types
  - Create `modules/vehicle/` directory
  - Create `modules/vehicle/types.ts` with all TypeScript interfaces (Vehicle, VehicleDocument, VehiclePhoto, VehicleHistoryEvent, VehicleRegistrationPayload, VehicleUpdatePayload, etc.)
  - Create `modules/vehicle/validation.ts` with validation functions (validatePlateNumber, validateCapacity, validateDocument, validatePhoto, validateMpesaNumber, validateBankAccount, validateRegistrationForm)
  - Create `modules/vehicle/index.ts` with re-exports
  - _Requirements: 21.1, 21.2, 21.3, 21.5_

- [ ]* 1.1 Write unit tests for validation functions
  - Test license plate validation (Kenyan format KEA 100Q)
  - Test capacity validation (50-10000 kg range)
  - Test document validation (file type, size limits)
  - Test photo validation (file type, size, count limits)
  - Test payment method validation (M-Pesa format, bank account)
  - _Requirements: 4.1-4.7, 27.1-27.8, 29.5-29.6_

- [x] 2. Implement vehicle API layer
  - Create `modules/vehicle/api.ts` with vehicleApi object
  - Implement createVehicle endpoint (POST /vehicles with multipart/form-data)
  - Implement getVehicles endpoint (GET /vehicles with filters)
  - Implement getVehicle endpoint (GET /vehicles/:id)
  - Implement updateVehicle endpoint (PUT /vehicles/:id)
  - Implement deleteVehicle endpoint (DELETE /vehicles/:id)
  - Implement setActiveVehicle endpoint (POST /vehicles/:id/set-active)
  - Implement updateVehicleStatus endpoint (PATCH /vehicles/:id/status)
  - Implement getVehicleHistory endpoint (GET /vehicles/:id/history)
  - Implement uploadPhotos endpoint (POST /vehicles/:id/photos)
  - Implement updateDocument endpoint (PUT /vehicles/:id/documents/:type)
  - Implement getExpirationWarnings endpoint (GET /vehicles/expirations)
  - Implement admin endpoints (getAdminVehicles, approveVehicle, rejectVehicle)
  - Use shared apiClient from `lib/api/client.ts`
  - _Requirements: 7.1-7.9, 8.1-8.9, 9.1-9.9, 10.1-10.9, 11.1-11.9, 12.1-12.9, 13.1-13.10, 14.1-14.11, 16.1-16.9_

- [x] 3. Implement TanStack Query hooks
  - Create `modules/vehicle/hooks.ts` with query key definitions
  - Implement useVehicles hook (list with filters, 5min stale time)
  - Implement useVehicle hook (single vehicle details)
  - Implement useCreateVehicle hook (with FormData construction, cache invalidation, navigation)
  - Implement useUpdateVehicle hook (with cache invalidation)
  - Implement useDeleteVehicle hook (with confirmation, cache invalidation, navigation)
  - Implement useSetActiveVehicle hook (with store update, cache invalidation)
  - Implement useUpdateVehicleStatus hook (with optimistic updates)
  - Implement useVehicleHistory hook (10min stale time)
  - Implement useUploadPhotos hook
  - Implement useUpdateDocument hook
  - Implement useExpirationWarnings hook (30min stale time)
  - Implement useAdminVehicles hook (2min stale time for fresher admin data)
  - Implement useApproveVehicle hook
  - Implement useRejectVehicle hook
  - _Requirements: 7.1-7.9, 8.1-8.9, 9.1-9.9, 10.1-10.9, 11.1-11.9, 12.1-12.9, 13.1-13.10, 14.1-14.11, 16.1-16.9, 21.9-21.11_

- [ ]* 3.1 Write unit tests for TanStack Query hooks
  - Test useVehicles fetches and caches data
  - Test useCreateVehicle invalidates cache and navigates
  - Test useUpdateVehicleStatus optimistic updates
  - Test useSetActiveVehicle updates store and cache
  - Test error handling in hooks
  - _Requirements: 7.1-7.9, 12.1-12.9, 13.1-13.10_

- [x] 4. Implement Zustand vehicle store
  - Create `modules/vehicle/store.ts` with VehicleStore interface
  - Implement activeVehicleId state and setter
  - Implement registrationForm state with update and clear methods
  - Implement search and filter state (searchQuery, vehicleTypeFilter, statusFilter, verificationFilter)
  - Implement uploadProgress state for tracking document/photo uploads
  - _Requirements: 17.1-17.8, 21.11_

- [x] 5. Create reusable vehicle components - Part 1 (Badges and Cards)
  - Create `components/vehicle/StatusBadge.tsx` with color-coded status display
  - Create `components/vehicle/VerificationBadge.tsx` with verified/pending/rejected states
  - Create `components/vehicle/VehicleCard.tsx` with plate number, type, status, active badge, press handler
  - Create `components/vehicle/VehicleHeader.tsx` for vehicle details screen header
  - Use design tokens from `constants/tokens.ts` for all styling
  - Implement NativeWind classes for styling
  - _Requirements: 1.1-1.12, 8.6-8.9_

- [ ]* 5.1 Write unit tests for badge and card components
  - Test StatusBadge renders correct color for each status
  - Test VerificationBadge shows correct icon and text
  - Test VehicleCard displays vehicle data correctly
  - Test VehicleCard shows active badge when isActive is true
  - Test VehicleCard calls onPress handler
  - _Requirements: 8.6-8.9_

- [x] 6. Create reusable vehicle components - Part 2 (Input Fields)
  - Create `components/vehicle/PlateNumberInput.tsx` with Kenyan format validation and auto-uppercase
  - Create `components/vehicle/CapacityInput.tsx` with numeric input and unit selector (kg/cubic_meters)
  - Create `components/vehicle/AnimatedInput.tsx` with floating label and focus animations
  - Implement input field icons (user, calendar, phone, email, vehicle, plate, capacity, ID, payment, location)
  - Use blue borders (#20A6FD), black text, error text in danger color
  - _Requirements: 2.1-2.14, 4.1-4.7, 19.1-19.13, 27.1-27.8_

- [ ]* 6.1 Write unit tests for input components
  - Test PlateNumberInput validates format and normalizes to uppercase
  - Test CapacityInput validates min/max range
  - Test AnimatedInput floating label animation
  - Test error message display
  - _Requirements: 4.1-4.7, 27.1-27.8_

- [x] 7. Create reusable vehicle components - Part 3 (Upload Components)
  - Create `components/vehicle/DocumentUpload.tsx` with file picker, validation, progress bar, expiration date picker
  - Create `components/vehicle/PhotoUpload.tsx` with grid layout, add/remove photos, 3-10 photo validation
  - Integrate expo-image-picker for camera and library access
  - Implement file size validation (10MB for documents, 5MB for photos)
  - Implement file type validation (JPEG/PNG/PDF for documents, JPEG/PNG/HEIC for photos)
  - Display upload progress and success indicators
  - _Requirements: 5.1-5.9, 6.1-6.10_

- [ ]* 7.1 Write unit tests for upload components
  - Test DocumentUpload validates file size and type
  - Test PhotoUpload enforces min/max photo count
  - Test upload progress display
  - Test success indicator animation
  - _Requirements: 5.1-5.9, 6.1-6.10_

- [x] 8. Create reusable vehicle components - Part 4 (Selectors)
  - Create `components/vehicle/ServiceZoneSelector.tsx` with multi-select chips for Kenyan cities (Nairobi, Mombasa, Kisumu, Nakuru, Eldoret)
  - Create `components/vehicle/PaymentMethodSelector.tsx` with radio buttons and conditional fields (M-Pesa number, bank details, cash)
  - Implement chip styling (selected: primary background, unselected: light gray)
  - Implement M-Pesa number validation (+254XXXXXXXXX format)
  - Implement bank account validation
  - _Requirements: 28.1-28.8, 29.1-29.9_

- [ ]* 8.1 Write unit tests for selector components
  - Test ServiceZoneSelector multi-select functionality
  - Test PaymentMethodSelector conditional field display
  - Test M-Pesa number format validation
  - Test bank account validation
  - _Requirements: 28.1-28.8, 29.1-29.9_

- [x] 9. Create reusable vehicle components - Part 5 (UI Elements)
  - Create `components/vehicle/GradientHeader.tsx` with 30% height, gradient background (#5de0e6 to #004aad), back button, verification badge, title, subtitle
  - Create `components/vehicle/HistoryTimeline.tsx` with chronological event display, icons, timestamps
  - Create `components/vehicle/VehicleListSkeleton.tsx` for loading state
  - Create `components/vehicle/VehicleDetailsSkeleton.tsx` for loading state
  - Create `components/vehicle/AnimatedButton.tsx` with scale animation on press (0.95)
  - Use expo-linear-gradient for gradient backgrounds
  - _Requirements: 1.1-1.12, 16.1-16.9, 18.1-18.10_

- [x] 10. Implement vehicle registration screen - Part 1 (Layout and Header)
  - Create `app/(registration)/vehicle-registration.tsx`
  - Implement GradientHeader component (30% of screen height)
  - Add background image (app-full-screen.webp)
  - Add back button (white circle with shadow)
  - Add verification badge (pre-verified/verified account)
  - Add title "Become a Verified Masqany Mover" with vehicle icon
  - Add subtitle "complete your profile to unlock trips" with user icon
  - Implement ScrollableCard (70% of screen height, white background, rounded top corners)
  - _Requirements: 1.1-1.12_

- [x] 11. Implement vehicle registration screen - Part 2 (Form Fields)
  - Add "Professional Profile" heading
  - Add full legal name input with user icon
  - Add date of birth input with calendar icon
  - Add gender selector with icon
  - Import and display phone number from Auth Module (read-only, verified)
  - Import and display email from Auth Module (read-only, verified)
  - Add vehicle type selector (pickup, truck, mini_truck)
  - Add plate number input with validation
  - Add capacity input with unit selector
  - Add national ID input with icon
  - All fields use blue borders, black text, consistent spacing
  - _Requirements: 2.1-2.14, 25.1-25.9_

- [x] 12. Implement vehicle registration screen - Part 3 (Documents and Photos)
  - Add document upload section (insurance, driving license, inspection certificate)
  - Add expiration date pickers for insurance and inspection documents
  - Add photo upload section (3-10 photos, 5MB each)
  - Display uploaded document names and success indicators
  - Display photo thumbnails in grid with delete buttons
  - Implement upload progress tracking
  - _Requirements: 5.1-5.9, 6.1-6.10, 30.1-30.9_

- [x] 13. Implement vehicle registration screen - Part 4 (Payment and Service Zones)
  - Add payment method selector (M-Pesa, Bank Transfer, Cash)
  - Add conditional payment detail fields based on selection
  - Add service zone selector with Kenyan cities
  - Display selected zones as chips with remove option
  - Validate payment details based on method
  - _Requirements: 28.1-28.8, 29.1-29.9_

- [x] 14. Implement vehicle registration screen - Part 5 (Submission)
  - Add terms acceptance checkbox with text "I confirm that all information is accurate and I agree to Masqany Driver Terms and background verification"
  - Add submit button "Complete Registration and Start" with pickup icon
  - Implement form validation on submit
  - Display field-specific error messages
  - Handle loading state during submission
  - Handle success (navigate to driver dashboard)
  - Handle errors (display error messages with retry)
  - Clear form state after successful submission
  - _Requirements: 3.1-3.8, 7.1-7.9, 22.1-22.9, 26.1-26.7_

- [ ]* 14.1 Write integration tests for vehicle registration flow
  - Test complete registration flow from form fill to navigation
  - Test validation errors for incomplete form
  - Test document upload validation
  - Test photo count validation
  - Test terms acceptance requirement
  - _Requirements: 3.1-3.8, 7.1-7.9_

- [x] 15. Implement animations for registration screen
  - Add button press animation (scale to 0.95, 150ms)
  - Add card entrance animation (staggered fade + translateY, 250ms)
  - Add input focus animation (border color change 150ms, label float 250ms)
  - Add document upload success fade-in (250ms)
  - Use native driver for all animations
  - Maintain 60fps performance
  - _Requirements: 18.1-18.10_

- [x] 16. Checkpoint - Test vehicle registration
  - Ensure all form fields render correctly
  - Test validation for all input fields
  - Test document and photo uploads
  - Test form submission with valid data
  - Test error handling for invalid data
  - Test navigation after successful registration
  - Ensure all animations are smooth
  - Ask the user if questions arise.

- [x] 17. Create vehicle list screen - Part 1 (Layout and Search)
  - Create `app/(vehicle)/_layout.tsx` for vehicle group
  - Create `app/(vehicle)/vehicle-list.tsx`
  - Add search bar at top for filtering by plate number or type
  - Implement debounced search (300ms delay)
  - Add filter buttons (All, Truck, Mini Truck, Pickup)
  - Add status filter (All, Verified, Pending, Rejected)
  - Implement client-side filtering using Zustand store
  - _Requirements: 17.1-17.8_

- [x] 18. Create vehicle list screen - Part 2 (Vehicle Cards and Actions)
  - Display vehicle cards with plate number, type, status badge, verification badge
  - Show active badge for active vehicle
  - Add "Set Active" button for non-active verified vehicles
  - Implement pull-to-refresh
  - Display empty state "Register your first vehicle" when no vehicles
  - Display vehicle count "X of 5 vehicles registered"
  - Implement staggered card entrance animation (50ms delay per card)
  - Handle navigation to vehicle details on card press
  - _Requirements: 8.1-8.9, 12.1-12.9, 15.1-15.8, 17.1-17.8_

- [ ]* 18.1 Write integration tests for vehicle list
  - Test vehicle list fetching and display
  - Test search functionality
  - Test filter functionality
  - Test set active vehicle flow
  - Test navigation to vehicle details
  - _Requirements: 8.1-8.9, 12.1-12.9, 17.1-17.8_

- [x] 19. Create vehicle details screen - Part 1 (Header and Info)
  - Create `app/(vehicle)/vehicle-details.tsx`
  - Add VehicleHeader with plate number, type, verification badge
  - Display all vehicle information fields (driver name, DOB, gender, phone, email, vehicle type, capacity, national ID, payment method, service zones)
  - Display document section with thumbnails and expiration dates
  - Show expiration warning badges for documents expiring within 30 days
  - Implement document viewer with zoom capability
  - _Requirements: 9.1-9.9, 30.1-30.9_

- [x] 20. Create vehicle details screen - Part 2 (Photos and History)
  - Add photo gallery with grid layout
  - Implement photo viewer with zoom and swipe
  - Add history timeline section
  - Display vehicle events chronologically (most recent first)
  - Show event icons, descriptions, timestamps, performer names
  - _Requirements: 9.1-9.9, 16.1-16.9_

- [x] 21. Create vehicle details screen - Part 3 (Actions)
  - Add status toggle for active vehicle (available/unavailable)
  - Implement optimistic status update
  - Add "Edit" button (only for pending_verification or rejected vehicles)
  - Add "Delete" button (only for non-active vehicles)
  - Add "Set Active" button (only for verified non-active vehicles)
  - Implement delete confirmation dialog
  - Handle navigation to edit screen
  - Handle loading and error states for all actions
  - _Requirements: 9.8-9.9, 10.1-10.9, 11.1-11.9, 12.1-12.9, 13.1-13.10_

- [ ]* 21.1 Write integration tests for vehicle details
  - Test vehicle details display
  - Test status toggle with optimistic update
  - Test delete flow with confirmation
  - Test set active flow
  - Test navigation to edit screen
  - _Requirements: 9.1-9.9, 11.1-11.9, 12.1-12.9, 13.1-13.10_

- [x] 22. Create edit vehicle screen
  - Create `app/(vehicle)/edit-vehicle.tsx`
  - Display editable fields only (capacity, service zones, payment method, photos)
  - Pre-fill form with current vehicle data
  - Implement validation for editable fields
  - Add save and cancel buttons
  - Handle loading state during update
  - Handle success (navigate back to details)
  - Handle errors (display error messages)
  - Invalidate cache after successful update
  - _Requirements: 10.1-10.9_

- [x] 23. Create vehicle history screen
  - Create `app/(vehicle)/vehicle-history.tsx`
  - Display detailed history timeline
  - Implement event filtering (all, status changes, documents, assignments)
  - Show full event details with metadata
  - Add pull-to-refresh
  - _Requirements: 16.1-16.9_

- [x] 24. Checkpoint - Test vehicle management screens
  - Test vehicle list with search and filters
  - Test vehicle details display
  - Test status toggle
  - Test edit vehicle flow
  - Test delete vehicle flow
  - Test set active vehicle flow
  - Test history timeline display
  - Ensure all animations are smooth
  - Ask the user if questions arise.

- [x] 25. Create admin vehicles screen
  - Create `app/(admin)/_layout.tsx` for admin group
  - Create `app/(admin)/admin-vehicles.tsx`
  - Display all vehicles with status pending_verification
  - Show driver name, plate number, vehicle type, registration date on each card
  - Implement filter by verification status
  - Add pull-to-refresh
  - Handle navigation to admin review screen on card press
  - _Requirements: 14.1-14.11_

- [x] 26. Create admin vehicle review screen - Part 1 (Information Display)
  - Create `app/(admin)/admin-vehicle-review.tsx`
  - Display driver information section (name, DOB, gender, phone, email, national ID)
  - Display vehicle information section (type, plate, capacity, payment method, service zones)
  - Display document review section with viewer and zoom
  - Display photo gallery with zoom capability
  - Show all uploaded documents and photos
  - _Requirements: 14.1-14.11_

- [x] 27. Create admin vehicle review screen - Part 2 (Approval Actions)
  - Add approve button
  - Add reject button
  - Implement rejection reason textarea (shown when reject is pressed)
  - Handle approve action (call API, invalidate cache, navigate back)
  - Handle reject action (validate reason, call API, invalidate cache, navigate back)
  - Display loading state during approval/rejection
  - Display success/error messages
  - _Requirements: 14.1-14.11_

- [ ]* 27.1 Write integration tests for admin approval flow
  - Test admin vehicles list display
  - Test navigation to review screen
  - Test approve vehicle flow
  - Test reject vehicle with reason flow
  - Test cache invalidation after approval/rejection
  - _Requirements: 14.1-14.11_

- [x] 28. Implement role-based access control
  - Import user role from Auth Module
  - Add permission guards for vehicle registration (relocation_driver only)
  - Add permission guards for admin screens (admin and super_admin only)
  - Hide/show UI elements based on role (edit, delete, set active buttons)
  - Handle unauthorized access errors (403 Forbidden)
  - Display "You don't have permission" message for unauthorized actions
  - Redirect non-drivers attempting vehicle registration
  - _Requirements: 20.1-20.10, 25.8-25.9_

- [x] 29. Implement document expiration tracking
  - Implement expiration warning logic (30 days, 7 days)
  - Display expiration badges on documents in vehicle details
  - Implement "Update Document" button for expiring/expired documents
  - Auto-set vehicle status to under_maintenance when document expires
  - Prevent setting vehicle as available when documents are expired
  - Implement document update flow (file picker, validation, upload, cache invalidation)
  - _Requirements: 30.1-30.9_

- [x] 30. Implement offline support and caching
  - Configure TanStack Query cache persistence (30min stale time)
  - Display cached vehicle data when offline
  - Show "Offline mode" indicator when no connection
  - Disable create/update/delete operations when offline
  - Display "This action requires internet connection" for disabled operations
  - Auto-refetch data when connection is restored
  - _Requirements: 23.1-23.8_

- [x] 31. Implement error handling and user feedback
  - Add error boundary component for vehicle screens
  - Implement error view with retry button
  - Display field-specific validation errors below inputs
  - Show success toast messages for successful operations
  - Show error toast messages for failed operations
  - Use danger color (#F75555) for errors
  - Use success color (#22C55E) for success messages
  - Log errors to analytics service
  - _Requirements: 22.1-22.9_

- [x] 32. Implement performance optimizations
  - Add image compression before upload (max 1920px width)
  - Implement lazy loading for vehicle photos in detail view
  - Use React.memo for VehicleCard components
  - Implement virtualized scrolling for vehicle list (if >20 vehicles)
  - Prefetch vehicle details when hovering/scrolling
  - Optimize animations with native driver
  - Ensure registration screen loads within 1 second
  - _Requirements: 24.1-24.9_

- [x] 33. Add loading states and skeletons
  - Implement VehicleListSkeleton for initial load
  - Implement VehicleDetailsSkeleton for initial load
  - Add button loading states (disabled + spinner)
  - Add inline loading for status toggle
  - Add progress bars for document/photo uploads
  - Add pull-to-refresh indicators
  - _Requirements: 24.1-24.9_

- [x] 34. Polish animations and transitions
  - Verify button press animations (scale to 0.95, 150ms)
  - Verify card entrance animations (staggered fade + translateY, 250ms)
  - Verify input focus animations (border color 150ms, label float 250ms)
  - Verify status badge pulse on change
  - Verify document upload success fade-in (250ms)
  - Ensure all animations use native driver
  - Test animations on both iOS and Android
  - Maintain 60fps performance
  - _Requirements: 18.1-18.10_

- [x] 35. Final checkpoint - End-to-end testing
  - Test complete vehicle registration flow
  - Test vehicle list with all filters
  - Test vehicle details with all actions
  - Test edit vehicle flow
  - Test delete vehicle flow
  - Test set active vehicle flow
  - Test admin approval workflow
  - Test role-based access control
  - Test document expiration warnings
  - Test offline behavior
  - Test error handling
  - Test all animations and transitions
  - Test on various screen sizes
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and catch issues early
- The implementation uses TypeScript throughout for type safety
- All styling uses design tokens from `constants/tokens.ts`
- All API calls go through the module's hooks, never directly
- The module follows the established Masqany architecture pattern
- Integration with Auth Module provides user identity and role-based access
- Document expiration tracking ensures compliance and safety
- Offline support provides better user experience with cached data
- Performance optimizations ensure smooth 60fps animations and fast load times

