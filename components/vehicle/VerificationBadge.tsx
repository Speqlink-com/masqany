/**
 * VerificationBadge Component
 * 
 * Displays vehicle verification status with icon and color using NativeWind
 * Status types: verified, pending_verification, rejected
 */

import type { VerificationStatus } from "@/modules/vehicle";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: "sm" | "md" | "lg";
}

const STATUS_CONFIG: Record<
  VerificationStatus,
  { colorClass: string; icon: keyof typeof Ionicons.glyphMap; label: string }
> = {
  verified: {
    colorClass: "bg-success",
    icon: "checkmark-circle",
    label: "Verified",
  },
  pending_verification: {
    colorClass: "bg-warning",
    icon: "time-outline",
    label: "Pending",
  },
  rejected: {
    colorClass: "bg-danger",
    icon: "close-circle",
    label: "Rejected",
  },
};

const SIZE_CLASSES = {
  sm: { container: "px-1 py-0.5", text: "text-[11px]", icon: 12 },
  md: { container: "px-2 py-1", text: "text-[13px]", icon: 14 },
  lg: { container: "px-3 py-2", text: "text-[15px]", icon: 16 },
};

export function VerificationBadge({ status, size = "md" }: VerificationBadgeProps) {
  const config = STATUS_CONFIG[status];
  const sizeConfig = SIZE_CLASSES[size];

  return (
    <View className={`${config.colorClass} ${sizeConfig.container} rounded-lg flex-row items-center self-start gap-1`}>
      <Ionicons name={config.icon} size={sizeConfig.icon} color="#FFFFFF" />
      <Text className={`text-light-400 font-inter-medium ${sizeConfig.text}`}>
        {config.label}
      </Text>
    </View>
  );
}
