/**
 * Vehicle Details Screen
 * 
 * Displays complete vehicle information with documents, photos, and history
 */

import { HistoryTimeline } from "@/components/vehicle/HistoryTimeline";
import { VehicleDetailsSkeleton } from "@/components/vehicle/VehicleDetailsSkeleton";
import { VehicleHeader } from "@/components/vehicle/VehicleHeader";
import { canDeleteVehicle, canEditVehicle, canSetActiveVehicle, canUpdateVehicleStatus } from "@/lib/permissions";
import { useDeleteVehicle, useSetActiveVehicle, useUpdateVehicleStatus, useVehicle, useVehicleHistory } from "@/modules/vehicle/hooks";
import { useAuthStore } from "@/store/auth.store";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    Alert,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function VehicleDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  
  // Fetch vehicle data
  const { data: vehicle, isLoading } = useVehicle(id!);
  const { data: history } = useVehicleHistory(id!);
  
  // Mutations
  const deleteVehicle = useDeleteVehicle();
  const setActiveVehicle = useSetActiveVehicle();
  const updateStatus = useUpdateVehicleStatus(id!);

  // Local state
  const [showHistory, setShowHistory] = useState(false);
  const [photoViewerVisible, setPhotoViewerVisible] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Photo viewer animation values
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedScale = useSharedValue(1);

  const openPhotoViewer = (index: number) => {
    setSelectedPhotoIndex(index);
    setPhotoViewerVisible(true);
    scale.value = 1;
    translateX.value = 0;
    translateY.value = 0;
    savedScale.value = 1;
  };

  const closePhotoViewer = () => {
    setPhotoViewerVisible(false);
    scale.value = withTiming(1);
    translateX.value = withTiming(0);
    translateY.value = withTiming(0);
    savedScale.value = 1;
  };

  const nextPhoto = () => {
    if (vehicle && selectedPhotoIndex < vehicle.photos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
      scale.value = withTiming(1);
      translateX.value = withTiming(0);
      translateY.value = withTiming(0);
      savedScale.value = 1;
    }
  };

  const previousPhoto = () => {
    if (selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
      scale.value = withTiming(1);
      translateX.value = withTiming(0);
      translateY.value = withTiming(0);
      savedScale.value = 1;
    }
  };

  // Pinch gesture handler for zoom
  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = savedScale.value * event.scale;
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withSpring(1);
      } else if (scale.value > 3) {
        scale.value = withSpring(3);
      }
      savedScale.value = scale.value;
    });

  // Pan gesture handler for dragging
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  // Compose gestures
  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  if (isLoading) {
    return <VehicleDetailsSkeleton />;
  }

  if (!vehicle) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="font-inter text-[16px] text-dark-400">Vehicle not found</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Delete Vehicle",
      "Are you sure you want to delete this vehicle? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteVehicle.mutateAsync(id!);
              router.back();
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to delete vehicle");
            }
          },
        },
      ]
    );
  };

  const handleSetActive = async () => {
    try {
      await setActiveVehicle.mutateAsync(id!);
      Alert.alert("Success", "Vehicle set as active");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to set vehicle as active");
    }
  };

  const handleStatusToggle = async (newStatus: "available" | "unavailable") => {
    try {
      await updateStatus.mutateAsync({ status: newStatus });
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update status");
    }
  };

  const handleEdit = () => {
    router.push(`/(vehicle)/edit-vehicle?id=${id}` as any);
  };

  // Check if current user is the vehicle owner
  const isOwner = user?.id === vehicle.driverId;

  // Role-based permission checks
  const canEdit = canEditVehicle(user?.role, vehicle.verificationStatus, isOwner);
  const canDelete = canDeleteVehicle(user?.role, vehicle.isActive, isOwner);
  const canSetActive = canSetActiveVehicle(user?.role, vehicle.verificationStatus, vehicle.isActive, isOwner);
  const canToggleStatus = canUpdateVehicleStatus(user?.role, vehicle.isActive, isOwner);

  // Check for expiring documents
  const isDocumentExpiringSoon = (expirationDate?: string) => {
    if (!expirationDate) return false;
    const daysUntilExpiry = Math.ceil(
      (new Date(expirationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isDocumentExpired = (expirationDate?: string) => {
    if (!expirationDate) return false;
    return new Date(expirationDate) < new Date();
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Back Button */}
        <View className="flex-row items-center px-5 py-4 border-b border-light-300">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
        </View>

        {/* Header */}
        <VehicleHeader vehicle={vehicle} />

        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Status Toggle (for active vehicle only) */}
          {vehicle.isActive && canToggleStatus && (
            <View className="px-5 py-4 bg-light-300">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="font-inter-semibold text-[15px] text-dark-400">
                    Vehicle Status
                  </Text>
                  <Text className="font-inter text-[13px] text-dark-100 mt-1">
                    {vehicle.status === "available" ? "Available for trips" : "Unavailable"}
                  </Text>
                </View>
                <Switch
                  value={vehicle.status === "available"}
                  onValueChange={(value) =>
                    handleStatusToggle(value ? "available" : "unavailable")
                  }
                  trackColor={{ false: "#BDBDC0", true: "#20A6FD" }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          )}

          {/* Vehicle Information */}
          <View className="px-5 py-4">
            <Text className="font-poppins-semibold text-[18px] text-dark-400 mb-4">
              Vehicle Information
            </Text>

            <View className="bg-light-300 rounded-2xl p-4 mb-4">
              {/* Driver Name */}
              <View className="mb-3">
                <Text className="font-inter text-[13px] text-dark-100 mb-1">Driver Name</Text>
                <Text className="font-inter-medium text-[15px] text-dark-400">
                  {vehicle.driverName}
                </Text>
              </View>

              {/* Date of Birth */}
              <View className="mb-3">
                <Text className="font-inter text-[13px] text-dark-100 mb-1">Date of Birth</Text>
                <Text className="font-inter-medium text-[15px] text-dark-400">
                  {vehicle.dateOfBirth}
                </Text>
              </View>

              {/* Gender */}
              <View className="mb-3">
                <Text className="font-inter text-[13px] text-dark-100 mb-1">Gender</Text>
                <Text className="font-inter-medium text-[15px] text-dark-400 capitalize">
                  {vehicle.gender}
                </Text>
              </View>

              {/* Phone */}
              <View className="mb-3">
                <Text className="font-inter text-[13px] text-dark-100 mb-1">Phone Number</Text>
                <Text className="font-inter-medium text-[15px] text-dark-400">
                  {vehicle.phone}
                </Text>
              </View>

              {/* Email */}
              <View className="mb-3">
                <Text className="font-inter text-[13px] text-dark-100 mb-1">Email</Text>
                <Text className="font-inter-medium text-[15px] text-dark-400">
                  {vehicle.email}
                </Text>
              </View>

              {/* Vehicle Type */}
              <View className="mb-3">
                <Text className="font-inter text-[13px] text-dark-100 mb-1">Vehicle Type</Text>
                <Text className="font-inter-medium text-[15px] text-dark-400 capitalize">
                  {vehicle.vehicleType.replace("_", " ")}
                </Text>
              </View>

              {/* Capacity */}
              <View className="mb-3">
                <Text className="font-inter text-[13px] text-dark-100 mb-1">Capacity</Text>
                <Text className="font-inter-medium text-[15px] text-dark-400">
                  {vehicle.capacity} {vehicle.capacityUnit}
                </Text>
              </View>

              {/* National ID */}
              <View className="mb-3">
                <Text className="font-inter text-[13px] text-dark-100 mb-1">National ID</Text>
                <Text className="font-inter-medium text-[15px] text-dark-400">
                  {vehicle.nationalId}
                </Text>
              </View>

              {/* Payment Method */}
              <View className="mb-3">
                <Text className="font-inter text-[13px] text-dark-100 mb-1">Payment Method</Text>
                <Text className="font-inter-medium text-[15px] text-dark-400 capitalize">
                  {vehicle.paymentMethod.replace("_", " ")}
                </Text>
              </View>

              {/* Service Zones */}
              <View>
                <Text className="font-inter text-[13px] text-dark-100 mb-2">Service Zones</Text>
                <View className="flex-row flex-wrap gap-2">
                  {vehicle.serviceZones.map((zone) => (
                    <View key={zone} className="bg-primary-50 rounded-full px-3 py-1">
                      <Text className="font-inter-medium text-[13px] text-primary-700">
                        {zone}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* Documents Section */}
          <View className="px-5 py-4 bg-light-300">
            <Text className="font-poppins-semibold text-[18px] text-dark-400 mb-4">
              Documents
            </Text>

            {/* Insurance */}
            <View className="bg-white rounded-2xl p-4 mb-3">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="font-inter-semibold text-[15px] text-dark-400">
                  Vehicle Insurance
                </Text>
                {vehicle.documents.insurance.expirationDate && (
                  <View>
                    {isDocumentExpired(vehicle.documents.insurance.expirationDate) ? (
                      <View className="bg-danger/10 rounded-full px-3 py-1">
                        <Text className="font-inter-medium text-[11px] text-danger">
                          Expired
                        </Text>
                      </View>
                    ) : isDocumentExpiringSoon(vehicle.documents.insurance.expirationDate) ? (
                      <View className="bg-warning/10 rounded-full px-3 py-1">
                        <Text className="font-inter-medium text-[11px] text-warning">
                          Expiring Soon
                        </Text>
                      </View>
                    ) : null}
                  </View>
                )}
              </View>
              {vehicle.documents.insurance.expirationDate && (
                <Text className="font-inter text-[13px] text-dark-100">
                  Expires: {new Date(vehicle.documents.insurance.expirationDate).toLocaleDateString()}
                </Text>
              )}
            </View>

            {/* Driving License */}
            <View className="bg-white rounded-2xl p-4 mb-3">
              <Text className="font-inter-semibold text-[15px] text-dark-400">
                Driving License
              </Text>
            </View>

            {/* Inspection Certificate */}
            {vehicle.documents.inspectionCertificate && (
              <View className="bg-white rounded-2xl p-4">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="font-inter-semibold text-[15px] text-dark-400">
                    Inspection Certificate
                  </Text>
                  {vehicle.documents.inspectionCertificate.expirationDate && (
                    <View>
                      {isDocumentExpired(vehicle.documents.inspectionCertificate.expirationDate) ? (
                        <View className="bg-danger/10 rounded-full px-3 py-1">
                          <Text className="font-inter-medium text-[11px] text-danger">
                            Expired
                          </Text>
                        </View>
                      ) : isDocumentExpiringSoon(vehicle.documents.inspectionCertificate.expirationDate) ? (
                        <View className="bg-warning/10 rounded-full px-3 py-1">
                          <Text className="font-inter-medium text-[11px] text-warning">
                            Expiring Soon
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  )}
                </View>
                {vehicle.documents.inspectionCertificate.expirationDate && (
                  <Text className="font-inter text-[13px] text-dark-100">
                    Expires: {new Date(vehicle.documents.inspectionCertificate.expirationDate).toLocaleDateString()}
                  </Text>
                )}
              </View>
            )}
          </View>

          {/* Photos Section */}
          <View className="px-5 py-4">
            <Text className="font-poppins-semibold text-[18px] text-dark-400 mb-4">
              Vehicle Photos
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {vehicle.photos.map((photoUrl, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => openPhotoViewer(index)}
                  className="w-[31%] aspect-square"
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: photoUrl }}
                    className="w-full h-full rounded-lg"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Photo Viewer Modal */}
          <Modal
            visible={photoViewerVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={closePhotoViewer}
          >
            <View className="flex-1 bg-black">
              <SafeAreaView className="flex-1">
                {/* Header */}
                <View className="flex-row items-center justify-between px-5 py-4">
                  <TouchableOpacity
                    onPress={closePhotoViewer}
                    className="w-10 h-10 items-center justify-center"
                  >
                    <Ionicons name="close" size={28} color="#FFFFFF" />
                  </TouchableOpacity>
                  <Text className="font-inter-medium text-[15px] text-white">
                    {selectedPhotoIndex + 1} / {vehicle.photos.length}
                  </Text>
                  <View className="w-10" />
                </View>

                {/* Photo with zoom and pan */}
                <GestureHandlerRootView className="flex-1">
                  <GestureDetector gesture={composedGesture}>
                    <Animated.View className="flex-1 items-center justify-center">
                      <Animated.Image
                        source={{ uri: vehicle.photos[selectedPhotoIndex] }}
                        style={[
                          { width: SCREEN_WIDTH, height: SCREEN_WIDTH },
                          animatedStyle,
                        ]}
                        resizeMode="contain"
                      />
                    </Animated.View>
                  </GestureDetector>
                </GestureHandlerRootView>

                {/* Navigation Arrows */}
                <View className="absolute inset-0 flex-row items-center justify-between px-5 pointer-events-box-none">
                  {selectedPhotoIndex > 0 && (
                    <TouchableOpacity
                      onPress={previousPhoto}
                      className="w-12 h-12 bg-black/50 rounded-full items-center justify-center pointer-events-auto"
                    >
                      <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
                    </TouchableOpacity>
                  )}
                  <View className="flex-1" />
                  {selectedPhotoIndex < vehicle.photos.length - 1 && (
                    <TouchableOpacity
                      onPress={nextPhoto}
                      className="w-12 h-12 bg-black/50 rounded-full items-center justify-center pointer-events-auto"
                    >
                      <Ionicons name="chevron-forward" size={28} color="#FFFFFF" />
                    </TouchableOpacity>
                  )}
                </View>
              </SafeAreaView>
            </View>
          </Modal>

          {/* History Section */}
          <View className="px-5 py-4 bg-light-300">
            <TouchableOpacity
              onPress={() => setShowHistory(!showHistory)}
              className="flex-row items-center justify-between mb-4"
            >
              <Text className="font-poppins-semibold text-[18px] text-dark-400">
                Vehicle History
              </Text>
              <Ionicons
                name={showHistory ? "chevron-up" : "chevron-down"}
                size={24}
                color="#000000"
              />
            </TouchableOpacity>

            {showHistory && history && (
              <View className="bg-white rounded-2xl p-4">
                <HistoryTimeline events={history} />
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View className="px-5 py-4">
            <View className="gap-3">
              {canSetActive && (
                <TouchableOpacity
                  onPress={handleSetActive}
                  disabled={setActiveVehicle.isPending}
                  className="bg-primary-700 rounded-full py-4 items-center"
                >
                  <Text className="font-inter-semibold text-[15px] text-white">
                    {setActiveVehicle.isPending ? "Setting Active..." : "Set as Active Vehicle"}
                  </Text>
                </TouchableOpacity>
              )}

              {canEdit && (
                <TouchableOpacity
                  onPress={handleEdit}
                  className="bg-white border-2 border-primary-700 rounded-full py-4 items-center"
                >
                  <Text className="font-inter-semibold text-[15px] text-primary-700">
                    Edit Vehicle
                  </Text>
                </TouchableOpacity>
              )}

              {canDelete && (
                <TouchableOpacity
                  onPress={handleDelete}
                  disabled={deleteVehicle.isPending}
                  className="bg-white border-2 border-danger rounded-full py-4 items-center"
                >
                  <Text className="font-inter-semibold text-[15px] text-danger">
                    {deleteVehicle.isPending ? "Deleting..." : "Delete Vehicle"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
