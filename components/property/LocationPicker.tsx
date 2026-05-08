/**
 * LocationPicker Component
 * 
 * Map-based location picker using @rnmapbox/maps
 * Allows tap to set property location and auto-fills county
 */

import { MAP_CONFIG } from "@/constants/mapConfig";
import { colors, shadow } from "@/constants/tokens";
import { Ionicons } from "@expo/vector-icons";
import Mapbox from "@rnmapbox/maps";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

// Initialize Mapbox
const MAPBOX_PUBLIC_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN || "";
Mapbox.setAccessToken(MAPBOX_PUBLIC_TOKEN);

interface LocationPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationSelect: (latitude: number, longitude: number, county?: string) => void;
}

export function LocationPicker({
  latitude,
  longitude,
  onLocationSelect,
}: LocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(
    latitude && longitude ? { latitude, longitude } : null
  );

  const handleMapPress = async (feature: any) => {
    const coords = feature.geometry.coordinates;
    const [lng, lat] = coords;

    setSelectedLocation({ latitude: lat, longitude: lng });

    // TODO: Reverse geocode to get county name
    // For now, pass undefined for county
    onLocationSelect(lat, lng, undefined);
  };

  return (
    <View className="mb-4">
      <Text className="font-poppins-semibold text-[15px] text-dark-400 mb-3">
        Property Location
      </Text>

      <View className="h-[300px] rounded-lg overflow-hidden" style={shadow.md}>
        <Mapbox.MapView
          style={StyleSheet.absoluteFill}
          styleURL={MAP_CONFIG.style}
          onPress={handleMapPress}
        >
          <Mapbox.Camera
            zoomLevel={selectedLocation ? 15 : 6}
            centerCoordinate={
              selectedLocation
                ? [selectedLocation.longitude, selectedLocation.latitude]
                : MAP_CONFIG.center
            }
            animationDuration={1000}
          />

          {selectedLocation && (
            <Mapbox.PointAnnotation
              id="selected-location"
              coordinate={[selectedLocation.longitude, selectedLocation.latitude]}
            >
              <View
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.primary[700] }}
              >
                <Ionicons name="home" size={20} color={colors.light[400]} />
              </View>
            </Mapbox.PointAnnotation>
          )}
        </Mapbox.MapView>
      </View>

      <Text className="font-inter text-[11px] text-dark-100 mt-2">
        Tap on the map to set your property location
      </Text>

      {selectedLocation && (
        <View className="mt-2 p-3 bg-primary-50 rounded-lg">
          <Text className="font-inter-medium text-[13px] text-dark-400">
            Selected Location:
          </Text>
          <Text className="font-inter text-[11px] text-dark-100 mt-1">
            Lat: {selectedLocation.latitude.toFixed(6)}, Lng:{" "}
            {selectedLocation.longitude.toFixed(6)}
          </Text>
        </View>
      )}
    </View>
  );
}
