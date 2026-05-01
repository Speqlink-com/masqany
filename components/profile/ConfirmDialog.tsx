import { colors, radius, shadow, spacing, typography } from "@/constants/tokens";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "default" | "danger";
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  variant = "default",
}: ConfirmDialogProps) {
  const isDanger = variant === "danger";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                isDanger && styles.confirmButtonDanger,
              ]}
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Text style={styles.confirmText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  dialog: {
    backgroundColor: colors.light[400],
    borderRadius: radius.lg,
    padding: spacing.xl,
    width: "100%",
    maxWidth: 400,
    ...shadow.lg,
  },
  title: {
    fontFamily: typography.family.headingSemiBold,
    fontSize: typography.size.lg,
    color: colors.dark[400],
    marginBottom: spacing.md,
    textAlign: "center",
  },
  message: {
    fontFamily: typography.family.regular,
    fontSize: typography.size.base,
    color: colors.dark[100],
    marginBottom: spacing.xl,
    textAlign: "center",
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: colors.light[200],
  },
  cancelText: {
    fontFamily: typography.family.medium,
    fontSize: typography.size.base,
    color: colors.dark[400],
  },
  confirmButton: {
    backgroundColor: colors.primary[700],
  },
  confirmButtonDanger: {
    backgroundColor: colors.danger,
  },
  confirmText: {
    fontFamily: typography.family.medium,
    fontSize: typography.size.base,
    color: colors.light[400],
  },
});
