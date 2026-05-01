import { colors, radius, spacing } from "@/constants/tokens";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

export function ProfileSkeleton() {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [pulseAnim]);

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.avatar, { opacity }]} />
      <Animated.View style={[styles.name, { opacity }]} />
      <Animated.View style={[styles.email, { opacity }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    backgroundColor: colors.light[200],
  },
  name: {
    width: 128,
    height: 24,
    borderRadius: radius.sm,
    backgroundColor: colors.light[200],
    marginTop: spacing.md,
  },
  email: {
    width: 192,
    height: 16,
    borderRadius: radius.sm,
    backgroundColor: colors.light[200],
    marginTop: spacing.xs,
  },
});
