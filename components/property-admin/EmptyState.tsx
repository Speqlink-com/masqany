/**
 * EmptyState Component
 * 
 * Displays empty state with illustration and action button.
 * Used when no properties, units, or agents exist.
 * 
 * Features:
 * - Centered illustration
 * - Title: font-poppins-semibold, 18px
 * - Message: font-inter, 14px, #545454
 * - Action button based on variant
 * - Button styling matches QuickActionButton
 */

import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface EmptyStateProps {
  variant: 'no-properties' | 'no-units' | 'no-agents';
  onActionPress?: () => void;
}

const EmptyState = React.memo(({ variant, onActionPress }: EmptyStateProps) => {
  const getContent = () => {
    switch (variant) {
      case 'no-properties':
        return {
          title: "No Properties Yet",
          message: "Start by adding your first property to manage your rentals",
          actionLabel: "Add Property",
          icon: require('@/assets/icons/house-icon.webp'),
        };
      case 'no-units':
        return {
          title: "No Units Available",
          message: "This property doesn't have any units yet",
          actionLabel: "Add Units",
          icon: require('@/assets/icons/house-icon.webp'),
        };
      case 'no-agents':
        return {
          title: "No Agents Yet",
          message: "Hire agents to help manage your properties",
          actionLabel: "Hire Agent",
          icon: require('@/assets/icons/house-icon.webp'),
        };
      default:
        return {
          title: "No Data",
          message: "Nothing to display here",
          actionLabel: "Go Back",
          icon: require('@/assets/icons/house-icon.webp'),
        };
    }
  };

  const content = getContent();

  return (
    <View className="flex-1 items-center justify-center px-8">
      {/* Illustration */}
      <Image
        source={content.icon}
        className="w-32 h-32 mb-6 opacity-30"
        contentFit="contain"
        cachePolicy="memory-disk"
        placeholder={content.icon}
        transition={200}
      />

      {/* Title */}
      <Text className="text-[18px] font-poppins-semibold text-black text-center mb-2">
        {content.title}
      </Text>

      {/* Message */}
      <Text className="text-[14px] font-inter text-[#545454] text-center mb-8">
        {content.message}
      </Text>

      {/* Action Button */}
      {onActionPress && (
        <TouchableOpacity
          onPress={onActionPress}
          activeOpacity={0.8}
          className="bg-[#28b4f9] rounded-[20px] px-8 py-3 shadow-md"
        >
          <Text className="text-white text-[15px] font-inter-semibold">
            {content.actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

EmptyState.displayName = "EmptyState";

export default EmptyState;
