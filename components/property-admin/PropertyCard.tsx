/**
 * PropertyCard Component
 * 
 * Displays property summary in horizontal scrollable list.
 * Used in dashboard "My Properties" section.
 * 
 * Features:
 * - Size: 280px width, 180px height
 * - Background: #f3f4f3 with shadow
 * - Property type badge (top-left, #28b4f9, white text, rounded)
 * - House icon (40x40px)
 * - Property name (font-inter-semibold, 16px)
 * - Location with icon (14x14px)
 * - Total units count
 * - Bill per unit (font-inter-bold, 15px, #28b4f9)
 * - Rating with star icon
 * - 16px spacing between cards
 * - React.memo for performance optimization
 */

import { colors, radius, shadow, spacing, typography } from "@/constants/tokens";
import { Property } from "@/modules/property-admin/types";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PropertyCardProps {
  property: Property;
  onPress: (propertyId: string) => void;
}

const PropertyCard = React.memo(({ property, onPress }: PropertyCardProps) => {
  // Format property type for display
  const formatPropertyType = (type: string): string => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string): string => {
    return `${currency} ${amount.toLocaleString()}`;
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(property.id)}
      activeOpacity={0.8}
      style={styles.card}
      accessible={true}
      accessibilityLabel={`${property.name}, ${property.location.estate}, ${property.totalUnits} units, ${formatCurrency(property.pricePerUnit, property.currency)} per unit, Rating ${property.rating.toFixed(1)}`}
      accessibilityRole="button"
      accessibilityHint="View property units and details"
    >
      {/* Property Type Badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{formatPropertyType(property.type)}</Text>
      </View>

      {/* House Icon */}
      <Image
        source={require('@/assets/icons/house-icon.webp')}
        style={styles.houseIcon}
        contentFit="contain"
        cachePolicy="memory-disk"
        placeholder={require('@/assets/icons/house-icon.webp')}
        transition={200}
      />

      {/* Property Name */}
      <Text style={styles.propertyName} numberOfLines={1}>
        {property.name}
      </Text>

      {/* Location */}
      <View style={styles.locationContainer}>
        <Image
          source={require('@/assets/icons/location.png')}
          style={styles.locationIcon}
          contentFit="contain"
          cachePolicy="memory-disk"
          placeholder={require('@/assets/icons/location.png')}
          transition={200}
        />
        <Text style={styles.locationText} numberOfLines={1}>
          {property.location.estate}, {property.location.county}
        </Text>
      </View>

      {/* Total Units */}
      <Text style={styles.unitsText}>
        {property.totalUnits} {property.totalUnits === 1 ? 'Unit' : 'Units'}
      </Text>

      {/* Bill Per Unit */}
      <Text style={styles.priceText}>
        {formatCurrency(property.pricePerUnit, property.currency)}/unit
      </Text>

      {/* Rating */}
      <View style={styles.ratingContainer}>
        <Image
          source={require('@/assets/icons/star.png')}
          style={styles.starIcon}
          contentFit="contain"
          cachePolicy="memory-disk"
          placeholder={require('@/assets/icons/star.png')}
          transition={200}
        />
        <Text style={styles.ratingText}>
          {property.rating.toFixed(1)}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

PropertyCard.displayName = "PropertyCard";

const styles = StyleSheet.create({
  card: {
    width: 280,
    height: 180,
    backgroundColor: "#f3f4f3",
    borderRadius: radius.md,
    padding: spacing.base,
    marginRight: spacing.base, // 16px spacing between cards
    ...shadow.md,
  },
  badge: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: "#28b4f9",
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  badgeText: {
    fontFamily: typography.family.medium,
    fontSize: 11,
    color: colors.light[400],
  },
  houseIcon: {
    width: 40,
    height: 40,
    marginTop: spacing.xl,
    marginBottom: spacing.xs,
  },
  propertyName: {
    fontFamily: typography.family.semibold,
    fontSize: 16,
    color: colors.dark[400],
    marginBottom: spacing.xs,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  locationIcon: {
    width: 14,
    height: 14,
    marginRight: 4,
  },
  locationText: {
    fontFamily: typography.family.regular,
    fontSize: 13,
    color: "#545454",
    flex: 1,
  },
  unitsText: {
    fontFamily: typography.family.medium,
    fontSize: 13,
    color: colors.dark[400],
    marginBottom: spacing.xs,
  },
  priceText: {
    fontFamily: typography.family.bold,
    fontSize: 15,
    color: "#28b4f9",
    marginBottom: spacing.xs,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  starIcon: {
    width: 14,
    height: 14,
    marginRight: 4,
  },
  ratingText: {
    fontFamily: typography.family.medium,
    fontSize: 13,
    color: colors.dark[400],
  },
});

export default PropertyCard;
