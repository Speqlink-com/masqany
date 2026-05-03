/**
 * Admin Vehicles Screen
 * 
 * Displays all vehicles pending verification for admin review
 */

import { VehicleListSkeleton } from "@/components/vehicle/VehicleListSkeleton";
import { VerificationBadge } from "@/components/vehicle/VerificationBadge";
import { canAccessAdminScreens, getPermissionErrorMessage } from "@/lib/permissions";
import { useAdminVehicles } from "@/modules/vehicle/hooks";
import type { VerificationStatus } from "@/modules/vehicle/types";
import { useAuthStore } from "@/store/auth.store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
    Alert,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdminVehiclesScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  
  // Check role-based access on mount
  useEffect(() => {
    if (user && !canAccessAdminScreens(user.role)) {
      Alert.alert(
        "Access Denied",
        getPermissionErrorMessage("access admin screens"),
        [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)/home" as any),
          },
        ]
      );
    }
  }, [user, router]);
  
  // Filter state
  const [verificationFilter, setVerificationFilter] = useState<VerificationStatus | null>("pending_verification");
  
  // Fetch vehicles with filter
  const { data: vehicles, isLoading, refetch } = useAdminVehicles({
    verificationStatus: verificationFilter || undefined,
  });

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleVehiclePress = (vehicleId: string) => {
    router.push(`/(admin)/admin-vehicle-review?id=${vehicleId}` as any);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading && !refreshing) {
    return <VehicleListSkeleton />;
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Header */}
        <View className="px-5 py-4 border-b border-light-300">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center"
            >
              <Ionicons name="arrow-back" size={24} color="#000000" />
            </TouchableOpacity>
            <Text className="font-poppins-semibold text-[20px] text-dark-400 flex-1 text-center">
              Vehicle Approvals
            </Text>
            <View className="w-10" />
          </View>

          {/* Filter Buttons */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            <TouchableOpacity
              onPress={() => setVerificationFilter("pending_verification")}
              className={`px-4 py-2 rounded-full ${
                verificationFilter === "pending_verification" ? "bg-primary-700" : "bg-light-300"
              }`}
            >
              <Text
                className={`font-inter-medium text-[13px] ${
                  verificationFilter === "pending_verification" ? "text-white" : "text-dark-400"
                }`}
              >
                Pending
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setVerificationFilter("verified")}
              className={`px-4 py-2 rounded-full ${
                verificationFilter === "verified" ? "bg-primary-700" : "bg-light-300"
              }`}
            >
              <Text
                className={`font-inter-medium text-[13px] ${
                  verificationFilter === "verified" ? "text-white" : "text-dark-400"
                }`}
              >
                Verified
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setVerificationFilter("rejected")}
              className={`px-4 py-2 rounded-full ${
                verificationFilter === "rejected" ? "bg-primary-700" : "bg-light-300"
              }`}
            >
              <Text
                className={`font-inter-medium text-[13px] ${
                  verificationFilter === "rejected" ? "text-white" : "text-dark-400"
                }`}
              >
                Rejected
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setVerificationFilter(null)}
              className={`px-4 py-2 rounded-full ${
                verificationFilter === null ? "bg-primary-700" : "bg-light-300"
              }`}
            >
              <Text
                className={`font-inter-medium text-[13px] ${
                  verificationFilter === null ? "text-white" : "text-dark-400"
                }`}
              >
                All
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Vehicle List */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {vehicles && vehicles.length > 0 ? (
            <View className="gap-4">
              {/* Count */}
              <Text className="font-inter text-[13px] text-dark-100">
                {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""} found
              </Text>

              {/* Vehicle Cards */}
              {vehicles.map((vehicle) => (
                <TouchableOpacity
                  key={vehicle.id}
                  onPress={() => handleVehiclePress(vehicle.id)}
                  activeOpacity={0.7}
                  className="bg-white rounded-2xl p-4 border border-light-300 shadow-sm"
                >
                  {/* Header Row */}
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-1">
                      <Text className="font-inter-semibold text-[16px] text-dark-400">
                        {vehicle.plateNumber}
                      </Text>
                      <Text className="font-inter text-[13px] text-dark-100 mt-1 capitalize">
                        {vehicle.vehicleType.replace("_", " ")}
                      </Text>
                    </View>
                    <VerificationBadge status={vehicle.verificationStatus} />
                  </View>

                  {/* Driver Info */}
                  <View className="bg-light-300 rounded-xl p-3 mb-3">
                    <View className="flex-row items-center mb-2">
                      <Ionicons name="person-outline" size={16} color="#545454" />
                      <Text className="font-inter-medium text-[14px] text-dark-400 ml-2">
                        {vehicle.driverName}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Ionicons name="call-outline" size={16} color="#545454" />
                      <Text className="font-inter text-[13px] text-dark-100 ml-2">
                        {vehicle.phone}
                      </Text>
                    </View>
                  </View>

                  {/* Registration Date */}
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Ionicons name="calendar-outline" size={16} color="#545454" />
                      <Text className="font-inter text-[13px] text-dark-100 ml-2">
                        Registered: {formatDate(vehicle.createdAt)}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#BDBDC0" />
                  </View>

                  {/* Rejection Reason (if rejected) */}
                  {vehicle.verificationStatus === "rejected" && vehicle.rejectionReason && (
                    <View className="mt-3 pt-3 border-t border-light-300">
                      <Text className="font-inter-medium text-[13px] text-danger mb-1">
                        Rejection Reason:
                      </Text>
                      <Text className="font-inter text-[13px] text-dark-100">
                        {vehicle.rejectionReason}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className="items-center justify-center py-20">
              <Ionicons name="car-outline" size={64} color="#BDBDC0" />
              <Text className="font-inter-medium text-[15px] text-dark-100 mt-4">
                No vehicles found
              </Text>
              <Text className="font-inter text-[13px] text-dark-100 mt-2 text-center">
                {verificationFilter === "pending_verification"
                  ? "No vehicles pending verification"
                  : verificationFilter === "verified"
                  ? "No verified vehicles"
                  : verificationFilter === "rejected"
                  ? "No rejected vehicles"
                  : "No vehicles in the system"}
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
