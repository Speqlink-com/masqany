/**
 * Map Configuration
 * 
 * Map settings for the Move experience.
 */

export const MAP_CONFIG = {
  // Kenya center coordinates [longitude, latitude]
  center: [36.8219, -1.2921] as [number, number], // Nairobi center
  
  // Default zoom level (higher = more zoomed in)
  zoom: 12,
  
  // User location zoom
  userLocationZoom: 15,
  
  // Kenya bounds [SW, NE]
  bounds: {
    sw: [33.5, -5.5] as [number, number], // Southwest Kenya
    ne: [42.0, 5.5] as [number, number],  // Northeast Kenya
  },
  
  // White Mapbox style for the Bolt-like map treatment.
  style: "mapbox://styles/mapbox/light-v11",
  
  // Cluster configuration
  cluster: {
    radius: 50,
    maxZoom: 14,
  },
  
  // Camera settings
  camera: {
    followUserZoom: 15,
    propertyDetailZoom: 16,
    minZoom: 5,
    maxZoom: 20,
  },
  
  // Colors
  colors: {
    property: "#20A6FD", // Blue for properties
    propertyVacant: "#22C55E", // Green for vacant
    propertyOccupied: "#F75555", // Red for occupied
    road: "#97a1a5", // Gray for roads
  },
} as const;
