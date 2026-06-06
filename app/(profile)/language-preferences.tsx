/**
 * Language Preferences Screen
 * Allows users to select their preferred language (English or Kiswahili)
 * Uses NativeWind (Tailwind CSS) for styling
 */
import { ScreenHeader } from "@/components/profile";
import { colors, spacing, typography } from "@/constants/tokens";
import type { LanguageCode } from "@/modules/profile";
import { useProfile, useUpdateLanguage } from "@/modules/profile";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ImageBackground,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LanguagePreferencesScreen() {
  const { data: profile, isLoading } = useProfile();
  const updateLanguage = useUpdateLanguage();

  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(
    profile?.language || "en"
  );

  // Update selected language when profile loads
  React.useEffect(() => {
    if (profile?.language) {
      setSelectedLanguage(profile.language);
    }
  }, [profile?.language]);

  // Handle language selection
  const handleLanguageSelect = async (language: LanguageCode) => {
    setSelectedLanguage(language);

    try {
      await updateLanguage.mutateAsync({ language });
      Alert.alert("Success", "Language preference updated successfully");
    } catch (error: any) {
      console.error("Error updating language:", error);
      Alert.alert(
        "Error",
        error?.message || "Failed to update language preference"
      );
      // Revert selection on error
      setSelectedLanguage(profile?.language || "en");
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

  const isUpdating = updateLanguage.isPending;

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
          <ScreenHeader title="Language Preferences" />

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
                Select your preferred language for the app interface
              </Text>

              {/* English Option */}
              <TouchableOpacity
                onPress={() => handleLanguageSelect("en")}
                disabled={isUpdating}
                activeOpacity={0.8}
                className="rounded-lg p-4 mb-3 flex-row items-center"
                style={{ backgroundColor: "#e1e6e8" }}
              >
                {/* Radio Button */}
                <View
                  className="w-6 h-6 rounded-full items-center justify-center mr-4"
                  style={{
                    borderWidth: 2,
                    borderColor:
                      selectedLanguage === "en"
                        ? colors.primary[700]
                        : colors.light[200],
                  }}
                >
                  {selectedLanguage === "en" && (
                    <View
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors.primary[700] }}
                    />
                  )}
                </View>

                {/* Language Info */}
                <View className="flex-1">
                  <Text
                    className="font-inter-semibold"
                    style={{ fontSize: typography.size.base, color: colors.dark[400] }}
                  >
                    English
                  </Text>
                  <Text
                    className="font-inter-regular mt-1"
                    style={{ fontSize: typography.size.sm, color: colors.dark[100] }}
                  >
                    Default language
                  </Text>
                </View>

                {/* Loading indicator for this option */}
                {isUpdating && selectedLanguage === "en" && (
                  <ActivityIndicator size="small" color={colors.primary[700]} />
                )}
              </TouchableOpacity>

              {/* Kiswahili Option */}
              <TouchableOpacity
                onPress={() => handleLanguageSelect("sw")}
                disabled={isUpdating}
                activeOpacity={0.8}
                className="rounded-lg p-4 mb-3 flex-row items-center"
                style={{ backgroundColor: "#e1e6e8" }}
              >
                {/* Radio Button */}
                <View
                  className="w-6 h-6 rounded-full items-center justify-center mr-4"
                  style={{
                    borderWidth: 2,
                    borderColor:
                      selectedLanguage === "sw"
                        ? colors.primary[700]
                        : colors.light[200],
                  }}
                >
                  {selectedLanguage === "sw" && (
                    <View
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors.primary[700] }}
                    />
                  )}
                </View>

                {/* Language Info */}
                <View className="flex-1">
                  <Text
                    className="font-inter-semibold"
                    style={{ fontSize: typography.size.base, color: colors.dark[400] }}
                  >
                    Kiswahili
                  </Text>
                  <Text
                    className="font-inter-regular mt-1"
                    style={{ fontSize: typography.size.sm, color: colors.dark[100] }}
                  >
                    Lugha ya Kiswahili
                  </Text>
                </View>

                {/* Loading indicator for this option */}
                {isUpdating && selectedLanguage === "sw" && (
                  <ActivityIndicator size="small" color={colors.primary[700]} />
                )}
              </TouchableOpacity>

              {/* Info Note */}
              <View
                className="rounded-lg p-4 mt-3"
                style={{ backgroundColor: colors.primary[50] }}
              >
                <Text
                  className="font-inter-regular"
                  style={{ fontSize: typography.size.sm, color: colors.dark[100] }}
                >
                  Note: The app will restart to apply the language change. Your
                  preference will be saved for future sessions.
                </Text>
              </View>
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
