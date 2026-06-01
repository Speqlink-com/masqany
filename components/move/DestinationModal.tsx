/**
 * DestinationModal Component
 * Full-screen destination picker with search and vehicle type selection
 */

import { mockSuggestedLocations } from "@/assets/data/move"
import type { Coordinates, Location, VehicleType } from "@/modules/move/types"
import { haversineDistance } from "@/modules/move/utils"
import { LinearGradient } from "expo-linear-gradient"
import React, { useMemo, useState } from "react"
import {
    Image,
    ImageBackground,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const vehicleOptions: {
  type: VehicleType
  label: string
  icon: any
  colors: [string, string]
}[] = [
  {
    type: "pickup",
    label: "Pickup",
    icon: require("@/assets/icons/pickup-vehicle-icon.png"),
    colors: ["#CDFFD8", "#94B9FF"],
  },
  {
    type: "mini_truck",
    label: "Mini Truck",
    icon: require("@/assets/icons/i-truck-icon.webp"),
    colors: ["#F8FAFC", "#EAF7FF"],
  },
  {
    type: "truck",
    label: "Truck",
    icon: require("@/assets/icons/vehicle-icon.webp"),
    colors: ["#00CED1", "#004AAD"],
  },
]

interface DestinationModalProps {
  visible: boolean
  currentLocation: Coordinates | null
  currentLocationLabel?: string | null
  onClose: () => void
  onSelect: (destination: Location, vehicleType: VehicleType) => void
}

export function DestinationModal({
  visible,
  currentLocation,
  currentLocationLabel,
  onClose,
  onSelect,
}: DestinationModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDestination, setSelectedDestination] = useState<Location | null>(null)
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType | null>(null)

  // Filter and sort locations by distance
  const filteredLocations = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    let locations = mockSuggestedLocations

    // Filter by search query
    if (query) {
      locations = locations.filter(
        (loc) =>
          loc.name.toLowerCase().includes(query) || loc.address.toLowerCase().includes(query)
      )
    }

    // Calculate distances and sort
    if (currentLocation) {
      return locations
        .map((loc) => ({
          ...loc,
          distance: haversineDistance(currentLocation, loc.coordinates),
        }))
        .sort((a, b) => a.distance - b.distance)
    }

    return locations.map((loc) => ({ ...loc, distance: 0 }))
  }, [searchQuery, currentLocation])

  const handleConfirm = () => {
    if (selectedDestination && selectedVehicleType) {
      onSelect(selectedDestination, selectedVehicleType)
      // Reset state
      setSelectedDestination(null)
      setSelectedVehicleType(null)
      setSearchQuery("")
    }
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <ImageBackground
        source={require("@/assets/images/app-full-screen.webp")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.scrim} />
        <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>MOVE REQUEST</Text>
              <Text style={styles.title}>Select destination</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              activeOpacity={0.7}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <Image
                source={require("@/assets/icons/close-icon.webp")}
                style={styles.closeIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.topPanel}>
            {/* Current Location Display */}
            {currentLocation && (
              <View style={styles.currentLocationCard}>
                <Text style={styles.cardLabel}>CURRENT LOCATION</Text>
                <View style={styles.row}>
                  <Image
                    source={require("@/assets/icons/pinned-location.png")}
                    style={styles.smallIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.currentLocationText} numberOfLines={2}>
                    {currentLocationLabel ||
                      `${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`}
                  </Text>
                </View>
              </View>
            )}

            {/* Search Input */}
            <View style={styles.searchBox}>
              <Image
                source={require("@/assets/icons/search.png")}
                style={styles.smallIcon}
                resizeMode="contain"
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search destination..."
                placeholderTextColor="#64748B"
                value={searchQuery}
                onChangeText={setSearchQuery}
                accessible
                accessibilityLabel="Search destination"
              />
            </View>
          </View>

          <View style={styles.locationsPanel}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>SUGGESTED LOCATIONS</Text>
              <Text style={styles.sectionMeta}>{filteredLocations.length} places</Text>
            </View>
            <ScrollView
              style={styles.locationsList}
              contentContainerStyle={styles.locationsContent}
              showsVerticalScrollIndicator
              indicatorStyle="black"
            >
              {filteredLocations.map((location) => {
                const selected = selectedDestination?.id === location.id

                return (
                  <TouchableOpacity
                    key={location.id}
                    onPress={() => setSelectedDestination(location)}
                    style={[
                      styles.locationCard,
                      selected && styles.locationCardSelected,
                    ]}
                    activeOpacity={0.76}
                  >
                    <View style={styles.locationCopy}>
                      <Text style={styles.locationName}>{location.name}</Text>
                      <Text style={styles.locationAddress} numberOfLines={1}>
                        {location.address}
                      </Text>
                    </View>
                    {currentLocation && (
                      <Text style={styles.distanceText}>
                        {location.distance.toFixed(1)} km
                      </Text>
                    )}
                  </TouchableOpacity>
                )
              })}
            </ScrollView>
          </View>

          <View style={styles.vehicleDock}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>SELECT VEHICLE TYPE</Text>
              <Text style={styles.sectionMeta}>
                {selectedVehicleType ? "Selected" : "Required"}
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.vehicleList}
            >
              {vehicleOptions.map((option) => (
                <VehicleTypeButton
                  key={option.type}
                  label={option.label}
                  icon={option.icon}
                  colors={option.colors}
                  selected={selectedVehicleType === option.type}
                  onPress={() => setSelectedVehicleType(option.type)}
                />
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={handleConfirm}
              disabled={!selectedDestination || !selectedVehicleType}
              style={[
                styles.continueButton,
                (!selectedDestination || !selectedVehicleType) && styles.continueButtonDisabled,
              ]}
              activeOpacity={0.85}
            >
              <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </Modal>
  )
}

interface VehicleTypeButtonProps {
  label: string
  icon: any
  colors: [string, string]
  selected: boolean
  onPress: () => void
}

function VehicleTypeButton({ label, icon, colors, selected, onPress }: VehicleTypeButtonProps) {
  const isDark = label === "Truck"

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.vehicleButton, selected && styles.vehicleButtonSelected]}
      activeOpacity={0.78}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.vehicleGradient}
      >
        <View style={[styles.vehicleIconWrap, isDark && styles.vehicleIconWrapDark]}>
          <Image source={icon} style={styles.vehicleIcon} resizeMode="contain" />
        </View>
        <Text style={[styles.vehicleLabel, isDark && styles.vehicleLabelDark]}>
          {label}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.24)",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eyebrow: {
    color: "#DDF3FF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: {
    width: 22,
    height: 22,
  },
  topPanel: {
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    gap: 12,
  },
  currentLocationCard: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#EAF7FF",
    borderWidth: 1,
    borderColor: "#CBEFFF",
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.7,
    color: "#20A6FD",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  smallIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  currentLocationText: {
    flex: 1,
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "700",
  },
  searchBox: {
    minHeight: 52,
    borderRadius: 999,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "600",
  },
  locationsPanel: {
    flex: 1,
    minHeight: 0,
    marginHorizontal: 16,
    marginTop: 14,
    paddingTop: 16,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    overflow: "hidden",
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: "#0F172A",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.75,
  },
  sectionMeta: {
    color: "#20A6FD",
    fontSize: 12,
    fontWeight: "800",
  },
  locationsList: {
    flex: 1,
  },
  locationsContent: {
    paddingHorizontal: 12,
    paddingBottom: 14,
    gap: 10,
  },
  locationCard: {
    minHeight: 72,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  locationCardSelected: {
    backgroundColor: "#EAF7FF",
    borderColor: "#20A6FD",
  },
  locationCopy: {
    flex: 1,
  },
  locationName: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "800",
  },
  locationAddress: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 4,
    fontWeight: "600",
  },
  distanceText: {
    color: "#20A6FD",
    fontSize: 13,
    fontWeight: "800",
  },
  vehicleDock: {
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 10,
    paddingTop: 16,
    paddingBottom: 14,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.96)",
  },
  vehicleList: {
    paddingHorizontal: 12,
    gap: 10,
  },
  vehicleButton: {
    width: 126,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  vehicleButtonSelected: {
    borderColor: "#20A6FD",
  },
  vehicleGradient: {
    height: 94,
    borderRadius: 14,
    padding: 12,
    justifyContent: "space-between",
  },
  vehicleIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    alignItems: "center",
    justifyContent: "center",
  },
  vehicleIconWrapDark: {
    backgroundColor: "rgba(255, 255, 255, 0.22)",
  },
  vehicleIcon: {
    width: 30,
    height: 30,
  },
  vehicleLabel: {
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "800",
  },
  vehicleLabelDark: {
    color: "#FFFFFF",
  },
  continueButton: {
    minHeight: 52,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 999,
    backgroundColor: "#20A6FD",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#20A6FD",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 5,
  },
  continueButtonDisabled: {
    backgroundColor: "#94A3B8",
    shadowOpacity: 0,
    elevation: 0,
  },
  continueText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
})
