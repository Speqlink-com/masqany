/**
 * Driver Maps Screen
 * 
 * Enterprise-grade Mapbox map view for drivers
 * Uses BaseMap component (same as move tab)
 */

import { BaseMap } from "@/components/map/BaseMap"
import { DriverMapLayers } from "@/components/map/DriverMapLayers"
import { StatusBar } from "expo-status-bar"
import React, { useState } from "react"
import { Image, StyleSheet, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function DriverMapsScreen() {
  const [sidebarVisible, setSidebarVisible] = useState(false)

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.mapContainer}>
        <BaseMap
          followUserLocation={false}
          showUserLocation
          initialPitch={45}
          initialZoomLevel={13}
        >
          <DriverMapLayers />
          {/* Future: active route, pickup marker, destination marker, traffic, properties */}
        </BaseMap>
      </View>

      {/* Header */}
      <SafeAreaView
        pointerEvents="box-none"
        style={styles.headerSafeArea}
        edges={["top", "left", "right"]}
      >
        <View pointerEvents="box-none" style={styles.header}>
          <TouchableOpacity
            onPress={() => setSidebarVisible(!sidebarVisible)}
            style={styles.iconButton}
          >
            <Image
              source={require("@/assets/icons/menu.png")}
              style={styles.menuIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <Image
              source={require("@/assets/icons/notificattion.png")}
              style={styles.menuIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  headerSafeArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 60,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    width: 48,
    elevation: 4,
  },
  menuIcon: {
    height: 28,
    width: 28,
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
