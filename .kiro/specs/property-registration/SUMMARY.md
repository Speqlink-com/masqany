# Property Registration Module - Summary

## ⚠️ STATUS: NOT A CONFIRMED MODULE YET

This is Module 004 - Property Registration for Long-Stay and Short-Stay properties.

## Quick Overview

**Purpose**: Allow property owners and agents to register properties for rental (long-stay residential/commercial) or short-term stays (hotels, vacation rentals, Airbnb-style).

**Key Features**:
- Two distinct registration flows (Long-Stay vs Short-Stay)
- Multi-step forms with sliding animations
- Amenity selection via toggle buttons (NOT typed)
- Kenya-specific utility deposits (Long-Stay only)
- Media uploads (6 photos max 4MB total, 1 video max 100MB 60s)
- Map-based location picker
- Admin approval workflow
- Draft auto-saving
- Role-based access control

## Module Structure

```
modules/property/
├── api.ts              # Property CRUD API calls
├── hooks.ts            # TanStack Query hooks
├── types.ts            # TypeScript interfaces (Long-Stay & Short-Stay)
├── store.ts            # Zustand client state (drafts, current step)
└── index.ts            # Public exports

app/(registration)/
├── property-registration.tsx           # ✅ Initial screen (DONE)
├── property-long-stay-form.tsx        # Multi-step Long-Stay form
└── property-short-stay-form.tsx       # Multi-step Short-Stay form

components/property/
├── PropertyFormHeader.tsx             # Header with progress indicator
├── PropertyFormProgress.tsx           # Step indicator
├── AmenitySelector.tsx                # Toggle amenities (clickable)
├── MediaUploader.tsx                  # Photos + Video uploader
├── LocationPicker.tsx                 # Map-based location
├── UtilityDepositCard.tsx            # Kenya utility deposits
├── PropertyTypeSelector.tsx           # Property type dropdown
├── PricingCard.tsx                    # Rental pricing inputs
└── DocumentUploader.tsx               # PDF document uploads
```

## Form Sections

### Long-Stay Form (8 Sections)
1. **Property Essence**: Title, description, building type, unit count
2. **Location Details**: County, area, estate, landmarks, map, directions
3. **Property Specifications**: Size, bedrooms, bathrooms, kitchen, parking, water
4. **Utilities & Deposits**: Water, electricity, WiFi, security, garbage (Kenya-specific)
5. **Rental Pricing**: Monthly rent, deposits, payment methods, move-in cost
6. **House Rules**: Occupancy, children, pets, smoking, visitors
7. **Media Uploads**: Photos (6), video (1), floor plan
8. **Terms & Conditions**: Lease documents, clauses, termination notice

### Short-Stay Form (10 Sections)
1. **Property Essence**: Title, description, listing type (entire/private/shared)
2. **Location**: Tourist zones, airport distance, transport hubs
3. **Guest Capacity**: Max guests, bed configuration, extra sleeping
4. **Amenities**: Detailed checklist (Essentials, Kitchen, Bathroom, Entertainment, Safety)
5. **Pricing**: Nightly rates, weekend/peak rates, cleaning fee, discounts (NO DEPOSITS)
6. **Availability**: Calendar, min/max nights, check-in/out times, self-check-in
7. **Cancellation Policy**: Flexible, Moderate, Firm, Strict, Custom
8. **House Rules**: Max guests, children, pets, smoking, parties, quiet hours
9. **Media Uploads**: Photos (6), video (1) - high quality required
10. **Terms**: House rules PDF, tourist registration, VAT registration

## Key Differences: Long-Stay vs Short-Stay

| Feature | Long-Stay | Short-Stay |
|---------|-----------|------------|
| **Deposits** | Yes (water, elec, security, house, rent) | No deposits |
| **Move-in Cost** | Rent + Deposits (can be 2x rent) | Night rate + cleaning fee |
| **Payment** | Monthly or longer | Per night |
| **Minimum Stay** | 6+ months | 1-28 nights |
| **Cancellation** | Notice period (30-60 days) | Policy (flexible to strict) |
| **Amenities** | Basic (security, parking) | Detailed (everything guest needs) |
| **Booking** | Viewing required | Instant or request |

## Technical Standards

### Validation
- Required fields marked with `*`
- Real-time validation as user types
- Error messages below inputs
- Prevent navigation if validation fails
- File size validation (photos 4MB total, video 100MB, docs 10MB)

### Animations
- Sliding transitions: 350ms with easing
- Button press: Scale to 0.95
- Progress indicator: Animated updates
- Use react-native-reanimated

### State Management
- **Server State**: TanStack Query for property data
- **UI State**: Zustand for form progress, drafts, current step
- **Form State**: React Hook Form for validation

### Background Images
- Initial screen: `property-registration-initial-screen.webp`
- All subsequent screens: `app-full-screen.webp`

## API Endpoints (To Be Defined)

```
POST   /api/v1/properties              # Create property
GET    /api/v1/properties              # List user's properties
GET    /api/v1/properties/:id          # Get property details
PUT    /api/v1/properties/:id          # Update property
DELETE /api/v1/properties/:id          # Delete property
PATCH  /api/v1/properties/:id/submit   # Submit for approval
GET    /api/v1/admin/properties        # Admin: List pending properties
POST   /api/v1/admin/properties/:id/approve   # Admin: Approve
POST   /api/v1/admin/properties/:id/reject    # Admin: Reject
```

## Dependencies

- `react-native-reanimated` - Sliding animations
- `react-hook-form` - Form validation
- `expo-image-picker` - Photo uploads
- `expo-document-picker` - Document uploads
- `expo-av` - Video uploads
- `@rnmapbox/maps` - Location picker
- `@tanstack/react-query` - Server state
- `zustand` - Client state

## Implementation Status

- [x] Initial screen (property-registration.tsx)
- [x] Permission function (canRegisterProperty)
- [ ] TypeScript types
- [ ] Reusable components
- [ ] Long-Stay form
- [ ] Short-Stay form
- [ ] API integration
- [ ] Admin approval screens

## Next Steps

1. Review this summary with user
2. Create detailed design.md
3. Create tasks.md with implementation steps
4. Begin implementation following the task list

## Notes

- Follow vehicle-registration.tsx patterns for consistency
- Pre-fill user data from auth store (name, email, phone)
- Amenities are CLICKABLE toggles, not typed
- Kenya-specific utility deposits are critical for Long-Stay
- Short-stay has NO deposits (key difference)
- Admin approval workflow integration required
- Property dashboard (coming soon) for management
