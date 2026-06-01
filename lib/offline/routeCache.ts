/**
 * Offline Route Caching
 * Caches calculated routes using AsyncStorage with LRU eviction
 * Enables offline route viewing and reduces API calls
 */

import type { Route } from "@/modules/move"
import AsyncStorage from "@react-native-async-storage/async-storage"

const CACHE_KEY = "@masqany:route_cache"
const MAX_ROUTES = 50 // Maximum number of cached routes
const CACHE_VERSION = 1

interface CachedRoute extends Route {
  cachedAt: string
  cacheKey: string
  lastAccessedAt: string
}

interface RouteCache {
  version: number
  routes: CachedRoute[]
}

/**
 * Generates a cache key from origin and destination coordinates
 */
function generateCacheKey(
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number }
): string {
  // Round to 4 decimal places (~11m precision) to allow cache hits for nearby locations
  const oLat = origin.latitude.toFixed(4)
  const oLng = origin.longitude.toFixed(4)
  const dLat = destination.latitude.toFixed(4)
  const dLng = destination.longitude.toFixed(4)

  return `${oLat},${oLng}:${dLat},${dLng}`
}

/**
 * Loads the route cache from AsyncStorage
 */
async function loadCache(): Promise<RouteCache> {
  try {
    const data = await AsyncStorage.getItem(CACHE_KEY)
    if (!data) {
      return { version: CACHE_VERSION, routes: [] }
    }

    const cache: RouteCache = JSON.parse(data)

    // Validate cache version
    if (cache.version !== CACHE_VERSION) {
      console.log("Route cache version mismatch, clearing cache")
      return { version: CACHE_VERSION, routes: [] }
    }

    return cache
  } catch (error) {
    console.error("Failed to load route cache:", error)
    return { version: CACHE_VERSION, routes: [] }
  }
}

/**
 * Saves the route cache to AsyncStorage
 */
async function saveCache(cache: RouteCache): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch (error) {
    console.error("Failed to save route cache:", error)
  }
}

/**
 * Saves a route to the cache
 * Implements LRU eviction when cache exceeds MAX_ROUTES
 */
export async function saveRoute(route: Route): Promise<void> {
  try {
    const cache = await loadCache()
    const cacheKey = generateCacheKey(route.origin, route.destination)
    const now = new Date().toISOString()

    // Check if route already exists
    const existingIndex = cache.routes.findIndex((r) => r.cacheKey === cacheKey)

    const cachedRoute: CachedRoute = {
      ...route,
      cachedAt: existingIndex >= 0 ? cache.routes[existingIndex].cachedAt : now,
      cacheKey,
      lastAccessedAt: now,
    }

    if (existingIndex >= 0) {
      // Update existing route
      cache.routes[existingIndex] = cachedRoute
    } else {
      // Add new route
      cache.routes.push(cachedRoute)

      // Implement LRU eviction if cache is full
      if (cache.routes.length > MAX_ROUTES) {
        // Sort by lastAccessedAt (oldest first)
        cache.routes.sort(
          (a, b) => new Date(a.lastAccessedAt).getTime() - new Date(b.lastAccessedAt).getTime()
        )
        // Remove oldest route
        cache.routes.shift()
      }
    }

    await saveCache(cache)
  } catch (error) {
    console.error("Failed to save route to cache:", error)
  }
}

/**
 * Finds a cached route matching the origin and destination
 * Updates lastAccessedAt for LRU tracking
 */
export async function findRoute(
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number }
): Promise<CachedRoute | null> {
  try {
    const cache = await loadCache()
    const cacheKey = generateCacheKey(origin, destination)

    const routeIndex = cache.routes.findIndex((r) => r.cacheKey === cacheKey)

    if (routeIndex >= 0) {
      // Update lastAccessedAt for LRU
      cache.routes[routeIndex].lastAccessedAt = new Date().toISOString()
      await saveCache(cache)

      return cache.routes[routeIndex]
    }

    return null
  } catch (error) {
    console.error("Failed to find cached route:", error)
    return null
  }
}

/**
 * Gets all cached routes
 * Sorted by lastAccessedAt (most recent first)
 */
export async function getAllRoutes(): Promise<CachedRoute[]> {
  try {
    const cache = await loadCache()
    // Sort by lastAccessedAt (most recent first)
    return cache.routes.sort(
      (a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime()
    )
  } catch (error) {
    console.error("Failed to get all cached routes:", error)
    return []
  }
}

/**
 * Clears all cached routes
 */
export async function clearCache(): Promise<void> {
  try {
    await AsyncStorage.removeItem(CACHE_KEY)
  } catch (error) {
    console.error("Failed to clear route cache:", error)
  }
}

/**
 * Gets cache statistics
 */
export async function getCacheStats(): Promise<{
  totalRoutes: number
  oldestRoute: string | null
  newestRoute: string | null
  cacheSize: number
}> {
  try {
    const cache = await loadCache()
    const data = await AsyncStorage.getItem(CACHE_KEY)
    const cacheSize = data ? new Blob([data]).size : 0

    if (cache.routes.length === 0) {
      return {
        totalRoutes: 0,
        oldestRoute: null,
        newestRoute: null,
        cacheSize,
      }
    }

    const sorted = [...cache.routes].sort(
      (a, b) => new Date(a.cachedAt).getTime() - new Date(b.cachedAt).getTime()
    )

    return {
      totalRoutes: cache.routes.length,
      oldestRoute: sorted[0].cachedAt,
      newestRoute: sorted[sorted.length - 1].cachedAt,
      cacheSize,
    }
  } catch (error) {
    console.error("Failed to get cache stats:", error)
    return {
      totalRoutes: 0,
      oldestRoute: null,
      newestRoute: null,
      cacheSize: 0,
    }
  }
}
