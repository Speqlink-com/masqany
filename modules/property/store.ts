/**
 * Property store — Zustand slice for client-side property UI state.
 *
 * Owns: form drafts, current step, stay type selection, property type, upload progress, last saved timestamp.
 * Does NOT own: server data like property listings (TanStack Query owns those).
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { LongStayPropertyType, ShortStayPropertyType, StayType } from "./types";

// ---------------------------------------------------------------------------
// Form Draft Types
// ---------------------------------------------------------------------------

export interface LongStayFormDraft {
  // Property Condition & Acquisition
  propertyCondition?: "ready_to_move" | "brand_new" | "under_construction";
  expectedDeliveryDate?: string;
  acquisitionModel?: "private_owner" | "affordable_housing_program";
  
  // AHP specific
  ahpProgramName?: string;
  ahpIncomeBand?: "low_cost" | "social_housing" | "middle_income";
  ahpEligibilityCriteria?: string[];
  ahpApplicationDeadline?: string;
  ahpAllocationMethod?: "lottery" | "first_come" | "priority_based";
  ahpUnitsAvailable?: number;
  
  // Step 1: Property Essence
  title?: string;
  description?: string;
  buildingName?: string;
  buildingType?: string;
  totalUnitsInBuilding?: number;

  // Step 2: Location Details
  county?: string;
  constituency?: string;
  ward?: string;
  estate?: string;
  nearestLandmark?: string;
  streetRoad?: string;
  plotBuildingNumber?: string;
  floorNumber?: string;
  unitNumber?: string;
  googleMapsLink?: string;
  latitude?: number;
  longitude?: number;
  directionsFromStage?: string;
  accessibilityNotes?: string;

  // Step 3: Property Specifications
  propertySize?: number;
  propertySizeUnit?: "sqft" | "sqm" | "acres";
  bedrooms?: number;
  bathrooms?: number;
  bathroomTypes?: string[];
  kitchenType?: string;
  furnishingStatus?: string;
  furnishedItems?: string[];
  parkingType?: string;
  paidParkingCost?: number;
  waterSources?: string[];
  specialStructureType?: string;

  // Step 4: Utilities & Deposits
  utilityDeposits?: {
    [key: string]: {
      amount?: number;
      refundable?: boolean;
    };
  };
  utilityPaymentResponsibility?: "tenant_pays_all" | "landlord_pays_all" | "shared";
  securityDeposit?: number;
  utilities?: {
    water?: any;
    electricity?: any;
    wifi?: any;
    security?: any;
    garbage?: any;
    houseMaintenance?: any;
  };

  // Step 5: Rental Pricing
  monthlyRent?: number;
  serviceCharge?: number;
  rentNegotiable?: boolean;
  minimumLeaseTerm?: "6_months" | "1_year" | "2_years" | "flexible";
  rentIncreasePolicy?: string;
  rentPaymentSchedule?: string;
  securityDepositMonths?: number;
  securityDepositFixed?: number;
  paymentMethods?: string[];
  mpesaDetails?: any;
  bankDetails?: any;
  rentDueDate?: number;
  gracePeriodDays?: number;

  // Step 6: House Rules
  maxPersons?: number;
  childrenAllowed?: boolean;
  childrenAgeRestriction?: number;
  petsAllowed?: "allowed" | "not_allowed" | "negotiable";
  petRestrictions?: string;
  smokingAllowed?: "allowed" | "not_allowed" | "outdoor_only";
  visitorsPolicy?: "allowed_anytime" | "daytime_only" | "prior_approval" | "not_allowed";
  quietHours?: string;
  preferredTenantType?: string;
  additionalRules?: string;

  // Step 7: Media Uploads
  photos?: string[];
  videoUrl?: string;
  virtualTourUrl?: string;
  floorPlanUrl?: string;

  // Step 8: Terms & Conditions
  termsAccepted?: boolean;
  leaseAgreementUrl?: string;
  additionalTermsUrl?: string;
  specialClauses?: string;
  leaseDuration?: string;
  tenantTerminationNoticeDays?: number;
  ownerTerminationNoticeDays?: number;
  renewalTerms?: string;
  disputeResolutionMethod?: string;
}

export interface ShortStayFormDraft {
  // Step 1: Property Essence
  title?: string;
  description?: string;
  listingType?: string;

  // Step 2: Location Details
  county?: string;
  constituency?: string;
  ward?: string;
  estate?: string;
  nearestLandmark?: string;
  streetRoad?: string;
  plotBuildingNumber?: string;
  floorNumber?: string;
  unitNumber?: string;
  googleMapsLink?: string;
  latitude?: number;
  longitude?: number;
  directionsFromStage?: string;
  nearestTouristAttraction?: string;
  nearestAirport?: string;
  airportDistanceKm?: number;
  airportTransferAvailable?: boolean;
  nearestMatatu?: string;

  // Step 3: Guest Capacity
  maxAdults?: number;
  maxChildren?: number;
  maxInfants?: number;
  bedConfiguration?: any[];
  extraSleepingSpaces?: string[];
  totalBeds?: number;

  // Step 4: Amenities
  amenities?: {
    essentials?: string[];
    kitchen?: string[];
    bathroom?: string[];
    entertainment?: string[];
    outdoor?: string[];
    family?: string[];
    safety?: string[];
  };

  // Step 5: Pricing
  baseNightlyRate?: number;
  standardOccupancy?: number;
  weekendRate?: number;
  peakSeasonRates?: any[];
  holidayRates?: any[];
  extraGuestFee?: number;
  extraGuestFreeUpTo?: number;
  cleaningFee?: number;
  weeklyDiscountPercent?: number;
  monthlyDiscountPercent?: number;
  earlyBirdDiscountPercent?: number;
  earlyBirdDaysAdvance?: number;
  lastMinuteDiscountPercent?: number;
  lastMinuteDaysWithin?: number;

  // Step 6: Availability & Booking
  availabilityCalendar?: any[];
  minNightsStay?: number;
  maxNightsStay?: number;
  advanceNoticeDays?: number;
  sameDayBookingUntil?: string;
  checkInTimeFrom?: string;
  checkInTimeTo?: string;
  lateCheckInAvailable?: boolean;
  lateCheckInFee?: number;
  selfCheckInMethod?: string;
  checkOutTime?: string;
  lateCheckOutAvailable?: boolean;
  lateCheckOutFeePerHour?: number;
  instantBooking?: boolean;

  // Step 7: Cancellation Policy
  cancellationPolicy?: string;
  customCancellationPolicy?: string;
  cancellationNotes?: string;

  // Step 8: House Rules
  maxPersons?: number;
  childrenAllowed?: boolean;
  childrenAgeRestriction?: number;
  petsAllowed?: boolean;
  petRestrictions?: string;
  smokingAllowed?: string;
  partiesAllowed?: string;
  partiesFee?: number;
  partiesMaxGuests?: number;
  quietHoursFrom?: string;
  quietHoursTo?: string;
  commercialPhotoAllowed?: string;
  commercialPhotoFee?: number;
  guestMinAge?: number;
  requireIdAtCheckIn?: boolean;
  requireSignedWaiver?: boolean;
  additionalRules?: string;

  // Step 9: Media Uploads
  photos?: string[];
  videoUrl?: string;

  // Step 10: Terms & Conditions
  houseRulesUrl?: string;
  specialContractsUrl?: string;
  touristRegistrationNumber?: string;
  vatRegistered?: boolean;
  vatPin?: string;
}

// ---------------------------------------------------------------------------
// Property Store State
// ---------------------------------------------------------------------------

interface PropertyState {
  // Initial screen selections
  stayType: StayType | null;
  propertyType: LongStayPropertyType | ShortStayPropertyType | null;

  // Form drafts
  longStayDraft: LongStayFormDraft;
  shortStayDraft: ShortStayFormDraft;

  // Current step tracking
  currentStep: number;
  totalSteps: number;

  // Upload progress
  photoUploadProgress: number;
  videoUploadProgress: number;
  documentUploadProgress: number;

  // Auto-save tracking
  lastSavedAt: string | null;
  isSaving: boolean;

  // Actions
  setStayType: (stayType: StayType) => void;
  setPropertyType: (propertyType: LongStayPropertyType | ShortStayPropertyType) => void;
  setCurrentStep: (step: number) => void;
  setTotalSteps: (total: number) => void;

  updateLongStayDraft: (data: Partial<LongStayFormDraft>) => void;
  updateShortStayDraft: (data: Partial<ShortStayFormDraft>) => void;

  clearLongStayDraft: () => void;
  clearShortStayDraft: () => void;
  clearAllDrafts: () => void;

  setPhotoUploadProgress: (progress: number) => void;
  setVideoUploadProgress: (progress: number) => void;
  setDocumentUploadProgress: (progress: number) => void;

  markSaved: () => void;
  setIsSaving: (saving: boolean) => void;
}

// ---------------------------------------------------------------------------
// Property Store
// ---------------------------------------------------------------------------

export const usePropertyStore = create<PropertyState>()(
  persist(
    (set) => ({
      // Initial state
      stayType: null,
      propertyType: null,
      longStayDraft: {},
      shortStayDraft: {},
      currentStep: 1,
      totalSteps: 8,
      photoUploadProgress: 0,
      videoUploadProgress: 0,
      documentUploadProgress: 0,
      lastSavedAt: null,
      isSaving: false,

      // Actions
      setStayType: (stayType) => set({ stayType }),
      setPropertyType: (propertyType) => set({ propertyType }),
      setCurrentStep: (step) => set({ currentStep: step }),
      setTotalSteps: (total) => set({ totalSteps: total }),

      updateLongStayDraft: (data) =>
        set((state) => ({
          longStayDraft: { ...state.longStayDraft, ...data },
        })),

      updateShortStayDraft: (data) =>
        set((state) => ({
          shortStayDraft: { ...state.shortStayDraft, ...data },
        })),

      clearLongStayDraft: () => set({ longStayDraft: {}, currentStep: 1 }),
      clearShortStayDraft: () => set({ shortStayDraft: {}, currentStep: 1 }),
      clearAllDrafts: () =>
        set({
          longStayDraft: {},
          shortStayDraft: {},
          currentStep: 1,
          stayType: null,
          propertyType: null,
          lastSavedAt: null,
        }),

      setPhotoUploadProgress: (progress) => set({ photoUploadProgress: progress }),
      setVideoUploadProgress: (progress) => set({ videoUploadProgress: progress }),
      setDocumentUploadProgress: (progress) =>
        set({ documentUploadProgress: progress }),

      markSaved: () =>
        set({ lastSavedAt: new Date().toISOString(), isSaving: false }),
      setIsSaving: (saving) => set({ isSaving: saving }),
    }),
    {
      name: "property-store",
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist drafts and selections, not upload progress
      partialize: (state) => ({
        stayType: state.stayType,
        propertyType: state.propertyType,
        longStayDraft: state.longStayDraft,
        shortStayDraft: state.shortStayDraft,
        currentStep: state.currentStep,
        totalSteps: state.totalSteps,
        lastSavedAt: state.lastSavedAt,
      }),
    }
  )
);
