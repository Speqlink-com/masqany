/**
 * Vehicle List Screen
 * 
 * Displays all vehicles for the authenticated driver with search and filters
 */

import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { VehicleListSkeleton } from "@/components/vehicle/VehicleListSkeleton";
import { useVehicles } from "@/modules/vehicle/hooks";
import { useVehicleStore } from "@/modules/vehicle/store";
import type { VehicleStatus, VehicleType } from "@/modules/vehicle/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VehicleListScreen() {
  const router = useRouter();
  
  // Zustand store for filters
  const {
    searchQuery,
    setSearchQuery,
    vehicleTypeFilter,
    setVehicleTypeFilter,
    statusFilter,
    setStatusFilter,
  } = useVehicleStore();

  // Local state for debounced search
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Fetch vehicles
  const { data: vehicles, isLoading, refetch, isRefetching } = useVehicles();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery]);

  // Filter vehicles client-side
  const filteredVehicles = vehicles?.filter((vehicle) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesPlate = vehicle.plateNumber.toLowerCase().includes(query);
      const matchesType = vehicle.vehicleType.toLowerCase().includes(query);
      if (!matchesPlate && !matchesType) return false;
    }

    // Vehicle type filter
    if (vehicleTypeFilter && vehicleTypeFilter !== "all") {
      if (vehicle.vehicleType !== vehicleTypeFilter) return false;
    }

    // Status filter
    if (statusFilter && statusFilter !== "all") {
      if (vehicle.verificationStatus !== statusFilter) return false;
    }

    return true;
  });

  const handleVehiclePress = (vehicleId: string) => {
    router.push(`/(vehicle)/vehicle-details?id=${vehicleId}` as any);
  };

  const handleAddVehicle = () => {
    router.push("/(registration)/vehicle-prompt" as any);
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Header */}
        <View className="px-5 pt-4 pb-3 border-b border-light-200">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-poppins-bold text-[24px] text-dark-400">
              My Vehicles
            </Text>
            <TouchableOpacity
              onPress={handleAddVehicle}
              className="bg-primary-700 rounded-full px-4 py-2"
            >
              <Text className="font-inter-semibold text-[13px] text-white">
                + Add Vehicle
              </Text>
            </TouchableOpacity>
          </View>

          {/* Vehicle Count */}
          {vehicles && (
            <Text className="font-inter text-[13px] text-dark-100 mb-3">
              {vehicles.length} of 5 vehicles registered
            </Text>
          )}

          {/* Search Bar */}
          <View className="flex-row items-center bg-light-300 rounded-full px-4 py-3 mb-3">
            <Ionicons name="search-outline" size={20} color="#4F5C62" />
            <TextInput
              value={localSearch}
              onChangeText={setLocalSearch}
              placeholder="Search by plate number or type"
              placeholderTextColor="#BDBDC0"
              className="flex-1 ml-2 font-inter text-[15px] text-dark-400"
            />
            {localSearch.length > 0 && (
              <TouchableOpacity onPress={() => setLocalSearch("")}>
                <Ionicons name="close-circle" size={20} color="#BDBDC0" />
              </TouchableOpacity>
            )}
          </View>

          {/* Vehicle Type Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-2"
            contentContainerStyle={{ gap: 8 }}
          >
            {[
              { value: "all", label: "All" },
              { value: "pickup", label: "Pickup" },
              { value: "truck", label: "Truck" },
              { value: "mini_truck", label: "Mini Truck" },
            ].map((filter) => (
              <TouchableOpacity
                key={filter.value}
                onPress={() => setVehicleTypeFilter(filter.value as VehicleType | "all")}
                className={`px-4 py-2 rounded-full ${
                  vehicleTypeFilter === filter.value
                    ? "bg-primary-700"
                    : "bg-light-300"
                }`}
              >
                <Text
                  className={`font-inter-medium text-[13px] ${
                    vehicleTypeFilter === filter.value
                      ? "text-white"
                      : "text-dark-400"
                  }`}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Status Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {[
              { value: "all", label: "All Status" },
              { value: "verified", label: "Verified" },
              { value: "pending_verification", label: "Pending" },
              { value: "rejected", label: "Rejected" },
            ].map((filter) => (
              <TouchableOpacity
                key={filter.value}
                onPress={() => setStatusFilter(filter.value as VehicleStatus | "all")}
                className={`px-4 py-2 rounded-full border ${
                  statusFilter === filter.value
                    ? "border-primary-700 bg-primary-50"
                    : "border-light-200 bg-white"
                }`}
              >
                <Text
                  className={`font-inter-medium text-[13px] ${
                    statusFilter === filter.value
                      ? "text-primary-700"
                      : "text-dark-400"
                  }`}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Vehicle List */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#20A6FD"
            />
          }
        >
          {isLoading ? (
            <VehicleListSkeleton />
          ) : filteredVehicles && filteredVehicles.length > 0 ? (
            <View className="px-5 pt-4">
              {filteredVehicles.map((vehicle, index) => (
                <View
                  key={vehicle.id}
                  style={{
                    opacity: 1,
                    transform: [{ translateY: 0 }],
                  }}
                >
                  <VehicleCard
                    vehicle={vehicle}
                    onPress={() => handleVehiclePress(vehicle.id)}
                  />
                </View>
              ))}
            </View>
          ) : (
            // Empty State
            <View className="flex-1 items-center justify-center px-8 py-12">
              <Ionicons name="car-outline" size={64} color="#BDBDC0" />
              <Text className="font-poppins-semibold text-[18px] text-dark-400 mt-4 text-center">
                {searchQuery || vehicleTypeFilter !== "all" || statusFilter !== "all"
                  ? "No vehicles found"
                  : "Register your first vehicle"}
              </Text>
              <Text className="font-inter text-[14px] text-dark-100 mt-2 text-center">
                {searchQuery || vehicleTypeFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Start earning by registering your vehicle for relocation services"}
              </Text>
              {!searchQuery && vehicleTypeFilter === "all" && statusFilter === "all" && (
                <TouchableOpacity
                  onPress={handleAddVehicle}
                  className="bg-primary-700 rounded-full px-6 py-3 mt-6"
                >
                  <Text className="font-inter-semibold text-[15px] text-white">
                    Register Vehicle
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
