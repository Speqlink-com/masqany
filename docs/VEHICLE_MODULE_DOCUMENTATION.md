# Vehicle Management Module Documentation

## Overview

The Vehicle Management Module provides comprehensive vehicle registration, management, and verification functionality for relocation drivers in the Masqany mobile app. It includes driver registration, vehicle management, document tracking, admin verification workflows, and role-based access control.

**Module Location**: `modules/vehicle/`  
**Screens Location**: `app/(registration)/`, `app/(vehicle)/`, `app/(admin)/`  
**Components Location**: `components/vehicle/`

---

## Architecture

### Module Structure

```
modules/vehicle/
├── types.ts          # TypeScript interfaces and types
├── api.ts            # API client methods
├── hooks.ts          # TanStack Query hooks (public API)
├── store.ts          # Zustand client state store
├── validation.ts     # Form validation logic
└── index.ts          # Barrel exports

app/(registration)/
├── _layout.tsx                # Registration group layout
├── vehicle-prompt.tsx         # Initial prompt screen
└── vehicle-registration.tsx   # Complete registration form

app/(vehicle)/
├── _layout.tsx                # Vehicle group layout
├── vehicle-list.tsx           # Driver's vehicles list
├── vehicle-details.tsx        # Vehicle details view
├── edit-vehicle.tsx           # Edit vehicle form
└── vehicle-history.tsx        # Vehicle history timeline

app/(admin)/
├── _layout.tsx                # Admin group layout
├── admin-vehicles.tsx         # Pending vehicles list
└── admin-vehicle-review.tsx   # Approve/reject interface

components/vehicle/
├── VehicleCard.tsx            # Vehicle list item card
├── VehicleStatusBadge.tsx     # Status indicator badge
├── VerificationBadge.tsx      # Verification status badge
├── VehicleTypeBadge.tsx       # Vehicle type badge
├── DocumentCard.tsx           # Document display card
├── PhotoGrid.tsx              # Photo gallery grid
├── PhotoViewer.tsx            # Full-screen photo viewer
├── DocumentViewer.tsx         # Full-screen document viewer
├── ServiceZoneChips.tsx       # Service zones display
├── PaymentMethodCard.tsx      # Payment info display
├── VehicleHistoryTimeline.tsx # History events timeline
├── DocumentExpirationAlert.tsx # Expiration warning
├── VehicleFormInput.tsx       # Reusable form input
├── VehicleFormSection.tsx     # Form section wrapper
└── index.ts                   # Barrel exports
```

---

## API Endpoints

### Base URL
All endpoints are relative to the API base URL configured in `lib/api/client.ts`.

### Authentication
All endpoints require authentication via Bearer token in the Authorization header (handled automatically by the API client).

---

## Driver Endpoints

### 1. Create Vehicle Registration
**POST** `/vehicles`

Registers a new vehicle for the authenticated driver.

**Content-Type**: `multipart/form-data`

**Request Body** (FormData):
```typescript
{
  // Driver Information
  driverName: string;              // Full legal name
  dateOfBirth: string;             // ISO format: YYYY-MM-DD
  gender: "male" | "female" | "other";
  nationalId: string;              // 8-digit Kenyan ID
  
  // Vehicle Information
  vehicleType: "truck" | "mini_truck" | "pickup";
  plateNumber: string;             // Format: KEA 100Q
  capacity: number;                // 50-10000
  capacityUnit: "kg" | "cubic_meters";
  
  // Documents (files)
  insuranceDocument: File;         // Max 10MB, JPEG/PNG/PDF
  insuranceExpirationDate?: string; // ISO format
  drivingLicense: File;            // Max 10MB, JPEG/PNG/PDF
  inspectionCertificate?: File;    // Max 10MB, JPEG/PNG/PDF
  inspectionExpirationDate?: string;
  
  // Photos (files array)
  photos: File[];                  // 3-10 photos, max 5MB each, JPEG/PNG/HEIC
  
  // Payment Information
  paymentMethod: "mpesa" | "bank_transfer" | "cash";
  paymentDetails: {
    mpesaNumber?: string;          // Format: +254XXXXXXXXX
    bankName?: string;
    accountNumber?: string;        // 10-16 digits
    accountName?: string;
  };
  
  // Service Areas
  serviceZones: string[];          // Array of city names
}
```

**Response** (201 Created):
```typescript
{
  id: string;
  driverId: string;
  driverName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  phone: string;
  email: string;
  vehicleType: "truck" | "mini_truck" | "pickup";
  plateNumber: string;
  capacity: number;
  capacityUnit: "kg" | "cubic_meters";
  nationalId: string;
  documents: {
    insurance: {
      id: string;
      vehicleId: string;
      type: "insurance";
      url: string;
      expirationDate?: string;
      uploadedAt: string;
    };
    drivingLicense: {
      id: string;
      vehicleId: string;
      type: "driving_license";
      url: string;
      uploadedAt: string;
    };
    inspectionCertificate?: {
      id: string;
      vehicleId: string;
      type: "inspection_certificate";
      url: string;
      expirationDate?: string;
      uploadedAt: string;
    };
  };
  photos: string[];  // Array of photo URLs
  paymentMethod: "mpesa" | "bank_transfer" | "cash";
  paymentDetails: {
    mpesaNumber?: string;
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
  };
  serviceZones: string[];
  status: "available";
  verificationStatus: "pending_verification";
  isActive: false;
  createdAt: string;
  updatedAt: string;
}
```

**Error Responses**:
- `400 Bad Request`: Validation errors
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not a driver role
- `413 Payload Too Large`: File size exceeded

---

### 2. Get Driver's Vehicles
**GET** `/vehicles`

Retrieves all vehicles for the authenticated driver.

**Query Parameters**:
```typescript
{
  vehicleType?: "truck" | "mini_truck" | "pickup";
  status?: "available" | "unavailable" | "in_service" | "under_maintenance";
  verificationStatus?: "pending_verification" | "verified" | "rejected";
  searchQuery?: string;  // Search by plate number or driver name
}
```

**Response** (200 OK):
```typescript
[
  {
    id: string;
    driverId: string;
    driverName: string;
    vehicleType: "truck" | "mini_truck" | "pickup";
    plateNumber: string;
    capacity: number;
    capacityUnit: "kg" | "cubic_meters";
    status: "available" | "unavailable" | "in_service" | "under_maintenance";
    verificationStatus: "pending_verification" | "verified" | "rejected";
    isActive: boolean;
    photos: string[];
    serviceZones: string[];
    createdAt: string;
    updatedAt: string;
  },
  // ... more vehicles
]
```

---

### 3. Get Single Vehicle
**GET** `/vehicles/:id`

Retrieves detailed information for a specific vehicle.

**Path Parameters**:
- `id`: Vehicle ID

**Response** (200 OK):
```typescript
{
  id: string;
  driverId: string;
  driverName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  phone: string;
  email: string;
  vehicleType: "truck" | "mini_truck" | "pickup";
  plateNumber: string;
  capacity: number;
  capacityUnit: "kg" | "cubic_meters";
  nationalId: string;
  documents: {
    insurance: VehicleDocument;
    drivingLicense: VehicleDocument;
    inspectionCertificate?: VehicleDocument;
  };
  photos: string[];
  paymentMethod: "mpesa" | "bank_transfer" | "cash";
  paymentDetails: PaymentDetails;
  serviceZones: string[];
  status: "available" | "unavailable" | "in_service" | "under_maintenance";
  verificationStatus: "pending_verification" | "verified" | "rejected";
  rejectionReason?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

**Error Responses**:
- `404 Not Found`: Vehicle not found
- `403 Forbidden`: Not authorized to view this vehicle

---

### 4. Update Vehicle
**PUT** `/vehicles/:id`

Updates vehicle information (capacity, service zones, payment details, photos).

**Content-Type**: `multipart/form-data`

**Path Parameters**:
- `id`: Vehicle ID

**Request Body** (FormData):
```typescript
{
  capacity?: number;
  capacityUnit?: "kg" | "cubic_meters";
  serviceZones?: string[];  // JSON stringified array
  paymentMethod?: "mpesa" | "bank_transfer" | "cash";
  paymentDetails?: PaymentDetails;  // JSON stringified object
  photos?: File[];  // Additional photos
}
```

**Response** (200 OK):
```typescript
{
  // Updated vehicle object (same structure as GET /vehicles/:id)
}
```

**Error Responses**:
- `400 Bad Request`: Validation errors
- `404 Not Found`: Vehicle not found
- `403 Forbidden`: Not authorized to update this vehicle

---

### 5. Delete Vehicle
**DELETE** `/vehicles/:id`

Soft deletes a vehicle (sets deletedAt timestamp).

**Path Parameters**:
- `id`: Vehicle ID

**Response** (200 OK):
```typescript
{
  success: true;
  message: "Vehicle deleted successfully"
}
```

**Error Responses**:
- `404 Not Found`: Vehicle not found
- `403 Forbidden`: Not authorized to delete this vehicle

---

### 6. Set Active Vehicle
**POST** `/vehicles/:id/set-active`

Sets a vehicle as the driver's active vehicle for accepting trips.

**Path Parameters**:
- `id`: Vehicle ID

**Response** (200 OK):
```typescript
{
  // Updated vehicle object with isActive: true
  // All other driver's vehicles will have isActive: false
}
```

**Error Responses**:
- `404 Not Found`: Vehicle not found
- `403 Forbidden`: Not authorized or vehicle not verified

---

### 7. Update Vehicle Status
**PATCH** `/vehicles/:id/status`

Updates vehicle availability status.

**Path Parameters**:
- `id`: Vehicle ID

**Request Body**:
```typescript
{
  status: "available" | "unavailable" | "in_service" | "under_maintenance"
}
```

**Response** (200 OK):
```typescript
{
  // Updated vehicle object
}
```

---

### 8. Get Vehicle History
**GET** `/vehicles/:id/history`

Retrieves all history events for a vehicle.

**Path Parameters**:
- `id`: Vehicle ID

**Response** (200 OK):
```typescript
[
  {
    id: string;
    vehicleId: string;
    eventType: "created" | "verified" | "rejected" | "status_changed" | "document_updated" | "assignment_completed" | "set_active" | "set_inactive";
    description: string;
    performedBy: string;  // User ID or "system"
    performedByName?: string;  // Admin name for verification events
    metadata?: Record<string, any>;
    timestamp: string;
  },
  // ... more events (sorted by timestamp DESC)
]
```

---

### 9. Upload Additional Photos
**POST** `/vehicles/:id/photos`

Uploads additional photos to an existing vehicle.

**Content-Type**: `multipart/form-data`

**Path Parameters**:
- `id`: Vehicle ID

**Request Body** (FormData):
```typescript
{
  photos: File[];  // Max 10 total photos per vehicle
}
```

**Response** (200 OK):
```typescript
{
  photoUrls: string[];  // Array of newly uploaded photo URLs
}
```

---

### 10. Update Document
**PUT** `/vehicles/:id/documents/:type`

Updates a specific document (insurance, license, or inspection).

**Content-Type**: `multipart/form-data`

**Path Parameters**:
- `id`: Vehicle ID
- `type`: "insurance" | "driving_license" | "inspection_certificate"

**Request Body** (FormData):
```typescript
{
  document: File;  // Max 10MB, JPEG/PNG/PDF
  expirationDate?: string;  // ISO format (for insurance/inspection)
}
```

**Response** (200 OK):
```typescript
{
  id: string;
  vehicleId: string;
  type: "insurance" | "driving_license" | "inspection_certificate";
  url: string;
  expirationDate?: string;
  uploadedAt: string;
}
```

---

### 11. Get Document Expiration Warnings
**GET** `/vehicles/expirations`

Retrieves all document expiration warnings for the driver's vehicles.

**Response** (200 OK):
```typescript
[
  {
    vehicleId: string;
    plateNumber: string;
    documentType: "insurance" | "driving_license" | "inspection_certificate";
    expirationDate: string;
    daysUntilExpiration: number;
    isExpired: boolean;
  },
  // ... more warnings (documents expiring within 30 days or already expired)
]
```

---

## Admin Endpoints

### 12. Get All Vehicles (Admin)
**GET** `/admin/vehicles`

Retrieves all vehicles across all drivers (admin only).

**Query Parameters**:
```typescript
{
  vehicleType?: "truck" | "mini_truck" | "pickup";
  status?: "available" | "unavailable" | "in_service" | "under_maintenance";
  verificationStatus?: "pending_verification" | "verified" | "rejected";
  searchQuery?: string;
}
```

**Response** (200 OK):
```typescript
[
  {
    // Same structure as GET /vehicles
  },
  // ... more vehicles
]
```

**Error Responses**:
- `403 Forbidden`: Not an admin

---

### 13. Approve Vehicle (Admin)
**POST** `/admin/vehicles/:id/approve`

Approves a pending vehicle registration.

**Path Parameters**:
- `id`: Vehicle ID

**Response** (200 OK):
```typescript
{
  // Updated vehicle object with verificationStatus: "verified"
}
```

**Error Responses**:
- `404 Not Found`: Vehicle not found
- `403 Forbidden`: Not an admin
- `400 Bad Request`: Vehicle not in pending status

---

### 14. Reject Vehicle (Admin)
**POST** `/admin/vehicles/:id/reject`

Rejects a pending vehicle registration with a reason.

**Path Parameters**:
- `id`: Vehicle ID

**Request Body**:
```typescript
{
  reason: string;  // Rejection reason (required)
}
```

**Response** (200 OK):
```typescript
{
  // Updated vehicle object with verificationStatus: "rejected" and rejectionReason
}
```

**Error Responses**:
- `404 Not Found`: Vehicle not found
- `403 Forbidden`: Not an admin
- `400 Bad Request`: Vehicle not in pending status or missing reason

---

## TypeScript Types

### Core Types

```typescript
// Vehicle Types
type VehicleType = "truck" | "mini_truck" | "pickup";

type VehicleStatus = 
  | "available" 
  | "unavailable" 
  | "in_service" 
  | "under_maintenance";

type VerificationStatus = 
  | "pending_verification" 
  | "verified" 
  | "rejected";

type DocumentType = 
  | "insurance" 
  | "driving_license" 
  | "inspection_certificate";

type PaymentMethod = "mpesa" | "bank_transfer" | "cash";

type EventType =
  | "created" 
  | "verified" 
  | "rejected" 
  | "status_changed" 
  | "document_updated" 
  | "assignment_completed"
  | "set_active"
  | "set_inactive";
```

### Interfaces

```typescript
interface Vehicle {
  id: string;
  driverId: string;
  driverName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  phone: string;
  email: string;
  vehicleType: VehicleType;
  plateNumber: string;
  capacity: number;
  capacityUnit: "kg" | "cubic_meters";
  nationalId: string;
  documents: {
    insurance: VehicleDocument;
    drivingLicense: VehicleDocument;
    inspectionCertificate?: VehicleDocument;
  };
  photos: string[];
  paymentMethod: PaymentMethod;
  paymentDetails: PaymentDetails;
  serviceZones: string[];
  status: VehicleStatus;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface VehicleDocument {
  id: string;
  vehicleId: string;
  type: DocumentType;
  url: string;
  expirationDate?: string;
  uploadedAt: string;
}

interface PaymentDetails {
  mpesaNumber?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
}

interface VehicleHistoryEvent {
  id: string;
  vehicleId: string;
  eventType: EventType;
  description: string;
  performedBy: string;
  performedByName?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}
```

---

## Usage Examples

### 1. Register a New Vehicle

```typescript
import { useCreateVehicle } from "@/modules/vehicle/hooks";

function VehicleRegistrationScreen() {
  const createVehicle = useCreateVehicle();
  
  const handleSubmit = async (formData: VehicleRegistrationPayload) => {
    try {
      await createVehicle.mutateAsync(formData);
      // Automatically navigates to driver dashboard on success
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };
  
  return (
    // Form UI
  );
}
```

### 2. Display Driver's Vehicles

```typescript
import { useVehicles } from "@/modules/vehicle/hooks";
import { VehicleCard } from "@/components/vehicle";

function VehicleListScreen() {
  const { data: vehicles, isLoading, error } = useVehicles();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorView error={error} />;
  
  return (
    <FlatList
      data={vehicles}
      renderItem={({ item }) => <VehicleCard vehicle={item} />}
      keyExtractor={(item) => item.id}
    />
  );
}
```

### 3. Update Vehicle Status

```typescript
import { useUpdateVehicleStatus } from "@/modules/vehicle/hooks";

function VehicleDetailsScreen({ vehicleId }: { vehicleId: string }) {
  const updateStatus = useUpdateVehicleStatus(vehicleId);
  
  const handleStatusChange = async (status: VehicleStatus) => {
    try {
      await updateStatus.mutateAsync({ status });
      // UI updates automatically via optimistic updates
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };
  
  return (
    // Status selector UI
  );
}
```

### 4. Admin Vehicle Approval

```typescript
import { useApproveVehicle, useRejectVehicle } from "@/modules/vehicle/hooks";

function AdminVehicleReviewScreen({ vehicleId }: { vehicleId: string }) {
  const approveVehicle = useApproveVehicle();
  const rejectVehicle = useRejectVehicle();
  
  const handleApprove = async () => {
    try {
      await approveVehicle.mutateAsync(vehicleId);
      // Navigate back to pending list
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };
  
  const handleReject = async (reason: string) => {
    try {
      await rejectVehicle.mutateAsync({ id: vehicleId, reason });
      // Navigate back to pending list
    } catch (error) {
      console.error("Rejection failed:", error);
    }
  };
  
  return (
    // Review UI with approve/reject buttons
  );
}
```

### 5. Check Document Expirations

```typescript
import { useExpirationWarnings } from "@/modules/vehicle/hooks";
import { DocumentExpirationAlert } from "@/components/vehicle";

function DashboardScreen() {
  const { data: warnings } = useExpirationWarnings();
  
  const expiringSoon = warnings?.filter(w => !w.isExpired && w.daysUntilExpiration <= 30);
  const expired = warnings?.filter(w => w.isExpired);
  
  return (
    <View>
      {expired?.map(warning => (
        <DocumentExpirationAlert key={warning.vehicleId} warning={warning} urgent />
      ))}
      {expiringSoon?.map(warning => (
        <DocumentExpirationAlert key={warning.vehicleId} warning={warning} />
      ))}
    </View>
  );
}
```

---

## Validation Rules

### License Plate
- **Format**: 3 uppercase letters, space, 3 digits, 1 uppercase letter
- **Example**: `KEA 100Q`, `KEB 211Z`
- **Regex**: `/^[A-Z]{3}\s\d{3}[A-Z]$/`

### Capacity
- **Minimum**: 50 kg
- **Maximum**: 10,000 kg
- **Type**: Number (integer or decimal)

### Documents
- **Allowed Types**: JPEG, PNG, PDF
- **Max Size**: 10 MB per document
- **Required**: Insurance, Driving License
- **Optional**: Inspection Certificate

### Photos
- **Allowed Types**: JPEG, PNG, HEIC
- **Max Size**: 5 MB per photo
- **Count**: 3-10 photos required
- **Recommended**: Front, back, sides, interior, cargo area

### M-Pesa Number
- **Format**: +254 followed by 9 digits
- **Example**: `+254712345678`
- **Regex**: `/^\+254\d{9}$/`

### Bank Account
- **Account Number**: 10-16 digits
- **Bank Name**: Required
- **Account Name**: Required (must match driver name)

### Service Zones
- **Minimum**: 1 zone required
- **Available Zones**: Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, Thika, Malindi, Kitale, Garissa, Kakamega

### Date of Birth
- **Format**: DD/MM/YYYY (user input) → YYYY-MM-DD (API)
- **Validation**: Must be 18+ years old
- **Max Age**: 100 years (prevents typos)

---

## Role-Based Access Control

### Driver Role (`relocation_driver`)
- ✅ Register vehicles
- ✅ View own vehicles
- ✅ Update own vehicles
- ✅ Delete own vehicles
- ✅ Set active vehicle
- ✅ Update vehicle status
- ✅ View vehicle history
- ✅ Upload photos/documents
- ❌ View other drivers' vehicles
- ❌ Approve/reject vehicles

### Admin Role (`admin`, `super_admin`)
- ✅ View all vehicles
- ✅ Approve vehicle registrations
- ✅ Reject vehicle registrations
- ✅ View all vehicle history
- ❌ Register vehicles (admin-specific)
- ❌ Update driver vehicles (admin-specific)

### Permission Helper Functions

```typescript
import { canRegisterVehicle, canAccessAdminVehicles } from "@/lib/permissions";

// Check if user can register vehicles
if (canRegisterVehicle(user.role)) {
  // Show registration button
}

// Check if user can access admin screens
if (canAccessAdminVehicles(user.role)) {
  // Show admin navigation
}
```

---

## Components

### VehicleCard
Displays vehicle summary in list views.

**Props**:
```typescript
{
  vehicle: Vehicle;
  onPress?: () => void;
}
```

**Features**:
- Vehicle type badge
- Verification status badge
- Plate number
- Capacity
- Service zones
- Active indicator

---

### VehicleStatusBadge
Displays vehicle availability status.

**Props**:
```typescript
{
  status: VehicleStatus;
  size?: "sm" | "md" | "lg";
}
```

**Colors**:
- `available`: Green
- `unavailable`: Gray
- `in_service`: Blue
- `under_maintenance`: Orange

---

### VerificationBadge
Displays verification status.

**Props**:
```typescript
{
  status: VerificationStatus;
  size?: "sm" | "md" | "lg";
}
```

**Colors**:
- `pending_verification`: Yellow
- `verified`: Green
- `rejected`: Red

---

### DocumentCard
Displays document with expiration warning.

**Props**:
```typescript
{
  document: VehicleDocument;
  onPress?: () => void;
  showExpiration?: boolean;
}
```

**Features**:
- Document type icon
- Expiration date
- Warning indicator (30 days)
- Tap to view full screen

---

### PhotoGrid
Displays vehicle photos in a grid.

**Props**:
```typescript
{
  photos: string[];
  onPhotoPress?: (index: number) => void;
  editable?: boolean;
  onRemove?: (index: number) => void;
}
```

**Features**:
- 3-column grid layout
- Tap to view full screen
- Remove button (editable mode)
- Add more button

---

### VehicleHistoryTimeline
Displays vehicle history events.

**Props**:
```typescript
{
  events: VehicleHistoryEvent[];
}
```

**Features**:
- Chronological timeline
- Event type icons
- Performer name
- Timestamp
- Metadata display

---

## State Management

### Zustand Store (Client State)

```typescript
import { useVehicleStore } from "@/modules/vehicle/store";

// Active vehicle ID
const activeVehicleId = useVehicleStore(s => s.activeVehicleId);
const setActiveVehicleId = useVehicleStore(s => s.setActiveVehicleId);

// Search and filters
const searchQuery = useVehicleStore(s => s.searchQuery);
const setSearchQuery = useVehicleStore(s => s.setSearchQuery);

// Registration form state
const registrationForm = useVehicleStore(s => s.registrationForm);
const updateRegistrationForm = useVehicleStore(s => s.updateRegistrationForm);
```

### TanStack Query (Server State)

All server data is managed by TanStack Query hooks:
- `useVehicles()` - List of vehicles
- `useVehicle(id)` - Single vehicle details
- `useVehicleHistory(id)` - Vehicle history
- `useExpirationWarnings()` - Document warnings
- `useAdminVehicles()` - Admin vehicle list

**Cache Configuration**:
- Vehicle lists: 5 minutes
- Vehicle details: 5 minutes
- History: 10 minutes
- Expirations: 30 minutes
- Admin lists: 2 minutes (fresher for admin)

---

## Error Handling

### API Errors

```typescript
interface ApiError {
  message: string;
  status: number | null;
  code: string | null;
  fieldErrors?: Record<string, string>;
}
```

### Common Error Codes

- `VEHICLE_NOT_FOUND`: Vehicle ID doesn't exist
- `UNAUTHORIZED`: Not authenticated
- `FORBIDDEN`: Insufficient permissions
- `VALIDATION_ERROR`: Form validation failed
- `FILE_TOO_LARGE`: File size exceeded
- `INVALID_FILE_TYPE`: Unsupported file format
- `ALREADY_VERIFIED`: Vehicle already verified
- `NOT_PENDING`: Vehicle not in pending status

### Error Handling Example

```typescript
try {
  await createVehicle.mutateAsync(payload);
} catch (error: any) {
  if (error.code === "VALIDATION_ERROR" && error.fieldErrors) {
    // Show field-specific errors
    setErrors(error.fieldErrors);
  } else {
    // Show general error message
    Alert.alert("Error", error.message);
  }
}
```

---

## Testing

### Unit Tests
- Validation functions
- Date formatting
- Plate number normalization
- Payment validation

### Integration Tests
- API calls with mock responses
- Hook behavior
- Cache invalidation
- Optimistic updates

### E2E Tests
- Complete registration flow
- Vehicle management flow
- Admin approval flow
- Document upload flow

---

## Performance Optimizations

### Image Optimization
- Photos compressed to 80% quality
- Thumbnails generated on upload
- Lazy loading in grids
- Progressive image loading

### Caching Strategy
- Aggressive caching for vehicle lists
- Optimistic updates for status changes
- Background refetch on focus
- Stale-while-revalidate pattern

### File Upload
- Chunked uploads for large files
- Progress tracking
- Retry on failure
- Cancel support

---

## Security Considerations

### File Upload Security
- File type validation (client + server)
- File size limits enforced
- Virus scanning on server
- Secure file storage (S3/CDN)

### Data Privacy
- Driver personal data encrypted
- National ID masked in lists
- Payment details encrypted
- Document URLs signed/temporary

### Access Control
- Role-based permissions
- Vehicle ownership verification
- Admin action logging
- Rate limiting on uploads

---

## Future Enhancements

### Planned Features
- [ ] Real-time vehicle tracking
- [ ] Automatic document renewal reminders
- [ ] Vehicle maintenance scheduling
- [ ] Trip history integration
- [ ] Earnings dashboard
- [ ] Multi-language support
- [ ] Offline mode support
- [ ] Push notifications for approvals

### API Improvements
- [ ] Pagination for vehicle lists
- [ ] Advanced filtering options
- [ ] Bulk operations for admin
- [ ] Export vehicle data (CSV/PDF)
- [ ] Analytics endpoints

---

## Support

For questions or issues with the Vehicle Management Module:

1. Check this documentation
2. Review the code comments in `modules/vehicle/`
3. Check the validation rules in `modules/vehicle/validation.ts`
4. Review the API responses in `modules/vehicle/api.ts`
5. Contact the development team

---

## Changelog

### Version 1.0.0 (Current)
- Initial vehicle management implementation
- Driver registration flow
- Admin verification workflow
- Document management
- Photo uploads
- Payment method configuration
- Service zone selection
- Vehicle history tracking
- Role-based access control
- Document expiration warnings

---

**Last Updated**: May 3, 2026  
**Module Version**: 1.0.0  
**Maintainer**: Masqany Development Team