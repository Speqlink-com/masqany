/**
 * UpcomingMoveCard Component
 * 
 * Displays available move request details for drivers to accept or reject.
 * First-come-first-serve model - the first driver to confirm gets the job.
 * 
 * Design Specs:
 * - Background: #E1E6E8
 * - Rounded corners with shadow
 * - Displays: request icon, client name, unit type, cost (KES), locations, time, date
 * - Action buttons: Confirm (accept) and Reject
 * - All buttons meet 44x44 minimum touch target size
 * 
 * Requirements: 5.2, 5.3, 5.4, 5.5, 13.4, 13.5, 15.4
 */

import { colors, radius, spacing, typography } from "@/constants/tokens";
import type { MoveRequest } from "@/modules/driver-dashboard/types";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Import icons
const requestIcon = require("@/assets/icons/request-icon.png");
const locationIcon = require("@/assets/icons/location.png");
const timeIcon = require("@/assets/icons/time.png");
const calendarIcon = require("@/assets/icons/upcoming-time-icon.webp");

interface UpcomingMoveCardProps {
  moveRequest: MoveRequest;
  onConfirm: (moveRequestId: string) => void;
  onReject: (moveRequestId: string) => void;
}

const UpcomingMoveCard = React.memo(({ moveRequest, onConfirm, onReject }: UpcomingMoveCardProps) => {
  const handleConfirm = () => {
    onConfirm(moveRequest.id);
  };

  const handleReject = () => {
    onReject(moveRequest.id);
  };

  // Format date to readable format (e.g., "Jan 15, 2024")
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Format cost with KES currency
  const formatCost = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  return (
    <View style={styles.card}>
      {/* Header Row - Request Icon, Client Name, Unit Type */}
      <View style={styles.headerRow}>
        <Image
          source={requestIcon}
          style={styles.requestIcon}
          contentFit="contain"
          cachePolicy="memory-disk"
        />
        <View style={styles.headerInfo}>
          <Text style={styles.clientName}>{moveRequest.clientName}</Text>
          <Text style={styles.unitType}>{moveRequest.unitType}</Text>
        </View>
      </View>

      {/* Cost Display */}
      <View style={styles.costContainer}>
        <Text style={styles.costLabel}>Service Cost</Text>
        <Text style={styles.costValue}>{formatCost(moveRequest.serviceCost)}</Text>
      </View>

      {/* Location Details */}
      <View style={styles.locationSection}>
        {/* Pickup Location */}
        <View style={styles.locationRow}>
          <Image
            source={locationIcon}
            style={styles.locationIconSmall}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>Pickup</Text>
            <Text style={styles.locationText} numberOfLines={1}>
              {moveRequest.pickupLocation}
            </Text>
          </View>
        </View>

        {/* Destination Location */}
        <View style={styles.locationRow}>
          <Image
            source={locationIcon}
            style={styles.locationIconSmall}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>Destination</Text>
            <Text style={styles.locationText} numberOfLines={1}>
              {moveRequest.destinationLocation}
            </Text>
          </View>
        </View>
      </View>

      {/* Time and Date Details */}
      <View style={styles.scheduleSection}>
        {/* Time Allocated */}
        <View style={styles.scheduleItem}>
          <Image
            source={timeIcon}
            style={styles.scheduleIcon}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
          <Text style={styles.scheduleText}>
            {moveRequest.timeAllocated} {moveRequest.timeAllocated === 1 ? 'hour' : 'hours'}
          </Text>
        </View>

        {/* Date */}
        <View style={styles.scheduleItem}>
          <Image
            source={calendarIcon}
            style={styles.scheduleIcon}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
          <Text style={styles.scheduleText}>{formatDate(moveRequest.scheduledDate)}</Text>
        </View>

        {/* Time */}
        <View style={styles.scheduleItem}>
          <Image
            source={timeIcon}
            style={styles.scheduleIcon}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
          <Text style={styles.scheduleText}>{moveRequest.scheduledTime}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.confirmButton]}
          onPress={handleConfirm}
          activeOpacity={0.7}
          accessibilityLabel="Confirm move request"
          accessibilityRole="button"
        >
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={handleReject}
          activeOpacity={0.7}
          accessibilityLabel="Reject move request"
          accessibilityRole="button"
        >
          <Text style={styles.rejectButtonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

UpcomingMoveCard.displayName = "UpcomingMoveCard";

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#E1E6E8",
    borderRadius: 20,
    padding: spacing.base,
    marginBottom: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  requestIcon: {
    width: 40,
    height: 40,
    marginRight: spacing.sm,
  },
  headerInfo: {
    flex: 1,
  },
  clientName: {
    fontFamily: typography.family.semibold,
    fontSize: typography.size.base,
    color: colors.dark[300],
    marginBottom: 2,
  },
  unitType: {
    fontFamily: typography.family.regular,
    fontSize: typography.size.sm,
    color: colors.dark[100],
  },
  costContainer: {
    backgroundColor: colors.light[400],
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  costLabel: {
    fontFamily: typography.family.medium,
    fontSize: typography.size.sm,
    color: colors.dark[100],
  },
  costValue: {
    fontFamily: typography.family.bold,
    fontSize: typography.size.md,
    color: colors.primary[700],
  },
  locationSection: {
    marginBottom: spacing.md,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  locationIconSmall: {
    width: 16,
    height: 16,
    marginTop: 2,
    marginRight: spacing.xs,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    fontFamily: typography.family.medium,
    fontSize: typography.size.xs,
    color: colors.dark[100],
    marginBottom: 2,
  },
  locationText: {
    fontFamily: typography.family.regular,
    fontSize: typography.size.sm,
    color: colors.dark[300],
  },
  scheduleSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  scheduleItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light[400],
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  scheduleIcon: {
    width: 14,
    height: 14,
    marginRight: spacing.xs,
  },
  scheduleText: {
    fontFamily: typography.family.medium,
    fontSize: typography.size.xs,
    color: colors.dark[300],
  },
  actionButtons: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    minHeight: 44,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  confirmButton: {
    backgroundColor: colors.primary[700],
  },
  confirmButtonText: {
    fontFamily: typography.family.semibold,
    fontSize: typography.size.base,
    color: colors.light[400],
  },
  rejectButton: {
    backgroundColor: colors.light[400],
    borderWidth: 1,
    borderColor: colors.danger,
  },
  rejectButtonText: {
    fontFamily: typography.family.semibold,
    fontSize: typography.size.base,
    color: colors.danger,
  },
});

export default UpcomingMoveCard;
