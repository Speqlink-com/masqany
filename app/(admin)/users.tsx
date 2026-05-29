/**
 * Admin - Users Management Screen
 */

import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    Image,
    ImageBackground,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UsersScreen() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <View className="flex-1">
      <StatusBar style="dark" />
      <ImageBackground
        source={require("@/assets/images/app-full-screen.webp")}
        className="flex-1"
        resizeMode="cover"
      >
        {/* Top Bar */}
        <View className="absolute top-0 left-0 right-0 h-[3.5%] bg-[#3fbdfd] z-50" />

        <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
          {/* Header */}
          <View className="px-4 pt-2 pb-4">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => setSidebarVisible(!sidebarVisible)}
                className="p-2"
              >
                <Image
                  source={require("@/assets/icons/menu.png")}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <Text className="text-2xl font-bold text-gray-900">Users</Text>

              <TouchableOpacity className="p-2">
                <Image
                  source={require("@/assets/icons/sa-notification.webp")}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="flex-1 px-4">
            <Text className="text-gray-700 text-center text-base">
              User management functionality
            </Text>
            <Text className="text-gray-500 text-center text-sm mt-2">
              View and manage platform users
            </Text>
          </ScrollView>
        </SafeAreaView>

        {/* Bottom Bar */}
        <View className="absolute bottom-0 left-0 right-0 h-[100px] bg-[#3fbdfd] z-50">
          <View className="h-[1px] bg-black" />
        </View>

        {/* Sidebar */}
        {sidebarVisible && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setSidebarVisible(false)}
            className="absolute inset-0 bg-black/50 z-40"
          >
            <View className="w-64 h-full bg-white">
              <Image
                source={require("@/assets/images/side-bar.png")}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>
        )}
      </ImageBackground>
    </View>
  );
}
