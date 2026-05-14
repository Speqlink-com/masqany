/**
 * EndOfFeedState component — Display when feed reaches the end
 * 
 * Features:
 * - Message indicating user is caught up
 * - Optional button to scroll back to top
 */

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface EndOfFeedStateProps {
  onScrollToTop?: () => void;
}

export function EndOfFeedState({ onScrollToTop }: EndOfFeedStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎉</Text>
      <Text style={styles.title}>You're all caught up!</Text>
      <Text style={styles.message}>
        You've seen all available property videos
      </Text>
      {onScrollToTop && (
        <TouchableOpacity style={styles.button} onPress={onScrollToTop}>
          <Text style={styles.buttonText}>Back to Top</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontFamily: "CG-Bold",
    fontSize: 20,
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontFamily: "Nunito_400Regular",
    fontSize: 14,
    color: "#BDBDC0",
    textAlign: "center",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#20A6FD",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 14,
    color: "#FFFFFF",
  },
});
