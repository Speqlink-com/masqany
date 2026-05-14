/**
 * Property Long-Stay Form Screen
 * 
 * Multi-step form for Long-Stay property registration (8 steps)
 * Uses sliding animations between steps
 */

import { PropertyFormHeader } from "@/components/property/PropertyFormHeader";
import { colors } from "@/constants/tokens";
import { useCreateProperty, usePropertyStore } from "@/modules/property";
import { useAuthStore } from "@/store/auth.store";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

type ImagePickerAsset = {
  uri: string;
  width: number;
  height: number;
  fileName?: string;
  fileSize?: number;
  type?: string;
  duration?: number;
};

export default function PropertyLongStayFormScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const {
    currentStep,
    setCurrentStep,
    totalSteps,
    longStayDraft,
    updateLongStayDraft,
    clearLongStayDraft,
    markSaved,
    setIsSaving,
  } = usePropertyStore();

  const createProperty = useCreateProperty();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sliding animation
  const translateX = useSharedValue(0);
  const [activeStep, setActiveStep] = useState(currentStep);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSaving(true);
      // Simulate save
      setTimeout(() => {
        markSaved();
      }, 500);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleBack = () => {
    if (currentStep === 1) {
      Alert.alert(
        "Exit Registration",
        "Your progress will be saved. Do you want to exit?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Exit",
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      // Slide to previous step
      translateX.value = withTiming(100, { duration: 350 }, () => {
        runOnJS(setCurrentStep)(currentStep - 1);
        runOnJS(setActiveStep)(currentStep - 1);
        translateX.value = 0;
      });
    }
  };

  const handleNext = () => {
    // Validate current step
    const validation = validateStep(currentStep);
    if (!validation.isValid) {
      Alert.alert("Incomplete Information", validation.message);
      return;
    }

    if (currentStep < totalSteps) {
      // Slide to next step
      translateX.value = withTiming(-100, { duration: 350 }, () => {
        runOnJS(setCurrentStep)(currentStep + 1);
        runOnJS(setActiveStep)(currentStep + 1);
        translateX.value = 0;
      });
    } else {
      // Submit form
      handleSubmit();
    }
  };

  const validateStep = (step: number): { isValid: boolean; message: string } => {
    switch (step) {
      case 1: // Property Essence
        if (!longStayDraft.acquisitionModel) {
          return { isValid: false, message: "Please select an acquisition model" };
        }
        if (longStayDraft.acquisitionModel === "affordable_housing_program") {
          if (!longStayDraft.ahpProgramName || !longStayDraft.ahpIncomeBand) {
            return { isValid: false, message: "Please provide AHP program details" };
          }
        }
        if (!longStayDraft.propertyCondition) {
          return { isValid: false, message: "Please select property condition" };
        }
        if (longStayDraft.propertyCondition === "under_construction" && !longStayDraft.expectedDeliveryDate) {
          return { isValid: false, message: "Please provide expected delivery date for under construction property" };
        }
        if (!longStayDraft.title || !longStayDraft.description) {
          return { isValid: false, message: "Please provide property title and description" };
        }
        if (!longStayDraft.buildingType) {
          return { isValid: false, message: "Please select building type" };
        }
        return { isValid: true, message: "" };
      
      case 2: // Location
        if (!longStayDraft.county || !longStayDraft.estate || !longStayDraft.nearestLandmark) {
          return { isValid: false, message: "Please provide county, estate, and nearest landmark" };
        }
        if (!longStayDraft.googleMapsLink) {
          return { isValid: false, message: "Please provide Google Maps link" };
        }
        if (!longStayDraft.directionsFromStage) {
          return { isValid: false, message: "Please provide directions from nearest stage" };
        }
        return { isValid: true, message: "" };
      
      case 3: // Property Specs
        if (longStayDraft.bedrooms === undefined || longStayDraft.bathrooms === undefined) {
          return { isValid: false, message: "Please provide number of bedrooms and bathrooms" };
        }
        if (!longStayDraft.kitchenType) {
          return { isValid: false, message: "Please select kitchen type" };
        }
        if (!longStayDraft.furnishingStatus) {
          return { isValid: false, message: "Please select furnishing status" };
        }
        if (!longStayDraft.parkingType) {
          return { isValid: false, message: "Please select parking type" };
        }
        return { isValid: true, message: "" };
      
      case 4: // Utilities & Deposits
        return { isValid: true, message: "" }; // Optional
      
      case 5: // Rental Pricing
        if (!longStayDraft.monthlyRent) {
          return { isValid: false, message: "Please provide monthly rent amount" };
        }
        return { isValid: true, message: "" };
      
      case 6: // House Rules
        if (longStayDraft.maxPersons === undefined) {
          return { isValid: false, message: "Please provide house rules" };
        }
        return { isValid: true, message: "" };
      
      case 7: // Media Uploads
        if (!longStayDraft.photos || longStayDraft.photos.length < 3) {
          return { isValid: false, message: "Please upload at least 3 photos" };
        }
        return { isValid: true, message: "" };
      
      case 8: // Terms & Conditions
        if (!longStayDraft.termsAccepted) {
          return { isValid: false, message: "Please accept all terms and conditions to submit" };
        }
        return { isValid: true, message: "" };
      
      default:
        return { isValid: true, message: "" };
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Transform longStayDraft to PropertyPayload
      const payload = {
        // Property Essence
        title: longStayDraft.title!,
        description: longStayDraft.description!,
        stayType: "long_stay" as const,
        propertyType: longStayDraft.buildingType || "apartment",
        
        // Property Condition & Acquisition
        propertyCondition: longStayDraft.propertyCondition,
        expectedDeliveryDate: longStayDraft.expectedDeliveryDate,
        acquisitionModel: longStayDraft.acquisitionModel,
        
        // AHP specific (if applicable)
        ...(longStayDraft.acquisitionModel === "affordable_housing_program" && {
          ahpProgramName: longStayDraft.ahpProgramName,
          ahpIncomeBand: longStayDraft.ahpIncomeBand,
          ahpUnitsAvailable: longStayDraft.ahpUnitsAvailable,
        }),
        
        // Building details
        buildingName: longStayDraft.buildingName,
        buildingType: longStayDraft.buildingType,
        totalUnitsInBuilding: longStayDraft.totalUnitsInBuilding,
        
        // Location
        county: longStayDraft.county!,
        constituency: longStayDraft.constituency,
        ward: longStayDraft.ward,
        estate: longStayDraft.estate!,
        nearestLandmark: longStayDraft.nearestLandmark!,
        streetRoad: longStayDraft.streetRoad,
        googleMapsLink: longStayDraft.googleMapsLink!,
        latitude: longStayDraft.latitude,
        longitude: longStayDraft.longitude,
        directionsFromStage: longStayDraft.directionsFromStage!,
        accessibilityNotes: longStayDraft.accessibilityNotes,
        
        // Property Specifications
        propertySize: longStayDraft.propertySize,
        propertySizeUnit: longStayDraft.propertySizeUnit,
        bedrooms: longStayDraft.bedrooms!,
        bathrooms: longStayDraft.bathrooms!,
        bathroomTypes: longStayDraft.bathroomTypes,
        kitchenType: longStayDraft.kitchenType!,
        furnishingStatus: longStayDraft.furnishingStatus!,
        furnishedItems: longStayDraft.furnishedItems,
        parkingType: longStayDraft.parkingType!,
        paidParkingCost: longStayDraft.paidParkingCost,
        waterSources: longStayDraft.waterSources,
        specialStructureType: longStayDraft.specialStructureType,
        
        // Utilities & Deposits
        utilityDeposits: longStayDraft.utilityDeposits,
        utilityPaymentResponsibility: longStayDraft.utilityPaymentResponsibility,
        securityDeposit: longStayDraft.securityDeposit,
        
        // Rental Pricing
        monthlyRent: longStayDraft.monthlyRent!,
        serviceCharge: longStayDraft.serviceCharge,
        rentNegotiable: longStayDraft.rentNegotiable,
        minimumLeaseTerm: longStayDraft.minimumLeaseTerm!,
        rentIncreasePolicy: longStayDraft.rentIncreasePolicy,
        
        // House Rules
        maxPersons: longStayDraft.maxPersons!,
        petsAllowed: longStayDraft.petsAllowed,
        smokingAllowed: longStayDraft.smokingAllowed,
        visitorsPolicy: longStayDraft.visitorsPolicy,
        quietHours: longStayDraft.quietHours,
        additionalRules: longStayDraft.additionalRules,
        
        // Media
        photos: longStayDraft.photos!,
        videoUrl: longStayDraft.videoUrl,
        virtualTourUrl: longStayDraft.virtualTourUrl,
        
        // Status
        status: "pending_verification" as const,
        
        // Owner info (from auth store)
        ownerId: user?.id || "",
        ownerName: user?.name || "",
        ownerPhone: user?.phone || "",
        ownerEmail: user?.email || "",
      };
      
      // Submit to API
      await createProperty.mutateAsync(payload as any);
      
      Alert.alert(
        "Registration Submitted! 🎉",
        "Your property registration has been submitted for review. You'll be notified once it's approved.",
        [
          {
            text: "OK",
            onPress: () => {
              clearLongStayDraft();
              router.replace("/(tabs)/home" as any);
            },
          },
        ]
      );
    } catch (error: any) {
      console.error("Property submission error:", error);
      Alert.alert(
        "Submission Failed",
        error.message || "Failed to submit registration. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const getStepTitle = (step: number): string => {
    switch (step) {
      case 1: return "Property Essence";
      case 2: return "Location Details";
      case 3: return "Property Specifications";
      case 4: return "Utilities & Deposits";
      case 5: return "Rental Pricing";
      case 6: return "House Rules";
      case 7: return "Media Uploads";
      case 8: return "Terms & Conditions";
      default: return "Property Registration";
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      
      {/* Header */}
      <PropertyFormHeader
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBack={handleBack}
        title={getStepTitle(currentStep)}
      />

      {/* Form Content */}
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {currentStep === 1 && <Step1PropertyEssence />}
          {currentStep === 2 && <Step2LocationDetails />}
          {currentStep === 3 && <Step3PropertySpecs />}
          {currentStep === 4 && <Step4UtilitiesDeposits />}
          {currentStep === 5 && <Step5RentalPricing />}
          {currentStep === 6 && <Step6HouseRules />}
          {currentStep === 7 && <Step7MediaUploads />}
          {currentStep === 8 && <Step8TermsConditions />}
        </ScrollView>
      </Animated.View>

      {/* Navigation Buttons */}
      <SafeAreaView edges={["bottom"]} className="px-5 py-4 bg-white border-t border-light-200">
        <View className="flex-row gap-3">
          {currentStep > 1 && (
            <TouchableOpacity
              onPress={handleBack}
              className="flex-1 py-3 rounded-full border-2 items-center"
              style={{ borderColor: colors.primary[700] }}
              activeOpacity={0.7}
            >
              <Text className="font-inter-semibold text-[15px]" style={{ color: colors.primary[700] }}>
                Back
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            onPress={handleNext}
            className="flex-1 py-3 rounded-full items-center"
            style={{ backgroundColor: colors.primary[700] }}
            activeOpacity={0.7}
            disabled={isSubmitting}
          >
            <Text className="font-inter-semibold text-[15px] text-white">
              {currentStep === totalSteps ? (isSubmitting ? "Submitting..." : "Submit") : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

// Step 1: Property Essence
function Step1PropertyEssence() {
  const { longStayDraft, updateLongStayDraft } = usePropertyStore();
  const [showAcquisitionPicker, setShowAcquisitionPicker] = useState(false);
  const [showConditionPicker, setShowConditionPicker] = useState(false);
  const [showIncomeBandPicker, setShowIncomeBandPicker] = useState(false);
  const [showBuildingTypePicker, setShowBuildingTypePicker] = useState(false);

  const isAHP = longStayDraft.acquisitionModel === "affordable_housing_program";

  return (
    <View>
      {/* Acquisition Model Card */}
      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/house-icon.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Acquisition Model <Text style={{ color: colors.danger }}>*</Text>
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowAcquisitionPicker(!showAcquisitionPicker)}
          className="border-[0.5px] border-[#28B4F9] rounded-full px-4 py-3 bg-white flex-row items-center justify-between"
        >
          <Text 
            className={`font-inter text-[15px] ${
              longStayDraft.acquisitionModel ? "text-dark-400" : "text-[#545454]"
            }`}
          >
            {longStayDraft.acquisitionModel === "private_owner" && "Private Owner"}
            {longStayDraft.acquisitionModel === "affordable_housing_program" && "Affordable Housing Program (AHP)"}
            {!longStayDraft.acquisitionModel && "Select acquisition model"}
          </Text>
          <Image
            source={require("@/assets/icons/i-dropdown-icon.webp")}
            className="w-4 h-4"
            resizeMode="contain"
          />
        </TouchableOpacity>
        {showAcquisitionPicker && (
          <View className="mt-2 bg-white rounded-2xl border border-[#28B4F9] overflow-hidden">
            <TouchableOpacity
              onPress={() => {
                updateLongStayDraft({ acquisitionModel: "private_owner" });
                setShowAcquisitionPicker(false);
              }}
              className="px-4 py-3 border-b border-light-300"
            >
              <Text className="font-inter-semibold text-[15px] text-dark-400">Private Owner</Text>
              <Text className="font-inter text-[11px] text-dark-100 mt-1">
                Standard property listing for rent
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                updateLongStayDraft({ acquisitionModel: "affordable_housing_program" });
                setShowAcquisitionPicker(false);
              }}
              className="px-4 py-3"
            >
              <Text className="font-inter-semibold text-[15px] text-dark-400">Affordable Housing Program (AHP)</Text>
              <Text className="font-inter text-[11px] text-dark-100 mt-1">
                Government subsidized housing - Application-based allocation
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          {isAHP ? "⚠️ AHP properties use application-based allocation, not instant booking" : "Standard market-rate property"}
        </Text>
      </View>

      {/* AHP Program Details (only if AHP) */}
      {isAHP && (
        <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E6F4FE" }}>
          <Text className="font-inter-semibold text-[14px] text-primary-700 mb-3">
            🏗 Affordable Housing Program Details
          </Text>
          
          <View className="mb-3">
            <View className="flex-row items-center mb-2">
              <Image
                source={require("@/assets/icons/house-icon.png")}
                style={{ width: 18, height: 18 }}
                resizeMode="contain"
              />
              <Text className="font-inter-semibold text-[13px] text-dark-400 ml-2">
                Program/Project Name <Text style={{ color: colors.danger }}>*</Text>
              </Text>
            </View>
            <TextInput
              className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
              placeholder="e.g., Rongai Housing Project"
              value={longStayDraft.ahpProgramName}
              onChangeText={(text) => updateLongStayDraft({ ahpProgramName: text })}
            />
          </View>

          <View className="mb-3">
            <View className="flex-row items-center mb-2">
              <Image
                source={require("@/assets/icons/wallet.png")}
                style={{ width: 18, height: 18 }}
                resizeMode="contain"
              />
              <Text className="font-inter-semibold text-[13px] text-dark-400 ml-2">
                Income Band <Text style={{ color: colors.danger }}>*</Text>
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowIncomeBandPicker(!showIncomeBandPicker)}
              className="border-[0.5px] border-[#28B4F9] rounded-full px-4 py-3 bg-white flex-row items-center justify-between"
            >
              <Text className={`font-inter text-[15px] ${longStayDraft.ahpIncomeBand ? "text-dark-400" : "text-[#545454]"}`}>
                {longStayDraft.ahpIncomeBand === "low_cost" && "Low Cost (<20,000 KES)"}
                {longStayDraft.ahpIncomeBand === "social_housing" && "Social Housing (<50,000 KES)"}
                {longStayDraft.ahpIncomeBand === "middle_income" && "Middle Income (<100,000 KES)"}
                {!longStayDraft.ahpIncomeBand && "Select income band"}
              </Text>
              <Image
                source={require("@/assets/icons/i-dropdown-icon.webp")}
                className="w-4 h-4"
                resizeMode="contain"
              />
            </TouchableOpacity>
            {showIncomeBandPicker && (
              <View className="mt-2 bg-white rounded-2xl border border-[#28B4F9] overflow-hidden">
                <TouchableOpacity
                  onPress={() => {
                    updateLongStayDraft({ ahpIncomeBand: "low_cost" });
                    setShowIncomeBandPicker(false);
                  }}
                  className="px-4 py-3 border-b border-light-300"
                >
                  <Text className="font-inter text-[15px] text-dark-400">Low Cost (&lt;20,000 KES)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    updateLongStayDraft({ ahpIncomeBand: "social_housing" });
                    setShowIncomeBandPicker(false);
                  }}
                  className="px-4 py-3 border-b border-light-300"
                >
                  <Text className="font-inter text-[15px] text-dark-400">Social Housing (&lt;50,000 KES)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    updateLongStayDraft({ ahpIncomeBand: "middle_income" });
                    setShowIncomeBandPicker(false);
                  }}
                  className="px-4 py-3"
                >
                  <Text className="font-inter text-[15px] text-dark-400">Middle Income (&lt;100,000 KES)</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View>
            <View className="flex-row items-center mb-2">
              <Image
                source={require("@/assets/icons/apparment-icon.webp")}
                style={{ width: 18, height: 18 }}
                resizeMode="contain"
              />
              <Text className="font-inter-semibold text-[13px] text-dark-400 ml-2">
                Units Available
              </Text>
            </View>
            <TextInput
              className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
              placeholder="e.g., 500"
              keyboardType="numeric"
              value={longStayDraft.ahpUnitsAvailable?.toString()}
              onChangeText={(text) => updateLongStayDraft({ ahpUnitsAvailable: parseInt(text) || 0 })}
            />
          </View>
        </View>
      )}

      {/* Property Condition Card */}
      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/stars-icon.webp")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Property Condition <Text style={{ color: colors.danger }}>*</Text>
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowConditionPicker(!showConditionPicker)}
          className="border-[0.5px] border-[#28B4F9] rounded-full px-4 py-3 bg-white flex-row items-center justify-between"
        >
          <Text className={`font-inter text-[15px] ${longStayDraft.propertyCondition ? "text-dark-400" : "text-[#545454]"}`}>
            {longStayDraft.propertyCondition === "ready_to_move" && "Ready to Move"}
            {longStayDraft.propertyCondition === "brand_new" && "Brand New 🆕"}
            {longStayDraft.propertyCondition === "under_construction" && "Under Construction 🏗"}
            {!longStayDraft.propertyCondition && "Select property condition"}
          </Text>
          <Image
            source={require("@/assets/icons/i-dropdown-icon.webp")}
            className="w-4 h-4"
            resizeMode="contain"
          />
        </TouchableOpacity>
        {showConditionPicker && (
          <View className="mt-2 bg-white rounded-2xl border border-[#28B4F9] overflow-hidden">
            <TouchableOpacity
              onPress={() => {
                updateLongStayDraft({ propertyCondition: "ready_to_move" });
                setShowConditionPicker(false);
              }}
              className="px-4 py-3 border-b border-light-300"
            >
              <Text className="font-inter text-[15px] text-dark-400">Ready to Move</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                updateLongStayDraft({ propertyCondition: "brand_new" });
                setShowConditionPicker(false);
              }}
              className="px-4 py-3 border-b border-light-300"
            >
              <Text className="font-inter text-[15px] text-dark-400">Brand New 🆕</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                updateLongStayDraft({ propertyCondition: "under_construction" });
                setShowConditionPicker(false);
              }}
              className="px-4 py-3"
            >
              <Text className="font-inter text-[15px] text-dark-400">Under Construction 🏗</Text>
            </TouchableOpacity>
          </View>
        )}
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          {longStayDraft.propertyCondition === "brand_new" && "✨ Brand new properties are in high demand!"}
          {longStayDraft.propertyCondition === "under_construction" && "⏰ You'll need to provide expected delivery date"}
        </Text>

        {/* Expected Delivery Date (conditional) */}
        {longStayDraft.propertyCondition === "under_construction" && (
          <View className="mt-3">
            <View className="flex-row items-center mb-2">
              <Image
                source={require("@/assets/icons/i-date-icon.webp")}
                style={{ width: 18, height: 18 }}
                resizeMode="contain"
              />
              <Text className="font-inter-semibold text-[13px] text-dark-400 ml-2">
                Expected Delivery Date <Text style={{ color: colors.danger }}>*</Text>
              </Text>
            </View>
            <TextInput
              className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
              placeholder="YYYY-MM-DD (e.g., 2026-06-30)"
              value={longStayDraft.expectedDeliveryDate}
              onChangeText={(text) => updateLongStayDraft({ expectedDeliveryDate: text })}
            />
          </View>
        )}
      </View>

      {/* Property Details Card */}
      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="mb-3">
          <View className="flex-row items-center mb-2">
            <Image
              source={require("@/assets/icons/edit.png")}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
            <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
              Property Title <Text style={{ color: colors.danger }}>*</Text>
            </Text>
          </View>
          <TextInput
            className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
            placeholder={isAHP ? "e.g., Rongai AHP - 2BR Apartment" : "e.g., Modern 2BR Apartment in Kilimani"}
            value={longStayDraft.title}
            onChangeText={(text) => updateLongStayDraft({ title: text })}
            maxLength={80}
          />
          <Text className="font-inter text-[11px] text-dark-100 mt-1 ml-1">
            {longStayDraft.title?.length || 0}/80 characters
          </Text>
        </View>

        <View className="mb-3">
          <View className="flex-row items-center mb-2">
            <Image
              source={require("@/assets/icons/info.png")}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
            <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
              Description <Text style={{ color: colors.danger }}>*</Text>
            </Text>
          </View>
          <TextInput
            className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-3xl border-[0.5px] border-[#28B4F9] bg-white"
            style={{ minHeight: 120, textAlignVertical: "top" }}
            placeholder={isAHP 
              ? "Describe the AHP project, unit features, and eligibility requirements..." 
              : "Describe your property, its features, and what makes it special..."}
            value={longStayDraft.description}
            onChangeText={(text) => updateLongStayDraft({ description: text })}
            maxLength={250}
            multiline
            numberOfLines={5}
          />
          <Text className="font-inter text-[11px] text-dark-100 mt-1 ml-1">
            {longStayDraft.description?.length || 0}/250 characters
          </Text>
        </View>

        <View className="mb-3">
          <View className="flex-row items-center mb-2">
            <Image
              source={require("@/assets/icons/apparment-icon.webp")}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
            <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
              Building Name (Optional)
            </Text>
          </View>
          <TextInput
            className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
            placeholder="e.g., Greenview Apartments"
            value={longStayDraft.buildingName}
            onChangeText={(text) => updateLongStayDraft({ buildingName: text })}
          />
        </View>

        <View className="mb-3">
          <View className="flex-row items-center mb-2">
            <Image
              source={require("@/assets/icons/home.png")}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
            <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
              Building Type <Text style={{ color: colors.danger }}>*</Text>
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowBuildingTypePicker(!showBuildingTypePicker)}
            className="border-[0.5px] border-[#28B4F9] rounded-full px-4 py-3 bg-white flex-row items-center justify-between"
          >
            <Text className={`font-inter text-[15px] ${longStayDraft.buildingType ? "text-dark-400" : "text-[#545454]"}`}>
              {longStayDraft.buildingType === "single_unit" && "Single Unit"}
              {longStayDraft.buildingType === "multiple_units_single_building" && "Multiple Units (Single Building)"}
              {longStayDraft.buildingType === "multiple_buildings" && "Multiple Buildings"}
              {longStayDraft.buildingType === "part_of_larger_building" && "Part of Larger Building"}
              {!longStayDraft.buildingType && "Select building type"}
            </Text>
            <Image
              source={require("@/assets/icons/i-dropdown-icon.webp")}
              className="w-4 h-4"
              resizeMode="contain"
            />
          </TouchableOpacity>
          {showBuildingTypePicker && (
            <View className="mt-2 bg-white rounded-2xl border border-[#28B4F9] overflow-hidden">
              {[
                { value: "single_unit", label: "Single Unit" },
                { value: "multiple_units_single_building", label: "Multiple Units (Single Building)" },
                { value: "multiple_buildings", label: "Multiple Buildings" },
                { value: "part_of_larger_building", label: "Part of Larger Building" },
              ].map((type, index, array) => (
                <TouchableOpacity
                  key={type.value}
                  onPress={() => {
                    updateLongStayDraft({ buildingType: type.value });
                    setShowBuildingTypePicker(false);
                  }}
                  className={`px-4 py-3 ${index < array.length - 1 ? "border-b border-light-300" : ""}`}
                >
                  <Text className="font-inter text-[15px] text-dark-400">{type.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Total Units (conditional) */}
        {(longStayDraft.buildingType === "multiple_units_single_building" || 
          longStayDraft.buildingType === "multiple_buildings") && (
          <View>
            <View className="flex-row items-center mb-2">
              <Image
                source={require("@/assets/icons/apparment-icon.webp")}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />
              <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
                Total Units in Building/Complex
              </Text>
            </View>
            <TextInput
              className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
              placeholder="e.g., 24"
              keyboardType="numeric"
              value={longStayDraft.totalUnitsInBuilding?.toString()}
              onChangeText={(text) => updateLongStayDraft({ totalUnitsInBuilding: parseInt(text) || 0 })}
            />
          </View>
        )}
      </View>
    </View>
  );
}

// Step 2: Location Details
function Step2LocationDetails() {
  const { longStayDraft, updateLongStayDraft } = usePropertyStore();
  const [showCountyPicker, setShowCountyPicker] = useState(false);
  const [showConstituencyPicker, setShowConstituencyPicker] = useState(false);
  const [showWardPicker, setShowWardPicker] = useState(false);
  const [countySearch, setCountySearch] = useState("");
  const [constituencySearch, setConstituencySearch] = useState("");
  const [wardSearch, setWardSearch] = useState("");

  // Import Kenya locations data
  const KENYA_COUNTIES = [
    "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu", "Garissa",
    "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi",
    "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu",
    "Machakos", "Makueni", "Mandera", "Marsabit", "Meru", "Migori", "Mombasa",
    "Murang'a", "Nairobi", "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua",
    "Nyeri", "Samburu", "Siaya", "Taita-Taveta", "Tana River", "Tharaka-Nithi",
    "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot",
  ];

  const CONSTITUENCIES_BY_COUNTY: Record<string, string[]> = {
    "Nairobi": ["Westlands", "Dagoretti North", "Dagoretti South", "Langata", "Kibra", "Roysambu", "Kasarani", "Ruaraka", "Embakasi South", "Embakasi North", "Embakasi Central", "Embakasi East", "Embakasi West", "Makadara", "Kamukunji", "Starehe", "Mathare"],
    "Kiambu": ["Gatundu South", "Gatundu North", "Juja", "Thika Town", "Ruiru", "Githunguri", "Kiambu", "Kiambaa", "Kabete", "Kikuyu", "Limuru", "Lari"],
    "Mombasa": ["Changamwe", "Jomvu", "Kisauni", "Nyali", "Likoni", "Mvita"],
  };

  const WARDS_BY_CONSTITUENCY: Record<string, string[]> = {
    "Westlands": ["Kitisuru", "Parklands/Highridge", "Karura", "Kangemi", "Mountain View"],
    "Dagoretti North": ["Kilimani", "Kawangware", "Gatina", "Kileleshwa", "Kabiro"],
    "Langata": ["Karen", "Nairobi West", "Mugumo-ini", "South C", "Nyayo Highrise"],
  };

  const filteredCounties = KENYA_COUNTIES.filter(county =>
    county.toLowerCase().includes(countySearch.toLowerCase())
  );

  const constituencies = longStayDraft.county ? (CONSTITUENCIES_BY_COUNTY[longStayDraft.county] || []) : [];
  const filteredConstituencies = constituencies.filter(constituency =>
    constituency.toLowerCase().includes(constituencySearch.toLowerCase())
  );

  const wards = longStayDraft.constituency ? (WARDS_BY_CONSTITUENCY[longStayDraft.constituency] || []) : [];
  const filteredWards = wards.filter(ward =>
    ward.toLowerCase().includes(wardSearch.toLowerCase())
  );

  return (
    <View>
      {/* County */}
      <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <Image
            source={require("@/assets/icons/house-icon.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            County <Text style={{ color: colors.danger }}>*</Text>
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowCountyPicker(!showCountyPicker)}
          className="border-[0.5px] border-[#28B4F9] rounded-full px-4 py-3 bg-white flex-row items-center justify-between"
        >
          <Text className={`font-inter text-[15px] ${longStayDraft.county ? "text-dark-400" : "text-[#545454]"}`}>
            {longStayDraft.county || "Select county"}
          </Text>
          <Image
            source={require("@/assets/icons/i-dropdown-icon.webp")}
            className="w-4 h-4"
            resizeMode="contain"
          />
        </TouchableOpacity>
        {showCountyPicker && (
          <View className="mt-2 bg-white rounded-2xl border border-[#28B4F9] overflow-hidden">
            <View className="px-4 py-2 border-b border-light-300">
              <TextInput
                className="font-inter text-[15px] text-dark-400 py-2"
                placeholder="Search county..."
                value={countySearch}
                onChangeText={setCountySearch}
              />
            </View>
            <ScrollView style={{ maxHeight: 200 }}>
              {filteredCounties.map((county, index) => (
                <TouchableOpacity
                  key={county}
                  onPress={() => {
                    updateLongStayDraft({ county, constituency: "", ward: "" });
                    setShowCountyPicker(false);
                    setCountySearch("");
                  }}
                  className={`px-4 py-3 ${index < filteredCounties.length - 1 ? "border-b border-light-300" : ""}`}
                >
                  <Text className="font-inter text-[15px] text-dark-400">{county}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Constituency */}
      <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <Image
            source={require("@/assets/icons/house-icon.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Constituency
          </Text>
        </View>
        
        {/* Allow typing or selecting */}
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white mb-2"
          placeholder="Type or select constituency"
          value={longStayDraft.constituency}
          onChangeText={(text) => updateLongStayDraft({ constituency: text })}
        />
        
        {/* Show dropdown button only if county is selected and has data */}
        {longStayDraft.county && constituencies.length > 0 && (
          <TouchableOpacity
            onPress={() => setShowConstituencyPicker(!showConstituencyPicker)}
            className="border-[0.5px] border-[#28B4F9] rounded-full px-4 py-3 bg-white flex-row items-center justify-between"
          >
            <Text className="font-inter text-[13px] text-primary-700">
              📋 Select from {constituencies.length} constituencies in {longStayDraft.county}
            </Text>
            <Image
              source={require("@/assets/icons/i-dropdown-icon.webp")}
              className="w-4 h-4"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
        
        {showConstituencyPicker && constituencies.length > 0 && (
          <View className="mt-2 bg-white rounded-2xl border border-[#28B4F9] overflow-hidden">
            <View className="px-4 py-2 border-b border-light-300">
              <TextInput
                className="font-inter text-[15px] text-dark-400 py-2"
                placeholder="Search constituency..."
                value={constituencySearch}
                onChangeText={setConstituencySearch}
              />
            </View>
            <ScrollView style={{ maxHeight: 200 }}>
              {filteredConstituencies.map((constituency, index) => (
                <TouchableOpacity
                  key={constituency}
                  onPress={() => {
                    updateLongStayDraft({ constituency, ward: "" });
                    setShowConstituencyPicker(false);
                    setConstituencySearch("");
                  }}
                  className={`px-4 py-3 ${index < filteredConstituencies.length - 1 ? "border-b border-light-300" : ""}`}
                >
                  <Text className="font-inter text-[15px] text-dark-400">{constituency}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          Type manually or select from dropdown (if available for your county)
        </Text>
      </View>

      {/* Ward */}
      <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <Image
            source={require("@/assets/icons/house-icon.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Ward
          </Text>
        </View>
        
        {/* Allow typing or selecting */}
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white mb-2"
          placeholder="Type or select ward"
          value={longStayDraft.ward}
          onChangeText={(text) => updateLongStayDraft({ ward: text })}
        />
        
        {/* Show dropdown button only if constituency is selected and has data */}
        {longStayDraft.constituency && wards.length > 0 && (
          <TouchableOpacity
            onPress={() => setShowWardPicker(!showWardPicker)}
            className="border-[0.5px] border-[#28B4F9] rounded-full px-4 py-3 bg-white flex-row items-center justify-between"
          >
            <Text className="font-inter text-[13px] text-primary-700">
              📋 Select from {wards.length} wards in {longStayDraft.constituency}
            </Text>
            <Image
              source={require("@/assets/icons/i-dropdown-icon.webp")}
              className="w-4 h-4"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
        
        {showWardPicker && wards.length > 0 && (
          <View className="mt-2 bg-white rounded-2xl border border-[#28B4F9] overflow-hidden">
            <View className="px-4 py-2 border-b border-light-300">
              <TextInput
                className="font-inter text-[15px] text-dark-400 py-2"
                placeholder="Search ward..."
                value={wardSearch}
                onChangeText={setWardSearch}
              />
            </View>
            <ScrollView style={{ maxHeight: 200 }}>
              {filteredWards.map((ward, index) => (
                <TouchableOpacity
                  key={ward}
                  onPress={() => {
                    updateLongStayDraft({ ward });
                    setShowWardPicker(false);
                    setWardSearch("");
                  }}
                  className={`px-4 py-3 ${index < filteredWards.length - 1 ? "border-b border-light-300" : ""}`}
                >
                  <Text className="font-inter text-[15px] text-dark-400">{ward}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          Type manually or select from dropdown (if available for your constituency)
        </Text>
      </View>

      {/* Estate */}
      <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <Image
            source={require("@/assets/icons/house-icon.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Estate/Neighborhood <Text style={{ color: colors.danger }}>*</Text>
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
          placeholder="e.g., Kilimani, Westlands, etc."
          value={longStayDraft.estate}
          onChangeText={(text) => updateLongStayDraft({ estate: text })}
        />
      </View>

      {/* Nearest Landmark */}
      <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <Image
            source={require("@/assets/icons/house-icon.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Nearest Landmark <Text style={{ color: colors.danger }}>*</Text>
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
          placeholder="e.g., Yaya Centre, Sarit Centre, etc."
          value={longStayDraft.nearestLandmark}
          onChangeText={(text) => updateLongStayDraft({ nearestLandmark: text })}
        />
      </View>

      {/* Street/Road */}
      <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <Image
            source={require("@/assets/icons/house-icon.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Street/Road
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
          placeholder="e.g., Argwings Kodhek Road"
          value={longStayDraft.streetRoad}
          onChangeText={(text) => updateLongStayDraft({ streetRoad: text })}
        />
      </View>

      {/* Google Maps Link */}
      <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <Image
            source={require("@/assets/icons/house-icon.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Google Maps Link <Text style={{ color: colors.danger }}>*</Text>
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
          placeholder="https://maps.google.com/..."
          value={longStayDraft.googleMapsLink}
          onChangeText={(text) => updateLongStayDraft({ googleMapsLink: text })}
          autoCapitalize="none"
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-4">
          Share the Google Maps link to your property location
        </Text>
      </View>

      {/* Directions from Stage */}
      <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <Image
            source={require("@/assets/icons/house-icon.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Directions from Nearest Stage <Text style={{ color: colors.danger }}>*</Text>
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-3xl border-[0.5px] border-[#28B4F9] bg-white"
          style={{ minHeight: 100, textAlignVertical: "top" }}
          placeholder="Describe how to get to the property from the nearest matatu stage..."
          value={longStayDraft.directionsFromStage}
          onChangeText={(text) => updateLongStayDraft({ directionsFromStage: text })}
          maxLength={300}
          multiline
          numberOfLines={4}
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-4">
          {longStayDraft.directionsFromStage?.length || 0}/300 characters
        </Text>
      </View>

      {/* Accessibility Notes */}
      <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <Image
            source={require("@/assets/icons/house-icon.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Accessibility Notes (Optional)
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-3xl border-[0.5px] border-[#28B4F9] bg-white"
          style={{ minHeight: 80, textAlignVertical: "top" }}
          placeholder="e.g., Wheelchair accessible, elevator available, ground floor..."
          value={longStayDraft.accessibilityNotes}
          onChangeText={(text) => updateLongStayDraft({ accessibilityNotes: text })}
          multiline
          numberOfLines={3}
        />
      </View>
    </View>
  );
}

// Step 3: Property Specifications
function Step3PropertySpecs() {
  const { longStayDraft, updateLongStayDraft } = usePropertyStore();
  const [showKitchenPicker, setShowKitchenPicker] = useState(false);
  const [showFurnishingPicker, setShowFurnishingPicker] = useState(false);
  const [showParkingPicker, setShowParkingPicker] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);

  const bathroomTypeOptions = [
    { value: "shower", label: "Shower" },
    { value: "bathtub", label: "Bathtub" },
    { value: "separate_toilet", label: "Separate Toilet" },
    { value: "ensuite", label: "Ensuite" },
    { value: "shared", label: "Shared" },
  ];

  const waterSourceOptions = [
    { value: "nairobi_water", label: "Nairobi Water" },
    { value: "county_water", label: "County Water" },
    { value: "borehole", label: "Borehole" },
    { value: "well", label: "Well" },
    { value: "tank_delivery", label: "Tank Delivery" },
    { value: "other", label: "Other" },
  ];

  const furnishedItemOptions = [
    "Bed", "Mattress", "Wardrobe", "Sofa", "Dining Table", "Chairs",
    "TV", "Fridge", "Cooker", "Microwave", "Washing Machine", "Curtains"
  ];

  const toggleBathroomType = (type: string) => {
    const current = longStayDraft.bathroomTypes || [];
    if (current.includes(type)) {
      updateLongStayDraft({ bathroomTypes: current.filter(t => t !== type) });
    } else {
      updateLongStayDraft({ bathroomTypes: [...current, type] });
    }
  };

  const toggleWaterSource = (source: string) => {
    const current = longStayDraft.waterSources || [];
    if (current.includes(source)) {
      updateLongStayDraft({ waterSources: current.filter(s => s !== source) });
    } else {
      updateLongStayDraft({ waterSources: [...current, source] });
    }
  };

  const toggleFurnishedItem = (item: string) => {
    const current = longStayDraft.furnishedItems || [];
    if (current.includes(item)) {
      updateLongStayDraft({ furnishedItems: current.filter(i => i !== item) });
    } else {
      updateLongStayDraft({ furnishedItems: [...current, item] });
    }
  };

  return (
    <View>
      <Text className="font-poppins-semibold text-[17px] text-dark-400 mb-4">
        Property Specifications
      </Text>

      {/* Property Size */}
      <View className="mb-4">
        <Text className="font-inter-medium text-[13px] text-dark-400 mb-2">
          Property Size (Optional)
        </Text>
        <View className="flex-row gap-2">
          <TextInput
            className="flex-1 font-inter text-[15px] text-dark-400 px-4 py-3 rounded-lg"
            style={{
              backgroundColor: colors.light[400],
              borderWidth: 1,
              borderColor: colors.light[200],
            }}
            placeholder="e.g., 850"
            keyboardType="numeric"
            value={longStayDraft.propertySize?.toString()}
            onChangeText={(text) => updateLongStayDraft({ propertySize: parseFloat(text) || 0 })}
          />
          <TouchableOpacity
            onPress={() => setShowSizePicker(!showSizePicker)}
            className="px-4 py-3 rounded-lg flex-row items-center"
            style={{
              backgroundColor: colors.light[400],
              borderWidth: 1,
              borderColor: colors.light[200],
            }}
          >
            <Text className="font-inter text-[15px] text-dark-400 mr-1">
              {longStayDraft.propertySizeUnit || "sqft"}
            </Text>
            <Text className="text-dark-100">▼</Text>
          </TouchableOpacity>
        </View>
        {showSizePicker && (
          <View className="mt-2 bg-white rounded-lg border border-light-200 overflow-hidden">
            {["sqft", "sqm", "acres"].map((unit) => (
              <TouchableOpacity
                key={unit}
                onPress={() => {
                  updateLongStayDraft({ propertySizeUnit: unit as any });
                  setShowSizePicker(false);
                }}
                className="px-4 py-3 border-b border-light-200"
              >
                <Text className="font-inter text-[15px] text-dark-400">{unit}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Bedrooms */}
      <View className="mb-4">
        <Text className="font-inter-medium text-[13px] text-dark-400 mb-2">
          Number of Bedrooms <Text style={{ color: colors.danger }}>*</Text>
        </Text>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-lg"
          style={{
            backgroundColor: colors.light[400],
            borderWidth: 1,
            borderColor: colors.light[200],
          }}
          placeholder="0 for bedsitter/studio"
          keyboardType="numeric"
          value={longStayDraft.bedrooms?.toString()}
          onChangeText={(text) => updateLongStayDraft({ bedrooms: parseInt(text) || 0 })}
        />
      </View>

      {/* Bathrooms */}
      <View className="mb-4">
        <Text className="font-inter-medium text-[13px] text-dark-400 mb-2">
          Number of Bathrooms <Text style={{ color: colors.danger }}>*</Text>
        </Text>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-lg"
          style={{
            backgroundColor: colors.light[400],
            borderWidth: 1,
            borderColor: colors.light[200],
          }}
          placeholder="e.g., 1"
          keyboardType="numeric"
          value={longStayDraft.bathrooms?.toString()}
          onChangeText={(text) => updateLongStayDraft({ bathrooms: parseInt(text) || 0 })}
        />
      </View>

      {/* Bathroom Types */}
      <View className="mb-4">
        <Text className="font-inter-medium text-[13px] text-dark-400 mb-2">
          Bathroom Types
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {bathroomTypeOptions.map((type) => (
            <TouchableOpacity
              key={type.value}
              onPress={() => toggleBathroomType(type.value)}
              className="px-4 py-2 rounded-full"
              style={{
                backgroundColor: (longStayDraft.bathroomTypes || []).includes(type.value)
                  ? colors.primary[700]
                  : colors.light[400],
                borderWidth: 1,
                borderColor: (longStayDraft.bathroomTypes || []).includes(type.value)
                  ? colors.primary[700]
                  : colors.light[200],
              }}
            >
              <Text
                className="font-inter-medium text-[13px]"
                style={{
                  color: (longStayDraft.bathroomTypes || []).includes(type.value)
                    ? "#FFFFFF"
                    : colors.dark[400],
                }}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Kitchen Type */}
      <View className="mb-4">
        <Text className="font-inter-medium text-[13px] text-dark-400 mb-2">
          Kitchen Type <Text style={{ color: colors.danger }}>*</Text>
        </Text>
        <TouchableOpacity
          onPress={() => setShowKitchenPicker(!showKitchenPicker)}
          className="flex-row items-center justify-between px-4 py-3 rounded-lg"
          style={{
            backgroundColor: colors.light[400],
            borderWidth: 1,
            borderColor: colors.light[200],
          }}
        >
          <Text className={`font-inter text-[15px] ${longStayDraft.kitchenType ? "text-dark-400" : "text-dark-100"}`}>
            {longStayDraft.kitchenType === "full_kitchen" && "Full Kitchen"}
            {longStayDraft.kitchenType === "kitchenette" && "Kitchenette"}
            {longStayDraft.kitchenType === "cooking_area_only" && "Cooking Area Only"}
            {longStayDraft.kitchenType === "no_kitchen" && "No Kitchen"}
            {longStayDraft.kitchenType === "shared_kitchen" && "Shared Kitchen"}
            {!longStayDraft.kitchenType && "Select kitchen type"}
          </Text>
          <Text className="text-dark-100">▼</Text>
        </TouchableOpacity>
        {showKitchenPicker && (
          <View className="mt-2 bg-white rounded-lg border border-light-200 overflow-hidden">
            {[
              { value: "full_kitchen", label: "Full Kitchen" },
              { value: "kitchenette", label: "Kitchenette" },
              { value: "cooking_area_only", label: "Cooking Area Only" },
              { value: "no_kitchen", label: "No Kitchen" },
              { value: "shared_kitchen", label: "Shared Kitchen" },
            ].map((type) => (
              <TouchableOpacity
                key={type.value}
                onPress={() => {
                  updateLongStayDraft({ kitchenType: type.value });
                  setShowKitchenPicker(false);
                }}
                className="px-4 py-3 border-b border-light-200"
              >
                <Text className="font-inter text-[15px] text-dark-400">{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Furnishing Status */}
      <View className="mb-4">
        <Text className="font-inter-medium text-[13px] text-dark-400 mb-2">
          Furnishing Status <Text style={{ color: colors.danger }}>*</Text>
        </Text>
        <TouchableOpacity
          onPress={() => setShowFurnishingPicker(!showFurnishingPicker)}
          className="flex-row items-center justify-between px-4 py-3 rounded-lg"
          style={{
            backgroundColor: colors.light[400],
            borderWidth: 1,
            borderColor: colors.light[200],
          }}
        >
          <Text className={`font-inter text-[15px] ${longStayDraft.furnishingStatus ? "text-dark-400" : "text-dark-100"}`}>
            {longStayDraft.furnishingStatus === "fully_furnished" && "Fully Furnished"}
            {longStayDraft.furnishingStatus === "semi_furnished" && "Semi Furnished"}
            {longStayDraft.furnishingStatus === "unfurnished" && "Unfurnished"}
            {!longStayDraft.furnishingStatus && "Select furnishing status"}
          </Text>
          <Text className="text-dark-100">▼</Text>
        </TouchableOpacity>
        {showFurnishingPicker && (
          <View className="mt-2 bg-white rounded-lg border border-light-200 overflow-hidden">
            {[
              { value: "fully_furnished", label: "Fully Furnished" },
              { value: "semi_furnished", label: "Semi Furnished" },
              { value: "unfurnished", label: "Unfurnished" },
            ].map((status) => (
              <TouchableOpacity
                key={status.value}
                onPress={() => {
                  updateLongStayDraft({ furnishingStatus: status.value });
                  setShowFurnishingPicker(false);
                }}
                className="px-4 py-3 border-b border-light-200"
              >
                <Text className="font-inter text-[15px] text-dark-400">{status.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Furnished Items (conditional) */}
      {(longStayDraft.furnishingStatus === "fully_furnished" || 
        longStayDraft.furnishingStatus === "semi_furnished") && (
        <View className="mb-4">
          <Text className="font-inter-medium text-[13px] text-dark-400 mb-2">
            Furnished Items
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {furnishedItemOptions.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => toggleFurnishedItem(item)}
                className="px-4 py-2 rounded-full"
                style={{
                  backgroundColor: (longStayDraft.furnishedItems || []).includes(item)
                    ? colors.primary[700]
                    : colors.light[400],
                  borderWidth: 1,
                  borderColor: (longStayDraft.furnishedItems || []).includes(item)
                    ? colors.primary[700]
                    : colors.light[200],
                }}
              >
                <Text
                  className="font-inter-medium text-[13px]"
                  style={{
                    color: (longStayDraft.furnishedItems || []).includes(item)
                      ? "#FFFFFF"
                      : colors.dark[400],
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Parking Type */}
      <View className="mb-4">
        <Text className="font-inter-medium text-[13px] text-dark-400 mb-2">
          Parking Type <Text style={{ color: colors.danger }}>*</Text>
        </Text>
        <TouchableOpacity
          onPress={() => setShowParkingPicker(!showParkingPicker)}
          className="flex-row items-center justify-between px-4 py-3 rounded-lg"
          style={{
            backgroundColor: colors.light[400],
            borderWidth: 1,
            borderColor: colors.light[200],
          }}
        >
          <Text className={`font-inter text-[15px] ${longStayDraft.parkingType ? "text-dark-400" : "text-dark-100"}`}>
            {longStayDraft.parkingType === "one_dedicated" && "One Dedicated Space"}
            {longStayDraft.parkingType === "two_plus_spaces" && "Two+ Spaces"}
            {longStayDraft.parkingType === "street_only" && "Street Parking Only"}
            {longStayDraft.parkingType === "no_parking" && "No Parking"}
            {longStayDraft.parkingType === "paid_parking" && "Paid Parking"}
            {!longStayDraft.parkingType && "Select parking type"}
          </Text>
          <Text className="text-dark-100">▼</Text>
        </TouchableOpacity>
        {showParkingPicker && (
          <View className="mt-2 bg-white rounded-lg border border-light-200 overflow-hidden">
            {[
              { value: "one_dedicated", label: "One Dedicated Space" },
              { value: "two_plus_spaces", label: "Two+ Spaces" },
              { value: "street_only", label: "Street Parking Only" },
              { value: "no_parking", label: "No Parking" },
              { value: "paid_parking", label: "Paid Parking" },
            ].map((type) => (
              <TouchableOpacity
                key={type.value}
                onPress={() => {
                  updateLongStayDraft({ parkingType: type.value });
                  setShowParkingPicker(false);
                }}
                className="px-4 py-3 border-b border-light-200"
              >
                <Text className="font-inter text-[15px] text-dark-400">{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Paid Parking Cost (conditional) */}
      {longStayDraft.parkingType === "paid_parking" && (
        <View className="mb-4">
          <Text className="font-inter-medium text-[13px] text-dark-400 mb-2">
            Parking Cost (KES/month)
          </Text>
          <TextInput
            className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-lg"
            style={{
              backgroundColor: colors.light[400],
              borderWidth: 1,
              borderColor: colors.light[200],
            }}
            placeholder="e.g., 2000"
            keyboardType="numeric"
            value={longStayDraft.paidParkingCost?.toString()}
            onChangeText={(text) => updateLongStayDraft({ paidParkingCost: parseFloat(text) || 0 })}
          />
        </View>
      )}

      {/* Water Sources */}
      <View className="mb-4">
        <Text className="font-inter-medium text-[13px] text-dark-400 mb-2">
          Water Sources
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {waterSourceOptions.map((source) => (
            <TouchableOpacity
              key={source.value}
              onPress={() => toggleWaterSource(source.value)}
              className="px-4 py-2 rounded-full"
              style={{
                backgroundColor: (longStayDraft.waterSources || []).includes(source.value)
                  ? colors.primary[700]
                  : colors.light[400],
                borderWidth: 1,
                borderColor: (longStayDraft.waterSources || []).includes(source.value)
                  ? colors.primary[700]
                  : colors.light[200],
              }}
            >
              <Text
                className="font-inter-medium text-[13px]"
                style={{
                  color: (longStayDraft.waterSources || []).includes(source.value)
                    ? "#FFFFFF"
                    : colors.dark[400],
                }}
              >
                {source.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Special Structure Type */}
      <View className="mb-4">
        <Text className="font-inter-medium text-[13px] text-dark-400 mb-2">
          Special Structure Type (Optional)
        </Text>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-lg"
          style={{
            backgroundColor: colors.light[400],
            borderWidth: 1,
            borderColor: colors.light[200],
          }}
          placeholder="e.g., Container house, Mabati house, etc."
          value={longStayDraft.specialStructureType}
          onChangeText={(text) => updateLongStayDraft({ specialStructureType: text })}
        />
      </View>
    </View>
  );
}

// Step 4: Utilities & Deposits
function Step4UtilitiesDeposits() {
  const { longStayDraft, updateLongStayDraft } = usePropertyStore();
  const [showUtilityResponsibilityPicker, setShowUtilityResponsibilityPicker] = useState(false);

  const utilityTypes = [
    { key: "water", label: "Water", icon: require("@/assets/icons/water-icon.png") },
    { key: "electricity", label: "Electricity", icon: require("@/assets/icons/bulb-icon.webp") },
    { key: "garbage", label: "Garbage Collection", icon: require("@/assets/icons/delete.png") },
  ];

  const updateUtilityDeposit = (utilityKey: string, field: string, value: any) => {
    const deposits = longStayDraft.utilityDeposits || {};
    updateLongStayDraft({
      utilityDeposits: {
        ...deposits,
        [utilityKey]: {
          ...(deposits[utilityKey] || {}),
          [field]: value,
        },
      },
    });
  };

  return (
    <View>
      {/* Kenya-Specific Utility Deposits */}
      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#FFF8E1" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/wallet.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[16px] text-dark-400 ml-2">
            🇰🇪 Kenya Utility Deposits
          </Text>
        </View>
        <Text className="font-inter text-[12px] text-dark-100 mb-4">
          In Kenya, landlords typically collect utility deposits to cover final bills when tenants move out.
        </Text>

        {utilityTypes.map((utility) => {
          const deposit = longStayDraft.utilityDeposits?.[utility.key] || {};
          return (
            <View key={utility.key} className="mb-4 p-3 rounded-2xl bg-white">
              <View className="flex-row items-center mb-3">
                <Image
                  source={utility.icon}
                  style={{ width: 18, height: 18 }}
                  resizeMode="contain"
                />
                <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
                  {utility.label} Deposit
                </Text>
              </View>

              <View className="mb-3">
                <Text className="font-inter text-[12px] text-dark-400 mb-2">
                  Deposit Amount (KES)
                </Text>
                <TextInput
                  className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
                  placeholder="e.g., 3000"
                  keyboardType="numeric"
                  value={deposit.amount?.toString()}
                  onChangeText={(text) => updateUtilityDeposit(utility.key, "amount", parseFloat(text) || 0)}
                />
              </View>

              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => updateUtilityDeposit(utility.key, "refundable", !deposit.refundable)}
                  className="flex-row items-center"
                >
                  <View
                    className="w-5 h-5 rounded border-[0.5px] border-[#28B4F9] items-center justify-center mr-2"
                    style={{ backgroundColor: deposit.refundable ? colors.primary[700] : "white" }}
                  >
                    {deposit.refundable && (
                      <Text className="text-white text-[12px]">✓</Text>
                    )}
                  </View>
                  <Text className="font-inter text-[13px] text-dark-400">
                    Refundable after final bill settlement
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>

      {/* Utility Payment Responsibility */}
      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/info.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Utility Payment Responsibility
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowUtilityResponsibilityPicker(!showUtilityResponsibilityPicker)}
          className="border-[0.5px] border-[#28B4F9] rounded-full px-4 py-3 bg-white flex-row items-center justify-between"
        >
          <Text className={`font-inter text-[15px] ${longStayDraft.utilityPaymentResponsibility ? "text-dark-400" : "text-[#545454]"}`}>
            {longStayDraft.utilityPaymentResponsibility === "tenant_pays_all" && "Tenant Pays All Utilities"}
            {longStayDraft.utilityPaymentResponsibility === "landlord_pays_all" && "Landlord Pays All (Included in Rent)"}
            {longStayDraft.utilityPaymentResponsibility === "shared" && "Shared/Split Between Tenant & Landlord"}
            {!longStayDraft.utilityPaymentResponsibility && "Select payment responsibility"}
          </Text>
          <Image
            source={require("@/assets/icons/i-dropdown-icon.webp")}
            className="w-4 h-4"
            resizeMode="contain"
          />
        </TouchableOpacity>
        {showUtilityResponsibilityPicker && (
          <View className="mt-2 bg-white rounded-2xl border border-[#28B4F9] overflow-hidden">
            <TouchableOpacity
              onPress={() => {
                updateLongStayDraft({ utilityPaymentResponsibility: "tenant_pays_all" });
                setShowUtilityResponsibilityPicker(false);
              }}
              className="px-4 py-3 border-b border-light-300"
            >
              <Text className="font-inter text-[15px] text-dark-400">Tenant Pays All Utilities</Text>
              <Text className="font-inter text-[11px] text-dark-100 mt-1">Most common in Kenya</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                updateLongStayDraft({ utilityPaymentResponsibility: "landlord_pays_all" });
                setShowUtilityResponsibilityPicker(false);
              }}
              className="px-4 py-3 border-b border-light-300"
            >
              <Text className="font-inter text-[15px] text-dark-400">Landlord Pays All (Included in Rent)</Text>
              <Text className="font-inter text-[11px] text-dark-100 mt-1">Utilities included in monthly rent</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                updateLongStayDraft({ utilityPaymentResponsibility: "shared" });
                setShowUtilityResponsibilityPicker(false);
              }}
              className="px-4 py-3"
            >
              <Text className="font-inter text-[15px] text-dark-400">Shared/Split Between Tenant & Landlord</Text>
              <Text className="font-inter text-[11px] text-dark-100 mt-1">Specify details in description</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Security Deposit */}
      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/wallet.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Security Deposit (Optional)
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
          placeholder="e.g., 25000 (typically 1 month rent)"
          keyboardType="numeric"
          value={longStayDraft.securityDeposit?.toString()}
          onChangeText={(text) => updateLongStayDraft({ securityDeposit: parseFloat(text) || 0 })}
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          Refundable deposit to cover damages (typically 1 month's rent in Kenya)
        </Text>
      </View>
    </View>
  );
}

function Step5RentalPricing() {
  const { longStayDraft, updateLongStayDraft } = usePropertyStore();
  const [showNegotiablePicker, setShowNegotiablePicker] = useState(false);
  const [showLeaseTermPicker, setShowLeaseTermPicker] = useState(false);

  const isAHP = longStayDraft.acquisitionModel === "affordable_housing_program";

  return (
    <View>
      {/* Monthly Rent */}
      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/wallet.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Monthly Rent <Text style={{ color: colors.danger }}>*</Text>
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
          placeholder={isAHP ? "e.g., 15000 (AHP subsidized rate)" : "e.g., 25000"}
          keyboardType="numeric"
          value={longStayDraft.monthlyRent?.toString()}
          onChangeText={(text) => updateLongStayDraft({ monthlyRent: parseFloat(text) || 0 })}
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          {isAHP 
            ? "AHP properties have government-subsidized rates based on income band" 
            : "Enter the monthly rent amount in KES"}
        </Text>
      </View>

      {/* Service Charge (Optional) */}
      {!isAHP && (
        <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
          <View className="flex-row items-center mb-3">
            <Image
              source={require("@/assets/icons/wallet.png")}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
            <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
              Service Charge (Optional)
            </Text>
          </View>
          <TextInput
            className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
            placeholder="e.g., 2000"
            keyboardType="numeric"
            value={longStayDraft.serviceCharge?.toString()}
            onChangeText={(text) => updateLongStayDraft({ serviceCharge: parseFloat(text) || 0 })}
          />
          <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
            Monthly service charge for amenities (security, cleaning, maintenance)
          </Text>
        </View>
      )}

      {/* Rent Negotiability */}
      {!isAHP && (
        <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
          <View className="flex-row items-center mb-3">
            <Image
              source={require("@/assets/icons/info.png")}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
            <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
              Is Rent Negotiable?
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowNegotiablePicker(!showNegotiablePicker)}
            className="border-[0.5px] border-[#28B4F9] rounded-full px-4 py-3 bg-white flex-row items-center justify-between"
          >
            <Text className={`font-inter text-[15px] ${longStayDraft.rentNegotiable !== undefined ? "text-dark-400" : "text-[#545454]"}`}>
              {longStayDraft.rentNegotiable === true && "Yes, Open to Negotiation"}
              {longStayDraft.rentNegotiable === false && "No, Fixed Price"}
              {longStayDraft.rentNegotiable === undefined && "Select option"}
            </Text>
            <Image
              source={require("@/assets/icons/i-dropdown-icon.webp")}
              className="w-4 h-4"
              resizeMode="contain"
            />
          </TouchableOpacity>
          {showNegotiablePicker && (
            <View className="mt-2 bg-white rounded-2xl border border-[#28B4F9] overflow-hidden">
              <TouchableOpacity
                onPress={() => {
                  updateLongStayDraft({ rentNegotiable: true });
                  setShowNegotiablePicker(false);
                }}
                className="px-4 py-3 border-b border-light-300"
              >
                <Text className="font-inter text-[15px] text-dark-400">Yes, Open to Negotiation</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  updateLongStayDraft({ rentNegotiable: false });
                  setShowNegotiablePicker(false);
                }}
                className="px-4 py-3"
              >
                <Text className="font-inter text-[15px] text-dark-400">No, Fixed Price</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Minimum Lease Term */}
      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/i-date-icon.webp")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Minimum Lease Term <Text style={{ color: colors.danger }}>*</Text>
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowLeaseTermPicker(!showLeaseTermPicker)}
          className="border-[0.5px] border-[#28B4F9] rounded-full px-4 py-3 bg-white flex-row items-center justify-between"
        >
          <Text className={`font-inter text-[15px] ${longStayDraft.minimumLeaseTerm ? "text-dark-400" : "text-[#545454]"}`}>
            {longStayDraft.minimumLeaseTerm === "6_months" && "6 Months"}
            {longStayDraft.minimumLeaseTerm === "1_year" && "1 Year"}
            {longStayDraft.minimumLeaseTerm === "2_years" && "2 Years"}
            {longStayDraft.minimumLeaseTerm === "flexible" && "Flexible"}
            {!longStayDraft.minimumLeaseTerm && "Select minimum lease term"}
          </Text>
          <Image
            source={require("@/assets/icons/i-dropdown-icon.webp")}
            className="w-4 h-4"
            resizeMode="contain"
          />
        </TouchableOpacity>
        {showLeaseTermPicker && (
          <View className="mt-2 bg-white rounded-2xl border border-[#28B4F9] overflow-hidden">
            {[
              { value: "6_months", label: "6 Months" },
              { value: "1_year", label: "1 Year (Most Common)" },
              { value: "2_years", label: "2 Years" },
              { value: "flexible", label: "Flexible" },
            ].map((term, index, array) => (
              <TouchableOpacity
                key={term.value}
                onPress={() => {
                  updateLongStayDraft({ minimumLeaseTerm: term.value as "6_months" | "1_year" | "2_years" | "flexible" });
                  setShowLeaseTermPicker(false);
                }}
                className={`px-4 py-3 ${index < array.length - 1 ? "border-b border-light-300" : ""}`}
              >
                <Text className="font-inter text-[15px] text-dark-400">{term.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          {isAHP 
            ? "AHP properties typically require longer lease terms" 
            : "Standard lease term in Kenya is 1 year"}
        </Text>
      </View>

      {/* Rent Increase Policy */}
      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/info.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Rent Increase Policy (Optional)
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-3xl border-[0.5px] border-[#28B4F9] bg-white"
          style={{ minHeight: 100, textAlignVertical: "top" }}
          placeholder="e.g., Rent may increase by 5-10% annually after first year..."
          value={longStayDraft.rentIncreasePolicy}
          onChangeText={(text) => updateLongStayDraft({ rentIncreasePolicy: text })}
          maxLength={200}
          multiline
          numberOfLines={4}
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          {longStayDraft.rentIncreasePolicy?.length || 0}/200 characters
        </Text>
      </View>
    </View>
  );
}

function Step6HouseRules() {
  const { longStayDraft, updateLongStayDraft } = usePropertyStore();
  const [showPetsPicker, setShowPetsPicker] = useState(false);
  const [showSmokingPicker, setShowSmokingPicker] = useState(false);
  const [showVisitorsPicker, setShowVisitorsPicker] = useState(false);

  return (
    <View>
      {/* Maximum Persons */}
      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/i-user-icon.webp")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Maximum Persons <Text style={{ color: colors.danger }}>*</Text>
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
          placeholder="e.g., 4"
          keyboardType="numeric"
          value={longStayDraft.maxPersons?.toString()}
          onChangeText={(text) => updateLongStayDraft({ maxPersons: parseInt(text) || 0 })}
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          Maximum number of people allowed to live in the property
        </Text>
      </View>

      {/* Pets Policy */}
      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/info.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Pets Policy <Text style={{ color: colors.danger }}>*</Text>
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowPetsPicker(!showPetsPicker)}
          className="border-[0.5px] border-[#28B4F9] rounded-full px-4 py-3 bg-white flex-row items-center justify-between"
        >
          <Text className={`font-inter text-[15px] ${longStayDraft.petsAllowed !== undefined ? "text-dark-400" : "text-[#545454]"}`}>
            {longStayDraft.petsAllowed === "allowed" && "Pets Allowed 🐾"}
            {longStayDraft.petsAllowed === "not_allowed" && "No Pets Allowed"}
            {longStayDraft.petsAllowed === "negotiable" && "Negotiable (Case by Case)"}
            {longStayDraft.petsAllowed === undefined && "Select pets policy"}
          </Text>
          <Image
            source={require("@/assets/icons/i-dropdown-icon.webp")}
            className="w-4 h-4"
            resizeMode="contain"
          />
        </TouchableOpacity>
        {showPetsPicker && (
          <View className="mt-2 bg-white rounded-2xl border border-[#28B4F9] overflow-hidden">
            <TouchableOpacity
              onPress={() => {
                updateLongStayDraft({ petsAllowed: "allowed" });
                setShowPetsPicker(false);
              }}
              className="px-4 py-3 border-b border-light-300"
            >
              <Text className="font-inter text-[15px] text-dark-400">Pets Allowed 🐾</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                updateLongStayDraft({ petsAllowed: "not_allowed" });
                setShowPetsPicker(false);
              }}
              className="px-4 py-3 border-b border-light-300"
            >
              <Text className="font-inter text-[15px] text-dark-400">No Pets Allowed</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                updateLongStayDraft({ petsAllowed: "negotiable" });
                setShowPetsPicker(false);
              }}
              className="px-4 py-3"
            >
              <Text className="font-inter text-[15px] text-dark-400">Negotiable (Case by Case)</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Smoking Policy */}
      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/info.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Smoking Policy <Text style={{ color: colors.danger }}>*</Text>
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowSmokingPicker(!showSmokingPicker)}
          className="border-[0.5px] border-[#28B4F9] rounded-full px-4 py-3 bg-white flex-row items-center justify-between"
        >
          <Text className={`font-inter text-[15px] ${longStayDraft.smokingAllowed !== undefined ? "text-dark-400" : "text-[#545454]"}`}>
            {longStayDraft.smokingAllowed === "allowed" && "Smoking Allowed"}
            {longStayDraft.smokingAllowed === "not_allowed" && "No Smoking 🚭"}
            {longStayDraft.smokingAllowed === "outdoor_only" && "Outdoor Areas Only"}
            {longStayDraft.smokingAllowed === undefined && "Select smoking policy"}
          </Text>
          <Image
            source={require("@/assets/icons/i-dropdown-icon.webp")}
            className="w-4 h-4"
            resizeMode="contain"
          />
        </TouchableOpacity>
        {showSmokingPicker && (
          <View className="mt-2 bg-white rounded-2xl border border-[#28B4F9] overflow-hidden">
            <TouchableOpacity
              onPress={() => {
                updateLongStayDraft({ smokingAllowed: "allowed" });
                setShowSmokingPicker(false);
              }}
              className="px-4 py-3 border-b border-light-300"
            >
              <Text className="font-inter text-[15px] text-dark-400">Smoking Allowed</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                updateLongStayDraft({ smokingAllowed: "not_allowed" });
                setShowSmokingPicker(false);
              }}
              className="px-4 py-3 border-b border-light-300"
            >
              <Text className="font-inter text-[15px] text-dark-400">No Smoking 🚭</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                updateLongStayDraft({ smokingAllowed: "outdoor_only" });
                setShowSmokingPicker(false);
              }}
              className="px-4 py-3"
            >
              <Text className="font-inter text-[15px] text-dark-400">Outdoor Areas Only</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Visitors Policy */}
      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/i-user-icon.webp")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Visitors Policy
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowVisitorsPicker(!showVisitorsPicker)}
          className="border-[0.5px] border-[#28B4F9] rounded-full px-4 py-3 bg-white flex-row items-center justify-between"
        >
          <Text className={`font-inter text-[15px] ${longStayDraft.visitorsPolicy ? "text-dark-400" : "text-[#545454]"}`}>
            {longStayDraft.visitorsPolicy === "allowed_anytime" && "Visitors Allowed Anytime"}
            {longStayDraft.visitorsPolicy === "daytime_only" && "Daytime Only (6am-10pm)"}
            {longStayDraft.visitorsPolicy === "prior_approval" && "Prior Approval Required"}
            {longStayDraft.visitorsPolicy === "not_allowed" && "No Visitors Allowed"}
            {!longStayDraft.visitorsPolicy && "Select visitors policy"}
          </Text>
          <Image
            source={require("@/assets/icons/i-dropdown-icon.webp")}
            className="w-4 h-4"
            resizeMode="contain"
          />
        </TouchableOpacity>
        {showVisitorsPicker && (
          <View className="mt-2 bg-white rounded-2xl border border-[#28B4F9] overflow-hidden">
            <TouchableOpacity
              onPress={() => {
                updateLongStayDraft({ visitorsPolicy: "allowed_anytime" });
                setShowVisitorsPicker(false);
              }}
              className="px-4 py-3 border-b border-light-300"
            >
              <Text className="font-inter text-[15px] text-dark-400">Visitors Allowed Anytime</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                updateLongStayDraft({ visitorsPolicy: "daytime_only" });
                setShowVisitorsPicker(false);
              }}
              className="px-4 py-3 border-b border-light-300"
            >
              <Text className="font-inter text-[15px] text-dark-400">Daytime Only (6am-10pm)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                updateLongStayDraft({ visitorsPolicy: "prior_approval" });
                setShowVisitorsPicker(false);
              }}
              className="px-4 py-3 border-b border-light-300"
            >
              <Text className="font-inter text-[15px] text-dark-400">Prior Approval Required</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                updateLongStayDraft({ visitorsPolicy: "not_allowed" });
                setShowVisitorsPicker(false);
              }}
              className="px-4 py-3"
            >
              <Text className="font-inter text-[15px] text-dark-400">No Visitors Allowed</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Noise Restrictions */}
      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/info.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Quiet Hours (Optional)
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
          placeholder="e.g., 10pm - 7am"
          value={longStayDraft.quietHours}
          onChangeText={(text) => updateLongStayDraft({ quietHours: text })}
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          Specify quiet hours to maintain peaceful environment
        </Text>
      </View>

      {/* Additional House Rules */}
      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/edit.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Additional House Rules (Optional)
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-3xl border-[0.5px] border-[#28B4F9] bg-white"
          style={{ minHeight: 120, textAlignVertical: "top" }}
          placeholder="Any other rules tenants should know about (e.g., no parties, no subletting, etc.)..."
          value={longStayDraft.additionalRules}
          onChangeText={(text) => updateLongStayDraft({ additionalRules: text })}
          maxLength={300}
          multiline
          numberOfLines={5}
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          {longStayDraft.additionalRules?.length || 0}/300 characters
        </Text>
      </View>
    </View>
  );
}

function Step7MediaUploads() {
  const { longStayDraft, updateLongStayDraft } = usePropertyStore();
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  // Request permissions on mount
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera roll permissions to upload photos and videos."
        );
      }
    })();
  }, []);

  const pickPhotos = async () => {
    try {
      setIsUploadingPhoto(true);
      
      // Check current photo count
      const currentPhotos = longStayDraft.photos || [];
      const remainingSlots = 6 - currentPhotos.length;
      
      if (remainingSlots <= 0) {
        Alert.alert("Maximum Photos Reached", "You can upload a maximum of 6 photos.");
        setIsUploadingPhoto(false);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: remainingSlots,
      });

      if (!result.canceled && result.assets) {
        // Validate file sizes
        const validAssets = result.assets.filter((asset) => {
          const sizeInMB = (asset.fileSize || 0) / (1024 * 1024);
          if (sizeInMB > 5) {
            Alert.alert("File Too Large", `${asset.fileName || "Photo"} is larger than 5MB. Please choose a smaller file.`);
            return false;
          }
          return true;
        });

        if (validAssets.length > 0) {
          const newPhotoUris = validAssets.map((asset) => asset.uri);
          const updatedPhotos = [...currentPhotos, ...newPhotoUris];
          updateLongStayDraft({ photos: updatedPhotos });
          
          Alert.alert(
            "Photos Added",
            `${validAssets.length} photo(s) added successfully. Total: ${updatedPhotos.length}/6`
          );
        }
      }
    } catch (error) {
      console.error("Error picking photos:", error);
      Alert.alert("Upload Error", "Failed to pick photos. Please try again.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const removePhoto = (index: number) => {
    Alert.alert(
      "Remove Photo",
      "Are you sure you want to remove this photo?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            const currentPhotos = longStayDraft.photos || [];
            const updatedPhotos = currentPhotos.filter((_, i) => i !== index);
            updateLongStayDraft({ photos: updatedPhotos });
          },
        },
      ]
    );
  };

  const pickVideo = async () => {
    try {
      setIsUploadingVideo(true);

      if (longStayDraft.videoUrl) {
        Alert.alert("Video Already Added", "You can only upload one video. Remove the existing video first.");
        setIsUploadingVideo(false);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["videos"],
        allowsMultipleSelection: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        
        // Validate file size (max 100MB)
        const sizeInMB = (asset.fileSize || 0) / (1024 * 1024);
        if (sizeInMB > 100) {
          Alert.alert("File Too Large", "Video must be smaller than 100MB. Please choose a smaller file.");
          setIsUploadingVideo(false);
          return;
        }

        // Optional: Check duration if available (max 120 seconds for flexibility)
        // Note: duration might not always be available depending on the platform
        if (asset.duration && asset.duration > 120) {
          Alert.alert(
            "Video Too Long", 
            `Video is ${Math.round(asset.duration)}s long. We recommend videos under 60 seconds for better engagement. Continue anyway?`,
            [
              { text: "Cancel", style: "cancel", onPress: () => setIsUploadingVideo(false) },
              { 
                text: "Continue", 
                onPress: () => {
                  updateLongStayDraft({ videoUrl: asset.uri });
                  Alert.alert("Video Added", "Video uploaded successfully!");
                  setIsUploadingVideo(false);
                }
              }
            ]
          );
          return;
        }

        updateLongStayDraft({ videoUrl: asset.uri });
        Alert.alert("Video Added", "Video uploaded successfully!");
      }
    } catch (error) {
      console.error("Error picking video:", error);
      Alert.alert("Upload Error", "Failed to pick video. Please try again.");
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const removeVideo = () => {
    Alert.alert(
      "Remove Video",
      "Are you sure you want to remove this video?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            updateLongStayDraft({ videoUrl: undefined });
          },
        },
      ]
    );
  };

  const currentPhotos = longStayDraft.photos || [];
  const hasMinimumPhotos = currentPhotos.length >= 3;

  return (
    <View>
      {/* Photo Upload */}
      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/gallery-icon.webp")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Property Photos <Text style={{ color: colors.danger }}>*</Text>
          </Text>
        </View>
        
        <View className="bg-white rounded-2xl p-4 border-[0.5px] border-[#28B4F9]">
          <Text className="font-inter text-[13px] text-dark-400 mb-3">
            📸 Upload at least 3 high-quality photos of your property
          </Text>
          
          <View className="mb-3">
            <Text className="font-inter-semibold text-[12px] text-dark-400 mb-2">
              Photo Tips:
            </Text>
            <Text className="font-inter text-[11px] text-dark-100 mb-1">
              • Take photos in good lighting (natural daylight is best)
            </Text>
            <Text className="font-inter text-[11px] text-dark-100 mb-1">
              • Show all rooms: living room, bedrooms, kitchen, bathroom
            </Text>
            <Text className="font-inter text-[11px] text-dark-100 mb-1">
              • Include exterior shots and any amenities
            </Text>
            <Text className="font-inter text-[11px] text-dark-100 mb-1">
              • Clean and declutter before taking photos
            </Text>
            <Text className="font-inter text-[11px] text-dark-100">
              • Avoid using filters - show the property as it is
            </Text>
          </View>

          {/* Photo Grid */}
          {currentPhotos.length > 0 && (
            <View className="mb-3">
              <View className="flex-row flex-wrap gap-2">
                {currentPhotos.map((photoUri, index) => (
                  <View key={index} className="relative">
                    <Image
                      source={{ uri: photoUri }}
                      style={{ width: 100, height: 100, borderRadius: 8 }}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      onPress={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-danger rounded-full p-1"
                      style={{ backgroundColor: colors.danger }}
                    >
                      <Text className="text-white text-[10px] font-bold px-1">✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          <TouchableOpacity
            onPress={pickPhotos}
            disabled={isUploadingPhoto || currentPhotos.length >= 6}
            className="py-3 rounded-full items-center"
            style={{ 
              backgroundColor: currentPhotos.length >= 6 ? colors.light[300] : colors.primary[700],
              opacity: isUploadingPhoto ? 0.6 : 1,
            }}
          >
            <Text className="font-inter-semibold text-[15px] text-white">
              {isUploadingPhoto ? "Uploading..." : currentPhotos.length >= 6 ? "Maximum Photos Reached" : "📷 Upload Photos"}
            </Text>
          </TouchableOpacity>

          {/* Photo count indicator */}
          <View className="mt-3 flex-row items-center justify-center">
            <Text className="font-inter text-[12px] text-dark-100">
              {currentPhotos.length}/6 photos uploaded
            </Text>
            {hasMinimumPhotos && (
              <Text className="font-inter text-[12px] ml-2" style={{ color: "#10B981" }}>
                ✓ Minimum met
              </Text>
            )}
            {!hasMinimumPhotos && currentPhotos.length > 0 && (
              <Text className="font-inter text-[12px] ml-2" style={{ color: colors.danger }}>
                ({3 - currentPhotos.length} more needed)
              </Text>
            )}
          </View>
        </View>

        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          Minimum 3 photos required. Properties with more photos get 40% more views!
        </Text>
      </View>

      {/* Video Upload (Optional) */}
      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/gallery-icon.webp")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Property Video (Optional)
          </Text>
        </View>
        
        <View className="bg-white rounded-2xl p-4 border-[0.5px] border-[#28B4F9]">
          <Text className="font-inter text-[13px] text-dark-400 mb-3">
            🎥 Upload a short video tour (recommended: 30-60 seconds, max 100MB)
          </Text>

          {longStayDraft.videoUrl && (
            <View className="mb-3 relative">
              <View className="bg-black rounded-lg overflow-hidden" style={{ height: 200 }}>
                <View className="flex-1 items-center justify-center">
                  <Text className="text-white text-[40px]">▶️</Text>
                  <Text className="text-white text-[12px] mt-2">Video Ready</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={removeVideo}
                className="absolute top-2 right-2 bg-danger rounded-full p-2"
                style={{ backgroundColor: colors.danger }}
              >
                <Text className="text-white text-[12px] font-bold px-1">✕</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            onPress={pickVideo}
            disabled={isUploadingVideo || !!longStayDraft.videoUrl}
            className="py-3 rounded-full items-center border-[0.5px] border-[#28B4F9]"
            style={{ 
              backgroundColor: longStayDraft.videoUrl ? colors.light[300] : "white",
              opacity: isUploadingVideo ? 0.6 : 1,
            }}
          >
            <Text 
              className="font-inter-semibold text-[15px]" 
              style={{ color: longStayDraft.videoUrl ? colors.dark[100] : colors.primary[700] }}
            >
              {isUploadingVideo ? "Uploading..." : longStayDraft.videoUrl ? "Video Uploaded ✓" : "🎬 Upload Video"}
            </Text>
          </TouchableOpacity>

          {longStayDraft.videoUrl && (
            <View className="mt-3 flex-row items-center justify-center">
              <Text className="font-inter text-[12px]" style={{ color: "#10B981" }}>
                ✓ Video uploaded successfully
              </Text>
            </View>
          )}
        </View>

        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          Properties with videos get 60% more inquiries! 🚀
        </Text>
      </View>

      {/* Virtual Tour Link (Optional) */}
      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/i-location-icon.webp")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Virtual Tour Link (Optional)
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
          placeholder="https://... (e.g., Matterport, YouTube)"
          value={longStayDraft.virtualTourUrl}
          onChangeText={(text) => updateLongStayDraft({ virtualTourUrl: text })}
          autoCapitalize="none"
          keyboardType="url"
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          Add a 360° virtual tour or YouTube video link
        </Text>
      </View>
    </View>
  );
}

function Step8TermsConditions() {
  const { longStayDraft, updateLongStayDraft } = usePropertyStore();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [hostAgreementAccepted, setHostAgreementAccepted] = useState(false);

  const allAccepted = termsAccepted && privacyAccepted && hostAgreementAccepted;

  // Update draft when all are accepted
  useEffect(() => {
    updateLongStayDraft({ termsAccepted: allAccepted });
  }, [allAccepted]);

  return (
    <View>
      {/* Summary Card */}
      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E6F4FE" }}>
        <Text className="font-inter-semibold text-[16px] text-primary-700 mb-2">
          🎉 Almost Done!
        </Text>
        <Text className="font-inter text-[13px] text-dark-400">
          You're one step away from listing your property on Masqany. Please review and accept the terms below.
        </Text>
      </View>

      {/* Terms & Conditions */}
      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/info.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Terms & Conditions
          </Text>
        </View>

        <View className="bg-white rounded-2xl p-4 mb-3">
          <Text className="font-inter-semibold text-[13px] text-dark-400 mb-2">
            Key Points:
          </Text>
          <Text className="font-inter text-[12px] text-dark-100 mb-2">
            • You confirm that you have the legal right to list this property
          </Text>
          <Text className="font-inter text-[12px] text-dark-100 mb-2">
            • All information provided is accurate and truthful
          </Text>
          <Text className="font-inter text-[12px] text-dark-100 mb-2">
            • You agree to Masqany's 10% service fee on successful bookings
          </Text>
          <Text className="font-inter text-[12px] text-dark-100 mb-2">
            • You will maintain the property as described in the listing
          </Text>
          <Text className="font-inter text-[12px] text-dark-100">
            • You agree to respond to inquiries within 24 hours
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setTermsAccepted(!termsAccepted)}
          className="flex-row items-center"
        >
          <View
            className="w-6 h-6 rounded border-[0.5px] border-[#28B4F9] items-center justify-center mr-3"
            style={{ backgroundColor: termsAccepted ? colors.primary[700] : "white" }}
          >
            {termsAccepted && (
              <Text className="text-white text-[14px] font-bold">✓</Text>
            )}
          </View>
          <Text className="font-inter text-[13px] text-dark-400 flex-1">
            I have read and agree to the{" "}
            <Text className="font-inter-semibold" style={{ color: colors.primary[700] }}>
              Terms & Conditions
            </Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Privacy Policy */}
      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/info.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Privacy Policy
          </Text>
        </View>

        <View className="bg-white rounded-2xl p-4 mb-3">
          <Text className="font-inter-semibold text-[13px] text-dark-400 mb-2">
            Your Data:
          </Text>
          <Text className="font-inter text-[12px] text-dark-100 mb-2">
            • Your contact information will be shared with verified tenants only
          </Text>
          <Text className="font-inter text-[12px] text-dark-100 mb-2">
            • Property photos and details will be publicly visible
          </Text>
          <Text className="font-inter text-[12px] text-dark-100 mb-2">
            • We use your data to improve our services and match you with tenants
          </Text>
          <Text className="font-inter text-[12px] text-dark-100">
            • Your data is protected and will never be sold to third parties
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setPrivacyAccepted(!privacyAccepted)}
          className="flex-row items-center"
        >
          <View
            className="w-6 h-6 rounded border-[0.5px] border-[#28B4F9] items-center justify-center mr-3"
            style={{ backgroundColor: privacyAccepted ? colors.primary[700] : "white" }}
          >
            {privacyAccepted && (
              <Text className="text-white text-[14px] font-bold">✓</Text>
            )}
          </View>
          <Text className="font-inter text-[13px] text-dark-400 flex-1">
            I have read and agree to the{" "}
            <Text className="font-inter-semibold" style={{ color: colors.primary[700] }}>
              Privacy Policy
            </Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Host Agreement */}
      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/info.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Host Agreement
          </Text>
        </View>

        <View className="bg-white rounded-2xl p-4 mb-3">
          <Text className="font-inter-semibold text-[13px] text-dark-400 mb-2">
            As a Masqany Host:
          </Text>
          <Text className="font-inter text-[12px] text-dark-100 mb-2">
            • You agree to provide a safe and habitable property
          </Text>
          <Text className="font-inter text-[12px] text-dark-100 mb-2">
            • You will honor confirmed bookings and lease agreements
          </Text>
          <Text className="font-inter text-[12px] text-dark-100 mb-2">
            • You will not discriminate based on race, religion, gender, or nationality
          </Text>
          <Text className="font-inter text-[12px] text-dark-100 mb-2">
            • You agree to resolve disputes through Masqany's resolution process
          </Text>
          <Text className="font-inter text-[12px] text-dark-100">
            • You will comply with all local housing laws and regulations
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setHostAgreementAccepted(!hostAgreementAccepted)}
          className="flex-row items-center"
        >
          <View
            className="w-6 h-6 rounded border-[0.5px] border-[#28B4F9] items-center justify-center mr-3"
            style={{ backgroundColor: hostAgreementAccepted ? colors.primary[700] : "white" }}
          >
            {hostAgreementAccepted && (
              <Text className="text-white text-[14px] font-bold">✓</Text>
            )}
          </View>
          <Text className="font-inter text-[13px] text-dark-400 flex-1">
            I agree to the{" "}
            <Text className="font-inter-semibold" style={{ color: colors.primary[700] }}>
              Host Agreement
            </Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Acceptance Status */}
      {!allAccepted && (
        <View className="p-4 rounded-2xl" style={{ backgroundColor: "#FFF3CD" }}>
          <Text className="font-inter text-[12px] text-center" style={{ color: "#856404" }}>
            ⚠️ Please accept all terms to submit your property listing
          </Text>
        </View>
      )}

      {allAccepted && (
        <View className="p-4 rounded-2xl" style={{ backgroundColor: "#D4EDDA" }}>
          <Text className="font-inter-semibold text-[13px] text-center" style={{ color: "#155724" }}>
            ✓ All terms accepted! You can now submit your listing.
          </Text>
        </View>
      )}
    </View>
  );
}
