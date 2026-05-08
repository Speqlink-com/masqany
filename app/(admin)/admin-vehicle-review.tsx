/**
 * Admin Vehicle Review Screen
 * 
 * Allows admins to review and approve/reject vehicle registrations
 */

import { AnimatedButton } from "@/components/vehicle/AnimatedButton";
import { VehicleDetailsSkeleton } from "@/components/vehicle/VehicleDetailsSkeleton";
import { VerificationBadge } from "@/components/vehicle/VerificationBadge";
import { canAccessAdminScreens, getPermissionErrorMessage } from "@/lib/permissions";
import { useApproveVehicle, useRejectVehicle, useVehicle } from "@/modules/vehicle/hooks";
import { useAuthStore } from "@/store/auth.store";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
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

export default function AdminVehicleReviewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
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
  
  // Fetch vehicle data
  const { data: vehicle, isLoading } = useVehicle(id!);
  
  // Mutations
  const approveVehicle = useApproveVehicle();
  const rejectVehicle = useRejectVehicle();

  // Local state
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [photoViewerVisible, setPhotoViewerVisible] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [documentViewerVisible, setDocumentViewerVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{ url: string; title: string } | null>(null);

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

  const openDocumentViewer = (url: string, title: string) => {
    setSelectedDocument({ url, title });
    setDocumentViewerVisible(true);
    scale.value = 1;
    translateX.value = 0;
    translateY.value = 0;
    savedScale.value = 1;
  };

  const closeDocumentViewer = () => {
    setDocumentViewerVisible(false);
    setSelectedDocument(null);
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

  const handleApprove = () => {
    Alert.alert(
      "Approve Vehicle",
      `Are you sure you want to approve ${vehicle.plateNumber}? The driver will be notified and can start accepting trips.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          style: "default",
          onPress: async () => {
            try {
              await approveVehicle.mutateAsync(id!);
              Alert.alert("Success", "Vehicle approved successfully", [
                { text: "OK", onPress: () => router.back() },
              ]);
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to approve vehicle");
            }
          },
        },
      ]
    );
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      Alert.alert("Validation Error", "Please provide a reason for rejection");
      return;
    }

    try {
      await rejectVehicle.mutateAsync({ id: id!, reason: rejectionReason.trim() });
      Alert.alert("Success", "Vehicle rejected successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to reject vehicle");
    }
  };

  const canApprove = vehicle.verificationStatus === "pending_verification";
  const canReject = vehicle.verificationStatus === "pending_verification";

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-4 border-b border-light-300">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text className="font-poppins-semibold text-[18px] text-dark-400">
            Review Vehicle
          </Text>
          <VerificationBadge status={vehicle.verificationStatus} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 200 }}>
            {/* Vehicle Header */}
            <View className="px-5 py-4 bg-light-300">
              <Text className="font-poppins-semibold text-[20px] text-dark-400">
                {vehicle.plateNumber}
              </Text>
              <Text className="font-inter text-[15px] text-dark-100 mt-1 capitalize">
                {vehicle.vehicleType.replace("_", " ")} • {vehicle.capacity} {vehicle.capacityUnit}
              </Text>
            </View>

            {/* Driver Information */}
            <View className="px-5 py-4">
              <Text className="font-poppins-semibold text-[18px] text-dark-400 mb-4">
                Driver Information
              </Text>

              <View className="bg-light-300 rounded-2xl p-4 mb-4">
                <View className="mb-3">
                  <Text className="font-inter text-[13px] text-dark-100 mb-1">Full Name</Text>
                  <Text className="font-inter-medium text-[15px] text-dark-400">
                    {vehicle.driverName}
                  </Text>
                </View>

                <View className="mb-3">
                  <Text className="font-inter text-[13px] text-dark-100 mb-1">Date of Birth</Text>
                  <Text className="font-inter-medium text-[15px] text-dark-400">
                    {vehicle.dateOfBirth}
                  </Text>
                </View>

                <View className="mb-3">
                  <Text className="font-inter text-[13px] text-dark-100 mb-1">Gender</Text>
                  <Text className="font-inter-medium text-[15px] text-dark-400 capitalize">
                    {vehicle.gender}
                  </Text>
                </View>

                <View className="mb-3">
                  <Text className="font-inter text-[13px] text-dark-100 mb-1">Phone Number</Text>
                  <Text className="font-inter-medium text-[15px] text-dark-400">
                    {vehicle.phone}
                  </Text>
                </View>

                <View className="mb-3">
                  <Text className="font-inter text-[13px] text-dark-100 mb-1">Email</Text>
                  <Text className="font-inter-medium text-[15px] text-dark-400">
                    {vehicle.email}
                  </Text>
                </View>

                <View>
                  <Text className="font-inter text-[13px] text-dark-100 mb-1">National ID</Text>
                  <Text className="font-inter-medium text-[15px] text-dark-400">
                    {vehicle.nationalId}
                  </Text>
                </View>
              </View>
            </View>

            {/* Vehicle Information */}
            <View className="px-5 py-4 bg-light-300">
              <Text className="font-poppins-semibold text-[18px] text-dark-400 mb-4">
                Vehicle Information
              </Text>

              <View className="bg-white rounded-2xl p-4 mb-4">
                <View className="mb-3">
                  <Text className="font-inter text-[13px] text-dark-100 mb-1">Payment Method</Text>
                  <Text className="font-inter-medium text-[15px] text-dark-400 capitalize">
                    {vehicle.paymentMethod.replace("_", " ")}
                  </Text>
                </View>

                {vehicle.paymentMethod === "mpesa" && vehicle.paymentDetails.mpesaNumber && (
                  <View className="mb-3">
                    <Text className="font-inter text-[13px] text-dark-100 mb-1">M-Pesa Number</Text>
                    <Text className="font-inter-medium text-[15px] text-dark-400">
                      {vehicle.paymentDetails.mpesaNumber}
                    </Text>
                  </View>
                )}

                {vehicle.paymentMethod === "bank_transfer" && (
                  <>
                    <View className="mb-3">
                      <Text className="font-inter text-[13px] text-dark-100 mb-1">Bank Name</Text>
                      <Text className="font-inter-medium text-[15px] text-dark-400">
                        {vehicle.paymentDetails.bankName}
                      </Text>
                    </View>
                    <View className="mb-3">
                      <Text className="font-inter text-[13px] text-dark-100 mb-1">Account Number</Text>
                      <Text className="font-inter-medium text-[15px] text-dark-400">
                        {vehicle.paymentDetails.accountNumber}
                      </Text>
                    </View>
                    <View className="mb-3">
                      <Text className="font-inter text-[13px] text-dark-100 mb-1">Account Name</Text>
                      <Text className="font-inter-medium text-[15px] text-dark-400">
                        {vehicle.paymentDetails.accountName}
                      </Text>
                    </View>
                  </>
                )}

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

            {/* Documents */}
            <View className="px-5 py-4">
              <Text className="font-poppins-semibold text-[18px] text-dark-400 mb-4">
                Documents
              </Text>

              <View className="gap-3">
                {/* Insurance */}
                <TouchableOpacity
                  onPress={() => openDocumentViewer(vehicle.documents.insurance.url, "Vehicle Insurance")}
                  activeOpacity={0.7}
                  className="bg-light-300 rounded-2xl p-4 flex-row items-center justify-between"
                >
                  <View className="flex-1">
                    <Text className="font-inter-semibold text-[15px] text-dark-400">
                      Vehicle Insurance
                    </Text>
                    {vehicle.documents.insurance.expirationDate && (
                      <Text className="font-inter text-[13px] text-dark-100 mt-1">
                        Expires: {new Date(vehicle.documents.insurance.expirationDate).toLocaleDateString()}
                      </Text>
                    )}
                  </View>
                  <Ionicons name="document-text-outline" size={24} color="#20A6FD" />
                </TouchableOpacity>

                {/* Driving License */}
                <TouchableOpacity
                  onPress={() => openDocumentViewer(vehicle.documents.drivingLicense.url, "Driving License")}
                  activeOpacity={0.7}
                  className="bg-light-300 rounded-2xl p-4 flex-row items-center justify-between"
                >
                  <View className="flex-1">
                    <Text className="font-inter-semibold text-[15px] text-dark-400">
                      Driving License
                    </Text>
                  </View>
                  <Ionicons name="document-text-outline" size={24} color="#20A6FD" />
                </TouchableOpacity>

                {/* Inspection Certificate */}
                {vehicle.documents.inspectionCertificate && (
                  <TouchableOpacity
                    onPress={() => openDocumentViewer(vehicle.documents.inspectionCertificate!.url, "Inspection Certificate")}
                    activeOpacity={0.7}
                    className="bg-light-300 rounded-2xl p-4 flex-row items-center justify-between"
                  >
                    <View className="flex-1">
                      <Text className="font-inter-semibold text-[15px] text-dark-400">
                        Inspection Certificate
                      </Text>
                      {vehicle.documents.inspectionCertificate.expirationDate && (
                        <Text className="font-inter text-[13px] text-dark-100 mt-1">
                          Expires: {new Date(vehicle.documents.inspectionCertificate.expirationDate).toLocaleDateString()}
                        </Text>
                      )}
                    </View>
                    <Ionicons name="document-text-outline" size={24} color="#20A6FD" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Photos */}
            <View className="px-5 py-4 bg-light-300">
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

            {/* Rejection Reason (if already rejected) */}
            {vehicle.verificationStatus === "rejected" && vehicle.rejectionReason && (
              <View className="px-5 py-4">
                <View className="bg-danger/10 rounded-2xl p-4">
                  <Text className="font-inter-semibold text-[15px] text-danger mb-2">
                    Rejection Reason
                  </Text>
                  <Text className="font-inter text-[14px] text-dark-400">
                    {vehicle.rejectionReason}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Action Buttons */}
          {(canApprove || canReject) && (
            <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-light-300 px-5 py-4 pb-8">
              {!showRejectInput ? (
                <View className="gap-3">
                  {canApprove && (
                    <AnimatedButton
                      title={approveVehicle.isPending ? "Approving..." : "Approve Vehicle"}
                      onPress={handleApprove}
                      disabled={approveVehicle.isPending}
                      variant="primary"
                    />
                  )}

                  {canReject && (
                    <TouchableOpacity
                      onPress={() => setShowRejectInput(true)}
                      className="bg-white border-2 border-danger rounded-full py-4 items-center"
                    >
                      <Text className="font-inter-semibold text-[15px] text-danger">
                        Reject Vehicle
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <View>
                  <Text className="font-inter-semibold text-[15px] text-dark-400 mb-3">
                    Reason for Rejection
                  </Text>
                  <TextInput
                    value={rejectionReason}
                    onChangeText={setRejectionReason}
                    placeholder="Provide a clear reason for rejection..."
                    placeholderTextColor="#BDBDC0"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    className="bg-light-300 rounded-2xl p-4 font-inter text-[14px] text-dark-400 mb-3"
                    style={{ minHeight: 100 }}
                  />
                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      onPress={() => {
                        setShowRejectInput(false);
                        setRejectionReason("");
                      }}
                      className="flex-1 bg-white border-2 border-light-400 rounded-full py-3 items-center"
                    >
                      <Text className="font-inter-semibold text-[15px] text-dark-400">
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleReject}
                      disabled={rejectVehicle.isPending || !rejectionReason.trim()}
                      className={`flex-1 rounded-full py-3 items-center ${
                        rejectVehicle.isPending || !rejectionReason.trim()
                          ? "bg-danger/50"
                          : "bg-danger"
                      }`}
                    >
                      <Text className="font-inter-semibold text-[15px] text-white">
                        {rejectVehicle.isPending ? "Rejecting..." : "Confirm Reject"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}
        </KeyboardAvoidingView>

        {/* Photo Viewer Modal */}
        <Modal
          visible={photoViewerVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={closePhotoViewer}
        >
          <View className="flex-1 bg-black">
            <SafeAreaView className="flex-1">
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

        {/* Document Viewer Modal */}
        <Modal
          visible={documentViewerVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={closeDocumentViewer}
        >
          <View className="flex-1 bg-black">
            <SafeAreaView className="flex-1">
              <View className="flex-row items-center justify-between px-5 py-4">
                <TouchableOpacity
                  onPress={closeDocumentViewer}
                  className="w-10 h-10 items-center justify-center"
                >
                  <Ionicons name="close" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <Text className="font-inter-medium text-[15px] text-white">
                  {selectedDocument?.title}
                </Text>
                <View className="w-10" />
              </View>

              {selectedDocument && (
                <GestureHandlerRootView className="flex-1">
                  <GestureDetector gesture={composedGesture}>
                    <Animated.View className="flex-1 items-center justify-center">
                      <Animated.Image
                        source={{ uri: selectedDocument.url }}
                        style={[
                          { width: SCREEN_WIDTH, height: SCREEN_WIDTH * 1.4 },
                          animatedStyle,
                        ]}
                        resizeMode="contain"
                      />
                    </Animated.View>
                  </GestureDetector>
                </GestureHandlerRootView>
              )}
            </SafeAreaView>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}
