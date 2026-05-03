/**
 * StatusBadge Component
 * 
 * Displays vehicle status with color-coded badge using NativeWind
 * Status types: available, unavailable, in_service, under_maintenance
 */

import type { VehicleStatus } from "@/modules/vehicle";
import React from "react";
import { Text, View } from "react-native";

interface StatusBadgeProps {
  status: VehicleStatus;
  size?: "sm" | "md" | "lg";
}

const STATUS_COLORS: Record<VehicleStatus, string> = {
  available: "bg-success",
  unavailable: "bg-dark-100",
  in_service: "bg-primary-700",
  under_maintenance: "bg-warning",
};

const STATUS_LABELS: Record<VehicleStatus, string> = {
  available: "Available",
  unavailable: "Unavailable",
  in_service: "In Service",
  under_maintenance: "Under Maintenance",
};

const SIZE_CLASSES = {
  sm: "px-1 py-0.5",
  md: "px-2 py-1",
  lg: "px-3 py-2",
};

const TEXT_SIZE_CLASSES = {
  sm: "text-[11px]",
  md: "text-[13px]",
  lg: "text-[15px]",
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const bgColor = STATUS_COLORS[status];
  const label = STATUS_LABELS[status];
  const sizeClass = SIZE_CLASSES[size];
  const textSizeClass = TEXT_SIZE_CLASSES[size];

  return (
    <View className={`${bgColor} ${sizeClass} rounded-lg self-start`}>
      <Text className={`text-light-400 font-inter-medium ${textSizeClass} capitalize`}>
        {label}
      </Text>
    </View>
  );
}
