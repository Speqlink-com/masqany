# Long Stay Property Form Models

## Purpose

This document converts the current long-stay property registration flow into database-friendly models for the property microservice.

## Scope

Analyzed source files:

- `app/(registration)/property-registration.tsx`
- `app/(registration)/property-long-stay-form.tsx`
- `modules/property/store.ts`
- `modules/property/types.ts`

### Important boundary

- **Do not include user/account schemas** in this microservice design.
- `ownerId`, `ownerName`, `ownerPhone`, and `ownerEmail` are referenced by the form submission payload, but they belong to the calling auth/user service and should be treated as external identifiers if needed.
- `stayType`, `propertyType`, and `totalSteps` are flow state values; only `stayType` and `propertyType` are relevant to persistence.

## Registration flow summary

The registration UI is split into two parts:

1. **Property registration landing screen**
   - Selects `stayType` (`long_stay` or `short_stay`)
   - For short stay, selects `propertyType`
   - Sets the number of steps in the client store

2. **Long stay multi-step form**
   - Captures the actual property data to persist
   - Supports single-unit and multi-unit buildings
   - Supports AHP (Affordable Housing Program) metadata
   - Supports nested utility, pricing, and media data per unit when applicable

## Recommended persisted model

Use a primary **`properties`** collection/table for shared listing fields, and a long-stay specific nested structure or companion detail table for long-stay-only data.

If your microservice uses a relational database, the same fields can be split into multiple tables. If it uses a document database, the nested objects can remain embedded.

---

## 1) Primary property model

### Suggested entity name

`Property` or `PropertyListing`

### Core fields

These fields represent the common registration payload and should exist on every property record.

| Field | Type | Required | Notes |
|---|---:|---:|---|
| `id` | string/uuid | yes | Primary key |
| `stayType` | `long_stay` | yes | Fixed for this model |
| `propertyType` | enum | yes | One selected type for the record; see note below for multi-unit buildings |
| `title` | string | yes | Auto-generated from building name, property types, and estate |
| `description` | string | yes | Short property summary |
| `status` | enum | yes | Form uses `pending_verification` on submit |
| `createdAt` | datetime | yes | Audit field |
| `updatedAt` | datetime | yes | Audit field |
| `deletedAt` | datetime/null | no | Soft delete support |

### Property type enum values

From the current UI and property types, long-stay property types include:

- `single_room`
- `bedsitter`
- `1_bedroom`
- `2_bedroom`
- `3_bedroom`
- `4plus_bedroom`
- `hostel_bed_space`
- `hostel_private_room`
- `student_hostel`
- `office_space`
- `shop_retail`
- `warehouse`

### Multi-unit note

The form allows multiple property types to be selected for a single building. In storage, this can be represented as either:

- `propertyType` = primary/default type, plus
- `propertyTypes[]` = full list of unit types

If you prefer a normalized schema, keep `propertyType` on the main property row and move the full list into a child table/collection such as `property_unit_types`.

---

## 2) Long-stay property details model

### Suggested entity name

`LongStayPropertyDetails`

This can be a one-to-one detail record or an embedded object inside the main property record.

### A. Property condition & acquisition

| Field | Type | Required | Notes |
|---|---:|---:|---|
| `propertyCondition` | enum | yes | `ready_to_move`, `brand_new`, `under_construction` |
| `expectedDeliveryDate` | date/string | conditional | Required when `propertyCondition = under_construction` |
| `acquisitionModel` | enum | yes | `private_owner`, `affordable_housing_program` |
| `ahpProgramName` | string | conditional | Required for AHP |
| `ahpIncomeBand` | enum | conditional | `low_cost`, `social_housing`, `middle_income` |
| `ahpEligibilityCriteria` | string[] | no | Draft/store field, not currently surfaced in submit payload |
| `ahpApplicationDeadline` | date/string | no | Draft/store field |
| `ahpAllocationMethod` | enum | no | `lottery`, `first_come`, `priority_based` |
| `ahpUnitsAvailable` | number | conditional | AHP-specific |

### B. Building identity

| Field | Type | Required | Notes |
|---|---:|---:|---|
| `buildingName` | string | no | Optional but captured in the form |
| `buildingType` | enum/string | yes | Current UI uses `single_unit` or `multiple_units_single_building` |
| `totalUnitsInBuilding` | number | conditional | Relevant for multi-unit buildings |

### C. Location details

| Field | Type | Required | Notes |
|---|---:|---:|---|
| `county` | string | yes | Kenya county |
| `constituency` | string | no | Optional in current validation |
| `ward` | string | no | Optional in current validation |
| `estate` | string | yes | Required by validation |
| `nearestLandmark` | string | yes | Required by validation |
| `streetRoad` | string | no | Optional |
| `plotBuildingNumber` | string | no | Optional |
| `floorNumber` | string | no | Optional |
| `unitNumber` | string | no | Optional |
| `googleMapsLink` | string | yes | Required by validation |
| `latitude` | number | no | Optional |
| `longitude` | number | no | Optional |
| `directionsFromStage` | string | no | Optional |
| `accessibilityNotes` | string | no | Optional |

### D. Property specifications

| Field | Type | Required | Notes |
|---|---:|---:|---|
| `propertySize` | number | no | Area measurement |
| `propertySizeUnit` | enum | no | `sqft`, `sqm`, `acres` |
| `bedrooms` | number | yes | Required by validation |
| `bathrooms` | number | yes | Required by validation |
| `bathroomTypes` | string[] | no | Optional |
| `kitchenType` | string | yes | Required by validation |
| `furnishingStatus` | string | yes | Required by validation |
| `furnishedItems` | string[] | no | Optional |
| `parkingType` | string | yes | Required by validation |
| `paidParkingCost` | number | no | Optional |
| `waterSources` | string[] | no | Present in draft/store only |
| `waterAvailable24_7` | boolean | no | Optional |
| `specialStructureType` | string | no | Optional |

### E. Utilities & deposits

| Field | Type | Required | Notes |
|---|---:|---:|---|
| `utilityDeposits` | object map | no | Deposit rules keyed by utility name |
| `utilityPaymentResponsibility` | enum | no | `tenant_pays_all`, `landlord_pays_all`, `shared` |
| `securityDeposit` | number | no | Global security deposit amount |
| `utilities` | object | no | Utility configuration block |

#### Utility deposit structure

```ts
utilityDeposits: {
  [key: string]: {
    amount?: number;
    refundable?: boolean;
  }
}
```

Recommended utility keys:

- `water`
- `electricity`
- `wifi`
- `security`
- `garbage`
- `houseMaintenance`

#### Utility config structure

The current code treats these as flexible configs:

- `utilities.water`
- `utilities.electricity`
- `utilities.wifi`
- `utilities.security`
- `utilities.garbage`
- `utilities.houseMaintenance`

For the database, define a proper `UtilityConfig` structure instead of `any` if you want strict typing.

### F. Rental pricing

| Field | Type | Required | Notes |
|---|---:|---:|---|
| `monthlyRent` | number | yes | Required by validation when not multi-unit |
| `monthlyDeposit` | number | yes | Required by validation when not multi-unit |
| `unitPricing` | object map | conditional | Used for multi-unit buildings |
| `serviceCharge` | number | no | Optional |
| `rentNegotiable` | boolean | no | Optional |
| `minimumLeaseTerm` | enum | no | `6_months`, `1_year`, `2_years`, `flexible` |
| `rentIncreasePolicy` | string | no | Optional |
| `rentPaymentSchedule` | string/enum | no | Present in types/model; useful for schedule text or enum |
| `securityDepositMonths` | number | no | Optional |
| `securityDepositFixed` | number | no | Optional |
| `paymentMethods` | string[] | no | Optional |
| `mpesaDetails` | object | no | External payment config |
| `bankDetails` | object | no | External payment config |
| `rentDueDate` | number | no | Day of month (1–31) |
| `gracePeriodDays` | number | no | Optional |

#### Unit pricing structure

```ts
unitPricing: Record<string, {
  monthlyRent?: number;
  monthlyDeposit?: number;
}>
```

Recommended use:

- Key by the selected unit type, e.g. `bedsitter`, `1_bedroom`
- Store rent and deposit per unit type in multi-unit buildings

### G. House rules

| Field | Type | Required | Notes |
|---|---:|---:|---|
| `maxPersons` | number | yes | Required by validation |
| `childrenAllowed` | boolean | no | Optional |
| `childrenAgeRestriction` | number | no | Optional |
| `petsAllowed` | enum | no | `allowed`, `not_allowed`, `negotiable` |
| `petRestrictions` | string | no | Optional |
| `smokingAllowed` | enum | no | `allowed`, `not_allowed`, `outdoor_only` |
| `visitorsPolicy` | enum | no | `allowed_anytime`, `daytime_only`, `prior_approval`, `not_allowed` |
| `quietHours` | string | no | Optional |
| `preferredTenantType` | string | no | Optional |
| `additionalRules` | string | no | Optional |

### H. Media uploads

| Field | Type | Required | Notes |
|---|---:|---:|---|
| `photos` | string[] | yes | Required by validation (minimum 3 in UI) |
| `videoUrl` | string | yes | Required by validation |
| `unitMedia` | object map | conditional | Per-unit media for multi-unit buildings |
| `virtualTourUrl` | string | no | Optional |
| `floorPlanUrl` | string | no | Optional |

#### Unit media structure

```ts
unitMedia: Record<string, {
  photos?: string[];
  videoUrl?: string;
}>
```

Recommended use:

- Key by unit type when a building contains multiple unit categories
- Enforce minimum media rules per key if required by business logic

### I. Terms & conditions

| Field | Type | Required | Notes |
|---|---:|---:|---|
| `termsAccepted` | boolean | yes | Required to submit |
| `leaseAgreementUrl` | string | no | Present in draft/store |
| `additionalTermsUrl` | string | no | Optional |
| `specialClauses` | string | no | Optional |
| `leaseDuration` | string | no | Optional |
| `tenantTerminationNoticeDays` | number | no | Optional |
| `ownerTerminationNoticeDays` | number | no | Optional |
| `renewalTerms` | string | no | Optional |
| `disputeResolutionMethod` | string | no | Optional |

---

## 3) Fields present in the current form/store but not yet reflected in the final submit payload

These fields exist in `modules/property/store.ts` and may be worth supporting in the database if the product needs them:

- `title`
- `buildingName`
- `totalUnitsInBuilding`
- `plotBuildingNumber`
- `floorNumber`
- `unitNumber`
- `propertySize`
- `propertySizeUnit`
- `bathroomTypes`
- `furnishedItems`
- `waterSources`
- `utilityDeposits`
- `utilities`
- `serviceCharge`
- `rentNegotiable`
- `securityDepositMonths`
- `securityDepositFixed`
- `paymentMethods`
- `mpesaDetails`
- `bankDetails`
- `rentDueDate`
- `gracePeriodDays`
- `childrenAllowed`
- `childrenAgeRestriction`
- `petsAllowed`
- `petRestrictions`
- `smokingAllowed`
- `visitorsPolicy`
- `quietHours`
- `preferredTenantType`
- `additionalRules`
- `virtualTourUrl`
- `floorPlanUrl`
- `leaseAgreementUrl`
- `additionalTermsUrl`
- `specialClauses`
- `leaseDuration`
- `tenantTerminationNoticeDays`
- `ownerTerminationNoticeDays`
- `renewalTerms`
- `disputeResolutionMethod`

## 4) Fields that are UI-only and should not be persisted

From `property-registration.tsx` and the store, these are workflow state only:

- `selectedStayType`
- `selectedPropertyType` (on the landing screen)
- `currentStep`
- `totalSteps`
- upload progress values (`photoUploadProgress`, `videoUploadProgress`, `documentUploadProgress`)
- `isSaving`
- `lastSavedAt` unless you want persistence metadata

## 5) Suggested normalized database shape

### Option A: Single document / JSON model

Store all long-stay data in one document with nested objects for:

- utilities
- utilityDeposits
- unitPricing
- unitMedia

This is the simplest option and matches the form structure closely.

### Option B: Relational model

If you prefer normalization, split into:

1. `properties`
   - shared listing fields
   - stay type
   - title/description/status

2. `long_stay_properties`
   - long-stay specific fields
   - property condition/acquisition
   - building identity
   - location/specifications/pricing/rules/terms

3. `property_units`
   - one row per selected unit type or physical unit
   - link to pricing and media records

4. `property_utility_config`
   - utilities and deposit configuration

5. `property_media`
   - gallery photos, video, floor plan, virtual tour

For this microservice, Option A is closer to the current client implementation, while Option B offers better querying and validation.

## 6) Minimum long-stay submission contract

At a minimum, a valid long-stay submission should include:

- `stayType`
- `propertyType`
- `title`
- `description`
- `status`
- `propertyCondition`
- `acquisitionModel`
- `buildingType`
- `county`
- `estate`
- `nearestLandmark`
- `googleMapsLink`
- `bedrooms`
- `bathrooms`
- `kitchenType`
- `furnishingStatus`
- `parkingType`
- `monthlyRent`
- `monthlyDeposit` or per-unit pricing
- `maxPersons`
- `photos`
- `videoUrl`
- `termsAccepted`

### Conditional requirements

- If `propertyCondition = under_construction`, require `expectedDeliveryDate`
- If `acquisitionModel = affordable_housing_program`, require:
  - `ahpProgramName`
  - `ahpIncomeBand`
  - `ahpUnitsAvailable`
- If `buildingType = multiple_units_single_building`, require:
  - `totalUnitsInBuilding`
  - `unitPricing` by selected unit type
  - `unitMedia` by selected unit type

## 7) Notes for implementation

- Replace `any` fields in the TypeScript models with explicit interfaces before backend implementation.
- Keep property ownership references external to this service.
- Consider validating the submit payload against a schema object before persistence.
- If the short-stay form is added later, keep it as a separate model family under the same `properties` root with a `stayType` discriminator.
