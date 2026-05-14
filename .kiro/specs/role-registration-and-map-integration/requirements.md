# Requirements Document

## Introduction

This document specifies requirements for integrating the existing map module into the Move tab of the Masqany mobile application. The Move tab currently displays a placeholder "coming soon" screen and needs to be replaced with a fully functional map interface that displays property markers, supports search functionality, and allows users to center the map on their current location.

## Glossary

- **Move_Tab**: The tab navigation screen located at `app/(tabs)/move.tsx` that provides access to relocation services
- **BaseMap**: The core map component that renders the Mapbox map with Kenya bounds and user location tracking
- **MapSearchBar**: The search input overlay component positioned at the top of the map
- **LocateMeButton**: The floating action button that centers the map on the user's current location
- **PropertyMarkers**: The component that renders property location markers with clustering support on the map
- **PropertyCard**: The component that displays detailed property information when a marker is selected
- **Map_Module**: The collection of map-related components located in `components/map/`

## Requirements

### Requirement 1

**User Story:** As a user, I want to see a map interface in the Move tab, so that I can explore properties and relocation services geographically.

#### Acceptance Criteria

1. WHEN a user navigates to the Move tab, THE Move_Tab SHALL render the BaseMap component
2. WHEN the BaseMap is rendered, THE Move_Tab SHALL display the map with Kenya bounds and street-level detail
3. WHEN the map loads, THE BaseMap SHALL request location permission and center on the user's location if granted
4. THE Move_Tab SHALL maintain the transparent floating tab bar over the map interface

### Requirement 2

**User Story:** As a user, I want to search for locations on the map, so that I can quickly navigate to areas of interest.

#### Acceptance Criteria

1. WHEN the Move tab is displayed, THE Move_Tab SHALL render the MapSearchBar component overlaid on the map
2. WHEN a user types in the search bar, THE MapSearchBar SHALL update the search query state
3. WHEN a user clears the search input, THE MapSearchBar SHALL reset the search query to empty
4. THE MapSearchBar SHALL be positioned at the top of the map with appropriate spacing from the safe area

### Requirement 3

**User Story:** As a user, I want to center the map on my current location, so that I can quickly return to viewing properties near me.

#### Acceptance Criteria

1. WHEN the Move tab is displayed, THE Move_Tab SHALL render the LocateMeButton component overlaid on the map
2. WHEN a user taps the LocateMeButton, THE Move_Tab SHALL center the map camera on the user's current location
3. THE LocateMeButton SHALL be positioned in the bottom-right area of the map, above the tab bar
4. WHEN location permission is not granted, THE LocateMeButton SHALL still be visible but center on Kenya's default coordinates

### Requirement 4

**User Story:** As a user, I want to see property markers on the map, so that I can discover available properties in different locations.

#### Acceptance Criteria

1. WHEN the Move tab is displayed, THE Move_Tab SHALL render the PropertyMarkers component as a child of BaseMap
2. WHEN properties are available, THE PropertyMarkers SHALL display markers at each property's coordinates
3. WHEN multiple properties are close together, THE PropertyMarkers SHALL cluster markers to prevent overlap
4. WHEN a user taps a property marker, THE Move_Tab SHALL display the PropertyCard for that property

### Requirement 5

**User Story:** As a user, I want to view property details on the map, so that I can learn about properties without leaving the map interface.

#### Acceptance Criteria

1. WHEN a property marker is selected, THE Move_Tab SHALL render the PropertyCard component overlaid on the map
2. WHEN the PropertyCard is displayed, THE PropertyCard SHALL show the property name, location, price, and key features
3. WHEN a user dismisses the PropertyCard, THE Move_Tab SHALL hide the card and return to the map view
4. THE PropertyCard SHALL be positioned at the bottom of the map, above the tab bar

### Requirement 6

**User Story:** As a developer, I want the Move tab to follow the established architecture patterns, so that the codebase remains maintainable and consistent.

#### Acceptance Criteria

1. THE Move_Tab SHALL import map components from the Map_Module using the established import pattern
2. THE Move_Tab SHALL use React hooks for state management following the project's conventions
3. THE Move_Tab SHALL use NativeWind (Tailwind CSS) classes for styling where applicable
4. THE Move_Tab SHALL maintain the StatusBar configuration with "dark" style
5. THE Move_Tab SHALL use SafeAreaView with appropriate edge configuration
