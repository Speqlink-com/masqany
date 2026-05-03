/**
 * Vehicle History Screen
 * 
 * Displays detailed history timeline with filtering options
 */

import { HistoryTimeline } from "@/components/vehicle/HistoryTimeline";
import { VehicleDetailsSkeleton } from "@/components/vehicle/VehicleDetailsSkeleton";
import { useVehicle, useVehicleHistory } from "@/modules/vehicle/hooks";
import type { EventType } from "@/modules/vehicle/types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FilterType = "all" | "status_changes" | "documents" | "assignments";

const EVENT_TYPE_FILTERS: Record<FilterType, EventType[] | null> = {
  all: null,
  status_changes: ["status_changed", "set_active", "set_inactive"],
  documents: ["document_updated"],
  assignments: ["assignment_completed"],
};

export default function VehicleHistoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  // Fetch data
  const { data: vehicle, isLoading: vehicleLoading } = useVehicle(id!);
  const { data: history, isLoading: historyLoading, refetch } = useVehicleHistory(id!);

  // Filter state
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [refreshing, setRefreshing] = useState(false);

  const isLoading = vehicleLoading || historyLoading;

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Filter events based on active filter
  const filteredEvents = history?.filter((event) => {
    if (activeFilter === "all") return true;
    const allowedTypes = EVENT_TYPE_FILTERS[activeFilter];
    return allowedTypes?.includes(event.eventType);
  }) || [];

  if (isLoading && !refreshing) {
    return <VehicleDetailsSkeleton />;
  }

  if (!vehicle) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="font-inter text-[16px] text-dark-400">Vehicle not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Header */}
        <View className="px-5 py-4 border-b border-light-300">
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center mr-3"
            >
              <Ionicons name="arrow-back" size={24} color="#000000" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="font-poppins-semibold text-[18px] text-dark-400">
                Vehicle History
              </Text>
              <Text className="font-inter text-[13px] text-dark-100 mt-1">
                {vehicle.plateNumber}
              </Text>
            </View>
          </View>

          {/* Filter Buttons */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            <TouchableOpacity
              onPress={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-full ${
                activeFilter === "all" ? "bg-primary-700" : "bg-light-300"
              }`}
            >
              <Text
                className={`font-inter-medium text-[13px] ${
                  activeFilter === "all" ? "text-white" : "text-dark-400"
                }`}
              >
                All Events
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveFilter("status_changes")}
              className={`px-4 py-2 rounded-full ${
                activeFilter === "status_changes" ? "bg-primary-700" : "bg-light-300"
              }`}
            >
              <Text
                className={`font-inter-medium text-[13px] ${
                  activeFilter === "status_changes" ? "text-white" : "text-dark-400"
                }`}
              >
                Status Changes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveFilter("documents")}
              className={`px-4 py-2 rounded-full ${
                activeFilter === "documents" ? "bg-primary-700" : "bg-light-300"
              }`}
            >
              <Text
                className={`font-inter-medium text-[13px] ${
                  activeFilter === "documents" ? "text-white" : "text-dark-400"
                }`}
              >
                Documents
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveFilter("assignments")}
              className={`px-4 py-2 rounded-full ${
                activeFilter === "assignments" ? "bg-primary-700" : "bg-light-300"
              }`}
            >
              <Text
                className={`font-inter-medium text-[13px] ${
                  activeFilter === "assignments" ? "text-white" : "text-dark-400"
                }`}
              >
                Assignments
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* History Timeline */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {filteredEvents.length > 0 ? (
            <View className="bg-light-300 rounded-2xl p-4">
              <HistoryTimeline events={filteredEvents} />
            </View>
          ) : (
            <View className="items-center justify-center py-20">
              <Ionicons name="time-outline" size={64} color="#BDBDC0" />
              <Text className="font-inter-medium text-[15px] text-dark-100 mt-4">
                No events found
              </Text>
              <Text className="font-inter text-[13px] text-dark-100 mt-2 text-center">
                {activeFilter === "all"
                  ? "No history events for this vehicle yet"
                  : "No events match the selected filter"}
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
