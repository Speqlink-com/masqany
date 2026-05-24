/**
 * BaseMap Component
 * 
 * Reusable map component with Kenya bounds and detailed street style
 * Automatically requests location permission and centers on user
 */

import { MAP_CONFIG } from "@/constants/mapConfig";
import { Mapbox, mapboxUnavailableMessage } from "@/components/map/mapbox";
import * as Location from "expo-location";
import React, { forwardRef, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

interface BaseMapProps {
  children?: React.ReactNode;
  followUserLocation?: boolean;
  showUserLocation?: boolean;
  onRegionDidChange?: (feature: any) => void;
  onUserLocationResolved?: (coordinate: [number, number]) => void;
  cameraRef?: React.RefObject<any | null>;
}

export const BaseMap = forwardRef<any, BaseMapProps>(
  (
    {
      children,
      followUserLocation = false,
      showUserLocation = true,
      onRegionDidChange,
      onUserLocationResolved,
      cameraRef,
    },
    ref
  ) => {
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [locationPermission, setLocationPermission] = useState(false);

    // Request location permission on mount
    useEffect(() => {
      (async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === "granted") {
            setLocationPermission(true);
            const location = await Location.getCurrentPositionAsync({});
            const coordinate: [number, number] = [
              location.coords.longitude,
              location.coords.latitude,
            ];
            setUserLocation(coordinate);
            onUserLocationResolved?.(coordinate);
          }
        } catch (error) {
          console.error("Error getting location:", error);
        }
      })();
    }, [onUserLocationResolved]);

    if (!Mapbox) {
      return (
        <View style={[styles.container, styles.unavailable]}>
          <Text style={styles.unavailableTitle}>Map build required</Text>
          <Text style={styles.unavailableText}>{mapboxUnavailableMessage}</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Mapbox.MapView
          ref={ref}
          style={styles.map}
          styleURL={MAP_CONFIG.style}
          onRegionDidChange={onRegionDidChange}
          compassEnabled={true}
          compassViewPosition={3} // Top right
          scaleBarEnabled={false}
          logoEnabled={false}
          attributionEnabled={false}
        >
          <Mapbox.Camera
            ref={cameraRef}
            zoomLevel={userLocation ? MAP_CONFIG.userLocationZoom : MAP_CONFIG.zoom}
            centerCoordinate={userLocation || MAP_CONFIG.center}
            minZoomLevel={MAP_CONFIG.camera.minZoom}
            maxZoomLevel={MAP_CONFIG.camera.maxZoom}
            followUserLocation={followUserLocation}
            followZoomLevel={followUserLocation ? MAP_CONFIG.camera.followUserZoom : undefined}
            animationDuration={2000}
          />

          {showUserLocation && locationPermission && (
            <Mapbox.UserLocation
              visible={true}
              showsUserHeadingIndicator={true}
              androidRenderMode="normal"
            />
          )}

          {children}
        </Mapbox.MapView>
      </View>
    );
  }
);

BaseMap.displayName = "BaseMap";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  unavailable: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    backgroundColor: "#F8FAFC",
  },
  unavailableTitle: {
    color: "#0F172A",
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
    marginBottom: 8,
  },
  unavailableText: {
    color: "#64748B",
    fontFamily: "Nunito_400Regular",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
});
