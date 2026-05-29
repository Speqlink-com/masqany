/**
 * Super Admin Dashboard
 * 
 * Main dashboard for super admins with full control
 */

import { LinearGradient } from "expo-linear-gradient";
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

export default function SuperAdminDashboard() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <ImageBackground
        source={require("@/assets/images/property-registration-initial-screen.webp")}
        className="flex-1"
        resizeMode="cover"
      >
        <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
          {/* Header Section - 30% of screen */}
          <View className="h-[30%] px-5 pt-3">
            {/* Top Row: Menu, Logo, Notification */}
            <View className="flex-row items-center justify-between mb-1">
              <TouchableOpacity
                onPress={() => setSidebarVisible(!sidebarVisible)}
                className="p-2"
              >
                <Image
                  source={require("@/assets/icons/menu.png")}
                  className="w-7 h-7"
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <Image
                source={require("@/assets/images/msq-logo.png")}
                className="w-28 h-10"
                resizeMode="contain"
              />

              <TouchableOpacity className="p-2">
                <Image
                  source={require("@/assets/icons/sa-notification.webp")}
                  className="w-7 h-7"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            {/* Speqlink Row */}
            <View className="flex-row items-center mb-0">
              <Image
                source={require("@/assets/icons/sa-speqlink-logo.png")}
                className="w-10 h-10 mr-3"
                resizeMode="contain"
              />
              <Text className="text-white font-bold text-xl mr-2">
                Speqers SA
              </Text>
              <Image
                source={require("@/assets/icons/sa-crown-icon.png")}
                className="w-6 h-6 mr-2"
                resizeMode="contain"
              />
              <Image
                source={require("@/assets/images/black-white-logo.png")}
                className="w-20 h-20"
                resizeMode="contain"
              />
            </View>

            {/* User Info Row */}
            <View className="flex-row items-center">
              <Image
                source={require("@/assets/icons/sa-user-name.png")}
                className="w-10 h-10 mr-3"
                resizeMode="contain"
              />
              <View className="flex-1">
                <Text className="text-white text-sm">
                  comphortine@speqlink.com
                </Text>
                <Text className="text-white text-xl font-semibold">CEO</Text>
              </View>
            </View>
          </View>

          {/* Scrollable Content */}
          <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
            {/* General Metrics Cards */}
            <View className="mb-5">
              <Text className="text-black font-bold text-xl mb-4">
                General Metrics
              </Text>
              <View className="flex-row justify-between" style={{ gap: 12 }}>
                {/* Property Owners Card - Gradient */}
                <LinearGradient
                  colors={["#cdffd8", "#94b9ff"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="flex-1 p-4"
                  style={{
                    borderRadius: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <Image
                    source={require("@/assets/icons/sa-property-owners.webp")}
                    className="w-12 h-12 mb-2"
                    resizeMode="contain"
                  />
                  <Text className="text-gray-700 text-sm mb-1">
                    Property Owners
                  </Text>
                  <Text className="text-gray-900 font-bold text-3xl">1,234</Text>
                </LinearGradient>

                {/* Tenants Card - Gray/White */}
                <View
                  className="flex-1 p-4"
                  style={{
                    backgroundColor: "#f5f5f5",
                    borderRadius: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <Image
                    source={require("@/assets/icons/sa-tenants.webp")}
                    className="w-12 h-12 mb-2"
                    resizeMode="contain"
                  />
                  <Text className="text-gray-700 text-sm mb-1">Tenants</Text>
                  <Text className="text-gray-900 font-bold text-3xl">5,678</Text>
                </View>

                {/* Drivers Card - Cyan to Cobalt Blue Gradient */}
                <LinearGradient
                  colors={["#00CED1", "#004AAD"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="flex-1 p-4"
                  style={{
                    borderRadius: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <Image
                    source={require("@/assets/icons/sa-drivers.png")}
                    className="w-12 h-12 mb-2"
                    resizeMode="contain"
                  />
                  <Text className="text-white text-sm mb-1">Drivers</Text>
                  <Text className="text-white font-bold text-3xl">432</Text>
                </LinearGradient>
              </View>
            </View>

            {/* Quick Actions */}
            <View className="mb-5">
              <Text className="text-black font-bold text-xl mb-4">
                Quick Actions
              </Text>
              <View className="flex-row flex-wrap justify-between" style={{ gap: 12 }}>
                {/* Create Admin */}
                <LinearGradient
                  colors={["#333333", "#898989"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="w-[48%] p-4"
                  style={{
                    borderRadius: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <Image
                    source={require("@/assets/icons/sa-add-admin.png")}
                    className="w-12 h-12 mb-2"
                    resizeMode="contain"
                  />
                  <Text className="text-white font-semibold text-base mb-1">
                    Create Admin
                  </Text>
                  <Text className="text-gray-300 text-sm">
                    Add new platform administrators
                  </Text>
                </LinearGradient>

                {/* Broadcast Message */}
                <LinearGradient
                  colors={["#333333", "#898989"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="w-[48%] p-4"
                  style={{
                    borderRadius: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <Image
                    source={require("@/assets/icons/sa-message.png")}
                    className="w-12 h-12 mb-2"
                    resizeMode="contain"
                  />
                  <Text className="text-white font-semibold text-base mb-1">
                    Broadcast Message
                  </Text>
                  <Text className="text-gray-300 text-sm">
                    Send notifications to users
                  </Text>
                </LinearGradient>

                {/* Validate Users */}
                <LinearGradient
                  colors={["#333333", "#898989"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="w-[48%] p-4"
                  style={{
                    borderRadius: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <Image
                    source={require("@/assets/icons/sa-validate.png")}
                    className="w-12 h-12 mb-2"
                    resizeMode="contain"
                  />
                  <Text className="text-white font-semibold text-base mb-1">
                    Validate Users
                  </Text>
                  <Text className="text-gray-300 text-sm">
                    Review user verifications
                  </Text>
                </LinearGradient>

                {/* System Analytics */}
                <LinearGradient
                  colors={["#333333", "#898989"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="w-[48%] p-4"
                  style={{
                    borderRadius: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <Image
                    source={require("@/assets/icons/sa-analytics.png")}
                    className="w-12 h-12 mb-2"
                    resizeMode="contain"
                  />
                  <Text className="text-white font-semibold text-base mb-1">
                    System Analytics
                  </Text>
                  <Text className="text-gray-300 text-sm">
                    View platform insights
                  </Text>
                </LinearGradient>
              </View>
            </View>

            {/* Activities */}
            <View className="mb-20">
              <Text className="text-black font-bold text-xl mb-4">
                Recent Activities
              </Text>
              <View
                className="p-5"
                style={{
                  backgroundColor: "#e1e6e8",
                  borderRadius: 20,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                <Text className="text-gray-900 font-semibold text-base mb-2">
                  Pending Verification
                </Text>
                <Text className="text-gray-700 text-sm mb-1">
                  Property Registration: 12 submissions
                </Text>
                <Text className="text-gray-700 text-sm mb-1">
                  Driver Registration: 8 submissions
                </Text>
                <Text className="text-gray-700 text-sm">
                  Total submissions today: 20
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>

        {/* Bottom Bar - Blue bar covering tab bar area */}
        <View className="absolute bottom-0 left-0 right-0 h-[100px] bg-[#3fbdfd] z-50">
          <View className="h-[1px] bg-black" />
        </View>

        {/* Sidebar Overlay */}
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
