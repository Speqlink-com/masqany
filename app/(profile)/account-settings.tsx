/**
 * Account Settings Screen
 * Displays all profile fields in read-only format with account status
 * Uses NativeWind (Tailwind CSS) for styling
 */
import { ScreenHeader } from "@/components/profile";
import { colors, spacing, typography } from "@/constants/tokens";
import { useProfile } from "@/modules/profile";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountSettingsScreen() {
  const { data: profile, isLoading } = useProfile();

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
          <ScreenHeader title="Account Settings" />

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: spacing.xl }}
            showsVerticalScrollIndicator={false}
          >
            <View className="px-5 py-6">
              {/* Avatar Section */}
              <View className="items-center mb-6">
                {profile?.avatar ? (
                  <Image
                    source={{ uri: profile.avatar }}
                    className="w-24 h-24 rounded-full"
                    style={{
                      borderWidth: 3,
                      borderColor: colors.primary[700],
                    }}
                  />
                ) : (
                  <Image
                    source={require("@/assets/icons/user-profile-icon.webp")}
                    className="w-24 h-24 rounded-full"
                    style={{
                      borderWidth: 3,
                      borderColor: colors.primary[700],
                    }}
                  />
                )}
              </View>

              {/* Profile Information Card */}
              <View className="rounded-lg p-4 mb-3" style={{ backgroundColor: "#e1e6e8" }}>
                <Text
                  className="font-inter-semibold mb-4"
                  style={{ fontSize: typography.size.base, color: colors.dark[400] }}
                >
                  Profile Information
                </Text>

                {/* Name */}
                <View className="mb-4">
                  <Text
                    className="font-inter-regular mb-1"
                    style={{ fontSize: typography.size.sm, color: colors.dark[100] }}
                  >
                    Name
                  </Text>
                  <Text
                    className="font-inter-medium"
                    style={{ fontSize: typography.size.base, color: colors.dark[400] }}
                  >
                    {profile?.name || "Not set"}
                  </Text>
                </View>

                {/* Email */}
                <View className="mb-4">
                  <Text
                    className="font-inter-regular mb-1"
                    style={{ fontSize: typography.size.sm, color: colors.dark[100] }}
                  >
                    Email
                  </Text>
                  <Text
                    className="font-inter-medium"
                    style={{ fontSize: typography.size.base, color: colors.dark[400] }}
                  >
                    {profile?.email || "Not set"}
                  </Text>
                </View>

                {/* Phone */}
                <View className="mb-0">
                  <Text
                    className="font-inter-regular mb-1"
                    style={{ fontSize: typography.size.sm, color: colors.dark[100] }}
                  >
                    Phone
                  </Text>
                  <Text
                    className="font-inter-medium"
                    style={{ fontSize: typography.size.base, color: colors.dark[400] }}
                  >
                    {profile?.phone || "Not set"}
                  </Text>
                </View>
              </View>

              {/* Account Status Card */}
              <View className="rounded-lg p-4 mb-3" style={{ backgroundColor: "#e1e6e8" }}>
                <Text
                  className="font-inter-semibold mb-4"
                  style={{ fontSize: typography.size.base, color: colors.dark[400] }}
                >
                  Account Status
                </Text>

                {/* Account Status from API */}
                <View className="flex-row items-center mb-3">
                  <Text
                    className="font-inter-regular flex-1"
                    style={{ fontSize: typography.size.base, color: colors.dark[400] }}
                  >
                    Status
                  </Text>
                  <View
                    className="px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: 
                        profile?.status === "verified" ? colors.success :
                        profile?.status === "active" ? colors.primary[700] :
                        colors.warning,
                    }}
                  >
                    <Text
                      className="font-inter-semibold capitalize"
                      style={{ fontSize: typography.size.sm, color: colors.light[400] }}
                    >
                      {profile?.status || "Unknown"}
                    </Text>
                  </View>
                </View>

                {/* Account Creation Date */}
                <View className="flex-row items-center">
                  <Text
                    className="font-inter-regular flex-1"
                    style={{ fontSize: typography.size.base, color: colors.dark[400] }}
                  >
                    Member Since
                  </Text>
                  <Text
                    className="font-inter-medium"
                    style={{ fontSize: typography.size.base, color: colors.dark[100] }}
                  >
                    {profile?.createdAt ? formatDate(profile.createdAt) : "Unknown"}
                  </Text>
                </View>
              </View>

              {/* Edit Profile Button */}
              <TouchableOpacity
                onPress={() => router.push("/(profile)/edit-profile")}
                activeOpacity={0.85}
                className="rounded-lg py-4 items-center"
                style={{ backgroundColor: colors.primary[700] }}
              >
                <Text
                  className="font-inter-bold"
                  style={{ fontSize: typography.size.base, color: colors.light[400] }}
                >
                  Edit Profile
                </Text>
              </TouchableOpacity>
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
