/**
 * BaseMap Component
 * 
 * Reusable map component with Kenya bounds and detailed street style
 * Automatically requests location permission and centers on user
 */

import { MAP_CONFIG } from "@/constants/mapConfig";
import Mapbox from "@rnmapbox/maps";
import * as Location from "expo-location";
import React, { forwardRef, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

// Set Mapbox access token
const PUBLIC_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN || "pk.eyJ1IjoibWVsdmluc3NpbW9uIiwiYSI6ImNtbnN1MGd0azBkZmkycXF5eXFjZDdmODQifQ.T4NAtHQgGGxndJX1DMfnWg";
Mapbox.setAccessToken(PUBLIC_TOKEN);

interface BaseMapProps {
  children?: React.ReactNode;
  followUserLocation?: boolean;
  showUserLocation?: boolean;
  onRegionDidChange?: (feature: any) => void;
  cameraRef?: React.RefObject<Mapbox.Camera | null>;
}

export const BaseMap = forwardRef<Mapbox.MapView, BaseMapProps>(
  ({ children, followUserLocation = false, showUserLocation = true, onRegionDidChange, cameraRef }, ref) => {
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
            setUserLocation([location.coords.longitude, location.coords.latitude]);
          }
        } catch (error) {
          console.error("Error getting location:", error);
        }
      })();
    }, []);

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
            maxBounds={{
              ne: MAP_CONFIG.bounds.ne,
              sw: MAP_CONFIG.bounds.sw,
            }}
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
});
