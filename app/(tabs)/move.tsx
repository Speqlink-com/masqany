/**
 * Move — Enterprise-grade relocation services with map interface
 * Supports moving service booking and property navigation
 */
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { BaseMap } from "@/components/map/BaseMap"
import { LocateMeButton } from "@/components/map/LocateMeButton"
import { PropertyMarkers } from "@/components/map/PropertyMarkers"
import {
  DestinationModal,
  DriverMarkers,
  MoveBottomSheet,
  RouteLayer,
} from "@/components/move"
import { MAP_CONFIG } from "@/constants/mapConfig"
import { mockProperties } from "@/constants/mockProperties"
import { useAvailableVehicles, useMoveStore, useRoute } from "@/modules/move"
import type { Coordinates, Location as MoveLocation, VehicleType } from "@/modules/move/types"
import * as Location from "expo-location"
import { useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useEffect, useRef, useState } from "react"
import { StyleSheet, useWindowDimensions, View } from "react-native"

export default function MoveScreen() {
  const router = useRouter()
  const tabBarHeight = useBottomTabBarHeight()
  const { height } = useWindowDimensions()

  // Refs
  const cameraRef = useRef<any>(null)
  const mapRef = useRef<any>(null)

  // Local state
  const [currentCoordinate, setCurrentCoordinate] = useState<Coordinates | null>(null)
  const [currentLocationName, setCurrentLocationName] = useState<string | null>(null)
  const [currentLocationAddress, setCurrentLocationAddress] = useState<string | null>(null)

  // Zustand store selectors
  const isDestinationModalVisible = useMoveStore((s) => s.isDestinationModalVisible)
  const selectedDestination = useMoveStore((s) => s.selectedDestination)
  const selectedVehicleType = useMoveStore((s) => s.selectedVehicleType)
  const selectedVehicle = useMoveStore((s) => s.selectedVehicle)
  const sheetPosition = useMoveStore((s) => s.sheetPosition)
  const openDestinationModal = useMoveStore((s) => s.openDestinationModal)
  const closeDestinationModal = useMoveStore((s) => s.closeDestinationModal)
  const setDestination = useMoveStore((s) => s.setDestination)
  const selectVehicle = useMoveStore((s) => s.selectVehicle)
  const setSheetPosition = useMoveStore((s) => s.setSheetPosition)

  // TanStack Query hooks
  const { 
    data: vehicles = [], 
    isLoading: isLoadingVehicles,
    error: vehiclesError,
    refetch: refetchVehicles,
  } = useAvailableVehicles(
    selectedDestination?.coordinates || null,
    selectedVehicleType || undefined
  )

  const { data: route } = useRoute(
    currentCoordinate,
    selectedDestination?.coordinates || null
  )

  useEffect(() => {
    let isActive = true

    const resolveCurrentLocationName = async () => {
      if (!currentCoordinate) {
        setCurrentLocationName(null)
        setCurrentLocationAddress(null)
        return
      }

      try {
        const [place] = await Location.reverseGeocodeAsync(currentCoordinate)

        if (!isActive) return

        if (place) {
          const primaryName =
            place.name ||
            place.street ||
            place.district ||
            place.subregion ||
            place.city ||
            "Current location"
          const addressParts = [
            place.street,
            place.district,
            place.city,
            place.region,
            place.country,
          ].filter((part) => Boolean(part) && part !== primaryName)

          setCurrentLocationName(primaryName)
          setCurrentLocationAddress(addressParts.join(", ") || primaryName)
          return
        }
      } catch (error) {
        console.warn("Error resolving current location name:", error)
      }

      if (isActive) {
        setCurrentLocationName("Current location")
        setCurrentLocationAddress(
          `${currentCoordinate.latitude.toFixed(4)}, ${currentCoordinate.longitude.toFixed(4)}`
        )
      }
    }

    resolveCurrentLocationName()

    return () => {
      isActive = false
    }
  }, [currentCoordinate])

  // Auto-fit map viewport when route is available
  useEffect(() => {
    if (route && cameraRef.current) {
      const bounds = {
        ne: [
          Math.max(route.origin.longitude, route.destination.longitude),
          Math.max(route.origin.latitude, route.destination.latitude),
        ],
        sw: [
          Math.min(route.origin.longitude, route.destination.longitude),
          Math.min(route.origin.latitude, route.destination.latitude),
        ],
      }
      cameraRef.current?.fitBounds(bounds.ne, bounds.sw, [50, 50, 50, 50], 1000)
    }
  }, [route])

  // Property marker press handler
  const handleMarkerPress = (propertyId: number) => {
    const property = mockProperties.find((p) => p.id === propertyId)
    if (property) {
      cameraRef.current?.setCamera({
        centerCoordinate: property.coords,
        zoomLevel: MAP_CONFIG.camera.propertyDetailZoom,
        animationDuration: 900,
      })
    }
  }

  // Locate me handler
  const handleLocateMe = async () => {
    try {
      let { status } = await Location.getForegroundPermissionsAsync()
      if (status !== "granted") {
        ;({ status } = await Location.requestForegroundPermissionsAsync())
      }

      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({})
        const coordinate: Coordinates = {
          longitude: location.coords.longitude,
          latitude: location.coords.latitude,
        }
        setCurrentCoordinate(coordinate)
        cameraRef.current?.setCamera({
          centerCoordinate: [coordinate.longitude, coordinate.latitude],
          zoomLevel: MAP_CONFIG.userLocationZoom,
          animationDuration: 1000,
        })
      } else {
        // Fallback to Nairobi center
        const fallback: Coordinates = { longitude: 36.8219, latitude: -1.2921 }
        setCurrentCoordinate(fallback)
        cameraRef.current?.setCamera({
          centerCoordinate: [fallback.longitude, fallback.latitude],
          zoomLevel: 12,
          animationDuration: 1000,
        })
      }
    } catch (error) {
      console.error("Error centering map:", error)
    }
  }

  // Destination selection handler
  const handleDestinationSelect = (destination: MoveLocation, vehicleType: VehicleType) => {
    setDestination(destination, vehicleType)
    // Center map to show both current location and destination
    if (currentCoordinate && cameraRef.current) {
      const bounds = {
        ne: [
          Math.max(currentCoordinate.longitude, destination.coordinates.longitude),
          Math.max(currentCoordinate.latitude, destination.coordinates.latitude),
        ],
        sw: [
          Math.min(currentCoordinate.longitude, destination.coordinates.longitude),
          Math.min(currentCoordinate.latitude, destination.coordinates.latitude),
        ],
      }
      cameraRef.current?.fitBounds(bounds.ne, bounds.sw, [50, 50, 50, 50], 1000)
    }
  }

  // Confirm move handler
  const handleConfirmMove = () => {
    if (!selectedVehicle || !selectedDestination || !currentCoordinate) return

    // Navigate to payment screen with booking data
    router.push({
      pathname: "/payment/move-payment",
      params: {
        vehicleId: selectedVehicle.vehicleId,
        pickupLocation: JSON.stringify({
          name: currentLocationName || "Current location",
          address:
            currentLocationAddress ||
            `${currentCoordinate.latitude.toFixed(4)}, ${currentCoordinate.longitude.toFixed(4)}`,
          coordinates: currentCoordinate,
          type: "custom",
        }),
        dropoffLocation: JSON.stringify(selectedDestination),
        vehicleType: selectedVehicle.type,
        estimatedPrice: String(selectedVehicle.price),
      },
    } as never)
  }

  // Calculate layout
  const bottomInset = tabBarHeight + 8
  const availableMapHeight = Math.max(height - bottomInset, 1)
  const locateButtonBottom = bottomInset + availableMapHeight * sheetPosition + 16

  // Format current location for display
  const currentLocationDisplay = currentCoordinate
    ? currentLocationName && currentLocationAddress && currentLocationAddress !== currentLocationName
      ? `${currentLocationName} · ${currentLocationAddress}`
      : currentLocationName || currentLocationAddress || "Resolving current location..."
    : null

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      {/* Top Bar - Blue bar protecting status bar - Fixed position */}
      <View style={styles.topBar} />

      <BaseMap
        ref={mapRef}
        cameraRef={cameraRef}
        followUserLocation
        onUserLocationResolved={(coords) => {
          if (coords) {
            setCurrentCoordinate({
              longitude: coords[0],
              latitude: coords[1],
            })
          }
        }}
      >
        {/* Property Markers */}
        <PropertyMarkers onMarkerPress={handleMarkerPress} />

        {/* Driver Markers (when vehicles are available) */}
        {vehicles.length > 0 && <DriverMarkers drivers={vehicles} />}

        {/* Route Layer (when route is calculated) */}
        {route && <RouteLayer route={route} />}
      </BaseMap>

      {/* Locate Me Button */}
      <LocateMeButton onPress={handleLocateMe} bottom={locateButtonBottom} />

      {/* Move Bottom Sheet */}
      <MoveBottomSheet
        bottomInset={bottomInset}
        currentLocation={currentLocationDisplay}
        destination={selectedDestination?.name || null}
        vehicles={vehicles}
        selectedVehicleId={selectedVehicle?.id || null}
        isLoadingVehicles={isLoadingVehicles}
        vehiclesError={vehiclesError as Error | null}
        onOpenDestinationModal={openDestinationModal}
        onSelectVehicle={selectVehicle}
        onConfirmMove={handleConfirmMove}
        onSnapChange={setSheetPosition}
        onRetryVehicles={() => refetchVehicles()}
      />

      {/* Destination Modal */}
      <DestinationModal
        visible={isDestinationModalVisible}
        currentLocation={currentCoordinate}
        currentLocationLabel={currentLocationDisplay}
        onClose={closeDestinationModal}
        onSelect={handleDestinationSelect}
      />

      {/* Bottom Bar - Blue bar covering entire tab bar area - Fixed position */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarLine} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "3.5%",
    backgroundColor: "#3fbdfd",
    zIndex: 50,
  },
  // Tab bar protection
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
});
