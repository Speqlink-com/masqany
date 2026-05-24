import { MAP_CONFIG } from "@/constants/mapConfig";
import { Mapbox } from "@/components/map/mapbox";
import { useMemo } from "react";

const houseIcon = require("@/assets/icons/house-icon.webp");
const vehicleIcon = require("@/assets/icons/pickup-vehicle-icon.png");
const destinationIcon = require("@/assets/icons/pinned-location-icon.webp");

interface MoveMapLayersProps {
  currentCoordinate: [number, number] | null;
}

export function MoveMapLayers({ currentCoordinate }: MoveMapLayersProps) {
  const origin = currentCoordinate ?? MAP_CONFIG.center;

  const routeShape = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: {},
          geometry: {
            type: "LineString" as const,
            coordinates: [
              origin,
              [origin[0] + 0.006, origin[1] - 0.004],
              [origin[0] + 0.015, origin[1] - 0.01],
              [origin[0] + 0.026, origin[1] - 0.016],
            ],
          },
        },
      ],
    }),
    [origin]
  );

  const driverShape = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: {},
          geometry: {
            type: "Point" as const,
            coordinates: [origin[0] + 0.006, origin[1] - 0.004],
          },
        },
      ],
    }),
    [origin]
  );

  const destinationShape = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: {},
          geometry: {
            type: "Point" as const,
            coordinates: [origin[0] + 0.026, origin[1] - 0.016],
          },
        },
      ],
    }),
    [origin]
  );

  if (!Mapbox) {
    return null;
  }

  return (
    <>
      <Mapbox.Images
        images={{
          "house-icon": houseIcon,
          "pickup-vehicle": vehicleIcon,
          "destination-pin": destinationIcon,
        }}
      />

      <Mapbox.ShapeSource id="move-route" shape={routeShape}>
        <Mapbox.LineLayer
          id="move-route-line"
          style={{
            lineColor: MAP_CONFIG.colors.property,
            lineWidth: 5,
            lineOpacity: 0.9,
            lineCap: "round",
            lineJoin: "round",
          }}
        />
      </Mapbox.ShapeSource>

      <Mapbox.ShapeSource id="move-driver" shape={driverShape}>
        <Mapbox.CircleLayer
          id="move-driver-halo"
          style={{
            circleColor: "#ffffff",
            circleRadius: 19,
            circleOpacity: 0.95,
            circleStrokeColor: MAP_CONFIG.colors.property,
            circleStrokeWidth: 2,
          }}
        />
        <Mapbox.SymbolLayer
          id="move-driver-icon"
          style={{
            iconImage: "pickup-vehicle",
            iconSize: 0.12,
            iconAllowOverlap: true,
            iconIgnorePlacement: true,
          }}
        />
      </Mapbox.ShapeSource>

      <Mapbox.ShapeSource id="move-destination" shape={destinationShape}>
        <Mapbox.SymbolLayer
          id="move-destination-icon"
          style={{
            iconImage: "destination-pin",
            iconSize: 0.18,
            iconAnchor: "bottom",
            iconAllowOverlap: true,
            iconIgnorePlacement: true,
          }}
        />
      </Mapbox.ShapeSource>
    </>
  );
}
