/**
 * Profile — user settings and privacy.
 * Full-screen app-full-screen.webp. Tab bar floats transparently over it.
 * Displays user profile header and settings cards for navigation.
 */
import {
    ConfirmDialog,
    ProfileHeader,
    ProfileSkeleton,
    SettingsCard
} from "@/components/profile";
import { colors, spacing, typography } from "@/constants/tokens";
import { useAccounts, useLogout, useProfile } from "@/modules/profile";
import { useAuthStore } from "@/store/auth.store";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState } from "react";
import {
    Alert,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Get user from auth store (fallback if API is not available)
  const authUser = useAuthStore((s) => s.user);

  // Fetch profile data using TanStack Query (will use auth store as fallback)
  const { data: profile, isLoading, error, refetch } = useProfile();

  // Fetch user accounts for multi-account management
  const { data: accountsData } = useAccounts();
  const accounts = accountsData?.accounts || [];

  // Use profile data from API if available, otherwise fall back to auth store
  const displayUser = profile || authUser;

  // For development: Set mock user if no user exists
  React.useEffect(() => {
    if (!authUser && !profile) {
      useAuthStore.getState().setUser({
        id: "mock-user-1",
        name: "Boom Detroit",
        email: "comphortine@speqlink.com",
        phone: "+1234567890",
        avatar: undefined, // Will use default icon
        role: "tenant",
        isHost: false,
        isVerified: true,
        createdAt: new Date().toISOString(),
      });
    }
  }, [authUser, profile]);

  // Logout mutation
  const logout = useLogout();

  // Navigation handlers with useCallback
  const handleEditProfile = useCallback(() => {
    router.push("/(profile)/edit-profile");
  }, []);

  const handleAccountSettings = useCallback(() => {
    router.push("/(profile)/account-settings");
  }, []);

  const handleLanguagePreferences = useCallback(() => {
    router.push("/(profile)/language-preferences");
  }, []);

  const handleSecuritySettings = useCallback(() => {
    router.push("/(profile)/security-settings");
  }, []);

  const handleNotificationPreferences = useCallback(() => {
    router.push("/(profile)/notification-preferences");
  }, []);

  const handleSupport = useCallback(() => {
    router.push("/(profile)/support" as any);
  }, []);

  const handlePolicies = useCallback(() => {
    router.push("/(profile)/policies" as any);
  }, []);

  const handleSwitchAccount = useCallback(() => {
    router.push("/(profile)/switch-account" as any);
  }, []);

  // Logout flow
  const handleLogoutPress = useCallback(() => {
    setShowLogoutDialog(true);
  }, []);

  const handleLogoutConfirm = useCallback(async () => {
    setShowLogoutDialog(false);
    try {
      await logout.mutateAsync();
      // Navigate to auth screen after successful logout
      router.replace("/auth");
    } catch (err: any) {
      Alert.alert(
        "Logout Failed",
        err?.message || "Failed to log out. Please try again."
      );
    }
  }, [logout]);

  const handleLogoutCancel = useCallback(() => {
    setShowLogoutDialog(false);
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ImageBackground
        source={require("@/assets/images/app-full-screen.webp")}
        style={styles.bg}
        resizeMode="cover"
      >
        {/* Top Bar - Blue bar protecting status bar - Fixed position */}
        <View className="absolute top-0 left-0 right-0 h-[3.5%] bg-[#20A6FD] z-50" />
        
        <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Settings and Privacy</Text>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Profile Header Section - Task 8.2 */}
            {isLoading && !displayUser ? (
              <ProfileSkeleton />
            ) : (
              <ProfileHeader
                user={displayUser as any || null}
                isLoading={false}
                onEditPress={handleEditProfile}
              />
            )}

            {/* Settings Cards List - Task 8.3 */}
            <View style={styles.settingsContainer}>
              <SettingsCard
                icon={require("@/assets/icons/profile.webp")}
                label="Account Settings"
                onPress={handleAccountSettings}
                delay={0}
              />

              <SettingsCard
                icon={require("@/assets/icons/language.png")}
                label="Language Preferences"
                onPress={handleLanguagePreferences}
                delay={50}
              />

              <SettingsCard
                icon={require("@/assets/icons/security.png")}
                label="Security Settings"
                onPress={handleSecuritySettings}
                delay={100}
              />

              <SettingsCard
                icon={require("@/assets/icons/notificattion-icon.webp")}
                label="Notifications"
                onPress={handleNotificationPreferences}
                delay={150}
              />

              <SettingsCard
                icon={require("@/assets/icons/support.png")}
                label="Support"
                onPress={handleSupport}
                delay={200}
              />

              <SettingsCard
                icon={require("@/assets/icons/policies.png")}
                label="Terms and Policies"
                onPress={handlePolicies}
                delay={250}
              />

              {/* Conditionally show Switch Account if user has multiple accounts */}
              {accounts.length > 1 && (
                <SettingsCard
                  icon={require("@/assets/icons/profile.webp")}
                  label="Switch Account"
                  onPress={handleSwitchAccount}
                  delay={300}
                />
              )}

              <SettingsCard
                icon={require("@/assets/icons/logout.png")}
                label="Logout"
                onPress={handleLogoutPress}
                variant="danger"
                delay={350}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>

      {/* Logout Confirmation Dialog - Task 8.4 */}
      <ConfirmDialog
        visible={showLogoutDialog}
        title="Logout"
        message="Are you sure you want to log out?"
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
        variant="danger"
      />
      
      {/* Bottom Bar - Blue bar covering entire tab bar area - Fixed position */}
      <View className="absolute bottom-0 left-0 right-0 h-[100px] bg-[#20A6FD] z-50">
        <View className="h-[1px] bg-black" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  bg: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingBottom: 100, // Tab bar clearance
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: typography.family.headingSemiBold,
    fontSize: typography.size.lg,
    color: colors.dark[400],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  settingsContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
});
