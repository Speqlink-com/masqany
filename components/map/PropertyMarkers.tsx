/**
 * PropertyMarkers Component
 * 
 * Displays property markers with custom house icon
 * Uses blue color for properties
 */

import { MAP_CONFIG } from "@/constants/mapConfig";
import { mockProperties, toGeoJSON } from "@/constants/mockProperties";
import { Mapbox } from "@/components/map/mapbox";
import React from "react";

interface PropertyMarkersProps {
  onMarkerPress?: (propertyId: number) => void;
}

export function PropertyMarkers({ onMarkerPress }: PropertyMarkersProps) {
  const geojson = toGeoJSON(mockProperties.filter((property) => property.vacant));

  const handlePress = (event: any) => {
    const feature = event.features[0];
    if (feature && feature.properties && !feature.properties.cluster) {
      onMarkerPress?.(feature.properties.id);
    }
  };

  if (!Mapbox) {
    return null;
  }

  return (
    <Mapbox.ShapeSource
      id="properties"
      shape={geojson}
      cluster={true}
      clusterRadius={MAP_CONFIG.cluster.radius}
      clusterMaxZoomLevel={MAP_CONFIG.cluster.maxZoom}
      onPress={handlePress}
    >
      {/* Cluster circles - Blue */}
      <Mapbox.CircleLayer
        id="clusters"
        filter={["has", "point_count"]}
        style={{
          circleColor: MAP_CONFIG.colors.property,
          circleRadius: [
            "step",
            ["get", "point_count"],
            20, // radius for count < 10
            10, 30, // radius for count >= 10
            20, 40, // radius for count >= 20
          ],
          circleOpacity: 0.9,
          circleStrokeWidth: 2,
          circleStrokeColor: "#ffffff",
        }}
      />

      {/* Cluster count text */}
      <Mapbox.SymbolLayer
        id="cluster-count"
        filter={["has", "point_count"]}
        style={{
          textField: ["get", "point_count"],
          textSize: 14,
          textColor: "#ffffff",
          textFont: ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        }}
      />

      {/* Individual property markers with custom icon */}
      <Mapbox.CircleLayer
        id="property-status-rings"
        filter={["!", ["has", "point_count"]]}
        style={{
          circleColor: [
            "case",
            ["==", ["get", "vacant"], true],
            MAP_CONFIG.colors.propertyVacant,
            MAP_CONFIG.colors.propertyOccupied,
          ],
          circleRadius: 16,
          circleOpacity: 0.95,
          circleStrokeWidth: 2,
          circleStrokeColor: "#ffffff",
        }}
      />

      <Mapbox.SymbolLayer
        id="unclustered-point"
        filter={["!", ["has", "point_count"]]}
        style={{
          iconImage: "house-icon",
          iconSize: 0.16,
          iconAllowOverlap: true,
          iconIgnorePlacement: false,
        }}
      />

      {/* Property price labels - Blue text */}
      <Mapbox.SymbolLayer
        id="property-labels"
        filter={["!", ["has", "point_count"]]}
        style={{
          textField: ["concat", "KES ", ["get", "price"]],
          textSize: 11,
          textColor: MAP_CONFIG.colors.property,
          textHaloColor: "#ffffff",
          textHaloWidth: 1,
          textOffset: [0, 1.5],
          textFont: ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        }}
      />
    </Mapbox.ShapeSource>
  );
}
