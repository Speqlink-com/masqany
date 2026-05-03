# Vehicle Module Quick Start Guide

## 🚀 Quick Setup

### 1. Import the Hook
```typescript
import { useCreateVehicle } from "@/modules/vehicle/hooks";
```

### 2. Use in Component
```typescript
const createVehicle = useCreateVehicle();

await createVehicle.mutateAsync(payload);
```

---

## 📋 Common Use Cases

### Register a Vehicle

```typescript
import { useCreateVehicle } from "@/modules/vehicle/hooks";
import type { VehicleRegistrationPayload } from "@/modules/vehicle/types";

function VehicleRegistrationScreen() {
  const createVehicle = useCreateVehicle();
  
  const handleSubmit = async (data: VehicleRegistrationPayload) => {
    try {
      await createVehicle.mutateAsync(data);
      // Automatically navigates to dashboard
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
}
```

### Display Vehicle List

```typescript
import { useVehicles } from "@/modules/vehicle/hooks";
import { VehicleCard } from "@/components/vehicle";

function VehicleListScreen() {
  const { data: vehicles, isLoading } = useVehicles();
  
  return (
    <FlatList
      data={vehicles}
      renderItem={({ item }) => <VehicleCard vehicle={item} />}
    />
  );
}
```

### Update Vehicle Status

```typescript
import { useUpdateVehicleStatus } from "@/modules/vehicle/hooks";

const updateStatus = useUpdateVehicleStatus(vehicleId);

await updateStatus.mutateAsync({ status: "available" });
```

### Admin Approval

```typescript
import { useApproveVehicle, useRejectVehicle } from "@/modules/vehicle/hooks";

const approveVehicle = useApproveVehicle();
const rejectVehicle = useRejectVehicle();

// Approve
await approveVehicle.mutateAsync(vehicleId);

// Reject
await rejectVehicle.mutateAsync({ 
  id: vehicleId, 
  reason: "Invalid documents" 
});
```

---

## 🔑 API Endpoints Cheat Sheet

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/vehicles` | Register new vehicle |
| GET | `/vehicles` | Get driver's vehicles |
| GET | `/vehicles/:id` | Get vehicle details |
| PUT | `/vehicles/:id` | Update vehicle |
| DELETE | `/vehicles/:id` | Delete vehicle |
| POST | `/vehicles/:id/set-active` | Set as active vehicle |
| PATCH | `/vehicles/:id/status` | Update status |
| GET | `/vehicles/:id/history` | Get history |
| POST | `/vehicles/:id/photos` | Upload photos |
| PUT | `/vehicles/:id/documents/:type` | Update document |
| GET | `/vehicles/expirations` | Get expiration warnings |
| GET | `/admin/vehicles` | Get all vehicles (admin) |
| POST | `/admin/vehicles/:id/approve` | Approve vehicle (admin) |
| POST | `/admin/vehicles/:id/reject` | Reject vehicle (admin) |

---

## 📦 Available Hooks

### Query Hooks (Read Data)
- `useVehicles(filters?)` - Get vehicle list
- `useVehicle(id)` - Get single vehicle
- `useVehicleHistory(id)` - Get vehicle history
- `useExpirationWarnings()` - Get document warnings
- `useAdminVehicles(filters?)` - Get all vehicles (admin)

### Mutation Hooks (Write Data)
- `useCreateVehicle()` - Register vehicle
- `useUpdateVehicle(id)` - Update vehicle
- `useDeleteVehicle()` - Delete vehicle
- `useSetActiveVehicle()` - Set active vehicle
- `useUpdateVehicleStatus(id)` - Update status
- `useUploadPhotos(id)` - Upload photos
- `useUpdateDocument(id)` - Update document
- `useApproveVehicle()` - Approve (admin)
- `useRejectVehicle()` - Reject (admin)

---

## 🎨 Available Components

### Display Components
- `<VehicleCard />` - Vehicle list item
- `<VehicleStatusBadge />` - Status indicator
- `<VerificationBadge />` - Verification status
- `<VehicleTypeBadge />` - Vehicle type
- `<DocumentCard />` - Document display
- `<PhotoGrid />` - Photo gallery
- `<ServiceZoneChips />` - Service zones
- `<PaymentMethodCard />` - Payment info
- `<VehicleHistoryTimeline />` - History events
- `<DocumentExpirationAlert />` - Expiration warning

### Viewer Components
- `<PhotoViewer />` - Full-screen photo viewer
- `<DocumentViewer />` - Full-screen document viewer

### Form Components
- `<VehicleFormInput />` - Reusable input
- `<VehicleFormSection />` - Form section wrapper

---

## ✅ Validation Rules

### License Plate
```typescript
// Format: KEA 100Q
// Regex: /^[A-Z]{3}\s\d{3}[A-Z]$/
import { validatePlateNumber } from "@/modules/vehicle/validation";

const result = validatePlateNumber("KEA 100Q");
// { isValid: true }
```

### Capacity
```typescript
// Min: 50 kg, Max: 10,000 kg
import { validateCapacity } from "@/modules/vehicle/validation";

const result = validateCapacity(1000, "kg");
// { isValid: true }
```

### M-Pesa Number
```typescript
// Format: +254XXXXXXXXX
import { validateMpesaNumber } from "@/modules/vehicle/validation";

const result = validateMpesaNumber("+254712345678");
// { isValid: true }
```

### Documents
```typescript
// Max 10MB, JPEG/PNG/PDF
import { validateDocument } from "@/modules/vehicle/validation";

const result = validateDocument({ 
  type: "image/jpeg", 
  size: 5000000 
});
// { isValid: true }
```

### Photos
```typescript
// Max 5MB, JPEG/PNG/HEIC, 3-10 photos
import { validatePhoto, validatePhotoCount } from "@/modules/vehicle/validation";

const photoResult = validatePhoto({ 
  type: "image/jpeg", 
  size: 3000000 
});
// { isValid: true }

const countResult = validatePhotoCount(5);
// { isValid: true }
```

---

## 🔐 Role-Based Access

```typescript
import { canRegisterVehicle, canAccessAdminVehicles } from "@/lib/permissions";

// Check driver permissions
if (canRegisterVehicle(user.role)) {
  // Show registration button
}

// Check admin permissions
if (canAccessAdminVehicles(user.role)) {
  // Show admin screens
}
```

### Roles
- `relocation_driver` - Can register and manage own vehicles
- `admin` / `super_admin` - Can approve/reject all vehicles

---

## 🎯 Common Patterns

### Loading State
```typescript
const { data, isLoading, error } = useVehicles();

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorView error={error} />;
```

### Optimistic Updates
```typescript
const updateStatus = useUpdateVehicleStatus(vehicleId);

// UI updates immediately, reverts on error
await updateStatus.mutateAsync({ status: "available" });
```

### Form Validation
```typescript
import { validateRegistrationForm } from "@/modules/vehicle/validation";

const { isValid, errors } = validateRegistrationForm(formData);

if (!isValid) {
  setErrors(errors);
  return;
}
```

### File Upload with Progress
```typescript
const { uploadProgress, setUploadProgress } = useVehicleStore();

// Track upload progress
formData.append("photo", file, {
  onUploadProgress: (e) => {
    const progress = (e.loaded / e.total) * 100;
    setUploadProgress("photo", progress);
  }
});
```

---

## 🐛 Error Handling

```typescript
try {
  await createVehicle.mutateAsync(payload);
} catch (error: any) {
  // Field-specific errors
  if (error.fieldErrors) {
    setErrors(error.fieldErrors);
  }
  
  // General error
  Alert.alert("Error", error.message);
  
  // Error codes
  switch (error.code) {
    case "VALIDATION_ERROR":
      // Handle validation
      break;
    case "FILE_TOO_LARGE":
      // Handle file size
      break;
    case "UNAUTHORIZED":
      // Handle auth
      break;
  }
}
```

---

## 📱 Screen Navigation

### Registration Flow
```
vehicle-prompt → vehicle-registration → (tabs)/move
```

### Management Flow
```
vehicle-list → vehicle-details → edit-vehicle
                              → vehicle-history
```

### Admin Flow
```
admin-vehicles → admin-vehicle-review → admin-vehicles
```

---

## 💾 State Management

### Client State (Zustand)
```typescript
import { useVehicleStore } from "@/modules/vehicle/store";

// Active vehicle
const activeVehicleId = useVehicleStore(s => s.activeVehicleId);

// Search/filters
const searchQuery = useVehicleStore(s => s.searchQuery);
const vehicleTypeFilter = useVehicleStore(s => s.vehicleTypeFilter);

// Registration form
const registrationForm = useVehicleStore(s => s.registrationForm);
```

### Server State (TanStack Query)
```typescript
// Automatic caching, refetching, and invalidation
const { data, isLoading, error, refetch } = useVehicles();
```

---

## 🔄 Cache Invalidation

Mutations automatically invalidate related queries:

```typescript
// Creating a vehicle invalidates vehicle lists
useCreateVehicle() → invalidates useVehicles()

// Updating a vehicle invalidates detail and lists
useUpdateVehicle(id) → invalidates useVehicle(id) + useVehicles()

// Admin approval invalidates admin and detail
useApproveVehicle() → invalidates useAdminVehicles() + useVehicle(id)
```

---

## 📊 Type Definitions

### Vehicle Types
```typescript
type VehicleType = "truck" | "mini_truck" | "pickup";
type VehicleStatus = "available" | "unavailable" | "in_service" | "under_maintenance";
type VerificationStatus = "pending_verification" | "verified" | "rejected";
type PaymentMethod = "mpesa" | "bank_transfer" | "cash";
```

### Main Interfaces
```typescript
interface Vehicle {
  id: string;
  driverId: string;
  vehicleType: VehicleType;
  plateNumber: string;
  capacity: number;
  status: VehicleStatus;
  verificationStatus: VerificationStatus;
  isActive: boolean;
  // ... more fields
}

interface VehicleRegistrationPayload {
  driverName: string;
  dateOfBirth: string;
  vehicleType: VehicleType;
  plateNumber: string;
  capacity: number;
  // ... more fields
}
```

---

## 🎨 Styling

All components use NativeWind (Tailwind CSS):

```typescript
<View className="bg-white rounded-2xl p-4 mb-4">
  <Text className="font-poppins-semibold text-[16px] text-dark-400">
    Vehicle Information
  </Text>
</View>
```

### Design Tokens
```typescript
import { colors } from "@/constants/tokens";

// Primary: #20A6FD
// Secondary: #FFCB1A
// Danger: #F75555
// Success: #22C55E
```

---

## 🚦 Status Colors

```typescript
// Vehicle Status
available → Green (#22C55E)
unavailable → Gray (#9CA3AF)
in_service → Blue (#20A6FD)
under_maintenance → Orange (#F97316)

// Verification Status
pending_verification → Yellow (#FFCB1A)
verified → Green (#22C55E)
rejected → Red (#F75555)
```

---

## 📝 Example Payloads

### Registration Payload
```typescript
const payload: VehicleRegistrationPayload = {
  driverName: "John Doe",
  dateOfBirth: "1990-05-15",
  gender: "male",
  vehicleType: "truck",
  plateNumber: "KEA 100Q",
  capacity: 5000,
  capacityUnit: "kg",
  nationalId: "12345678",
  insuranceDocument: insuranceFile,
  drivingLicense: licenseFile,
  photos: [photo1, photo2, photo3],
  paymentMethod: "mpesa",
  paymentDetails: {
    mpesaNumber: "+254712345678"
  },
  serviceZones: ["Nairobi", "Mombasa"]
};
```

### Update Payload
```typescript
const payload: VehicleUpdatePayload = {
  capacity: 6000,
  serviceZones: ["Nairobi", "Mombasa", "Kisumu"],
  paymentMethod: "bank_transfer",
  paymentDetails: {
    bankName: "Equity Bank",
    accountNumber: "1234567890",
    accountName: "John Doe"
  }
};
```

---

## 🔍 Filtering Examples

```typescript
// Filter by vehicle type
const { data } = useVehicles({ vehicleType: "truck" });

// Filter by status
const { data } = useVehicles({ status: "available" });

// Filter by verification status
const { data } = useVehicles({ verificationStatus: "verified" });

// Search by plate number
const { data } = useVehicles({ searchQuery: "KEA" });

// Combine filters
const { data } = useVehicles({
  vehicleType: "truck",
  status: "available",
  verificationStatus: "verified"
});
```

---

## 📚 Additional Resources

- [Full Documentation](./VEHICLE_MODULE_DOCUMENTATION.md)
- [Architecture Guide](../architecture.md)
- [API Client](../../lib/api/client.ts)
- [Type Definitions](../../modules/vehicle/types.ts)
- [Validation Rules](../../modules/vehicle/validation.ts)

---

**Last Updated**: May 3, 2026  
**Quick Start Version**: 1.0.0