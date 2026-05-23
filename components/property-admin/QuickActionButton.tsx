/**
 * QuickActionButton Component
 * 
 * Action button for dashboard quick actions.
 * Used for: My Units, Switch Status, Analytics buttons.
 * 
 * Features:
 * - Background: #28b4f9, rounded corners (20px)
 * - White text, font-inter-semibold, 15px
 * - Padding: 12px vertical, 20px horizontal
 * - Shadow for depth
 * - activeOpacity: 0.8
 * - 10px spacing between buttons
 * - Wraps to next line on small screens
 */

import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface QuickActionButtonProps {
  label: string;
  onPress: () => void;
}

const QuickActionButton = React.memo(({ label, onPress }: QuickActionButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="bg-[#28b4f9] rounded-[20px] px-5 py-3 shadow-md mr-2.5 mb-2.5"
    >
      <Text className="text-white text-[15px] font-inter-semibold">
        {label}
      </Text>
    </TouchableOpacity>
  );
});

QuickActionButton.displayName = "QuickActionButton";

export default QuickActionButton;
