/**
 * AnalyticsCard Component
 * 
 * Displays individual metric with icon, number, and label.
 * Used in dashboard analytics grid (2x2 layout).
 * 
 * Features:
 * - Background: #f3f4f3 with rounded corners and shadow
 * - Icon at top (32x32px)
 * - Value: font-poppins-bold, 24px, #000000
 * - Label: font-inter-medium, 13px, #545454
 * - Tappable with activeOpacity 0.8
 * - React.memo for performance optimization
 */

import { colors, radius, shadow, spacing, typography } from "@/constants/tokens";
import { Image, ImageSource } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AnalyticsCardProps {
  icon: ImageSource;
  value: number | string;
  label: string;
  onPress?: () => void;
}

const AnalyticsCard = React.memo(({ icon, value, label, onPress }: AnalyticsCardProps) => {
  const content = (
    <View style={styles.card}>
      {/* Icon */}
      <Image
        source={icon}
        style={styles.icon}
        contentFit="contain"
        cachePolicy="memory-disk"
        placeholder={icon}
        transition={200}
      />

      {/* Value */}
      <Text style={styles.value}>{value}</Text>

      {/* Label */}
      <Text style={styles.label}>{label}</Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={styles.touchable}
        accessible={true}
        accessibilityLabel={`${label}: ${value}`}
        accessibilityRole="button"
        accessibilityHint={`View detailed ${label.toLowerCase()} analytics`}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View accessible={true} accessibilityLabel={`${label}: ${value}`}>{content}</View>;
});

AnalyticsCard.displayName = "AnalyticsCard";

const styles = StyleSheet.create({
  touchable: {
    flex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: "#f3f4f3",
    borderRadius: radius.md,
    padding: spacing.base,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 110,
    ...shadow.md,
  },
  icon: {
    width: 32,
    height: 32,
    marginBottom: spacing.sm,
  },
  value: {
    fontFamily: typography.family.headingBold,
    fontSize: 24,
    color: colors.dark[400],
    marginBottom: spacing.xs,
  },
  label: {
    fontFamily: typography.family.medium,
    fontSize: 13,
    color: "#545454",
    textAlign: "center",
  },
});

export default AnalyticsCard;
