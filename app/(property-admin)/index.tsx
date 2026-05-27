/**
 * Property Admin Dashboard Screen
 * 
 * Main dashboard with:
 * - Gradient header
 * - Welcome message
 * - Analytics grid (4 cards)
 * - Quick action buttons
 * - My properties section
 */

import {
  AnalyticsCard,
  EmptyState,
  GradientHeader,
  PropertyCard,
  SidebarMenu,
  SkeletonLoader
} from "@/components/property-admin";
import {
  useAgents,
  useAnalytics,
  useProperties,
  usePropertyAdminStore
} from "@/modules/property-admin";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function Dashboard() {
  const router = useRouter();
  const { isSidebarOpen, openSidebar, closeSidebar } =
    usePropertyAdminStore();

  // Fetch data
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useAnalytics("monthly");

  const {
    data: propertiesData,
    isLoading: propertiesLoading,
    error: propertiesError,
  } = useProperties({ page: 1, pageSize: 10 });

  // Fetch agents for sidebar
  const { data: agentsData } = useAgents();

  return (
    <ImageBackground
      source={require("@/assets/images/app-full-screen.webp")}
      className="flex-1"
      resizeMode="cover"
    >
      {/* Top Bar - Blue bar protecting status bar */}
      <View className="absolute top-0 left-0 right-0 h-[3.5%] bg-[#20A6FD] z-50" />

      {/* Gradient Header */}
      <GradientHeader
        variant="dashboard"
        onMenuPress={openSidebar}
        onHomePress={() => router.replace("/(property-admin)" as any)}
        onNotificationPress={() => router.push("/(property-admin)" as any)}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 132 }}
      >
        {/* Analytics Grid - Reduced height by 30% */}
        <View className="px-5 pt-4 pb-6">
          {analyticsLoading ? (
            <SkeletonLoader variant="analytics-grid" />
          ) : analyticsError ? (
            <View className="p-4 bg-red-50 rounded-lg">
              <Text className="text-red-600 text-center">
                Failed to load analytics
              </Text>
            </View>
          ) : (
            <View className="gap-4">
              <View className="flex-row gap-2">
                <View className="flex-1" style={{ height: 70 }}>
                  <AnalyticsCard
                    icon={require("@/assets/icons/occupied-prop-icon.png")}
                    value={analyticsData?.occupiedUnits ?? 0}
                    label="Occupied"
                  />
                </View>
                <View className="flex-1" style={{ height: 70 }}>
                  <AnalyticsCard
                    icon={require("@/assets/icons/vaccant-prop-icon.webp")}
                    value={analyticsData?.vacantUnits ?? 0}
                    label="Vacant"
                  />
                </View>
              </View>
              <View className="flex-row gap-2">
                <View className="flex-1" style={{ height: 70 }}>
                  <AnalyticsCard
                    icon={require("@/assets/icons/occupancy-icon.png")}
                    value={`${analyticsData?.occupancyRate.toFixed(1) ?? 0}%`}
                    label="Occupancy Rate"
                  />
                </View>
                <View className="flex-1" style={{ height: 70 }}>
                  <AnalyticsCard
                    icon={require("@/assets/icons/views-icon.png")}
                    value={analyticsData?.totalViews ?? 0}
                    label="Views"
                  />
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Quick Action Buttons - Using Image Buttons */}
        <View className="px-5 pb-6">
          <View className="flex-row justify-between">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/(property-admin)/units" as any)}
              className="flex-1 mr-2"
            >
              <Image
                source={require("@/assets/images/my-units-btn.png")}
                className="w-full h-12"
                contentFit="contain"
                cachePolicy="memory-disk"
                placeholder={require("@/assets/images/my-units-btn.png")}
                transition={200}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/(property-admin)/units" as any)}
              className="flex-1 mx-1"
            >
              <Image
                source={require("@/assets/images/switch-status-btn.png")}
                className="w-full h-12"
                contentFit="contain"
                cachePolicy="memory-disk"
                placeholder={require("@/assets/images/switch-status-btn.png")}
                transition={200}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/(property-admin)/analytics" as any)}
              className="flex-1 ml-2"
            >
              <Image
                source={require("@/assets/images/analytics-btn.png")}
                className="w-full h-12"
                contentFit="contain"
                cachePolicy="memory-disk"
                placeholder={require("@/assets/images/analytics-btn.png")}
                transition={200}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* My Properties Section - Horizontal Scroll Only */}
        <View>
          <View className="px-5 pt-0 pb-4">
            <Text className="text-[18px] font-inter-semibold text-black">
              My Properties
            </Text>
            <Text className="text-[13px] font-inter text-[#545454]">
              Tap any to manage!
            </Text>
          </View>

          {propertiesLoading ? (
            <SkeletonLoader variant="property-cards" />
          ) : propertiesError ? (
            <View className="px-5">
              <View className="p-4 bg-red-50 rounded-lg">
                <Text className="text-red-600 text-center">
                  Failed to load properties
                </Text>
              </View>
            </View>
          ) : !propertiesData?.properties ||
            propertiesData.properties.length === 0 ? (
            <EmptyState
              variant="no-properties"
              onActionPress={() =>
                router.push("/(registration)/property-registration")
              }
            />
          ) : (
            <FlatList
              data={propertiesData.properties}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
              renderItem={({ item }) => (
                <PropertyCard
                  property={item}
                  onPress={(id) => {
                    router.push({
                      pathname: "/(property-admin)/units/[propertyId]",
                      params: { propertyId: id },
                    });
                  }}
                />
              )}
              keyExtractor={(item) => item.id}
              removeClippedSubviews
              maxToRenderPerBatch={5}
              windowSize={5}
            />
          )}
        </View>
      </ScrollView>

      {/* Sidebar Menu */}
      <SidebarMenu
        isOpen={isSidebarOpen}
        userRole="Property_Owner"
        agentCount={agentsData?.length || 0}
        onClose={closeSidebar}
        onNavigate={(route) => router.push(route as any)}
      />

      {/* Bottom Bar - Blue bar covering tab bar area */}
      <View
        pointerEvents="none"
        className="absolute bottom-0 left-0 right-0 h-[100px] bg-[#20A6FD] z-40"
      >
        <View className="h-[1px] bg-black" />
      </View>
    </ImageBackground>
  );
}
