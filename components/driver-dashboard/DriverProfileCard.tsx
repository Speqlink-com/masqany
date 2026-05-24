/**
 * DriverProfileCard Component
 * 
 * Displays driver profile information including photo, verification status,
 * excellence rating, and current location.
 * 
 * Design Specs:
 * - Width: ~50% of screen width
 * - Height: 50px
 * - Background: Linear gradient from #5ed0e6 to #004aad at 90 degrees
 * - Rounded corners with shadow
 * - Icons: verified-check-icon.webp, review-star-icon.webp, location.png
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 11.1, 11.2, 11.3
 */

import { colors, radius, shadow, spacing, typography } from "@/constants/tokens";
import type { DriverProfile } from "@/modules/driver-dashboard/types";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

// Import icons
const verifiedCheckIcon = require("@/assets/icons/verified-check-icon.webp");
const reviewStarIcon = require("@/assets/icons/review-star-icon.webp");
const locationIcon = require("@/assets/icons/location.png");

interface DriverProfileCardProps {
  profile: DriverProfile;
}

const DriverProfileCard = React.memo(({ profile }: DriverProfileCardProps) => {
  return (
    <LinearGradient
      colors={[colors.gradient.start, colors.gradient.end]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.card}
    >
      {/* Profile Photo */}
      <Image
        source={{ uri: profile.profilePhotoUrl }}
        style={styles.profilePhoto}
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={200}
      />

      {/* Driver Info Container */}
      <View style={styles.infoContainer}>
        {/* Name and Verified Badge Row */}
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {profile.name}
          </Text>
          {profile.isVerified && (
            <Image
              source={verifiedCheckIcon}
              style={styles.verifiedIcon}
              contentFit="contain"
              cachePolicy="memory-disk"
            />
          )}
        </View>

        {/* Rating and Location Row */}
        <View style={styles.detailsRow}>
          {/* Excellence Rating */}
          <View style={styles.ratingContainer}>
            <Image
              source={reviewStarIcon}
              style={styles.starIcon}
              contentFit="contain"
              cachePolicy="memory-disk"
            />
            <Text style={styles.ratingText}>
              {profile.excellenceRating.toFixed(1)}
            </Text>
          </View>

          {/* Location */}
          <View style={styles.locationContainer}>
            <Image
              source={locationIcon}
              style={styles.locationIcon}
              contentFit="contain"
              cachePolicy="memory-disk"
            />
            <Text style={styles.locationText} numberOfLines={1}>
              {profile.currentLocation}
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
});

DriverProfileCard.displayName = "DriverProfileCard";

const styles = StyleSheet.create({
  card: {
    width: "50%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    ...shadow.md,
  },
  profilePhoto: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.light[300],
    marginRight: spacing.sm,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  name: {
    fontFamily: typography.family.semibold,
    fontSize: typography.size.sm,
    color: colors.light[400],
    marginRight: spacing.xs,
    flex: 1,
  },
  verifiedIcon: {
    width: 14,
    height: 14,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  starIcon: {
    width: 12,
    height: 12,
    marginRight: 2,
  },
  ratingText: {
    fontFamily: typography.family.medium,
    fontSize: typography.size.xs,
    color: colors.light[400],
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationIcon: {
    width: 10,
    height: 10,
    marginRight: 2,
  },
  locationText: {
    fontFamily: typography.family.regular,
    fontSize: typography.size.xs,
    color: colors.light[400],
    flex: 1,
  },
});

export default DriverProfileCard;
