/**
 * MetricsCard Component
 * 
 * Displays a single performance metric with icon, label, and value.
 * Used in the driver dashboard metrics grid (2x2 layout).
 * 
 * Features:
 * - Uniform size card with gradient background (90deg from #5ed0e6 to #004aad)
 * - Display icon, label, and value
 * - Icons: trip-metrics.png, income-metrics.png, clients-metrics.png, location.png (for km)
 * - Rounded corners with shadow styling
 * - React.memo for performance optimization
 */

import { colors, radius, shadow, spacing, typography } from "@/constants/tokens";
import { Image, ImageSource } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface MetricsCardProps {
  icon: ImageSource;
  label: string;
  value: number | string;
  unit?: string;
}

const MetricsCard = React.memo(({ icon, label, value, unit }: MetricsCardProps) => {
  return (
    <LinearGradient
      colors={[colors.gradient.start, colors.gradient.end]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.card}
    >
      <View style={styles.content}>
        {/* Icon */}
        <Image
          source={icon}
          style={styles.icon}
          contentFit="contain"
          cachePolicy="memory-disk"
          placeholder={icon}
          transition={200}
        />

        {/* Value with optional unit */}
        <Text style={styles.value}>
          {value}
          {unit && <Text style={styles.unit}> {unit}</Text>}
        </Text>

        {/* Label */}
        <Text style={styles.label}>{label}</Text>
      </View>
    </LinearGradient>
  );
});

MetricsCard.displayName = "MetricsCard";

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radius.md,
    minHeight: 110,
    ...shadow.md,
  },
  content: {
    flex: 1,
    padding: spacing.base,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 32,
    height: 32,
    marginBottom: spacing.sm,
  },
  value: {
    fontFamily: typography.family.headingBold,
    fontSize: 24,
    color: colors.light[400],
    marginBottom: spacing.xs,
  },
  unit: {
    fontFamily: typography.family.headingBold,
    fontSize: 16,
    color: colors.light[400],
  },
  label: {
    fontFamily: typography.family.medium,
    fontSize: 13,
    color: colors.light[400],
    textAlign: "center",
  },
});

export default MetricsCard;
