# Design Document: Map Module Integration into Move Tab

## Overview

This design document specifies the integration of the existing map module components into the Move tab. The Move tab currently displays a placeholder screen and will be replaced with a fully functional map interface that displays property markers, supports location search, and allows users to center on their current location.

## Architecture

### Component Hierarchy

```
MoveScreen (app/(tabs)/move.tsx)
├── StatusBar (style="dark")
├── BaseMap (components/map/BaseMap.tsx)
│   ├── Mapbox.MapView
│   ├── Mapbox.Camera
│   ├── Mapbox.UserLocation
│   └── PropertyMarkers (components/map/PropertyMarkers.tsx)
│       ├── Mapbox.ShapeSource (with clustering)
│       ├── Mapbox.CircleLayer (cluster circles)
│       ├── Mapbox.SymbolLayer (cluster counts)
│       ├── Mapbox.SymbolLayer (property icons)
│       └── Mapbox.SymbolLayer (price labels)
├── MapSearchBar (components/map/MapSearchBar.tsx)
├── LocateMeButton (components/map/LocateMeButton.tsx)
└── PropertyCard (components/map/PropertyCard.tsx) [conditional]
```

### State Management

The Move tab will manage the following local state using React hooks:

```typescript
interface MoveScreenState {
  searchQuery: string;           // Current search input value
  selectedPropertyId: number | null;  // ID of selected property for PropertyCard
  cameraRef: React.RefObject<Mapbox.Camera>;  // Reference to map camera for centering
}
```

### Data Flow

1. **Property Data**: Mock property data is imported from `constants/mockProperties.ts`
2. **Map Configuration**: Map settings (bounds, zoom, colors) are imported from `constants/mapConfig.ts`
3. **User Location**: Managed by BaseMap component via expo-location
4. **Property Selection**: Flows from PropertyMarkers → MoveScreen state → PropertyCard

## Component Integration

### 1. BaseMap Integration

The BaseMap component is already implemented and provides:
- Mapbox map rendering with Kenya bounds
- User location tracking and permission handling
- Camera controls via ref
- Children rendering for overlays

**Integration approach:**
```typescript
import { BaseMap } from "@/components/map/BaseMap";

const cameraRef = useRef<Mapbox.Camera>(null);

<BaseMap ref={mapRef} cameraRef={cameraRef}>
  <PropertyMarkers onMarkerPress={handleMarkerPress} />
</BaseMap>
```

### 2. MapSearchBar Integration

The MapSearchBar component provides a search input overlay.

**Integration approach:**
```typescript
import { MapSearchBar } from "@/components/map/MapSearchBar";

const [searchQuery, setSearchQuery] = useState("");

<MapSearchBar
  value={searchQuery}
  onChangeText={setSearchQuery}
  onClear={() => setSearchQuery("")}
  placeholder="Search location..."
/>
```

**Note:** Search functionality (geocoding/filtering) is not implemented in this phase. The search bar is UI-only.

### 3. LocateMeButton Integration

The LocateMeButton component provides a floating action button to center the map.

**Integration approach:**
```typescript
import { LocateMeButton } from "@/components/map/LocateMeButton";
import * as Location from "expo-location";

const handleLocateMe = async () => {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status === "granted") {
      const location = await Location.getCurrentPositionAsync({});
      cameraRef.current?.setCamera({
        centerCoordinate: [location.coords.longitude, location.coords.latitude],
        zoomLevel: 14,
        animationDuration: 1000,
      });
    } else {
      // Fallback to Kenya center
      cameraRef.current?.setCamera({
        centerCoordinate: [36.8219, -1.2921], // Nairobi
        zoomLevel: 12,
        animationDuration: 1000,
      });
    }
  } catch (error) {
    console.error("Error centering map:", error);
  }
};

<LocateMeButton onPress={handleLocateMe} />
```

### 4. PropertyMarkers Integration

The PropertyMarkers component renders property markers with clustering.

**Integration approach:**
```typescript
import { PropertyMarkers } from "@/components/map/PropertyMarkers";

const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);

const handleMarkerPress = (propertyId: number) => {
  setSelectedPropertyId(propertyId);
};

// Inside BaseMap children
<PropertyMarkers onMarkerPress={handleMarkerPress} />
```

### 5. PropertyCard Integration

The PropertyCard component displays property details when a marker is selected.

**Integration approach:**
```typescript
import { PropertyCard } from "@/components/map/PropertyCard";
import { mockProperties } from "@/constants/mockProperties";

const selectedProperty = selectedPropertyId
  ? mockProperties.find(p => p.id === selectedPropertyId)
  : null;

{selectedProperty && (
  <PropertyCard
    property={selectedProperty}
    onPress={() => setSelectedPropertyId(null)}
  />
)}
```

## Layout and Styling

### Screen Structure

```typescript
<View style={{ flex: 1 }}>
  <StatusBar style="dark" />
  
  {/* Full-screen map */}
  <BaseMap ref={mapRef} cameraRef={cameraRef}>
    <PropertyMarkers onMarkerPress={handleMarkerPress} />
  </BaseMap>
  
  {/* Overlays */}
  <MapSearchBar ... />
  <LocateMeButton ... />
  {selectedProperty && <PropertyCard ... />}
</View>
```

### Positioning

- **MapSearchBar**: Absolute positioned at top with `top: 60, left: 16, right: 16`
- **LocateMeButton**: Absolute positioned at `bottom: 200, right: 16` (above tab bar)
- **PropertyCard**: Absolute positioned at bottom with `marginHorizontal: 16, marginVertical: 8`

### Safe Area Handling

The Move tab should NOT use SafeAreaView since the map should extend edge-to-edge. Individual overlay components handle their own safe area spacing.

## Error Handling

### Location Permission Denied

When location permission is denied:
1. BaseMap will not show user location dot
2. LocateMeButton will center on Kenya default coordinates (Nairobi: [36.8219, -1.2921])
3. No error message is shown to user (graceful degradation)

### Map Loading Errors

If Mapbox fails to load:
1. Mapbox SDK will show its default error state
2. No custom error handling is implemented in this phase

### Property Data Errors

Since we're using static mock data, no error handling is needed for property loading.

## Performance Considerations

### Marker Clustering

PropertyMarkers uses Mapbox clustering with:
- `clusterRadius: 50` (from MAP_CONFIG)
- `clusterMaxZoomLevel: 14` (from MAP_CONFIG)
- Automatic clustering for properties within 50px at zoom levels below 14

### Rendering Optimization

- BaseMap uses `React.forwardRef` for ref forwarding
- PropertyMarkers registers custom icon once on mount
- PropertyCard only renders when a property is selected (conditional rendering)

## Dependencies

### Existing Dependencies (already installed)
- `@rnmapbox/maps` - Mapbox SDK for React Native
- `expo-location` - Location services
- `expo-status-bar` - Status bar control
- `react-native-safe-area-context` - Safe area handling

### Environment Variables
- `EXPO_PUBLIC_MAPBOX_TOKEN` - Mapbox access token (already configured)

## Code Example

Complete Move tab implementation:

```typescript
/**
 * Move — relocation services with map interface.
 */
import { BaseMap } from "@/components/map/BaseMap";
import { LocateMeButton } from "@/components/map/LocateMeButton";
import { MapSearchBar } from "@/components/map/MapSearchBar";
import { PropertyCard } from "@/components/map/PropertyCard";
import { PropertyMarkers } from "@/components/map/PropertyMarkers";
import { mockProperties } from "@/constants/mockProperties";
import Mapbox from "@rnmapbox/maps";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function MoveScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const cameraRef = useRef<Mapbox.Camera>(null);
  const mapRef = useRef<Mapbox.MapView>(null);

  const handleMarkerPress = (propertyId: number) => {
    setSelectedPropertyId(propertyId);
  };

  const handleLocateMe = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        cameraRef.current?.setCamera({
          centerCoordinate: [location.coords.longitude, location.coords.latitude],
          zoomLevel: 14,
          animationDuration: 1000,
        });
      } else {
        // Fallback to Nairobi center
        cameraRef.current?.setCamera({
          centerCoordinate: [36.8219, -1.2921],
          zoomLevel: 12,
          animationDuration: 1000,
        });
      }
    } catch (error) {
      console.error("Error centering map:", error);
    }
  };

  const selectedProperty = selectedPropertyId
    ? mockProperties.find((p) => p.id === selectedPropertyId)
    : null;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      <BaseMap ref={mapRef} cameraRef={cameraRef}>
        <PropertyMarkers onMarkerPress={handleMarkerPress} />
      </BaseMap>

      <MapSearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={() => setSearchQuery("")}
        placeholder="Search location..."
      />

      <LocateMeButton onPress={handleLocateMe} />

      {selectedProperty && (
        <PropertyCard
          property={selectedProperty}
          onPress={() => setSelectedPropertyId(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Component Rendering Completeness

*For any* render of the Move tab, all required map components (BaseMap, MapSearchBar, LocateMeButton, PropertyMarkers) SHALL be present in the component tree.

**Validates: Requirements 1.1, 2.1, 3.1, 4.1**

### Property 2: Property Selection State Consistency

*For any* property marker press event, if the property ID is valid, the selectedPropertyId state SHALL be set to that ID and the PropertyCard SHALL render with the corresponding property data.

**Validates: Requirements 4.4, 5.1, 5.2**

### Property 3: Search State Synchronization

*For any* text input in the MapSearchBar, the searchQuery state SHALL reflect the current input value, and clearing the input SHALL reset the state to an empty string.

**Validates: Requirements 2.2, 2.3**

### Property 4: Location Centering Fallback

*For any* LocateMeButton press, if location permission is denied or unavailable, the map camera SHALL center on the default Kenya coordinates without throwing an error.

**Validates: Requirements 3.2, 3.4**

## Testing Strategy

### Unit Tests

Unit tests should focus on:
- State management logic (search query updates, property selection)
- Event handler functions (handleMarkerPress, handleLocateMe)
- Conditional rendering logic (PropertyCard visibility)

### Integration Tests

Integration tests should verify:
- Component composition (BaseMap with PropertyMarkers as children)
- User interactions (marker press → PropertyCard display)
- Location permission handling and fallback behavior

### Manual Testing

Manual testing is required for:
- Visual verification of component positioning
- Map clustering behavior at different zoom levels
- Location permission flow on physical device
- Tab bar transparency over map

## Migration Notes

### Removed Code

The following code from the current Move tab will be removed:
- ImageBackground with `app-full-screen.webp`
- SafeAreaView wrapper
- Placeholder "coming soon" text
- StyleSheet with title and subtitle styles

### Preserved Code

The following will be preserved:
- StatusBar with `style="dark"`
- Root View with `flex: 1`

## Future Enhancements

The following features are out of scope for this phase but may be added later:

1. **Search Functionality**: Geocoding and location search with results
2. **Property Filtering**: Filter properties by price, bedrooms, vacancy status
3. **Property Details Navigation**: Navigate to full property details screen on card press
4. **Real Property Data**: Replace mock data with API calls using TanStack Query
5. **Map Gestures**: Custom gestures for property exploration
6. **Directions**: Route planning to selected properties
