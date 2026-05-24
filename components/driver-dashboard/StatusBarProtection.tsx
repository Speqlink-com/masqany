/**
 * StatusBarProtection Component
 * 
 * Blue bar at the top of the screen that provides visual spacing for the device status bar.
 * Prevents menu icons and other UI elements from overlapping with the system status bar.
 * 
 * Height: 3.5% of screen height
 * Background: #20A6FD (primary-700)
 * Position: Absolute with z-index 50
 */

import { colors } from "@/constants/tokens";
import React from "react";
import { Dimensions, View } from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const STATUS_BAR_HEIGHT = SCREEN_HEIGHT * 0.035; // 3.5% of screen height

export default function StatusBarProtection() {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: STATUS_BAR_HEIGHT,
        backgroundColor: colors.primary[700], // #20A6FD
        zIndex: 50,
      }}
    />
  );
}
