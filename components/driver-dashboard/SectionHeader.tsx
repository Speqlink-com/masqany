/**
 * SectionHeader Component
 * 
 * Reusable section header for driver dashboard sections.
 * Displays section icon, title, and optional action text.
 * 
 * Features:
 * - Horizontal layout with space-between alignment
 * - Section icon on the left with title (black color)
 * - Optional action text on the right ("refresh", "view all")
 * - Icons: active-move.png, upcoming-moves.png
 * - Touchable action text for user interaction
 */

import { colors, spacing, typography } from "@/constants/tokens";
import { Image, ImageSource } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SectionHeaderProps {
  icon: ImageSource;
  title: string;
  actionText?: string;
  onActionPress?: () => void;
}

const SectionHeader = React.memo(({ icon, title, actionText, onActionPress }: SectionHeaderProps) => {
  return (
    <View style={styles.container}>
      {/* Left side: Icon and Title */}
      <View style={styles.leftSection}>
        <Image
          source={icon}
          style={styles.icon}
          contentFit="contain"
          cachePolicy="memory-disk"
          placeholder={icon}
          transition={200}
        />
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Right side: Optional Action Text */}
      {actionText && onActionPress && (
        <TouchableOpacity
          onPress={onActionPress}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

SectionHeader.displayName = "SectionHeader";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  icon: {
    width: 24,
    height: 24,
  },
  title: {
    fontFamily: typography.family.headingSemiBold,
    fontSize: typography.size.md,
    color: colors.dark[400], // Black color
  },
  actionText: {
    fontFamily: typography.family.medium,
    fontSize: typography.size.sm,
    color: colors.primary[700],
  },
});

export default SectionHeader;
