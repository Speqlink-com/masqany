/**
 * VehicleHeader Component
 * 
 * Header component for vehicle details screen using NativeWind
 * Displays plate number, vehicle type, and verification badge
 */

import type { Vehicle } from "@/modules/vehicle";
import React from "react";
import { Text, View } from "react-native";
import { VerificationBadge } from "./VerificationBadge";

interface VehicleHeaderProps {
  vehicle: Vehicle;
}

const VEHICLE_TYPE_LABELS: Record<string, string> = {
  truck: "Truck",
  mini_truck: "Mini Truck",
  pickup: "Pickup",
};

export function VehicleHeader({ vehicle }: VehicleHeaderProps) {
  return (
    <View className="px-5 py-4">
      {/* Plate Number */}
      <Text className="font-poppins-bold text-[26px] text-dark-400 mb-1">
        {vehicle.plateNumber}
      </Text>

      {/* Vehicle Type */}
      <Text className="font-inter text-[15px] text-dark-100 mb-3">
        {VEHICLE_TYPE_LABELS[vehicle.vehicleType] || vehicle.vehicleType}
      </Text>

      {/* Verification Badge */}
      <VerificationBadge status={vehicle.verificationStatus} size="md" />

      {/* Rejection Reason (if rejected) */}
      {vehicle.verificationStatus === "rejected" && vehicle.rejectionReason && (
        <View className="mt-3 p-3 bg-danger/20 rounded-lg border-l-4 border-danger">
          <Text className="font-inter-semibold text-[13px] text-danger mb-1">
            Rejection Reason:
          </Text>
          <Text className="font-inter text-[13px] text-dark-200">
            {vehicle.rejectionReason}
          </Text>
        </View>
      )}
    </View>
  );
}
