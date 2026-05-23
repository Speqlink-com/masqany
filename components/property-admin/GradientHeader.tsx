/**
 * GradientHeader Component
 * 
 * Reusable gradient header for property admin screens with two variants:
 * - dashboard: menu, home, logo, notification icons
 * - units: property info, search, switch property button
 */

import { colors, spacing, typography } from "@/constants/tokens";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const HEADER_HEIGHT = SCREEN_HEIGHT * 0.18; // Reduced from 25% to 18%

interface PropertyData {
  icon: any;
  title: string;
  location: string;
  totalRooms: number;
  pricePerMonth: number;
  monthlyRentals: number;
  occupancyRatio: string;
}

interface GradientHeaderProps {
  variant: "dashboard" | "units";
  propertyData?: PropertyData;
  onMenuPress?: () => void;
  onHomePress?: () => void;
  onNotificationPress?: () => void;
  onSearchPress?: () => void;
  onSwitchProperty?: () => void;
}

export default function GradientHeader({
  variant,
  propertyData,
  onMenuPress,
  onHomePress,
  onNotificationPress,
  onSearchPress,
  onSwitchProperty,
}: GradientHeaderProps) {
  if (variant === "dashboard") {
    return (
      <LinearGradient
        colors={[colors.gradient.start, colors.gradient.end]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ height: HEADER_HEIGHT }}
      >
        <View className="flex-1 px-5 pt-12 pb-4">
          {/* Top Row: Menu, Home, Logo, Notification */}
          <View className="flex-row items-center justify-between">
            {/* Left: Menu and Home Icons */}
            <View className="flex-row items-center gap-3">
              <TouchableOpacity
                onPress={onMenuPress}
                activeOpacity={0.8}
                className="w-10 h-10 items-center justify-center"
                accessible={true}
                accessibilityLabel="Open menu"
                accessibilityRole="button"
                accessibilityHint="Opens the navigation menu"
              >
                <Image
                  source={require("@/assets/icons/menu.png")}
                  style={{ width: 24, height: 24 }}
                  contentFit="contain"
                  cachePolicy="memory-disk"
                  placeholder={require("@/assets/icons/menu.png")}
                  transition={200}
                  accessible={false}
                />
              </TouchableOpacity>
            </View>

            {/* Center: Masqany Logo */}
            <View className="flex-1 items-center">
              <Image
                source={require("@/assets/images/msq-logo.png")}
                style={{ width: 120, height: 40 }}
                contentFit="contain"
                cachePolicy="memory-disk"
                placeholder={require("@/assets/images/masqany-logo.png")}
                transition={200}
              />
            </View>

            {/* Right: Notification Icon */}
            <TouchableOpacity
              onPress={onNotificationPress}
              activeOpacity={0.8}
              className="w-10 h-10 items-center justify-center"
              accessible={true}
              accessibilityLabel="Notifications"
              accessibilityRole="button"
              accessibilityHint="View your notifications"
            >
              <Image
                source={require("@/assets/icons/notificattion.png")}
                style={{ width: 24, height: 24 }}
                contentFit="contain"
                cachePolicy="memory-disk"
                placeholder={require("@/assets/icons/notificattion.png")}
                transition={200}
                accessible={false}
              />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  }

  // Units variant
  if (!propertyData) {
    return null;
  }

  return (
    <LinearGradient
      colors={[colors.gradient.start, colors.gradient.end]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ height: HEADER_HEIGHT }}
    >
      <View className="flex-1 px-5 pt-12 pb-4">
        {/* Top Row: Property Icon, Title, Search */}
        <View className="flex-row items-center justify-between mb-2">
          {/* Left: Property Icon and Title */}
          <View className="flex-row items-center flex-1">
            <Image
              source={propertyData.icon}
              style={{ width: 32, height: 32 }}
              contentFit="contain"
              cachePolicy="memory-disk"
              placeholder={propertyData.icon}
              transition={200}
            />
            <Text
              style={{
                fontFamily: typography.family.headingSemiBold,
                fontSize: 20,
                color: colors.light[400],
                marginLeft: spacing.sm,
              }}
              numberOfLines={1}
            >
              {propertyData.title}
            </Text>
          </View>

          {/* Right: Search Icon */}
          <TouchableOpacity
            onPress={onSearchPress}
            activeOpacity={0.8}
            className="w-10 h-10 items-center justify-center"
            accessible={true}
            accessibilityLabel="Search units"
            accessibilityRole="button"
            accessibilityHint="Search and filter units"
          >
            <Image
              source={require("@/assets/icons/search.png")}
              style={{ width: 24, height: 24 }}
              contentFit="contain"
              cachePolicy="memory-disk"
              placeholder={require("@/assets/icons/search.png")}
              transition={200}
              accessible={false}
            />
          </TouchableOpacity>
        </View>

        {/* Location */}
        <View className="flex-row items-center mb-2">
          <Image
            source={require("@/assets/icons/location.png")}
            style={{ width: 16, height: 16 }}
            contentFit="contain"
            cachePolicy="memory-disk"
            placeholder={require("@/assets/icons/location.png")}
            transition={200}
          />
          <Text
            style={{
              fontFamily: typography.family.regular,
              fontSize: 14,
              color: colors.light[400],
              marginLeft: spacing.xs,
            }}
          >
            {propertyData.location}
          </Text>
        </View>

        {/* Total Rooms and Switch Property Button */}
        <View className="flex-row items-center justify-between mb-3">
          <Text
            style={{
              fontFamily: typography.family.medium,
              fontSize: 14,
              color: colors.light[400],
            }}
          >
            Total Rooms: {propertyData.totalRooms}
          </Text>

          <TouchableOpacity
            onPress={onSwitchProperty}
            activeOpacity={0.8}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              paddingHorizontal: spacing.sm,
              paddingVertical: 6,
              borderRadius: 20,
            }}
            accessible={true}
            accessibilityLabel="Switch property"
            accessibilityRole="button"
            accessibilityHint="Select a different property to view"
          >
            <Text
              style={{
                fontFamily: typography.family.semibold,
                fontSize: 13,
                color: colors.light[400],
              }}
            >
              Switch Property
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Row: Price, Monthly Rentals, Occupancy Ratio */}
        <View className="flex-row items-center justify-between">
          {/* Price Per Month */}
          <View>
            <Text
              style={{
                fontFamily: typography.family.headingBold,
                fontSize: 22,
                color: colors.light[400],
              }}
            >
              KES {propertyData.pricePerMonth.toLocaleString()}
            </Text>
            <Text
              style={{
                fontFamily: typography.family.regular,
                fontSize: 12,
                color: colors.light[400],
                opacity: 0.9,
              }}
            >
              per month
            </Text>
          </View>

          {/* Monthly Rentals */}
          <View className="items-center">
            <Text
              style={{
                fontFamily: typography.family.semibold,
                fontSize: 16,
                color: colors.light[400],
              }}
            >
              KES {propertyData.monthlyRentals.toLocaleString()}
            </Text>
            <Text
              style={{
                fontFamily: typography.family.regular,
                fontSize: 12,
                color: colors.light[400],
                opacity: 0.9,
              }}
            >
              monthly rentals
            </Text>
          </View>

          {/* Occupancy Ratio */}
          <View className="items-end">
            <Text
              style={{
                fontFamily: typography.family.medium,
                fontSize: 14,
                color: colors.light[400],
              }}
            >
              {propertyData.occupancyRatio}
            </Text>
            <Text
              style={{
                fontFamily: typography.family.regular,
                fontSize: 12,
                color: colors.light[400],
                opacity: 0.9,
              }}
            >
              occupied
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
