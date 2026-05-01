import { colors, radius, shadow, spacing, typography } from "@/constants/tokens";
import React, { useEffect, useRef } from "react";
import { Animated, Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity } from "react-native";

interface SettingsCardProps {
  icon: ImageSourcePropType;
  label: string;
  onPress: () => void;
  variant?: "default" | "danger";
  delay?: number; // Animation delay in ms
}

export const SettingsCard = React.memo(function SettingsCard({ icon, label, onPress, variant = "default", delay = 0 }: SettingsCardProps) {
  const isDanger = variant === "danger";
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, fadeAnim, delay]);

  return (
    <Animated.View
      style={{
        transform: [{ translateX: slideAnim }],
        opacity: fadeAnim,
      }}
    >
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Image
          source={icon}
          style={[styles.icon, isDanger && styles.iconDanger]}
          resizeMode="contain"
        />
        <Text style={[styles.label, isDanger && styles.labelDanger]}>
          {label}
        </Text>
        <Image
          source={require("@/assets/icons/right-chevron.png")}
          style={[styles.chevron, isDanger && styles.chevronDanger]}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e1e6e8",
    borderRadius: radius.lg,
    padding: spacing.base,
    marginBottom: spacing.md,
    ...shadow.sm,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: colors.dark[400],
  },
  iconDanger: {
    tintColor: colors.danger,
  },
  label: {
    flex: 1,
    marginLeft: spacing.md,
    fontFamily: typography.family.medium,
    fontSize: typography.size.base,
    color: colors.dark[400],
  },
  labelDanger: {
    color: colors.danger,
  },
  chevron: {
    width: 16,
    height: 16,
    tintColor: colors.dark[100],
  },
  chevronDanger: {
    tintColor: colors.danger,
  },
});
