/**
 * Driver Maps Screen
 * 
 * Map view for drivers to see locations and routes
 */

import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DriverMapsScreen() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={require("@/assets/images/app-full-screen.webp")}
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <TouchableOpacity
                onPress={() => setSidebarVisible(!sidebarVisible)}
                style={styles.menuButton}
              >
                <Image
                  source={require("@/assets/icons/menu.png")}
                  style={styles.menuIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <Text style={styles.headerTitle}>Maps</Text>

              <TouchableOpacity style={styles.menuButton}>
                <Image
                  source={require("@/assets/icons/notificattion.png")}
                  style={styles.menuIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.placeholderText}>
              Map view functionality
            </Text>
            <Text style={styles.placeholderSubtext}>
              View locations, routes, and navigation
            </Text>
          </ScrollView>
        </SafeAreaView>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          <View style={styles.bottomBarLine} />
        </View>

        {/* Sidebar */}
        {sidebarVisible && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setSidebarVisible(false)}
            style={styles.sidebarOverlay}
          >
            <View style={styles.sidebar}>
              <Image
                source={require("@/assets/images/side-bar.png")}
                style={styles.sidebarImage}
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    width: 28,
    height: 28,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
    marginTop: 40,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "#3fbdfd",
    zIndex: 50,
  },
  bottomBarLine: {
    height: 1,
    backgroundColor: "#000000",
  },
  sidebarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 40,
  },
  sidebar: {
    width: 256,
    height: "100%",
    backgroundColor: "#ffffff",
  },
  sidebarImage: {
    width: "100%",
    height: "100%",
  },
});
