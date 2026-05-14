/**
 * EmptyFeedState component — Display when no videos are available
 * 
 * Features:
 * - Full-screen empty state
 * - Illustration or icon
 * - Helpful message and suggestions
 */

import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export function EmptyFeedState() {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/icons/masqany-agent.webp")}
        style={styles.icon}
        resizeMode="contain"
      />
      <Text style={styles.title}>No videos yet</Text>
      <Text style={styles.message}>
        Check back later for new property videos
      </Text>
      <Text style={styles.suggestion}>
        In the meantime, you can explore other features or adjust your filters
      </Text>
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
    width: 120,
    height: 120,
    marginBottom: 24,
    opacity: 0.4,
  },
  title: {
    fontFamily: "CG-Bold",
    fontSize: 24,
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 16,
    color: "#BDBDC0",
    textAlign: "center",
    marginBottom: 16,
  },
  suggestion: {
    fontFamily: "Nunito_400Regular",
    fontSize: 14,
    color: "#545454",
    textAlign: "center",
  },
});
