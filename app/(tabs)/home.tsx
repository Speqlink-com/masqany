/**
 * Home — Property Finder with Map
 * 
 * Interactive map showing property listings with user location
 * 
 * NOTE: Mapbox requires a dev build. Run: pnpm expo run:android or build with EAS
 */

import { mockProperties, type MockProperty } from "@/constants/mockProperties";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Lazy load map components to avoid import errors in Expo Go
let BaseMap: any;
let PropertyMarkers: any;
let MapSearchBar: any;
let PropertyCard: any;
let LocateMeButton: any;
let Mapbox: any;
let MAP_CONFIG: any;
let Location: any;

try {
  BaseMap = require("@/components/map/BaseMap").BaseMap;
  PropertyMarkers = require("@/components/map/PropertyMarkers").PropertyMarkers;
  MapSearchBar = require("@/components/map/MapSearchBar").MapSearchBar;
  PropertyCard = require("@/components/map/PropertyCard").PropertyCard;
  LocateMeButton = require("@/components/map/LocateMeButton").LocateMeButton;
  Mapbox = require("@rnmapbox/maps").default;
  MAP_CONFIG = require("@/constants/mapConfig").MAP_CONFIG;
  Location = require("expo-location");
} catch (error) {
  // Mapbox not available (running in Expo Go)
}

export default function HomeScreen() {
  const mapRef = React.useRef<any>(null);
  const cameraRef = React.useRef<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [allProperties] = useState<MockProperty[]>(mockProperties);
  const [filteredProperties, setFilteredProperties] = useState<MockProperty[]>(mockProperties);
  const [selectedProperty, setSelectedProperty] = useState<MockProperty | null>(null);
  const [mapAvailable] = useState(() => {
    try {
      return Mapbox !== undefined && BaseMap !== undefined;
    } catch {
      return false;
    }
  });

  // Filter properties based on search query
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredProperties(allProperties);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = allProperties.filter((property) => {
      return (
        property.title.toLowerCase().includes(lowerQuery) ||
        property.location.toLowerCase().includes(lowerQuery) ||
        property.price.toString().includes(lowerQuery)
      );
    });

    setFilteredProperties(filtered);
  }, [allProperties]);

  // Clear search
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setFilteredProperties(allProperties);
  }, [allProperties]);

  // Handle region change to filter visible properties
  const handleRegionChange = useCallback(async () => {
    if (!mapAvailable || searchQuery) return; // Don't filter if searching
    
    try {
      const bounds = await mapRef.current?.getVisibleBounds();
      if (!bounds) return;

      const filtered = allProperties.filter((property) => {
        const [lng, lat] = property.coords;
        return (
          lng >= bounds[0][0] &&
          lng <= bounds[1][0] &&
          lat >= bounds[0][1] &&
          lat <= bounds[1][1]
        );
      });

      setFilteredProperties(filtered);
    } catch (error) {
      console.error("Error filtering properties:", error);
    }
  }, [mapAvailable, allProperties, searchQuery]);

  // Handle marker press
  const handleMarkerPress = useCallback((propertyId: number) => {
    if (!mapAvailable) return;
    const property = allProperties.find((p) => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      // Animate camera to property
      cameraRef.current?.setCamera({
        centerCoordinate: property.coords,
        zoomLevel: MAP_CONFIG.camera.propertyDetailZoom,
        animationDuration: 1000,
      });
    }
  }, [mapAvailable, allProperties]);

  // Handle locate me button
  const handleLocateMe = useCallback(async () => {
    if (!mapAvailable) return;
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Permission Required",
          "Please enable location permissions to see your current location on the map.",
          [{ text: "OK" }]
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      cameraRef.current?.setCamera({
        centerCoordinate: [location.coords.longitude, location.coords.latitude],
        zoomLevel: MAP_CONFIG.userLocationZoom,
        animationDuration: 1000,
      });
    } catch (error) {
      Alert.alert(
        "Location Error",
        "Unable to get your current location. Please try again.",
        [{ text: "OK" }]
      );
    }
  }, [mapAvailable]);

  // Handle property card press
  const handlePropertyPress = useCallback((property: MockProperty) => {
    Alert.alert(
      property.title,
      `${property.location}\nKES ${property.price.toLocaleString()}/mo\n\n${
        property.vacant ? "✅ Available" : "❌ Occupied"
      }`,
      [{ text: "Close" }]
    );
  }, []);

  // Show error message if Mapbox is not available (Expo Go)
  if (!mapAvailable) {
    return (
      <View style={styles.root}>
        <StatusBar style="dark" />
        <SafeAreaView style={styles.errorContainer} edges={["top"]}>
          <Text style={styles.errorTitle}>🗺️ Map Requires Dev Build</Text>
          <Text style={styles.errorText}>
            Mapbox Maps requires native code and cannot run in Expo Go.
          </Text>
          <Text style={styles.errorText}>
            To test the map, build the app:
          </Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>pnpm expo run:android</Text>
            <Text style={styles.codeText}>or</Text>
            <Text style={styles.codeText}>pnpm dlx eas-cli build -p android</Text>
          </View>
          <Text style={styles.errorSubtext}>
            The map will show {mockProperties.length} properties in Nairobi, Rongai, and surrounding areas with your current location.
          </Text>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      
      {/* Map */}
      <BaseMap
        ref={mapRef}
        cameraRef={cameraRef}
        showUserLocation={true}
        onRegionDidChange={handleRegionChange}
      >
        <PropertyMarkers onMarkerPress={handleMarkerPress} />
      </BaseMap>

      {/* Search Bar Overlay */}
      <SafeAreaView style={styles.searchContainer} edges={["top"]}>
        <MapSearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          onClear={handleClearSearch}
          placeholder="Search Nairobi, Rongai, Westlands..."
        />
      </SafeAreaView>

      {/* Locate Me Button */}
      <LocateMeButton onPress={handleLocateMe} />

      {/* Property Cards Bottom Sheet */}
      <View style={styles.bottomSheet}>
        {filteredProperties.length > 0 ? (
          <FlatList
            data={filteredProperties}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <PropertyCard
                property={item}
                onPress={() => handlePropertyPress(item)}
              />
            )}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>
              No properties found for "{searchQuery}"
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  searchContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 80, // Above tab bar
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: "transparent",
  },
  listContent: {
    paddingHorizontal: 8,
  },
  noResults: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    marginHorizontal: 16,
    borderRadius: 16,
  },
  noResultsText: {
    fontFamily: "Nunito_400Regular",
    fontSize: 14,
    color: "#545454",
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorTitle: {
    fontFamily: "CG-Bold",
    fontSize: 24,
    color: "#000000",
    marginBottom: 16,
    textAlign: "center",
  },
  errorText: {
    fontFamily: "Nunito_400Regular",
    fontSize: 16,
    color: "#545454",
    marginBottom: 12,
    textAlign: "center",
  },
  errorSubtext: {
    fontFamily: "Nunito_400Regular",
    fontSize: 14,
    color: "#BDBDC0",
    marginTop: 24,
    textAlign: "center",
  },
  codeBlock: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
    width: "100%",
  },
  codeText: {
    fontFamily: "Courier",
    fontSize: 13,
    color: "#20A6FD",
    marginVertical: 4,
  },
});
