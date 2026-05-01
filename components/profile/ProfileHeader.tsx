import { colors, radius, spacing, typography } from "@/constants/tokens";
import type { UserProfile } from "@/modules/profile";
import type { User } from "@/types";
import React, { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProfileHeaderProps {
  user: UserProfile | User | null;
  isLoading: boolean;
  onEditPress: () => void;
}

export const ProfileHeader = React.memo(function ProfileHeader({ user, isLoading, onEditPress }: ProfileHeaderProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isLoading && user) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [isLoading, user, fadeAnim]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary[700]} />
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.avatarContainer}>
        <Image
          source={
            user?.avatar
              ? { uri: user.avatar }
              : require("@/assets/icons/user-profile-icon.webp")
          }
          style={styles.avatar}
        />
        <TouchableOpacity
          style={styles.editButton}
          onPress={onEditPress}
          activeOpacity={0.7}
        >
          <Image
            source={require("@/assets/icons/edit.png")}
            style={styles.editIcon}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.name}>{user?.name || "Guest User"}</Text>
      <Text style={styles.email}>{user?.email || "No email"}</Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    width: 80,
    height: 80,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    borderWidth: 3,
    borderColor: colors.primary[700],
  },
  editButton: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    backgroundColor: colors.light[400],
    borderRadius: radius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  editIcon: {
    width: 24,
    height: 24,
  },
  name: {
    fontFamily: typography.family.headingSemiBold,
    fontSize: typography.size.xl,
    color: colors.dark[400],
    marginTop: spacing.md,
  },
  email: {
    fontFamily: typography.family.regular,
    fontSize: typography.size.base,
    color: colors.dark[100],
    marginTop: spacing.xs,
  },
});
