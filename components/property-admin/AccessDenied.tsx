/**
 * AccessDenied Component
 * 
 * Displays when user attempts to access unauthorized features.
 * Shows a friendly message and logs the attempt.
 */

import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface AccessDeniedProps {
  feature: string;
  onGoBack?: () => void;
}

export default function AccessDenied({ feature, onGoBack }: AccessDeniedProps) {
  // Log unauthorized access attempt
  React.useEffect(() => {
    console.warn(`[Access Denied] User attempted to access: ${feature}`);
    // TODO: Send to analytics/monitoring service
  }, [feature]);

  return (
    <View className="flex-1 items-center justify-center px-6 bg-white">
      {/* Lock Icon */}
      <Image
        source={require("@/assets/icons/lock-icon.png")}
        style={{ width: 80, height: 80, tintColor: "#9CA3AF" }}
        contentFit="contain"
        cachePolicy="memory-disk"
        placeholder={require("@/assets/icons/lock-icon.png")}
        transition={200}
      />

      {/* Title */}
      <Text className="text-[20px] font-inter-semibold text-black mt-6 text-center">
        Access Denied
      </Text>

      {/* Message */}
      <Text className="text-[14px] font-inter text-[#545454] mt-3 text-center">
        You don't have permission to access {feature}. Please contact your property owner for access.
      </Text>

      {/* Go Back Button */}
      {onGoBack && (
        <TouchableOpacity
          onPress={onGoBack}
          activeOpacity={0.8}
          className="mt-8 bg-[#28b4f9] px-8 py-3 rounded-full"
        >
          <Text className="text-white text-[15px] font-inter-semibold">
            Go Back
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
