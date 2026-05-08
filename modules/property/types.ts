/**
 * Property module — TypeScript type definitions.
 * All property-related interfaces and types.
 */

export type StayType = "long_stay" | "short_stay";

export type PropertyStatus = 
  | "draft" 
  | "pending_verification" 
  | "verified" 
  | "rejected" 
  | "active" 
  | "inactive";

export type PropertyCondition = 
  | "ready_to_move" 
  | "brand_new" 
  | "under_construction";

export type AcquisitionModel = 
  | "private_owner" 
  | "affordable_housing_program";

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

// ---------------------------------------------------------------------------
// Utility & Supporting Interfaces
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Base Property Interface
// ---------------------------------------------------------------------------

export interface BaseProperty {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  stayType: StayType;
  status: PropertyStatus;
  rejectionReason?: string;
  
  // Property Condition & Acquisition Model
  propertyCondition: PropertyCondition; // ready_to_move | brand_new | under_construction
  expectedDeliveryDate?: string; // ISO date for under_construction
  acquisitionModel: AcquisitionModel; // private_owner | affordable_housing_program
  
  // Affordable Housing Program (AHP) - Only if acquisitionModel === "affordable_housing_program"
  ahpProgramId?: string;
  ahpProgramName?: string; // e.g., "Rongai Housing Project"
  ahpIncomeBand?: "low_cost" | "social_housing" | "middle_income"; // <20k, <50k, <100k KES
  ahpEligibilityCriteria?: string[]; // e.g., ["Kenyan citizen", "First-time buyer", "Income < 50,000 KES"]
  ahpApplicationDeadline?: string; // ISO date
  ahpAllocationMethod?: "lottery" | "first_come" | "priority_based";
  ahpUnitsAvailable?: number; // Total units in this AHP project
  
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

// ---------------------------------------------------------------------------
// Long-Stay Property
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Short-Stay Property
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Union Type for All Properties
// ---------------------------------------------------------------------------

export type Property = LongStayProperty | ShortStayProperty;

// ---------------------------------------------------------------------------
// Form Payloads (for create/update operations)
// ---------------------------------------------------------------------------

export type LongStayPropertyPayload = Omit<
  LongStayProperty,
  "id" | "userId" | "userName" | "userEmail" | "userPhone" | "createdAt" | "updatedAt" | "deletedAt"
>;

export type ShortStayPropertyPayload = Omit<
  ShortStayProperty,
  "id" | "userId" | "userName" | "userEmail" | "userPhone" | "createdAt" | "updatedAt" | "deletedAt"
>;

export type PropertyPayload = LongStayPropertyPayload | ShortStayPropertyPayload;

// ---------------------------------------------------------------------------
// Admin Operations
// ---------------------------------------------------------------------------

export interface PropertyApprovalPayload {
  approved: boolean;
  rejectionReason?: string;
}

// ---------------------------------------------------------------------------
// List Response (for pagination)
// ---------------------------------------------------------------------------

export interface PropertyListResponse {
  properties: Property[];
  total: number;
  page: number;
  pageSize: number;
}

// ---------------------------------------------------------------------------
// Backwards compatibility exports (for types/index.ts)
// ---------------------------------------------------------------------------

export type PropertyCategory = StayType;
export { PropertyStatus };
