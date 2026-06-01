/**
 * RouteLayer Component
 * Renders route geometry on map with blue lines and distance markers
 * Uses StyleSheet ONLY for Mapbox layer styles (required by Mapbox)
 * Uses NativeWind for distance marker containers
 */

import { colors } from "@/constants/tokens"
import type { Route } from "@/modules/move/types"
import { Mapbox } from "@/components/map/mapbox"
import React from "react"
import { StyleSheet, Text, View } from "react-native"

interface RouteLayerProps {
  route: Route | null
  color?: string
  showDistanceMarkers?: boolean
}

export function RouteLayer({
  route,
  color = colors.primary[700], // #20A6FD
  showDistanceMarkers = true,
}: RouteLayerProps) {
  if (!Mapbox) return null
  if (!route) return null

  const routeGeoJSON = {
    type: "Feature" as const,
    geometry: route.geometry,
    properties: {},
  }

  return (
    <>
      {/* Route Line */}
      <Mapbox.ShapeSource id="route-source" shape={routeGeoJSON}>
        <Mapbox.LineLayer
          id="route-line"
          style={styles.routeLine}
          layerIndex={100}
        />
      </Mapbox.ShapeSource>

      {/* Distance Markers */}
      {showDistanceMarkers &&
        route.distanceMarkers.map((marker, index) => (
          <Mapbox.PointAnnotation
            key={`marker-${index}`}
            id={`distance-marker-${index}`}
            coordinate={marker.coordinate}
          >
            <View className="bg-white px-2 py-1 rounded-full shadow-md">
              <Text className="text-xs font-semibold text-dark-400">
                {marker.distance.toFixed(1)}km
              </Text>
            </View>
          </Mapbox.PointAnnotation>
        ))}

      {/* Cached Route Indicator */}
      {route.cachedAt && (
        <Mapbox.PointAnnotation
          id="cached-indicator"
          coordinate={[route.origin.longitude, route.origin.latitude]}
        >
          <View className="absolute -top-8 -right-8 bg-yellow-500 px-2 py-1 rounded-full">
            <Text className="text-xs text-white font-semibold">Cached</Text>
          </View>
        </Mapbox.PointAnnotation>
      )}
    </>
  )
}

// StyleSheet ONLY for Mapbox layer styles (required by Mapbox API)
const styles = StyleSheet.create({
  routeLine: {
    lineColor: colors.primary[700], // #20A6FD
    lineWidth: 4,
    lineCap: "round",
    lineJoin: "round",
  },
})
