import { colors, radius, spacing, typography } from "@/constants/tokens";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ErrorViewProps {
  message: string;
  onRetry: () => void;
}

export function ErrorView({ message, onRetry }: ErrorViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={onRetry}
        activeOpacity={0.7}
      >
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing["3xl"],
    alignItems: "center",
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  message: {
    fontFamily: typography.family.regular,
    fontSize: typography.size.base,
    color: colors.danger,
    textAlign: "center",
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: colors.primary[700],
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  retryText: {
    fontFamily: typography.family.medium,
    fontSize: typography.size.base,
    color: colors.light[400],
  },
});
