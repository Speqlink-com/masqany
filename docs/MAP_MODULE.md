# Map Module Documentation

## Overview

The Map module powers two core flows in Masqany:
1. **Property Finder** - Clustered property listings with vacancy visualization
2. **Relocation/Moving** - Live user location with route-ready map (future)

## Stack

- **Expo** (dev build required for native modules)
- **@rnmapbox/maps** v10.3.0
- **react-native-reanimated** (already present)
- **Expo Router** (navigation)

## Configuration

### Mapbox Tokens

Two tokens are required:

1. **Public Token** (`pk.`) - Used in app code
   - Stored in `.env` as `publik_key`
   - Used in `BaseMap.tsx` for runtime access

2. **Secret Token** (`sk.`) - Used for downloads only
   - Stored in `.env` as `secrete_key`
   - Used in `app.json` plugin configuration

### Map Settings

```typescript
// constants/mapConfig.ts
export const MAP_CONFIG = {
  center: [37.9062, -0.0236], // Kenya center
  zoom: 5.8,
  bounds: {
    sw: [33.5, -5.5], // Southwest Kenya
    ne: [42.0, 5.5],  // Northeast Kenya
  },
  style: "mapbox://styles/mapbox/light-v11", // White/light theme
  cluster: {
    radius: 50,
    maxZoom: 14,
  },
};
```

## Components

### BaseMap

Reusable map component with Kenya bounds and light style.

```tsx
<BaseMap
  ref={mapRef}
  cameraRef={cameraRef}
  showUserLocation={false}
  onRegionDidChange={handleRegionChange}
>
  {children}
</BaseMap>
```

**Props:**
- `children` - Map overlays (markers, shapes, etc.)
- `followUserLocation` - Auto-follow user location
- `showUserLocation` - Show user location dot
- `onRegionDidChange` - Callback when map region changes
- `cameraRef` - Ref to control camera programmatically

### PropertyMarkers

Displays clustered property markers with vacancy visualization.

```tsx
<PropertyMarkers onMarkerPress={handleMarkerPress} />
```

**Features:**
- Clustering with count badges
- Color-coded markers:
  - 🟢 Green = Vacant
  - 🔴 Red = Occupied
- Tap to select property

### PropertyCard

Property information card for bottom sheet.

```tsx
<PropertyCard
  property={property}
  onPress={() => handlePropertyPress(property)}
/>
```

### MapSearchBar

Search bar overlay for location search.

```tsx
<MapSearchBar
  value={searchQuery}
  onChangeText={setSearchQuery}
  onClear={() => setSearchQuery("")}
  placeholder="Search Nairobi, Rongai..."
/>
```

### LocateMeButton

Floating button to center map on user location.

```tsx
<LocateMeButton onPress={handleLocateMe} />
```

## Mock Data

### Property Data

Located in `constants/mockProperties.ts`:

```typescript
export interface MockProperty {
  id: number;
  coords: [number, number]; // [lng, lat]
  price: number;
  vacant: boolean;
  title: string;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
}
```

**Locations:**
- Nairobi CBD (2 properties)
- Westlands (1 property)
- Kilimani (1 property)
- Rongai (4 properties)
- Ngong (1 property)

### GeoJSON Conversion

```typescript
import { toGeoJSON } from "@/constants/mockProperties";

const geojson = toGeoJSON(mockProperties);
```

## Features

### 1. Property Clustering

Properties automatically cluster based on zoom level:
- Cluster radius: 50px
- Max zoom for clustering: 14
- Cluster color: Primary blue (#20A6FD)
- Count displayed in white text

### 2. Vacancy Visualization

Markers are color-coded:
- **Green (#22C55E)** - Vacant/Available
- **Red (#F75555)** - Occupied

### 3. Map-Based Search

Filter properties by visible map region:

```typescript
const handleRegionChange = async () => {
  const bounds = await mapRef.current?.getVisibleBounds();
  const filtered = properties.filter((p) => {
    const [lng, lat] = p.coords;
    return (
      lng >= bounds[0][0] &&
      lng <= bounds[1][0] &&
      lat >= bounds[0][1] &&
      lat <= bounds[1][1]
    );
  });
  setVisibleProperties(filtered);
};
```

### 4. Camera Animation

Animate to property on marker tap:

```typescript
cameraRef.current?.setCamera({
  centerCoordinate: property.coords,
  zoomLevel: 16,
  animationDuration: 1000,
});
```

## UI Layout

```
┌─────────────────────────────┐
│  Search Bar (top overlay)   │
├─────────────────────────────┤
│                             │
│                             │
│      Map with Markers       │
│                             │
│                             │
│                      [📍]   │ ← Locate Me Button
├─────────────────────────────┤
│  Property Cards (scroll)    │ ← Bottom Sheet
├─────────────────────────────┤
│      Tab Bar (floating)     │
└─────────────────────────────┘
```

## Future Enhancements

### Relocation Flow

The same map will be reused for moving/relocation:

1. **User Location** - Start point
2. **Property Selection** - Destination
3. **Route Display** - Mapbox Directions API
4. **Live Tracking** - Real-time location updates

```tsx
// Future implementation
<BaseMap
  followUserLocation={true}
  showUserLocation={true}
>
  <RouteLayer
    origin={userLocation}
    destination={selectedProperty.coords}
  />
</BaseMap>
```

### Backend Integration

Replace mock data with API calls:

```typescript
// modules/property/hooks.ts
export function usePropertiesInBounds(bounds: Bounds) {
  return useQuery({
    queryKey: ["properties", "bounds", bounds],
    queryFn: () => propertyApi.getPropertiesInBounds(bounds),
  });
}
```

## Troubleshooting

### Map Not Showing

1. Check Mapbox token in `.env`
2. Verify plugin configuration in `app.json`
3. Rebuild app: `pnpm dlx eas-cli build -p android --profile preview`

### Markers Not Appearing

1. Verify GeoJSON format
2. Check coordinates are [longitude, latitude]
3. Ensure properties are within Kenya bounds

### Clustering Not Working

1. Check `clusterRadius` and `clusterMaxZoomLevel`
2. Verify `cluster={true}` on ShapeSource
3. Ensure filter expressions are correct

## Performance Tips

1. **Limit Visible Properties** - Filter by map bounds
2. **Optimize GeoJSON** - Only include necessary properties
3. **Debounce Region Changes** - Avoid excessive filtering
4. **Use Native Driver** - For animations

## Testing

```bash
# Run on device (required for native modules)
pnpm expo run:android
pnpm expo run:ios

# Build for testing
pnpm dlx eas-cli build -p android --profile preview
```

## Resources

- [Mapbox Maps SDK](https://github.com/rnmapbox/maps)
- [Mapbox Styles](https://docs.mapbox.com/api/maps/styles/)
- [GeoJSON Specification](https://geojson.org/)
- [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)
