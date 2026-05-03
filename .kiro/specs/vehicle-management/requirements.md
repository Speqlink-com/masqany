# Requirements Document

## Introduction

The Vehicle Management Module provides a comprehensive system for drivers to register, manage, and maintain their vehicles for providing relocation services on the Masqany platform. This module handles the complete vehicle lifecycle from initial registration through document verification, status management, and multi-vehicle operations. The system integrates with the authentication module for user identity and implements role-based access control for drivers, admins, and super admins.

The module follows the Masqany mobile architecture with TanStack Query for server state management, Zustand for client state, and the established module pattern (api.ts, hooks.ts, types.ts, index.ts). The UI implements the Masqany design system with NativeWind styling, motion timing standards, and the specified gradient-based visual hierarchy.

## Glossary

- **Vehicle_Management_Module**: The feature module containing API bindings, hooks, and types for vehicle operations
- **Driver**: A user with the relocation_driver role who can register and manage vehicles
- **Vehicle**: A transportation asset (truck, mini truck, or pickup) registered for relocation services
- **Vehicle_Type**: Classification of vehicle (truck, mini_truck, pickup)
- **License_Plate**: Kenyan vehicle registration number following format KEA 100Q or KEB 211Z
- **Vehicle_Document**: Required documentation (insurance, license, inspection certificate)
- **Vehicle_Status**: Current availability state (available, unavailable, in_service, under_maintenance)
- **Active_Vehicle**: The vehicle currently selected by a driver for accepting assignments
- **Vehicle_Verification**: Admin approval process for vehicle documents
- **Registration_Screen**: The UI for driver vehicle onboarding with gradient header and scrollable form
- **Vehicle_API**: Backend API endpoints for vehicle CRUD operations
- **Admin**: User with admin role who can view and approve vehicle documents
- **Super_Admin**: User with super_admin role who has full vehicle management access
- **Capacity**: Maximum load weight or volume the vehicle can transport
- **Vehicle_Photo**: Image documentation of the vehicle (minimum 3 photos required)
- **Verification_Badge**: UI indicator showing pre-verified or verified account status
- **Auth_Module**: Authentication module providing user session and role information
- **Vehicle_Store**: Zustand store managing client-side vehicle UI state

## Requirements

### Requirement 1: Vehicle Registration Screen Layout

**User Story:** As a driver, I want to see a well-designed registration screen with clear visual hierarchy, so that I can easily understand the registration process and complete my vehicle profile.

#### Acceptance Criteria

1. THE Registration_Screen SHALL display app-full-screen.webp as the background image
2. THE Registration_Screen SHALL allocate the top 30% of the screen as a non-scrollable gradient header
3. THE gradient header SHALL use a linear gradient at 90 degrees from #5de0e6 to #004aad
4. THE gradient header SHALL contain a BackButton component with white background circle in the top left
5. THE gradient header SHALL display a Verification_Badge button with gradient from #a6a6a6 to #ffffff
6. THE Verification_Badge SHALL display "pre-verified account" text for unverified drivers
7. THE Verification_Badge SHALL display "verified account" text for verified drivers
8. THE gradient header SHALL display bold white text "Become a Verified Masqany Mover"
9. THE gradient header SHALL display vehicle-icon.webp to the right of the heading
10. THE gradient header SHALL display small text with user icon "complete your profile to unlock trips" at the bottom
11. THE Registration_Screen SHALL allocate the bottom 70% as a white scrollable card with rounded top corners
12. THE scrollable card SHALL display "Professional Profile" as centered heading text

### Requirement 2: Vehicle Registration Form Fields

**User Story:** As a driver, I want to fill out a comprehensive vehicle registration form with clear input fields, so that I can provide all necessary information for verification.

#### Acceptance Criteria

1. THE Registration_Screen SHALL display a full legal name input field with blue border and black text
2. THE Registration_Screen SHALL display date of birth and gender fields inline as short input fields
3. THE Registration_Screen SHALL display phone number and email fields imported from the Auth_Module
4. THE phone number and email fields SHALL be marked as verified with visual indicators
5. THE Registration_Screen SHALL display a vehicle type selector with options: pickup, truck, mini_truck
6. THE Registration_Screen SHALL display a plate number input field
7. THE Registration_Screen SHALL display a capacity input field
8. THE Registration_Screen SHALL display a national ID input field
9. THE Registration_Screen SHALL display a vehicle insurance upload button
10. THE Registration_Screen SHALL display a driving license upload button
11. THE Registration_Screen SHALL display a payment method selector
12. THE Registration_Screen SHALL display a preferred service zone input field
13. EACH input field SHALL display an appropriate blue icon on the left side
14. EACH input field SHALL use blue borders, black text, and consistent styling from design tokens

### Requirement 3: Vehicle Registration Form Submission

**User Story:** As a driver, I want to submit my vehicle registration with terms acceptance, so that my vehicle can be reviewed and approved for service.

#### Acceptance Criteria

1. THE Registration_Screen SHALL display a checkbox with text "I confirm that all information is accurate and I agree to Masqany Driver Terms and background verification"
2. THE Registration_Screen SHALL display a blue button labeled "Complete Registration and Start" with pickup.webp icon
3. WHEN the driver taps the submit button without accepting terms, THE Registration_Screen SHALL display an error message
4. WHEN the driver taps the submit button with incomplete required fields, THE Registration_Screen SHALL display field-specific error messages
5. WHEN the driver submits valid registration data, THE Vehicle_Management_Module SHALL send a POST request to the Vehicle_API
6. WHEN the registration succeeds, THE Registration_Screen SHALL navigate to the driver dashboard
7. WHEN the registration succeeds, THE driver status SHALL be set to awaiting admin approval
8. WHEN the registration fails, THE Registration_Screen SHALL display an error message with retry option

### Requirement 4: License Plate Validation

**User Story:** As a driver, I want the system to validate my license plate format, so that I can ensure I enter it correctly according to Kenyan standards.

#### Acceptance Criteria

1. THE Vehicle_Management_Module SHALL validate License_Plate format against Kenyan standards
2. THE License_Plate format SHALL match pattern: 3 uppercase letters, space, 3 digits, 1 uppercase letter
3. THE License_Plate validation SHALL accept examples: KEA 100Q, KEB 211Z, KCA 500A
4. WHEN a driver enters an invalid License_Plate format, THE Registration_Screen SHALL display an error message "Invalid plate format. Use format: KEA 100Q"
5. WHEN a driver enters a valid License_Plate, THE Registration_Screen SHALL remove any error messages
6. THE Vehicle_Management_Module SHALL normalize License_Plate input to uppercase
7. THE Vehicle_Management_Module SHALL trim whitespace from License_Plate input

### Requirement 5: Vehicle Document Upload

**User Story:** As a driver, I want to upload required vehicle documents (insurance, license, inspection), so that my vehicle can be verified for service.

#### Acceptance Criteria

1. WHEN a driver taps a document upload button, THE Registration_Screen SHALL open the device image picker
2. THE image picker SHALL allow selection from camera or photo library
3. THE Vehicle_Management_Module SHALL accept image formats: JPEG, PNG, PDF
4. THE Vehicle_Management_Module SHALL enforce maximum file size of 10MB per document
5. WHEN a document upload succeeds, THE Registration_Screen SHALL display a success indicator with document name
6. WHEN a document upload fails, THE Registration_Screen SHALL display an error message
7. THE Vehicle_Management_Module SHALL upload documents to the Vehicle_API using multipart/form-data
8. THE Vehicle_Management_Module SHALL store document URLs returned from the Vehicle_API
9. WHEN a driver uploads a file exceeding 10MB, THE Registration_Screen SHALL display error "File too large. Maximum 10MB"

### Requirement 6: Vehicle Photo Upload

**User Story:** As a driver, I want to upload multiple photos of my vehicle, so that admins can visually verify my vehicle condition and appearance.

#### Acceptance Criteria

1. THE Registration_Screen SHALL display a vehicle photo upload section
2. THE Vehicle_Management_Module SHALL require minimum 3 Vehicle_Photos
3. THE Vehicle_Management_Module SHALL allow maximum 10 Vehicle_Photos
4. WHEN a driver taps add photo, THE Registration_Screen SHALL open the device image picker
5. THE image picker SHALL allow selection from camera or photo library
6. THE Vehicle_Management_Module SHALL accept image formats: JPEG, PNG, HEIC
7. THE Vehicle_Management_Module SHALL enforce maximum 5MB per Vehicle_Photo
8. THE Registration_Screen SHALL display uploaded photos as thumbnails with delete option
9. WHEN a driver has fewer than 3 photos, THE submit button SHALL be disabled
10. WHEN a driver attempts to upload more than 10 photos, THE Registration_Screen SHALL display error "Maximum 10 photos allowed"

### Requirement 7: Create Vehicle Record

**User Story:** As a driver, I want to register a new vehicle in the system, so that I can use it to provide relocation services.

#### Acceptance Criteria

1. THE Vehicle_Management_Module SHALL provide a useCreateVehicle hook
2. WHEN a driver submits vehicle registration, THE Vehicle_Management_Module SHALL call POST /vehicles endpoint
3. THE request payload SHALL include: driverName, dateOfBirth, gender, vehicleType, plateNumber, capacity, nationalId, insuranceDocumentUrl, drivingLicenseUrl, paymentMethod, serviceZone, photos
4. THE Vehicle_Management_Module SHALL include authentication token in request headers
5. WHEN the vehicle creation succeeds, THE Vehicle_API SHALL return the created Vehicle with id and status
6. WHEN the vehicle creation succeeds, THE Vehicle_Management_Module SHALL invalidate the vehicles query cache
7. WHEN the vehicle creation fails with 409 conflict, THE Registration_Screen SHALL display "Vehicle with this plate number already exists"
8. WHEN the vehicle creation fails with 400 validation error, THE Registration_Screen SHALL display field-specific error messages
9. THE newly created Vehicle SHALL have status set to pending_verification

### Requirement 8: View Registered Vehicles

**User Story:** As a driver, I want to view all my registered vehicles in a list, so that I can see my vehicle fleet and their current status.

#### Acceptance Criteria

1. THE Vehicle_Management_Module SHALL provide a useVehicles hook
2. THE useVehicles hook SHALL call GET /vehicles endpoint with driver filter
3. THE Vehicle_API SHALL return an array of Vehicle objects for the authenticated driver
4. EACH Vehicle object SHALL include: id, plateNumber, vehicleType, capacity, status, isActive, verificationStatus, createdAt, updatedAt
5. THE Vehicle_Management_Module SHALL cache vehicle list data for 5 minutes
6. THE vehicle list screen SHALL display vehicles as cards with plate number, type, and status
7. THE vehicle list screen SHALL display verification status badge for each vehicle
8. THE vehicle list screen SHALL display active indicator for the Active_Vehicle
9. WHEN no vehicles exist, THE vehicle list screen SHALL display empty state with "Register your first vehicle" message

### Requirement 9: View Single Vehicle Details

**User Story:** As a driver, I want to view detailed information about a specific vehicle, so that I can review all its data and documents.

#### Acceptance Criteria

1. THE Vehicle_Management_Module SHALL provide a useVehicle hook accepting vehicleId parameter
2. THE useVehicle hook SHALL call GET /vehicles/:id endpoint
3. THE Vehicle_API SHALL return complete Vehicle object including all fields and document URLs
4. THE vehicle details screen SHALL display all vehicle information fields
5. THE vehicle details screen SHALL display uploaded document thumbnails with view option
6. THE vehicle details screen SHALL display all uploaded Vehicle_Photos
7. THE vehicle details screen SHALL display verification status and admin feedback if available
8. THE vehicle details screen SHALL display edit button for vehicles with status pending_verification or rejected
9. THE vehicle details screen SHALL NOT display edit button for vehicles with status verified or in_service

### Requirement 10: Update Vehicle Information

**User Story:** As a driver, I want to update my vehicle information, so that I can keep my vehicle profile accurate and current.

#### Acceptance Criteria

1. THE Vehicle_Management_Module SHALL provide a useUpdateVehicle hook
2. WHEN a driver submits vehicle updates, THE Vehicle_Management_Module SHALL call PUT /vehicles/:id endpoint
3. THE request payload SHALL include only changed fields
4. THE Vehicle_Management_Module SHALL allow updating: capacity, serviceZone, paymentMethod, photos
5. THE Vehicle_Management_Module SHALL NOT allow updating: plateNumber, vehicleType after verification
6. WHEN the update succeeds, THE Vehicle_Management_Module SHALL invalidate vehicle detail and list query caches
7. WHEN the update succeeds, THE vehicle details screen SHALL display success message
8. WHEN the update fails with 403 forbidden, THE vehicle details screen SHALL display "Cannot edit verified vehicle"
9. WHEN a vehicle status is verified, THE Vehicle_Management_Module SHALL only allow updating capacity and serviceZone

### Requirement 11: Delete Vehicle

**User Story:** As a driver, I want to remove a vehicle from my account, so that I can manage my vehicle fleet and remove vehicles I no longer use.

#### Acceptance Criteria

1. THE Vehicle_Management_Module SHALL provide a useDeleteVehicle hook
2. THE vehicle details screen SHALL display a delete button for vehicles not currently Active_Vehicle
3. WHEN a driver taps delete, THE vehicle details screen SHALL display confirmation dialog
4. THE confirmation dialog SHALL display "Are you sure you want to remove this vehicle? This action cannot be undone."
5. WHEN the driver confirms deletion, THE Vehicle_Management_Module SHALL call DELETE /vehicles/:id endpoint
6. WHEN the deletion succeeds, THE Vehicle_Management_Module SHALL invalidate vehicle list query cache
7. WHEN the deletion succeeds, THE vehicle details screen SHALL navigate back to vehicle list
8. WHEN the deletion fails with 403 forbidden, THE vehicle details screen SHALL display "Cannot delete active vehicle"
9. THE Vehicle_API SHALL perform soft delete, setting deletedAt timestamp instead of removing record

### Requirement 12: Set Active Vehicle

**User Story:** As a driver with multiple vehicles, I want to select which vehicle is active for accepting assignments, so that I can control which vehicle I'm currently operating.

#### Acceptance Criteria

1. THE Vehicle_Management_Module SHALL provide a useSetActiveVehicle hook
2. THE vehicle list screen SHALL display "Set Active" button for each non-active verified vehicle
3. WHEN a driver taps "Set Active", THE Vehicle_Management_Module SHALL call POST /vehicles/:id/set-active endpoint
4. WHEN the operation succeeds, THE Vehicle_API SHALL set the specified vehicle as Active_Vehicle
5. WHEN the operation succeeds, THE Vehicle_API SHALL set all other driver vehicles as inactive
6. WHEN the operation succeeds, THE Vehicle_Management_Module SHALL invalidate vehicle list query cache
7. WHEN the operation succeeds, THE vehicle list screen SHALL update active indicators
8. WHEN the operation fails with 400 bad request, THE vehicle list screen SHALL display "Vehicle must be verified to set as active"
9. THE Vehicle_Management_Module SHALL allow only one Active_Vehicle per driver at any time

### Requirement 13: Update Vehicle Status

**User Story:** As a driver, I want to change my vehicle availability status, so that I can control when I'm available to accept relocation assignments.

#### Acceptance Criteria

1. THE Vehicle_Management_Module SHALL provide a useUpdateVehicleStatus hook
2. THE vehicle details screen SHALL display status toggle for Active_Vehicle
3. THE status toggle SHALL allow switching between available and unavailable
4. WHEN a driver changes status, THE Vehicle_Management_Module SHALL call PATCH /vehicles/:id/status endpoint
5. THE request payload SHALL include new Vehicle_Status value
6. WHEN the status update succeeds, THE Vehicle_Management_Module SHALL invalidate vehicle query caches
7. WHEN the status update succeeds, THE vehicle details screen SHALL display updated status
8. THE Vehicle_Management_Module SHALL allow status values: available, unavailable, in_service, under_maintenance
9. THE driver SHALL only be able to set available or unavailable status
10. THE system SHALL automatically set in_service status when driver accepts an assignment

### Requirement 14: Admin Vehicle Approval

**User Story:** As an admin, I want to review and approve driver vehicle registrations, so that I can ensure only qualified vehicles provide services on the platform.

#### Acceptance Criteria

1. THE Vehicle_Management_Module SHALL provide a useAdminVehicles hook for Admin and Super_Admin roles
2. THE admin vehicles screen SHALL display all vehicles with status pending_verification
3. EACH vehicle card SHALL display driver name, plate number, vehicle type, and registration date
4. WHEN an admin taps a vehicle, THE admin vehicles screen SHALL navigate to admin vehicle review screen
5. THE admin vehicle review screen SHALL display all vehicle information and uploaded documents
6. THE admin vehicle review screen SHALL display approve and reject buttons
7. WHEN an admin taps approve, THE Vehicle_Management_Module SHALL call POST /admin/vehicles/:id/approve endpoint
8. WHEN approval succeeds, THE Vehicle_API SHALL set vehicle verificationStatus to verified
9. WHEN an admin taps reject, THE admin vehicle review screen SHALL display rejection reason input
10. WHEN rejection is submitted, THE Vehicle_Management_Module SHALL call POST /admin/vehicles/:id/reject endpoint with reason
11. WHEN rejection succeeds, THE Vehicle_API SHALL set vehicle verificationStatus to rejected and store rejection reason

### Requirement 15: Driver-Vehicle Relationship

**User Story:** As a driver, I want to register multiple vehicles under my account, so that I can operate different vehicles for different types of relocation jobs.

#### Acceptance Criteria

1. THE Vehicle_Management_Module SHALL allow one Driver to register multiple Vehicles
2. THE Vehicle_API SHALL enforce foreign key relationship between Driver and Vehicle
3. THE Vehicle_API SHALL store driverId on each Vehicle record
4. THE useVehicles hook SHALL filter vehicles by authenticated driver's ID
5. THE Vehicle_Management_Module SHALL allow maximum 5 vehicles per driver
6. WHEN a driver attempts to register a 6th vehicle, THE Vehicle_API SHALL return 400 error "Maximum 5 vehicles allowed per driver"
7. THE vehicle list screen SHALL display vehicle count "X of 5 vehicles registered"
8. THE Vehicle_API SHALL cascade driver account deletion to set vehicles as inactive

### Requirement 16: Vehicle History Tracking

**User Story:** As a driver, I want to view my vehicle's service history, so that I can track maintenance, assignments, and status changes over time.

#### Acceptance Criteria

1. THE Vehicle_Management_Module SHALL provide a useVehicleHistory hook accepting vehicleId parameter
2. THE useVehicleHistory hook SHALL call GET /vehicles/:id/history endpoint
3. THE Vehicle_API SHALL return chronological array of vehicle events
4. EACH history event SHALL include: timestamp, eventType, description, performedBy
5. THE Vehicle_API SHALL track events: created, verified, rejected, status_changed, document_updated, assignment_completed
6. THE vehicle details screen SHALL display history timeline with most recent events first
7. THE history timeline SHALL display event icon, description, and timestamp
8. THE history timeline SHALL display admin name for verification events
9. THE Vehicle_Management_Module SHALL cache history data for 10 minutes

### Requirement 17: Vehicle Search and Filtering

**User Story:** As a driver with multiple vehicles, I want to search and filter my vehicle list, so that I can quickly find specific vehicles.

#### Acceptance Criteria

1. THE vehicle list screen SHALL display a search input field at the top
2. WHEN a driver types in search, THE vehicle list SHALL filter by plate number or vehicle type
3. THE vehicle list screen SHALL display filter buttons for vehicle type
4. THE filter buttons SHALL include: All, Truck, Mini Truck, Pickup
5. WHEN a driver taps a filter button, THE vehicle list SHALL display only matching vehicles
6. THE vehicle list screen SHALL display status filter: All, Verified, Pending, Rejected
7. THE Vehicle_Management_Module SHALL perform client-side filtering on cached vehicle data
8. THE search and filters SHALL work together with AND logic

### Requirement 18: Animation and Motion Timing

**User Story:** As a driver, I want smooth and responsive animations throughout the vehicle management interface, so that the app feels polished and professional.

#### Acceptance Criteria

1. THE Registration_Screen SHALL use motion timing system: fast 150ms, normal 250ms, slow 350ms
2. WHEN a driver taps a button, THE button SHALL scale to 0.95 with spring animation
3. WHEN the Registration_Screen loads, THE form cards SHALL animate with staggered fade and translateY
4. WHEN an input field receives focus, THE border color SHALL animate over 150ms
5. WHEN an input field receives focus, THE label SHALL float upward with 250ms animation
6. THE Vehicle_Management_Module SHALL use native driver for all animations
7. THE vehicle list cards SHALL animate in with staggered delays of 50ms per card
8. WHEN a vehicle status changes, THE status badge SHALL pulse once with scale animation
9. THE document upload success indicator SHALL fade in over 250ms
10. THE Vehicle_Management_Module SHALL avoid animation overdoing and maintain 60fps performance

### Requirement 19: Input Field Icons and Visual Design

**User Story:** As a driver, I want visually appealing input fields with appropriate icons, so that the form is easy to understand and pleasant to use.

#### Acceptance Criteria

1. THE full legal name field SHALL display user-profile-icon.webp as the field icon
2. THE date of birth field SHALL display a calendar/date picker icon
3. THE gender field SHALL display an appropriate gender icon
4. THE phone number field SHALL display a phone icon
5. THE email field SHALL display an email/envelope icon
6. THE vehicle type field SHALL display vehicle-icon.webp
7. THE plate number field SHALL display a license plate icon
8. THE capacity field SHALL display a weight/capacity icon
9. THE national ID field SHALL display an ID card icon
10. THE payment method field SHALL display a payment/card icon
11. THE service zone field SHALL display a location/map pin icon
12. ALL field icons SHALL use blue color matching the design tokens
13. ALL field icons SHALL be positioned on the left side of the input with consistent spacing

### Requirement 20: Role-Based Access Control

**User Story:** As a system administrator, I want to enforce role-based permissions for vehicle operations, so that only authorized users can perform specific actions.

#### Acceptance Criteria

1. THE Vehicle_Management_Module SHALL verify user role from Auth_Module before allowing operations
2. THE Driver role SHALL have full CRUD access to their own vehicles
3. THE Driver role SHALL NOT have access to other drivers' vehicles
4. THE Admin role SHALL have read access to all vehicles
5. THE Admin role SHALL have approve and reject permissions for vehicle verification
6. THE Super_Admin role SHALL have full access to all vehicle operations
7. THE Super_Admin role SHALL be able to delete any vehicle
8. WHEN a user attempts unauthorized operation, THE Vehicle_API SHALL return 403 Forbidden
9. WHEN a user attempts unauthorized operation, THE Vehicle_Management_Module SHALL display error "You don't have permission to perform this action"
10. THE Vehicle_Management_Module SHALL hide UI elements for unauthorized actions based on user role

### Requirement 21: Vehicle Module Architecture

**User Story:** As a developer, I want the vehicle management feature to follow the established module pattern, so that the codebase remains consistent and maintainable.

#### Acceptance Criteria

1. THE Vehicle_Management_Module SHALL be located in modules/vehicle/
2. THE Vehicle_Management_Module SHALL contain api.ts for all API calls
3. THE Vehicle_Management_Module SHALL contain hooks.ts for all TanStack Query hooks
4. THE Vehicle_Management_Module SHALL contain types.ts for all TypeScript interfaces
5. THE Vehicle_Management_Module SHALL contain index.ts that re-exports all public APIs
6. THE Registration_Screen SHALL NOT call apiClient directly
7. THE Registration_Screen SHALL only use hooks from Vehicle_Management_Module for data access
8. THE Vehicle_Management_Module SHALL use the single Axios instance from lib/api/client.ts
9. THE Vehicle_Management_Module SHALL define query keys as const arrays in hooks.ts
10. THE Vehicle_Management_Module SHALL use TanStack Query for all server state management
11. THE Vehicle_Management_Module SHALL use Vehicle_Store for client state management

### Requirement 22: Error Handling and User Feedback

**User Story:** As a driver, I want clear error messages and feedback when something goes wrong, so that I can understand and resolve issues.

#### Acceptance Criteria

1. WHEN a network error occurs, THE Vehicle_Management_Module SHALL display "Network error. Please check your connection."
2. WHEN a validation error occurs, THE Registration_Screen SHALL display field-specific error messages below the relevant input
3. WHEN a server error occurs, THE Vehicle_Management_Module SHALL display "Something went wrong. Please try again."
4. WHEN a vehicle operation succeeds, THE Vehicle_Management_Module SHALL display success toast message
5. THE error messages SHALL use danger color from design tokens (#F75555)
6. THE success messages SHALL use success color from design tokens (#22C55E)
7. THE Vehicle_Management_Module SHALL log errors to analytics service for debugging
8. WHEN a document upload fails, THE error message SHALL include the specific reason (file too large, invalid format, network error)
9. THE Vehicle_Management_Module SHALL provide retry functionality for failed operations

### Requirement 23: Offline Support and Data Persistence

**User Story:** As a driver, I want my vehicle data to be available offline, so that I can view my vehicles even without internet connection.

#### Acceptance Criteria

1. THE Vehicle_Management_Module SHALL cache vehicle list data using TanStack Query
2. THE cached vehicle data SHALL persist for 30 minutes stale time
3. WHEN offline, THE vehicle list screen SHALL display cached vehicle data
4. WHEN offline, THE vehicle list screen SHALL display "Offline mode" indicator
5. WHEN offline, THE Vehicle_Management_Module SHALL disable create, update, and delete operations
6. WHEN offline, THE disabled operations SHALL display "This action requires internet connection"
7. WHEN connection is restored, THE Vehicle_Management_Module SHALL automatically refetch vehicle data
8. THE Vehicle_Management_Module SHALL queue mutations for retry when connection is restored (future enhancement)

### Requirement 24: Performance Optimization

**User Story:** As a driver, I want the vehicle management interface to load quickly and respond smoothly, so that I can efficiently manage my vehicles.

#### Acceptance Criteria

1. THE Registration_Screen SHALL load and render within 1 second on average devices
2. THE vehicle list screen SHALL display cached data immediately while fetching fresh data in background
3. THE Vehicle_Management_Module SHALL use optimistic updates for status changes
4. THE Vehicle_Management_Module SHALL prefetch vehicle details when hovering over vehicle cards (web) or scrolling (mobile)
5. THE Vehicle_Management_Module SHALL compress uploaded images to maximum 1920px width before upload
6. THE Vehicle_Management_Module SHALL use lazy loading for vehicle photos in detail view
7. THE vehicle list SHALL use virtualized scrolling for lists exceeding 20 vehicles
8. THE Vehicle_Management_Module SHALL debounce search input by 300ms to reduce unnecessary filtering
9. THE Vehicle_Management_Module SHALL use React.memo for vehicle card components to prevent unnecessary re-renders

### Requirement 25: Integration with Auth Module

**User Story:** As a driver, I want my vehicle registration to seamlessly integrate with my user profile, so that I don't have to re-enter information I've already provided.

#### Acceptance Criteria

1. THE Registration_Screen SHALL import phone number from Auth_Module user profile
2. THE Registration_Screen SHALL import email from Auth_Module user profile
3. THE imported phone and email fields SHALL be marked as verified with checkmark icons
4. THE imported phone and email fields SHALL be read-only
5. THE Vehicle_Management_Module SHALL use authentication token from Auth_Module for all API requests
6. WHEN a user logs out, THE Vehicle_Management_Module SHALL clear all cached vehicle data
7. WHEN a user switches accounts, THE Vehicle_Management_Module SHALL refetch vehicles for the new account
8. THE Vehicle_Management_Module SHALL verify user has relocation_driver role before allowing vehicle registration
9. WHEN a non-driver user accesses vehicle registration, THE system SHALL display "Only drivers can register vehicles" and redirect to home

### Requirement 26: Redirect After Registration

**User Story:** As a driver, I want to be redirected to the appropriate screen after completing vehicle registration, so that I can start using the platform immediately.

#### Acceptance Criteria

1. WHEN vehicle registration succeeds, THE Registration_Screen SHALL navigate to the driver dashboard
2. THE driver dashboard SHALL display "Awaiting Verification" status banner
3. THE status banner SHALL explain "Your vehicle is under review. You'll be notified once approved."
4. THE driver dashboard SHALL display the registered vehicle details
5. THE driver dashboard SHALL disable "Accept Jobs" functionality until vehicle is verified
6. WHEN a driver has no verified vehicles, THE driver dashboard SHALL display "Complete vehicle verification to start accepting jobs"
7. THE Vehicle_Management_Module SHALL send push notification when vehicle verification status changes

### Requirement 27: Capacity Input Validation

**User Story:** As a driver, I want the system to validate my vehicle capacity input, so that I provide realistic and accurate load capacity information.

#### Acceptance Criteria

1. THE capacity input field SHALL accept numeric values only
2. THE capacity input field SHALL display unit selector: kg or cubic meters
3. THE Vehicle_Management_Module SHALL enforce minimum capacity of 50 kg
4. THE Vehicle_Management_Module SHALL enforce maximum capacity of 10000 kg
5. WHEN a driver enters capacity below minimum, THE Registration_Screen SHALL display "Minimum capacity is 50 kg"
6. WHEN a driver enters capacity above maximum, THE Registration_Screen SHALL display "Maximum capacity is 10000 kg"
7. THE Vehicle_Management_Module SHALL store capacity as numeric value with unit
8. THE vehicle list and details screens SHALL display capacity with appropriate unit

### Requirement 28: Service Zone Selection

**User Story:** As a driver, I want to select my preferred service zones, so that I receive assignment notifications for areas where I want to operate.

#### Acceptance Criteria

1. THE Registration_Screen SHALL display service zone selector with Kenyan cities
2. THE service zone selector SHALL include at minimum: Nairobi, Mombasa, Kisumu, Nakuru, Eldoret
3. THE Vehicle_Management_Module SHALL allow selecting multiple service zones
4. THE Vehicle_Management_Module SHALL require at least one service zone selection
5. THE selected service zones SHALL display as chips with remove option
6. THE vehicle details screen SHALL allow updating service zones
7. THE Vehicle_API SHALL store service zones as array of strings
8. THE assignment matching system SHALL use service zones to filter relevant jobs for drivers

### Requirement 29: Payment Method Configuration

**User Story:** As a driver, I want to configure my payment method, so that I can receive payments for completed relocation services.

#### Acceptance Criteria

1. THE Registration_Screen SHALL display payment method selector
2. THE payment method options SHALL include: M-Pesa, Bank Transfer, Cash
3. WHEN a driver selects M-Pesa, THE Registration_Screen SHALL display M-Pesa number input field
4. WHEN a driver selects Bank Transfer, THE Registration_Screen SHALL display bank account details inputs
5. THE Vehicle_Management_Module SHALL validate M-Pesa number format (+254XXXXXXXXX)
6. THE Vehicle_Management_Module SHALL validate bank account number format
7. THE payment method configuration SHALL be required for vehicle registration
8. THE vehicle details screen SHALL allow updating payment method
9. THE Vehicle_API SHALL encrypt sensitive payment information before storage

### Requirement 30: Document Expiration Tracking

**User Story:** As a driver, I want to be notified when my vehicle documents are expiring, so that I can renew them and maintain compliance.

#### Acceptance Criteria

1. THE Vehicle_Management_Module SHALL store expiration dates for insurance and inspection documents
2. THE Vehicle_Management_Module SHALL provide a useDocumentExpirations hook
3. THE vehicle details screen SHALL display expiration dates for each document
4. WHEN a document expires within 30 days, THE vehicle details screen SHALL display warning badge
5. WHEN a document expires within 7 days, THE Vehicle_Management_Module SHALL send push notification
6. WHEN a document is expired, THE Vehicle_API SHALL set vehicle status to under_maintenance
7. WHEN a document is expired, THE driver SHALL NOT be able to set vehicle as available
8. THE vehicle details screen SHALL provide "Update Document" button for expiring or expired documents
9. THE Vehicle_Management_Module SHALL send weekly reminder notifications for expired documents

