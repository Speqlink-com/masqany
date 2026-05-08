/**
 * AmenitySelector Component
 * 
 * Toggle-based amenity selection (NOT text input)
 * Displays amenities as clickable buttons with selected/unselected states
 */

import { colors, spacing } from "@/constants/tokens";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

interface AmenitySelectorProps {
  category: string;
  amenities: string[];
  selectedAmenities: string[];
  onToggle: (amenity: string) => void;
}

export function AmenitySelector({
  category,
  amenities,
  selectedAmenities,
  onToggle,
}: AmenitySelectorProps) {
  return (
    <View className="mb-6">
      {/* Category Header */}
      <Text className="font-poppins-semibold text-[15px] text-dark-400 mb-3">
        {category}
      </Text>

      {/* Amenity Grid */}
      <View className="flex-row flex-wrap gap-2">
        {amenities.map((amenity) => (
          <AmenityButton
            key={amenity}
            amenity={amenity}
            isSelected={selectedAmenities.includes(amenity)}
            onPress={() => onToggle(amenity)}
          />
        ))}
      </View>
    </View>
  );
}

interface AmenityButtonProps {
  amenity: string;
  isSelected: boolean;
  onPress: () => void;
}

function AmenityButton({ amenity, isSelected, onPress }: AmenityButtonProps) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        className="rounded-full"
        style={{
          backgroundColor: isSelected ? colors.primary[700] : "#E1E6E8",
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
        }}
      >
        <Text
          className="font-inter-medium text-[13px]"
          style={{
            color: isSelected ? colors.light[400] : colors.dark[400],
          }}
        >
          {amenity}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
