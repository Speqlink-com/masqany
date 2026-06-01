# Task List: Enterprise Map & Moving Service

## Overview

Implementation tasks for the enterprise-grade Map & Moving Service module. All styling uses **NativeWind CSS** (className with Tailwind classes). StyleSheet.create() is only used for Mapbox-specific styles that require objects.

**Key Styling Rules:**

- Use `className="..."` for all component styling
- Tab bar protection: `className="absolute bottom-0 left-0 right-0 h-[100px] bg-[#3fbdfd] z-50"`
- Use Tailwind color classes: `bg-primary-700`, `text-dark-400`, etc.
- Only use StyleSheet for Mapbox LineLayer/SymbolLayer styles

---

## Phase 1: Module Foundation

### Task 1.1: Create Module Structure

**Status:** todo
**Priority:** high
**Estimated Time:** 30 minutes

**Description:**
Set up the module directory structure following Masqany architecture pattern.

**Implementation Steps:**

1. Create `modules/move/` directory
2. Create `modules/move/types.ts` (empty, will populate in next task)
3. Create `modules/move/api.ts` (empty)
4. Create `modules/move/hooks.ts` (empty)
5. Create `modules/move/index.ts` with exports
6. Create `modules/move/store/` directory
7. Create `modules/move/store/move.store.ts` (empty)

**Acceptance Criteria:**

- [ ] Directory structure matches `modules/[feature]/` pattern
- [ ] All files created with proper naming
- [ ] index.ts exports from api, hooks, types
- [ ] No compilation errors

**Files to Create:**

- `modules/move/types.ts`
- `modules/move/api.ts`
- `modules/move/hooks.ts`
- `modules/move/index.ts`
- `modules/move/store/move.store.ts`

---

### Task 1.2: Define TypeScript Types

**Status:** todo
**Priority:** high
**Estimated Time:** 45 minutes
**Dependencies:** Task 1.1

**Description:**
Define all TypeScript interfaces for vehicles, routes, bookings, and payments.

**Implementation Steps:**

1. Add `VehicleType` type: `"pickup" | "mini_truck" | "truck"`
2. Add `Coordinates` interface with latitude/longitude
3. Add `Location` interface with name, address, coordinates, type
4. Add `Vehicle` interface with id, type, licensePlate, capacity, status
5. Add `AvailableVehicle` interface with real-time data
6. Add `RouteGeometry` and `Route` interfaces
7. Add `MoveBooking` interface with all booking fields
8. Add `PaymentRequest` and `PaymentResponse` interfaces
9. Add `MoveUIState` interface for Zustand store

**Acceptance Criteria:**

- [ ] All types defined in `modules/move/types.ts`
- [ ] Types match design document specifications
- [ ] Proper TypeScript strict mode compliance
- [ ] Exported from `modules/move/index.ts`

**Reference:** Design document Data Models section

---

### Task 1.3: Implement API Layer

**Status:** todo
**Priority:** high
**Estimated Time:** 1 hour
**Dependencies:** Task 1.2

**Description:**
Implement pure HTTP calls for vehicle availability, routes, bookings, and payments.

**Implementation Steps:**

1. Import `apiClient` from `@/lib/api/client`
2. Import types from `./types`
3. Implement `getAvailableVehicles(params)` - GET /moves/vehicles/available
4. Implement `calculateRoute(params)` - POST /moves/routes/calculate
5. Implement `estimatePrice(params)` - POST /moves/estimate
6. Implement `createBooking(payload)` - POST /moves/bookings
7. Implement `getMyBookings()` - GET /moves/bookings/me
8. Implement `getBookingById(id)` - GET /moves/bookings/:id
9. Implement `cancelBooking(id)` - POST /moves/bookings/:id/cancel
10. Implement `getPropertyRoute(propertyId, userLocation)` - POST /moves/routes/property
11. Export as `moveApi` object

**Acceptance Criteria:**

- [ ] All API functions implemented in `modules/move/api.ts`
- [ ] Uses shared `apiClient` from lib/api/client.ts
- [ ] No React dependencies (pure functions)
- [ ] Proper TypeScript return types
- [ ] Error handling via apiClient interceptors

**Reference:** Design document API Endpoints section

---

### Task 1.4: Implement TanStack Query Hooks

**Status:** todo
**Priority:** high
**Estimated Time:** 1.5 hours
**Dependencies:** Task 1.3

**Description:**
Create TanStack Query hooks for all data fetching with proper cache strategies.

**Implementation Steps:**

1. Define `moveKeys` object with hierarchical query keys
2. Implement `useAvailableVehicles(location, vehicleType)` with 30s stale time
3. Implement `useRoute(origin, destination)` with 5min stale time
4. Implement `usePropertyRoute(propertyId, userLocation)`
5. Implement `usePriceEstimate()` mutation
6. Implement `useMyBookings()` with 2min stale time
7. Implement `useBooking(id)` with 30s stale time
8. Implement `useCreateBooking()` mutation with cache invalidation
9. Implement `useCancelBooking()` mutation with cache invalidation
10. Add auto-refetch for vehicle availability (30s interval)

**Acceptance Criteria:**

- [ ] All hooks implemented in `modules/move/hooks.ts`
- [ ] Query keys follow hierarchical structure
- [ ] Proper stale time and cache time configured
- [ ] Mutations invalidate relevant queries
- [ ] Vehicle availability auto-refreshes every 30s
- [ ] Exported from `modules/move/index.ts`

**Reference:** Design document State Management section

---

### Task 1.5: Implement Zustand Store

**Status:** todo
**Priority:** high
**Estimated Time:** 45 minutes
**Dependencies:** Task 1.2

**Description:**
Create Zustand store for UI state management (map viewport, selections, modal visibility).

**Implementation Steps:**

1. Import `create` from zustand
2. Import types from `../types`
3. Define `MoveStore` interface matching `MoveUIState`
4. Implement initial state with Nairobi center coordinates
5. Implement `openDestinationModal()` action
6. Implement `closeDestinationModal()` action
7. Implement `setDestination(location, vehicleType)` action
8. Implement `selectVehicle(vehicle)` action
9. Implement `setSheetPosition(position)` action
10. Implement `setMapRegion(region)` action
11. Implement `reset()` action
12. Export as `useMoveStore`

**Acceptance Criteria:**

- [ ] Store implemented in `modules/move/store/move.store.ts`
- [ ] All UI state managed (modal, selections, sheet position, map region)
- [ ] Actions properly update state
- [ ] Initial state includes fallback coordinates
- [ ] Exported from `modules/move/index.ts`

**Reference:** Design document Zustand Store Implementation section

---

## Phase 2: Core Components

### Task 2.1: Create MoveBottomSheet Component

**Status:** todo
**Priority:** high
**Estimated Time:** 2 hours
**Dependencies:** Task 1.5

**Description:**
Build scrollable bottom sheet overlay with snap points using NativeWind styling.

**Implementation Steps:**

1. Create `components/move/MoveBottomSheet.tsx`
2. Install `@gorhom/bottom-sheet` if not present
3. Define props interface (bottomInset, onSnapChange, etc.)
4. Use NativeWind classes for all styling:
   - Header: `className="px-4 py-3 bg-white rounded-t-3xl"`
   - Title: `className="text-xl font-semibold text-dark-400"`
   - Content: `className="flex-1 bg-white"`
5. Implement snap points: [0.3, 0.7, 1.0]
6. Add "Move with Masqany" title
7. Add current location display
8. Add destination selector button
9. Add vehicle list container (will populate in Task 2.3)
10. Add confirm button (hidden until vehicle selected)
11. Handle snap position changes via callback
12. Add 100px bottom padding for tab bar protection

**Acceptance Criteria:**

- [ ] Component created in `components/move/MoveBottomSheet.tsx`
- [ ] Uses NativeWind classes for ALL styling (no StyleSheet)
- [ ] Three snap points working smoothly
- [ ] Displays title and current location
- [ ] Destination selector opens modal (Task 2.2)
- [ ] Smooth 60 FPS scrolling
- [ ] Tab bar protection maintained

**Styling Example:**

```tsx
<View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg">
  <View className="px-4 py-3 border-b border-gray-200">
    <Text className="text-xl font-semibold text-dark-400">Move with Masqany</Text>
  </View>
</View>
```

---

### Task 2.2: Create DestinationModal Component

**Status:** todo
**Priority:** high
**Estimated Time:** 2.5 hours
**Dependencies:** Task 1.5

**Description:**
Build full-screen destination picker with search, vehicle type selection using NativeWind.

**Implementation Steps:**

1. Create `components/move/DestinationModal.tsx`
2. Define props interface (visible, currentLocation, onClose, onSelect)
3. Use NativeWind classes for all styling:
   - Modal container: `className="flex-1 bg-white"`
   - Header: `className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200"`
   - Close button: `className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"`
   - Search input: `className="px-4 py-3 bg-gray-100 rounded-lg text-base"`
4. Add close button (top-right) with close-icon.webp
5. Add search input with debounced filtering (300ms)
6. Display current location (pre-selected)
7. Display suggested locations with distances
8. Add thin black dividers: `className="h-[1px] bg-black"`
9. Add vehicle type selector (pickup, mini truck, truck icons)
10. Calculate distances using Haversine formula
11. Handle selection and close modal
12. Add "Schedule for later" option (future task)

**Acceptance Criteria:**

- [ ] Component created in `components/move/DestinationModal.tsx`
- [ ] Uses NativeWind classes exclusively
- [ ] Full-screen modal with close button
- [ ] Search input with debounced filtering
- [ ] Suggested locations with km distances
- [ ] Thin black divider lines between entries
- [ ] Vehicle type selection working
- [ ] Closes and returns selected data

**Styling Example:**

```tsx
<Modal visible={visible} animationType="slide">
  <View className="flex-1 bg-white">
    <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
      <Text className="text-lg font-semibold">Select Destination</Text>
      <TouchableOpacity onPress={onClose} className="w-10 h-10 items-center justify-center">
        <Image source={closeIcon} className="w-6 h-6" />
      </TouchableOpacity>
    </View>
  </View>
</Modal>
```

---

### Task 2.3: Create VehicleList Component

**Status:** todo
**Priority:** high
**Estimated Time:** 1.5 hours
**Dependencies:** Task 1.4

**Description:**
Build scrollable vehicle list with pricing and ETA using NativeWind styling.

**Implementation Steps:**

1. Create `components/move/VehicleList.tsx`
2. Define props interface (vehicles, selectedVehicleId, onSelect)
3. Use NativeWind classes for all styling:
   - Container: `className="flex-1"`
   - Vehicle card: `className="mx-4 my-2 p-4 bg-gray-50 rounded-xl border-2 border-transparent"`
   - Selected card: `className="border-primary-700"`
   - Vehicle type: `className="text-lg font-semibold text-dark-400"`
   - Price: `className="text-xl font-bold text-primary-700"`
   - ETA: `className="text-sm text-gray-600"`
4. Use FlashList for performance (or FlatList if not available)
5. Display vehicle icon from assets/icons/
6. Display vehicle type, price, ETA, distance
7. Highlight selected vehicle with primary-700 border
8. Add memoization to prevent unnecessary re-renders
9. Show loading skeleton while fetching
10. Show empty state if no vehicles available

**Acceptance Criteria:**

- [ ] Component created in `components/move/VehicleList.tsx`
- [ ] Uses NativeWind classes exclusively
- [ ] Displays all vehicle information
- [ ] Selected vehicle highlighted
- [ ] Smooth scrolling performance
- [ ] Loading and empty states
- [ ] Memoized for performance

**Styling Example:**

```tsx
<TouchableOpacity 
  className={`mx-4 my-2 p-4 bg-gray-50 rounded-xl border-2 ${
    selected ? 'border-primary-700' : 'border-transparent'
  }`}
>
  <Text className="text-lg font-semibold text-dark-400">Pickup Truck</Text>
  <Text className="text-xl font-bold text-primary-700">KES 1,500</Text>
  <Text className="text-sm text-gray-600">Arrives in 8 minutes</Text>
</TouchableOpacity>
```

---

### Task 2.4: Create RouteLayer Component

**Status:** todo
**Priority:** high
**Estimated Time:** 2 hours
**Dependencies:** Task 1.4

**Description:**
Build route visualization layer with blue lines and distance markers.

**Implementation Steps:**

1. Create `components/move/RouteLayer.tsx`
2. Define props interface (route, color, showDistanceMarkers)
3. Use Mapbox ShapeSource and LineLayer for route
4. Use StyleSheet ONLY for Mapbox layer styles (required by Mapbox):
   ```typescript
   lineColor: colors.primary[700], // #20A6FD
   lineWidth: 4,
   lineCap: 'round',
   lineJoin: 'round'
   ```
5. Use NativeWind for distance marker containers:
   - Marker: `className="bg-white px-2 py-1 rounded-full shadow-md"`
   - Text: `className="text-xs font-semibold text-dark-400"`
6. Calculate distance markers every 1km
7. Animate route drawing with smooth transitions
8. Support multiple routes (driver to user)
9. Auto-fit map viewport to show entire route
10. Add cached route indicator

**Acceptance Criteria:**

- [ ] Component created in `components/move/RouteLayer.tsx`
- [ ] Blue route lines (#20A6FD) displayed
- [ ] Distance markers every 1km
- [ ] NativeWind used for marker containers
- [ ] StyleSheet used ONLY for Mapbox layer styles
- [ ] Smooth route animations
- [ ] Multiple routes supported
- [ ] Viewport auto-fits route

**Styling Example:**

```tsx
// Mapbox layer (StyleSheet required)
<Mapbox.LineLayer
  id="route-line"
  style={{
    lineColor: colors.primary[700],
    lineWidth: 4,
  }}
/>

// Distance marker (NativeWind)
<View className="bg-white px-2 py-1 rounded-full shadow-md">
  <Text className="text-xs font-semibold text-dark-400">{distance}km</Text>
</View>
```

---

### Task 2.5: Create DriverMarkers Component

**Status:** todo
**Priority:** medium
**Estimated Time:** 1 hour
**Dependencies:** Task 1.4

**Description:**
Build driver location markers for available vehicles on map.

**Implementation Steps:**

1. Create `components/move/DriverMarkers.tsx`
2. Define props interface (drivers, onMarkerPress)
3. Use Mapbox PointAnnotation for each driver
4. Use NativeWind for marker containers:
   - Marker: `className="w-10 h-10 items-center justify-center bg-primary-700 rounded-full shadow-lg"`
   - Icon: Use vehicle-icon.webp or pickup-vehicle-icon.png
5. Display driver location from AvailableVehicle data
6. Add pulse animation for active drivers
7. Handle marker press to show driver details
8. Update markers when driver locations change

**Acceptance Criteria:**

- [ ] Component created in `components/move/DriverMarkers.tsx`
- [ ] Uses NativeWind classes for marker styling
- [ ] Displays driver locations on map
- [ ] Markers update with real-time data
- [ ] Tap handler working
- [ ] Pulse animation for visual feedback

**Styling Example:**

```tsx
<Mapbox.PointAnnotation
  id={`driver-${driver.id}`}
  coordinate={[driver.currentLocation.longitude, driver.currentLocation.latitude]}
>
  <View className="w-10 h-10 items-center justify-center bg-primary-700 rounded-full shadow-lg">
    <Image source={vehicleIcon} className="w-6 h-6" />
  </View>
</Mapbox.PointAnnotation>
```

---

## Phase 3: Screen Integration

### Task 3.1: Update MoveScreen with New Components

**Status:** todo
**Priority:** high
**Estimated Time:** 2 hours
**Dependencies:** Tasks 2.1, 2.2, 2.3, 2.4, 2.5

**Description:**
Integrate all new components into the move screen with proper state management.

**Implementation Steps:**

1. Update `app/(tabs)/move.tsx`
2. Import hooks from `@/modules/move`
3. Import Zustand store selectors
4. Add destination and vehicle type state
5. Replace old MoveBottomSheet with new implementation
6. Add DestinationModal integration
7. Add RouteLayer to BaseMap
8. Add DriverMarkers to BaseMap
9. Connect vehicle availability query
10. Connect route calculation query
11. Handle destination selection flow
12. Handle vehicle selection flow
13. Navigate to payment on confirm
14. Maintain tab bar protection: `className="absolute bottom-0 left-0 right-0 h-[100px] bg-[#3fbdfd] z-50"`

**Acceptance Criteria:**

- [ ] MoveScreen updated with all new components
- [ ] State management working (TanStack Query + Zustand)
- [ ] Destination selection flow complete
- [ ] Vehicle selection flow complete
- [ ] Routes displayed on map
- [ ] Driver markers displayed
- [ ] Tab bar protection maintained
- [ ] No compilation errors

---

### Task 3.2: Implement Property Navigation

**Status:** todo
**Priority:** high
**Estimated Time:** 1.5 hours
**Dependencies:** Task 2.4

**Description:**
Add "View on Map" functionality from property listings with route visualization.

**Implementation Steps:**

1. Update property detail screen to pass propertyId to move screen
2. Update `app/(tabs)/move.tsx` to accept propertyId param
3. Use `usePropertyRoute(propertyId, userLocation)` hook
4. Display route from user location to property
5. Center map viewport to show both locations
6. Display distance and estimated travel time
7. Use NativeWind for info overlay:
   - Container: `className="absolute top-20 left-4 right-4 bg-white p-4 rounded-xl shadow-lg"`
   - Distance: `className="text-lg font-semibold text-dark-400"`
   - Time: `className="text-sm text-gray-600"`
8. Add back button to return to property listing

**Acceptance Criteria:**

- [ ] Property navigation working from listing
- [ ] Route displayed from user to property
- [ ] Distance and time shown
- [ ] Map viewport centered correctly
- [ ] NativeWind styling for info overlay
- [ ] Back navigation working

**Styling Example:**

```tsx
<View className="absolute top-20 left-4 right-4 bg-white p-4 rounded-xl shadow-lg">
  <Text className="text-lg font-semibold text-dark-400">5.2 km away</Text>
  <Text className="text-sm text-gray-600">12 minutes by car</Text>
</View>
```

---

## Phase 4: Payment Integration

### Task 4.1: Create MovePaymentScreen

**Status:** todo
**Priority:** high
**Estimated Time:** 2.5 hours
**Dependencies:** Task 1.4

**Description:**
Build payment screen with M-Pesa and card options using NativeWind styling.

**Implementation Steps:**

1. Create `app/payment/move-payment.tsx`
2. Accept booking data from route params
3. Use NativeWind classes for all styling:
   - Container: `className="flex-1 bg-white"`
   - Logo container: `className="items-center py-8"`
   - Input: `className="px-4 py-3 border border-gray-300 rounded-lg text-base"`
   - Pay button: `className="bg-primary-700 py-4 rounded-lg items-center"`
   - Cancel button: `className="border border-gray-300 py-4 rounded-lg items-center mt-3"`
4. Display Masqany logo
5. Add phone number input with validation
6. Add payment method selector (M-Pesa/Card)
7. Display total price
8. Add "Pay KES [amount]" button
9. Add "Cancel move" button
10. Implement phone number validation (Kenyan format)
11. Integrate with payment API
12. Show loading state during processing
13. Navigate back on success/failure

**Acceptance Criteria:**

- [ ] Screen created in `app/payment/move-payment.tsx`
- [ ] Uses NativeWind classes exclusively
- [ ] Masqany logo displayed
- [ ] Phone number input with validation
- [ ] Payment method selection working
- [ ] M-Pesa and card payment supported
- [ ] Loading states implemented
- [ ] Success/failure navigation

**Styling Example:**

```tsx
<View className="flex-1 bg-white px-4">
  <View className="items-center py-8">
    <Image source={masqanyLogo} className="w-32 h-32" />
  </View>
  
  <TextInput
    className="px-4 py-3 border border-gray-300 rounded-lg text-base mb-4"
    placeholder="Phone number (+254...)"
  />
  
  <TouchableOpacity className="bg-primary-700 py-4 rounded-lg items-center">
    <Text className="text-white text-lg font-semibold">Pay KES 1,500</Text>
  </TouchableOpacity>
</View>
```

---

### Task 4.2: Implement Payment Polling

**Status:** todo
**Priority:** high
**Estimated Time:** 1 hour
**Dependencies:** Task 4.1

**Description:**
Implement payment status polling for M-Pesa STK push with timeout handling.

**Implementation Steps:**

1. Create `lib/payment/polling.ts` utility
2. Implement `pollPaymentStatus(paymentId, timeoutMs)` function
3. Poll every 2 seconds for up to 60 seconds
4. Return payment status (completed, failed, timeout)
5. Integrate polling in MovePaymentScreen
6. Show loading indicator during polling
7. Handle success: invalidate queries, navigate to move screen
8. Handle failure: display error message, allow retry
9. Handle timeout: display timeout message, allow retry

**Acceptance Criteria:**

- [ ] Polling utility created in `lib/payment/polling.ts`
- [ ] Polls every 2 seconds for 60 seconds max
- [ ] Returns final payment status
- [ ] Integrated in payment screen
- [ ] Loading indicator shown
- [ ] Success/failure/timeout handled correctly
- [ ] Retry mechanism working

---

## Phase 5: Utilities and Helpers

### Task 5.1: Implement Location Tracking Hook

**Status:** todo
**Priority:** high
**Estimated Time:** 1.5 hours
**Dependencies:** None

**Description:**
Create custom hook for real-time GPS location tracking with permissions.

**Implementation Steps:**

1. Create `lib/permissions/location.ts`
2. Implement `useLocationTracking(enabled)` hook
3. Request foreground location permissions
4. Use expo-location with "balanced" accuracy
5. Update location every 5 seconds
6. Stop updates when disabled
7. Handle permission denial gracefully
8. Return coordinates, accuracy, error, permissionGranted
9. Use fallback coordinates (Nairobi) if denied

**Acceptance Criteria:**

- [ ] Hook created in `lib/permissions/location.ts`
- [ ] Requests foreground permissions only
- [ ] Uses balanced accuracy (battery-efficient)
- [ ] Updates every 5 seconds when enabled
- [ ] Stops updates when disabled
- [ ] Permission denial handled
- [ ] Fallback coordinates provided
- [ ] Exported for use in components

---

### Task 5.2: Implement Distance Calculation Utilities

**Status:** todo
**Priority:** medium
**Estimated Time:** 45 minutes
**Dependencies:** None

**Description:**
Create utility functions for distance calculations and route markers.

**Implementation Steps:**

1. Create `modules/move/utils.ts`
2. Implement `haversineDistance(coord1, coord2)` function
3. Implement `calculateDistanceMarkers(geometry, intervalKm)` function
4. Implement `validateCoordinates(coords)` function
5. Implement `isInKenya(coords)` function
6. Add unit tests for all functions
7. Export from `modules/move/index.ts`

**Acceptance Criteria:**

- [ ] Utilities created in `modules/move/utils.ts`
- [ ] Haversine distance calculation accurate
- [ ] Distance markers calculated correctly
- [ ] Coordinate validation working
- [ ] Kenya bounds validation working
- [ ] Unit tests passing
- [ ] Exported from module

---

### Task 5.3: Implement Phone Number Validation

**Status:** todo
**Priority:** medium
**Estimated Time:** 30 minutes
**Dependencies:** None

**Description:**
Create utility functions for Kenyan phone number validation and formatting.

**Implementation Steps:**

1. Create `lib/validation/phone.ts`
2. Implement `validateKenyanPhone(phone)` function with regex
3. Implement `formatKenyanPhone(phone)` function
4. Support formats: 07XX, 01XX, 254XXX, +254XXX
5. Add unit tests for validation and formatting
6. Export functions

**Acceptance Criteria:**

- [ ] Utilities created in `lib/validation/phone.ts`
- [ ] Validates Kenyan phone format (+254XXXXXXXXX)
- [ ] Formats various input formats correctly
- [ ] Unit tests passing
- [ ] Used in payment screen

---

### Task 5.4: Implement Offline Route Caching

**Status:** todo
**Priority:** medium
**Estimated Time:** 1.5 hours
**Dependencies:** Task 1.4

**Description:**
Create route caching system using AsyncStorage with LRU eviction.

**Implementation Steps:**

1. Create `lib/offline/routeCache.ts`
2. Implement `save(route)` function
3. Implement `getAll()` function
4. Implement `find(origin, destination)` function
5. Implement LRU eviction (max 50 routes)
6. Add cachedAt timestamp to routes
7. Integrate with `useRoute` hook
8. Show cached indicator in UI using NativeWind:
   - Badge: `className="absolute top-2 right-2 bg-yellow-500 px-2 py-1 rounded-full"`
   - Text: `className="text-xs text-white font-semibold"`

**Acceptance Criteria:**

- [ ] Cache utility created in `lib/offline/routeCache.ts`
- [ ] Saves routes to AsyncStorage
- [ ] LRU eviction working (max 50)
- [ ] Find function matches origin/destination
- [ ] Integrated with useRoute hook
- [ ] Cached indicator shown with NativeWind
- [ ] Works offline

**Styling Example:**

```tsx
{route?.cachedAt && (
  <View className="absolute top-2 right-2 bg-yellow-500 px-2 py-1 rounded-full">
    <Text className="text-xs text-white font-semibold">Cached</Text>
  </View>
)}
```

---

## Phase 6: Mock Data and Testing

### Task 6.1: Create Mock Data

**Status:** todo
**Priority:** high
**Estimated Time:** 1 hour
**Dependencies:** Task 1.2

**Description:**
Create comprehensive mock data for development and testing.

**Implementation Steps:**

1. Create `assets/data/move.ts`
2. Add `mockAvailableVehicles` array (3-5 vehicles)
3. Add `mockRoute` object with geometry and markers
4. Add `mockBooking` object
5. Add `mockSuggestedLocations` array
6. Add `mockDriverLocations` array
7. Match data structure to API responses
8. Export all mock data

**Acceptance Criteria:**

- [ ] Mock data created in `assets/data/move.ts`
- [ ] Includes vehicles, routes, bookings, locations
- [ ] Matches API response structure
- [ ] Realistic Kenyan locations and prices
- [ ] Exported for use in development

---

### Task 6.2: Write Unit Tests

**Status:** todo
**Priority:** medium
**Estimated Time:** 2 hours
**Dependencies:** Tasks 5.2, 5.3

**Description:**
Write unit tests for utility functions and business logic.

**Implementation Steps:**

1. Create `__tests__/move/utils.test.ts`
2. Test `haversineDistance` with known coordinates
3. Test `calculateDistanceMarkers` with sample geometry
4. Test `validateCoordinates` with valid/invalid inputs
5. Test `isInKenya` with Kenya/non-Kenya coordinates
6. Create `__tests__/validation/phone.test.ts`
7. Test `validateKenyanPhone` with various formats
8. Test `formatKenyanPhone` with various inputs
9. Run tests with `pnpm test`

**Acceptance Criteria:**

- [ ] Unit tests created for utilities
- [ ] All distance calculations tested
- [ ] Phone validation tested
- [ ] Tests passing
- [ ] Coverage > 80% for utilities

---

### Task 6.3: Write Integration Tests

**Status:** todo
**Priority:** medium
**Estimated Time:** 2.5 hours
**Dependencies:** Task 1.4

**Description:**
Write integration tests for TanStack Query hooks with mocked API.

**Implementation Steps:**

1. Create `__tests__/move/hooks.test.ts`
2. Mock `moveApi` functions
3. Test `useAvailableVehicles` with mock data
4. Test `useRoute` with mock route
5. Test `useCreateBooking` mutation
6. Test cache invalidation after mutations
7. Test auto-refetch for vehicle availability
8. Use React Testing Library for hook testing

**Acceptance Criteria:**

- [ ] Integration tests created
- [ ] All hooks tested with mocked API
- [ ] Cache behavior verified
- [ ] Mutations and invalidations tested
- [ ] Tests passing

---

### Task 6.4: Write Component Tests

**Status:** todo
**Priority:** low
**Estimated Time:** 3 hours
**Dependencies:** Tasks 2.1, 2.2, 2.3

**Description:**
Write component tests for UI components.

**Implementation Steps:**

1. Create `__tests__/components/VehicleList.test.tsx`
2. Test vehicle card rendering
3. Test vehicle selection
4. Test empty state
5. Create `__tests__/components/DestinationModal.test.tsx`
6. Test modal open/close
7. Test search filtering
8. Test vehicle type selection
9. Use React Native Testing Library

**Acceptance Criteria:**

- [ ] Component tests created
- [ ] VehicleList tested
- [ ] DestinationModal tested
- [ ] User interactions tested
- [ ] Tests passing

---

## Phase 7: Performance and Polish

### Task 7.1: Implement Map Performance Optimizations

**Status:** todo
**Priority:** medium
**Estimated Time:** 2 hours
**Dependencies:** Task 3.1

**Description:**
Add performance optimizations for smooth 60 FPS map interactions.

**Implementation Steps:**

1. Implement marker clustering for 100+ properties
2. Add debounced map movement handler (100ms)
3. Optimize marker rendering with memoization
4. Add lazy loading for map tiles
5. Implement viewport-based marker filtering
6. Test FPS with React DevTools Profiler
7. Ensure 60 FPS during scrolling and zooming

**Acceptance Criteria:**

- [ ] Marker clustering implemented
- [ ] Map events debounced to 100ms
- [ ] Markers memoized
- [ ] Maintains 60 FPS during interactions
- [ ] No performance warnings

---

### Task 7.2: Add Error Handling and Loading States

**Status:** todo
**Priority:** high
**Estimated Time:** 1.5 hours
**Dependencies:** Task 3.1

**Description:**
Implement comprehensive error handling and loading states using NativeWind.

**Implementation Steps:**

1. Add loading skeletons for vehicle list using NativeWind:
   - Skeleton: `className="h-24 bg-gray-200 rounded-xl mx-4 my-2 animate-pulse"`
2. Add error states for all queries
3. Add retry buttons for failed operations
4. Add empty states with appropriate messages
5. Add network error detection
6. Add location permission error handling
7. Style all error/empty states with NativeWind:
   - Container: `className="flex-1 items-center justify-center px-6"`
   - Title: `className="text-lg font-semibold text-dark-400 mb-2"`
   - Message: `className="text-sm text-gray-600 text-center mb-4"`
   - Retry button: `className="bg-primary-700 px-6 py-3 rounded-lg"`

**Acceptance Criteria:**

- [ ] Loading skeletons for all async operations
- [ ] Error states for all queries
- [ ] Retry mechanisms working
- [ ] Empty states with clear messages
- [ ] All styled with NativeWind
- [ ] User-friendly error messages

**Styling Example:**

```tsx
<View className="flex-1 items-center justify-center px-6">
  <Text className="text-lg font-semibold text-dark-400 mb-2">
    No vehicles available
  </Text>
  <Text className="text-sm text-gray-600 text-center mb-4">
    No vehicles available in your area. Try again later.
  </Text>
  <TouchableOpacity className="bg-primary-700 px-6 py-3 rounded-lg">
    <Text className="text-white font-semibold">Retry</Text>
  </TouchableOpacity>
</View>
```

---

### Task 7.3: Add Accessibility Support

**Status:** todo
**Priority:** medium
**Estimated Time:** 1.5 hours
**Dependencies:** Tasks 2.1, 2.2, 2.3

**Description:**
Implement accessibility features for screen readers and touch targets.

**Implementation Steps:**

1. Add accessibility labels to all interactive elements
2. Add accessibility hints for complex interactions
3. Add accessibility roles (button, header, etc.)
4. Ensure minimum touch target size (44x44 points)
5. Add accessibility state (selected, disabled)
6. Test with VoiceOver (iOS) and TalkBack (Android)
7. Add text alternatives for map information

**Acceptance Criteria:**

- [ ] All interactive elements have labels
- [ ] Accessibility hints provided
- [ ] Proper roles assigned
- [ ] Touch targets meet 44x44 minimum
- [ ] Screen reader navigation working
- [ ] Tested with VoiceOver/TalkBack

---

### Task 7.4: Implement Analytics Logging

**Status:** todo
**Priority:** low
**Estimated Time:** 1 hour
**Dependencies:** Task 3.1

**Description:**
Add analytics tracking for key user actions and errors.

**Implementation Steps:**

1. Create `modules/move/analytics.ts`
2. Implement `logMoveError(context, error, metadata)` function
3. Implement `logMoveEvent(event, properties)` function
4. Track destination selection
5. Track vehicle selection
6. Track booking creation
7. Track payment initiation
8. Track errors (location, route, payment)
9. Integrate with existing analytics system

**Acceptance Criteria:**

- [ ] Analytics utility created
- [ ] Key events tracked
- [ ] Errors logged with context
- [ ] No PII logged
- [ ] Integrated with analytics system

---

## Phase 8: Future Enhancements

### Task 8.1: Add Move Scheduling Feature

**Status:** todo
**Priority:** low
**Estimated Time:** 2 hours
**Dependencies:** Task 2.2

**Description:**
Add ability to schedule moves for later dates using NativeWind styling.

**Implementation Steps:**

1. Add "Schedule for later" toggle in DestinationModal
2. Add date/time picker with NativeWind styling:
   - Container: `className="mt-4 p-4 bg-gray-50 rounded-xl"`
   - Label: `className="text-sm font-semibold text-dark-400 mb-2"`
3. Validate scheduled time (2 hours to 30 days ahead)
4. Update booking creation to include scheduledAt
5. Add scheduled moves section in move screen
6. Display upcoming moves with NativeWind:
   - Card: `className="mx-4 my-2 p-4 bg-blue-50 rounded-xl border border-blue-200"`
   - Date: `className="text-sm font-semibold text-primary-700"`

**Acceptance Criteria:**

- [ ] Schedule toggle in modal
- [ ] Date/time picker working
- [ ] Time validation working
- [ ] Scheduled bookings created
- [ ] Upcoming moves displayed
- [ ] All styled with NativeWind

---

### Task 8.2: Add Real-Time Driver Tracking

**Status:** todo
**Priority:** low
**Estimated Time:** 3 hours
**Dependencies:** Task 3.1

**Description:**
Add real-time driver location updates during active moves.

**Implementation Steps:**

1. Create WebSocket connection for driver updates
2. Subscribe to driver location updates
3. Update driver marker position in real-time
4. Show ETA updates
5. Add driver info card with NativeWind:
   - Card: `className="absolute top-20 left-4 right-4 bg-white p-4 rounded-xl shadow-lg"`
   - Driver name: `className="text-lg font-semibold text-dark-400"`
   - ETA: `className="text-sm text-gray-600"`
   - Status: `className="text-xs text-primary-700 font-semibold"`
6. Handle connection errors gracefully
7. Clean up on unmount

**Acceptance Criteria:**

- [ ] WebSocket connection established
- [ ] Driver location updates in real-time
- [ ] ETA updates displayed
- [ ] Driver info card styled with NativeWind
- [ ] Connection errors handled
- [ ] Cleanup on unmount

---

## Phase 9: Final Integration and Testing

### Task 9.1: End-to-End Testing

**Status:** todo
**Priority:** high
**Estimated Time:** 3 hours
**Dependencies:** All previous tasks

**Description:**
Perform comprehensive end-to-end testing of complete user flows.

**Implementation Steps:**

1. Test complete move booking flow:
   - Open move screen
   - Select destination
   - Select vehicle type
   - View available vehicles
   - Select vehicle
   - Confirm move
   - Complete payment
2. Test property navigation flow
3. Test offline route viewing
4. Test error scenarios
5. Test on both iOS and Android
6. Test with different network conditions
7. Document any issues found

**Acceptance Criteria:**

- [ ] Complete booking flow working
- [ ] Property navigation working
- [ ] Offline functionality working
- [ ] Error scenarios handled
- [ ] Tested on iOS and Android
- [ ] No critical bugs found

---

### Task 9.2: Performance Testing

**Status:** todo
**Priority:** medium
**Estimated Time:** 2 hours
**Dependencies:** Task 9.1

**Description:**
Test performance under various conditions and optimize as needed.

**Implementation Steps:**

1. Test with 100+ property markers
2. Test with multiple simultaneous routes
3. Test bottom sheet scrolling performance
4. Test map zooming and panning
5. Measure FPS with React DevTools
6. Test on low-end devices
7. Optimize any performance bottlenecks
8. Document performance metrics

**Acceptance Criteria:**

- [ ] Maintains 60 FPS with 100+ markers
- [ ] Smooth bottom sheet scrolling
- [ ] Smooth map interactions
- [ ] Works on low-end devices
- [ ] Performance metrics documented

---

### Task 9.3: Documentation and Cleanup

**Status:** todo
**Priority:** medium
**Estimated Time:** 1.5 hours
**Dependencies:** Task 9.1

**Description:**
Complete documentation and code cleanup.

**Implementation Steps:**

1. Add JSDoc comments to all public functions
2. Update module README if needed
3. Document API endpoints used
4. Document state management approach
5. Remove console.logs
6. Remove commented code
7. Format code with Prettier
8. Run linter and fix issues
9. Update IMPLEMENTATION_GUIDE.md if needed

**Acceptance Criteria:**

- [ ] All public functions documented
- [ ] API endpoints documented
- [ ] State management documented
- [ ] No console.logs in production code
- [ ] Code formatted and linted
- [ ] Documentation updated

---

## Summary

**Total Estimated Time:** ~45 hours

**Phase Breakdown:**

- Phase 1 (Module Foundation): ~5 hours
- Phase 2 (Core Components): ~9 hours
- Phase 3 (Screen Integration): ~3.5 hours
- Phase 4 (Payment Integration): ~3.5 hours
- Phase 5 (Utilities): ~5 hours
- Phase 6 (Testing): ~8.5 hours
- Phase 7 (Performance & Polish): ~6 hours
- Phase 8 (Future Enhancements): ~5 hours
- Phase 9 (Final Testing): ~6.5 hours

**Critical Path:**

1. Module Foundation (Tasks 1.1-1.5)
2. Core Components (Tasks 2.1-2.5)
3. Screen Integration (Task 3.1)
4. Payment Integration (Tasks 4.1-4.2)
5. End-to-End Testing (Task 9.1)

**Key Styling Reminder:**

- ALL component styling uses NativeWind CSS (className with Tailwind classes)
- StyleSheet.create() ONLY for Mapbox layer styles (LineLayer, SymbolLayer)
- Tab bar protection: `className="absolute bottom-0 left-0 right-0 h-[100px] bg-[#3fbdfd] z-50"`
- Use color tokens via Tailwind: `bg-primary-700`, `text-dark-400`, etc.
