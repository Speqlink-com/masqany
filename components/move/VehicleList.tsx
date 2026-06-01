/**
 * VehicleList Component
 * Displays available vehicles with pricing and ETA
 * Uses NativeWind styling exclusively
 */

import type { AvailableVehicle } from "@/modules/move/types"
import { LinearGradient } from "expo-linear-gradient"
import React, { memo } from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface VehicleListProps {
  vehicles: AvailableVehicle[]
  selectedVehicleId: string | null
  onSelect: (vehicle: AvailableVehicle) => void
  isLoading?: boolean
  error?: Error | null
  onRetry?: () => void
}

export function VehicleList({ vehicles, selectedVehicleId, onSelect, isLoading, error, onRetry }: VehicleListProps) {
  if (isLoading) {
    return <VehicleListSkeleton />
  }

  if (error) {
    return <VehicleListError error={error} onRetry={onRetry} />
  }

  if (vehicles.length === 0) {
    return <EmptyVehicleList />
  }

  return (
    <View className="py-2">
      {vehicles.map((item) => (
        <VehicleCard
          key={item.id}
          vehicle={item}
          selected={item.id === selectedVehicleId}
          onPress={() => onSelect(item)}
        />
      ))}
    </View>
  )
}

// ============================================================================
// Vehicle Card Component (Memoized for performance)
// ============================================================================

interface VehicleCardProps {
  vehicle: AvailableVehicle
  selected: boolean
  onPress: () => void
}

const VehicleCard = memo<VehicleCardProps>(
  ({ vehicle, selected, onPress }) => {
    const vehicleTypeLabel = {
      pickup: "Pickup Truck",
      mini_truck: "Mini Truck",
      truck: "Large Truck",
    }[vehicle.type]

    const vehicleIcon = {
      pickup: require("@/assets/icons/pickup-vehicle-icon.png"),
      mini_truck: require("@/assets/icons/i-truck-icon.webp"),
      truck: require("@/assets/icons/vehicle-icon.webp"),
    }[vehicle.type]
    const gradientColors = {
      pickup: ["#CDFFD8", "#94B9FF"],
      mini_truck: ["#F8FAFC", "#EAF7FF"],
      truck: ["#00CED1", "#004AAD"],
    }[vehicle.type]
    const isDarkCard = vehicle.type === "truck"

    return (
      <TouchableOpacity
        onPress={onPress}
        className={`mx-5 my-2 rounded-[28px] border ${
          selected ? "border-primary-700" : "border-gray-100"
        }`}
        style={{
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: selected ? 0.14 : 0.06,
          shadowRadius: selected ? 14 : 10,
          elevation: selected ? 5 : 2,
        }}
        activeOpacity={0.7}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`${vehicleTypeLabel}, ${vehicle.price} ${vehicle.currency}, arrives in ${vehicle.estimatedArrival} minutes`}
        accessibilityState={{ selected }}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.vehicleGradient}
        >
          <View className="flex-row items-center flex-1">
            <View
              className={`w-12 h-12 items-center justify-center rounded-full mr-3 ${
                isDarkCard ? "bg-white/20" : "bg-white/70"
              }`}
            >
              <Image source={vehicleIcon} className="w-8 h-8" resizeMode="contain" />
            </View>
            <View className="flex-1">
              <Text
                className={`text-lg font-semibold ${
                  isDarkCard ? "text-white" : "text-dark-400"
                }`}
              >
                {vehicleTypeLabel}
              </Text>
              <Text className={`text-sm mt-1 ${isDarkCard ? "text-white/80" : "text-gray-600"}`}>
                {vehicle.distance.toFixed(1)} km away
              </Text>
            </View>
          </View>
          <View className="items-end">
            <Text
              className={`text-xl font-extrabold ${
                isDarkCard ? "text-white" : "text-primary-700"
              }`}
            >
              {vehicle.currency} {vehicle.price.toLocaleString()}
            </Text>
            <Text className={`text-sm mt-1 ${isDarkCard ? "text-white/80" : "text-gray-600"}`}>
              Arrives in {vehicle.estimatedArrival} min
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    )
  },
  (prev, next) => prev.vehicle.id === next.vehicle.id && prev.selected === next.selected
)

VehicleCard.displayName = "VehicleCard"

// ============================================================================
// Loading Skeleton
// ============================================================================

function VehicleListSkeleton() {
  return (
    <View className="flex-1">
      {[1, 2, 3].map((i) => (
        <View key={i} className="h-24 bg-gray-200 rounded-[28px] mx-5 my-2 animate-pulse" />
      ))}
    </View>
  )
}

// ============================================================================
// Empty State
// ============================================================================

function EmptyVehicleList() {
  return (
    <View className="flex-1 items-center justify-center px-6 py-12">
      <Image
        source={require("@/assets/icons/vehicle-icon.webp")}
        className="w-20 h-20 opacity-30 mb-4"
        resizeMode="contain"
      />
      <Text className="text-lg font-semibold text-dark-400 mb-2">No vehicles available</Text>
      <Text className="text-sm text-gray-600 text-center">
        No vehicles available in your area right now. Please try again later.
      </Text>
    </View>
  )
}

// ============================================================================
// Error State
// ============================================================================

interface VehicleListErrorProps {
  error: Error
  onRetry?: () => void
}

function VehicleListError({ error, onRetry }: VehicleListErrorProps) {
  return (
    <View className="flex-1 items-center justify-center px-6 py-12">
      <Image
        source={require("@/assets/icons/i-alert-icon.webp")}
        className="w-20 h-20 opacity-30 mb-4"
        resizeMode="contain"
      />
      <Text className="text-lg font-semibold text-dark-400 mb-2">Failed to load vehicles</Text>
      <Text className="text-sm text-gray-600 text-center mb-6">
        {error.message || "Something went wrong. Please try again."}
      </Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          className="bg-primary-700 px-7 py-3 rounded-full"
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  vehicleGradient: {
    minHeight: 92,
    padding: 16,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },
})
