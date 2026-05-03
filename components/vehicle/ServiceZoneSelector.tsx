/**
 * ServiceZoneSelector Component
 * 
 * Multi-select chips for Kenyan cities
 * Cities: Nairobi, Mombasa, Kisumu, Nakuru, Eldoret
 * Uses NativeWind for styling
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const KENYAN_CITIES = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Eldoret",
] as const;

interface ServiceZoneSelectorProps {
  selectedZones: string[];
  onZonesChange: (zones: string[]) => void;
  error?: string;
}

export function ServiceZoneSelector({
  selectedZones,
  onZonesChange,
  error,
}: ServiceZoneSelectorProps) {
  const toggleZone = (zone: string) => {
    if (selectedZones.includes(zone)) {
      // Remove zone
      onZonesChange(selectedZones.filter((z) => z !== zone));
    } else {
      // Add zone
      onZonesChange([...selectedZones, zone]);
    }
  };

  return (
    <View className="mb-4">
      {/* Label */}
      <Text className="font-inter-medium text-[15px] text-dark-400 mb-2">
        Service Zones <Text className="text-danger">*</Text>
      </Text>

      <Text className="font-inter text-[13px] text-dark-100 mb-3">
        Select cities where you can provide service
      </Text>

      {/* Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
        contentContainerClassName="gap-2"
      >
        {KENYAN_CITIES.map((city) => {
          const isSelected = selectedZones.includes(city);
          return (
            <TouchableOpacity
              key={city}
              onPress={() => toggleZone(city)}
              className={`
                px-4 py-2 rounded-full flex-row items-center
                ${isSelected ? "bg-primary-700" : "bg-light-300"}
              `}
            >
              {isSelected && (
                <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
              )}
              <Text
                className={`
                  font-inter-medium text-[13px] ml-1
                  ${isSelected ? "text-light-400" : "text-dark-400"}
                `}
              >
                {city}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Selected Count */}
      {selectedZones.length > 0 && (
        <Text className="font-inter text-[11px] text-dark-100 mt-2">
          {selectedZones.length} {selectedZones.length === 1 ? "zone" : "zones"} selected
        </Text>
      )}

      {/* Error Message */}
      {error && (
        <Text className="font-inter text-[13px] text-danger mt-2">
          {error}
        </Text>
      )}
    </View>
  );
}
