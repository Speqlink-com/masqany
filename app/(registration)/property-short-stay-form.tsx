/**
 * Property Short-Stay Form Screen
 * 
 * Multi-step form for Short-Stay property registration (10 steps)
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
import { Alert, Image, Keyboard, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PropertyShortStayFormScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const {
    currentStep,
    setCurrentStep,
    totalSteps,
    shortStayDraft,
    updateShortStayDraft,
    clearShortStayDraft,
    markSaved,
    setIsSaving,
    setTotalSteps,
  } = usePropertyStore();

  const createProperty = useCreateProperty();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setTotalSteps(10);
    setCurrentStep(1);
  }, []);

  const translateX = useSharedValue(0);
  const [activeStep, setActiveStep] = useState(currentStep);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSaving(true);
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
      translateX.value = withTiming(100, { duration: 350 }, () => {
        runOnJS(setCurrentStep)(currentStep - 1);
        runOnJS(setActiveStep)(currentStep - 1);
        translateX.value = 0;
      });
    }
  };

  const handleNext = () => {
    const validation = validateStep(currentStep);
    if (!validation.isValid) {
      Alert.alert("Incomplete Information", validation.message);
      return;
    }

    if (currentStep < totalSteps) {
      translateX.value = withTiming(-100, { duration: 350 }, () => {
        runOnJS(setCurrentStep)(currentStep + 1);
        runOnJS(setActiveStep)(currentStep + 1);
        translateX.value = 0;
      });
    } else {
      handleSubmit();
    }
  };

  const validateStep = (step: number): { isValid: boolean; message: string } => {
    switch (step) {
      case 1:
        if (!shortStayDraft.title || !shortStayDraft.description) {
          return { isValid: false, message: "Please provide property title and description" };
        }
        if (!shortStayDraft.listingType) {
          return { isValid: false, message: "Please select listing type" };
        }
        return { isValid: true, message: "" };
      
      case 2:
        if (!shortStayDraft.county || !shortStayDraft.estate || !shortStayDraft.nearestLandmark) {
          return { isValid: false, message: "Please provide county, estate, and nearest landmark" };
        }
        if (!shortStayDraft.googleMapsLink) {
          return { isValid: false, message: "Please provide Google Maps link" };
        }
        if (!shortStayDraft.directionsFromStage) {
          return { isValid: false, message: "Please provide directions from nearest stage" };
        }
        return { isValid: true, message: "" };
      
      case 3:
        if (shortStayDraft.maxAdults === undefined) {
          return { isValid: false, message: "Please provide max adults" };
        }
        return { isValid: true, message: "" };
      
      case 4:
        return { isValid: true, message: "" };
      
      case 5:
        if (!shortStayDraft.baseNightlyRate) {
          return { isValid: false, message: "Please provide base nightly rate" };
        }
        return { isValid: true, message: "" };
      
      case 6:
        if (!shortStayDraft.minNightsStay || !shortStayDraft.checkInTimeFrom || !shortStayDraft.checkOutTime) {
          return { isValid: false, message: "Please provide booking rules" };
        }
        return { isValid: true, message: "" };
      
      case 7:
        if (!shortStayDraft.cancellationPolicy) {
          return { isValid: false, message: "Please select a cancellation policy" };
        }
        return { isValid: true, message: "" };
      
      case 8:
        if (shortStayDraft.maxPersons === undefined) {
          return { isValid: false, message: "Please provide house rules" };
        }
        return { isValid: true, message: "" };
      
      case 9:
        if (!shortStayDraft.photos || shortStayDraft.photos.length < 3) {
          return { isValid: false, message: "Please upload at least 3 photos" };
        }
        return { isValid: true, message: "" };
      
      case 10:
        return { isValid: true, message: "" };
      
      default:
        return { isValid: true, message: "" };
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const payload = {
        title: shortStayDraft.title!,
        description: shortStayDraft.description!,
        stayType: "short_stay" as const,
        propertyType: shortStayDraft.listingType || "vacation_home",
        county: shortStayDraft.county!,
        constituency: shortStayDraft.constituency,
        ward: shortStayDraft.ward,
        estate: shortStayDraft.estate!,
        nearestLandmark: shortStayDraft.nearestLandmark!,
        streetRoad: shortStayDraft.streetRoad,
        googleMapsLink: shortStayDraft.googleMapsLink!,
        latitude: shortStayDraft.latitude,
        longitude: shortStayDraft.longitude,
        directionsFromStage: shortStayDraft.directionsFromStage!,
        nearestTouristAttraction: shortStayDraft.nearestTouristAttraction,
        nearestAirport: shortStayDraft.nearestAirport,
        airportDistanceKm: shortStayDraft.airportDistanceKm,
        airportTransferAvailable: shortStayDraft.airportTransferAvailable,
        maxAdults: shortStayDraft.maxAdults!,
        maxChildren: shortStayDraft.maxChildren!,
        maxInfants: shortStayDraft.maxInfants,
        bedConfiguration: shortStayDraft.bedConfiguration,
        totalBeds: shortStayDraft.totalBeds,
        amenities: shortStayDraft.amenities,
        baseNightlyRate: shortStayDraft.baseNightlyRate!,
        standardOccupancy: shortStayDraft.standardOccupancy,
        weekendRate: shortStayDraft.weekendRate,
        cleaningFee: shortStayDraft.cleaningFee!,
        weeklyDiscountPercent: shortStayDraft.weeklyDiscountPercent,
        monthlyDiscountPercent: shortStayDraft.monthlyDiscountPercent,
        minNightsStay: shortStayDraft.minNightsStay!,
        maxNightsStay: shortStayDraft.maxNightsStay,
        checkInTimeFrom: shortStayDraft.checkInTimeFrom!,
        checkInTimeTo: shortStayDraft.checkInTimeTo,
        checkOutTime: shortStayDraft.checkOutTime!,
        instantBooking: shortStayDraft.instantBooking,
        cancellationPolicy: shortStayDraft.cancellationPolicy!,
        customCancellationPolicy: shortStayDraft.customCancellationPolicy,
        maxPersons: shortStayDraft.maxPersons!,
        petsAllowed: shortStayDraft.petsAllowed,
        smokingAllowed: shortStayDraft.smokingAllowed,
        additionalRules: shortStayDraft.additionalRules,
        photos: shortStayDraft.photos!,
        videoUrl: shortStayDraft.videoUrl,
        status: "pending_verification" as const,
        ownerId: user?.id || "",
        ownerName: user?.name || "",
        ownerPhone: user?.phone || "",
        ownerEmail: user?.email || "",
      };
      
      await createProperty.mutateAsync(payload as any);
      
      Alert.alert(
        "Registration Submitted! 🎉",
        "Your property registration has been submitted for review. You'll be notified once it's approved.",
        [
          {
            text: "OK",
            onPress: () => {
              clearShortStayDraft();
              router.replace("/(property-admin)" as any);
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
      case 3: return "Guest Capacity";
      case 4: return "Amenities";
      case 5: return "Pricing";
      case 6: return "Availability & Booking";
      case 7: return "Cancellation Policy";
      case 8: return "House Rules";
      case 9: return "Media Uploads";
      case 10: return "Terms & Conditions";
      default: return "Property Registration";
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      
      <PropertyFormHeader
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBack={handleBack}
        title={getStepTitle(currentStep)}
      />

      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 20 }}
            showsVerticalScrollIndicator={true}
            indicatorStyle="default"
            keyboardShouldPersistTaps="handled"
          >
            {currentStep === 1 && <Step1PropertyEssence />}
            {currentStep === 2 && <Step2LocationDetails />}
            {currentStep === 3 && <Step3GuestCapacity />}
            {currentStep === 4 && <Step4Amenities />}
            {currentStep === 5 && <Step5Pricing />}
            {currentStep === 6 && <Step6AvailabilityBooking />}
            {currentStep === 7 && <Step7CancellationPolicy />}
            {currentStep === 8 && <Step8HouseRules />}
            {currentStep === 9 && <Step9MediaUploads />}
            {currentStep === 10 && <Step10TermsConditions />}
          </ScrollView>
        </TouchableWithoutFeedback>
      </Animated.View>

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

function Step1PropertyEssence() {
  const { shortStayDraft, updateShortStayDraft } = usePropertyStore();
  const [showListingTypePicker, setShowListingTypePicker] = useState(false);

  return (
    <View>
      <View className="flex-row items-center mb-4">
        <Image
          source={require("@/assets/icons/hotel-icon.webp")}
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
        <Text className="font-poppins-semibold text-[18px] text-dark-400 ml-3">
          Property Essence
        </Text>
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
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
          placeholder="e.g., Cozy 2BR Apartment in Westlands"
          value={shortStayDraft.title}
          onChangeText={(text) => updateShortStayDraft({ title: text })}
          maxLength={80}
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-1 ml-1">
          {shortStayDraft.title?.length || 0}/80 characters
        </Text>
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
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
          placeholder="Describe your property, nearby attractions, and what makes it special for short-stay guests..."
          value={shortStayDraft.description}
          onChangeText={(text) => updateShortStayDraft({ description: text })}
          maxLength={250}
          multiline
          numberOfLines={5}
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-1 ml-1">
          {shortStayDraft.description?.length || 0}/250 characters
        </Text>
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/home.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Listing Type <Text style={{ color: colors.danger }}>*</Text>
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowListingTypePicker(!showListingTypePicker)}
          className="border-[0.5px] border-[#28B4F9] rounded-full px-4 py-3 bg-white flex-row items-center justify-between"
        >
          <Text className={`font-inter text-[15px] ${shortStayDraft.listingType ? "text-dark-400" : "text-[#545454]"}`}>
            {shortStayDraft.listingType === "entire_place" && "Entire Place"}
            {shortStayDraft.listingType === "private_room" && "Private Room"}
            {shortStayDraft.listingType === "shared_room" && "Shared Room"}
            {shortStayDraft.listingType === "hotel_room" && "Hotel Room"}
            {shortStayDraft.listingType === "airbnb" && "Airbnb"}
            {!shortStayDraft.listingType && "Select listing type"}
          </Text>
          <Image
            source={require("@/assets/icons/i-dropdown-icon.webp")}
            className="w-4 h-4"
            resizeMode="contain"
          />
        </TouchableOpacity>
        {showListingTypePicker && (
          <View className="mt-2 bg-white rounded-2xl border border-[#28B4F9] overflow-hidden">
            {[
              { value: "entire_place", label: "Entire Place", desc: "Guests have the whole place to themselves" },
              { value: "private_room", label: "Private Room", desc: "Guests have a private room, shared common areas" },
              { value: "shared_room", label: "Shared Room", desc: "Guests sleep in a shared space" },
              { value: "hotel_room", label: "Hotel Room", desc: "Professional hotel accommodation" },
              { value: "airbnb", label: "Airbnb", desc: "Airbnb-style vacation rental" },
            ].map((type, index, array) => (
              <TouchableOpacity
                key={type.value}
                onPress={() => {
                  updateShortStayDraft({ listingType: type.value });
                  setShowListingTypePicker(false);
                }}
                className={`px-4 py-3 ${index < array.length - 1 ? "border-b border-light-300" : ""}`}
              >
                <Text className="font-inter-semibold text-[15px] text-dark-400">{type.label}</Text>
                <Text className="font-inter text-[11px] text-dark-100 mt-1">{type.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

function Step2LocationDetails() {
  const { shortStayDraft, updateShortStayDraft } = usePropertyStore();
  const [showCountyPicker, setShowCountyPicker] = useState(false);
  const [countySearch, setCountySearch] = useState("");

  const KENYA_COUNTIES = [
    "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu", "Garissa",
    "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi",
    "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu",
    "Machakos", "Makueni", "Mandera", "Marsabit", "Meru", "Migori", "Mombasa",
    "Murang'a", "Nairobi", "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua",
    "Nyeri", "Samburu", "Siaya", "Taita-Taveta", "Tana River", "Tharaka-Nithi",
    "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot",
  ];

  const filteredCounties = KENYA_COUNTIES.filter(county =>
    county.toLowerCase().includes(countySearch.toLowerCase())
  );

  return (
    <View>
      <View className="flex-row items-center mb-4">
        <Image
          source={require("@/assets/icons/hotel-icon.webp")}
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
        <Text className="font-poppins-semibold text-[18px] text-dark-400 ml-3">
          Location Details
        </Text>
      </View>

      <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <Image
            source={require("@/assets/icons/house-icon.webp")}
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
          <Text className={`font-inter text-[15px] ${shortStayDraft.county ? "text-dark-400" : "text-[#545454]"}`}>
            {shortStayDraft.county || "Select county"}
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
                    updateShortStayDraft({ county });
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

      <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <Image
            source={require("@/assets/icons/house-icon.webp")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Constituency
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
          placeholder="Type constituency"
          value={shortStayDraft.constituency}
          onChangeText={(text) => updateShortStayDraft({ constituency: text })}
        />
      </View>

      <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <Image
            source={require("@/assets/icons/house-icon.webp")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Ward
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
          placeholder="Type ward"
          value={shortStayDraft.ward}
          onChangeText={(text) => updateShortStayDraft({ ward: text })}
        />
      </View>

      <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <Image
            source={require("@/assets/icons/house-icon.webp")}
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
          value={shortStayDraft.estate}
          onChangeText={(text) => updateShortStayDraft({ estate: text })}
        />
      </View>

      <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <Image
            source={require("@/assets/icons/house-icon.webp")}
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
          value={shortStayDraft.nearestLandmark}
          onChangeText={(text) => updateShortStayDraft({ nearestLandmark: text })}
        />
      </View>

      <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <Image
            source={require("@/assets/icons/house-icon.webp")}
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
          value={shortStayDraft.streetRoad}
          onChangeText={(text) => updateShortStayDraft({ streetRoad: text })}
        />
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E6F4FE" }}>
        <Text className="font-inter-semibold text-[14px] text-primary-700 mb-3">
          🏖 Short-Stay Specific Location Details
        </Text>

        <View className="mb-3">
          <View className="flex-row items-center mb-2">
            <Image
              source={require("@/assets/icons/i-location-icon.webp")}
              style={{ width: 18, height: 18 }}
              resizeMode="contain"
            />
            <Text className="font-inter-semibold text-[13px] text-dark-400 ml-2">
              Nearest Tourist Attraction
            </Text>
          </View>
          <TextInput
            className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
            placeholder="e.g., Nairobi National Park, Giraffe Centre"
            value={shortStayDraft.nearestTouristAttraction}
            onChangeText={(text) => updateShortStayDraft({ nearestTouristAttraction: text })}
          />
        </View>

        <View className="mb-3">
          <View className="flex-row items-center mb-2">
            <Image
              source={require("@/assets/icons/i-location-icon.webp")}
              style={{ width: 18, height: 18 }}
              resizeMode="contain"
            />
            <Text className="font-inter-semibold text-[13px] text-dark-400 ml-2">
              Nearest Airport
            </Text>
          </View>
          <TextInput
            className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
            placeholder="e.g., JKIA, Wilson Airport"
            value={shortStayDraft.nearestAirport}
            onChangeText={(text) => updateShortStayDraft({ nearestAirport: text })}
          />
        </View>

        <View className="mb-3">
          <View className="flex-row items-center mb-2">
            <Image
              source={require("@/assets/icons/i-location-icon.webp")}
              style={{ width: 18, height: 18 }}
              resizeMode="contain"
            />
            <Text className="font-inter-semibold text-[13px] text-dark-400 ml-2">
              Airport Distance (km)
            </Text>
          </View>
          <TextInput
            className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
            placeholder="e.g., 15"
            keyboardType="numeric"
            value={shortStayDraft.airportDistanceKm?.toString()}
            onChangeText={(text) => updateShortStayDraft({ airportDistanceKm: parseFloat(text) || 0 })}
          />
        </View>

        <View className="mb-3">
          <View className="flex-row items-center justify-between">
            <Text className="font-inter-semibold text-[13px] text-dark-400">
              Airport Transfer Available?
            </Text>
            <TouchableOpacity
              onPress={() => updateShortStayDraft({ airportTransferAvailable: !shortStayDraft.airportTransferAvailable })}
              className="px-4 py-2 rounded-full"
              style={{ backgroundColor: shortStayDraft.airportTransferAvailable ? colors.primary[700] : "#E1E6E8" }}
            >
              <Text className="font-inter-semibold text-[13px]" style={{ color: shortStayDraft.airportTransferAvailable ? "white" : colors.dark[400] }}>
                {shortStayDraft.airportTransferAvailable ? "Yes" : "No"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <View className="flex-row items-center mb-2">
            <Image
              source={require("@/assets/icons/i-location-icon.webp")}
              style={{ width: 18, height: 18 }}
              resizeMode="contain"
            />
            <Text className="font-inter-semibold text-[13px] text-dark-400 ml-2">
              Nearest Matatu Stage
            </Text>
          </View>
          <TextInput
            className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
            placeholder="e.g., Westlands Stage"
            value={shortStayDraft.nearestMatatu}
            onChangeText={(text) => updateShortStayDraft({ nearestMatatu: text })}
          />
        </View>
      </View>

      <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <Image
            source={require("@/assets/icons/house-icon.webp")}
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
          value={shortStayDraft.googleMapsLink}
          onChangeText={(text) => updateShortStayDraft({ googleMapsLink: text })}
          keyboardType="url"
          autoCapitalize="none"
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-4">
          Share the Google Maps link to your property location
        </Text>
      </View>

      <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <Image
            source={require("@/assets/icons/house-icon.webp")}
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
          value={shortStayDraft.directionsFromStage}
          onChangeText={(text) => updateShortStayDraft({ directionsFromStage: text })}
          maxLength={300}
          multiline
          numberOfLines={4}
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-4">
          {shortStayDraft.directionsFromStage?.length || 0}/300 characters
        </Text>
      </View>
    </View>
  );
}

function Step3GuestCapacity() {
  const { shortStayDraft, updateShortStayDraft } = usePropertyStore();

  return (
    <View>
      <View className="flex-row items-center mb-4">
        <Image
          source={require("@/assets/icons/hotel-icon.webp")}
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
        <Text className="font-poppins-semibold text-[18px] text-dark-400 ml-3">
          Guest Capacity
        </Text>
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/i-user-icon.webp")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Max Adults <Text style={{ color: colors.danger }}>*</Text>
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
          placeholder="e.g., 4"
          keyboardType="numeric"
          value={shortStayDraft.maxAdults?.toString()}
          onChangeText={(text) => updateShortStayDraft({ maxAdults: parseInt(text) || 0 })}
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          Maximum number of adults (13+ years)
        </Text>
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/i-user-icon.webp")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Max Children (Optional)
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
          placeholder="e.g., 2"
          keyboardType="numeric"
          value={shortStayDraft.maxChildren?.toString()}
          onChangeText={(text) => updateShortStayDraft({ maxChildren: parseInt(text) || 0 })}
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          Maximum number of children (2-12 years)
        </Text>
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/i-user-icon.webp")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Max Infants
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
          placeholder="e.g., 1"
          keyboardType="numeric"
          value={shortStayDraft.maxInfants?.toString()}
          onChangeText={(text) => updateShortStayDraft({ maxInfants: parseInt(text) || 0 })}
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          Maximum number of infants (under 2 years)
        </Text>
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/apparment-icon.webp")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Total Beds
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
          placeholder="e.g., 3"
          keyboardType="numeric"
          value={shortStayDraft.totalBeds?.toString()}
          onChangeText={(text) => updateShortStayDraft({ totalBeds: parseInt(text) || 0 })}
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          Total number of beds available
        </Text>
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/info.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Bed Configuration (Optional)
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-3xl border-[0.5px] border-[#28B4F9] bg-white"
          style={{ minHeight: 80, textAlignVertical: "top" }}
          placeholder="e.g., 1 King bed, 2 Single beds, 1 Sofa bed"
          value={shortStayDraft.bedConfiguration?.join(", ")}
          onChangeText={(text) => updateShortStayDraft({ bedConfiguration: text.split(",").map(s => s.trim()) })}
          multiline
          numberOfLines={3}
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          Describe bed types and configuration
        </Text>
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/info.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Extra Sleeping Spaces (Optional)
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-3xl border-[0.5px] border-[#28B4F9] bg-white"
          style={{ minHeight: 80, textAlignVertical: "top" }}
          placeholder="e.g., Sofa bed in living room, Air mattress available"
          value={shortStayDraft.extraSleepingSpaces?.join(", ")}
          onChangeText={(text) => updateShortStayDraft({ extraSleepingSpaces: text.split(",").map(s => s.trim()) })}
          multiline
          numberOfLines={3}
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          Any additional sleeping arrangements available
        </Text>
      </View>
    </View>
  );
}

function Step4Amenities() {
  const { shortStayDraft, updateShortStayDraft } = usePropertyStore();

  const amenitiesData = {
    essentials: ["WiFi", "Air Conditioning", "Heating", "Hot Water", "Towels", "Bed Linens", "Soap", "Toilet Paper"],
    kitchen: ["Kitchen", "Refrigerator", "Microwave", "Stove", "Oven", "Dishwasher", "Coffee Maker", "Cooking Basics"],
    bathroom: ["Hair Dryer", "Shampoo", "Shower Gel", "Bathtub", "Bidet"],
    entertainment: ["TV", "Cable/Satellite", "Netflix", "Sound System", "Board Games", "Books"],
    outdoor: ["Balcony", "Patio", "Garden", "BBQ Grill", "Outdoor Furniture", "Pool", "Gym"],
    family: ["Crib", "High Chair", "Baby Monitor", "Children's Books", "Toys", "Playground"],
    safety: ["Smoke Detector", "Carbon Monoxide Detector", "Fire Extinguisher", "First Aid Kit", "Security Cameras", "Safe"],
  };

  const toggleAmenity = (category: string, amenity: string) => {
    const currentAmenities = shortStayDraft.amenities || {};
    const categoryAmenities = (currentAmenities as any)[category] || [];
    
    if (categoryAmenities.includes(amenity)) {
      updateShortStayDraft({
        amenities: {
          ...currentAmenities,
          [category]: categoryAmenities.filter((a: string) => a !== amenity),
        },
      });
    } else {
      updateShortStayDraft({
        amenities: {
          ...currentAmenities,
          [category]: [...categoryAmenities, amenity],
        },
      });
    }
  };

  const renderAmenityCategory = (category: string, title: string, icon: any) => {
    const currentAmenities = shortStayDraft.amenities || {};
    const categoryAmenities = (currentAmenities as any)[category] || [];

    return (
      <View key={category} className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={icon}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            {title}
          </Text>
        </View>
        <View className="flex-row flex-wrap gap-2">
          {amenitiesData[category as keyof typeof amenitiesData].map((amenity) => (
            <TouchableOpacity
              key={amenity}
              onPress={() => toggleAmenity(category, amenity)}
              className="px-4 py-2 rounded-full"
              style={{
                backgroundColor: categoryAmenities.includes(amenity) ? "#20A6FD" : "#E1E6E8",
                borderWidth: 1,
                borderColor: categoryAmenities.includes(amenity) ? "#20A6FD" : "#E1E6E8",
              }}
            >
              <Text
                className="font-inter-medium text-[13px]"
                style={{
                  color: categoryAmenities.includes(amenity) ? "#FFFFFF" : colors.dark[400],
                }}
              >
                {amenity}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View>
      <View className="flex-row items-center mb-4">
        <Image
          source={require("@/assets/icons/hotel-icon.webp")}
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
        <Text className="font-poppins-semibold text-[18px] text-dark-400 ml-3">
          Amenities
        </Text>
      </View>

      <View className="mb-4 p-4 rounded-2xl" style={{ backgroundColor: "#E6F4FE" }}>
        <Text className="font-inter text-[13px] text-dark-400">
          ✨ Select all amenities available at your property. Tap to toggle.
        </Text>
      </View>

      {renderAmenityCategory("essentials", "Essentials", require("@/assets/icons/stars-icon.webp"))}
      {renderAmenityCategory("kitchen", "Kitchen", require("@/assets/icons/home.png"))}
      {renderAmenityCategory("bathroom", "Bathroom", require("@/assets/icons/info.png"))}
      {renderAmenityCategory("entertainment", "Entertainment", require("@/assets/icons/gallery-icon.webp"))}
      {renderAmenityCategory("outdoor", "Outdoor", require("@/assets/icons/i-location-icon.webp"))}
      {renderAmenityCategory("family", "Family", require("@/assets/icons/i-user-icon.webp"))}
      {renderAmenityCategory("safety", "Safety", require("@/assets/icons/info.png"))}
    </View>
  );
}

function Step5Pricing() {
  const { shortStayDraft, updateShortStayDraft } = usePropertyStore();

  return (
    <View>
      <View className="flex-row items-center mb-4">
        <Image
          source={require("@/assets/icons/hotel-icon.webp")}
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
        <Text className="font-poppins-semibold text-[18px] text-dark-400 ml-3">
          Pricing
        </Text>
      </View>

      <View className="mb-4 p-4 rounded-2xl" style={{ backgroundColor: "#E6F4FE" }}>
        <Text className="font-inter-semibold text-[14px] text-primary-700 mb-2">
          🏖 NO SECURITY DEPOSIT COLLECTED
        </Text>
        <Text className="font-inter text-[12px] text-dark-400">
          Short-stay works on trust + reviews. No security deposits are collected from guests.
        </Text>
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/wallet.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Base Nightly Rate (KES) <Text style={{ color: colors.danger }}>*</Text>
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
          placeholder="e.g., 5000"
          keyboardType="numeric"
          value={shortStayDraft.baseNightlyRate?.toString()}
          onChangeText={(text) => updateShortStayDraft({ baseNightlyRate: parseFloat(text) || 0 })}
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          Your base rate per night in Kenyan Shillings
        </Text>
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/i-user-icon.webp")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Standard Occupancy
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
          placeholder="e.g., 2"
          keyboardType="numeric"
          value={shortStayDraft.standardOccupancy?.toString()}
          onChangeText={(text) => updateShortStayDraft({ standardOccupancy: parseInt(text) || 0 })}
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          Number of guests included in base rate
        </Text>
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/wallet.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Weekend Rate (KES) (Optional)
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
          placeholder="e.g., 6000"
          keyboardType="numeric"
          value={shortStayDraft.weekendRate?.toString()}
          onChangeText={(text) => updateShortStayDraft({ weekendRate: parseFloat(text) || 0 })}
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          Higher rate for Friday & Saturday nights (optional)
        </Text>
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/wallet.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Cleaning Fee (KES) (Optional)
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
          placeholder="e.g., 1500"
          keyboardType="numeric"
          value={shortStayDraft.cleaningFee?.toString()}
          onChangeText={(text) => updateShortStayDraft({ cleaningFee: parseFloat(text) || 0 })}
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          One-time cleaning fee charged per booking
        </Text>
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/wallet.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Weekly Discount % (Optional)
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
          placeholder="e.g., 10"
          keyboardType="numeric"
          value={shortStayDraft.weeklyDiscountPercent?.toString()}
          onChangeText={(text) => updateShortStayDraft({ weeklyDiscountPercent: parseFloat(text) || 0 })}
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          Discount for stays of 7+ nights
        </Text>
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/wallet.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Monthly Discount % (Optional)
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
          placeholder="e.g., 20"
          keyboardType="numeric"
          value={shortStayDraft.monthlyDiscountPercent?.toString()}
          onChangeText={(text) => updateShortStayDraft({ monthlyDiscountPercent: parseFloat(text) || 0 })}
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          Discount for stays of 28+ nights
        </Text>
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/wallet.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Extra Guest Fee (KES per guest) (Optional)
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
          placeholder="e.g., 500"
          keyboardType="numeric"
          value={shortStayDraft.extraGuestFee?.toString()}
          onChangeText={(text) => updateShortStayDraft({ extraGuestFee: parseFloat(text) || 0 })}
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          Additional fee per guest beyond standard occupancy
        </Text>
      </View>
    </View>
  );
}

function Step6AvailabilityBooking() {
  const { shortStayDraft, updateShortStayDraft } = usePropertyStore();
  const [showSelfCheckInPicker, setShowSelfCheckInPicker] = useState(false);
  const [showCheckInFromPicker, setShowCheckInFromPicker] = useState(false);
  const [showCheckInToPicker, setShowCheckInToPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);

  const timeOptions = [
    "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
  ];

  return (
    <View>
      <View className="flex-row items-center mb-4">
        <Image
          source={require("@/assets/icons/hotel-icon.webp")}
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
        <Text className="font-poppins-semibold text-[18px] text-dark-400 ml-3">
          Availability & Booking
        </Text>
      </View>
      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/i-date-icon.webp")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Min Nights Stay <Text style={{ color: colors.danger }}>*</Text>
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
          placeholder="e.g., 1"
          keyboardType="numeric"
          value={shortStayDraft.minNightsStay?.toString()}
          onChangeText={(text) => updateShortStayDraft({ minNightsStay: parseInt(text) || 0 })}
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          Minimum number of nights guests must book
        </Text>
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/i-date-icon.webp")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Max Nights Stay (Optional)
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
          placeholder="e.g., 30"
          keyboardType="numeric"
          value={shortStayDraft.maxNightsStay?.toString()}
          onChangeText={(text) => updateShortStayDraft({ maxNightsStay: parseInt(text) || 0 })}
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          Maximum number of nights guests can book
        </Text>
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/i-date-icon.webp")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Check-in Time From <Text style={{ color: colors.danger }}>*</Text>
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowCheckInFromPicker(!showCheckInFromPicker)}
          className="border-[0.5px] border-[#28B4F9] rounded-full px-4 py-3 bg-white flex-row items-center justify-between"
        >
          <Text className={`font-inter text-[15px] ${shortStayDraft.checkInTimeFrom ? "text-dark-400" : "text-[#545454]"}`}>
            {shortStayDraft.checkInTimeFrom || "Select check-in time"}
          </Text>
          <Image
            source={require("@/assets/icons/i-dropdown-icon.webp")}
            className="w-4 h-4"
            resizeMode="contain"
          />
        </TouchableOpacity>
        {showCheckInFromPicker && (
          <View className="mt-2 bg-white rounded-2xl border border-[#28B4F9] overflow-hidden" style={{ maxHeight: 200 }}>
            <ScrollView>
              {timeOptions.map((time, index) => (
                <TouchableOpacity
                  key={time}
                  onPress={() => {
                    updateShortStayDraft({ checkInTimeFrom: time });
                    setShowCheckInFromPicker(false);
                  }}
                  className={`px-4 py-3 ${index < timeOptions.length - 1 ? "border-b border-light-300" : ""}`}
                >
                  <Text className="font-inter text-[15px] text-dark-400">{time}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          Earliest check-in time (24-hour format)
        </Text>
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/i-date-icon.webp")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Check-in Time To (Optional)
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowCheckInToPicker(!showCheckInToPicker)}
          className="border-[0.5px] border-[#28B4F9] rounded-full px-4 py-3 bg-white flex-row items-center justify-between"
        >
          <Text className={`font-inter text-[15px] ${shortStayDraft.checkInTimeTo ? "text-dark-400" : "text-[#545454]"}`}>
            {shortStayDraft.checkInTimeTo || "Select latest check-in time"}
          </Text>
          <Image
            source={require("@/assets/icons/i-dropdown-icon.webp")}
            className="w-4 h-4"
            resizeMode="contain"
          />
        </TouchableOpacity>
        {showCheckInToPicker && (
          <View className="mt-2 bg-white rounded-2xl border border-[#28B4F9] overflow-hidden" style={{ maxHeight: 200 }}>
            <ScrollView>
              {timeOptions.map((time, index) => (
                <TouchableOpacity
                  key={time}
                  onPress={() => {
                    updateShortStayDraft({ checkInTimeTo: time });
                    setShowCheckInToPicker(false);
                  }}
                  className={`px-4 py-3 ${index < timeOptions.length - 1 ? "border-b border-light-300" : ""}`}
                >
                  <Text className="font-inter text-[15px] text-dark-400">{time}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          Latest check-in time (24-hour format)
        </Text>
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/i-date-icon.webp")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Check-out Time <Text style={{ color: colors.danger }}>*</Text>
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowCheckOutPicker(!showCheckOutPicker)}
          className="border-[0.5px] border-[#28B4F9] rounded-full px-4 py-3 bg-white flex-row items-center justify-between"
        >
          <Text className={`font-inter text-[15px] ${shortStayDraft.checkOutTime ? "text-dark-400" : "text-[#545454]"}`}>
            {shortStayDraft.checkOutTime || "Select check-out time"}
          </Text>
          <Image
            source={require("@/assets/icons/i-dropdown-icon.webp")}
            className="w-4 h-4"
            resizeMode="contain"
          />
        </TouchableOpacity>
        {showCheckOutPicker && (
          <View className="mt-2 bg-white rounded-2xl border border-[#28B4F9] overflow-hidden" style={{ maxHeight: 200 }}>
            <ScrollView>
              {timeOptions.map((time, index) => (
                <TouchableOpacity
                  key={time}
                  onPress={() => {
                    updateShortStayDraft({ checkOutTime: time });
                    setShowCheckOutPicker(false);
                  }}
                  className={`px-4 py-3 ${index < timeOptions.length - 1 ? "border-b border-light-300" : ""}`}
                >
                  <Text className="font-inter text-[15px] text-dark-400">{time}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          Check-out time (24-hour format)
        </Text>
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center flex-1">
            <Image
              source={require("@/assets/icons/hotel-icon.webp")}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
            <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
              Late Check-in Available?
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => updateShortStayDraft({ lateCheckInAvailable: !shortStayDraft.lateCheckInAvailable })}
            className="px-4 py-2 rounded-full"
            style={{ backgroundColor: shortStayDraft.lateCheckInAvailable ? colors.primary[700] : "#E1E6E8" }}
          >
            <Text className="font-inter-semibold text-[13px]" style={{ color: shortStayDraft.lateCheckInAvailable ? "white" : colors.dark[400] }}>
              {shortStayDraft.lateCheckInAvailable ? "Yes" : "No"}
            </Text>
          </TouchableOpacity>
        </View>
        {shortStayDraft.lateCheckInAvailable && (
          <View>
            <Text className="font-inter-semibold text-[13px] text-dark-400 mb-2">
              Late Check-in Fee (KES)
            </Text>
            <TextInput
              className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
              placeholder="e.g., 1000"
              keyboardType="numeric"
              value={shortStayDraft.lateCheckInFee?.toString()}
              onChangeText={(text) => updateShortStayDraft({ lateCheckInFee: parseFloat(text) || 0 })}
            />
          </View>
        )}
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/info.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Self Check-in Method
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowSelfCheckInPicker(!showSelfCheckInPicker)}
          className="border-[0.5px] border-[#28B4F9] rounded-full px-4 py-3 bg-white flex-row items-center justify-between"
        >
          <Text className={`font-inter text-[15px] ${shortStayDraft.selfCheckInMethod ? "text-dark-400" : "text-[#545454]"}`}>
            {shortStayDraft.selfCheckInMethod === "keybox" && "Keybox"}
            {shortStayDraft.selfCheckInMethod === "smart_lock" && "Smart Lock"}
            {shortStayDraft.selfCheckInMethod === "staff_meets_guest" && "Staff Meets Guest"}
            {shortStayDraft.selfCheckInMethod === "reception" && "Reception"}
            {!shortStayDraft.selfCheckInMethod && "Select check-in method"}
          </Text>
          <Image
            source={require("@/assets/icons/i-dropdown-icon.webp")}
            className="w-4 h-4"
            resizeMode="contain"
          />
        </TouchableOpacity>
        {showSelfCheckInPicker && (
          <View className="mt-2 bg-white rounded-2xl border border-[#28B4F9] overflow-hidden">
            {[
              { value: "keybox", label: "Keybox" },
              { value: "smart_lock", label: "Smart Lock" },
              { value: "staff_meets_guest", label: "Staff Meets Guest" },
              { value: "reception", label: "Reception" },
            ].map((method, index, array) => (
              <TouchableOpacity
                key={method.value}
                onPress={() => {
                  updateShortStayDraft({ selfCheckInMethod: method.value });
                  setShowSelfCheckInPicker(false);
                }}
                className={`px-4 py-3 ${index < array.length - 1 ? "border-b border-light-300" : ""}`}
              >
                <Text className="font-inter text-[15px] text-dark-400">{method.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <Image
              source={require("@/assets/icons/hotel-icon.webp")}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
            <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
              Instant Booking?
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => updateShortStayDraft({ instantBooking: !shortStayDraft.instantBooking })}
            className="px-4 py-2 rounded-full"
            style={{ backgroundColor: shortStayDraft.instantBooking ? colors.primary[700] : "#E1E6E8" }}
          >
            <Text className="font-inter-semibold text-[13px]" style={{ color: shortStayDraft.instantBooking ? "white" : colors.dark[400] }}>
              {shortStayDraft.instantBooking ? "Yes" : "No"}
            </Text>
          </TouchableOpacity>
        </View>
        <Text className="font-inter text-[11px] text-dark-100 mt-2">
          Allow guests to book instantly without your approval
        </Text>
      </View>
    </View>
  );
}

function Step7CancellationPolicy() {
  const { shortStayDraft, updateShortStayDraft } = usePropertyStore();
  const [showPolicyPicker, setShowPolicyPicker] = useState(false);

  const policies = {
    flexible: {
      title: "Flexible",
      desc: "Full refund 1 day before check-in. After that, 50% refund up to check-in time.",
    },
    moderate: {
      title: "Moderate",
      desc: "Full refund 5 days before check-in. After that, 50% refund up to 24 hours before check-in.",
    },
    firm: {
      title: "Firm",
      desc: "Full refund 7 days before check-in. After that, 50% refund up to 48 hours before check-in.",
    },
    strict: {
      title: "Strict",
      desc: "Full refund 14 days before check-in. After that, 50% refund up to 7 days before check-in.",
    },
    super_strict: {
      title: "Super Strict",
      desc: "Full refund 30 days before check-in. After that, 50% refund up to 14 days before check-in.",
    },
    custom: {
      title: "Custom",
      desc: "Define your own cancellation policy",
    },
  };

  return (
    <View>
      <View className="flex-row items-center mb-4">
        <Image
          source={require("@/assets/icons/hotel-icon.webp")}
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
        <Text className="font-poppins-semibold text-[18px] text-dark-400 ml-3">
          Cancellation Policy
        </Text>
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/info.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Cancellation Policy <Text style={{ color: colors.danger }}>*</Text>
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowPolicyPicker(!showPolicyPicker)}
          className="border-[0.5px] border-[#28B4F9] rounded-full px-4 py-3 bg-white flex-row items-center justify-between"
        >
          <Text className={`font-inter text-[15px] ${shortStayDraft.cancellationPolicy ? "text-dark-400" : "text-[#545454]"}`}>
            {shortStayDraft.cancellationPolicy ? policies[shortStayDraft.cancellationPolicy as keyof typeof policies]?.title : "Select cancellation policy"}
          </Text>
          <Image
            source={require("@/assets/icons/i-dropdown-icon.webp")}
            className="w-4 h-4"
            resizeMode="contain"
          />
        </TouchableOpacity>
        {showPolicyPicker && (
          <View className="mt-2 bg-white rounded-2xl border border-[#28B4F9] overflow-hidden">
            {Object.entries(policies).map(([key, policy], index, array) => (
              <TouchableOpacity
                key={key}
                onPress={() => {
                  updateShortStayDraft({ cancellationPolicy: key });
                  setShowPolicyPicker(false);
                }}
                className={`px-4 py-3 ${index < array.length - 1 ? "border-b border-light-300" : ""}`}
              >
                <Text className="font-inter-semibold text-[15px] text-dark-400">{policy.title}</Text>
                <Text className="font-inter text-[11px] text-dark-100 mt-1">{policy.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {shortStayDraft.cancellationPolicy && shortStayDraft.cancellationPolicy !== "custom" && (
          <View className="mt-3 p-3 rounded-2xl" style={{ backgroundColor: "#E6F4FE" }}>
            <Text className="font-inter text-[12px] text-dark-400">
              {policies[shortStayDraft.cancellationPolicy as keyof typeof policies]?.desc}
            </Text>
          </View>
        )}
      </View>

      {shortStayDraft.cancellationPolicy === "custom" && (
        <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
          <View className="flex-row items-center mb-3">
            <Image
              source={require("@/assets/icons/edit.png")}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
            <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
              Custom Cancellation Policy <Text style={{ color: colors.danger }}>*</Text>
            </Text>
          </View>
          <TextInput
            className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-3xl border-[0.5px] border-[#28B4F9] bg-white"
            style={{ minHeight: 120, textAlignVertical: "top" }}
            placeholder="Describe your custom cancellation policy in detail..."
            value={shortStayDraft.customCancellationPolicy}
            onChangeText={(text) => updateShortStayDraft({ customCancellationPolicy: text })}
            maxLength={300}
            multiline
            numberOfLines={5}
          />
          <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
            {shortStayDraft.customCancellationPolicy?.length || 0}/300 characters
          </Text>
        </View>
      )}

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/info.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Additional Cancellation Notes (Optional)
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-3xl border-[0.5px] border-[#28B4F9] bg-white"
          style={{ minHeight: 100, textAlignVertical: "top" }}
          placeholder="Any additional notes about cancellations..."
          value={shortStayDraft.cancellationNotes}
          onChangeText={(text) => updateShortStayDraft({ cancellationNotes: text })}
          maxLength={200}
          multiline
          numberOfLines={4}
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          {shortStayDraft.cancellationNotes?.length || 0}/200 characters
        </Text>
      </View>
    </View>
  );
}

function Step8HouseRules() {
  const { shortStayDraft, updateShortStayDraft } = usePropertyStore();
  const [showSmokingPicker, setShowSmokingPicker] = useState(false);
  const [showPartiesPicker, setShowPartiesPicker] = useState(false);

  return (
    <View>
      <View className="flex-row items-center mb-4">
        <Image
          source={require("@/assets/icons/hotel-icon.webp")}
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
        <Text className="font-poppins-semibold text-[18px] text-dark-400 ml-3">
          House Rules
        </Text>
      </View>

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
          placeholder="e.g., 6"
          keyboardType="numeric"
          value={shortStayDraft.maxPersons?.toString()}
          onChangeText={(text) => updateShortStayDraft({ maxPersons: parseInt(text) || 0 })}
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          Maximum number of people allowed in the property
        </Text>
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center flex-1">
            <Image
              source={require("@/assets/icons/hotel-icon.webp")}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
            <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
              Children Allowed?
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => updateShortStayDraft({ childrenAllowed: !shortStayDraft.childrenAllowed })}
            className="px-4 py-2 rounded-full"
            style={{ backgroundColor: shortStayDraft.childrenAllowed ? colors.primary[700] : "#E1E6E8" }}
          >
            <Text className="font-inter-semibold text-[13px]" style={{ color: shortStayDraft.childrenAllowed ? "white" : colors.dark[400] }}>
              {shortStayDraft.childrenAllowed ? "Yes" : "No"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center flex-1">
            <Image
              source={require("@/assets/icons/hotel-icon.webp")}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
            <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
              Pets Allowed?
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => updateShortStayDraft({ petsAllowed: !shortStayDraft.petsAllowed })}
            className="px-4 py-2 rounded-full"
            style={{ backgroundColor: shortStayDraft.petsAllowed ? colors.primary[700] : "#E1E6E8" }}
          >
            <Text className="font-inter-semibold text-[13px]" style={{ color: shortStayDraft.petsAllowed ? "white" : colors.dark[400] }}>
              {shortStayDraft.petsAllowed ? "Yes 🐾" : "No"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/info.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Smoking Policy
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowSmokingPicker(!showSmokingPicker)}
          className="border-[0.5px] border-[#28B4F9] rounded-full px-4 py-3 bg-white flex-row items-center justify-between"
        >
          <Text className={`font-inter text-[15px] ${shortStayDraft.smokingAllowed ? "text-dark-400" : "text-[#545454]"}`}>
            {shortStayDraft.smokingAllowed === "allowed" && "Smoking Allowed"}
            {shortStayDraft.smokingAllowed === "not_allowed" && "No Smoking 🚭"}
            {shortStayDraft.smokingAllowed === "outdoor_only" && "Outdoor Areas Only"}
            {!shortStayDraft.smokingAllowed && "Select smoking policy"}
          </Text>
          <Image
            source={require("@/assets/icons/i-dropdown-icon.webp")}
            className="w-4 h-4"
            resizeMode="contain"
          />
        </TouchableOpacity>
        {showSmokingPicker && (
          <View className="mt-2 bg-white rounded-2xl border border-[#28B4F9] overflow-hidden">
            {[
              { value: "allowed", label: "Smoking Allowed" },
              { value: "not_allowed", label: "No Smoking 🚭" },
              { value: "outdoor_only", label: "Outdoor Areas Only" },
            ].map((option, index, array) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => {
                  updateShortStayDraft({ smokingAllowed: option.value });
                  setShowSmokingPicker(false);
                }}
                className={`px-4 py-3 ${index < array.length - 1 ? "border-b border-light-300" : ""}`}
              >
                <Text className="font-inter text-[15px] text-dark-400">{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/info.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Parties/Events Policy
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowPartiesPicker(!showPartiesPicker)}
          className="border-[0.5px] border-[#28B4F9] rounded-full px-4 py-3 bg-white flex-row items-center justify-between"
        >
          <Text className={`font-inter text-[15px] ${shortStayDraft.partiesAllowed ? "text-dark-400" : "text-[#545454]"}`}>
            {shortStayDraft.partiesAllowed === "not_allowed" && "Not Allowed"}
            {shortStayDraft.partiesAllowed === "allowed_with_fee" && "Allowed with Fee"}
            {shortStayDraft.partiesAllowed === "small_gatherings_only" && "Small Gatherings Only"}
            {!shortStayDraft.partiesAllowed && "Select parties policy"}
          </Text>
          <Image
            source={require("@/assets/icons/i-dropdown-icon.webp")}
            className="w-4 h-4"
            resizeMode="contain"
          />
        </TouchableOpacity>
        {showPartiesPicker && (
          <View className="mt-2 bg-white rounded-2xl border border-[#28B4F9] overflow-hidden">
            {[
              { value: "not_allowed", label: "Not Allowed" },
              { value: "allowed_with_fee", label: "Allowed with Fee" },
              { value: "small_gatherings_only", label: "Small Gatherings Only" },
            ].map((option, index, array) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => {
                  updateShortStayDraft({ partiesAllowed: option.value });
                  setShowPartiesPicker(false);
                }}
                className={`px-4 py-3 ${index < array.length - 1 ? "border-b border-light-300" : ""}`}
              >
                <Text className="font-inter text-[15px] text-dark-400">{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/i-date-icon.webp")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Quiet Hours
          </Text>
        </View>
        <View className="flex-row gap-2">
          <View className="flex-1">
            <Text className="font-inter text-[12px] text-dark-100 mb-2">From</Text>
            <TextInput
              className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
              placeholder="22:00"
              value={shortStayDraft.quietHoursFrom}
              onChangeText={(text) => updateShortStayDraft({ quietHoursFrom: text })}
            />
          </View>
          <View className="flex-1">
            <Text className="font-inter text-[12px] text-dark-100 mb-2">To</Text>
            <TextInput
              className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
              placeholder="07:00"
              value={shortStayDraft.quietHoursTo}
              onChangeText={(text) => updateShortStayDraft({ quietHoursTo: text })}
            />
          </View>
        </View>
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/i-user-icon.webp")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Guest Minimum Age
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
          placeholder="e.g., 18 or 21"
          keyboardType="numeric"
          value={shortStayDraft.guestMinAge?.toString()}
          onChangeText={(text) => updateShortStayDraft({ guestMinAge: parseInt(text) || 0 })}
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          Minimum age for primary guest (typically 18 or 21)
        </Text>
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <Image
              source={require("@/assets/icons/info.png")}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
            <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
              Require ID at Check-in?
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => updateShortStayDraft({ requireIdAtCheckIn: !shortStayDraft.requireIdAtCheckIn })}
            className="px-4 py-2 rounded-full"
            style={{ backgroundColor: shortStayDraft.requireIdAtCheckIn ? colors.primary[700] : "#E1E6E8" }}
          >
            <Text className="font-inter-semibold text-[13px]" style={{ color: shortStayDraft.requireIdAtCheckIn ? "white" : colors.dark[400] }}>
              {shortStayDraft.requireIdAtCheckIn ? "Yes" : "No"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

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
          placeholder="Any other rules guests should know about..."
          value={shortStayDraft.additionalRules}
          onChangeText={(text) => updateShortStayDraft({ additionalRules: text })}
          maxLength={300}
          multiline
          numberOfLines={5}
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          {shortStayDraft.additionalRules?.length || 0}/300 characters
        </Text>
      </View>
    </View>
  );
}

function Step9MediaUploads() {
  const { shortStayDraft, updateShortStayDraft } = usePropertyStore();
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

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
      
      const currentPhotos = shortStayDraft.photos || [];
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
          updateShortStayDraft({ photos: updatedPhotos });
          
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
            const currentPhotos = shortStayDraft.photos || [];
            const updatedPhotos = currentPhotos.filter((_, i) => i !== index);
            updateShortStayDraft({ photos: updatedPhotos });
          },
        },
      ]
    );
  };

  const pickVideo = async () => {
    try {
      setIsUploadingVideo(true);

      if (shortStayDraft.videoUrl) {
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
        
        const sizeInMB = (asset.fileSize || 0) / (1024 * 1024);
        if (sizeInMB > 100) {
          Alert.alert("File Too Large", "Video must be smaller than 100MB. Please choose a smaller file.");
          setIsUploadingVideo(false);
          return;
        }

        updateShortStayDraft({ videoUrl: asset.uri });
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
            updateShortStayDraft({ videoUrl: undefined });
          },
        },
      ]
    );
  };

  const currentPhotos = shortStayDraft.photos || [];
  const hasMinimumPhotos = currentPhotos.length >= 3;

  return (
    <View>
      <View className="flex-row items-center mb-4">
        <Image
          source={require("@/assets/icons/hotel-icon.webp")}
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
        <Text className="font-poppins-semibold text-[18px] text-dark-400 ml-3">
          Media Uploads
        </Text>
      </View>

      <View className="mb-4 p-4 rounded-2xl" style={{ backgroundColor: "#E6F4FE" }}>
        <Text className="font-inter-semibold text-[14px] text-primary-700 mb-2">
          📸 High-quality photos improve search ranking by 60%!
        </Text>
        <Text className="font-inter text-[12px] text-dark-400">
          Upload at least 3 photos. Properties with 5+ photos get 40% more bookings.
        </Text>
      </View>

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
      </View>

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
            🎥 Upload a short video tour (max 100MB, flexible duration)
          </Text>

          {shortStayDraft.videoUrl && (
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
            disabled={isUploadingVideo || !!shortStayDraft.videoUrl}
            className="py-3 rounded-full items-center border-[0.5px] border-[#28B4F9]"
            style={{ 
              backgroundColor: shortStayDraft.videoUrl ? colors.light[300] : "white",
              opacity: isUploadingVideo ? 0.6 : 1,
            }}
          >
            <Text 
              className="font-inter-semibold text-[15px]" 
              style={{ color: shortStayDraft.videoUrl ? colors.dark[100] : colors.primary[700] }}
            >
              {isUploadingVideo ? "Uploading..." : shortStayDraft.videoUrl ? "Video Uploaded ✓" : "🎬 Upload Video"}
            </Text>
          </TouchableOpacity>

          {shortStayDraft.videoUrl && (
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
    </View>
  );
}

function Step10TermsConditions() {
  const { shortStayDraft, updateShortStayDraft } = usePropertyStore();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [hostAgreementAccepted, setHostAgreementAccepted] = useState(false);

  const allAccepted = termsAccepted && privacyAccepted && hostAgreementAccepted;

  return (
    <View>
      <View className="flex-row items-center mb-4">
        <Image
          source={require("@/assets/icons/hotel-icon.webp")}
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
        <Text className="font-poppins-semibold text-[18px] text-dark-400 ml-3">
          Terms & Conditions
        </Text>
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E6F4FE" }}>
        <Text className="font-inter-semibold text-[16px] text-primary-700 mb-2">
          🎉 Almost Done!
        </Text>
        <Text className="font-inter text-[13px] text-dark-400">
          You're one step away from listing your property on Masqany. Please review and accept the terms below.
        </Text>
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/icons/info.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
            Tourist Registration Number (Optional)
          </Text>
        </View>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
          placeholder="e.g., TRN-2024-12345"
          value={shortStayDraft.touristRegistrationNumber}
          onChangeText={(text) => updateShortStayDraft({ touristRegistrationNumber: text })}
        />
        <Text className="font-inter text-[11px] text-dark-100 mt-2 ml-1">
          If you have a tourist registration number from Kenya Tourism Board
        </Text>
      </View>

      <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: "#E1E6E8" }}>
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center flex-1">
            <Image
              source={require("@/assets/icons/wallet.png")}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
            <Text className="font-inter-semibold text-[14px] text-dark-400 ml-2">
              VAT Registered?
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => updateShortStayDraft({ vatRegistered: !shortStayDraft.vatRegistered })}
            className="px-4 py-2 rounded-full"
            style={{ backgroundColor: shortStayDraft.vatRegistered ? colors.primary[700] : "#E1E6E8" }}
          >
            <Text className="font-inter-semibold text-[13px]" style={{ color: shortStayDraft.vatRegistered ? "white" : colors.dark[400] }}>
              {shortStayDraft.vatRegistered ? "Yes" : "No"}
            </Text>
          </TouchableOpacity>
        </View>
        {shortStayDraft.vatRegistered && (
          <View>
            <Text className="font-inter-semibold text-[13px] text-dark-400 mb-2">
              VAT PIN
            </Text>
            <TextInput
              className="font-inter text-[15px] text-dark-400 px-4 py-3 rounded-full border-[0.5px] border-[#28B4F9] bg-white"
              placeholder="e.g., P051234567X"
              value={shortStayDraft.vatPin}
              onChangeText={(text) => updateShortStayDraft({ vatPin: text })}
            />
          </View>
        )}
      </View>

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
            • All information provided is accurate and truthful
          </Text>
          <Text className="font-inter text-[12px] text-dark-100 mb-2">
            • You are authorized to list this property
          </Text>
          <Text className="font-inter text-[12px] text-dark-100 mb-2">
            • You agree to Masqany's commission fees on bookings
          </Text>
          <Text className="font-inter text-[12px] text-dark-100 mb-2">
            • You will maintain the property as described
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
            • Your contact information will be shared with verified guests only
          </Text>
          <Text className="font-inter text-[12px] text-dark-100 mb-2">
            • Property photos and details will be publicly visible
          </Text>
          <Text className="font-inter text-[12px] text-dark-100 mb-2">
            • We use your data to improve our services and match you with guests
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
            • You will honor confirmed bookings
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
