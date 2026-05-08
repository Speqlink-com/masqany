# Property Registration Module (Module 004) - Implementation Plan

## Overview
Complete property registration system with distinct flows for Long-Stay and Short-Stay properties, following Kenya's property market standards.

## Module Status
⚠️ **NOT A CONFIRMED MODULE YET** - Keep note for future reference

## Architecture

### Module Structure
```
modules/property/
├── api.ts              # Property CRUD API calls
├── hooks.ts            # TanStack Query hooks
├── types.ts            # TypeScript interfaces (Long-Stay & Short-Stay)
└── index.ts            # Public exports

app/(registration)/
├── property-registration.tsx           # ✅ Initial screen (DONE)
├── property-long-stay-form.tsx        # Multi-step Long-Stay form
└── property-short-stay-form.tsx       # Multi-step Short-Stay form

components/property/
├── PropertyFormHeader.tsx             # Reusable header with progress
├── PropertyFormProgress.tsx           # Step indicator
├── AmenitySelector.tsx                # Toggle amenities (clickable, not typed)
├── MediaUploader.tsx                  # Photos (6 max, 4MB) + Video (1 max, 100MB, 60s)
├── LocationPicker.tsx                 # Map-based location picker
├── UtilityDepositCard.tsx            # Kenya-specific utility deposits
├── PropertyTypeSelector.tsx           # Property type dropdown
├── PricingCard.tsx                    # Rental pricing inputs
└── DocumentUploader.tsx               # PDF document uploads
```

## Key Features

### 1. Two Distinct Registration Flows
- **Long-Stay**: Residential/Commercial properties with deposits, utilities, lease agreements
- **Short-Stay**: Hotels, vacation rentals, Airbnb-style with nightly rates, no deposits

### 2. Multi-Step Forms with Sliding Animation
- Use `react-native-reanimated` for smooth transitions
- Progress indicator at top
- Validation at each step before proceeding
- Back navigation preserves data

### 3. Amenity Selection (NOT Typed Input)
- Toggle buttons: Available (selected) / Unavailable (unselected)
- Visual feedback with color changes
- Grouped by category (Essentials, Kitchen, Bathroom, etc.)

### 4. Kenya-Specific Features
- **Utility Deposits**: Water, Electricity, WiFi, Security, Garbage, House Maintenance
- **Payment Methods**: M-Pesa (Paybill/Till), Bank Transfer, Cash, Cheque
- **Location**: County, Constituency, Ward, Estate, Nearest Landmark
- **Water Sources**: Nairobi Water, County Water, Borehole, Tank
- **Electricity**: Prepaid (token) vs Postpaid (bill)

### 5. Media Uploads
- **Photos**: Max 6, 4MB total combined
- **Video**: Max 1, 60 seconds, 100MB
- **Documents**: Max 2 PDFs, 10MB each (lease agreements)

### 6. CRUD Operations
- Create: Submit new property registration
- Read: View submitted properties (dashboard - coming soon)
- Update: Edit pending/rejected properties
- Delete: Remove draft properties

### 7. Admin Integration
- Properties linked to user ID (from auth module)
- Admin approval workflow
- Status: Draft → Pending → Approved/Rejected

## Form Sections

### Long-Stay Form (8 Sections)
1. **Property Essence**: Title, description, building type, unit count
2. **Location Details**: County, area, estate, landmarks, directions, map
3. **Property Specifications**: Size, bedrooms, bathrooms, kitchen, parking, water source
4. **Utilities & Deposits**: Water, electricity, WiFi, security, garbage (Kenya-specific)
5. **Rental Pricing**: Monthly rent, deposits, payment methods, move-in cost
6. **House Rules**: Occupancy, children, pets, smoking, visitors
7. **Media Uploads**: Photos (6), video (1), floor plan
8. **Terms & Conditions**: Lease documents, clauses, termination notice

### Short-Stay Form (10 Sections)
1. **Property Essence**: Title, description, listing type (entire/private/shared)
2. **Location**: Tourist-friendly zones, airport distance, transport hubs
3. **Guest Capacity**: Max guests, bed configuration, extra sleeping spaces
4. **Amenities**: Detailed checklist (Essentials, Kitchen, Bathroom, Entertainment, Safety)
5. **Pricing**: Nightly rates, weekend/peak rates, cleaning fee, discounts (NO DEPOSITS)
6. **Availability**: Calendar, min/max nights, check-in/out times, self-check-in
7. **Cancellation Policy**: Flexible, Moderate, Firm, Strict, Custom
8. **House Rules**: Max guests, children, pets, smoking, parties, quiet hours
9. **Media Uploads**: Photos (6), video (1) - high quality required
10. **Terms**: House rules PDF, tourist registration, VAT registration

## Technical Standards

### Validation Rules
- Required fields marked with `*`
- Real-time validation as user types
- Error messages below inputs
- Prevent navigation to next step if validation fails
- Age validation (18+ for drivers, property owners)
- File size validation (photos, videos, documents)
- Date format validation (DD/MM/YYYY)

### Input Patterns (from vehicle-registration.tsx)
- Text inputs with blue border (#28B4F9)
- Dropdown with chevron icon
- Toggle buttons for selections
- Date inputs with smart formatting
- Phone/email pre-filled from auth store (read-only with checkmark)
- Document upload buttons with file name display
- Photo grid with remove buttons

### Background Images
- Initial screen: `property-registration-initial-screen.webp`
- All subsequent screens: `app-full-screen.webp`

### Design Tokens
- Primary: #20A6FD
- Border: #28B4F9
- Background cards: #E1E6E8
- Success: #22C55E
- Danger: #F75555
- Dark text: #000000, #545454
- Light text: #FFFFFF

## Missing Icons (Request from User)
Will identify during implementation and request from user.

## API Endpoints (To Be Defined)
```
POST   /api/v1/properties              # Create property
GET    /api/v1/properties              # List user's properties
GET    /api/v1/properties/:id          # Get property details
PUT    /api/v1/properties/:id          # Update property
DELETE /api/v1/properties/:id          # Delete property
PATCH  /api/v1/properties/:id/submit   # Submit for approval
```

## State Management
- **Server State**: TanStack Query for property data
- **UI State**: Zustand for form progress, current step, draft data
- **Form State**: React Hook Form for validation and field management

## Next Steps
1. Create TypeScript types for both forms
2. Build reusable components (AmenitySelector, MediaUploader, etc.)
3. Implement Long-Stay form with sliding animation
4. Implement Short-Stay form with sliding animation
5. Connect to API (mock data initially)
6. Add CRUD operations
7. Test validation and user flows
8. Document module

## Dependencies
- `react-native-reanimated` - Sliding animations
- `react-hook-form` - Form validation
- `expo-image-picker` - Photo uploads
- `expo-document-picker` - Document uploads
- `expo-av` - Video uploads
- `@rnmapbox/maps` - Location picker
- `@tanstack/react-query` - Server state

## Timeline Estimate
- Types & Components: 2-3 hours
- Long-Stay Form: 4-5 hours
- Short-Stay Form: 4-5 hours
- API Integration: 2-3 hours
- Testing & Refinement: 2-3 hours
- **Total**: 14-19 hours

## Notes
- Follow vehicle-registration.tsx patterns for consistency
- Pre-fill user data from auth store (name, email, phone)
- Use smart text inputs with validation (not difficult pickers)
- Amenities are CLICKABLE toggles, not typed
- Kenya-specific utility deposits are critical
- Short-stay has NO deposits (key difference)
- Admin approval workflow integration required
- Property dashboard (coming soon) for management
