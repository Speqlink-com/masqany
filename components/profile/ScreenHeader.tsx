/**
 * Screen Header Component
 * Reusable header with back button and title for profile screens
 */
import { BackButton } from "@/components/auth/BackButton";
import { colors, typography } from "@/constants/tokens";
import React from "react";
import { Text, View } from "react-native";

interface ScreenHeaderProps {
  title: string;
}

export function ScreenHeader({ title }: ScreenHeaderProps) {
  return (
    <View className="px-5 py-4 flex-row items-center">
      <BackButton />
      <Text
        className="flex-1 text-center font-poppins-semibold"
        style={{ fontSize: typography.size.lg, color: colors.dark[400] }}
      >
        {title}
      </Text>
      <View className="w-10" />
    </View>
  );
}
