
---

# 🧠 1. HIGH-LEVEL ARCHITECTURE

Masqany map system should be divided into:

```text
Frontend (Expo + RNMapbox)
    ↓
Realtime Gateway
    ↓
Kafka Event Streams
    ↓
Microservices
```

---

# 🏗️ 2. CORE MAP CAPABILITIES YOU NEED

| Feature                | RNMapbox Support |
| ---------------------- | ---------------- |
| White themed maps      | ✅               |
| Zoom/pinch/rotate      | ✅               |
| Property clustering    | ✅               |
| Live vehicle tracking  | ✅               |
| Turn-by-turn routing   | ✅               |
| Marker distribution    | ✅               |
| User location tracking | ✅               |
| Dynamic route updates  | ✅               |
| Geofencing             | ✅               |
| Heatmaps               | ✅               |
| Realtime updates       | ✅               |
| Offline maps           | ✅               |
| Animated movement      | ✅               |

---

# 🎨 3. WHITE MAP STYLE (Bolt-like)

Use:

```tsx
styleURL="mapbox://styles/mapbox/light-v11"
```

Result:

This gives:

* clean white aesthetic
* road emphasis
* icon clarity
* enterprise feel

---

# 📍 4. USER LOCATION TRACKING

Critical for:

* nearby properties
* relocation pickups
* live routing

Use:

```tsx
<Mapbox.UserLocation visible={true} />

<Mapbox.Camera
  followUserLocation={true}
  followZoomLevel={15}
/>
```

---

# 🏠 5. PROPERTY DISTRIBUTION SYSTEM

You should NOT render properties individually without clustering.

Use:

```tsx
<Mapbox.ShapeSource
  id="properties"
  shape={geojson}
  cluster
  clusterRadius={50}
>
```

---

# 🎯 6. PROPERTY ICON SYSTEM

Suggested semantics:

| State              | Icon                  |
| ------------------ | --------------------- |
| Vacant             | 🔵(3fbdfd) Blue house |
| Occupied           | 🔴 green              |
| Government housing | 🟦 Cyan               |
| Premium            | ⭐                    |

---

# 🧠 7. CLUSTERING (Airbnb-style)

Essential for performance.

```tsx
<Mapbox.CircleLayer
  id="clusters"
  style={{
    circleColor: '#20A6FD',
    circleRadius: 24,
  }}
/>
```

Cluster counts:

```tsx
textField: ['get', 'point_count']
```

---

# 🚗 8. RELOCATION FLOW (Bolt-like)

Architecture:

```text
User enters:
Pickup
Destination
Property type
Vehicle type

↓
Matching Service

↓
Nearby drivers

↓
Live tracking
```

---

# 🧭 9. ROUTING ENGINE

Use:

* Mapbox Directions API

Capabilities:

* shortest route
* ETA
* rerouting
* distance

---

## Example route request

```ts
const url = `
https://api.mapbox.com/directions/v5/mapbox/driving/
${pickupLng},${pickupLat};
${destLng},${destLat}
?geometries=geojson
&access_token=${MAPBOX_TOKEN}
`;
```

---

# 🗺️ 10. DRAW ROUTES

```tsx
<Mapbox.ShapeSource id="route" shape={routeGeoJSON}>
  <Mapbox.LineLayer
    id="routeLine"
    style={{
      lineColor: '#20A6FD',
      lineWidth: 5,
    }}
  />
</Mapbox.ShapeSource>
```

---

# 🚘 11. LIVE DRIVER TRACKING

This is where Kafka becomes important.

---

## Backend flow

```text
Driver App
   ↓
Location updates every 2-5s
   ↓
Kafka Topic: driver-location-events
   ↓
Tracking Service
   ↓
WebSocket Gateway
   ↓
Masqany App
```

---

# ⚡ 12. REALTIME FRONTEND UPDATES

Frontend should use:

* WebSockets
* NOT polling

---

## Example:

```ts
socket.on("driverLocation", (data) => {
  setDriverCoordinate(data.coordinate);
});
```

---

# 🎬 13. ANIMATED DRIVER MOVEMENT

Critical for premium UX.

DON’T jump markers.

Use Reanimated interpolation:

```tsx
withTiming(newCoordinate, {
  duration: 2000
});
```

Bolt/Uber smoothness comes from:

* interpolation
* prediction
* easing

NOT instant coordinate jumps.

---

# 🧠 14. MAP CAMERA SYSTEM

When driver moves:

```tsx
cameraRef.current?.fitBounds(...)
```

Possible modes:

* follow user
* follow driver
* overview route

---

# 🔥 15. SEARCH EXPERIENCE

Masqany should support:

| Search                      | Behavior       |
| --------------------------- | -------------- |
| Near me                     | GPS-based      |
| Draw area                   | polygon search |
| Town search                 | geocoding      |
| Property around visible map | viewport query |

---

# 📡 16. GEOCODING

Use:

* Mapbox Geocoding API

Example:

```text
“Rongai”
→ coordinates
```

---

# 🏘️ 17. PROPERTY AROUND USER

Workflow:

```text
User opens app
→ request location
→ query nearby properties
→ render clusters
```

Frontend-only for now:

* local filtering
* later backend geospatial queries

---

# 🧠 18. ENTERPRISE BACKEND ARCHITECTURE

Your microservices + Kafka setup is excellent for this.

Suggested services:

```text
property-service
location-service
tracking-service
routing-service
notification-service
matching-service
```

Kafka topics:

```text
driver-location-events
property-updates
booking-events
route-events
```

---

# ⚠️ 19. PERFORMANCE REQUIREMENTS (VERY IMPORTANT)

Without this, maps become terrible.

---

## MUST USE:

### FlashList

for bottom cards

---

### Marker virtualization

Do NOT render thousands individually.

---

### Clustering

Mandatory.

---

### Debounced region queries

```ts
lodash.debounce()
```

---

### Reanimated

For:

* driver movement
* bottom sheets
* map transitions

---

# 🎨 20. UI LAYERING (IMPORTANT)

Correct architecture:

```text
Map
 ├── Property markers
 ├── Driver markers
 ├── Route lines
 ├── Bottom cards
 ├── Search overlay
 ├── Floating controls
```

Map is the BASE layer.

---

# 📱 21. RECOMMENDED USER EXPERIENCE

Masqany should feel like:

```text
Airbnb property intelligence
+
Bolt logistics interaction
```

---

# 🚀 22. FUTURE FEATURES

You can later add:

* heatmaps
* traffic overlays
* demand zones
* AI relocation suggestions
* offline maps
* geofencing alerts

---

# 🎯 FINAL TECH STACK

| Layer         | Technology            |
| ------------- | --------------------- |
| Maps          | `@rnmapbox/maps`    |
| Realtime      | WebSockets            |
| Streaming     | Kafka                 |
| Animation     | Reanimated            |
| Lists         | FlashList             |
| Backend       | FastAPI microservices |
| Geospatial DB | PostGIS               |

---

# 🧠 MOST IMPORTANT INSIGHT

The quality of apps like Bolt/Uber is NOT from “maps.”

It comes from:

```text
Realtime architecture
+
animation interpolation
+
camera intelligence
+
geospatial querying
+
render optimization
```

That is what creates the “alive” feeling.

---

# 🚀 NEXT STEP

 build in THIS ORDER:

1. Base white map
2. User location
3. Property clusters
4. Search overlays
5. Routing
6. Live tracking
7. Animated movement
8. Realtime websocket updates
9. Kafka integration
10. Geospatial backend

That sequencing matters enormously.
