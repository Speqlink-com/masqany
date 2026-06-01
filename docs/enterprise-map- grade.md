MASQANY ENTERPRISE MAP SYSTEM SPECIFICATION

## Version 1.0

## Frontend Architecture (Expo + RNMapbox)

---

# 1. OBJECTIVE

Transform the current Masqany map implementation into a premium enterprise-grade geospatial interaction system that supports:

* Property discovery
* Property clustering
* Vacancy visualization
* Nearby property intelligence
* Relocation booking
* Real-time driver tracking
* Smooth animated movement
* Dynamic routing
* Bolt/Uber-level interaction quality
* Enterprise scalability

The map is no longer a feature.

The map becomes the PRIMARY INTERACTION LAYER of Masqany.

---

# 2. USER EXPERIENCE TARGET

Masqany Maps should feel like a hybrid of:

* Bolt/Uber → logistics + tracking
* Airbnb → property intelligence
* Google Maps → interaction quality

Core UX goals:

* Smooth 60fps map interaction
* Instant zoom/pan response
* Smooth animated vehicle movement
* Perfect cluster rendering
* White clean modern map
* Stable overlays
* Zero jitter during tracking
* Real-time feeling

---

# 3. CORE MAP VISUAL DESIGN

## Map Theme

Use:
mapbox://styles/mapbox/light-v11

Reason:

* White enterprise appearance
* Maximum icon visibility
* Road clarity
* Bolt/Uber-like feel

---

# 4. ROAD SYSTEM DESIGN

## Roads

Map roads should appear:

* light gray
* subtle
* minimal visual noise

## Active Route

The active navigation route MUST:

* use bright blue
* thicker than roads
* animated when possible

Example:

* normal roads → gray
* navigation path → blue

---

# 5. PROPERTY VISUALIZATION SYSTEM

## Property Marker Rules

### Vacant Property

* Blue house icon

### Occupied Property

* Red house icon

### Government Housing

* Cyan/teal icon

### Premium Property

* Gold accent icon

---

# 6. PROPERTY CLUSTERING

## REQUIREMENT

All properties MUST use clustering.

Never render thousands of markers individually.

Use:
Mapbox ShapeSource clustering.

---

# 7. CLUSTER DESIGN

Cluster circles:

* blue background
* white text
* smooth expansion

Cluster interaction:

* tap cluster → zoom into region
* animate camera movement smoothly

---

# 8. MAP CAMERA SYSTEM

The camera system MUST support:

## Modes

### User Follow Mode

Camera follows current user location.

### Overview Mode

Shows:

* user
* destination
* route

### Driver Tracking Mode

Camera dynamically follows moving vehicle.

### Property Explore Mode

Free pan/zoom interaction.

---

# 9. LIVE USER LOCATION SYSTEM

## Requirements

* Real GPS tracking
* Smooth blue pulse dot
* Heading rotation
* Auto-follow option

User location must update smoothly.

Never jump position instantly.

---

# 10. LIVE DRIVER TRACKING

## IMPORTANT

Driver movement MUST be interpolated.

Do NOT jump markers.

Incorrect:
vehicle teleports every update.

Correct:
vehicle glides smoothly.

---

# 11. DRIVER ANIMATION ENGINE

Use:

* Reanimated
* withTiming()
* coordinate interpolation

Update frequency:
every 2–5 seconds.

Visual movement:
continuous.

---

# 12. VEHICLE SIMULATION SYSTEM

While backend is incomplete:
simulate vehicles.

Requirements:

* random road movement
* multiple moving cars
* realistic movement speeds
* moving markers across map

Goal:
make map feel alive.

---

# 13. PROPERTY SEARCH EXPERIENCE

## Default Behavior

When user opens map:

* detect location
* show nearby properties automatically

---

# 14. SEARCH SYSTEM

Must support:

* “Near me”
* Town search
* Map viewport search
* Draw-area search (future)

---

# 15. BOTTOM SHEET SYSTEM

The map should NOT navigate away constantly.

Use:
bottom sheets.

Example:
tap property →
bottom card appears.

Must support:

* swipe
* snap points
* smooth gestures

---

# 16. OVERLAY ARCHITECTURE

Correct layering:

Map
├── Roads
├── Routes
├── Property markers
├── Vehicle markers
├── User marker
├── Bottom sheet
├── Search bar
├── Floating controls

The map remains visible always.

---

# 17. FLOATING CONTROLS

Required controls:

* Locate me
* Recenter map
* Zoom in/out
* Toggle property/relocation mode
* Follow driver

---

# 18. RELOCATION FLOW

Workflow:

User enters:

* pickup
* destination
* property type
* load size

Then:

* nearby movers displayed
* estimated price shown
* route preview generated

---

# 19. ROUTING ENGINE

Use:
Mapbox Directions API.

Requirements:

* dynamic route generation
* ETA
* rerouting
* polyline rendering

---

# 20. ROUTE VISUALIZATION

Requirements:

* blue route line
* rounded corners
* animated camera fit
* destination marker
* estimated arrival

---

# 21. PERFORMANCE REQUIREMENTS

MANDATORY:

## Use FlashList

For property cards.

## Use clustering

For markers.

## Use Reanimated

For all animations.

## Debounce region updates

Prevent excessive rerenders.

## Virtualize overlays

Avoid heavy UI rendering.

---

# 22. INTERACTION QUALITY

Animations MUST:

* run on UI thread
* use transforms only
* avoid layout recalculations

Allowed:

* opacity
* translate
* scale

Avoid:

* width animations
* height animations

---

# 23. REALTIME SYSTEM ARCHITECTURE

Frontend:

* WebSockets

Backend:

* Kafka event streaming

---

# 24. KAFKA EVENT DESIGN

Topics:

driver-location-events
property-updates
booking-events
route-events

---

# 25. MICROSERVICES ARCHITECTURE

Services:

* property-service
* location-service
* tracking-service
* routing-service
* matching-service

---

# 26. GEOQUERY STRATEGY

Future backend:
use PostGIS.

Queries:

* nearby properties
* radius search
* polygon search
* clustering aggregation

---

# 27. INTERACTION SMOOTHNESS TARGETS

Goal Metrics:

Map FPS:
60fps

Vehicle movement:
smooth interpolation

Camera transition:
<300ms

Marker update lag:
minimal

Map gestures:
native-feeling

---

# 28. VISUAL POLISH REQUIREMENTS

Use:

* subtle shadows only
* minimal blur
* soft icon animations
* smooth camera easing

Avoid:

* clutter
* heavy overlays
* excessive labels

---

# 29. FUTURE ENTERPRISE FEATURES

Planned future support:

* Heatmaps
* Traffic overlays
* AI relocation suggestions
* Demand density
* Offline maps
* Geofencing alerts
* Dynamic pricing zones

---

# 30. IMPLEMENTATION PRIORITY

PHASE 1

* White map
* User location
* Property markers
* Clustering

PHASE 2

* Search overlays
* Property cards
* Bottom sheets

PHASE 3

* Relocation workflow
* Routing
* Driver simulation

PHASE 4

* Realtime tracking
* Kafka integration
* WebSockets

PHASE 5

* Enterprise optimization
* Predictive movement
* Geospatial analytics

---

# 31. FINAL EXPERIENCE TARGET

Masqany Maps should feel:

* alive
* cinematic
* responsive
* premium
* spatially intelligent

The user should feel:
“I understand my environment immediately.”

The map is not decoration.

The map is the platform.
