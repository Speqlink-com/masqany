/**
 * Vehicle Registration Screen
 * 
 * Complete vehicle registration form for drivers
 * Layout: Fixed gradient header + scrollable white card overlay
 */

import { canRegisterVehicle, getPermissionErrorMessage } from "@/lib/permissions";
import { useCreateVehicle } from "@/modules/vehicle/hooks";
import type { VehicleRegistrationPayload } from "@/modules/vehicle/types";
import { useAuthStore } from "@/store/auth.store";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type VehicleType = "pickup" | "truck" | "mini_truck";
type Gender = "male" | "female" | "other";

export default function VehicleRegistrationScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const createVehicle = useCreateVehicle();

  // Check role-based access on mount
  useEffect(() => {
    if (user && !canRegisterVehicle(user.role)) {
      Alert.alert(
        "Access Denied",
        getPermissionErrorMessage("register vehicles") + ". Only drivers can register vehicles.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)/home" as any),
          },
        ]
      );
    }
  }, [user, router]);

  // Personal Information - Pre-fill from user profile
  const [fullName, setFullName] = useState(user?.name || "");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [nationalId, setNationalId] = useState("");

  // Vehicle Information
  const [vehicleType, setVehicleType] = useState<VehicleType | "">("");
  const [showVehicleTypePicker, setShowVehicleTypePicker] = useState(false);
  const [plateNumber, setPlateNumber] = useState("");
  const [capacity, setCapacity] = useState("");

  // Documents
  const [insuranceDoc, setInsuranceDoc] = useState<any>(null);
  const [licenseDoc, setLicenseDoc] = useState<any>(null);
  const [inspectionDoc, setInspectionDoc] = useState<any>(null);
  const [vehiclePhotos, setVehiclePhotos] = useState<any[]>([]);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "bank_transfer" | "cash">("mpesa");
  const [showPaymentPicker, setShowPaymentPicker] = useState(false);
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  
  // Service Zones
  const [serviceZones, setServiceZones] = useState<string[]>([]);
  const [showServiceZonesPicker, setShowServiceZonesPicker] = useState(false);
  const availableZones = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"];

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Format date as user types (DD/MM/YYYY)
  const formatDateInput = (text: string) => {
    // Remove all non-digits
    const digits = text.replace(/\D/g, "");
    
    // Format as DD/MM/YYYY
    let formatted = digits;
    if (digits.length >= 2) {
      formatted = digits.slice(0, 2) + "/" + digits.slice(2);
    }
    if (digits.length >= 4) {
      formatted = digits.slice(0, 2) + "/" + digits.slice(2, 4) + "/" + digits.slice(4, 8);
    }
    
    return formatted;
  };

  // Validate date format and age (must be 18+)
  const validateDateOfBirth = (dateStr: string): string | undefined => {
    if (!dateStr) return "Date of birth is required";
    
    // Check format DD/MM/YYYY
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateStr.match(dateRegex);
    
    if (!match) return "Use format DD/MM/YYYY";
    
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    
    // Validate ranges
    if (month < 1 || month > 12) return "Invalid month (1-12)";
    if (day < 1 || day > 31) return "Invalid day (1-31)";
    if (year < 1900 || year > new Date().getFullYear()) return "Invalid year";
    
    // Check if date is valid (e.g., not Feb 30)
    const date = new Date(year, month - 1, day);
    if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
      return "Invalid date";
    }
    
    // Check age (must be 18+)
    const today = new Date();
    const age = today.getFullYear() - year - (today.getMonth() < month - 1 || (today.getMonth() === month - 1 && today.getDate() < day) ? 1 : 0);
    
    if (age < 18) return "You must be at least 18 years old";
    if (age > 100) return "Please check the year";
    
    return undefined;
  };

  const handleDateChange = (text: string) => {
    const formatted = formatDateInput(text);
    setDateOfBirth(formatted);
    
    // Clear error when user starts typing
    if (errors.dateOfBirth) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.dateOfBirth;
        return newErrors;
      });
    }
  };

  // Document picker handlers
  const pickDocument = async (type: "insurance" | "license" | "inspection") => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const file = result.assets[0];
        
        // Check file size (10MB limit)
        if (file.size && file.size > 10 * 1024 * 1024) {
          Alert.alert("File Too Large", "Document must be less than 10MB");
          return;
        }

        if (type === "insurance") setInsuranceDoc(file);
        else if (type === "license") setLicenseDoc(file);
        else if (type === "inspection") setInspectionDoc(file);
      }
    } catch (error) {
      console.error("Document picker error:", error);
      Alert.alert("Error", "Failed to pick document");
    }
  };

  // Photo picker handler
  const pickPhotos = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 10 - vehiclePhotos.length,
      });

      if (!result.canceled && result.assets) {
        const newPhotos = result.assets.filter((asset: ImagePicker.ImagePickerAsset) => {
          if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
            Alert.alert("Photo Too Large", "Each photo must be less than 5MB");
            return false;
          }
          return true;
        });

        setVehiclePhotos([...vehiclePhotos, ...newPhotos].slice(0, 10));
      }
    } catch (error) {
      console.error("Photo picker error:", error);
      Alert.alert("Error", "Failed to pick photos");
    }
  };

  // Remove photo handler
  const removePhoto = (index: number) => {
    setVehiclePhotos(vehiclePhotos.filter((_, i) => i !== index));
  };

  // Toggle service zone
  const toggleServiceZone = (zone: string) => {
    if (serviceZones.includes(zone)) {
      setServiceZones(serviceZones.filter((z) => z !== zone));
    } else {
      setServiceZones([...serviceZones, zone]);
    }
  };

  const handleSubmit = async () => {
    // Clear previous errors
    setErrors({});

    // Basic validation
    const validationErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      validationErrors.fullName = "Full legal name is required";
    }

    if (!dateOfBirth) {
      validationErrors.dateOfBirth = "Date of birth is required";
    } else {
      const dobError = validateDateOfBirth(dateOfBirth);
      if (dobError) {
        validationErrors.dateOfBirth = dobError;
      }
    }

    if (!gender) {
      validationErrors.gender = "Gender is required";
    }

    if (!nationalId.trim()) {
      validationErrors.nationalId = "National ID is required";
    }

    if (!vehicleType) {
      validationErrors.vehicleType = "Vehicle type is required";
    }

    if (!plateNumber.trim()) {
      validationErrors.plateNumber = "Plate number is required";
    }

    if (!capacity.trim()) {
      validationErrors.capacity = "Capacity is required";
    }

    if (!insuranceDoc) {
      validationErrors.insurance = "Insurance document is required";
    }

    if (!licenseDoc) {
      validationErrors.license = "Driving license is required";
    }

    if (!inspectionDoc) {
      validationErrors.inspection = "Inspection certificate is required";
    }

    if (vehiclePhotos.length < 3) {
      validationErrors.photos = "Minimum 3 vehicle photos required";
    }

    if (serviceZones.length === 0) {
      validationErrors.serviceZones = "At least one service zone is required";
    }

    if (paymentMethod === "mpesa" && !mpesaNumber.trim()) {
      validationErrors.payment = "M-Pesa number is required";
    }

    if (paymentMethod === "bank_transfer" && (!bankName.trim() || !accountNumber.trim() || !accountName.trim())) {
      validationErrors.payment = "All bank details are required";
    }

    if (!termsAccepted) {
      validationErrors.terms = "You must accept the terms to continue";
    }

    // If there are validation errors, show them and return
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Alert.alert(
        "Incomplete Form",
        "Please fill in all required fields and upload all documents.",
        [{ text: "OK" }]
      );
      return;
    }

    // Show confirmation dialog
    Alert.alert(
      "Submit Registration",
      "Are you sure all information is correct? Your registration will be reviewed by our team.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Submit",
          onPress: async () => {
            try {
              // Convert DD/MM/YYYY to ISO format (YYYY-MM-DD)
              const [day, month, year] = dateOfBirth.split("/");
              const isoDate = `${year}-${month}-${day}`;
              
              const payload: VehicleRegistrationPayload = {
                driverName: fullName,
                dateOfBirth: isoDate,
                gender: gender as "male" | "female" | "other",
                vehicleType: vehicleType as "pickup" | "truck" | "mini_truck",
                plateNumber: plateNumber.toUpperCase(),
                capacity: parseFloat(capacity),
                capacityUnit: "kg",
                nationalId,
                paymentMethod,
                paymentDetails: {
                  mpesaNumber: paymentMethod === "mpesa" ? mpesaNumber : undefined,
                  bankName: paymentMethod === "bank_transfer" ? bankName : undefined,
                  accountNumber: paymentMethod === "bank_transfer" ? accountNumber : undefined,
                  accountName: paymentMethod === "bank_transfer" ? accountName : undefined,
                },
                serviceZones,
                insuranceDocument: insuranceDoc,
                drivingLicense: licenseDoc,
                inspectionCertificate: inspectionDoc,
                photos: vehiclePhotos,
              };

              await createVehicle.mutateAsync(payload);

              Alert.alert(
                "Registration Submitted!",
                "Your vehicle registration has been submitted for review. You'll be notified once it's approved.",
                [{ text: "OK" }]
              );
            } catch (error: any) {
              console.error("Registration error:", error);
              Alert.alert(
                "Registration Failed",
                error.message || "Failed to submit registration. Please try again.",
                [{ text: "OK" }]
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      
      {/* Fixed Gradient Header */}
      <LinearGradient
        colors={["#5DE0E6", "#004AAD"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute top-0 left-0 right-0"
        style={{ height: "50%" }}
      >
        <SafeAreaView edges={["top"]} className="flex-1">
          {/* Header Content */}
          <View className="px-5 pt-4">
            {/* Back Button and Pre-Verified Badge - Same Level */}
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
                  Pre-Verified
                </Text>
              </View>
            </View>

            {/* Title - Two Lines */}
            <View className="mb-3">
              <Text className="font-poppins-bold text-[24px] text-white leading-tight">
                Become a Verified
              </Text>
              <View className="flex-row items-center justify-between mt-1">
                <Text className="font-poppins-bold text-[24px] text-white">
                  Masqany Mover
                </Text>
                <Image
                  source={require("@/assets/icons/vehicle-icon.webp")}
                  style={{ width: 192, height: 192 }}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Subtitle with Driver Icon */}
            <View className="flex-row items-center">
              <Image
                source={require("@/assets/icons/driver-complete-profile-icon.webp")}
                className="w-4 h-4"
                resizeMode="contain"
              />
              <Text className="font-inter text-[14px] text-white ml-2">
                complete your profile to unlock trips
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Scrollable White Card - Overlays Gradient */}
      <View className="absolute top-0 left-0 right-0 bottom-0">
        <SafeAreaView edges={["top"]} className="flex-1">
          {/* Spacer to position card below gradient header */}
          <View style={{ height: 200 }} />
          
          {/* White Card Container */}
          <View className="flex-1">
            <ScrollView
              className="flex-1 bg-white rounded-t-[32px]"
              contentContainerStyle={{ paddingBottom: 32 }}
              showsVerticalScrollIndicator={false}
              bounces={true}
            >
              {/* Profile Image - Overlapping (Half Visible) */}
              <View className="items-center -mt-25 mb-4">
                <View 
                  className="w-24 h-24 rounded-full bg-white items-center justify-center"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <Image
                    source={require("@/assets/icons/i-user-icon.webp")}
                    className="w-20 h-20 rounded-full"
                    resizeMode="cover"
                  />
                </View>
              </View>

              <View className="px-5">
                {/* Professional Profile Section */}
                <View className="bg-[#E1E6E8] rounded-2xl p-4 mb-4">
                  <Text className="font-poppins-semibold text-[16px] text-dark-400 mb-1">
                    Professional Profile
                  </Text>
                  <Text className="font-inter text-[12px] text-dark-100 mb-4">
                    Provide your personal information for verification
                  </Text>

                  {/* Full Legal Name */}
                  <View className="mb-4">
                    <View className="flex-row items-center mb-2">
                      <Image
                        source={require("@/assets/icons/i-user-icon.webp")}
                        className="w-5 h-5"
                        resizeMode="contain"
                      />
                      <Text className="font-inter-medium text-[13px] text-dark-400 ml-2">
                        Full Legal Name <Text className="text-danger">*</Text>
                      </Text>
                    </View>
                    <TextInput
                      value={fullName}
                      onChangeText={(text) => {
                        setFullName(text);
                        if (errors.fullName) {
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.fullName;
                            return newErrors;
                          });
                        }
                      }}
                      placeholder="Enter your full name as per ID"
                      placeholderTextColor="#545454"
                      className={`border-[0.5px] ${
                        errors.fullName ? "border-danger" : "border-[#28B4F9]"
                      } rounded-full px-4 py-3 bg-white font-inter text-[15px] text-dark-400`}
                    />
                    {errors.fullName && (
                      <Text className="font-inter text-[12px] text-danger mt-1 ml-4">
                        {errors.fullName}
                      </Text>
                    )}
                  </View>

                  {/* Date of Birth */}
                  <View className="mb-4">
                    <View className="flex-row items-center mb-2">
                      <Image
                        source={require("@/assets/icons/i-date-icon.webp")}
                        className="w-5 h-5"
                        resizeMode="contain"
                      />
                      <Text className="font-inter-medium text-[13px] text-dark-400 ml-2">
                        Date of Birth <Text className="text-danger">*</Text>
                      </Text>
                    </View>
                    <TextInput
                      value={dateOfBirth}
                      onChangeText={handleDateChange}
                      placeholder="DD/MM/YYYY"
                      placeholderTextColor="#545454"
                      keyboardType="numeric"
                      maxLength={10}
                      className={`border-[0.5px] ${
                        errors.dateOfBirth ? "border-danger" : "border-[#28B4F9]"
                      } rounded-full px-4 py-3 bg-white font-inter text-[15px] text-dark-400`}
                    />
                    <Text className="font-inter text-[11px] text-dark-100 mt-1 ml-4">
                      You must be at least 18 years old to register
                    </Text>
                    {errors.dateOfBirth && (
                      <Text className="font-inter text-[12px] text-danger mt-1 ml-4">
                        {errors.dateOfBirth}
                      </Text>
                    )}
                  </View>

                  {/* Gender */}
                  <View className="mb-4">
                    <View className="flex-row items-center mb-2">
                      <Image
                        source={require("@/assets/icons/i-gender-icon.webp")}
                        className="w-5 h-5"
                        resizeMode="contain"
                      />
                      <Text className="font-inter-medium text-[13px] text-dark-400 ml-2">
                        Gender <Text className="text-danger">*</Text>
                      </Text>
                    </View>
                    <View className="flex-row gap-2">
                      {(["male", "female", "other"] as const).map((g) => (
                        <TouchableOpacity
                          key={g}
                          onPress={() => setGender(g)}
                          className={`
                            flex-1 py-3 rounded-full border-[0.5px] items-center
                            ${gender === g ? "border-[#28B4F9] bg-primary-50" : "border-[#28B4F9] bg-white"}
                          `}
                        >
                          <Text
                            className={`
                              font-inter-medium text-[13px] capitalize
                              ${gender === g ? "text-primary-700" : "text-[#545454]"}
                            `}
                          >
                            {g}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Phone Number (Read-only) */}
                  <View className="mb-4">
                    <View className="flex-row items-center mb-2">
                      <Image
                        source={require("@/assets/icons/i-phone-icon.webp")}
                        className="w-5 h-5"
                        resizeMode="contain"
                      />
                      <Text className="font-inter-medium text-[13px] text-dark-400 ml-2">
                        Phone Number
                      </Text>
                    </View>
                    <View className="border-[0.5px] border-[#28B4F9] rounded-full px-4 py-3 bg-white flex-row items-center justify-between">
                      <Text className="flex-1 font-inter text-[15px] text-dark-400">
                        {user?.phone || "+254 XXX XXX XXX"}
                      </Text>
                      <Image
                        source={require("@/assets/icons/success.png")}
                        className="w-5 h-5"
                        resizeMode="contain"
                      />
                    </View>
                    <Text className="font-inter text-[11px] text-success mt-1 ml-4">
                      ✓ Verified from your account
                    </Text>
                  </View>

                  {/* Email (Read-only) */}
                  <View className="mb-4">
                    <View className="flex-row items-center mb-2">
                      <Image
                        source={require("@/assets/icons/i-email-icon.webp")}
                        className="w-5 h-5"
                        resizeMode="contain"
                      />
                      <Text className="font-inter-medium text-[13px] text-dark-400 ml-2">
                        Email Address
                      </Text>
                    </View>
                    <View className="border-[0.5px] border-[#28B4F9] rounded-full px-4 py-3 bg-white flex-row items-center justify-between">
                      <Text className="flex-1 font-inter text-[15px] text-dark-400">
                        {user?.email || "driver@gmail.com"}
                      </Text>
                      <Image
                        source={require("@/assets/icons/success.png")}
                        className="w-5 h-5"
                        resizeMode="contain"
                      />
                    </View>
                    <Text className="font-inter text-[11px] text-success mt-1 ml-4">
                      ✓ Verified from your account
                    </Text>
                  </View>

                  {/* National ID */}
                  <View>
                    <View className="flex-row items-center mb-2">
                      <Image
                        source={require("@/assets/icons/i-user-icon.webp")}
                        className="w-5 h-5"
                        resizeMode="contain"
                      />
                      <Text className="font-inter-medium text-[13px] text-dark-400 ml-2">
                        National ID Number <Text className="text-danger">*</Text>
                      </Text>
                    </View>
                    <TextInput
                      value={nationalId}
                      onChangeText={setNationalId}
                      placeholder="Enter your national ID number"
                      placeholderTextColor="#545454"
                      keyboardType="numeric"
                      maxLength={8}
                      className="border-[0.5px] border-[#28B4F9] rounded-full px-4 py-3 bg-white font-inter text-[15px] text-dark-400"
                    />
                    <Text className="font-inter text-[11px] text-dark-100 mt-1 ml-4">
                      Required for background verification
                    </Text>
                  </View>
                </View>

                {/* Vehicle Information Section */}
                <View className="bg-[#E1E6E8] rounded-2xl p-4 mb-4">
                  <Text className="font-poppins-semibold text-[16px] text-dark-400 mb-1">
                    Vehicle Information
                  </Text>
                  <Text className="font-inter text-[12px] text-dark-100 mb-4">
                    Tell us about your vehicle for service matching
                  </Text>

                  {/* Vehicle Type */}
                  <View className="mb-4">
                    <View className="flex-row items-center mb-2">
                      <Image
                        source={require("@/assets/icons/i-truck-icon.webp")}
                        className="w-5 h-5"
                        resizeMode="contain"
                      />
                      <Text className="font-inter-medium text-[13px] text-dark-400 ml-2">
                        Vehicle Type <Text className="text-danger">*</Text>
                      </Text>
                    </View>
                    <TouchableOpacity 
                      onPress={() => setShowVehicleTypePicker(!showVehicleTypePicker)}
                      className={`border-[0.5px] ${
                        errors.vehicleType ? "border-danger" : "border-[#28B4F9]"
                      } rounded-full px-4 py-3 bg-white flex-row items-center justify-between`}
                    >
                      <Text className={`font-inter text-[15px] ${vehicleType ? "text-dark-400" : "text-[#545454]"}`}>
                        {vehicleType ? vehicleType.replace("_", " ").toUpperCase() : "Select your vehicle type"}
                      </Text>
                      <Image
                        source={require("@/assets/icons/i-dropdown-icon.webp")}
                        className="w-4 h-4"
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                    {showVehicleTypePicker && (
                      <View className="mt-2 bg-white rounded-2xl border border-[#28B4F9] overflow-hidden">
                        {(["pickup", "truck", "mini_truck"] as const).map((type) => (
                          <TouchableOpacity
                            key={type}
                            onPress={() => {
                              setVehicleType(type);
                              setShowVehicleTypePicker(false);
                            }}
                            className="px-4 py-3 border-b border-light-300"
                          >
                            <Text className="font-inter text-[15px] text-dark-400 capitalize">
                              {type.replace("_", " ")}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                    <Text className="font-inter text-[11px] text-dark-100 mt-1 ml-4">
                      Choose: Pickup, Truck, or Mini Truck
                    </Text>
                    {errors.vehicleType && (
                      <Text className="font-inter text-[12px] text-danger mt-1 ml-4">
                        {errors.vehicleType}
                      </Text>
                    )}
                  </View>

                  {/* Plate Number */}
                  <View className="mb-4">
                    <View className="flex-row items-center mb-2">
                      <Image
                        source={require("@/assets/icons/i-truck-icon.webp")}
                        className="w-5 h-5"
                        resizeMode="contain"
                      />
                      <Text className="font-inter-medium text-[13px] text-dark-400 ml-2">
                        License Plate Number <Text className="text-danger">*</Text>
                      </Text>
                    </View>
                    <TextInput
                      value={plateNumber}
                      onChangeText={(text) => setPlateNumber(text.toUpperCase())}
                      placeholder="e.g., KEA 100Q"
                      placeholderTextColor="#545454"
                      autoCapitalize="characters"
                      maxLength={9}
                      className="border-[0.5px] border-[#28B4F9] rounded-full px-4 py-3 bg-white font-inter text-[15px] text-dark-400"
                    />
                    <Text className="font-inter text-[11px] text-dark-100 mt-1 ml-4">
                      Kenyan format: 3 letters, space, 3 digits, 1 letter
                    </Text>
                  </View>

                  {/* Capacity */}
                  <View>
                    <View className="flex-row items-center mb-2">
                      <Image
                        source={require("@/assets/icons/i-truck-icon.webp")}
                        className="w-5 h-5"
                        resizeMode="contain"
                      />
                      <Text className="font-inter-medium text-[13px] text-dark-400 ml-2">
                        Load Capacity (kg) <Text className="text-danger">*</Text>
                      </Text>
                    </View>
                    <TextInput
                      value={capacity}
                      onChangeText={setCapacity}
                      placeholder="Enter capacity (50-10000 kg)"
                      placeholderTextColor="#545454"
                      keyboardType="numeric"
                      className="border-[0.5px] border-[#28B4F9] rounded-full px-4 py-3 bg-white font-inter text-[15px] text-dark-400"
                    />
                    <Text className="font-inter text-[11px] text-dark-100 mt-1 ml-4">
                      Minimum 50 kg, Maximum 10,000 kg
                    </Text>
                  </View>
                </View>

                {/* Documents Section */}
                <View className="bg-[#E1E6E8] rounded-2xl p-4 mb-4">
                  <Text className="font-poppins-semibold text-[16px] text-dark-400 mb-1">
                    Required Documents
                  </Text>
                  <Text className="font-inter text-[12px] text-dark-100 mb-4">
                    Upload clear photos or PDFs of your documents (max 10MB each)
                  </Text>

                  {/* Insurance Document */}
                  <View className="mb-4">
                    <View className="flex-row items-center mb-2">
                      <Image
                        source={require("@/assets/icons/i-user-icon.webp")}
                        className="w-5 h-5"
                        resizeMode="contain"
                      />
                      <Text className="font-inter-medium text-[13px] text-dark-400 ml-2">
                        Vehicle Insurance <Text className="text-danger">*</Text>
                      </Text>
                    </View>
                    <TouchableOpacity 
                      onPress={() => pickDocument("insurance")}
                      className={`border ${
                        errors.insurance ? "border-danger" : "border-[#A6A6A6]"
                      } rounded-2xl p-4 bg-white items-center`}
                    >
                      {insuranceDoc ? (
                        <>
                          <Image
                            source={require("@/assets/icons/success.png")}
                            className="w-10 h-10 mb-2"
                            resizeMode="contain"
                          />
                          <Text className="font-inter-medium text-[13px] text-success">
                            {insuranceDoc.name}
                          </Text>
                          <Text className="font-inter text-[11px] text-dark-100 mt-1">
                            Tap to change
                          </Text>
                        </>
                      ) : (
                        <>
                          <Image
                            source={require("@/assets/icons/upload.webp")}
                            className="w-10 h-10 mb-2"
                            resizeMode="contain"
                          />
                          <Text className="font-inter-medium text-[13px] text-[#545454]">
                            Upload Insurance Certificate
                          </Text>
                          <Text className="font-inter text-[11px] text-dark-100 mt-1">
                            JPEG, PNG, or PDF
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                    {errors.insurance && (
                      <Text className="font-inter text-[12px] text-danger mt-1 ml-4">
                        {errors.insurance}
                      </Text>
                    )}
                  </View>

                  {/* Driving License */}
                  <View className="mb-4">
                    <View className="flex-row items-center mb-2">
                      <Image
                        source={require("@/assets/icons/i-user-icon.webp")}
                        className="w-5 h-5"
                        resizeMode="contain"
                      />
                      <Text className="font-inter-medium text-[13px] text-dark-400 ml-2">
                        Driving License <Text className="text-danger">*</Text>
                      </Text>
                    </View>
                    <TouchableOpacity 
                      onPress={() => pickDocument("license")}
                      className={`border ${
                        errors.license ? "border-danger" : "border-[#A6A6A6]"
                      } rounded-2xl p-4 bg-white items-center`}
                    >
                      {licenseDoc ? (
                        <>
                          <Image
                            source={require("@/assets/icons/success.png")}
                            className="w-10 h-10 mb-2"
                            resizeMode="contain"
                          />
                          <Text className="font-inter-medium text-[13px] text-success">
                            {licenseDoc.name}
                          </Text>
                          <Text className="font-inter text-[11px] text-dark-100 mt-1">
                            Tap to change
                          </Text>
                        </>
                      ) : (
                        <>
                          <Image
                            source={require("@/assets/icons/upload.webp")}
                            className="w-10 h-10 mb-2"
                            resizeMode="contain"
                          />
                          <Text className="font-inter-medium text-[13px] text-[#545454]">
                            Upload Driving License
                          </Text>
                          <Text className="font-inter text-[11px] text-dark-100 mt-1">
                            Both sides if applicable
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                    {errors.license && (
                      <Text className="font-inter text-[12px] text-danger mt-1 ml-4">
                        {errors.license}
                      </Text>
                    )}
                  </View>

                  {/* Inspection Certificate */}
                  <View>
                    <View className="flex-row items-center mb-2">
                      <Image
                        source={require("@/assets/icons/i-user-icon.webp")}
                        className="w-5 h-5"
                        resizeMode="contain"
                      />
                      <Text className="font-inter-medium text-[13px] text-dark-400 ml-2">
                        Inspection Certificate <Text className="text-danger">*</Text>
                      </Text>
                    </View>
                    <TouchableOpacity 
                      onPress={() => pickDocument("inspection")}
                      className={`border ${
                        errors.inspection ? "border-danger" : "border-[#A6A6A6]"
                      } rounded-2xl p-4 bg-white items-center`}
                    >
                      {inspectionDoc ? (
                        <>
                          <Image
                            source={require("@/assets/icons/success.png")}
                            className="w-10 h-10 mb-2"
                            resizeMode="contain"
                          />
                          <Text className="font-inter-medium text-[13px] text-success">
                            {inspectionDoc.name}
                          </Text>
                          <Text className="font-inter text-[11px] text-dark-100 mt-1">
                            Tap to change
                          </Text>
                        </>
                      ) : (
                        <>
                          <Image
                            source={require("@/assets/icons/upload.webp")}
                            className="w-10 h-10 mb-2"
                            resizeMode="contain"
                          />
                          <Text className="font-inter-medium text-[13px] text-[#545454]">
                            Upload Inspection Certificate
                          </Text>
                          <Text className="font-inter text-[11px] text-dark-100 mt-1">
                            Valid NTSA inspection certificate
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                    {errors.inspection && (
                      <Text className="font-inter text-[12px] text-danger mt-1 ml-4">
                        {errors.inspection}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Vehicle Photos Section */}
                <View className="bg-[#E1E6E8] rounded-2xl p-4 mb-4">
                  <Text className="font-poppins-semibold text-[16px] text-dark-400 mb-1">
                    Vehicle Photos
                  </Text>
                  <Text className="font-inter text-[12px] text-dark-100 mb-4">
                    Upload 3-10 clear photos of your vehicle (max 5MB each)
                  </Text>
                  
                  {/* Photo Grid */}
                  {vehiclePhotos.length > 0 && (
                    <View className="flex-row flex-wrap gap-2 mb-4">
                      {vehiclePhotos.map((photo, index) => (
                        <View key={index} className="w-[30%] aspect-square relative">
                          <Image
                            source={{ uri: photo.uri }}
                            className="w-full h-full rounded-lg"
                            resizeMode="cover"
                          />
                          <TouchableOpacity
                            onPress={() => removePhoto(index)}
                            className="absolute top-1 right-1 w-6 h-6 bg-danger rounded-full items-center justify-center"
                          >
                            <Text className="text-white font-inter-bold text-xs">×</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}
                  
                  <TouchableOpacity 
                    onPress={pickPhotos}
                    disabled={vehiclePhotos.length >= 10}
                    className={`border ${
                      errors.photos ? "border-danger" : "border-[#A6A6A6]"
                    } rounded-2xl p-4 bg-white items-center ${
                      vehiclePhotos.length >= 10 ? "opacity-50" : ""
                    }`}
                  >
                    <Image
                      source={require("@/assets/icons/upload.webp")}
                      className="w-10 h-10 mb-2"
                      resizeMode="contain"
                    />
                    <Text className="font-inter-medium text-[13px] text-[#545454]">
                      {vehiclePhotos.length > 0 
                        ? `${vehiclePhotos.length}/10 photos uploaded - Add more` 
                        : "Upload Vehicle Photos"}
                    </Text>
                    <Text className="font-inter text-[11px] text-dark-100 mt-1">
                      Front, back, sides, interior, and cargo area
                    </Text>
                  </TouchableOpacity>
                  {errors.photos && (
                    <Text className="font-inter text-[12px] text-danger mt-2 ml-4">
                      {errors.photos}
                    </Text>
                  )}
                </View>

                {/* Payment Information Section */}
                <View className="bg-[#E1E6E8] rounded-2xl p-4 mb-4">
                  <Text className="font-poppins-semibold text-[16px] text-dark-400 mb-1">
                    Payment Information
                  </Text>
                  <Text className="font-inter text-[12px] text-dark-100 mb-4">
                    How would you like to receive your earnings?
                  </Text>

                  <View className="mb-4">
                    <View className="flex-row items-center mb-2">
                      <Image
                        source={require("@/assets/icons/i-payment-icon.webp")}
                        className="w-5 h-5"
                        resizeMode="contain"
                      />
                      <Text className="font-inter-medium text-[13px] text-dark-400 ml-2">
                        Payment Method <Text className="text-danger">*</Text>
                      </Text>
                    </View>
                    <TouchableOpacity 
                      onPress={() => setShowPaymentPicker(!showPaymentPicker)}
                      className={`border-[0.5px] ${
                        errors.payment ? "border-danger" : "border-[#28B4F9]"
                      } rounded-full px-4 py-3 bg-white flex-row items-center justify-between`}
                    >
                      <Text className="font-inter text-[15px] text-dark-400 capitalize">
                        {paymentMethod.replace("_", " ")}
                      </Text>
                      <Image
                        source={require("@/assets/icons/i-dropdown-icon.webp")}
                        className="w-4 h-4"
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                    {showPaymentPicker && (
                      <View className="mt-2 bg-white rounded-2xl border border-[#28B4F9] overflow-hidden">
                        {(["mpesa", "bank_transfer", "cash"] as const).map((method) => (
                          <TouchableOpacity
                            key={method}
                            onPress={() => {
                              setPaymentMethod(method);
                              setShowPaymentPicker(false);
                            }}
                            className="px-4 py-3 border-b border-light-300"
                          >
                            <Text className="font-inter text-[15px] text-dark-400 capitalize">
                              {method.replace("_", " ")}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                    <Text className="font-inter text-[11px] text-dark-100 mt-1 ml-4">
                      M-Pesa, Bank Transfer, or Cash
                    </Text>
                  </View>

                  {/* M-Pesa Number */}
                  {paymentMethod === "mpesa" && (
                    <View>
                      <Text className="font-inter-medium text-[13px] text-dark-400 mb-2">
                        M-Pesa Number <Text className="text-danger">*</Text>
                      </Text>
                      <TextInput
                        value={mpesaNumber}
                        onChangeText={setMpesaNumber}
                        placeholder="+254XXXXXXXXX"
                        placeholderTextColor="#545454"
                        keyboardType="phone-pad"
                        className="border-[0.5px] border-[#28B4F9] rounded-full px-4 py-3 bg-white font-inter text-[15px] text-dark-400"
                      />
                      <Text className="font-inter text-[11px] text-dark-100 mt-1 ml-4">
                        Enter your M-Pesa registered number
                      </Text>
                    </View>
                  )}

                  {/* Bank Details */}
                  {paymentMethod === "bank_transfer" && (
                    <View className="gap-4">
                      <View>
                        <Text className="font-inter-medium text-[13px] text-dark-400 mb-2">
                          Bank Name <Text className="text-danger">*</Text>
                        </Text>
                        <TextInput
                          value={bankName}
                          onChangeText={setBankName}
                          placeholder="Enter bank name"
                          placeholderTextColor="#545454"
                          className="border-[0.5px] border-[#28B4F9] rounded-full px-4 py-3 bg-white font-inter text-[15px] text-dark-400"
                        />
                      </View>
                      <View>
                        <Text className="font-inter-medium text-[13px] text-dark-400 mb-2">
                          Account Number <Text className="text-danger">*</Text>
                        </Text>
                        <TextInput
                          value={accountNumber}
                          onChangeText={setAccountNumber}
                          placeholder="Enter account number"
                          placeholderTextColor="#545454"
                          keyboardType="numeric"
                          className="border-[0.5px] border-[#28B4F9] rounded-full px-4 py-3 bg-white font-inter text-[15px] text-dark-400"
                        />
                      </View>
                      <View>
                        <Text className="font-inter-medium text-[13px] text-dark-400 mb-2">
                          Account Name <Text className="text-danger">*</Text>
                        </Text>
                        <TextInput
                          value={accountName}
                          onChangeText={setAccountName}
                          placeholder="Enter account name"
                          placeholderTextColor="#545454"
                          className="border-[0.5px] border-[#28B4F9] rounded-full px-4 py-3 bg-white font-inter text-[15px] text-dark-400"
                        />
                      </View>
                    </View>
                  )}

                  {errors.payment && (
                    <Text className="font-inter text-[12px] text-danger mt-2 ml-4">
                      {errors.payment}
                    </Text>
                  )}
                </View>

                {/* Service Areas Section */}
                <View className="bg-[#E1E6E8] rounded-2xl p-4 mb-4">
                  <Text className="font-poppins-semibold text-[16px] text-dark-400 mb-1">
                    Service Areas
                  </Text>
                  <Text className="font-inter text-[12px] text-dark-100 mb-4">
                    Select the cities where you can provide relocation services
                  </Text>

                  <View>
                    <View className="flex-row items-center mb-2">
                      <Image
                        source={require("@/assets/icons/i-location-icon.webp")}
                        className="w-5 h-5"
                        resizeMode="contain"
                      />
                      <Text className="font-inter-medium text-[13px] text-dark-400 ml-2">
                        Service Zones <Text className="text-danger">*</Text>
                      </Text>
                    </View>
                    
                    {/* Selected Zones */}
                    {serviceZones.length > 0 && (
                      <View className="flex-row flex-wrap gap-2 mb-3">
                        {serviceZones.map((zone) => (
                          <TouchableOpacity
                            key={zone}
                            onPress={() => toggleServiceZone(zone)}
                            className="bg-primary-700 rounded-full px-3 py-2 flex-row items-center"
                          >
                            <Text className="font-inter-medium text-[13px] text-white mr-2">
                              {zone}
                            </Text>
                            <Text className="text-white font-inter-bold">×</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                    
                    <TouchableOpacity 
                      onPress={() => setShowServiceZonesPicker(!showServiceZonesPicker)}
                      className={`border-[0.5px] ${
                        errors.serviceZones ? "border-danger" : "border-[#28B4F9]"
                      } rounded-full px-4 py-3 bg-white flex-row items-center justify-between`}
                    >
                      <Text className={`font-inter text-[15px] ${
                        serviceZones.length > 0 ? "text-dark-400" : "text-[#545454]"
                      }`}>
                        {serviceZones.length > 0 
                          ? `${serviceZones.length} zone${serviceZones.length > 1 ? "s" : ""} selected` 
                          : "Select service zones"}
                      </Text>
                      <Image
                        source={require("@/assets/icons/i-dropdown-icon.webp")}
                        className="w-4 h-4"
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                    
                    {showServiceZonesPicker && (
                      <View className="mt-2 bg-white rounded-2xl border border-[#28B4F9] overflow-hidden">
                        {availableZones.map((zone) => (
                          <TouchableOpacity
                            key={zone}
                            onPress={() => toggleServiceZone(zone)}
                            className="px-4 py-3 border-b border-light-300 flex-row items-center justify-between"
                          >
                            <Text className="font-inter text-[15px] text-dark-400">
                              {zone}
                            </Text>
                            {serviceZones.includes(zone) && (
                              <Image
                                source={require("@/assets/icons/success.png")}
                                className="w-5 h-5"
                                resizeMode="contain"
                              />
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                    
                    <Text className="font-inter text-[11px] text-dark-100 mt-1 ml-4">
                      Nairobi, Mombasa, Kisumu, Nakuru, Eldoret
                    </Text>
                    {errors.serviceZones && (
                      <Text className="font-inter text-[12px] text-danger mt-1 ml-4">
                        {errors.serviceZones}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Terms and Submit */}
                <View className="mb-8">
                  {/* Terms Checkbox */}
                  <TouchableOpacity
                    onPress={() => setTermsAccepted(!termsAccepted)}
                    activeOpacity={0.8}
                    className="flex-row items-start mb-4"
                  >
                    <View
                      className="w-6 h-6 rounded-md items-center justify-center mr-3 mt-0.5"
                      style={{
                        borderWidth: 2,
                        borderColor: termsAccepted ? "#28B4FA" : errors.terms ? "#F75555" : "#BDBDC0",
                        backgroundColor: termsAccepted ? "#28B4FA" : "transparent",
                      }}
                    >
                      {termsAccepted && (
                        <Text className="font-inter-bold text-white text-xs">✓</Text>
                      )}
                    </View>
                    <Text className="flex-1 font-inter text-[13px] text-dark-400 leading-5">
                      I confirm that all information provided is accurate and complete. I agree to Masqany's Driver Terms of Service and consent to background verification checks.
                    </Text>
                  </TouchableOpacity>

                  {errors.terms && (
                    <Text className="font-inter text-[13px] text-danger mb-4 ml-9">
                      {errors.terms}
                    </Text>
                  )}

                  {/* Error Summary */}
                  {Object.keys(errors).length > 0 && (
                    <View className="bg-danger/10 border border-danger rounded-2xl p-4 mb-4">
                      <Text className="font-inter-semibold text-[14px] text-danger mb-2">
                        Please fix the following errors:
                      </Text>
                      {Object.entries(errors).map(([key, error]) => (
                        <Text key={key} className="font-inter text-[13px] text-danger leading-5">
                          • {error}
                        </Text>
                      ))}
                    </View>
                  )}

                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={createVehicle.isPending}
                    className={`rounded-full py-4 items-center mb-8 ${
                      createVehicle.isPending ? "bg-primary-700/50" : "bg-primary-700"
                    }`}
                    style={{
                      shadowColor: "#20A6FD",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 5,
                    }}
                  >
                    <Text className="font-inter-semibold text-[16px] text-white">
                      {createVehicle.isPending ? "Submitting..." : "Complete Registration and Start"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}
