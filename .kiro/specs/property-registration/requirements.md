# Property Registration Module - Requirements Document

## ⚠️ MODULE STATUS
**NOT A CONFIRMED MODULE YET** - This is a planning document for future implementation.

## Introduction

The Property Registration Module (Module 004) provides a comprehensive system for property owners and agents to register and manage properties for both Long-Stay (residential/commercial leases) and Short-Stay (hotels, vacation rentals, Airbnb-style) on the Masqany platform. This module handles the complete property lifecycle from initial registration through document verification, amenity management, and multi-property operations.

The module follows the Masqany mobile architecture with TanStack Query for server state management, Zustand for client state, and the established module pattern (api.ts, hooks.ts, types.ts, index.ts). The UI implements the Masqany design system with NativeWind styling, sliding animations, and Kenya-specific property market features.

## Glossary

- **Property_Registration_Module**: The feature module containing API bindings, hooks, and types for property operations
- **Property_Owner**: A user with the property_owner role who can register and manage properties
- **Property_Agent**: A user with the property_agent role who can register properties on behalf of owners
- **Long_Stay_Property**: Residential or commercial property for extended rental (6+ months)
- **Short_Stay_Property**: Hotel, vacation rental, or Airbnb-style property for short-term stays (1-28 nights)
- **Property_Type**: Classification of property (bedsitter, 1-4+ bedroom, studio, hotel room, vacation home, etc.)
- **Stay_Type**: Duration classification (long_stay or short_stay)
- **Amenity**: Property feature that can be toggled available/unavailable (WiFi, parking, gym, pool, etc.)
- **Utility_Deposit**: Kenya-specific refundable deposits for water, electricity, WiFi, security, garbage, house maintenance
- **Property_Document**: Required documentation (lease agreement, house rules, tourist registration)
- **Property_Media**: Photos (max 6, 4MB total) and video (max 1, 60s, 100MB)
- **Property_Status**: Current state (draft, pending_verification, verified, rejected, active, inactive)
- **Registration_Screen**: Initial screen for selecting stay type and property type
- **Form_Screen**: Multi-step form with sliding animations for property details
- **Property_API**: Backend API endpoints for property CRUD operations
- **Admin**: User with admin role who can view and approve property registrations
- **Super_Admin**: User with super_admin role who has full property management access
- **Auth_Module**: Authentication module providing user session and role information
- **Property_Store**: Zustand store managing client-side property UI state
- **Amenity_Selector**: Toggle component for selecting available amenities (NOT typed input)
- **Media_Uploader**: Component for uploading photos and videos with validation
- **Location_Picker**: Map-based component for selecting property location
- **Utility_Deposit_Card**: Kenya-specific component for configuring utility deposits

## Requirements

### Requirement 1: Property Registration Initial Screen

**User Story:** As a property owner, I want to see a clear initial registration screen where I can select my property type and stay duration, so that I can begin the appropriate registration flow.

#### Acceptance Criteria

1. THE Registration_Screen SHALL display property-registration-initial-screen.webp as the background image
2. THE Registration_Screen SHALL display a back button in the top left corner
3. THE Registration_Screen SHALL display a "Pre-Verified Account" badge in the top right corner
4. THE Registration_Screen SHALL display "Become a Verified" on line 1 and "Property Owner with Masqany" on line 2 in white bold text
5. THE Registration_Screen SHALL display house-icon.png (80x80) below the title
6. THE Registration_Screen SHALL display user icon with text "complete property registration to unlock tenants"
7. THE header content SHALL occupy approximately 30% from the top of the screen
8. THE Registration_Screen SHALL display a Stay Type Selection Card at 35% from top with 80% screen width
9. THE Stay Type Selection Card SHALL have background color #E1E6E8 with fully rounded corners
10. THE Stay Type Selection Card SHALL contain two buttons: "Long Stay" with house icon and "Short Stay" with hotel icon
11. WHEN a stay type button is selected, IT SHALL display a linear gradient (90deg: #333333, #898989) with white text
12. WHEN a stay type button is unselected, IT SHALL display #E1E6E8 background with dark text
13. THE Registration_Screen SHALL display an AI Agent Card below the Stay Type card
14. THE AI Agent Card SHALL have 80% screen width and #E1E6E8 background
15. THE AI Agent Card SHALL display text "Save time and register using Masqany AI Agent" in black, centered
16. THE AI Agent Card SHALL display ask-masqany-btn.webp button
17. WHEN the AI Agent button is tapped, THE Registration_Screen SHALL navigate to the chat agent screen
18. THE Registration_Screen SHALL display a Property Type Card below the AI Agent card
19. THE Property Type Card SHALL have 80% screen width and #E1E6E8 background
20. THE Property Type Card SHALL display house icon with "Property Type" label
21. THE Property Type Card SHALL display a dropdown input with blue border (#28B4F9)
22. THE Property Type dropdown SHALL have "Bedsitter" as the default placeholder
23. THE Property Type dropdown SHALL include options: Bedsitter, 1-4+ Bedroom, Studio, Penthouse, Villa, Townhouse
24. THE Registration_Screen SHALL display a blue "Next" button (#20A6FD) with shadow
25. WHEN the Next button is tapped without selecting stay type, THE Registration_Screen SHALL display error "Stay Type Required"
26. WHEN the Next button is tapped without selecting property type, THE Registration_Screen SHALL display error "Property Type Required"
27. WHEN the Next button is tapped with valid selections, THE Registration_Screen SHALL navigate to the appropriate form screen

### Requirement 2: Long-Stay vs Short-Stay Form Routing

**User Story:** As a property owner, I want to be directed to the correct registration form based on my property type, so that I only fill out relevant information.

#### Acceptance Criteria

1. WHEN a user selects "Long Stay" and taps Next, THE system SHALL navigate to property-long-stay-form.tsx
2. WHEN a user selects "Short Stay" and taps Next, THE system SHALL navigate to property-short-stay-form.tsx
3. THE Long-Stay form SHALL contain 8 sections
4. THE Short-Stay form SHALL contain 10 sections
5. BOTH forms SHALL use app-full-screen.webp as background for all screens after the initial screen
6. BOTH forms SHALL implement sliding animations between steps
7. THE system SHALL preserve form data when navigating back
8. THE system SHALL clear form data after successful submission

### Requirement 3: Multi-Step Form with Sliding Animation

**User Story:** As a property owner, I want smooth transitions between form steps, so that the registration process feels polished and professional.

#### Acceptance Criteria

1. THE form screens SHALL use react-native-reanimated for sliding animations
2. WHEN navigating to the next step, THE current screen SHALL slide out to the left and the next screen SHALL slide in from the right
3. WHEN navigating to the previous step, THE current screen SHALL slide out to the right and the previous screen SHALL slide in from the left
4. THE slide animation SHALL take 350ms with easing curve
5. THE form SHALL display a progress indicator at the top showing current step and total steps
6. THE progress indicator SHALL update with animation when step changes
7. THE form SHALL validate the current step before allowing navigation to the next step
8. WHEN validation fails, THE form SHALL display error messages and prevent navigation
9. THE form SHALL display a "Back" button to return to the previous step
10. THE form SHALL display a "Next" button to proceed to the next step
11. THE last step SHALL display a "Submit" button instead of "Next"

### Requirement 4: Amenity Selection (Toggle, Not Typed)

**User Story:** As a property owner, I want to select amenities by clicking toggle buttons, so that I can quickly indicate what features my property has without typing.

#### Acceptance Criteria

1. THE Amenity_Selector component SHALL display amenities as toggle buttons
2. EACH amenity button SHALL have two states: Available (selected) and Unavailable (unselected)
3. WHEN an amenity is selected, THE button SHALL display primary color background (#20A6FD) with white text
4. WHEN an amenity is unselected, THE button SHALL display light gray background (#E1E6E8) with dark text
5. THE Amenity_Selector SHALL group amenities by category (Essentials, Kitchen, Bathroom, Entertainment, Safety, etc.)
6. THE Amenity_Selector SHALL display category headers in bold
7. THE Amenity_Selector SHALL allow multiple amenities to be selected simultaneously
8. THE Amenity_Selector SHALL NOT allow text input for amenities
9. THE Amenity_Selector SHALL provide visual feedback (scale animation) when tapped
10. THE Long-Stay form SHALL include basic amenities (Security, Parking, Water, Electricity, WiFi, Garbage Collection)
11. THE Short-Stay form SHALL include detailed amenities (WiFi with speed, TV with channels, AC, Hot Water, Kitchen appliances, Bathroom items, Entertainment, Safety equipment)

### Requirement 5: Kenya-Specific Utility Deposits (Long-Stay Only)

**User Story:** As a property owner in Kenya, I want to configure utility deposits separately, so that tenants understand the complete move-in cost breakdown.

#### Acceptance Criteria

1. THE Long-Stay form SHALL include a Utilities & Deposits section
2. THE Utility_Deposit_Card component SHALL display separate deposit fields for: Water, Electricity, WiFi, Security, Garbage, House Maintenance
3. EACH utility SHALL have a toggle for "Deposit Required" (Yes/No)
4. WHEN deposit is required, THE form SHALL display a deposit amount input field (KES)
5. THE form SHALL display monthly cost input for each utility
6. THE form SHALL display a toggle for "Included in Rent" (Yes/No)
7. THE Water utility SHALL include provider dropdown (Nairobi Water, County Water, Borehole, Tank)
8. THE Water utility SHALL include billing method selector (Per Unit, Fixed Monthly, Included in Rent)
9. THE Electricity utility SHALL include meter type selector (Prepaid Token, Postpaid Bill)
10. THE form SHALL auto-calculate total move-in cost (First Month Rent + Rent Deposit + All Utility Deposits)
11. THE form SHALL display the calculated total prominently
12. THE Short-Stay form SHALL NOT include utility deposits (key difference)

### Requirement 6: Media Upload with Validation

**User Story:** As a property owner, I want to upload photos and a video of my property with clear size limits, so that potential tenants can see my property.

#### Acceptance Criteria

1. THE Media_Uploader component SHALL allow maximum 6 photos
2. THE Media_Uploader SHALL enforce 4MB total size limit for all photos combined
3. THE Media_Uploader SHALL allow maximum 1 video
4. THE Media_Uploader SHALL enforce 100MB size limit for video
5. THE Media_Uploader SHALL enforce 60 seconds duration limit for video
6. THE Media_Uploader SHALL accept image formats: JPEG, PNG, HEIC
7. THE Media_Uploader SHALL accept video formats: MP4, MOV
8. THE Media_Uploader SHALL display upload progress for each file
9. THE Media_Uploader SHALL display thumbnails for uploaded photos with delete button
10. THE Media_Uploader SHALL display video thumbnail with play icon and delete button
11. WHEN file size exceeds limit, THE Media_Uploader SHALL display error "File too large"
12. WHEN video duration exceeds 60s, THE Media_Uploader SHALL display error "Video must be under 60 seconds"
13. THE form SHALL require minimum 3 photos for submission
14. THE Short-Stay form SHALL emphasize that high-quality photos are required for better search ranking

### Requirement 7: Location Details with Map Picker

**User Story:** As a property owner, I want to specify my property location using a map, so that tenants can find my property easily.

#### Acceptance Criteria

1. THE Location_Picker component SHALL integrate with @rnmapbox/maps
2. THE Location_Picker SHALL display a map centered on Kenya
3. THE Location_Picker SHALL allow the user to tap the map to set property location
4. THE Location_Picker SHALL display a marker at the selected location
5. THE Location_Picker SHALL auto-fill County based on selected coordinates
6. THE form SHALL include text inputs for: County, Constituency/Sub-county, Ward/Area, Estate/Neighborhood, Nearest Landmark
7. THE form SHALL include optional inputs for: Street/Road Name, Plot/Building Number, Floor Number, Unit Number
8. THE form SHALL include a Google Maps Link or Coordinates input (required)
9. THE form SHALL include a Directions textarea (max 300 chars) for directions from nearest stage/terminal
10. THE form SHALL include an Accessibility Notes textarea for transport information
11. THE Short-Stay form SHALL additionally include: Nearest Tourist Attraction, Airport Distance, Airport Transfer Available toggle

### Requirement 8: Property Specifications Section

**User Story:** As a property owner, I want to specify my property's physical characteristics, so that tenants know what to expect.

#### Acceptance Criteria

1. THE form SHALL include a Property Size input with unit selector (Square Feet, Square Meters, Acres)
2. THE form SHALL include Number of Bedrooms input (0 for bedsitter/studio)
3. THE form SHALL include Number of Bathrooms input
4. THE form SHALL include Bathroom Type checkboxes (Shower, Bathtub, Separate Toilet, Common Bathroom, Outdoor Bathroom)
5. THE form SHALL include Kitchen Type selector (Full Kitchen, Kitchenette, Cooking Area Only, No Kitchen, Shared Kitchen)
6. THE form SHALL include Furnishing Status selector (Fully Furnished, Semi-Furnished, Unfurnished)
7. WHEN Furnished is selected, THE form SHALL display a checklist of furniture items (Bed, Wardrobe, Sofa, Dining Table, Curtains, TV Stand, Other)
8. THE form SHALL include Parking selector (One Dedicated, Two+ Spaces, Street Only, No Parking, Paid Parking with cost)
9. THE form SHALL include Water Source checkboxes (Nairobi Water, Borehole, Well, Tank Delivery, Other)
10. THE form SHALL include Special Structure Type selector (Standard Stone/Brick, Block House, Mabati, Container House, Semi-permanent)
11. THE Short-Stay form SHALL additionally include: Guest Capacity (Adults, Children, Infants), Bed Configuration per bedroom, Extra Sleeping Spaces

### Requirement 9: Rental Pricing Section (Long-Stay)

**User Story:** As a property owner, I want to configure my rental pricing and payment terms, so that tenants understand the financial requirements.

#### Acceptance Criteria

1. THE Long-Stay form SHALL include Monthly Rent Amount input (KES)
2. THE form SHALL include Rent Payment Schedule selector (Monthly, Quarterly, Bi-annually, Annually, Negotiable)
3. THE form SHALL include Security Deposit input (number of months rent OR fixed amount KES)
4. THE form SHALL auto-calculate and display Total Estimated Move-in Cost
5. THE form SHALL include Payment Methods Accepted checkboxes (M-Pesa, Bank Transfer, Cash, Cheque, Card)
6. WHEN M-Pesa is selected, THE form SHALL display Paybill Number, Account Number, Till Number inputs
7. WHEN Bank Transfer is selected, THE form SHALL display Bank Name, Account Name, Account Number, Branch inputs
8. THE form SHALL include Rent Due Date selector (1st, 5th, 10th, 15th, 25th, Last day of month)
9. THE form SHALL include Grace Period input (days)

### Requirement 10: Pricing Section (Short-Stay)

**User Story:** As a short-stay property owner, I want to configure nightly rates and discounts, so that I can attract different types of guests.

#### Acceptance Criteria

1. THE Short-Stay form SHALL include Base Nightly Rate input (KES) for standard occupancy
2. THE form SHALL include Weekend Rate input (Fri-Sat) with "Same as weekday" option
3. THE form SHALL include Peak Season Rate with date range picker and season name
4. THE form SHALL include Holiday Rate with holiday selector (Christmas, New Year, Easter, Eid, Other)
5. THE form SHALL include Extra Guest Fee input (free up to X guests, then KES per guest per night)
6. THE form SHALL include Cleaning Fee input (one-time per stay, KES)
7. THE form SHALL include Weekly Discount input (7+ nights, percentage off)
8. THE form SHALL include Monthly Discount input (28+ nights, percentage off)
9. THE form SHALL include Early Bird Discount (percentage off when booked X days in advance)
10. THE form SHALL include Last Minute Discount (percentage off when booked within X days)
11. THE form SHALL NOT include security deposits (key difference from Long-Stay)
12. THE form SHALL display a note "NO SECURITY DEPOSIT COLLECTED - Short-stay works on trust + reviews"

### Requirement 11: Availability & Booking Rules (Short-Stay Only)

**User Story:** As a short-stay property owner, I want to configure booking rules and availability, so that I can control how guests book my property.

#### Acceptance Criteria

1. THE Short-Stay form SHALL include an interactive Availability Calendar
2. THE calendar SHALL allow marking dates as booked or available
3. THE form SHALL include Minimum Nights Stay selector (1, 2, 3, 4+ nights, Weekends only, Flexible)
4. THE form SHALL include Maximum Nights Stay input (optional)
5. THE form SHALL include Advance Notice Required selector (No notice, Same-day until X PM, Minimum X days before)
6. THE form SHALL include Check-in Time Window (From/To time pickers)
7. THE form SHALL include Late Check-in Available toggle with optional fee
8. THE form SHALL include Self Check-in Method selector (Keybox, Smart Lock, Staff Meets Guest, Reception)
9. THE form SHALL include Check-out Time picker
10. THE form SHALL include Late Check-out Available toggle with optional fee per hour
11. THE form SHALL include Instant Booking toggle (Yes = guests can book without approval, No = must approve each request)

### Requirement 12: Cancellation Policy (Short-Stay Only)

**User Story:** As a short-stay property owner, I want to set a clear cancellation policy, so that guests understand refund terms.

#### Acceptance Criteria

1. THE Short-Stay form SHALL include Cancellation Policy selector with standardized options
2. THE Flexible policy SHALL offer: Full refund 24+ hours before check-in, 50% refund within 24 hours
3. THE Moderate policy SHALL offer: Full refund 5+ days before, 50% refund within 5 days
4. THE Firm policy SHALL offer: Full refund 30+ days before, 50% refund 7-30 days, No refund within 7 days
5. THE Strict policy SHALL offer: 50% refund 60+ days before, No refund within 60 days
6. THE Super Strict policy SHALL offer: No refund unless property rebooked
7. THE Custom policy SHALL display a textarea for describing custom terms
8. THE form SHALL include Additional Cancellation Notes textarea for special circumstances (travel bans, natural disasters)

### Requirement 13: House Rules & Occupancy

**User Story:** As a property owner, I want to set clear house rules, so that tenants/guests know what is expected.

#### Acceptance Criteria

1. THE form SHALL include Maximum Persons per Unit input
2. THE form SHALL include Children Allowed selector (Yes, No, With restrictions - specify age limit)
3. THE form SHALL include Pets Allowed selector (Yes, No, With restrictions)
4. WHEN pets are allowed with restrictions, THE form SHALL display Pet Restrictions textarea
5. THE form SHALL include Smoking Allowed selector (Yes anywhere, Yes designated areas only, No)
6. THE Long-Stay form SHALL include Visitors/Overnight Guests Policy textarea
7. THE Long-Stay form SHALL include Preferred Tenant Type selector (Family, Couple, Single Professional, Student, Any, No Preference)
8. THE Short-Stay form SHALL include Parties/Events selector (Not allowed, Allowed with fee, Allowed small gatherings only)
9. THE Short-Stay form SHALL include Quiet Hours (From/To time pickers)
10. THE Short-Stay form SHALL include Commercial Photography/Filming selector (Not allowed, Allowed with fee, Allowed free)
11. THE Short-Stay form SHALL include Guest Age Requirement input (minimum age, typically 18 or 21)
12. THE Short-Stay form SHALL include Required at Check-in checkboxes (Government ID/Passport, Signed Waiver)
13. THE form SHALL include Additional Rules textarea for any other house rules

### Requirement 14: Terms & Conditions Section

**User Story:** As a property owner, I want to upload legal documents and agree to terms, so that my registration is legally compliant.

#### Acceptance Criteria

1. THE Long-Stay form SHALL require upload of Tenancy Agreement/Lease document (PDF, max 10MB)
2. THE Long-Stay form SHALL allow optional upload of Additional Terms document (PDF, max 10MB)
3. THE Long-Stay form SHALL include Special Clauses textarea for unique terms
4. THE Long-Stay form SHALL include Lease Duration selector (Fixed term, Periodic month-to-month, Minimum stay X months)
5. THE Long-Stay form SHALL include Termination Notice Period by tenant (30, 60, 90, Other days)
6. THE Long-Stay form SHALL include Termination Notice Period by owner (30, 60, 90, Other days)
7. THE Long-Stay form SHALL include Renewal Terms textarea
8. THE Long-Stay form SHALL include Dispute Resolution Method selector (Internal negotiation, Mediation through Masqany, Formal legal process)
9. THE Short-Stay form SHALL require upload of House Rules document (PDF, max 2 pages, 10MB)
10. THE Short-Stay form SHALL allow optional upload of Special Contracts (PDF)
11. THE Short-Stay form SHALL include Tourist Registration Number input (if applicable for hotels/B&Bs)
12. THE Short-Stay form SHALL include VAT Registration toggle and PIN input (if turnover exceeds KES 5M/year)
13. BOTH forms SHALL include confirmation checkboxes: "All information is accurate", "I am authorized to list this property", "I understand Masqany's terms", "I agree to pay connection/commission fee"
14. THE form SHALL NOT allow submission until all confirmation checkboxes are checked

### Requirement 15: Form Validation and Error Handling

**User Story:** As a property owner, I want clear validation and error messages, so that I can correct mistakes before submitting.

#### Acceptance Criteria

1. THE form SHALL validate required fields before allowing navigation to next step
2. THE form SHALL display field-specific error messages below invalid inputs
3. THE form SHALL use danger color (#F75555) for error messages
4. THE form SHALL prevent submission if any required field is missing or invalid
5. THE form SHALL validate file sizes for photos, videos, and documents
6. THE form SHALL validate file types for uploads
7. THE form SHALL validate numeric inputs (rent amount, capacity, deposit amounts)
8. THE form SHALL validate date inputs (check-in/out times, expiration dates)
9. THE form SHALL validate text length limits (title max 60-80 chars, description max 200-250 chars)
10. THE form SHALL validate M-Pesa number format (+254XXXXXXXXX)
11. THE form SHALL validate bank account number format
12. WHEN validation fails, THE form SHALL scroll to the first error and focus the field
13. WHEN network error occurs, THE form SHALL display "Network error. Please check your connection."
14. WHEN server error occurs, THE form SHALL display "Something went wrong. Please try again." with retry button

### Requirement 16: Draft Saving and Data Persistence

**User Story:** As a property owner, I want my form progress to be saved automatically, so that I don't lose data if I exit the app.

#### Acceptance Criteria

1. THE form SHALL auto-save draft data to Zustand store every 30 seconds
2. THE form SHALL persist draft data to AsyncStorage for offline access
3. WHEN the user exits the form, THE system SHALL save the current step and all field values
4. WHEN the user returns to the form, THE system SHALL restore the saved draft data
5. THE form SHALL display a "Resume Draft" option if draft data exists
6. THE form SHALL display a "Start Fresh" option to clear draft and start over
7. THE form SHALL clear draft data after successful submission
8. THE form SHALL display last saved timestamp in the header
9. THE form SHALL display a saving indicator when auto-saving

### Requirement 17: Role-Based Access Control

**User Story:** As a system administrator, I want to enforce role-based permissions for property registration, so that only authorized users can register properties.

#### Acceptance Criteria

1. THE Property_Registration_Module SHALL verify user role from Auth_Module before allowing registration
2. THE property_owner role SHALL have full access to register and manage their own properties
3. THE property_agent role SHALL have full access to register and manage properties on behalf of owners
4. THE tenant role SHALL NOT have access to property registration
5. THE relocation_driver role SHALL NOT have access to property registration
6. THE admin role SHALL have read access to all properties and approval permissions
7. THE super_admin role SHALL have full access to all property operations
8. WHEN an unauthorized user attempts to access registration, THE system SHALL display "Access Denied" alert
9. WHEN an unauthorized user attempts to access registration, THE system SHALL navigate back to home screen
10. THE system SHALL hide "Register Property" buttons for unauthorized roles

### Requirement 18: Admin Approval Workflow

**User Story:** As an admin, I want to review and approve property registrations, so that I can ensure quality listings on the platform.

#### Acceptance Criteria

1. WHEN a property is submitted, THE system SHALL set status to pending_verification
2. THE system SHALL link the property to the user ID from Auth_Module
3. THE admin SHALL be able to view all properties with status pending_verification
4. THE admin SHALL be able to view all property details, photos, videos, and documents
5. THE admin SHALL be able to approve a property, setting status to verified
6. THE admin SHALL be able to reject a property with a rejection reason
7. WHEN a property is rejected, THE system SHALL store the rejection reason
8. WHEN a property is rejected, THE system SHALL notify the property owner
9. THE property owner SHALL be able to edit and resubmit rejected properties
10. THE property owner SHALL NOT be able to edit verified properties (only deactivate)

### Requirement 19: Property Dashboard Integration (Coming Soon)

**User Story:** As a property owner, I want to access a dashboard after registration, so that I can manage my properties and perform administrative tasks.

#### Acceptance Criteria

1. WHEN registration is successful, THE system SHALL navigate to the property dashboard (placeholder)
2. THE property dashboard SHALL display a "Coming Soon" message
3. THE property dashboard SHALL list all registered properties with status
4. THE property dashboard SHALL allow CRUD operations on properties
5. THE property dashboard SHALL allow managing agents (for property owners)
6. THE property dashboard SHALL display booking requests and tenant applications
7. THE property dashboard SHALL display property analytics (views, inquiries, bookings)

### Requirement 20: Property Module Architecture

**User Story:** As a developer, I want the property registration feature to follow the established module pattern, so that the codebase remains consistent and maintainable.

#### Acceptance Criteria

1. THE Property_Registration_Module SHALL be located in modules/property/
2. THE Property_Registration_Module SHALL contain api.ts for all API calls
3. THE Property_Registration_Module SHALL contain hooks.ts for all TanStack Query hooks
4. THE Property_Registration_Module SHALL contain types.ts for all TypeScript interfaces
5. THE Property_Registration_Module SHALL contain index.ts that re-exports all public APIs
6. THE form screens SHALL NOT call apiClient directly
7. THE form screens SHALL only use hooks from Property_Registration_Module for data access
8. THE Property_Registration_Module SHALL use the single Axios instance from lib/api/client.ts
9. THE Property_Registration_Module SHALL define query keys as const arrays in hooks.ts
10. THE Property_Registration_Module SHALL use TanStack Query for all server state management
11. THE Property_Registration_Module SHALL use Property_Store for client state management (form drafts, current step, UI toggles)

## Summary

This requirements document defines a comprehensive property registration system with distinct flows for Long-Stay and Short-Stay properties, following Kenya's property market standards. The module integrates with the Auth Module for user identity and role-based access control, implements multi-step forms with sliding animations, provides amenity selection via toggle buttons (not typed input), handles Kenya-specific utility deposits, and enforces strict validation and file upload limits.

The implementation follows the Masqany mobile architecture with TanStack Query for server state, Zustand for client state, and the standard module pattern. The system supports draft saving, admin approval workflow, and future integration with a property dashboard for ongoing management.

**Note:** This module is NOT confirmed yet and serves as a planning document for future implementation.
