/**
 * Driver Maps Screen
 * 
 * Enterprise-grade Mapbox map view for drivers
 * Shows map with Nairobi as default location
 * Ready for future route navigation and tracking features
 */

import { Mapbox } from "@/components/map/mapbox"
import { StatusBar } from "expo-status-bar"
import React, { useCallback, useMemo, useState } from "react"
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

// Nairobi CBD coordinates [longitude, latitude]
const NAIROBI_COORDINATES: [number, number] = [36.8219, -1.2921]
const INITIAL_ZOOM = 13

export default function DriverMapsScreen() {
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  // Memoize coordinates to avoid re-renders
  const nairobiCoords = useMemo(() => NAIROBI_COORDINATES, [])

  const handleMapLoaded = useCallback(() => {
    setIsMapLoaded(true)
  }, [])

  // Check if Mapbox is available
  if (!Mapbox) {
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

            {/* Mapbox Not Available */}
            <View style={styles.errorContainer}>
              <Text style={styles.errorTitle}>Map Not Available</Text>
              <Text style={styles.errorText}>
                Mapbox requires a development build. Please rebuild the app.
              </Text>
            </View>
          </SafeAreaView>

          {/* Bottom Bar */}
          <View style={styles.bottomBar}>
            <View style={styles.bottomBarLine} />
          </View>
        </ImageBackground>
      </View>
    )
  }

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

          {/* Map Container */}
          <View style={styles.mapContainer}>
            {/* Loading Indicator */}
            {!isMapLoaded && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#20A6FD" />
                <Text style={styles.loadingText}>Loading map...</Text>
              </View>
            )}

            {/* Mapbox Map */}
            <Mapbox.MapView
              style={styles.map}
              styleURL={Mapbox.StyleURL.Light}
              zoomEnabled
              scrollEnabled
              rotateEnabled
              pitchEnabled
              onDidFinishLoadingMap={handleMapLoaded}
            >
              {/* Camera - Initial position at Nairobi */}
              <Mapbox.Camera
                zoomLevel={INITIAL_ZOOM}
                centerCoordinate={nairobiCoords}
                animationDuration={0}
              />

              {/* Future Layers */}
              {/* Phase 2: Driver location, pickup markers, destination markers */}
              {/* Phase 3: Route navigation, turn-by-turn directions */}
              {/* Phase 4: Nearby properties, nearby movers, real-time tracking */}
              
              {/* User Location (hidden until permissions implemented) */}
              <Mapbox.UserLocation visible={false} />
            </Mapbox.MapView>
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
      </ImageBackground>
    </View>
  )
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
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
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
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
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
