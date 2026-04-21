/**
 * AuthLayout — app-full-screen.webp covers every pixel, no overlay, no blur.
 */
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ImageBackground, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <View className="flex-1">
      <StatusBar style="dark" />
      <ImageBackground
        source={require("@/assets/images/app-full-screen.webp")}
        className="flex-1"
        resizeMode="cover"
      >
        <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
          {children}
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
