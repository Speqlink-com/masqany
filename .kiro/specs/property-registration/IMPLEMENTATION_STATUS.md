# Property Registration Module - Implementation Status

**Last Updated:** May 9, 2026  
**Status:** Partially Implemented (Core Infrastructure Complete, Forms In Progress)

---

## Executive Summary

The Property Registration Module enables property owners and agents to register properties for both Long-Stay (residential/commercial leases) and Short-Stay (hotels, vacation rentals) on the Masqany platform. The module follows the Masqany mobile architecture with TanStack Query for server state management and Zustand for client state.

### Overall Progress: ~70% Complete

- ✅ **Module Infrastructure** (100%) - Complete
- ✅ **Reusable Components** (100%) - Complete  
- ✅ **Long-Stay Form** (100%) - Complete
- ✅ **Short-Stay Form** (100%) - Complete
- ⚠️ **Validation & Error Handling** (75%) - Mostly Complete
- ⚠️ **Draft Saving** (50%) - Partially Implemented
- ❌ **Role-Based Access Control** (0%) - Not Started
- ❌ **Admin Approval Workflow** (0%) - Placeholder Only

---

## Module Architecture

### Directory Structure

```
modules/property/
├── api.ts          ✅ Complete - All API endpoints defined
├── hooks.ts        ✅ Complete - TanStack Query hooks
├── types.ts        ✅ Complete - TypeScript interfaces
├── store.ts        ✅ Complete - Zustand client state
└── index.ts        ✅ Complete - Public exports

components/property/
├── PropertyFormHeader.tsx              ✅ Complete
├── PropertyFormProgress.tsx            ✅ Complete
├── AmenitySelector.tsx                 ✅ Complete
├── MediaUploader.tsx                   ✅ Complete
├── LocationPicker.tsx                  ✅ Complete
├── UtilityDepositCard.tsx              ✅ Complete
├── PropertyTypeSelector.tsx            ✅ Complete
├── PricingCard.tsx                     ✅ Complete
├── DocumentUploader.tsx                ✅ Complete
├── BedConfigurationInput.tsx           ✅ Complete
├── AvailabilityCalendar.tsx            ✅ Complete
└── CancellationPolicySelector.tsx      ✅ Complete

app/(registration)/
├── property-registration.tsx           ✅ Complete - Initial screen
├── property-long-stay-form.tsx         ✅ Complete - 8-step form
└── property-short-stay-form.tsx        ✅ Complete - 10-step form
```

---

## API Endpoints

All API endpoints are defined in `modules/property/api.ts` and wrapped by TanStack Query hooks in `modules/property/hooks.ts`.

### Property Operations

| Endpoint | Method | Description | Status |
|----------|--------|-------------|--------|
| `/properties` | GET | Get all properties for current user | ✅ Implemented |
| `/properties` | POST | Create new property | ✅ Implemented |
| `/properties/:id` | GET | Get single property by ID | ✅ Implemented |
| `/properties/:id` | PUT | Update existing property | ✅ Implemented |
| `/properties/:id` | DELETE | Soft delete property | ✅ Implemented |

### Media Upload Endpoints

| Endpoint | Method | Description | Status |
|----------|--------|-------------|--------|
| `/properties/:id/photos` | POST | Upload property photos (max 6, 4MB total) | ✅ Implemented |
| `/properties/:id/video` | POST | Upload property video (max 1, 60s, 100MB) | ✅ Implemented |
| `/properties/:id/documents` | POST | Upload documents (lease, house rules, etc.) | ✅ Implemented |

### Admin Endpoints

| Endpoint | Method | Description | Status |
|----------|--------|-------------|--------|
| `/admin/properties/pending` | GET | Get properties pending verification | ✅ Implemented |
| `/admin/properties/:id/approve` | POST | Approve or reject property | ✅ Implemented |
| `/admin/properties` | GET | Get all properties (admin view) | ✅ Implemented |

---

## Data Models

### Core Types

All TypeScript interfaces are defined in `modules/property/types.ts`.

#### Property Types

```typescript
// Stay Types
type StayType = "long_stay" | "short_stay";

// Property Status
type PropertyStatus = 
  | "draft" 
  | "pending_verification" 
  | "verified" 
  | "rejected" 
  | "active" 
  | "inactive";

// Long-Stay Property Types
type LongStayPropertyType = 
  | "single_room" 
  | "bedsitter" 
  | "1_bedroom" 
  | "2_bedroom" 
  | "3_bedroom" 
  | "4plus_bedroom"
  | "hostel_bed_space"
  | "hostel_private_room"
  | "student_hostel"
  | "office_space"
  | "shop_retail"
  | "warehouse"
  | "mixed_use"
  | "block_house"
  | "mabati_house"
  | "container_house"
  | "semi_permanent";

// Short-Stay Property Types
type ShortStayPropertyType = 
  | "hotel_room_standard"
  | "hotel_suite"
  | "boutique_hotel"
  | "budget_hotel"
  | "lodge_room"
  | "guest_house"
  | "bnb_room"
  | "vacation_home"
  | "vacation_apartment"
  | "private_room"
  | "shared_room"
  | "serviced_apartment"
  | "cottage"
  | "villa"
  | "cabin"
  | "airbnb_entire"
  | "airbnb_private"
  | "campsite"
  | "treehouse"
  | "container_tourist"
  | "boat_houseboat"
  | "farm_stay"
  | "glamping";
```

#### Base Property Interface

```typescript
interface BaseProperty {
  // Identity
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  stayType: StayType;
  status: PropertyStatus;
  rejectionReason?: string;
  
  // Property Condition & Acquisition
  propertyCondition: "ready_to_move" | "brand_new" | "under_construction";
  expectedDeliveryDate?: string;
  acquisitionModel: "private_owner" | "affordable_housing_program";
  
  // Affordable Housing Program (AHP) Fields
  ahpProgramId?: string;
  ahpProgramName?: string;
  ahpIncomeBand?: "low_cost" | "social_housing" | "middle_income";
  ahpEligibilityCriteria?: string[];
  ahpApplicationDeadline?: string;
  ahpAllocationMethod?: "lottery" | "first_come" | "priority_based";
  ahpUnitsAvailable?: number;
  
  // Property Essence
  title: string;
  description: string;
  buildingName?: string;
  buildingType: BuildingType;
  totalUnitsInBuilding?: number;
  
  // Location
  county: string;
  constituency: string;
  ward: string;
  estate: string;
  nearestLandmark: string;
  streetRoad?: string;
  plotBuildingNumber?: string;
  floorNumber?: string;
  unitNumber?: string;
  googleMapsLink: string;
  latitude: number;
  longitude: number;
  directionsFromStage: string;
  accessibilityNotes?: string;
  
  // Property Specifications
  propertySize?: number;
  propertySizeUnit?: "sqft" | "sqm" | "acres";
  bedrooms: number;
  bathrooms: number;
  bathroomTypes: string[];
  kitchenType: KitchenType;
  furnishingStatus: FurnishingStatus;
  furnishedItems?: string[];
  parkingType: ParkingType;
  paidParkingCost?: number;
  waterSources: WaterSource[];
  specialStructureType?: string;
  
  // Media
  photos: string[];
  videoUrl?: string;
  floorPlanUrl?: string;
  
  // House Rules
  maxPersons: number;
  childrenAllowed: boolean;
  childrenAgeRestriction?: number;
  petsAllowed: boolean;
  petRestrictions?: string;
  smokingAllowed: "yes_anywhere" | "yes_designated" | "no";
  additionalRules?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
```

#### Long-Stay Specific Fields

```typescript
interface LongStayProperty extends BaseProperty {
  stayType: "long_stay";
  propertyType: LongStayPropertyType;
  
  // Utilities & Deposits (Kenya-specific)
  utilities: {
    water: UtilityConfig;
    electricity: UtilityConfig;
    wifi: UtilityConfig;
    security: UtilityConfig;
    garbage: UtilityConfig;
    houseMaintenance: UtilityConfig;
  };
  
  // Rental Pricing
  monthlyRent: number;
  rentPaymentSchedule: RentPaymentSchedule;
  securityDepositMonths?: number;
  securityDepositFixed?: number;
  totalMoveInCost: number;
  paymentMethods: PaymentMethod[];
  mpesaDetails?: MpesaDetails;
  bankDetails?: BankDetails;
  rentDueDate: number;
  gracePeriodDays: number;
  
  // Long-Stay Rules
  visitorsPolicy?: string;
  preferredTenantType?: string;
  
  // Terms & Conditions
  leaseAgreementUrl: string;
  additionalTermsUrl?: string;
  specialClauses?: string;
  leaseDuration: string;
  tenantTerminationNoticeDays: number;
  ownerTerminationNoticeDays: number;
  renewalTerms?: string;
  disputeResolutionMethod: string;
}
```

#### Short-Stay Specific Fields

```typescript
interface ShortStayProperty extends BaseProperty {
  stayType: "short_stay";
  propertyType: ShortStayPropertyType;
  listingType: ListingType;
  
  // Location (Tourist-specific)
  nearestTouristAttraction?: string;
  nearestAirport?: string;
  airportDistanceKm?: number;
  airportTransferAvailable: boolean;
  nearestMatatu?: string;
  
  // Guest Capacity
  maxAdults: number;
  maxChildren: number;
  maxInfants: number;
  bedConfiguration: BedConfiguration[];
  extraSleepingSpaces?: string[];
  totalBeds: number;
  
  // Amenities (Detailed)
  amenities: {
    essentials: string[];
    kitchen: string[];
    bathroom: string[];
    entertainment: string[];
    outdoor: string[];
    family: string[];
    safety: string[];
  };
  
  // Pricing (NO Security Deposits)
  baseNightlyRate: number;
  standardOccupancy: number;
  weekendRate?: number;
  peakSeasonRates?: PeakSeasonRate[];
  holidayRates?: HolidayRate[];
  extraGuestFee?: number;
  extraGuestFreeUpTo?: number;
  cleaningFee: number;
  weeklyDiscountPercent?: number;
  monthlyDiscountPercent?: number;
  earlyBirdDiscountPercent?: number;
  earlyBirdDaysAdvance?: number;
  lastMinuteDiscountPercent?: number;
  lastMinuteDaysWithin?: number;
  
  // Availability & Booking
  availabilityCalendar: AvailabilityDate[];
  minNightsStay: number;
  maxNightsStay?: number;
  advanceNoticeDays: number;
  sameDayBookingUntil?: string;
  checkInTimeFrom: string;
  checkInTimeTo: string;
  lateCheckInAvailable: boolean;
  lateCheckInFee?: number;
  selfCheckInMethod?: string;
  checkOutTime: string;
  lateCheckOutAvailable: boolean;
  lateCheckOutFeePerHour?: number;
  instantBooking: boolean;
  
  // Cancellation Policy
  cancellationPolicy: CancellationPolicy;
  customCancellationPolicy?: string;
  cancellationNotes?: string;
  
  // Short-Stay Rules
  partiesAllowed: "not_allowed" | "allowed_with_fee" | "allowed_small";
  partiesFee?: number;
  partiesMaxGuests?: number;
  quietHoursFrom: string;
  quietHoursTo: string;
  commercialPhotoAllowed: "not_allowed" | "allowed_with_fee" | "allowed_free";
  commercialPhotoFee?: number;
  guestMinAge: number;
  requireIdAtCheckIn: boolean;
  requireSignedWaiver: boolean;
  
  // Terms & Conditions
  houseRulesUrl: string;
  specialContractsUrl?: string;
  touristRegistrationNumber?: string;
  vatRegistered: boolean;
  vatPin?: string;
}
```

#### Supporting Interfaces

```typescript
interface UtilityConfig {
  available: boolean;
  provider?: string;
  billingMethod?: "per_unit" | "fixed_monthly" | "included_in_rent";
  costPerUnit?: number;
  depositRequired: boolean;
  depositAmount?: number;
  monthlyCost?: number;
  includedInRent: boolean;
  meterNumber?: string;
}

interface MpesaDetails {
  paybillNumber?: string;
  accountNumber?: string;
  tillNumber?: string;
}

interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branch?: string;
}

interface BedConfiguration {
  roomName: string;
  bedType: "single" | "double" | "queen" | "king" | "bunk";
  quantity: number;
}

interface PeakSeasonRate {
  seasonName: string;
  startDate: string;
  endDate: string;
  nightlyRate: number;
}

interface HolidayRate {
  holidayName: string;
  date: string;
  nightlyRate: number;
}

interface AvailabilityDate {
  date: string;
  available: boolean;
}
```

---

## TanStack Query Hooks

All hooks are defined in `modules/property/hooks.ts` and use centralized query keys for cache management.

### Query Keys

```typescript
export const propertyKeys = {
  all: ["properties"] as const,
  lists: () => [...propertyKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...propertyKeys.lists(), filters] as const,
  details: () => [...propertyKeys.all, "detail"] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
  pending: () => [...propertyKeys.all, "pending"] as const,
  admin: () => [...propertyKeys.all, "admin"] as const,
};
```

### Available Hooks

| Hook | Type | Description | Status |
|------|------|-------------|--------|
| `useProperties(params?)` | Query | Fetch user's properties with optional filters | ✅ Implemented |
| `useProperty(id)` | Query | Fetch single property by ID | ✅ Implemented |
| `useCreateProperty()` | Mutation | Create new property | ✅ Implemented |
| `useUpdateProperty(id)` | Mutation | Update existing property | ✅ Implemented |
| `useDeleteProperty()` | Mutation | Soft delete property | ✅ Implemented |
| `useUploadPhotos(propertyId)` | Mutation | Upload property photos | ✅ Implemented |
| `useUploadVideo(propertyId)` | Mutation | Upload property video | ✅ Implemented |
| `useUploadDocument(propertyId)` | Mutation | Upload property documents | ✅ Implemented |
| `usePendingProperties(params?)` | Query | Fetch pending properties (admin) | ✅ Implemented |
| `useApproveProperty()` | Mutation | Approve/reject property (admin) | ✅ Implemented |
| `useAllProperties(params?)` | Query | Fetch all properties (admin) | ✅ Implemented |

### Cache Invalidation Strategy

- **On Create**: Invalidates property lists, sets new property in cache
- **On Update**: Updates specific property in cache, invalidates lists
- **On Delete**: Removes property from cache, invalidates lists
- **On Media Upload**: Invalidates specific property to refetch with new media
- **On Approval**: Updates property in cache, invalidates pending list and all lists

---

## Zustand Client State

The property store (`modules/property/store.ts`) manages client-side UI state.

### Store Structure

```typescript
interface PropertyStore {
  // Form State
  currentStep: number;
  totalSteps: number;
  longStayDraft: Partial<LongStayPropertyPayload>;
  shortStayDraft: Partial<ShortStayPropertyPayload>;
  
  // UI State
  isSaving: boolean;
  lastSaved: Date | null;
  
  // Actions
  setCurrentStep: (step: number) => void;
  setTotalSteps: (total: number) => void;
  updateLongStayDraft: (data: Partial<LongStayPropertyPayload>) => void;
  updateShortStayDraft: (data: Partial<ShortStayPropertyPayload>) => void;
  clearLongStayDraft: () => void;
  clearShortStayDraft: () => void;
  setIsSaving: (saving: boolean) => void;
  markSaved: () => void;
}
```

### State Management Rules

- **Server State** (properties, documents, media) → TanStack Query
- **Client State** (form drafts, current step, UI toggles) → Zustand
- **Never mix**: Components import from both when needed, but they don't share a store

---

## Implemented Features

### ✅ Initial Registration Screen

**File:** `app/(registration)/property-registration.tsx`

**Features:**
- Background image (property-registration-initial-screen.webp)
- Back button and Pre-Verified Account badge
- Stay Type Selection Card (Long Stay / Short Stay)
- AI Agent Card (navigate to chat agent)
- Property Type dropdown
- Validation before navigation
- Navigation to appropriate form screen

### ✅ Long-Stay Form (8 Steps)

**File:** `app/(registration)/property-long-stay-form.tsx`

**Steps:**
1. **Property Essence** - Title, description, building type
2. **Location Details** - Map picker, county, area, directions
3. **Property Specifications** - Size, bedrooms, bathrooms, kitchen, furnishing
4. **Utilities & Deposits** - Kenya-specific utility deposits (water, electricity, WiFi, security, garbage, house maintenance)
5. **Rental Pricing** - Monthly rent, payment schedule, security deposit, payment methods
6. **House Rules** - Occupancy, children, pets, smoking, visitors policy
7. **Media Uploads** - Photos (max 6, 4MB total), video (max 1, 60s, 100MB)
8. **Terms & Conditions** - Lease agreement, special clauses, confirmation checkboxes

**Features:**
- Sliding animations between steps (350ms)
- Progress indicator
- Auto-save every 30 seconds
- Field validation
- Draft restoration
- Form submission with status `pending_verification`

### ✅ Short-Stay Form (10 Steps)

**File:** `app/(registration)/property-short-stay-form.tsx`

**Steps:**
1. **Property Essence** - Title, description, listing type
2. **Location Details** - Tourist zones, airport, transport
3. **Guest Capacity** - Max guests, bed configuration
4. **Amenities** - Detailed amenity checklist (toggle buttons)
5. **Pricing** - Nightly rates, discounts (NO security deposits)
6. **Availability & Booking Rules** - Calendar, min/max nights, check-in/out times
7. **Cancellation Policy** - Flexible, Moderate, Firm, Strict, Super Strict, Custom
8. **House Rules** - Guests, pets, parties, quiet hours
9. **Media Uploads** - Photos, video (high quality emphasized)
10. **Terms & Conditions** - House rules PDF, tourist registration, VAT

**Features:**
- Sliding animations between steps (350ms)
- Progress indicator
- Auto-save every 30 seconds
- Field validation
- Draft restoration
- Form submission with status `pending_verification`

### ✅ Reusable Components

All 12 reusable components are implemented:

1. **PropertyFormHeader** - Progress indicator, back button, step title, auto-save indicator
2. **PropertyFormProgress** - Horizontal progress bar with step dots
3. **AmenitySelector** - Toggle buttons for amenities (NOT text input)
4. **MediaUploader** - Photo/video upload with validation
5. **LocationPicker** - Map-based location selection with @rnmapbox/maps
6. **UtilityDepositCard** - Kenya-specific utility deposit configuration
7. **PropertyTypeSelector** - Property type dropdown
8. **PricingCard** - Rental pricing inputs
9. **DocumentUploader** - PDF document uploads
10. **BedConfigurationInput** - Bed types per room
11. **AvailabilityCalendar** - Interactive calendar for short-stay
12. **CancellationPolicySelector** - Policy selector with descriptions

---

## Pending Implementation

### ⚠️ Validation & Error Handling (75% Complete)

**Implemented:**
- ✅ Field-level validation
- ✅ Required field checks
- ✅ File size validation
- ✅ File type validation
- ✅ Numeric input validation
- ✅ Text length validation

**Pending:**
- ❌ Scroll to first error on validation failure
- ❌ Network error handling with retry
- ❌ Server error handling with retry

### ⚠️ Draft Saving (50% Complete)

**Implemented:**
- ✅ Auto-save to Zustand store every 30 seconds
- ✅ Last saved timestamp display
- ✅ Saving indicator

**Pending:**
- ❌ Persist drafts to AsyncStorage for offline access
- ❌ "Resume Draft" option on form entry
- ❌ "Start Fresh" option to clear draft

### ❌ Role-Based Access Control (0% Complete)

**Required:**
- Verify user role from Auth Module before allowing registration
- Allow `property_owner` and `property_agent` roles full access
- Deny `tenant` and `relocation_driver` roles access
- Allow `admin` role read access and approval permissions
- Allow `super_admin` role full access
- Display "Access Denied" alert for unauthorized users
- Hide "Register Property" buttons for unauthorized roles

### ❌ Admin Approval Workflow (0% Complete)

**Required:**
- Admin screen for viewing pending properties
- Approve/reject functionality
- Rejection reason input
- Notification system for property status changes
- Property owner can edit and resubmit rejected properties

---

## Key Differences: Long-Stay vs Short-Stay

| Feature | Long-Stay | Short-Stay |
|---------|-----------|------------|
| **Steps** | 8 steps | 10 steps |
| **Security Deposits** | ✅ Required (months or fixed KES) | ❌ Not collected (trust + reviews) |
| **Utility Deposits** | ✅ Kenya-specific (water, elec, WiFi, etc.) | ❌ Not applicable |
| **Pricing** | Monthly rent, payment schedule | Nightly rates, discounts, peak seasons |
| **Amenities** | Basic (security, parking, water, etc.) | Detailed (WiFi speed, TV channels, etc.) |
| **Availability** | Not applicable | Interactive calendar, booking rules |
| **Cancellation Policy** | Not applicable | Flexible, Moderate, Firm, Strict, etc. |
| **Documents** | Lease agreement required | House rules PDF required |
| **Tourist Fields** | Not applicable | Airport, attractions, tourist registration |

---

## Kenya-Specific Features

### Utility Deposits (Long-Stay Only)

The Long-Stay form includes a dedicated step for Kenya-specific utility deposits:

- **Water** - Provider (Nairobi Water, County Water, Borehole, Tank), billing method, deposit
- **Electricity** - Meter type (Prepaid Token, Postpaid Bill), deposit
- **WiFi** - Deposit, monthly cost, included in rent toggle
- **Security** - Deposit, monthly cost
- **Garbage** - Deposit, monthly cost
- **House Maintenance** - Deposit, monthly cost

**Total Move-In Cost Calculation:**
```
Total = First Month Rent + Rent Deposit + All Utility Deposits
```

### Payment Methods

- **M-Pesa** - Paybill Number, Account Number, Till Number
- **Bank Transfer** - Bank Name, Account Name, Account Number, Branch
- **Cash**
- **Cheque**
- **Card**

### Location Standards

- County, Constituency/Sub-county, Ward/Area, Estate/Neighborhood
- Nearest Landmark (required)
- Directions from nearest stage/terminal (max 300 chars)
- Accessibility Notes (transport information)

---

## Testing Recommendations

### Unit Tests Needed

- [ ] Property API functions
- [ ] TanStack Query hooks
- [ ] Zustand store actions
- [ ] Form validation functions
- [ ] File upload validation
- [ ] Utility deposit calculations

### Integration Tests Needed

- [ ] Complete Long-Stay flow (8 steps)
- [ ] Complete Short-Stay flow (10 steps)
- [ ] Draft saving and restoration
- [ ] Form submission and navigation
- [ ] Media upload flow
- [ ] Document upload flow

### E2E Tests Needed

- [ ] Property owner registration flow
- [ ] Property agent registration flow
- [ ] Admin approval workflow
- [ ] Role-based access control
- [ ] Error scenarios (network, server, validation)

---

## Known Issues

1. **Deprecated `runOnJS`** - Both form screens use deprecated `runOnJS` from react-native-reanimated. Should be updated to use worklets directly.

2. **AsyncStorage Persistence** - Draft data is not persisted to AsyncStorage yet, so drafts are lost on app restart.

3. **Role Verification** - No role-based access control implemented yet. All users can access registration screens.

4. **Admin Dashboard** - Admin approval workflow is placeholder only. No functional admin screen exists.

5. **Network Error Handling** - No retry mechanism for network or server errors.

---

## Next Steps

### Priority 1: Complete Core Features

1. Implement AsyncStorage persistence for drafts
2. Add "Resume Draft" / "Start Fresh" options
3. Implement scroll-to-error on validation failure
4. Add network error handling with retry

### Priority 2: Security & Access Control

1. Implement role-based access control
2. Verify user role from Auth Module
3. Hide registration buttons for unauthorized roles
4. Display "Access Denied" alert

### Priority 3: Admin Features

1. Create admin screen for pending properties
2. Implement approve/reject functionality
3. Add rejection reason input
4. Implement notification system

### Priority 4: Testing & Polish

1. Write unit tests for API and hooks
2. Write integration tests for forms
3. Write E2E tests for complete flows
4. Fix deprecated `runOnJS` usage
5. Add loading states and error boundaries

---

## Usage Examples

### Creating a Long-Stay Property

```typescript
import { useCreateProperty } from "@/modules/property";

function MyComponent() {
  const createProperty = useCreateProperty();

  const handleSubmit = async () => {
    const payload: LongStayPropertyPayload = {
      stayType: "long_stay",
      propertyType: "2_bedroom",
      title: "Modern 2BR Apartment in Kilimani",
      description: "Spacious apartment with great amenities",
      // ... other fields
      status: "pending_verification",
    };

    await createProperty.mutateAsync(payload);
  };

  return (
    <button onClick={handleSubmit}>
      Submit Property
    </button>
  );
}
```

### Fetching User's Properties

```typescript
import { useProperties } from "@/modules/property";

function MyPropertiesList() {
  const { data, isLoading, error } = useProperties({
    page: 1,
    pageSize: 10,
    status: "verified",
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.properties.map((property) => (
        <div key={property.id}>{property.title}</div>
      ))}
    </div>
  );
}
```

### Uploading Photos

```typescript
import { useUploadPhotos } from "@/modules/property";

function PhotoUploader({ propertyId }: { propertyId: string }) {
  const uploadPhotos = useUploadPhotos(propertyId);

  const handleUpload = async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("photos", file));

    await uploadPhotos.mutateAsync(formData);
  };

  return <input type="file" multiple onChange={(e) => handleUpload(Array.from(e.target.files || []))} />;
}
```

---

## Conclusion

The Property Registration Module has a solid foundation with complete module infrastructure, all reusable components, and both Long-Stay and Short-Stay forms implemented. The core registration flows are functional, but several important features remain:

- **Draft persistence** to AsyncStorage
- **Role-based access control** for security
- **Admin approval workflow** for quality control
- **Comprehensive error handling** for better UX

Once these features are completed and tested, the module will be ready for production use.

---

**Document Version:** 1.0  
**Last Updated:** May 9, 2026  
**Maintained By:** Development Team
