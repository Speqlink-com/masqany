/**
 * ActiveMoveCard Component
 * 
 * Displays active move details with urgency indicators and action buttons.
 * 
 * Features:
 * - Urgent badge ("STARTS SOON") with urgent.png icon when isUrgent is true
 * - Countdown timer with time.png icon showing minutesUntilStart
 * - Client name, location, house type, pickup, and destination
 * - Three action buttons: Start Move, Message (message.webp), Call (call-icon)
 * - Background: #E1E6E8 with rounded corners and shadow
 * - Full width with proper spacing
 * - All buttons meet 44x44 minimum touch target size
 * 
 * Requirements: 4.2, 4.3, 4.4, 4.5, 4.6, 13.1, 13.2, 13.3, 15.4
 */

import { colors, radius, shadow, spacing, typography } from "@/constants/tokens";
import type { ActiveMove } from "@/modules/driver-dashboard/types";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Import icons
const urgentIcon = require("@/assets/icons/urgent.png");
const timeIcon = require("@/assets/icons/time.png");
const messageIcon = require("@/assets/icons/message.webp");
const callIcon = require("@/assets/icons/call-icon.png");
const locationIcon = require("@/assets/icons/location.png");

interface ActiveMoveCardProps {
  move: ActiveMove;
  onStartMove: (moveId: string) => void;
  onMessage: (clientId: string, clientName: string) => void;
  onCall: (clientPhone: string) => void;
}

const ActiveMoveCard = React.memo(({
  move,
  onStartMove,
  onMessage,
  onCall,
}: ActiveMoveCardProps) => {
  return (
    <View style={styles.card}>
      {/* Urgent Badge and Timer Row */}
      {move.isUrgent && (
        <View style={styles.urgentRow}>
          <View style={styles.urgentBadge}>
            <Image
              source={urgentIcon}
              style={styles.urgentIcon}
              contentFit="contain"
              cachePolicy="memory-disk"
            />
            <Text style={styles.urgentText}>STARTS SOON</Text>
          </View>
          
          {move.minutesUntilStart !== undefined && (
            <View style={styles.timerContainer}>
              <Image
                source={timeIcon}
                style={styles.timeIcon}
                contentFit="contain"
                cachePolicy="memory-disk"
              />
              <Text style={styles.timerText}>
                {move.minutesUntilStart} min
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Client Information */}
      <View style={styles.infoSection}>
        <Text style={styles.clientName}>{move.clientName}</Text>
        
        <View style={styles.detailRow}>
          <Image
            source={locationIcon}
            style={styles.locationIconSmall}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
          <Text style={styles.detailText} numberOfLines={1}>
            {move.houseType}
          </Text>
        </View>

        <View style={styles.locationSection}>
          <View style={styles.locationItem}>
            <Text style={styles.locationLabel}>Pickup:</Text>
            <Text style={styles.locationValue} numberOfLines={2}>
              {move.pickupLocation}
            </Text>
          </View>

          <View style={styles.locationItem}>
            <Text style={styles.locationLabel}>Destination:</Text>
            <Text style={styles.locationValue} numberOfLines={2}>
              {move.destinationLocation}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => onStartMove(move.id)}
          activeOpacity={0.7}
          accessibilityLabel="Start move"
          accessibilityRole="button"
        >
          <Text style={styles.startButtonText}>Start Move</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => onMessage(move.clientId, move.clientName)}
          activeOpacity={0.7}
          accessibilityLabel="Message client"
          accessibilityRole="button"
        >
          <Image
            source={messageIcon}
            style={styles.actionIcon}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => onCall(move.clientPhone)}
          activeOpacity={0.7}
          accessibilityLabel="Call client"
          accessibilityRole="button"
        >
          <Image
            source={callIcon}
            style={styles.actionIcon}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
});

ActiveMoveCard.displayName = "ActiveMoveCard";

const styles = StyleSheet.create({
  card: {
    width: "100%",
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
  urgentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  urgentBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.danger,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  urgentIcon: {
    width: 16,
    height: 16,
    marginRight: spacing.xs,
  },
  urgentText: {
    fontFamily: typography.family.bold,
    fontSize: typography.size.xs,
    color: colors.light[400],
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light[400],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  timeIcon: {
    width: 14,
    height: 14,
    marginRight: spacing.xs,
  },
  timerText: {
    fontFamily: typography.family.semibold,
    fontSize: typography.size.xs,
    color: colors.dark[200],
  },
  infoSection: {
    marginBottom: spacing.base,
  },
  clientName: {
    fontFamily: typography.family.headingBold,
    fontSize: typography.size.lg,
    color: colors.dark[300],
    marginBottom: spacing.xs,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  locationIconSmall: {
    width: 12,
    height: 12,
    marginRight: spacing.xs,
  },
  detailText: {
    fontFamily: typography.family.medium,
    fontSize: typography.size.sm,
    color: colors.dark[100],
    flex: 1,
  },
  locationSection: {
    marginTop: spacing.sm,
  },
  locationItem: {
    marginBottom: spacing.sm,
  },
  locationLabel: {
    fontFamily: typography.family.semibold,
    fontSize: typography.size.sm,
    color: colors.dark[200],
    marginBottom: 2,
  },
  locationValue: {
    fontFamily: typography.family.regular,
    fontSize: typography.size.sm,
    color: colors.dark[100],
    lineHeight: 18,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  startButton: {
    flex: 1,
    backgroundColor: colors.primary[700],
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  startButtonText: {
    fontFamily: typography.family.semibold,
    fontSize: typography.size.base,
    color: colors.light[400],
  },
  iconButton: {
    width: 44,
    height: 44,
    backgroundColor: colors.light[400],
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.sm,
  },
  actionIcon: {
    width: 24,
    height: 24,
  },
});

export default ActiveMoveCard;
