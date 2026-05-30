# Registration Module Field Inventory for Microservice Modeling
---

## 1) Long Stay Registration

### Core registration fields

| Field | Suggested Type | Required | Notes |
|---|---:|:---:|---|
| stay_type | nvarchar(20) | Yes | `long_stay` |
| property_type | nvarchar(50) | Yes | Single value for primary type |
| property_types | json | Yes | Multiple selected property types |
| title | nvarchar(255) | Yes | Generated from building name/type/estate in the UI |
| description | nvarchar(max) | Yes | Property description |
| acquisition_model | nvarchar(50) | Yes | `private_owner` or `affordable_housing_program` |
| property_condition | nvarchar(50) | Yes | `ready_to_move`, `brand_new`, `under_construction` |
| expected_delivery_date | date | Conditional | Required when property condition = `under_construction` |
| building_name | nvarchar(255) | Optional | Building/project name |
| building_type | nvarchar(80) | Yes | e.g. `single_unit`, `multiple_units_single_building` |
| total_units_in_building | int | Optional | Total units in the building |

### AHP-specific fields

| Field | Suggested Type | Required | Notes |
|---|---:|:---:|---|
| ahp_program_name | nvarchar(255) | Conditional | Required when acquisition model = `affordable_housing_program` |
| ahp_income_band | nvarchar(50) | Conditional | `low_cost`, `social_housing`, `middle_income` |
| ahp_units_available | int | Optional | Number of available units in the program |

### Location fields

| Field | Suggested Type | Required | Notes |
|---|---:|:---:|---|
| county | nvarchar(100) | Yes | County name |
| constituency | nvarchar(100) | Optional | Captured in form |
| ward | nvarchar(100) | Optional | Captured in form |
| estate | nvarchar(150) | Yes | Estate / neighborhood |
| nearest_landmark | nvarchar(150) | Yes | Nearby landmark |
| street_road | nvarchar(150) | Optional | Street/road name |
| google_maps_link | nvarchar(500) | Yes | Google Maps URL |
| latitude | decimal(10,7) | Optional | Present in payload/types |
| longitude | decimal(10,7) | Optional | Present in payload/types |
| directions_from_stage | nvarchar(max) | Optional | Directions from the nearest stage |
| accessibility_notes | nvarchar(max) | Optional | Accessibility notes |

### Property specification fields

| Field | Suggested Type | Required | Notes |
|---|---:|:---:|---|
| bedrooms | int | Yes | Number of bedrooms |
| bathrooms | int | Yes | Number of bathrooms |
| bathroom_types | json | Optional | Array of bathroom type labels |
| kitchen_type | nvarchar(50) | Yes | Enum from shared types |
| furnishing_status | nvarchar(50) | Yes | `fully_furnished`, `semi_furnished`, `unfurnished` |
| furnished_items | json | Optional | Array of furnished items |
| parking_type | nvarchar(50) | Yes | Enum from shared types |
| paid_parking_cost | decimal(12,2) | Optional | If parking is paid |
| water_available_24_7 | bit | Optional | Present in mobile draft payload |
| special_structure_type | nvarchar(100) | Optional | e.g. mabati house, container house |

### Utilities & deposits

| Field | Suggested Type | Required | Notes |
|---|---:|:---:|---|
| utility_deposits | json | Optional | Per-utility deposit configuration |
| utility_payment_responsibility | nvarchar(100) | Optional | Who pays utilities |
| security_deposit | decimal(12,2) | Optional | Additional deposit amount |

### Pricing fields

| Field | Suggested Type | Required | Notes |
|---|---:|:---:|---|
| monthly_rent | decimal(12,2) | Yes | Required for non-multi-unit or per unit pricing |
| monthly_deposit | decimal(12,2) | Yes/Conditional | Required in current mobile validation for single pricing path |
| unit_pricing | json | Optional | Per-property-type pricing for multi-unit buildings |
| service_charge | decimal(12,2) | Optional | Service charge |
| rent_negotiable | bit | Optional | Negotiable flag |
| minimum_lease_term | nvarchar(50) | Yes | e.g. `12 months` |
| rent_increase_policy | nvarchar(max) | Optional | Policy text |

### House rules

| Field | Suggested Type | Required | Notes |
|---|---:|:---:|---|
| max_persons | int | Yes | House rule capacity |
| pets_allowed | bit | Optional | House rules |
| smoking_allowed | nvarchar(50) | Optional | Enum/text policy |
| visitors_policy | nvarchar(max) | Optional | Optional rule text |
| quiet_hours | nvarchar(50) | Optional | Time range text |
| additional_rules | nvarchar(max) | Optional | Extra rules |

### Media

| Field | Suggested Type | Required | Notes |
|---|---:|:---:|---|
| photos | json | Yes | Array of photo URLs |
| video_url | nvarchar(500) | Conditional | Required by current mobile validation |
| unit_media | json | Optional | Per-unit media for multi-unit buildings |
| virtualTourUrl | nvarchar(500) | Optional | Present in payload |

### Owner metadata

| Field | Suggested Type | Required | Notes |
|---|---:|:---:|---|
| owner_id | nvarchar(100) | Yes | From authenticated user |
| owner_name | nvarchar(255) | Yes | From authenticated user |
| owner_phone | nvarchar(50) | Yes | From authenticated user |
| owner_email | nvarchar(255) | Yes | From authenticated user |
| status | nvarchar(50) | Yes | Defaults to `pending_verification` |

---

## 2) Short Stay Registration

### Core registration fields

| Field | Suggested Type | Required | Notes |
|---|---:|:---:|---|
| stay_type | nvarchar(20) | Yes | `short_stay` |
| property_type | nvarchar(50) | Yes | Listing type / property type |
| title | nvarchar(255) | Yes | Property title |
| description | nvarchar(max) | Yes | Property description |
| listing_type | nvarchar(50) | Yes | `entire_place`, `private_room`, `shared_room`, `hotel_room` |

### Location fields

| Field | Suggested Type | Required | Notes |
|---|---:|:---:|---|
| county | nvarchar(100) | Yes | County |
| constituency | nvarchar(100) | Optional | Form captures it |
| ward | nvarchar(100) | Optional | Form captures it |
| estate | nvarchar(150) | Yes | Estate/neighborhood |
| nearest_landmark | nvarchar(150) | Yes | Landmark |
| street_road | nvarchar(150) | Optional | Road/street |
| google_maps_link | nvarchar(500) | Yes | Google Maps URL |
| latitude | decimal(10,7) | Optional | Present in payload/types |
| longitude | decimal(10,7) | Optional | Present in payload/types |
| directions_from_stage | nvarchar(max) | Yes | Required by validation |
| nearest_tourist_attraction | nvarchar(150) | Optional | Short-stay / tourism-specific |
| nearest_airport | nvarchar(150) | Optional | Short-stay / tourism-specific |
| airport_distance_km | decimal(10,2) | Optional | Distance in km |
| airport_transfer_available | bit | Optional | Boolean |
| nearest_matatu | nvarchar(150) | Optional | Transport reference |

### Guest capacity fields

| Field | Suggested Type | Required | Notes |
|---|---:|:---:|---|
| max_adults | int | Yes | Guest capacity |
| max_children | int | Yes | Guest capacity |
| max_infants | int | Optional | Guest capacity |
| bed_configuration | json | Optional | Array of bed configs; can be normalized to child table |
| extra_sleeping_spaces | json | Optional | Array of strings |
| total_beds | int | Optional | Total beds |
| amenities | json | Optional | Detailed amenity groups |

### Pricing fields

| Field | Suggested Type | Required | Notes |
|---|---:|:---:|---|
| base_nightly_rate | decimal(12,2) | Yes | Base nightly rate |
| standard_occupancy | int | Optional | Standard occupancy |
| weekend_rate | decimal(12,2) | Optional | Weekend pricing |
| cleaning_fee | decimal(12,2) | Yes | Required by current validation |
| weekly_discount_percent | decimal(5,2) | Optional | Percentage discount |
| monthly_discount_percent | decimal(5,2) | Optional | Percentage discount |
| extra_guest_fee | decimal(12,2) | Optional | Per extra guest |
| min_nights_stay | int | Yes | Minimum stay |
| max_nights_stay | int | Optional | Maximum stay |

### Availability / booking fields

| Field | Suggested Type | Required | Notes |
|---|---:|:---:|---|
| check_in_time_from | time | Yes | Start of check-in window |
| check_in_time_to | time | Yes | End of check-in window |
| check_out_time | time | Yes | Check-out time |
| late_check_in_available | bit | Optional | Boolean |
| late_check_in_fee | decimal(12,2) | Optional | If late check-in is available |
| self_check_in_method | nvarchar(100) | Optional | Text/enum |
| instant_booking | bit | Optional | Boolean |
| cancellation_policy | nvarchar(50) | Yes | Enum from shared types |
| custom_cancellation_policy | nvarchar(max) | Optional | Required only for custom policy |
| cancellation_notes | nvarchar(max) | Optional | Extra policy notes |

### House rules

| Field | Suggested Type | Required | Notes |
|---|---:|:---:|---|
| max_persons | int | Yes | House rule capacity |
| children_allowed | bit | Optional | Present in mobile draft |
| pets_allowed | bit | Optional | Present in mobile draft |
| smoking_allowed | nvarchar(50) | Optional | Enum/text policy |
| parties_allowed | nvarchar(50) | Optional | Enum/text policy |
| quiet_hours_from | time | Optional | Quiet hours start |
| quiet_hours_to | time | Optional | Quiet hours end |
| guest_min_age | int | Optional | Minimum guest age |
| require_id_at_check_in | bit | Optional | Boolean |
| additional_rules | nvarchar(max) | Optional | Extra rules |

### Media

| Field | Suggested Type | Required | Notes |
|---|---:|:---:|---|
| photos | json | Yes | Array of photo URLs |
| video_url | nvarchar(500) | Optional | Optional media |

### Compliance / tourism fields

| Field | Suggested Type | Required | Notes |
|---|---:|:---:|---|
| tourist_registration_number | nvarchar(100) | Optional | Tourism registration details |
| vat_registered | bit | Optional | VAT flag |
| vat_pin | nvarchar(50) | Optional | VAT PIN if registered |

### Owner metadata

| Field | Suggested Type | Required | Notes |
|---|---:|:---:|---|
| owner_id | nvarchar(100) | Yes | From authenticated user |
| owner_name | nvarchar(255) | Yes | From authenticated user |
| owner_phone | nvarchar(50) | Yes | From authenticated user |
| owner_email | nvarchar(255) | Yes | From authenticated user |
| status | nvarchar(50) | Yes | Defaults to `pending_verification` |

---

## 3) Vehicle Registration

### Driver / identity fields

| Field | Suggested Type | Required | Notes |
|---|---:|:---:|---|
| driver_name | nvarchar(255) | Yes | Full legal name |
| date_of_birth | date | Yes | Stored as ISO date |
| gender | nvarchar(20) | Yes | `male`, `female`, `other` |
| national_id | nvarchar(50) | Yes | National ID number |

### Vehicle fields

| Field | Suggested Type | Required | Notes |
|---|---:|:---:|---|
| vehicle_type | nvarchar(20) | Yes | `truck`, `mini_truck`, `pickup` |
| plate_number | nvarchar(50) | Yes | Vehicle plate |
| capacity | decimal(12,2) | Yes | Numeric capacity |
| capacity_unit | nvarchar(20) | Yes | `kg` or `cubic_meters` |

### Documents

| Field | Suggested Type | Required | Notes |
|---|---:|:---:|---|
| insurance_document_url | nvarchar(500) | Yes | Store uploaded file URL |
| insurance_document_type | nvarchar(50) | Yes | `image` or `pdf` metadata |
| insurance_expiration_date | date | Optional | Expiry date |
| driving_license_url | nvarchar(500) | Yes | Store uploaded file URL |
| driving_license_type | nvarchar(50) | Yes | `image` or `pdf` metadata |
| inspection_certificate_url | nvarchar(500) | Yes | Store uploaded file URL |
| inspection_certificate_type | nvarchar(50) | Yes | `image` or `pdf` metadata |
| inspection_expiration_date | date | Optional | Expiry date |

### Photos

| Field | Suggested Type | Required | Notes |
|---|---:|:---:|---|
| photos | json | Yes | Array of vehicle photo URLs |

### Payment fields

| Field | Suggested Type | Required | Notes |
|---|---:|:---:|---|
| payment_method | nvarchar(20) | Yes | `mpesa`, `bank_transfer`, `cash` |
| mpesa_number | nvarchar(20) | Conditional | Required when payment method = `mpesa` |
| bank_name | nvarchar(150) | Conditional | Required when payment method = `bank_transfer` |
| account_number | nvarchar(100) | Conditional | Required when payment method = `bank_transfer` |
| account_name | nvarchar(255) | Conditional | Required when payment method = `bank_transfer` |

### Service coverage / status

| Field | Suggested Type | Required | Notes |
|---|---:|:---:|---|
| service_zones | json | Yes | Array of city/zone names |
| status | nvarchar(50) | Yes | From vehicle domain model |
| verification_status | nvarchar(50) | Yes | Usually starts as `pending_verification` |
| is_active | bit | Yes | Active vehicle marker |

### Owner metadata

| Field | Suggested Type | Required | Notes |
|---|---:|:---:|---|
| driver_id | nvarchar(100) | Yes | Authenticated user ID |
| phone | nvarchar(50) | Optional | Present in vehicle domain type |
| email | nvarchar(255) | Optional | Present in vehicle domain type |

---

## 4) Recommended normalization for the microservice

### Property registration

Consider these core tables:

1. **properties**
   - id, stay_type, title, description, property_type, status, owner fields
   - shared location and property metadata
2. **property_location**
   - county, constituency, ward, estate, landmark, coordinates, maps link
3. **property_specifications**
   - bedrooms, bathrooms, kitchen, furnishing, parking, water, structure
4. **property_pricing**
   - rent, deposit, service charge, discounts, lease terms
5. **property_rules**
   - max persons, pets, smoking, visitors, quiet hours, extra rules
6. **property_media**
   - photo/video URLs, with one-to-many rows if needed
7. **property_units** (only for multi-unit long-stay buildings)
   - unit-level pricing/media for each selected property type

### Vehicle registration

Consider these core tables:

1. **vehicles**
   - driver info, vehicle info, payment method, status, verification state
2. **vehicle_documents**
   - insurance, driving license, inspection certificate metadata and URLs
3. **vehicle_photos**
   - photo URLs with ordering metadata
4. **vehicle_service_zones**
   - one row per city/zone

---

## 5) Quick implementation hints

- Use **`nvarchar`** for all human-entered strings.
- Use **`date`** for ISO dates and **`time`** for clock times.
- Use **`decimal(12,2)`** for currency and measured numeric values that can include decimals.
- Use **`bit`** for booleans.
- Use **`json`** for arrays that do not need relational querying initially.
- Keep enums in the database if you want strong validation, or normalize them into lookup tables if the set may grow.
