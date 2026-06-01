/**
 * DriverMarkers Component
 * Displays driver location markers for available vehicles on map
 * Uses NativeWind styling for marker containers
 */

import type { AvailableVehicle } from "@/modules/move/types"
import { Mapbox } from "@/components/map/mapbox"
import React from "react"
import { Image, View } from "react-native"

interface DriverMarkersProps {
  drivers: AvailableVehicle[]
  onMarkerPress?: (driver: AvailableVehicle) => void
}

export function DriverMarkers({ drivers, onMarkerPress }: DriverMarkersProps) {
  if (!Mapbox) return null
  if (!drivers || drivers.length === 0) return null

  return (
    <>
      {drivers.map((driver) => {
        const vehicleIcon = {
          pickup: require("@/assets/icons/pickup-vehicle-icon.png"),
          mini_truck: require("@/assets/icons/i-truck-icon.webp"),
          truck: require("@/assets/icons/vehicle-icon.webp"),
        }[driver.type]

        return (
          <Mapbox.PointAnnotation
            key={driver.id}
            id={`driver-${driver.id}`}
            coordinate={[driver.currentLocation.longitude, driver.currentLocation.latitude]}
            onSelected={() => onMarkerPress?.(driver)}
          >
            <View className="w-12 h-12 items-center justify-center bg-primary-700 rounded-full shadow-lg">
              <Image source={vehicleIcon} className="w-7 h-7" resizeMode="contain" />
            </View>
          </Mapbox.PointAnnotation>
        )
      })}
    </>
  )
}
