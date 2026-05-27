import { ProfileHeader, ProfileSkeleton, SettingsCard } from "@/components/profile";
import { GradientHeader, SidebarMenu } from "@/components/property-admin";
import { colors, spacing, typography } from "@/constants/tokens";
import { useAgents, usePropertyAdminStore } from "@/modules/property-admin";
import { useLogout, useProfile } from "@/modules/profile";
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

export default function PropertyAdminProfile() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { isSidebarOpen, openSidebar, closeSidebar } = usePropertyAdminStore();
  const authUser = useAuthStore((state) => state.user);
  const { data: profile, isLoading } = useProfile();
  const { data: agentsData } = useAgents();
  const logout = useLogout();
  const displayUser = profile || authUser;

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await logout.mutateAsync();
      router.replace("/auth");
    } catch (error: any) {
      Alert.alert("Logout Failed", error?.message || "Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout]);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ImageBackground
        source={require("@/assets/images/app-full-screen.webp")}
        style={styles.bg}
        resizeMode="cover"
      >
        <View className="absolute top-0 left-0 right-0 h-[3.5%] bg-[#20A6FD] z-50" />

        <GradientHeader
          variant="dashboard"
          onMenuPress={openSidebar}
          onHomePress={() => router.replace("/(property-admin)" as any)}
          onNotificationPress={() => router.push("/(property-admin)" as any)}
        />

        <SafeAreaView style={styles.safe} edges={["left", "right"]}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Property Owner Profile</Text>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {isLoading && !displayUser ? (
              <ProfileSkeleton />
            ) : (
              <ProfileHeader
                user={(displayUser as any) || null}
                isLoading={false}
                onEditPress={() => router.push("/(profile)/edit-profile")}
              />
            )}

            <View style={styles.settingsContainer}>
              <SettingsCard
                icon={require("@/assets/icons/listing-icon.png")}
                label="My Properties"
                onPress={() => router.push("/(property-admin)" as any)}
                delay={0}
              />
              <SettingsCard
                icon={require("@/assets/icons/house-icon.webp")}
                label="My Units"
                onPress={() => router.push("/(property-admin)/units" as any)}
                delay={50}
              />
              <SettingsCard
                icon={require("@/assets/icons/my-agents-icon.png")}
                label="My Agents"
                onPress={() => router.push("/(property-admin)/agents" as any)}
                delay={100}
              />
              <SettingsCard
                icon={require("@/assets/icons/occupancy-icon.png")}
                label="Analytics"
                onPress={() => router.push("/(property-admin)/analytics" as any)}
                delay={150}
              />
              <SettingsCard
                icon={require("@/assets/icons/add-new-property.png")}
                label="Add New Property"
                onPress={() =>
                  router.push("/(registration)/property-registration" as any)
                }
                delay={200}
              />
              <SettingsCard
                icon={require("@/assets/icons/logout.png")}
                label={isLoggingOut ? "Logging out..." : "Logout"}
                onPress={handleLogout}
                variant="danger"
                delay={250}
              />
            </View>
          </ScrollView>
        </SafeAreaView>

        <SidebarMenu
          isOpen={isSidebarOpen}
          userRole="Property_Owner"
          agentCount={agentsData?.length || 0}
          onClose={closeSidebar}
          onNavigate={(route) => router.push(route as any)}
        />
      </ImageBackground>

      <View
        pointerEvents="none"
        className="absolute bottom-0 left-0 right-0 h-[100px] bg-[#20A6FD] z-40"
      >
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
  },
  header: {
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
  },
  headerTitle: {
    color: colors.dark[400],
    fontFamily: typography.family.headingSemiBold,
    fontSize: typography.size.lg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 132,
  },
  settingsContainer: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
});
