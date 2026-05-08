# Property Registration Module - Design Document

## ⚠️ STATUS: NOT A CONFIRMED MODULE YET

## Overview

The Property Registration Module provides a comprehensive system for property owners and agents to register properties for both Long-Stay (residential/commercial leases) and Short-Stay (hotels, vacation rentals, Airbnb-style) on the Masqany platform. This design follows the established Masqany mobile architecture with a two-layer state pattern: TanStack Query for server state (property data, documents, media) and Zustand for client state (form drafts, current step, UI toggles).

The feature implements the standard module pattern with `modules/property/` containing `api.ts`, `hooks.ts`, `types.ts`, `store.ts`, and `index.ts`. All components use TanStack Query hooks for data access and never call the API client directly. The module integrates with the Auth Module for user identity and role-based access control, supporting property_owner, property_agent, admin, and super_admin roles.

### Key Design Principles

1. **Two-Layer State Separation**: Server state (properties, documents, media) managed by TanStack Query; client state (form drafts, current step, UI toggles) managed by Zustand
2. **Module Pattern Compliance**: All API calls through `modules/property/api.ts`, all data access through `modules/property/hooks.ts`
3. **Design Token Usage**: All styling uses tokens from `constants/tokens.ts` and NativeWind classes
4. **Single API Client**: All HTTP calls use the shared Axios instance from `lib/api/client.ts`
5. **Navigation Integration**: Uses Expo Router for screen navigation with proper type safety
6. **Role-Based Access Control**: Enforces permissions for property_owner, property_agent, admin, and super_admin roles
7. **Multi-Step Forms**: Implements sliding animations between form steps using react-native-reanimated
8. **Kenya-Specific Features**: Utility deposits, payment methods, location standards
9. **Amenity Selection**: Toggle buttons (NOT text input) for selecting available amenities
10. **Draft Auto-Saving**: Persists form data to prevent data loss

## Architecture

### High-Level Component Structure

```
app/(registration)/property-registration.tsx    ✅ Initial screen (DONE)
  ├─ BackButton                                 White circle back button
  ├─ PreVerifiedBadge                           Pre-verified account badge
  ├─ HeaderTitle                                "Become a Verified Property Owner"
  ├─ HouseIcon                                  80x80 house icon
  ├─ Subtitle                                   "complete property registration"
  ├─ StayTypeCard                               Long Stay / Short Stay selector
  ├─ AIAgentCard                                AI registration assistant
  ├─ PropertyTypeCard                           Property type dropdown
  └─ NextButton                                 Navigate to form

app/(registration)/property-long-stay-form.tsx  Long-Stay multi-step form
  ├─ FormHeader                                 Progress indicator + back button
  ├─ Step1_PropertyEssence                      Title, description, building type
  ├─ Step2_LocationDetails                      Map, county, area, directions
  ├─ Step3_PropertySpecs                        Size, bedrooms, bathrooms, kitchen
  ├─ Step4_UtilitiesDeposits                    Water, elec, WiFi, security (Kenya)
  ├─ Step5_RentalPricing                        Rent, deposits, payment methods
  ├─ Step6_HouseRules                           Occupancy, pets, smoking, visitors
  ├─ Step7_MediaUploads                         Photos, video, floor plan
  └─ Step8_TermsConditions                      Lease docs, clauses, confirmation

app/(registration)/property-short-stay-form.tsx Short-Stay multi-step form
  ├─ FormHeader                                 Progress indicator + back button
  ├─ Step1_PropertyEssence                      Title, description, listing type
  ├─ Step2_Location                             Tourist zones, airport, transport
  ├─ Step3_GuestCapacity                        Max guests, bed configuration
  ├─ Step4_Amenities                            Detailed amenity checklist
  ├─ Step5_Pricing                              Nightly rates, discounts (NO deposits)
  ├─ Step6_Availability                         Calendar, min/max nights, check-in
  ├─ Step7_CancellationPolicy                   Flexible, Moderate, Firm, Strict
  ├─ Step8_HouseRules                           Guests, pets, parties, quiet hours
  ├─ Step9_MediaUploads                         Photos, video (high quality)
  └─ Step10_Terms                               House rules PDF, tourist reg, VAT

modules/property/                               Property feature module
  ├─ api.ts                                     API bindings
  ├─ hooks.ts                                   TanStack Query hooks
  ├─ types.ts                                   TypeScript interfaces
  ├─ store.ts                                   Zustand client state
  └─ index.ts                                   Public exports

components/property/                            Reusable property components
  ├─ PropertyFormHeader.tsx                     Header with progress
  ├─ PropertyFormProgress.tsx                   Step indicator
  ├─ AmenitySelector.tsx                        Toggle amenities (clickable)
  ├─ MediaUploader.tsx                          Photos + video uploader
  ├─ LocationPicker.tsx                         Map-based location
  ├─ UtilityDepositCard.tsx                     Kenya utility deposits
  ├─ PropertyTypeSelector.tsx                   Property type dropdown
  ├─ PricingCard.tsx                            Rental pricing inputs
  ├─ DocumentUploader.tsx                       PDF document uploads
  ├─ BedConfigurationInput.tsx                  Bed types per room
  ├─ AvailabilityCalendar.tsx                   Interactive calendar
  └─ CancellationPolicySelector.tsx             Policy selector
```

### Module Architecture

```typescript
modules/property/
  api.ts      → propertyApi object with methods (createProperty, getProperties, etc.)
  hooks.ts    → TanStack Query hooks (useProperties, useCreateProperty, etc.)
  types.ts    → TypeScript interfaces (Property, LongStayProperty, ShortStayProperty, etc.)
  store.ts    → Zustand store for client state (form drafts, current step)
  index.ts    → Re-exports all public APIs
```

### State Management Strategy

**Server State (TanStack Query)**:
- Property list (user's properties)
- Property details (single property data)
- Property documents (lease agreements, house rules)
- Property media (photos, videos)
- Admin properties list (pending verification)

**Client State (Zustand - Property Store)**:
- Long-Stay form draft (temporary form data)
- Short-Stay form draft (temporary form data)
- Current step (which step user is on)
- Stay type selection (long_stay or short_stay)
- Property type selection
- Media upload progress
- Document upload progress
- Last saved timestamp

**State Synchronization**:
- When property operations succeed, invalidate TanStack Query cache
- Auto-save form drafts to Zustand every 30 seconds
- Persist drafts to AsyncStorage for offline access
- Clear form state after successful submission

## Data Models

### TypeScript Interfaces

```typescript
// modules/property/types.ts

export type StayType = "long_stay" | "short_stay";

export type PropertyStatus = 
  | "draft" 
  | "pending_verification" 
  | "verified" 
  | "rejected" 
  | "active" 
  | "inactive";

export type LongStayPropertyType = 
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

export type ShortStayPropertyType = 
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

export type BuildingType = 
  | "single_unit" 
  | "multiple_units_single_building" 
  | "multiple_buildings" 
  | "part_of_larger_building";

export type KitchenType = 
  | "full_kitchen" 
  | "kitchenette" 
  | "cooking_area_only" 
  | "no_kitchen" 
  | "shared_kitchen";

export type FurnishingStatus = 
  | "fully_furnished" 
  | "semi_furnished" 
  | "unfurnished";

export type ParkingType = 
  | "one_dedicated" 
  | "two_plus_spaces" 
  | "street_only" 
  | "no_parking" 
  | "paid_parking";

export type WaterSource = 
  | "nairobi_water" 
  | "county_water" 
  | "borehole" 
  | "well" 
  | "tank_delivery" 
  | "other";

export type ElectricityMeterType = 
  | "prepaid_token" 
  | "postpaid_bill";

export type PaymentMethod = 
  | "mpesa" 
  | "bank_transfer" 
  | "cash" 
  | "cheque" 
  | "card";

export type RentPaymentSchedule = 
  | "monthly" 
  | "quarterly" 
  | "bi_annually" 
  | "annually" 
  | "negotiable";

export type ListingType = 
  | "entire_place" 
  | "private_room" 
  | "shared_room" 
  | "hotel_room";

export type CancellationPolicy = 
  | "flexible" 
  | "moderate" 
  | "firm" 
  | "strict" 
  | "super_strict" 
  | "custom";

// Base Property Interface
export interface BaseProperty {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  stayType: StayType;
  status: PropertyStatus;
  rejectionReason?: string;
  
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
  bathroomTypes: string[]; // ["shower", "bathtub", "separate_toilet", etc.]
  kitchenType: KitchenType;
  furnishingStatus: FurnishingStatus;
  furnishedItems?: string[];
  parkingType: ParkingType;
  paidParkingCost?: number;
  waterSources: WaterSource[];
  specialStructureType?: string;
  
  // Media
  photos: string[]; // URLs
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

// Long-Stay Specific
export interface LongStayProperty extends BaseProperty {
  stayType: "long_stay";
  propertyType: LongStayPropertyType;
  
  // Utilities & Deposits
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
  rentDueDate: number; // Day of month (1-31)
  gracePeriodDays: number;
  
  // Long-Stay Specific Rules
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

// Short-Stay Specific
export interface ShortStayProperty extends BaseProperty {
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
  
  // Pricing (No Deposits)
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
  sameDayBookingUntil?: string; // Time "18:00"
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
  
  // Short-Stay Specific Rules
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

export interface UtilityConfig {
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

export interface MpesaDetails {
  paybillNumber?: string;
  accountNumber?: string;
  tillNumber?: string;
}

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branch?: string;
}

export interface BedConfiguration {
  roomName: string; // "Bedroom 1", "Living Room"
  bedType: "single" | "double" | "queen" | "king" | "bunk";
  quantity: number;
}

export interface PeakSeasonRate {
  seasonName: string;
  startDate: string;
  endDate: string;
  nightlyRate: number;
}

export interface HolidayRate {
  holidayName: string;
  date: string;
  nightlyRate: number;
}

export interface AvailabilityDate {
  date: string;
  available: boolean;
}

// Form Payloads
export interface LongStayPropertyPayload {
  // All fields from LongStayProperty except id, userId, timestamps
  // Used for create/update operations
}

export interface ShortStayPropertyPayload {
  // All fields from ShortStayProperty except id, userId, timestamps
  // Used for create/update operations
}

// Admin
export interface PropertyApprovalPayload {
  approved: boolean;
  rejectionReason?: string;
}
```

## Components and Interfaces

### PropertyFormHeader Component

**Purpose**: Display progress indicator and navigation for multi-step forms

**Props**:
```typescript
interface PropertyFormHeaderProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  title: string;
}
```

**Features**:
- Progress bar showing current step / total steps
- Back button (white circle with left chevron)
- Step title
- Auto-save indicator with timestamp

**Styling**:
- Background: app-full-screen.webp
- Progress bar: Primary color (#20A6FD)
- Height: 15% of screen
- Back button: White circle with shadow

### PropertyFormProgress Component

**Purpose**: Visual progress indicator

**Props**:
```typescript
interface PropertyFormProgressProps {
  currentStep: number;
  totalSteps: number;
}
```

**Features**:
- Horizontal progress bar
- Step dots (filled for completed, outlined for upcoming)
- Animated transitions

**Styling**:
- Completed: Primary color
- Current: Primary color with pulse animation
- Upcoming: Light gray outline

### AmenitySelector Component

**Purpose**: Toggle amenities (NOT text input)

**Props**:
```typescript
interface AmenitySelectorProps {
  category: string;
  amenities: string[];
  selectedAmenities: string[];
  onToggle: (amenity: string) => void;
}
```

**Features**:
- Category header (bold)
- Grid of toggle buttons
- Selected state: Primary background, white text
- Unselected state: Light gray background, dark text
- Scale animation on tap (0.95)

**Styling**:
- Button: Rounded pill shape
- Selected: #20A6FD background
- Unselected: #E1E6E8 background
- Grid: 2 columns, 8px gap
- Padding: 12px horizontal, 8px vertical

### MediaUploader Component

**Purpose**: Upload photos and video with validation

**Props**:
```typescript
interface MediaUploaderProps {
  photos: string[];
  videoUrl?: string;
  onAddPhoto: (file: any) => void;
  onRemovePhoto: (index: number) => void;
  onAddVideo: (file: any) => void;
  onRemoveVideo: () => void;
  maxPhotos: number;
  maxPhotosSizeMB: number;
  maxVideoSizeMB: number;
  maxVideoDurationSeconds: number;
  errors?: string[];
}
```

**Features**:
- Photo grid (3 columns)
- Add photo button (dashed border)
- Photo thumbnails with delete button
- Video thumbnail with play icon and delete button
- Upload progress bars
- File size validation
- Duration validation for video
- Error messages

**Styling**:
- Grid gap: 8px
- Thumbnail size: 100x100
- Add button: Dashed border, #20A6FD color
- Delete button: Absolute top-right, danger color
- Progress bar: Primary color
