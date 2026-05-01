/**
 * Add Account Screen
 * Allows users to add another account (up to 5 accounts per device).
 */
import { colors, spacing } from "@/constants/tokens";
import { useAddAccount } from "@/modules/profile";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddAccountScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const addAccount = useAddAccount();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAccount = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await addAccount.mutateAsync({ email, password });

      Alert.alert(
        "Account Added",
        "The account has been added successfully.",
        [
          {
            text: "OK",
            onPress: () => {
              router.back();
            },
          },
        ]
      );
    } catch (err: any) {
      Alert.alert(
        "Add Account Failed",
        err?.message || "Failed to add account. Please check your credentials."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="px-6 py-4">
          <Text className="text-lg font-poppins-semibold text-dark-400">
            Add Another Account
          </Text>
          <Text className="text-sm font-inter-regular text-dark-200 mt-1">
            Sign in with your account credentials
          </Text>
        </View>

        {/* Form */}
        <View className="px-6 mt-4">
          {/* Email Input */}
          <View className="mb-4">
            <Text className="text-sm font-inter-medium text-dark-300 mb-2">
              Email Address
            </Text>
            <View
              className={`flex-row items-center px-4 py-3 rounded-xl bg-light-100 ${
                errors.email ? "border-2 border-danger" : ""
              }`}
            >
              <Image
                source={require("@/assets/icons/email.webp")}
                className="w-5 h-5 mr-3"
                style={{ tintColor: colors.dark[200] }}
              />
              <TextInput
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) {
                    setErrors({ ...errors, email: undefined });
                  }
                }}
                placeholder="Enter your email"
                placeholderTextColor={colors.dark[100]}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                className="flex-1 text-base font-inter-regular text-dark-400"
              />
            </View>
            {errors.email && (
              <Text className="text-xs font-inter-regular text-danger mt-1">
                {errors.email}
              </Text>
            )}
          </View>

          {/* Password Input */}
          <View className="mb-6">
            <Text className="text-sm font-inter-medium text-dark-300 mb-2">
              Password
            </Text>
            <View
              className={`flex-row items-center px-4 py-3 rounded-xl bg-light-100 ${
                errors.password ? "border-2 border-danger" : ""
              }`}
            >
              <Image
                source={require("@/assets/icons/password.webp")}
                className="w-5 h-5 mr-3"
                style={{ tintColor: colors.dark[200] }}
              />
              <TextInput
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors({ ...errors, password: undefined });
                  }
                }}
                placeholder="Enter your password"
                placeholderTextColor={colors.dark[100]}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                className="flex-1 text-base font-inter-regular text-dark-400"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                <Image
                  source={
                    showPassword
                      ? require("@/assets/icons/eye-open.webp")
                      : require("@/assets/icons/eye-icon.webp")
                  }
                  className="w-5 h-5"
                  style={{ tintColor: colors.dark[200] }}
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text className="text-xs font-inter-regular text-danger mt-1">
                {errors.password}
              </Text>
            )}
          </View>

          {/* Info Notice */}
          <View className="p-4 rounded-xl bg-primary-50 mb-6">
            <Text className="text-sm font-inter-regular text-dark-300">
              You can add up to 5 accounts on this device. Switching between accounts is quick and easy.
            </Text>
          </View>

          {/* Add Account Button */}
          <TouchableOpacity
            onPress={handleAddAccount}
            disabled={addAccount.isPending}
            className="py-4 rounded-xl items-center justify-center"
            style={{ backgroundColor: colors.primary[700] }}
            activeOpacity={0.8}
          >
            {addAccount.isPending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text className="text-base font-poppins-semibold text-white">
                Add Account
              </Text>
            )}
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            disabled={addAccount.isPending}
            className="py-4 rounded-xl items-center justify-center mt-3"
            style={{ backgroundColor: colors.light[200] }}
            activeOpacity={0.8}
          >
            <Text className="text-base font-poppins-semibold text-dark-400">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
