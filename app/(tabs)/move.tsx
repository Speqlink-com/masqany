/**
 * Move — relocation services with map interface.
 */
import { BaseMap } from "@/components/map/BaseMap";
import { LocateMeButton } from "@/components/map/LocateMeButton";
import { MapSearchBar } from "@/components/map/MapSearchBar";
import { MoveBottomSheet } from "@/components/map/MoveBottomSheet";
import { MoveMapLayers } from "@/components/map/MoveMapLayers";
import { PropertyMarkers } from "@/components/map/PropertyMarkers";
import { MAP_CONFIG } from "@/constants/mapConfig";
import { mockProperties } from "@/constants/mockProperties";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MoveScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [currentCoordinate, setCurrentCoordinate] = useState<[number, number] | null>(null);
  const [sheetFraction, setSheetFraction] = useState(0.7);
  const cameraRef = useRef<any>(null);
  const mapRef = useRef<any>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { height } = useWindowDimensions();

  const handleMarkerPress = (propertyId: number) => {
    setSelectedPropertyId(propertyId);
    const property = mockProperties.find((p) => p.id === propertyId);
    if (property) {
      cameraRef.current?.setCamera({
        centerCoordinate: property.coords,
        zoomLevel: MAP_CONFIG.camera.propertyDetailZoom,
        animationDuration: 900,
      });
    }
  };

  const handleLocateMe = async () => {
    try {
      let { status } = await Location.getForegroundPermissionsAsync();
      if (status !== "granted") {
        ({ status } = await Location.requestForegroundPermissionsAsync());
      }

      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        const coordinate: [number, number] = [
          location.coords.longitude,
          location.coords.latitude,
        ];
        setCurrentCoordinate(coordinate);
        cameraRef.current?.setCamera({
          centerCoordinate: coordinate,
          zoomLevel: MAP_CONFIG.userLocationZoom,
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

  const bottomInset = tabBarHeight + 8;
  const availableMapHeight = Math.max(height - bottomInset, 1);
  const locateButtonBottom = bottomInset + availableMapHeight * sheetFraction + 16;

  const handleOpenProperty = (propertyId: number) => {
    router.push({
      pathname: "/property/[propertyId]",
      params: { propertyId: String(propertyId) },
    } as never);
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      <BaseMap
        ref={mapRef}
        cameraRef={cameraRef}
        followUserLocation
        onUserLocationResolved={setCurrentCoordinate}
      >
        <MoveMapLayers currentCoordinate={currentCoordinate} />
        <PropertyMarkers onMarkerPress={handleMarkerPress} />
      </BaseMap>

      <MapSearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={() => setSearchQuery("")}
        placeholder="Search location..."
        top={Math.max(insets.top + 12, 54)}
      />

      <LocateMeButton onPress={handleLocateMe} bottom={locateButtonBottom} />

      <MoveBottomSheet
        bottomInset={bottomInset}
        selectedPropertyId={selectedPropertyId}
        onSelectProperty={handleMarkerPress}
        onOpenProperty={handleOpenProperty}
        onSnapChange={setSheetFraction}
      />

      <View pointerEvents="none" style={styles.tabBarProtection}>
        <View style={styles.tabDivider} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  tabBarProtection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "#3fbdfd",
    zIndex: 1,
  },
  tabDivider: {
    height: 1,
    backgroundColor: "#000000",
  },
});
