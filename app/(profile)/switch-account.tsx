/**
 * Switch Account Screen
 * Displays list of all user accounts and allows switching between them.
 */
import { colors, spacing } from "@/constants/tokens";
import { useAccounts, useSwitchAccount } from "@/modules/profile";
import { useAuthStore } from "@/store/auth.store";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function SwitchAccountScreen() {
  const { data: accountsData, isLoading, error } = useAccounts();
  const currentUser = useAuthStore((s) => s.user);
  const [switchingAccountId, setSwitchingAccountId] = useState<string | null>(null);

  // Extract accounts array from the response
  const accounts = accountsData?.accounts || [];

  // Switch account mutation
  const switchAccount = useSwitchAccount();

  const handleAddAccount = () => {
    router.push("/(profile)/add-account" as any);
  };

  const handleAccountPress = async (accountId: string) => {
    // Don't switch if already active
    if (accountId === currentUser?.id) {
      return;
    }

    setSwitchingAccountId(accountId);

    try {
      await switchAccount.mutateAsync(accountId);
      
      // Show success message
      Alert.alert(
        "Account Switched",
        "You have successfully switched accounts.",
        [
          {
            text: "OK",
            onPress: () => {
              // Navigate back to profile screen
              router.back();
            },
          },
        ]
      );
    } catch (err: any) {
      Alert.alert(
        "Switch Failed",
        err?.message || "Failed to switch accounts. Please try again."
      );
    } finally {
      setSwitchingAccountId(null);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={colors.primary[700]} />
        <Text className="mt-4 text-base font-inter-medium text-dark-200">
          Loading accounts...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-lg font-poppins-semibold text-danger mb-2">
          Failed to Load Accounts
        </Text>
        <Text className="text-base font-inter-regular text-dark-200 text-center">
          {error instanceof Error ? error.message : "An error occurred"}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 py-4">
          <Text className="text-lg font-poppins-semibold text-dark-400">
            Switch Account
          </Text>
          <Text className="text-sm font-inter-regular text-dark-200 mt-1">
            Select an account to switch to
          </Text>
        </View>

        {/* Accounts List */}
        <View className="px-6">
          {accounts.map((account) => {
            const isActive = account.id === currentUser?.id;

            return (
              <TouchableOpacity
                key={account.id}
                onPress={() => handleAccountPress(account.id)}
                disabled={isActive || switchingAccountId === account.id}
                className={`flex-row items-center p-4 mb-3 rounded-2xl ${
                  isActive ? "bg-primary-50 border-2 border-primary-700" : "bg-light-200"
                }`}
                activeOpacity={0.7}
              >
                {/* Avatar */}
                <View className="relative">
                  <Image
                    source={
                      account.avatar
                        ? { uri: account.avatar }
                        : require("@/assets/icons/user-profile-icon.webp")
                    }
                    className="w-14 h-14 rounded-full"
                  />
                  {isActive && (
                    <View
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full items-center justify-center"
                      style={{ backgroundColor: colors.primary[700] }}
                    >
                      <Text className="text-white text-xs">✓</Text>
                    </View>
                  )}
                </View>

                {/* Account Info */}
                <View className="flex-1 ml-4">
                  <View className="flex-row items-center">
                    <Text className="text-base font-poppins-semibold text-dark-400">
                      {account.name}
                    </Text>
                    {isActive && (
                      <View className="ml-2 px-2 py-0.5 rounded-full bg-primary-700">
                        <Text className="text-xs font-inter-medium text-white">
                          Active
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-sm font-inter-regular text-dark-200 mt-0.5">
                    {account.email}
                  </Text>
                  <Text className="text-xs font-inter-regular text-dark-100 mt-0.5 capitalize">
                    {account.role}
                  </Text>
                </View>

                {/* Loading indicator or Chevron */}
                {switchingAccountId === account.id ? (
                  <ActivityIndicator size="small" color={colors.primary[700]} />
                ) : !isActive ? (
                  <Image
                    source={require("@/assets/icons/right-chevron.png")}
                    className="w-5 h-5"
                    style={{ tintColor: colors.dark[200] }}
                  />
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Add Account Button */}
        {accounts.length < 5 && (
          <View className="px-6 mt-4">
            <TouchableOpacity
              onPress={handleAddAccount}
              className="flex-row items-center justify-center p-4 rounded-2xl border-2 border-dashed border-primary-700"
              activeOpacity={0.7}
            >
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: colors.primary[100] }}
              >
                <Text
                  className="text-2xl font-poppins-semibold"
                  style={{ color: colors.primary[700] }}
                >
                  +
                </Text>
              </View>
              <Text
                className="text-base font-poppins-semibold"
                style={{ color: colors.primary[700] }}
              >
                Add Another Account
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Account Limit Notice */}
        {accounts.length >= 5 && (
          <View className="px-6 mt-4">
            <View className="p-4 rounded-2xl bg-secondary-50">
              <Text className="text-sm font-inter-medium text-dark-300 text-center">
                Maximum of 5 accounts reached
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
