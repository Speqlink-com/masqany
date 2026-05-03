/**
 * GradientHeader Component
 * 
 * 30% height gradient header with back button, verification badge, title, subtitle
 * Gradient: #5de0e6 to #004aad
 * Uses NativeWind and expo-linear-gradient
 */

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface GradientHeaderProps {
  title: string;
  subtitle: string;
  titleIcon?: keyof typeof Ionicons.glyphMap;
  subtitleIcon?: keyof typeof Ionicons.glyphMap;
  showBackButton?: boolean;
  showVerificationBadge?: boolean;
  verificationStatus?: "pre_verified" | "verified";
  onBackPress?: () => void;
}

export function GradientHeader({
  title,
  subtitle,
  titleIcon = "car-outline",
  subtitleIcon = "person-outline",
  showBackButton = true,
  showVerificationBadge = true,
  verificationStatus = "pre_verified",
  onBackPress,
}: GradientHeaderProps) {
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <LinearGradient
      colors={["#5DE0E6", "#004AAD"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="h-[30%] justify-end pb-6 px-5"
    >
      {/* Back Button */}
      {showBackButton && (
        <TouchableOpacity
          onPress={handleBackPress}
          className="absolute top-12 left-5 w-10 h-10 bg-light-400 rounded-full items-center justify-center"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
      )}

      {/* Verification Badge */}
      {showVerificationBadge && (
        <View className="absolute top-12 right-5 bg-light-400/90 rounded-full px-3 py-1.5 flex-row items-center">
          <Ionicons
            name={verificationStatus === "verified" ? "checkmark-circle" : "shield-checkmark-outline"}
            size={16}
            color={verificationStatus === "verified" ? "#22C55E" : "#20A6FD"}
          />
          <Text className="font-inter-medium text-[11px] text-dark-400 ml-1">
            {verificationStatus === "verified" ? "Verified Account" : "Pre-Verified"}
          </Text>
        </View>
      )}

      {/* Title */}
      <View className="flex-row items-center mb-2">
        <Ionicons name={titleIcon} size={24} color="#FFFFFF" />
        <Text className="font-poppins-bold text-[20px] text-light-400 ml-2 flex-1">
          {title}
        </Text>
      </View>

      {/* Subtitle */}
      <View className="flex-row items-center">
        <Ionicons name={subtitleIcon} size={16} color="#FFFFFF" />
        <Text className="font-inter text-[13px] text-light-400 ml-2 flex-1">
          {subtitle}
        </Text>
      </View>
    </LinearGradient>
  );
}
