/**
 * RoomCard Component
 * 
 * Displays individual unit in grid with status-based color coding.
 * Used in units screen grid (4 per row).
 * 
 * Features:
 * - Square card with equal width/height, rounded corners (12px)
 * - Background color based on status:
 *   - Occupied: #22C55E (green)
 *   - Vacant: #28b4f9 (blue)
 *   - Vacant Soon: #F59E0B (yellow)
 * - Status icon at top (28x28px, white)
 * - Room number (font-inter-bold, 18px, white)
 * - Status text (font-inter-medium, 12px, white)
 * - Tick mark icon at bottom
 * - 8px spacing between cards
 * - React.memo for performance optimization
 */

import { colors, spacing, typography } from "@/constants/tokens";
import { Unit } from "@/modules/property-admin/types";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface RoomCardProps {
  unit: Unit;
  onPress: (unitId: string) => void;
}

const RoomCard = React.memo(({ unit, onPress }: RoomCardProps) => {
  // Get background color based on status
  const getBackgroundColor = (): string => {
    switch (unit.status) {
      case 'occupied':
        return colors.success; // #22C55E (green)
      case 'vacant':
        return '#28b4f9'; // blue
      case 'vacant_soon':
        return colors.warning; // #F59E0B (yellow)
      default:
        return '#28b4f9';
    }
  };

  // Get status icon based on status
  const getStatusIcon = () => {
    switch (unit.status) {
      case 'occupied':
        return require('@/assets/icons/occupied-prop-icon.png');
      case 'vacant':
        return require('@/assets/icons/vaccant-prop-icon.webp');
      case 'vacant_soon':
        return require('@/assets/icons/vaccant-prop-icon.webp');
      default:
        return require('@/assets/icons/vaccant-prop-icon.webp');
    }
  };

  // Format status text for display
  const getStatusText = (): string => {
    switch (unit.status) {
      case 'occupied':
        return 'Occupied';
      case 'vacant':
        return 'Vacant';
      case 'vacant_soon':
        return 'Vacant Soon';
      default:
        return 'Vacant';
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(unit.id)}
      activeOpacity={0.8}
      style={[styles.card, { backgroundColor: getBackgroundColor() }]}
      accessible={true}
      accessibilityLabel={`Room ${unit.roomNumber}, ${getStatusText()}`}
      accessibilityRole="button"
      accessibilityHint="Change unit status"
    >
      {/* Status Icon */}
      <Image
        source={getStatusIcon()}
        style={styles.statusIcon}
        contentFit="contain"
        cachePolicy="memory-disk"
        placeholder={getStatusIcon()}
        transition={200}
      />

      {/* Room Number */}
      <Text style={styles.roomNumber} numberOfLines={1}>
        {unit.roomNumber}
      </Text>

      {/* Status Text */}
      <Text style={styles.statusText} numberOfLines={1}>
        {getStatusText()}
      </Text>

      {/* Tick Mark Icon */}
      <Image
        source={require('@/assets/icons/black-check-icon.webp')}
        style={styles.tickIcon}
        contentFit="contain"
        cachePolicy="memory-disk"
        placeholder={require('@/assets/icons/black-check-icon.webp')}
        transition={200}
      />
    </TouchableOpacity>
  );
});

RoomCard.displayName = "RoomCard";

const styles = StyleSheet.create({
  card: {
    aspectRatio: 1, // Square card with equal width/height
    borderRadius: 12,
    padding: spacing.sm,
    margin: 4, // 8px spacing between cards (4px on each side)
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusIcon: {
    width: 28,
    height: 28,
    tintColor: colors.light[400], // white
  },
  roomNumber: {
    fontFamily: typography.family.bold,
    fontSize: 18,
    color: colors.light[400], // white
    textAlign: "center",
  },
  statusText: {
    fontFamily: typography.family.medium,
    fontSize: 12,
    color: colors.light[400], // white
    textAlign: "center",
  },
  tickIcon: {
    width: 16,
    height: 16,
    tintColor: colors.light[400], // white
  },
});

export default RoomCard;
