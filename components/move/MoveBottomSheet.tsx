/**
 * MoveBottomSheet Component
 * Enterprise-grade scrollable bottom sheet with smooth snap points
 * Allows up to 80% screen coverage for optimal map viewing
 */

import type { AvailableVehicle } from "@/modules/move/types"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Animated,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native"
import { VehicleList } from "./VehicleList"

interface MoveBottomSheetProps {
  bottomInset: number
  currentLocation: string | null
  destination: string | null
  vehicles: AvailableVehicle[]
  selectedVehicleId: string | null
  isLoadingVehicles: boolean
  vehiclesError?: Error | null
  onOpenDestinationModal: () => void
  onSelectVehicle: (vehicle: AvailableVehicle) => void
  onConfirmMove: () => void
  onSnapChange?: (fraction: number) => void
  onRetryVehicles?: () => void
}

export function MoveBottomSheet({
  bottomInset,
  currentLocation,
  destination,
  vehicles,
  selectedVehicleId,
  isLoadingVehicles,
  vehiclesError,
  onOpenDestinationModal,
  onSelectVehicle,
  onConfirmMove,
  onSnapChange,
  onRetryVehicles,
}: MoveBottomSheetProps) {
  const { height } = useWindowDimensions()
  const currentSnapIndexRef = useRef(1)
  const currentTranslateYRef = useRef(0)
  const gestureStartTranslateYRef = useRef(0)
  const scrollOffsetYRef = useRef(0)
  const [activeSnapIndex, setActiveSnapIndex] = useState(1)

  const snapFractions = useMemo(() => [0.2, 0.5, 0.8], [])
  const maxSheetHeight = Math.round(height * 0.8)
  const snapOffsets = useMemo(
    () => snapFractions.map((fraction) => maxSheetHeight - height * fraction),
    [height, maxSheetHeight, snapFractions]
  )

  const translateY = useRef(new Animated.Value(snapOffsets[1] ?? 0)).current

  const handleSheetChanges = useCallback(
    (index: number) => {
      currentSnapIndexRef.current = index
      setActiveSnapIndex(index)
      onSnapChange?.(snapFractions[index] ?? 0.5)
    },
    [onSnapChange, snapFractions]
  )

  const snapToIndex = useCallback(
    (index: number) => {
      const boundedIndex = Math.max(0, Math.min(index, snapOffsets.length - 1))

      Animated.spring(translateY, {
        toValue: snapOffsets[boundedIndex] ?? 0,
        damping: 24,
        stiffness: 220,
        mass: 0.9,
        useNativeDriver: true,
      }).start()

      handleSheetChanges(boundedIndex)
    },
    [handleSheetChanges, snapOffsets, translateY]
  )

  useEffect(() => {
    const listenerId = translateY.addListener(({ value }) => {
      currentTranslateYRef.current = value
    })

    return () => translateY.removeListener(listenerId)
  }, [translateY])

  useEffect(() => {
    snapToIndex(currentSnapIndexRef.current)
  }, [snapToIndex])

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponderCapture: (_, gestureState) => {
          const isVerticalDrag =
            Math.abs(gestureState.dy) > Math.abs(gestureState.dx) &&
            Math.abs(gestureState.dy) > 4

          if (!isVerticalDrag) return false

          const isExpanded = currentSnapIndexRef.current === snapOffsets.length - 1
          const isPullingDownFromTop = scrollOffsetYRef.current <= 0 && gestureState.dy > 0

          return !isExpanded || isPullingDownFromTop
        },
        onMoveShouldSetPanResponder: (_, gestureState) => {
          const isVerticalDrag =
            Math.abs(gestureState.dy) > Math.abs(gestureState.dx) &&
            Math.abs(gestureState.dy) > 4

          if (!isVerticalDrag) return false

          const isExpanded = currentSnapIndexRef.current === snapOffsets.length - 1
          const isPullingDownFromTop = scrollOffsetYRef.current <= 0 && gestureState.dy > 0

          return !isExpanded || isPullingDownFromTop
        },
        onPanResponderGrant: () => {
          gestureStartTranslateYRef.current = currentTranslateYRef.current
        },
        onPanResponderMove: (_, gestureState) => {
          const nextTranslateY = Math.max(
            snapOffsets[2] ?? 0,
            Math.min(
              (snapOffsets[0] ?? 0),
              gestureStartTranslateYRef.current + gestureState.dy
            )
          )

          translateY.setValue(nextTranslateY)
        },
        onPanResponderRelease: (_, gestureState) => {
          const currentIndex = currentSnapIndexRef.current

          if (gestureState.vy > 0.7) {
            snapToIndex(currentIndex - 1)
            return
          }

          if (gestureState.vy < -0.7) {
            snapToIndex(currentIndex + 1)
            return
          }

          const nextTranslateY = currentTranslateYRef.current
          const nearestIndex = snapOffsets.reduce((nearest, offset, index) => {
            const nearestDistance = Math.abs(nextTranslateY - snapOffsets[nearest])
            const offsetDistance = Math.abs(nextTranslateY - offset)

            return offsetDistance < nearestDistance ? index : nearest
          }, 1)

          snapToIndex(nearestIndex)
        },
      }),
    [snapOffsets, snapToIndex, translateY]
  )

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId)

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.sheetContainer,
        {
          bottom: bottomInset,
          height: maxSheetHeight,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.handleContainer}>
        <View style={styles.handleIndicator} />
      </View>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        scrollEnabled={activeSnapIndex === 2}
        scrollEventThrottle={16}
        onScroll={(event) => {
          scrollOffsetYRef.current = event.nativeEvent.contentOffset.y
        }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>Move with</Text>
            <Image
              source={require("@/assets/images/blue-black-logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>Live</Text>
          </View>
        </View>

        {/* Current Location */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>CURRENT LOCATION</Text>
          <View style={styles.locationRow}>
            <Image
              source={require("@/assets/icons/pinned-location.png")}
              style={styles.locationIcon}
              resizeMode="contain"
            />
            <Text style={styles.locationText}>
              {currentLocation || "Detecting your location..."}
            </Text>
          </View>
        </View>

        {/* Destination Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DESTINATION</Text>
          <TouchableOpacity
            onPress={onOpenDestinationModal}
            style={styles.destinationButton}
            activeOpacity={0.7}
          >
            <View style={styles.destinationContent}>
              <Image
                source={require("@/assets/icons/location.png")}
                style={styles.locationIcon}
                resizeMode="contain"
              />
              <Text style={[styles.destinationText, !destination && styles.placeholderText]}>
                {destination || "Select destination"}
              </Text>
            </View>
            <Image
              source={require("@/assets/icons/right-chevron.png")}
              style={styles.chevronIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Vehicle List or Selected Vehicle */}
        {destination ? (
          selectedVehicle ? (
            <SelectedVehicleView vehicle={selectedVehicle} onConfirm={onConfirmMove} />
          ) : (
            <View style={styles.vehiclesSection}>
              <Text style={styles.sectionLabel}>AVAILABLE VEHICLES</Text>
              <VehicleList
                vehicles={vehicles}
                selectedVehicleId={selectedVehicleId}
                onSelect={onSelectVehicle}
                isLoading={isLoadingVehicles}
                error={vehiclesError}
                onRetry={onRetryVehicles}
              />
            </View>
          )
        ) : (
          <View style={styles.emptyState}>
            <Image
              source={require("@/assets/icons/i-location-icon.webp")}
              style={styles.emptyIcon}
              resizeMode="contain"
            />
            <Text style={styles.emptyText}>
              Select a destination to view available vehicles
            </Text>
          </View>
        )}
      </Animated.ScrollView>
    </Animated.View>
  )
}

// ============================================================================
// Selected Vehicle View
// ============================================================================

interface SelectedVehicleViewProps {
  vehicle: AvailableVehicle
  onConfirm: () => void
}

function SelectedVehicleView({ vehicle, onConfirm }: SelectedVehicleViewProps) {
  const vehicleTypeLabel = {
    pickup: "Pickup Truck",
    mini_truck: "Mini Truck",
    truck: "Large Truck",
  }[vehicle.type]

  return (
    <View style={styles.selectedVehicleContainer}>
      <View style={styles.selectedVehicleCard}>
        <Text style={styles.selectedLabel}>SELECTED VEHICLE</Text>
        <View style={styles.selectedVehicleRow}>
          <Text style={styles.selectedVehicleType}>{vehicleTypeLabel}</Text>
          <Text style={styles.selectedVehiclePrice}>
            {vehicle.currency} {vehicle.price.toLocaleString()}
          </Text>
        </View>
        <View style={styles.selectedVehicleDetails}>
          <View style={styles.detailItem}>
            <Image
              source={require("@/assets/icons/time.png")}
              style={styles.detailIcon}
              resizeMode="contain"
            />
            <Text style={styles.detailText}>Arrives in {vehicle.estimatedArrival} min</Text>
          </View>
          <View style={styles.detailItem}>
            <Image
              source={require("@/assets/icons/location.png")}
              style={styles.detailIcon}
              resizeMode="contain"
            />
            <Text style={styles.detailText}>{vehicle.distance.toFixed(1)} km away</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={onConfirm}
        style={styles.confirmButton}
        activeOpacity={0.8}
      >
        <Text style={styles.confirmButtonText}>Confirm Move</Text>
      </TouchableOpacity>
    </View>
  )
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  sheetContainer: {
    position: "absolute",
    right: 0,
    left: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 18,
    overflow: "hidden",
    zIndex: 30,
  },
  handleContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 12,
    paddingBottom: 6,
  },
  handleIndicator: {
    backgroundColor: "#CBD5E1",
    width: 46,
    height: 5,
    borderRadius: 999,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F7",
  },
  headerTitleRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: "#0F172A",
  },
  headerLogo: {
    width: 116,
    height: 32,
  },
  statusPill: {
    minWidth: 64,
    height: 34,
    borderRadius: 999,
    backgroundColor: "#EAF7FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#CBEFFF",
  },
  statusPillText: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "800",
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#64748B",
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 999,
  },
  locationIcon: {
    width: 20,
    height: 20,
  },
  locationText: {
    fontSize: 15,
    color: "#0F172A",
    fontWeight: "600",
    flex: 1,
  },
  destinationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 54,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  destinationContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  destinationText: {
    fontSize: 15,
    color: "#0F172A",
    fontWeight: "700",
  },
  placeholderText: {
    color: "#9CA3AF",
  },
  chevronIcon: {
    width: 20,
    height: 20,
    tintColor: "#9CA3AF",
  },
  vehiclesSection: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  emptyState: {
    paddingVertical: 48,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  emptyIcon: {
    width: 64,
    height: 64,
    opacity: 0.3,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  selectedVehicleContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  selectedVehicleCard: {
    backgroundColor: "#F8FAFC",
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#D8ECFF",
    marginBottom: 16,
  },
  selectedLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#20A6FD",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  selectedVehicleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  selectedVehicleType: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  selectedVehiclePrice: {
    fontSize: 24,
    fontWeight: "700",
    color: "#20A6FD",
  },
  selectedVehicleDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailIcon: {
    width: 16,
    height: 16,
  },
  detailText: {
    fontSize: 14,
    color: "#6B7280",
  },
  confirmButton: {
    backgroundColor: "#20A6FD",
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
    shadowColor: "#20A6FD",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#ffffff",
    letterSpacing: 0.3,
  },
})
