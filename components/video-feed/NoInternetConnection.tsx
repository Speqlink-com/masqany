/**
 * NoInternetConnection component — Display when network is unavailable
 * 
 * Features:
 * - Full-screen error state
 * - Clear messaging about network issue
 * - Retry button to attempt reconnection
 */

import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface NoInternetConnectionProps {
  onRetry: () => void;
}

export function NoInternetConnection({ onRetry }: NoInternetConnectionProps) {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/icons/masqany-agent.webp")}
        style={styles.icon}
        resizeMode="contain"
      />
      <Text style={styles.title}>No Internet Connection</Text>
      <Text style={styles.message}>
        Please check your connection and try again
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  icon: {
    width: 96,
    height: 96,
    marginBottom: 24,
    opacity: 0.6,
  },
  title: {
    fontFamily: "CG-Bold",
    fontSize: 20,
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontFamily: "Nunito_400Regular",
    fontSize: 16,
    color: "#BDBDC0",
    textAlign: "center",
    marginBottom: 32,
  },
  retryButton: {
    backgroundColor: "#20A6FD",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryButtonText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 16,
    color: "#FFFFFF",
  },
});
