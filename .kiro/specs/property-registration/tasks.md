# Implementation Plan: Property Registration Module

## Overview

This implementation plan converts the Property Registration Module design into discrete coding tasks for a TypeScript/React Native/Expo application. The module follows the Masqany architecture with TanStack Query for server state, Zustand for client state, and the standard module pattern (api.ts, hooks.ts, types.ts, index.ts).

The property registration feature supports two distinct flows: Long-Stay (8 steps) and Short-Stay (10 steps), with the initial screen already implemented. Tasks focus on building the multi-step forms, reusable components, module infrastructure, and integration with the Auth Module.

## Tasks

- [x] 1. Set up Property Module infrastructure
  - Create `modules/property/` directory structure
  - Create `types.ts` with all TypeScript interfaces (BaseProperty, LongStayProperty, ShortStayProperty, utility types)
  - Create `api.ts` with property API bindings (createProperty, getProperties, getPropertyById, updateProperty, deleteProperty, approveProperty)
  - Create `hooks.ts` with TanStack Query hooks (useProperties, useProperty, useCreateProperty, useUpdateProperty, useDeleteProperty)
  - Create `store.ts` with Zustand store for client state (form drafts, current step, stay type, property type, last saved timestamp)
  - Create `index.ts` to re-export all public APIs
  - Define query keys as const arrays in hooks.ts (propertyKeys.all, propertyKeys.lists, propertyKeys.list, propertyKeys.details, propertyKeys.detail)
  - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 20.7, 20.8, 20.9, 20.10, 20.11_

- [x] 2. Create reusable property components
  - [x] 2.1 Implement PropertyFormHeader component
    - Create `components/property/PropertyFormHeader.tsx`
    - Display progress indicator (current step / total steps)
    - Display back button (white circle with left chevron)
    - Display step title
    - Display auto-save indicator with timestamp
    - Use app-full-screen.webp as background
    - Style with design tokens from constants/tokens.ts
    - _Requirements: 3.5, 3.6, 3.9, 16.8_

  - [x] 2.2 Implement PropertyFormProgress component
    - Create `components/property/PropertyFormProgress.tsx`
    - Display horizontal progress bar
    - Display step dots (filled for completed, outlined for upcoming)
    - Implement animated transitions using react-native-reanimated
    - Use primary color (#20A6FD) for completed/current steps
    - Use light gray outline for upcoming steps
    - _Requirements: 3.5, 3.6_

  - [x] 2.3 Implement AmenitySelector component
    - Create `components/property/AmenitySelector.tsx`
    - Display category header in bold
    - Display amenities as toggle buttons in 2-column grid
    - Implement selected state (primary background #20A6FD, white text)
    - Implement unselected state (light gray background #E1E6E8, dark text)
    - Add scale animation on tap (0.95) using react-native-reanimated
    - Support multiple selection
    - Prevent text input (toggle only)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9_

  - [x] 2.4 Implement MediaUploader component
    - Create `components/property/MediaUploader.tsx`
    - Display photo grid (3 columns, 8px gap)
    - Display add photo button (dashed border, primary color)
    - Display photo thumbnails (100x100) with delete button
    - Display video thumbnail with play icon and delete button
    - Implement upload progress bars
    - Validate file sizes (photos: 4MB total, video: 100MB)
    - Validate video duration (max 60 seconds)
    - Validate file types (images: JPEG, PNG, HEIC; video: MP4, MOV)
    - Display error messages for validation failures
    - Enforce max 6 photos, max 1 video
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10, 6.11, 6.12, 6.13_

  - [x] 2.5 Implement LocationPicker component
    - Create `components/property/LocationPicker.tsx`
    - Integrate @rnmapbox/maps
    - Display map centered on Kenya
    - Allow tap to set property location
    - Display marker at selected location
    - Auto-fill County based on coordinates
    - Return latitude, longitude, and county to parent
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 2.6 Implement UtilityDepositCard component
    - Create `components/property/UtilityDepositCard.tsx`
    - Display utility name and icon
    - Display "Deposit Required" toggle
    - Display deposit amount input (KES) when deposit required
    - Display monthly cost input
    - Display "Included in Rent" toggle
    - Display provider dropdown for Water utility
    - Display billing method selector
    - Display meter type selector for Electricity utility
    - Style with design tokens
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9_

  - [x] 2.7 Implement PropertyTypeSelector component
    - Create `components/property/PropertyTypeSelector.tsx`
    - Display dropdown with property type options
    - Support Long-Stay types (single_room, bedsitter, 1-4+ bedroom, hostel, office, shop, etc.)
    - Support Short-Stay types (hotel_room, suite, vacation_home, airbnb, etc.)
    - Display selected value with dropdown icon
    - Implement dropdown animation
    - _Requirements: 1.19, 1.20, 1.21, 1.22, 1.23_

  - [x] 2.8 Implement PricingCard component
    - Create `components/property/PricingCard.tsx`
    - Display rental pricing inputs (monthly rent for Long-Stay, nightly rate for Short-Stay)
    - Display payment schedule selector
    - Display security deposit input (Long-Stay only)
    - Display auto-calculated total move-in cost
    - Display payment methods checkboxes
    - Display M-Pesa details inputs when M-Pesa selected
    - Display bank details inputs when Bank Transfer selected
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

  - [x] 2.9 Implement DocumentUploader component
    - Create `components/property/DocumentUploader.tsx`
    - Support PDF uploads (max 10MB)
    - Display upload progress
    - Display uploaded document with delete button
    - Validate file type (PDF only)
    - Validate file size
    - Display error messages
    - _Requirements: 14.1, 14.2, 14.9, 14.10_

  - [x] 2.10 Implement BedConfigurationInput component
    - Create `components/property/BedConfigurationInput.tsx`
    - Display room name input
    - Display bed type selector (single, double, queen, king, bunk)
    - Display quantity input
    - Support multiple bed configurations
    - Display add/remove buttons
    - _Requirements: 8.11_

  - [x] 2.11 Implement AvailabilityCalendar component
    - Create `components/property/AvailabilityCalendar.tsx`
    - Display interactive calendar
    - Allow marking dates as available/booked
    - Display current month with navigation
    - Highlight selected dates
    - Return array of AvailabilityDate objects
    - _Requirements: 11.1, 11.2_

  - [x] 2.12 Implement CancellationPolicySelector component
    - Create `components/property/CancellationPolicySelector.tsx`
    - Display policy options (Flexible, Moderate, Firm, Strict, Super Strict, Custom)
    - Display policy description for each option
    - Display custom policy textarea when Custom selected
    - Display additional notes textarea
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8_

- [x] 3. Checkpoint - Ensure all components compile
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement Long-Stay multi-step form
  - [x] 4.1 Create Long-Stay form screen structure
    - Create `app/(registration)/property-long-stay-form.tsx`
    - Set up form state management with Zustand store
    - Implement step navigation logic
    - Implement sliding animations using react-native-reanimated (350ms, slide left/right)
    - Display PropertyFormHeader with progress
    - Set up form validation
    - _Requirements: 2.1, 3.1, 3.2, 3.3, 3.4, 3.7, 3.8_

  - [x] 4.2 Implement Step 1: Property Essence
    - Create form fields: title (max 80 chars), description (max 250 chars), building name, building type, total units
    - Validate required fields (title, description, building type)
    - Display character count for title and description
    - _Requirements: 1.27, 15.9_

  - [x] 4.3 Implement Step 2: Location Details
    - Integrate LocationPicker component
    - Create form fields: county, constituency, ward, estate, nearest landmark, street/road, plot/building number, floor number, unit number, Google Maps link, directions from stage (max 300 chars), accessibility notes
    - Validate required fields (county, estate, nearest landmark, Google Maps link, directions)
    - _Requirements: 7.6, 7.7, 7.8, 7.9, 7.10_

  - [x] 4.4 Implement Step 3: Property Specifications
    - Create form fields: property size with unit selector, bedrooms, bathrooms, bathroom types (checkboxes), kitchen type, furnishing status, furnished items (conditional), parking type, paid parking cost (conditional), water sources (checkboxes), special structure type
    - Validate required fields (bedrooms, bathrooms, kitchen type, furnishing status, parking type)
    - Show/hide conditional fields based on selections
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 8.10_

  - [x] 4.5 Implement Step 4: Utilities & Deposits
    - Integrate UtilityDepositCard component for each utility (water, electricity, WiFi, security, garbage, house maintenance)
    - Calculate and display total move-in cost (first month rent + rent deposit + all utility deposits)
    - Validate deposit amounts are positive numbers
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 5.11_

  - [x] 4.6 Implement Step 5: Rental Pricing
    - Integrate PricingCard component
    - Create form fields: monthly rent, rent payment schedule, security deposit (months or fixed), payment methods (checkboxes), M-Pesa details (conditional), bank details (conditional), rent due date, grace period days
    - Auto-calculate total move-in cost
    - Validate required fields (monthly rent, rent payment schedule, payment methods)
    - Validate M-Pesa number format (+254XXXXXXXXX)
    - Validate bank account number format
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 15.10, 15.11_

  - [x] 4.7 Implement Step 6: House Rules
    - Create form fields: max persons, children allowed (selector with age restriction), pets allowed (selector with restrictions), smoking allowed (selector), visitors policy (textarea), preferred tenant type
    - Validate required fields (max persons, children allowed, pets allowed, smoking allowed)
    - Show/hide conditional fields
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.13_

  - [x] 4.8 Implement Step 7: Media Uploads
    - Integrate MediaUploader component
    - Validate minimum 3 photos required
    - Display upload progress
    - Handle upload errors
    - _Requirements: 6.13, 6.14_

  - [x] 4.9 Implement Step 8: Terms & Conditions
    - Integrate DocumentUploader component for lease agreement (required) and additional terms (optional)
    - Create form fields: special clauses (textarea), lease duration, tenant termination notice days, owner termination notice days, renewal terms (textarea), dispute resolution method
    - Display confirmation checkboxes (all information accurate, authorized to list, understand terms, agree to fees)
    - Validate all checkboxes are checked before submission
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8, 14.13, 14.14_

  - [x] 4.10 Implement form submission
    - Collect all form data from Zustand store
    - Call useCreateProperty hook
    - Handle loading state
    - Handle success (navigate to dashboard, clear draft)
    - Handle errors (display error message, allow retry)
    - Set property status to pending_verification
    - Link property to user ID from Auth Module
    - _Requirements: 18.1, 18.2, 16.7_

- [x] 5. Checkpoint - Test Long-Stay form end-to-end
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement Short-Stay multi-step form
  - [x] 6.1 Create Short-Stay form screen structure
    - Create `app/(registration)/property-short-stay-form.tsx`
    - Set up form state management with Zustand store
    - Implement step navigation logic
    - Implement sliding animations using react-native-reanimated (350ms, slide left/right)
    - Display PropertyFormHeader with progress
    - Set up form validation
    - _Requirements: 2.2, 3.1, 3.2, 3.3, 3.4, 3.7, 3.8_

  - [x] 6.2 Implement Step 1: Property Essence
    - Create form fields: title (max 80 chars), description (max 250 chars), listing type (entire place, private room, shared room, hotel room)
    - Validate required fields (title, description, listing type)
    - Display character count for title and description
    - _Requirements: 1.27, 15.9_

  - [x] 6.3 Implement Step 2: Location Details
    - Integrate LocationPicker component
    - Create form fields: county, constituency, ward, estate, nearest landmark, street/road, plot/building number, floor number, unit number, Google Maps link, directions from stage (max 300 chars), nearest tourist attraction, nearest airport, airport distance (km), airport transfer available (toggle), nearest matatu
    - Validate required fields (county, estate, nearest landmark, Google Maps link, directions)
    - _Requirements: 7.6, 7.7, 7.8, 7.9, 7.10, 7.11_

  - [x] 6.4 Implement Step 3: Guest Capacity
    - Create form fields: max adults, max children, max infants, total beds
    - Integrate BedConfigurationInput component for bed configuration per room
    - Create extra sleeping spaces input (textarea)
    - Validate required fields (max adults, max children, max infants, bed configuration)
    - _Requirements: 8.11_

  - [x] 6.5 Implement Step 4: Amenities
    - Integrate AmenitySelector component for each category (Essentials, Kitchen, Bathroom, Entertainment, Outdoor, Family, Safety)
    - Display category headers
    - Allow multiple selections per category
    - _Requirements: 4.10, 4.11_

  - [x] 6.6 Implement Step 5: Pricing (NO deposits)
    - Create form fields: base nightly rate, standard occupancy, weekend rate (optional), peak season rates (array), holiday rates (array), extra guest fee, extra guest free up to, cleaning fee, weekly discount %, monthly discount %, early bird discount % and days advance, last minute discount % and days within
    - Display note "NO SECURITY DEPOSIT COLLECTED - Short-stay works on trust + reviews"
    - Validate required fields (base nightly rate, standard occupancy, cleaning fee)
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 10.10, 10.11, 10.12_

  - [x] 6.7 Implement Step 6: Availability & Booking Rules
    - Integrate AvailabilityCalendar component
    - Create form fields: min nights stay, max nights stay (optional), advance notice days, same-day booking until (time), check-in time from/to, late check-in available (toggle with fee), self check-in method, check-out time, late check-out available (toggle with fee per hour), instant booking (toggle)
    - Validate required fields (min nights stay, check-in time, check-out time)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8, 11.9, 11.10, 11.11_

  - [x] 6.8 Implement Step 7: Cancellation Policy
    - Integrate CancellationPolicySelector component
    - Display policy descriptions
    - Show custom policy textarea when Custom selected
    - Display additional cancellation notes textarea
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8_

  - [x] 6.9 Implement Step 8: House Rules
    - Create form fields: max persons, children allowed (selector with age restriction), pets allowed (selector with restrictions), smoking allowed (selector), parties allowed (selector with fee and max guests), quiet hours from/to, commercial photo allowed (selector with fee), guest min age, require ID at check-in (toggle), require signed waiver (toggle), additional rules (textarea)
    - Validate required fields (max persons, children allowed, pets allowed, smoking allowed, parties allowed, quiet hours, guest min age)
    - Show/hide conditional fields
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.8, 13.9, 13.10, 13.11, 13.12, 13.13_

  - [x] 6.10 Implement Step 9: Media Uploads
    - Integrate MediaUploader component
    - Validate minimum 3 photos required
    - Display note "High-quality photos improve search ranking"
    - Display upload progress
    - Handle upload errors
    - _Requirements: 6.13, 6.14_

  - [x] 6.11 Implement Step 10: Terms & Conditions
    - Integrate DocumentUploader component for house rules (required) and special contracts (optional)
    - Create form fields: tourist registration number (optional), VAT registered (toggle), VAT PIN (conditional)
    - Display confirmation checkboxes (all information accurate, authorized to list, understand terms, agree to fees)
    - Validate all checkboxes are checked before submission
    - _Requirements: 14.9, 14.10, 14.11, 14.12, 14.13, 14.14_

  - [x] 6.12 Implement form submission
    - Collect all form data from Zustand store
    - Call useCreateProperty hook
    - Handle loading state
    - Handle success (navigate to dashboard, clear draft)
    - Handle errors (display error message, allow retry)
    - Set property status to pending_verification
    - Link property to user ID from Auth Module
    - _Requirements: 18.1, 18.2, 16.7_

- [ ] 7. Checkpoint - Test Short-Stay form end-to-end
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Implement form validation and error handling
  - [x] 8.1 Add field-level validation
    - Validate required fields before allowing navigation to next step
    - Display field-specific error messages below invalid inputs
    - Use danger color (#F75555) for error messages
    - Validate numeric inputs (rent amount, capacity, deposit amounts)
    - Validate date inputs (check-in/out times)
    - Validate text length limits (title max 80 chars, description max 250 chars)
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.7, 15.8, 15.9_

  - [x] 8.2 Add file upload validation
    - Validate file sizes for photos, videos, and documents
    - Validate file types for uploads
    - Display error messages for validation failures
    - _Requirements: 15.5, 15.6_

  - [ ] 8.3 Add form-level validation
    - Prevent submission if any required field is missing or invalid
    - Scroll to first error and focus the field when validation fails
    - _Requirements: 15.4, 15.12_

  - [ ] 8.4 Add network error handling
    - Display "Network error. Please check your connection." when network error occurs
    - Display "Something went wrong. Please try again." with retry button when server error occurs
    - _Requirements: 15.13, 15.14_

- [ ] 9. Implement draft saving and data persistence
  - [ ] 9.1 Add auto-save functionality
    - Auto-save draft data to Zustand store every 30 seconds
    - Persist draft data to AsyncStorage for offline access
    - Save current step and all field values when user exits form
    - _Requirements: 16.1, 16.2, 16.3_

  - [ ] 9.2 Add draft restoration
    - Restore saved draft data when user returns to form
    - Display "Resume Draft" option if draft data exists
    - Display "Start Fresh" option to clear draft and start over
    - Clear draft data after successful submission
    - _Requirements: 16.4, 16.5, 16.6, 16.7_

  - [ ] 9.3 Add auto-save indicator
    - Display last saved timestamp in header
    - Display saving indicator when auto-saving
    - _Requirements: 16.8, 16.9_

- [ ] 10. Implement role-based access control
  - [ ] 10.1 Add role verification
    - Verify user role from Auth Module before allowing registration
    - Allow property_owner role full access to register and manage properties
    - Allow property_agent role full access to register and manage properties
    - Deny tenant role access to property registration
    - Deny relocation_driver role access to property registration
    - Allow admin role read access and approval permissions
    - Allow super_admin role full access to all property operations
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7_

  - [ ] 10.2 Add access denied handling
    - Display "Access Denied" alert when unauthorized user attempts to access registration
    - Navigate back to home screen when access denied
    - Hide "Register Property" buttons for unauthorized roles
    - _Requirements: 17.8, 17.9, 17.10_

- [ ] 11. Implement admin approval workflow (placeholder)
  - Create placeholder admin screen for viewing pending properties
  - Add approve/reject functionality (placeholder)
  - Add rejection reason input (placeholder)
  - Add notification system for property status changes (placeholder)
  - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 18.7, 18.8, 18.9, 18.10_

- [ ] 12. Update initial screen navigation
  - [ ] 12.1 Wire up navigation from initial screen
    - Update property-registration.tsx to navigate to property-long-stay-form.tsx when Long Stay selected
    - Update property-registration.tsx to navigate to property-short-stay-form.tsx when Short Stay selected
    - Pass stay type and property type as route params
    - _Requirements: 1.27, 2.1, 2.2_

  - [ ] 12.2 Add AI Agent navigation (placeholder)
    - Create placeholder chat agent screen
    - Navigate to chat agent screen when AI Agent button tapped
    - _Requirements: 1.17_

- [ ] 13. Final integration and testing
  - [ ] 13.1 Test complete Long-Stay flow
    - Test all 8 steps with valid data
    - Test validation errors
    - Test draft saving and restoration
    - Test form submission
    - Test navigation back and forth

  - [ ] 13.2 Test complete Short-Stay flow
    - Test all 10 steps with valid data
    - Test validation errors
    - Test draft saving and restoration
    - Test form submission
    - Test navigation back and forth

  - [ ] 13.3 Test role-based access control
    - Test with property_owner role
    - Test with property_agent role
    - Test with tenant role (should be denied)
    - Test with admin role

  - [ ] 13.4 Test error scenarios
    - Test network errors
    - Test server errors
    - Test file upload errors
    - Test validation errors

- [ ] 14. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- The initial screen (property-registration.tsx) is already implemented and should not be modified
- All components use design tokens from constants/tokens.ts
- All API calls go through modules/property/api.ts
- All data access goes through modules/property/hooks.ts (TanStack Query)
- All client state goes through modules/property/store.ts (Zustand)
- Follow the Masqany architecture guide for module pattern and state management
- Use react-native-reanimated for all animations
- Use @rnmapbox/maps for location picker
- Integrate with Auth Module for user identity and role-based access control
