/**
 * Notification Preferences Screen
 * Allows users to manage notification settings with toggle switches
 * Uses NativeWind (Tailwind CSS) for styling
 */
import { ScreenHeader } from "@/components/profile";
import { colors, spacing, typography } from "@/constants/tokens";
import type { NotificationPreferences } from "@/modules/profile";
import { useProfile, useUpdateNotifications } from "@/modules/profile";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  ScrollView,
  Switch,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationPreferencesScreen() {
  const { data: profile, isLoading } = useProfile();
  const updateNotifications = useUpdateNotifications();

  // Local state for notification preferences
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    pushEnabled: profile?.notificationPreferences?.pushEnabled ?? true,
    emailEnabled: profile?.notificationPreferences?.emailEnabled ?? true,
    bookingNotifications: profile?.notificationPreferences?.bookingNotifications ?? true,
    chatNotifications: profile?.notificationPreferences?.chatNotifications ?? true,
    promotionalNotifications:
      profile?.notificationPreferences?.promotionalNotifications ?? false,
  });

  // Update local state when profile loads
  React.useEffect(() => {
    if (profile?.notificationPreferences) {
      setPreferences(profile.notificationPreferences);
    }
  }, [profile?.notificationPreferences]);

  // Handle toggle change with optimistic update
  const handleToggle = async (
    key: keyof NotificationPreferences,
    value: boolean
  ) => {
    // Optimistic update
    const previousPreferences = { ...preferences };
    setPreferences((prev) => ({ ...prev, [key]: value }));

    try {
      await updateNotifications.mutateAsync({
        preferences: { [key]: value },
      });
      // Success - show brief confirmation
      // Alert.alert("Success", "Notification preference updated");
    } catch (error: any) {
      console.error("Error updating notification preference:", error);
      // Revert optimistic update on error
      setPreferences(previousPreferences);
      Alert.alert(
        "Error",
        error?.message || "Failed to update notification preference"
      );
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary[700]} />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <StatusBar style="dark" />
      <ImageBackground
        source={require("@/assets/images/app-full-screen.webp")}
        className="flex-1"
        resizeMode="cover"
      >
        <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
          {/* Header */}
          <ScreenHeader title="Notification Preferences" />

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: spacing.xl }}
            showsVerticalScrollIndicator={false}
          >
            <View className="px-5 py-6">
              {/* Description */}
              <Text
                className="font-inter-regular mb-6"
                style={{ fontSize: typography.size.base, color: colors.dark[100] }}
              >
                Manage how you receive notifications from Masqany
              </Text>

              {/* Push Notifications */}
              <View className="rounded-lg p-4 mb-3" style={{ backgroundColor: "#e1e6e8" }}>
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 mr-3">
                    <Text
                      className="font-inter-semibold mb-1"
                      style={{ fontSize: typography.size.base, color: colors.dark[400] }}
                    >
                      Push Notifications
                    </Text>
                    <Text
                      className="font-inter-regular"
                      style={{ fontSize: typography.size.sm, color: colors.dark[100] }}
                    >
                      Receive push notifications on your device
                    </Text>
                  </View>
                  <Switch
                    value={preferences.pushEnabled}
                    onValueChange={(value) => handleToggle("pushEnabled", value)}
                    trackColor={{
                      false: colors.light[200],
                      true: colors.primary[700],
                    }}
                    thumbColor={colors.light[400]}
                    disabled={updateNotifications.isPending}
                  />
                </View>
              </View>

              {/* Email Notifications */}
              <View className="rounded-lg p-4 mb-3" style={{ backgroundColor: "#e1e6e8" }}>
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 mr-3">
                    <Text
                      className="font-inter-semibold mb-1"
                      style={{ fontSize: typography.size.base, color: colors.dark[400] }}
                    >
                      Email Notifications
                    </Text>
                    <Text
                      className="font-inter-regular"
                      style={{ fontSize: typography.size.sm, color: colors.dark[100] }}
                    >
                      Receive notifications via email
                    </Text>
                  </View>
                  <Switch
                    value={preferences.emailEnabled}
                    onValueChange={(value) => handleToggle("emailEnabled", value)}
                    trackColor={{
                      false: colors.light[200],
                      true: colors.primary[700],
                    }}
                    thumbColor={colors.light[400]}
                    disabled={updateNotifications.isPending}
                  />
                </View>
              </View>

              {/* Booking Notifications */}
              <View className="rounded-lg p-4 mb-3" style={{ backgroundColor: "#e1e6e8" }}>
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 mr-3">
                    <Text
                      className="font-inter-semibold mb-1"
                      style={{ fontSize: typography.size.base, color: colors.dark[400] }}
                    >
                      Booking Notifications
                    </Text>
                    <Text
                      className="font-inter-regular"
                      style={{ fontSize: typography.size.sm, color: colors.dark[100] }}
                    >
                      Updates about your bookings and reservations
                    </Text>
                  </View>
                  <Switch
                    value={preferences.bookingNotifications}
                    onValueChange={(value) =>
                      handleToggle("bookingNotifications", value)
                    }
                    trackColor={{
                      false: colors.light[200],
                      true: colors.primary[700],
                    }}
                    thumbColor={colors.light[400]}
                    disabled={updateNotifications.isPending}
                  />
                </View>
              </View>

              {/* Chat Notifications */}
              <View className="rounded-lg p-4 mb-3" style={{ backgroundColor: "#e1e6e8" }}>
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 mr-3">
                    <Text
                      className="font-inter-semibold mb-1"
                      style={{ fontSize: typography.size.base, color: colors.dark[400] }}
                    >
                      Chat Notifications
                    </Text>
                    <Text
                      className="font-inter-regular"
                      style={{ fontSize: typography.size.sm, color: colors.dark[100] }}
                    >
                      New messages and chat updates
                    </Text>
                  </View>
                  <Switch
                    value={preferences.chatNotifications}
                    onValueChange={(value) =>
                      handleToggle("chatNotifications", value)
                    }
                    trackColor={{
                      false: colors.light[200],
                      true: colors.primary[700],
                    }}
                    thumbColor={colors.light[400]}
                    disabled={updateNotifications.isPending}
                  />
                </View>
              </View>

              {/* Promotional Notifications */}
              <View className="rounded-lg p-4 mb-3" style={{ backgroundColor: "#e1e6e8" }}>
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 mr-3">
                    <Text
                      className="font-inter-semibold mb-1"
                      style={{ fontSize: typography.size.base, color: colors.dark[400] }}
                    >
                      Promotional Notifications
                    </Text>
                    <Text
                      className="font-inter-regular"
                      style={{ fontSize: typography.size.sm, color: colors.dark[100] }}
                    >
                      Special offers, deals, and promotions
                    </Text>
                  </View>
                  <Switch
                    value={preferences.promotionalNotifications}
                    onValueChange={(value) =>
                      handleToggle("promotionalNotifications", value)
                    }
                    trackColor={{
                      false: colors.light[200],
                      true: colors.primary[700],
                    }}
                    thumbColor={colors.light[400]}
                    disabled={updateNotifications.isPending}
                  />
                </View>
              </View>

              {/* Info Note */}
              <View
                className="rounded-lg p-4 mt-3"
                style={{ backgroundColor: colors.primary[50] }}
              >
                <Text
                  className="font-inter-regular"
                  style={{ fontSize: typography.size.sm, color: colors.dark[100] }}
                >
                  Note: You can change these preferences at any time. Some
                  notifications may be required for important account updates.
                </Text>
              </View>

              {/* Loading Indicator */}
              {updateNotifications.isPending && (
                <View className="items-center mt-4">
                  <ActivityIndicator size="small" color={colors.primary[700]} />
                  <Text
                    className="font-inter-regular mt-2"
                    style={{ fontSize: typography.size.sm, color: colors.dark[100] }}
                  >
                    Updating preferences...
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Bottom Blue Bar */}
          <View className="absolute bottom-0 left-0 right-0 h-[100px] bg-[#3fbdfd] z-50">
            <View className="h-[2px] bg-white" />
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
