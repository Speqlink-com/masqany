/**
 * Property Registration Initial Screen
 * 
 * First screen for property registration with stay type selection and AI agent option
 */

import { canRegisterProperty, getPermissionErrorMessage } from "@/lib/permissions";
import { usePropertyStore, type LongStayPropertyType, type ShortStayPropertyType } from "@/modules/property";
import { useAuthStore } from "@/store/auth.store";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Alert, Image, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type StayType = "long_stay" | "short_stay" | null;

export default function PropertyRegistrationScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { setStayType, setPropertyType, setTotalSteps } = usePropertyStore();
  
  const [selectedStayType, setSelectedStayType] = useState<StayType>(null);
  const [showPropertyTypePicker, setShowPropertyTypePicker] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState<LongStayPropertyType | ShortStayPropertyType | "">("");

  // Property types based on stay type
  const longStayPropertyTypes: { value: LongStayPropertyType; label: string }[] = [
    { value: "bedsitter", label: "Bedsitter" },
    { value: "single_room", label: "Single Room" },
    { value: "1_bedroom", label: "1 Bedroom" },
    { value: "2_bedroom", label: "2 Bedroom" },
    { value: "3_bedroom", label: "3 Bedroom" },
    { value: "4plus_bedroom", label: "4+ Bedroom" },
    { value: "hostel_bed_space", label: "Hostel Bed Space" },
    { value: "hostel_private_room", label: "Hostel Private Room" },
    { value: "student_hostel", label: "Student Hostel" },
    { value: "office_space", label: "Office Space" },
    { value: "shop_retail", label: "Shop/Retail" },
    { value: "warehouse", label: "Warehouse" },
  ];

  const shortStayPropertyTypes: { value: ShortStayPropertyType; label: string }[] = [
    { value: "hotel_room_standard", label: "Hotel Room (Standard)" },
    { value: "hotel_suite", label: "Hotel Suite" },
    { value: "boutique_hotel", label: "Boutique Hotel" },
    { value: "guest_house", label: "Guest House" },
    { value: "bnb_room", label: "B&B Room" },
    { value: "vacation_home", label: "Vacation Home" },
    { value: "vacation_apartment", label: "Vacation Apartment" },
    { value: "villa", label: "Villa" },
    { value: "cottage", label: "Cottage" },
    { value: "airbnb_entire", label: "Airbnb (Entire Place)" },
    { value: "airbnb_private", label: "Airbnb (Private Room)" },
  ];

  // Get property types based on selected stay type
  const getPropertyTypes = () => {
    if (selectedStayType === "long_stay") {
      return longStayPropertyTypes;
    } else if (selectedStayType === "short_stay") {
      return shortStayPropertyTypes;
    }
    return [];
  };

  const propertyTypes = getPropertyTypes();

  // Reset property type when stay type changes
  useEffect(() => {
    if (selectedStayType) {
      setSelectedPropertyType("");
    }
  }, [selectedStayType]);

  // Check role-based access on mount
  useEffect(() => {
    if (user && !canRegisterProperty(user.role)) {
      Alert.alert(
        "Access Denied",
        getPermissionErrorMessage("register properties") + ". Only property owners and agents can register properties.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)/home" as any),
          },
        ]
      );
    }
  }, [user, router]);

  const handleAskMasqanyAI = () => {
    Alert.alert(
      "Masqany AI Agent",
      "AI-powered registration assistant coming soon! This will help you register your property faster with intelligent guidance.",
      [{ text: "OK" }]
    );
  };

  const handleNext = () => {
    if (!selectedStayType) {
      Alert.alert("Stay Type Required", "Please select whether this is a long stay or short stay property.");
      return;
    }

    if (!selectedPropertyType) {
      Alert.alert("Property Type Required", "Please select your property type.");
      return;
    }

    // Save selections to Zustand store
    setStayType(selectedStayType);
    setPropertyType(selectedPropertyType);
    
    // Set total steps based on stay type
    if (selectedStayType === "long_stay") {
      setTotalSteps(8); // Long-Stay has 8 steps
      router.push("/(registration)/property-long-stay-form" as any);
    } else {
      setTotalSteps(10); // Short-Stay has 10 steps
      router.push("/(registration)/property-short-stay-form" as any);
    }
  };

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      
      {/* Background Image */}
      <ImageBackground
        source={require("@/assets/images/property-registration-initial-screen.webp")}
        className="flex-1"
        resizeMode="cover"
      >
        <SafeAreaView className="flex-1" edges={["top"]}>
          {/* Header - 30% from top */}
          <View className="px-5 pt-4" style={{ height: "30%" }}>
            {/* Back Button and Pre-Verified Badge */}
            <View className="flex-row items-center justify-between mb-8">
              <TouchableOpacity
                onPress={() => router.back()}
                activeOpacity={0.8}
                className="w-10 h-10 rounded-full items-center justify-center bg-white"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Image
                  source={require("@/assets/icons/left-chevron.webp")}
                  style={{ width: 14, height: 14 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <View className="bg-white/90 rounded-full px-3 py-1.5 flex-row items-center">
                <Image
                  source={require("@/assets/icons/success.png")}
                  className="w-4 h-4"
                  resizeMode="contain"
                />
                <Text className="font-inter-medium text-[11px] text-dark-400 ml-1">
                  Pre-Verified Account
                </Text>
              </View>
            </View>

            {/* Title */}
            <View className="mb-4">
              <Text className="font-poppins-bold text-[28px] text-white leading-tight">
                Become a Verified
              </Text>
              <Text className="font-poppins-bold text-[28px] text-white leading-tight">
                Property Owner with Masqany
              </Text>
            </View>

            {/* House Icon */}
            <View className="items-center mb-4">
              <Image
                source={require("@/assets/icons/house-icon.png")}
                style={{ width: 80, height: 80 }}
                resizeMode="contain"
              />
            </View>

            {/* Subtitle with User Icon */}
            <View className="flex-row items-center">
              <Image
                source={require("@/assets/icons/i-user-icon.webp")}
                className="w-4 h-4"
                resizeMode="contain"
              />
              <Text className="font-inter text-[14px] text-white ml-2">
                complete property registration to unlock tenants
              </Text>
            </View>
          </View>

          {/* Content - Starting at 35% from top */}
          <View className="flex-1 px-5">
            {/* Stay Type Selection Card - 80% width */}
            <View 
              className="bg-[#E1E6E8] rounded-3xl p-4 mb-4"
              style={{ width: "100%", alignSelf: "center" }}
            >
              <View className="flex-row gap-3">
                {/* Long Stay Button */}
                <TouchableOpacity
                  onPress={() => setSelectedStayType("long_stay")}
                  activeOpacity={0.8}
                  className="flex-1 rounded-2xl overflow-hidden"
                >
                  <LinearGradient
                    colors={selectedStayType === "long_stay" ? ["#333333", "#898989"] : ["#E1E6E8", "#E1E6E8"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="py-4 px-3 items-center"
                  >
                    <Image
                      source={require("@/assets/icons/house-icon.png")}
                      style={{ width: 32, height: 32, marginBottom: 8 }}
                      resizeMode="contain"
                      tintColor={selectedStayType === "long_stay" ? "#FFFFFF" : "#545454"}
                    />
                    <Text 
                      className={`font-inter-semibold text-[13px] ${
                        selectedStayType === "long_stay" ? "text-white" : "text-dark-400"
                      }`}
                    >
                      Long Stay
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Short Stay Button */}
                <TouchableOpacity
                  onPress={() => setSelectedStayType("short_stay")}
                  activeOpacity={0.8}
                  className="flex-1 rounded-2xl overflow-hidden"
                >
                  <LinearGradient
                    colors={selectedStayType === "short_stay" ? ["#333333", "#898989"] : ["#E1E6E8", "#E1E6E8"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="py-4 px-3 items-center"
                  >
                    <Image
                      source={require("@/assets/icons/hotel-icon.webp")}
                      style={{ width: 32, height: 32, marginBottom: 8 }}
                      resizeMode="contain"
                      tintColor={selectedStayType === "short_stay" ? "#FFFFFF" : "#545454"}
                    />
                    <Text 
                      className={`font-inter-semibold text-[13px] ${
                        selectedStayType === "short_stay" ? "text-white" : "text-dark-400"
                      }`}
                    >
                      Short Stay
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            {/* AI Agent Card */}
            <View 
              className="bg-[#E1E6E8] rounded-3xl p-4 mb-4"
              style={{ width: "100%", alignSelf: "center" }}
            >
              <Text className="font-inter-semibold text-[14px] text-dark-400 text-center mb-3">
                Save time and register using Masqany AI Agent
              </Text>
              <TouchableOpacity
                onPress={handleAskMasqanyAI}
                activeOpacity={0.8}
                className="items-center"
              >
                <Image
                  source={require("@/assets/images/ask-masqany-btn.webp")}
                  style={{ width: 200, height: 50 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            {/* Property Type Card */}
            <View 
              className="bg-[#E1E6E8] rounded-3xl p-4 mb-4"
              style={{ width: "100%", alignSelf: "center" }}
            >
              {/* Header with Icon */}
              <View className="flex-row items-center mb-3">
                <Image
                  source={require("@/assets/icons/house-icon.png")}
                  style={{ width: 20, height: 20 }}
                  resizeMode="contain"
                />
                <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
                  Property Type
                </Text>
              </View>

              {/* Dropdown Input */}
              <TouchableOpacity
                onPress={() => {
                  if (!selectedStayType) {
                    Alert.alert("Select Stay Type", "Please select Long Stay or Short Stay first.");
                    return;
                  }
                  setShowPropertyTypePicker(!showPropertyTypePicker);
                }}
                className="border-[0.5px] border-[#28B4F9] rounded-full px-4 py-3 bg-white flex-row items-center justify-between"
              >
                <Text 
                  className={`font-inter text-[15px] ${
                    selectedPropertyType ? "text-dark-400" : "text-[#545454]"
                  }`}
                >
                  {selectedPropertyType 
                    ? propertyTypes.find(t => t.value === selectedPropertyType)?.label 
                    : "Select property type"}
                </Text>
                <Image
                  source={require("@/assets/icons/i-dropdown-icon.webp")}
                  className="w-4 h-4"
                  resizeMode="contain"
                />
              </TouchableOpacity>

              {/* Dropdown Options */}
              {showPropertyTypePicker && propertyTypes.length > 0 && (
                <View className="mt-2 bg-white rounded-2xl border border-[#28B4F9] overflow-hidden">
                  {propertyTypes.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      onPress={() => {
                        setSelectedPropertyType(type.value);
                        setShowPropertyTypePicker(false);
                      }}
                      className="px-4 py-3 border-b border-light-300"
                    >
                      <Text className="font-inter text-[15px] text-dark-400">
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Helper text when no stay type selected */}
              {!selectedStayType && (
                <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-4">
                  Please select a stay type first
                </Text>
              )}
            </View>

            {/* Next Button */}
            <TouchableOpacity
              onPress={handleNext}
              activeOpacity={0.8}
              className="bg-primary-700 rounded-full py-4 items-center"
              style={{
                shadowColor: "#20A6FD",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              <Text className="font-inter-semibold text-[16px] text-white">
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
