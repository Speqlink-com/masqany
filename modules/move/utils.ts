/**
 * Move Module - Utility Functions
 * Distance calculations, coordinate validation, and route helpers
 */

import type { Coordinates, DistanceMarker, RouteGeometry } from "./types"

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param coord1 First coordinate
 * @param coord2 Second coordinate
 * @returns Distance in kilometers
 */
export function haversineDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(coord2.latitude - coord1.latitude)
  const dLon = toRad(coord2.longitude - coord1.longitude)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.latitude)) *
      Math.cos(toRad(coord2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Convert degrees to radians
 */
function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Calculate distance markers along a route
 * @param geometry Route geometry
 * @param intervalKm Interval between markers in kilometers (default: 1)
 * @returns Array of distance markers
 */
export function calculateDistanceMarkers(
  geometry: RouteGeometry,
  intervalKm: number = 1
): DistanceMarker[] {
  const markers: DistanceMarker[] = []
  let accumulatedDistance = 0
  let nextMarkerDistance = intervalKm

  for (let i = 1; i < geometry.coordinates.length; i++) {
    const [lon1, lat1] = geometry.coordinates[i - 1]
    const [lon2, lat2] = geometry.coordinates[i]

    const segmentDistance = haversineDistance(
      { latitude: lat1, longitude: lon1 },
      { latitude: lat2, longitude: lon2 }
    )

    accumulatedDistance += segmentDistance

    if (accumulatedDistance >= nextMarkerDistance) {
      markers.push({
        coordinate: [lon2, lat2],
        distance: nextMarkerDistance,
      })
      nextMarkerDistance += intervalKm
    }
  }

  return markers
}

/**
 * Validate coordinates are within valid ranges
 * @param coords Coordinates to validate
 * @returns True if valid
 */
export function validateCoordinates(coords: Coordinates): boolean {
  return (
    coords.latitude >= -90 &&
    coords.latitude <= 90 &&
    coords.longitude >= -180 &&
    coords.longitude <= 180
  )
}

/**
 * Check if coordinates are within Kenya bounds
 * @param coords Coordinates to check
 * @returns True if within Kenya
 */
export function isInKenya(coords: Coordinates): boolean {
  return (
    coords.latitude >= -4.68 &&
    coords.latitude <= 5.03 &&
    coords.longitude >= 33.91 &&
    coords.longitude <= 41.91
  )
}
