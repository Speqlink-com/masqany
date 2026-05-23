/**
 * Analytics Tab Screen
 * Displays detailed analytics and performance metrics
 */

import { GradientHeader } from "@/components/property-admin";
import { useAnalytics, usePropertyAdminStore } from "@/modules/property-admin";
import { useRouter } from "expo-router";
import React from "react";
import { ImageBackground, RefreshControl, ScrollView, Text, View } from "react-native";

export default function AnalyticsScreen() {
  const router = useRouter();
  const { openSidebar } = usePropertyAdminStore();
  
  const {
    data: analyticsData,
    isLoading,
    error,
    refetch,
  } = useAnalytics("monthly");

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  return (
    <ImageBackground
      source={require("@/assets/images/app-full-screen.webp")}
      className="flex-1"
      resizeMode="cover"
    >
      {/* Top Bar - Blue bar protecting status bar */}
      <View className="absolute top-0 left-0 right-0 h-[3.5%] bg-[#20A6FD] z-50" />

      <GradientHeader
        variant="dashboard"
        onMenuPress={openSidebar}
        onHomePress={() => router.push("/(property-admin)" as any)}
        onNotificationPress={() => {}}
      />

      <ScrollView
        className="flex-1 px-5 pt-5"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#20A6FD"
          />
        }
      >
        <Text className="text-[20px] font-inter-semibold text-black mb-4">
          Analytics & Reports
        </Text>

        {isLoading ? (
          <Text className="text-[14px] font-inter text-[#545454]">
            Loading analytics...
          </Text>
        ) : error ? (
          <Text className="text-red-600 text-center">
            Failed to load analytics
          </Text>
        ) : (
          <View className="gap-4">
            <View className="bg-[#f3f4f3] rounded-xl p-4">
              <Text className="text-[16px] font-inter-semibold text-black mb-2">
                Overview
              </Text>
              <View className="gap-2">
                <View className="flex-row justify-between">
                  <Text className="text-[14px] font-inter text-[#545454]">
                    Total Properties
                  </Text>
                  <Text className="text-[14px] font-inter-semibold text-black">
                    {analyticsData?.totalProperties || 0}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-[14px] font-inter text-[#545454]">
                    Total Units
                  </Text>
                  <Text className="text-[14px] font-inter-semibold text-black">
                    {analyticsData?.totalUnits || 0}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-[14px] font-inter text-[#545454]">
                    Occupancy Rate
                  </Text>
                  <Text className="text-[14px] font-inter-semibold text-[#28b4f9]">
                    {analyticsData?.occupancyRate.toFixed(1) || 0}%
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-[14px] font-inter text-[#545454]">
                    Total Revenue
                  </Text>
                  <Text className="text-[14px] font-inter-semibold text-[#22C55E]">
                    KES {analyticsData?.totalRevenue.toLocaleString() || 0}
                  </Text>
                </View>
              </View>
            </View>

            <View className="bg-[#f3f4f3] rounded-xl p-4">
              <Text className="text-[16px] font-inter-semibold text-black mb-2">
                Performance Metrics
              </Text>
              <Text className="text-[14px] font-inter text-[#545454]">
                Detailed performance reports coming soon
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Bar - Blue bar covering tab bar area */}
      <View className="absolute bottom-0 left-0 right-0 h-[100px] bg-[#20A6FD] z-40">
        <View className="h-[1px] bg-black" />
      </View>
    </ImageBackground>
  );
}
