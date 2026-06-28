/**
 * BaseMap Component
 * 
 * Reusable map component with Kenya bounds and detailed street style
 * Automatically requests location permission and centers on user
 */

import { MAP_CONFIG } from "@/constants/mapConfig";
import { Mapbox, mapboxUnavailableMessage } from "@/components/map/mapbox";
import * as Location from "expo-location";
import React, { forwardRef, useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface BaseMapProps {
  children?: React.ReactNode;
  followUserLocation?: boolean;
  showUserLocation?: boolean;
  onRegionDidChange?: (feature: any) => void;
  onUserLocationResolved?: (coordinate: [number, number]) => void;
  cameraRef?: React.RefObject<any | null>;
  initialPitch?: number;
  initialZoomLevel?: number;
  gestureSettings?: Record<string, boolean | number>;
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
      initialPitch = 0,
      initialZoomLevel = MAP_CONFIG.zoom,
      gestureSettings,
    },
    ref
  ) => {
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [locationPermission, setLocationPermission] = useState(false);
    const [isMapLoading, setIsMapLoading] = useState(true);

    const handleMapLoaded = useCallback(() => {
      setIsMapLoading(false);
    }, []);

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
          compassViewMargins={{ x: 16, y: 128 }}
          scaleBarEnabled={false}
          logoEnabled={false}
          attributionEnabled={false}
          zoomEnabled
          scrollEnabled
          rotateEnabled
          pitchEnabled
          maxPitch={60}
          gestureSettings={{
            doubleTapToZoomInEnabled: true,
            doubleTouchToZoomOutEnabled: true,
            pinchPanEnabled: true,
            pinchZoomEnabled: true,
            pitchEnabled: true,
            quickZoomEnabled: true,
            rotateEnabled: true,
            simultaneousRotateAndPinchZoomEnabled: true,
            panEnabled: true,
            ...gestureSettings,
          }}
          onDidFinishLoadingMap={handleMapLoaded}
          onMapLoadingError={handleMapLoaded}
        >
          <Mapbox.Camera
            ref={cameraRef}
            zoomLevel={userLocation ? MAP_CONFIG.userLocationZoom : initialZoomLevel}
            centerCoordinate={userLocation || MAP_CONFIG.center}
            pitch={initialPitch}
            minZoomLevel={MAP_CONFIG.camera.minZoom}
            maxZoomLevel={MAP_CONFIG.camera.maxZoom}
            followUserLocation={followUserLocation}
            followZoomLevel={followUserLocation ? MAP_CONFIG.camera.followUserZoom : undefined}
            followPitch={followUserLocation ? initialPitch : undefined}
            animationDuration={2000}
          />

          {showUserLocation && locationPermission && (
            <Mapbox.LocationPuck
              visible={true}
              puckBearingEnabled={true}
              puckBearing="heading"
              pulsing={{
                isEnabled: true,
                color: MAP_CONFIG.colors.property,
                radius: 42,
              }}
            />
          )}

          {children}
        </Mapbox.MapView>
        {isMapLoading && (
          <View pointerEvents="none" style={styles.loadingOverlay}>
            <ActivityIndicator color={MAP_CONFIG.colors.property} size="large" />
          </View>
        )}
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    backgroundColor: "rgba(248, 250, 252, 0.72)",
    justifyContent: "center",
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
