/**
 * Edit Vehicle Screen
 * 
 * Allows editing of specific vehicle fields (capacity, service zones, payment method, photos)
 * Pre-fills form with current vehicle data
 */

import { AnimatedButton } from "@/components/vehicle/AnimatedButton";
import { CapacityInput } from "@/components/vehicle/CapacityInput";
import { PaymentMethodSelector } from "@/components/vehicle/PaymentMethodSelector";
import { PhotoUpload } from "@/components/vehicle/PhotoUpload";
import { ServiceZoneSelector } from "@/components/vehicle/ServiceZoneSelector";
import { VehicleDetailsSkeleton } from "@/components/vehicle/VehicleDetailsSkeleton";
import { useUpdateVehicle, useVehicle } from "@/modules/vehicle/hooks";
import type { PaymentDetails, PaymentMethod, VehicleUpdatePayload } from "@/modules/vehicle/types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditVehicleScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  // Fetch vehicle data
  const { data: vehicle, isLoading } = useVehicle(id!);
  const updateVehicle = useUpdateVehicle(id!);

  // Form state
  const [capacity, setCapacity] = useState<number>(0);
  const [capacityUnit, setCapacityUnit] = useState<"kg" | "cubic_meters">("kg");
  const [serviceZones, setServiceZones] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({});
  const [photos, setPhotos] = useState<Array<{ uri: string; type: string; name: string }>>([]);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-fill form with current vehicle data
  useEffect(() => {
    if (vehicle) {
      setCapacity(vehicle.capacity);
      setCapacityUnit(vehicle.capacityUnit);
      setServiceZones(vehicle.serviceZones);
      setPaymentMethod(vehicle.paymentMethod);
      setPaymentDetails(vehicle.paymentDetails);
    }
  }, [vehicle]);

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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate capacity
    if (!capacity || capacity < 50 || capacity > 10000) {
      newErrors.capacity = "Capacity must be between 50 and 10,000";
    }

    // Validate service zones
    if (serviceZones.length === 0) {
      newErrors.serviceZones = "Select at least one service zone";
    }

    // Validate payment details based on method
    if (paymentMethod === "mpesa") {
      if (!paymentDetails.mpesaNumber) {
        newErrors.paymentDetails = "M-Pesa number is required";
      } else if (!/^\+254\d{9}$/.test(paymentDetails.mpesaNumber)) {
        newErrors.paymentDetails = "Invalid M-Pesa number format (+254XXXXXXXXX)";
      }
    } else if (paymentMethod === "bank_transfer") {
      if (!paymentDetails.bankName || !paymentDetails.accountNumber || !paymentDetails.accountName) {
        newErrors.paymentDetails = "All bank details are required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fix the errors before saving");
      return;
    }

    try {
      const payload: VehicleUpdatePayload = {
        capacity,
        capacityUnit,
        serviceZones,
        paymentMethod,
        paymentDetails,
      };

      // Only include photos if new ones were added
      if (photos.length > 0) {
        payload.photos = photos;
      }

      await updateVehicle.mutateAsync(payload);
      Alert.alert("Success", "Vehicle updated successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update vehicle");
    }
  };

  const handleCancel = () => {
    Alert.alert(
      "Discard Changes",
      "Are you sure you want to discard your changes?",
      [
        { text: "Keep Editing", style: "cancel" },
        { text: "Discard", style: "destructive", onPress: () => router.back() },
      ]
    );
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-4 border-b border-light-300">
          <TouchableOpacity
            onPress={handleCancel}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="close" size={28} color="#000000" />
          </TouchableOpacity>
          <Text className="font-poppins-semibold text-[18px] text-dark-400">
            Edit Vehicle
          </Text>
          <View className="w-10" />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Vehicle Info (Read-only) */}
            <View className="px-5 py-4 bg-light-300">
              <Text className="font-inter-semibold text-[15px] text-dark-400 mb-2">
                {vehicle.plateNumber}
              </Text>
              <Text className="font-inter text-[13px] text-dark-100 capitalize">
                {vehicle.vehicleType.replace("_", " ")}
              </Text>
            </View>

            {/* Editable Fields */}
            <View className="px-5 py-6">
              {/* Capacity */}
              <View className="mb-6">
                <Text className="font-inter-semibold text-[15px] text-dark-400 mb-3">
                  Vehicle Capacity
                </Text>
                <CapacityInput
                  capacity={capacity}
                  onCapacityChange={setCapacity}
                  unit={capacityUnit}
                  onUnitChange={setCapacityUnit}
                  error={errors.capacity}
                />
              </View>

              {/* Service Zones */}
              <View className="mb-6">
                <Text className="font-inter-semibold text-[15px] text-dark-400 mb-3">
                  Service Zones
                </Text>
                <ServiceZoneSelector
                  selectedZones={serviceZones}
                  onZonesChange={setServiceZones}
                />
                {errors.serviceZones && (
                  <Text className="font-inter text-[13px] text-danger mt-2">
                    {errors.serviceZones}
                  </Text>
                )}
              </View>

              {/* Payment Method */}
              <View className="mb-6">
                <Text className="font-inter-semibold text-[15px] text-dark-400 mb-3">
                  Payment Method
                </Text>
                <PaymentMethodSelector
                  selectedMethod={paymentMethod}
                  onMethodChange={setPaymentMethod}
                  paymentDetails={paymentDetails}
                  onDetailsChange={setPaymentDetails}
                />
                {errors.paymentDetails && (
                  <Text className="font-inter text-[13px] text-danger mt-2">
                    {errors.paymentDetails}
                  </Text>
                )}
              </View>

              {/* Additional Photos */}
              <View className="mb-6">
                <Text className="font-inter-semibold text-[15px] text-dark-400 mb-3">
                  Add More Photos (Optional)
                </Text>
                <Text className="font-inter text-[13px] text-dark-100 mb-3">
                  Upload additional photos of your vehicle. Current photos will be kept.
                </Text>
                <PhotoUpload
                  photos={photos}
                  onPhotosChange={setPhotos}
                  minPhotos={0}
                  maxPhotos={10}
                />
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-light-300 px-5 py-4 pb-8">
            <View className="gap-3">
              <AnimatedButton
                onPress={handleSave}
                disabled={updateVehicle.isPending}
                className="bg-primary-700 rounded-full py-4 items-center"
              >
                <Text className="font-inter-semibold text-[15px] text-white">
                  {updateVehicle.isPending ? "Saving..." : "Save Changes"}
                </Text>
              </AnimatedButton>

              <TouchableOpacity
                onPress={handleCancel}
                disabled={updateVehicle.isPending}
                className="bg-white border-2 border-light-400 rounded-full py-4 items-center"
              >
                <Text className="font-inter-semibold text-[15px] text-dark-400">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
