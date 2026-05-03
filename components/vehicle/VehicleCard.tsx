/**
 * VehicleCard Component
 * 
 * Displays vehicle summary in list view with plate number, type, status, and actions
 * Uses NativeWind for styling
 */

import type { Vehicle } from "@/modules/vehicle";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { StatusBadge } from "./StatusBadge";
import { VerificationBadge } from "./VerificationBadge";

interface VehicleCardProps {
  vehicle: Vehicle;
  onPress: () => void;
  onSetActive?: () => void;
  showActions?: boolean;
}

const VEHICLE_TYPE_LABELS: Record<string, string> = {
  truck: "Truck",
  mini_truck: "Mini Truck",
  pickup: "Pickup",
};

export function VehicleCard({ vehicle, onPress, onSetActive, showActions = false }: VehicleCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="bg-[#e1e6e8] rounded-lg p-4 mb-3 shadow-sm"
    >
      {/* Header Row: Plate Number and Active Badge */}
      <View className="flex-row items-center justify-between mb-2">
        <Text className="font-inter-semibold text-lg text-dark-400">
          {vehicle.plateNumber}
        </Text>
        
        {vehicle.isActive && (
          <LinearGradient
            colors={["#5DE0E6", "#004AAD"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="px-2 py-1 rounded-lg"
          >
            <Text className="text-light-400 font-inter-medium text-[11px]">
              Active
            </Text>
          </LinearGradient>
        )}
      </View>

      {/* Vehicle Type */}
      <Text className="font-inter text-[13px] text-dark-100 mb-2">
        {VEHICLE_TYPE_LABELS[vehicle.vehicleType] || vehicle.vehicleType}
      </Text>

      {/* Capacity */}
      <Text className="font-inter text-[13px] text-dark-100 mb-3">
        Capacity: {vehicle.capacity} {vehicle.capacityUnit}
      </Text>

      {/* Badges Row */}
      <View className="flex-row items-center gap-2 flex-wrap">
        <StatusBadge status={vehicle.status} size="sm" />
        <VerificationBadge status={vehicle.verificationStatus} size="sm" />
      </View>

      {/* Set Active Button (if applicable) */}
      {showActions && !vehicle.isActive && vehicle.verificationStatus === "verified" && onSetActive && (
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            onSetActive();
          }}
          className="mt-3 bg-primary-700 py-2 px-4 rounded-lg items-center"
        >
          <Text className="text-light-400 font-inter-semibold text-[13px]">
            Set Active
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
