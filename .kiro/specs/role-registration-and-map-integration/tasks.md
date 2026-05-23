# Implementation Plan: Map Module Integration into Move Tab

## Overview

This plan integrates the existing map module components into the Move tab, replacing the placeholder "coming soon" screen with a fully functional map interface that displays property markers, supports location search, and allows users to center on their current location.

## Tasks

- [x] 1. Set up Move tab state management and imports
  - Import all required map components (BaseMap, MapSearchBar, LocateMeButton, PropertyMarkers, PropertyCard)
  - Import mock property data and Mapbox types
  - Set up React state hooks for searchQuery, selectedPropertyId, and camera ref
  - Import expo-location for location services
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 6.1, 6.2_

- [x] 2. Implement BaseMap integration with PropertyMarkers
  - [x] 2.1 Replace placeholder content with BaseMap component
    - Remove ImageBackground, SafeAreaView, and placeholder text
    - Add BaseMap component with ref forwarding
    - Pass cameraRef to BaseMap for camera control
    - Preserve StatusBar with style="dark"
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 6.4_
  
  - [x] 2.2 Add PropertyMarkers as child of BaseMap
    - Render PropertyMarkers component inside BaseMap children
    - Pass handleMarkerPress callback to PropertyMarkers
    - Verify markers display at correct coordinates from mock data
    - _Requirements: 4.1, 4.2_

- [x] 3. Implement map overlay components
  - [x] 3.1 Add MapSearchBar overlay
    - Render MapSearchBar with absolute positioning at top
    - Connect searchQuery state to value prop
    - Connect setSearchQuery to onChangeText prop
    - Implement onClear handler to reset search query
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [x] 3.2 Add LocateMeButton overlay
    - Render LocateMeButton with absolute positioning at bottom-right
    - Implement handleLocateMe function with location permission check
    - Use expo-location to get current position
    - Center camera on user location if permission granted
    - Fallback to Nairobi coordinates if permission denied
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 4. Implement property selection and PropertyCard display
  - [x] 4.1 Add property selection state management
    - Create handleMarkerPress function to update selectedPropertyId
    - Find selected property from mockProperties array
    - _Requirements: 4.4, 5.1_
  
  - [x] 4.2 Add conditional PropertyCard rendering
    - Render PropertyCard when selectedProperty is not null
    - Pass selected property data to PropertyCard
    - Implement onPress handler to clear selection (dismiss card)
    - Position PropertyCard at bottom of screen above tab bar
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 5. Checkpoint - Verify map integration
  - Ensure all tests pass, ask the user if questions arise.
  - Verify map displays with Kenya bounds and street-level detail
  - Verify property markers display at correct locations
  - Verify marker clustering works when zoomed out
  - Verify search bar, locate button, and property card are positioned correctly
  - Test location permission flow on device
  - Test property selection and card display/dismiss

- [ ]* 6. Write unit tests for Move tab
  - Test searchQuery state updates on text input
  - Test searchQuery resets to empty string on clear
  - Test selectedPropertyId updates on marker press
  - Test selectedPropertyId clears on PropertyCard dismiss
  - Test handleLocateMe with granted permission
  - Test handleLocateMe fallback with denied permission
  - _Requirements: 2.2, 2.3, 3.2, 3.4, 4.4, 5.3_

- [ ]* 7. Write integration tests for component composition
  - Test BaseMap renders with PropertyMarkers as child
  - Test MapSearchBar renders with correct props
  - Test LocateMeButton renders with correct props
  - Test PropertyCard renders conditionally based on selection
  - Test marker press triggers PropertyCard display
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 4.4, 5.1_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- All map components are already implemented and tested
- Mock property data is already available in constants/mockProperties.ts
- Mapbox token is already configured in environment variables
- The tab bar transparency is handled by the tab navigator, not the Move tab
- Search functionality (geocoding) is not implemented in this phase - search bar is UI-only
