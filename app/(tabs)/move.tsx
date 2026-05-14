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
