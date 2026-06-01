/**
 * Location Tracking Hook
 * Provides real-time GPS location tracking with permissions handling
 * Uses balanced accuracy for battery efficiency
 */

import * as Location from "expo-location";
import { useEffect, useState } from "react";

export interface LocationState {
  coordinates: { longitude: number; latitude: number } | null
  accuracy: number | null
  error: string | null
  permissionGranted: boolean
  isLoading: boolean
}

const NAIROBI_CENTER = { longitude: 36.8219, latitude: -1.2921 }
const UPDATE_INTERVAL = 5000 // 5 seconds

/**
 * Custom hook for real-time location tracking
 * @param enabled - Whether to actively track location
 * @returns Location state with coordinates, accuracy, error, and permission status
 */
export function useLocationTracking(enabled: boolean = true): LocationState {
  const [state, setState] = useState<LocationState>({
    coordinates: null,
    accuracy: null,
    error: null,
    permissionGranted: false,
    isLoading: true,
  })

  useEffect(() => {
    if (!enabled) {
      setState((prev) => ({ ...prev, isLoading: false }))
      return
    }

    let locationSubscription: Location.LocationSubscription | null = null
    let isMounted = true

    const startTracking = async () => {
      try {
        // Request foreground permissions
        let { status } = await Location.getForegroundPermissionsAsync()
        
        if (status !== "granted") {
          const { status: newStatus } = await Location.requestForegroundPermissionsAsync()
          status = newStatus
        }

        if (status !== "granted") {
          // Permission denied - use fallback
          if (isMounted) {
            setState({
              coordinates: NAIROBI_CENTER,
              accuracy: null,
              error: "Location permission denied. Using default location.",
              permissionGranted: false,
              isLoading: false,
            })
          }
          return
        }

        // Permission granted - start tracking
        if (isMounted) {
          setState((prev) => ({ ...prev, permissionGranted: true }))
        }

        // Get initial location
        const initialLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        })

        if (isMounted) {
          setState({
            coordinates: {
              longitude: initialLocation.coords.longitude,
              latitude: initialLocation.coords.latitude,
            },
            accuracy: initialLocation.coords.accuracy,
            error: null,
            permissionGranted: true,
            isLoading: false,
          })
        }

        // Start watching location updates
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: UPDATE_INTERVAL,
            distanceInterval: 10, // Update if moved 10 meters
          },
          (location) => {
            if (isMounted) {
              setState({
                coordinates: {
                  longitude: location.coords.longitude,
                  latitude: location.coords.latitude,
                },
                accuracy: location.coords.accuracy,
                error: null,
                permissionGranted: true,
                isLoading: false,
              })
            }
          }
        )
      } catch (error: any) {
        console.error("Location tracking error:", error)
        if (isMounted) {
          setState({
            coordinates: NAIROBI_CENTER,
            accuracy: null,
            error: error?.message || "Failed to get location",
            permissionGranted: false,
            isLoading: false,
          })
        }
      }
    }

    startTracking()

    // Cleanup
    return () => {
      isMounted = false
      if (locationSubscription) {
        locationSubscription.remove()
      }
    }
  }, [enabled])

  return state
}

/**
 * Check if location permissions are granted
 */
export async function checkLocationPermission(): Promise<boolean> {
  const { status } = await Location.getForegroundPermissionsAsync()
  return status === "granted"
}

/**
 * Request location permissions
 */
export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync()
  return status === "granted"
}
