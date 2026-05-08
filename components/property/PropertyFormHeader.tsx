/**
 * PropertyFormHeader Component
 * 
 * Header component for property registration multi-step forms
 * Displays progress indicator, back button, step title, and auto-save status
 */

import { colors, spacing } from "@/constants/tokens";
import { usePropertyStore } from "@/modules/property";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";

interface PropertyFormHeaderProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  title: string;
}

export function PropertyFormHeader({
  currentStep,
  totalSteps,
  onBack,
  title,
}: PropertyFormHeaderProps) {
  const { lastSavedAt, isSaving } = usePropertyStore();

  // Format last saved timestamp
  const formatLastSaved = (timestamp: string | null) => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Saved just now";
    if (diffMins === 1) return "Saved 1 min ago";
    if (diffMins < 60) return `Saved ${diffMins} mins ago`;
    return `Saved at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  return (
    <ImageBackground
      source={require("@/assets/images/app-full-screen.webp")}
      className="pt-12 pb-6"
      resizeMode="cover"
    >
      <View className="px-5">
        {/* Top Row: Back Button + Auto-save Status */}
        <View className="flex-row items-center justify-between mb-4">
          {/* Back Button */}
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.8}
            className="w-10 h-10 rounded-full items-center justify-center bg-white"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              borderWidth: 0.5,
              borderColor: "#28B4F9",
            }}
          >
            <Ionicons name="chevron-back" size={20} color={colors.dark[400]} />
          </TouchableOpacity>

          {/* Auto-save Status */}
          {(isSaving || lastSavedAt) && (
            <View className="flex-row items-center">
              {isSaving ? (
                <>
                  <Ionicons
                    name="sync"
                    size={14}
                    color={colors.dark[100]}
                    style={{ marginRight: spacing.xs }}
                  />
                  <Text className="font-inter text-[11px] text-dark-100">
                    Saving...
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle"
                    size={14}
                    color={colors.success}
                    style={{ marginRight: spacing.xs }}
                  />
                  <Text className="font-inter text-[11px] text-dark-100">
                    {formatLastSaved(lastSavedAt)}
                  </Text>
                </>
              )}
            </View>
          )}
        </View>

        {/* Step Title */}
        <Text className="font-poppins-semibold text-[20px] text-dark-400 mb-3">
          {title}
        </Text>

        {/* Progress Indicator */}
        <View className="flex-row items-center">
          {/* Progress Bar */}
          <View className="flex-1 h-1.5 bg-light-200 rounded-full overflow-hidden mr-3">
            <View
              className="h-full rounded-full"
              style={{
                width: `${(currentStep / totalSteps) * 100}%`,
                backgroundColor: colors.primary[700],
              }}
            />
          </View>

          {/* Step Counter */}
          <Text className="font-inter-semibold text-[13px] text-dark-400">
            {currentStep}/{totalSteps}
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}
