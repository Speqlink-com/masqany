/**
 * Security Settings Screen
 * Allows users to change password and toggle two-factor authentication
 * Uses NativeWind (Tailwind CSS) for styling
 */
import { ScreenHeader } from "@/components/profile";
import { colors, spacing, typography } from "@/constants/tokens";
import { useChangePassword, useProfile, useToggleTwoFactor } from "@/modules/profile";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SecuritySettingsScreen() {
  const { data: profile, isLoading } = useProfile();
  const changePassword = useChangePassword();
  const toggleTwoFactor = useToggleTwoFactor();

  // Password change modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<{
    current?: string;
    new?: string;
    confirm?: string;
  }>({});

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    profile?.securitySettings?.twoFactorEnabled || false
  );
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<"sms" | "email" | "authenticator">(
    profile?.securitySettings?.twoFactorMethod || "email"
  );

  // Update 2FA state when profile loads
  React.useEffect(() => {
    if (profile?.securitySettings) {
      setTwoFactorEnabled(profile.securitySettings.twoFactorEnabled);
      if (profile.securitySettings.twoFactorMethod) {
        setSelectedMethod(profile.securitySettings.twoFactorMethod);
      }
    }
  }, [profile?.securitySettings]);

  // Validate password
  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  // Handle password change
  const handlePasswordChange = async () => {
    const errors: typeof passwordErrors = {};

    if (!currentPassword) {
      errors.current = "Current password is required";
    }

    if (!newPassword) {
      errors.new = "New password is required";
    } else if (!validatePassword(newPassword)) {
      errors.new = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      errors.confirm = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      errors.confirm = "Passwords do not match";
    }

    setPasswordErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await changePassword.mutateAsync({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      Alert.alert("Success", "Password changed successfully");
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordErrors({});
    } catch (error: any) {
      console.error("Error changing password:", error);
      Alert.alert("Error", error?.message || "Failed to change password");
    }
  };

  // Handle 2FA toggle
  const handleTwoFactorToggle = async (value: boolean) => {
    if (value) {
      // Enabling 2FA - show method selection
      setShowMethodModal(true);
    } else {
      // Disabling 2FA
      try {
        await toggleTwoFactor.mutateAsync({ enabled: false });
        setTwoFactorEnabled(false);
        Alert.alert("Success", "Two-factor authentication disabled");
      } catch (error: any) {
        console.error("Error disabling 2FA:", error);
        Alert.alert("Error", error?.message || "Failed to disable 2FA");
      }
    }
  };

  // Handle 2FA method selection
  const handleMethodSelect = async () => {
    try {
      await toggleTwoFactor.mutateAsync({
        enabled: true,
        method: selectedMethod,
      });
      setTwoFactorEnabled(true);
      setShowMethodModal(false);
      Alert.alert(
        "Success",
        `Two-factor authentication enabled via ${selectedMethod}`
      );
    } catch (error: any) {
      console.error("Error enabling 2FA:", error);
      Alert.alert("Error", error?.message || "Failed to enable 2FA");
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

  const isProcessing = changePassword.isPending || toggleTwoFactor.isPending;

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
          <ScreenHeader title="Security Settings" />

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: spacing.xl }}
            showsVerticalScrollIndicator={false}
          >
            <View className="px-5 py-6">
              {/* Change Password Card */}
              <TouchableOpacity
                onPress={() => setShowPasswordModal(true)}
                activeOpacity={0.8}
                className="rounded-lg p-4 mb-3"
                style={{ backgroundColor: "#e1e6e8" }}
              >
                <Text
                  className="font-inter-semibold mb-1"
                  style={{ fontSize: typography.size.base, color: colors.dark[400] }}
                >
                  Change Password
                </Text>
                <Text
                  className="font-inter-regular"
                  style={{ fontSize: typography.size.sm, color: colors.dark[100] }}
                >
                  Update your account password
                </Text>
              </TouchableOpacity>

              {/* Two-Factor Authentication Card */}
              <View className="rounded-lg p-4 mb-3" style={{ backgroundColor: "#e1e6e8" }}>
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-1 mr-3">
                    <Text
                      className="font-inter-semibold mb-1"
                      style={{ fontSize: typography.size.base, color: colors.dark[400] }}
                    >
                      Two-Factor Authentication
                    </Text>
                    <Text
                      className="font-inter-regular"
                      style={{ fontSize: typography.size.sm, color: colors.dark[100] }}
                    >
                      Add an extra layer of security
                    </Text>
                  </View>
                  <Switch
                    value={twoFactorEnabled}
                    onValueChange={handleTwoFactorToggle}
                    trackColor={{
                      false: colors.light[200],
                      true: colors.primary[700],
                    }}
                    thumbColor={colors.light[400]}
                    disabled={isProcessing}
                  />
                </View>

                {/* Show method if 2FA is enabled */}
                {twoFactorEnabled && profile?.securitySettings?.twoFactorMethod && (
                  <View
                    className="mt-3 pt-3 flex-row items-center"
                    style={{ borderTopWidth: 1, borderTopColor: colors.light[200] }}
                  >
                    <Text
                      className="font-inter-regular flex-1"
                      style={{ fontSize: typography.size.sm, color: colors.dark[100] }}
                    >
                      Method:
                    </Text>
                    <Text
                      className="font-inter-semibold"
                      style={{ fontSize: typography.size.sm, color: colors.primary[700] }}
                    >
                      {profile.securitySettings.twoFactorMethod.toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>

              {/* Last Password Change */}
              {profile?.securitySettings?.lastPasswordChange && (
                <View
                  className="rounded-lg p-4"
                  style={{ backgroundColor: colors.primary[50] }}
                >
                  <Text
                    className="font-inter-regular"
                    style={{ fontSize: typography.size.sm, color: colors.dark[100] }}
                  >
                    Last password change:{" "}
                    {new Date(
                      profile.securitySettings.lastPasswordChange
                    ).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Bottom Blue Bar */}
          <View className="absolute bottom-0 left-0 right-0 h-[100px] bg-[#3fbdfd] z-50">
            <View className="h-[2px] bg-white" />
          </View>
        </SafeAreaView>
      </ImageBackground>

      {/* Password Change Modal */}
      <Modal
        visible={showPasswordModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View
            className="bg-white rounded-t-3xl p-6"
            style={{ maxHeight: "80%" }}
          >
            <Text
              className="font-poppins-semibold mb-6 text-center"
              style={{ fontSize: typography.size.lg, color: colors.dark[400] }}
            >
              Change Password
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Current Password */}
              <View className="mb-4">
                <Text
                  className="mb-2 font-inter-semibold"
                  style={{ fontSize: typography.size.base, color: colors.dark[400] }}
                >
                  Current Password
                </Text>
                <TextInput
                  value={currentPassword}
                  onChangeText={(text) => {
                    setCurrentPassword(text);
                    if (passwordErrors.current) {
                      setPasswordErrors({ ...passwordErrors, current: undefined });
                    }
                  }}
                  placeholder="Enter current password"
                  secureTextEntry
                  className="px-4 py-3 rounded-lg font-inter-regular"
                  style={[
                    styles.input,
                    passwordErrors.current && styles.inputError,
                  ]}
                  editable={!isProcessing}
                />
                {passwordErrors.current && (
                  <Text
                    className="mt-1 font-inter-regular"
                    style={{ fontSize: typography.size.sm, color: colors.danger }}
                  >
                    {passwordErrors.current}
                  </Text>
                )}
              </View>

              {/* New Password */}
              <View className="mb-4">
                <Text
                  className="mb-2 font-inter-semibold"
                  style={{ fontSize: typography.size.base, color: colors.dark[400] }}
                >
                  New Password
                </Text>
                <TextInput
                  value={newPassword}
                  onChangeText={(text) => {
                    setNewPassword(text);
                    if (passwordErrors.new) {
                      setPasswordErrors({ ...passwordErrors, new: undefined });
                    }
                  }}
                  placeholder="Enter new password"
                  secureTextEntry
                  className="px-4 py-3 rounded-lg font-inter-regular"
                  style={[
                    styles.input,
                    passwordErrors.new && styles.inputError,
                  ]}
                  editable={!isProcessing}
                />
                {passwordErrors.new && (
                  <Text
                    className="mt-1 font-inter-regular"
                    style={{ fontSize: typography.size.sm, color: colors.danger }}
                  >
                    {passwordErrors.new}
                  </Text>
                )}
              </View>

              {/* Confirm Password */}
              <View className="mb-6">
                <Text
                  className="mb-2 font-inter-semibold"
                  style={{ fontSize: typography.size.base, color: colors.dark[400] }}
                >
                  Confirm New Password
                </Text>
                <TextInput
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (passwordErrors.confirm) {
                      setPasswordErrors({ ...passwordErrors, confirm: undefined });
                    }
                  }}
                  placeholder="Confirm new password"
                  secureTextEntry
                  className="px-4 py-3 rounded-lg font-inter-regular"
                  style={[
                    styles.input,
                    passwordErrors.confirm && styles.inputError,
                  ]}
                  editable={!isProcessing}
                />
                {passwordErrors.confirm && (
                  <Text
                    className="mt-1 font-inter-regular"
                    style={{ fontSize: typography.size.sm, color: colors.danger }}
                  >
                    {passwordErrors.confirm}
                  </Text>
                )}
              </View>

              {/* Buttons */}
              <TouchableOpacity
                onPress={handlePasswordChange}
                disabled={isProcessing}
                activeOpacity={0.85}
                className="rounded-lg py-4 items-center mb-3"
                style={{
                  backgroundColor: isProcessing
                    ? colors.primary[200]
                    : colors.primary[700],
                }}
              >
                {isProcessing ? (
                  <ActivityIndicator size="small" color={colors.light[400]} />
                ) : (
                  <Text
                    className="font-inter-bold"
                    style={{ fontSize: typography.size.base, color: colors.light[400] }}
                  >
                    Change Password
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setShowPasswordModal(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setPasswordErrors({});
                }}
                disabled={isProcessing}
                activeOpacity={0.85}
                className="rounded-lg py-4 items-center"
                style={{ backgroundColor: colors.light[200] }}
              >
                <Text
                  className="font-inter-bold"
                  style={{ fontSize: typography.size.base, color: colors.dark[400] }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 2FA Method Selection Modal */}
      <Modal
        visible={showMethodModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMethodModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <Text
              className="font-poppins-semibold mb-6 text-center"
              style={{ fontSize: typography.size.lg, color: colors.dark[400] }}
            >
              Select 2FA Method
            </Text>

            {/* SMS Option */}
            <TouchableOpacity
              onPress={() => setSelectedMethod("sms")}
              activeOpacity={0.8}
              className="bg-white rounded-lg p-4 mb-3 flex-row items-center"
              style={{
                borderWidth: 2,
                borderColor:
                  selectedMethod === "sms" ? colors.primary[700] : colors.light[200],
              }}
            >
              <View className="flex-1">
                <Text
                  className="font-inter-semibold"
                  style={{ fontSize: typography.size.base, color: colors.dark[400] }}
                >
                  SMS
                </Text>
                <Text
                  className="font-inter-regular mt-1"
                  style={{ fontSize: typography.size.sm, color: colors.dark[100] }}
                >
                  Receive codes via text message
                </Text>
              </View>
            </TouchableOpacity>

            {/* Email Option */}
            <TouchableOpacity
              onPress={() => setSelectedMethod("email")}
              activeOpacity={0.8}
              className="bg-white rounded-lg p-4 mb-3 flex-row items-center"
              style={{
                borderWidth: 2,
                borderColor:
                  selectedMethod === "email" ? colors.primary[700] : colors.light[200],
              }}
            >
              <View className="flex-1">
                <Text
                  className="font-inter-semibold"
                  style={{ fontSize: typography.size.base, color: colors.dark[400] }}
                >
                  Email
                </Text>
                <Text
                  className="font-inter-regular mt-1"
                  style={{ fontSize: typography.size.sm, color: colors.dark[100] }}
                >
                  Receive codes via email
                </Text>
              </View>
            </TouchableOpacity>

            {/* Authenticator Option */}
            <TouchableOpacity
              onPress={() => setSelectedMethod("authenticator")}
              activeOpacity={0.8}
              className="bg-white rounded-lg p-4 mb-6 flex-row items-center"
              style={{
                borderWidth: 2,
                borderColor:
                  selectedMethod === "authenticator"
                    ? colors.primary[700]
                    : colors.light[200],
              }}
            >
              <View className="flex-1">
                <Text
                  className="font-inter-semibold"
                  style={{ fontSize: typography.size.base, color: colors.dark[400] }}
                >
                  Authenticator App
                </Text>
                <Text
                  className="font-inter-regular mt-1"
                  style={{ fontSize: typography.size.sm, color: colors.dark[100] }}
                >
                  Use Google Authenticator or similar
                </Text>
              </View>
            </TouchableOpacity>

            {/* Buttons */}
            <TouchableOpacity
              onPress={handleMethodSelect}
              disabled={isProcessing}
              activeOpacity={0.85}
              className="rounded-lg py-4 items-center mb-3"
              style={{
                backgroundColor: isProcessing
                  ? colors.primary[200]
                  : colors.primary[700],
              }}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color={colors.light[400]} />
              ) : (
                <Text
                  className="font-inter-bold"
                  style={{ fontSize: typography.size.base, color: colors.light[400] }}
                >
                  Enable 2FA
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowMethodModal(false)}
              disabled={isProcessing}
              activeOpacity={0.85}
              className="rounded-lg py-4 items-center"
              style={{ backgroundColor: colors.light[200] }}
            >
              <Text
                className="font-inter-bold"
                style={{ fontSize: typography.size.base, color: colors.dark[400] }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  },
  inputError: {
    borderColor: colors.danger,
  },
});
