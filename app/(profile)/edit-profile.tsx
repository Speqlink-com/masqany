/**
 * Edit Profile Screen
 * Allows users to update their name, email, phone, and avatar
 * Uses NativeWind (Tailwind CSS) for styling
 */
import { ScreenHeader } from "@/components/profile";
import { colors, radius, spacing, typography } from "@/constants/tokens";
import { useProfile, useUpdateProfile, useUploadAvatar } from "@/modules/profile";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfileScreen() {
  const router = useRouter();
  
  // Fetch current profile data
  const { data: profile, isLoading } = useProfile();

  // Mutations
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();

  // Form state
  const [name, setName] = useState(profile?.name || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [avatarUri, setAvatarUri] = useState<string | undefined>(profile?.avatar);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Validation errors
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});

  // Update form when profile loads
  React.useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setPhone(profile.phone || "");
      setAvatarUri(profile.avatar);
    }
  }, [profile]);

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // Phone is optional
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  };

  const validateName = (name: string): boolean => {
    return name.trim().length >= 2;
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!validateName(name)) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (phone && !validatePhone(phone)) {
      newErrors.phone = "Please enter a valid phone number (e.g., +1234567890)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle avatar selection
  const handleSelectAvatar = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant photo library access to change your avatar."
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setAvatarUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error selecting image:", error);
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  };

  // Handle form submission
  const handleSave = async () => {
    // Validate form
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fix the errors before saving.");
      return;
    }

    try {
      let avatarUrl = profile?.avatar;

      // Upload avatar first if a new image was selected
      if (selectedImage) {
        try {
          const formData = new FormData();
          formData.append("avatar", {
            uri: selectedImage,
            type: "image/jpeg",
            name: "avatar.jpg",
          } as any);

          const uploadResult = await uploadAvatar.mutateAsync(formData);
          avatarUrl = uploadResult.avatarUrl;
        } catch (avatarError: any) {
          console.error("[EDIT PROFILE] Avatar upload failed:", avatarError);
          
          // Check if it's a Cloudinary configuration error
          if (avatarError.message?.includes("Cloudinary is not configured")) {
            Alert.alert(
              "Avatar Upload Unavailable",
              "Avatar upload is not configured on the server yet. Your other profile changes will be saved.",
              [
                {
                  text: "Continue Without Avatar",
                  onPress: async () => {
                    // Continue saving without avatar
                    await saveProfileData(profile?.avatar);
                  },
                },
                {
                  text: "Cancel",
                  style: "cancel",
                },
              ]
            );
            return;
          } else {
            // Other avatar upload errors
            throw avatarError;
          }
        }
      }

      // Save profile data with avatar URL
      await saveProfileData(avatarUrl);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      Alert.alert(
        "Error",
        error?.message || "Failed to update profile. Please try again."
      );
    }
  };

  // Helper function to save profile data
  const saveProfileData = async (avatarUrl?: string) => {
    try {
      await updateProfile.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        avatar: avatarUrl,
      });

      Alert.alert("Success", "Profile updated successfully", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error("Error saving profile data:", error);
      Alert.alert(
        "Error",
        error?.message || "Failed to update profile. Please try again."
      );
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary[700]} />
      </View>
    );
  }

  const isSubmitting = updateProfile.isPending || uploadAvatar.isPending;
  const displayAvatar = avatarUri || selectedImage;

  return (
    <View className="flex-1">
      <StatusBar style="dark" />
      <ImageBackground
        source={require("@/assets/images/app-full-screen.webp")}
        className="flex-1"
        resizeMode="cover"
      >
        <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
          {/* Header */}
          <ScreenHeader title="Edit Profile" />

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
          >

            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingBottom: spacing.xl }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View className="px-5 py-6">
                {/* Avatar Section */}
                <View className="items-center mb-6">
                  <TouchableOpacity
                    onPress={handleSelectAvatar}
                    activeOpacity={0.8}
                    disabled={isSubmitting}
                  >
                    <View className="relative">
                      {displayAvatar ? (
                        <Image
                          source={{ uri: displayAvatar }}
                          className="w-24 h-24 rounded-full"
                          style={{
                            borderWidth: 3,
                            borderColor: colors.primary[700],
                          }}
                        />
                      ) : (
                        <Image
                          source={require("@/assets/icons/user-profile-icon.webp")}
                          className="w-24 h-24 rounded-full"
                          style={{
                            borderWidth: 3,
                            borderColor: colors.primary[700],
                          }}
                        />
                      )}
                      <View
                        className="absolute bottom-0 right-0 w-8 h-8 rounded-full items-center justify-center"
                        style={{ backgroundColor: colors.primary[700] }}
                      >
                        <Image
                          source={require("@/assets/icons/edit.png")}
                          className="w-4 h-4"
                          style={{ tintColor: colors.light[400] }}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                  <Text
                    className="mt-3 font-inter-regular text-center"
                    style={{ fontSize: typography.size.sm, color: colors.dark[100] }}
                  >
                    Tap to change avatar
                  </Text>
                </View>

                {/* Name Input */}
                <View className="mb-4">
                  <Text
                    className="mb-2 font-inter-semibold"
                    style={{ fontSize: typography.size.base, color: colors.dark[400] }}
                  >
                    Name *
                  </Text>
                  <TextInput
                    value={name}
                    onChangeText={(text) => {
                      setName(text);
                      if (errors.name) {
                        setErrors({ ...errors, name: undefined });
                      }
                    }}
                    placeholder="Enter your name"
                    className="px-4 py-3 rounded-lg font-inter-regular"
                    style={[
                      styles.input,
                      errors.name && styles.inputError,
                    ]}
                    editable={!isSubmitting}
                  />
                  {errors.name && (
                    <Text
                      className="mt-1 font-inter-regular"
                      style={{ fontSize: typography.size.sm, color: colors.danger }}
                    >
                      {errors.name}
                    </Text>
                  )}
                </View>

                {/* Email Input */}
                <View className="mb-4">
                  <Text
                    className="mb-2 font-inter-semibold"
                    style={{ fontSize: typography.size.base, color: colors.dark[400] }}
                  >
                    Email *
                  </Text>
                  <TextInput
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (errors.email) {
                        setErrors({ ...errors, email: undefined });
                      }
                    }}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="px-4 py-3 rounded-lg font-inter-regular"
                    style={[
                      styles.input,
                      errors.email && styles.inputError,
                    ]}
                    editable={!isSubmitting}
                  />
                  {errors.email && (
                    <Text
                      className="mt-1 font-inter-regular"
                      style={{ fontSize: typography.size.sm, color: colors.danger }}
                    >
                      {errors.email}
                    </Text>
                  )}
                </View>

                {/* Phone Input */}
                <View className="mb-6">
                  <Text
                    className="mb-2 font-inter-semibold"
                    style={{ fontSize: typography.size.base, color: colors.dark[400] }}
                  >
                    Phone (Optional)
                  </Text>
                  <TextInput
                    value={phone}
                    onChangeText={(text) => {
                      setPhone(text);
                      if (errors.phone) {
                        setErrors({ ...errors, phone: undefined });
                      }
                    }}
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                    className="px-4 py-3 rounded-lg font-inter-regular"
                    style={[
                      styles.input,
                      errors.phone && styles.inputError,
                    ]}
                    editable={!isSubmitting}
                  />
                  {errors.phone && (
                    <Text
                      className="mt-1 font-inter-regular"
                      style={{ fontSize: typography.size.sm, color: colors.danger }}
                    >
                      {errors.phone}
                    </Text>
                  )}
                </View>

                {/* Save Button */}
                <TouchableOpacity
                  onPress={handleSave}
                  disabled={isSubmitting}
                  activeOpacity={0.85}
                  className="rounded-lg py-4 items-center"
                  style={{
                    backgroundColor: isSubmitting
                      ? colors.primary[200]
                      : colors.primary[700],
                  }}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color={colors.light[400]} />
                  ) : (
                    <Text
                      className="font-inter-bold"
                      style={{ fontSize: typography.size.base, color: colors.light[400] }}
                    >
                      Save Changes
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>

          {/* Bottom Blue Bar */}
          <View className="absolute bottom-0 left-0 right-0 h-[100px] bg-[#3fbdfd] z-50">
            <View className="h-[2px] bg-white" />
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.light[200],
    backgroundColor: colors.light[400],
    fontSize: typography.size.base,
    color: colors.dark[400],
    borderRadius: radius.lg,
  },
  inputError: {
    borderColor: colors.danger,
  },
});
