/**
 * Agents Tab Screen
 * Displays list of property agents with their details
 */

import { EmptyState, GradientHeader } from "@/components/property-admin";
import { useAgents, usePropertyAdminStore } from "@/modules/property-admin";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Image, ImageBackground, RefreshControl, Text, TouchableOpacity, View } from "react-native";

export default function AgentsScreen() {
  const router = useRouter();
  const { openSidebar } = usePropertyAdminStore();
  
  const {
    data: agentsData,
    isLoading,
    error,
    refetch,
  } = useAgents();

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

      <View className="flex-1 px-5 pt-5">
        <Text className="text-[20px] font-inter-semibold text-black mb-4">
          My Agents
        </Text>

        {isLoading ? (
          <View className="flex-1">
            <Text className="text-[14px] font-inter text-[#545454]">
              Loading agents...
            </Text>
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-red-600 text-center text-[16px] font-inter-semibold mb-4">
              Failed to load agents
            </Text>
            <TouchableOpacity
              onPress={onRefresh}
              className="bg-[#28b4f9] px-6 py-3 rounded-full"
            >
              <Text className="text-white text-[15px] font-inter-semibold">
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        ) : !agentsData || agentsData.length === 0 ? (
          <EmptyState variant="no-agents" onActionPress={() => {}} />
        ) : (
          <FlatList
            data={agentsData}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#20A6FD"
              />
            }
            renderItem={({ item }) => (
              <View className="bg-[#f3f4f3] rounded-xl p-4 mb-3">
                <View className="flex-row items-center">
                  <Image
                    source={{ uri: item.avatar || "https://via.placeholder.com/50" }}
                    className="w-12 h-12 rounded-full"
                  />
                  <View className="flex-1 ml-3">
                    <Text className="text-[16px] font-inter-semibold text-black">
                      {item.name}
                    </Text>
                    <Text className="text-[13px] font-inter text-[#545454]">
                      {item.email}
                    </Text>
                    <Text className="text-[12px] font-inter text-[#545454]">
                      {item.totalProperties} properties assigned
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-[14px] font-inter-semibold text-[#28b4f9]">
                      {item.status}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          />
        )}
      </View>

      {/* Bottom Bar - Blue bar covering tab bar area */}
      <View className="absolute bottom-0 left-0 right-0 h-[100px] bg-[#20A6FD] z-40">
        <View className="h-[1px] bg-black" />
      </View>
    </ImageBackground>
  );
}
