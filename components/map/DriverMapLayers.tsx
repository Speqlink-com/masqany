import { Mapbox } from "@/components/map/mapbox";
import { MAP_CONFIG } from "@/constants/mapConfig";

const LAND_USE_COLOR = [
  "match",
  ["get", "class"],
  "park",
  "#DDEFD8",
  "grass",
  "#E5F4DD",
  "wood",
  "#D1E9D2",
  "hospital",
  "#F4E1E4",
  "school",
  "#F3EBD4",
  "industrial",
  "#E7EAEE",
  "commercial",
  "#EEE7D7",
  "#F7F8F6",
] as const;

const BUILDING_HEIGHT = [
  "interpolate",
  ["linear"],
  ["zoom"],
  14,
  0,
  16,
  ["*", ["coalesce", ["get", "height"], 14], 0.5],
] as const;

const BUILDING_BASE = ["coalesce", ["get", "min_height"], 0] as const;

const POI_FILTER = [
  "any",
  [
    "in",
    ["get", "maki"],
    [
      "literal",
      [
        "college",
        "grocery",
        "hospital",
        "religious-christian",
        "religious-muslim",
        "restaurant",
        "shop",
      ],
    ],
  ],
  [
    "in",
    ["get", "class"],
    ["literal", ["commercial", "grocery", "hospital", "religion", "shop"]],
  ],
] as const;

const POI_ICON_IMAGE = [
  "match",
  ["get", "maki"],
  "hospital",
  "hospital-15",
  "grocery",
  "grocery-15",
  "shop",
  "shop-15",
  "restaurant",
  "restaurant-15",
  "college",
  "college-15",
  "religious-christian",
  "religious-christian-15",
  "religious-muslim",
  "religious-muslim-15",
  "marker-15",
] as const;

const POI_MARKER_COLOR = [
  "match",
  ["get", "maki"],
  "hospital",
  "#EF4444",
  "grocery",
  "#0EA5E9",
  "shop",
  "#0EA5E9",
  "restaurant",
  "#F97316",
  "college",
  "#64748B",
  "religious-christian",
  "#8B5CF6",
  "religious-muslim",
  "#14B8A6",
  "#0EA5E9",
] as const;

const POI_TEXT_COLOR = [
  "match",
  ["get", "maki"],
  "hospital",
  "#DC2626",
  "fuel",
  "#EA580C",
  "grocery",
  "#16A34A",
  "restaurant",
  "#B45309",
  "shop",
  "#7C3AED",
  "college",
  "#2563EB",
  "bus",
  "#0891B2",
  "airport",
  "#0F766E",
  "religious-christian",
  "#7C3AED",
  "religious-muslim",
  "#0F766E",
  "#0284C7",
] as const;

export function DriverMapLayers() {
  if (!Mapbox) {
    return null;
  }

  return (
    <Mapbox.VectorSource id="composite" existing>
      <Mapbox.SymbolLayer
        id="poi-label"
        existing
        style={{ visibility: "none" } as any}
      />

      <Mapbox.SymbolLayer
        id="building-number-label"
        existing
        style={{ visibility: "none" } as any}
      />

      <Mapbox.FillLayer
        id="driver-land-use-context"
        sourceLayerID="landuse"
        minZoomLevel={9}
        maxZoomLevel={20}
        style={
          {
            fillColor: LAND_USE_COLOR,
            fillOpacity: [
              "interpolate",
              ["linear"],
              ["zoom"],
              9,
              0.2,
              14,
              0.42,
            ],
          } as any
        }
      />

      <Mapbox.LineLayer
        id="driver-service-roads"
        sourceLayerID="road"
        minZoomLevel={13}
        maxZoomLevel={20}
        filter={["==", ["get", "class"], "service"] as any}
        style={
          {
            lineColor: "#D9DEE6",
            lineOpacity: 0.72,
            lineWidth: ["interpolate", ["linear"], ["zoom"], 13, 0.5, 18, 3],
            lineCap: "round",
            lineJoin: "round",
          } as any
        }
      />

      <Mapbox.LineLayer
        id="driver-residential-roads"
        sourceLayerID="road"
        minZoomLevel={12}
        maxZoomLevel={20}
        filter={["==", ["get", "class"], "street"] as any}
        style={
          {
            lineColor: "#C8D0DA",
            lineOpacity: 0.78,
            lineWidth: ["interpolate", ["linear"], ["zoom"], 12, 0.8, 18, 4],
            lineCap: "round",
            lineJoin: "round",
          } as any
        }
      />

      <Mapbox.LineLayer
        id="driver-secondary-roads"
        sourceLayerID="road"
        minZoomLevel={10}
        maxZoomLevel={20}
        filter={
          [
            "in",
            ["get", "class"],
            ["literal", ["secondary", "tertiary"]],
          ] as any
        }
        style={
          {
            lineColor: "#AAB6C5",
            lineOpacity: 0.86,
            lineWidth: ["interpolate", ["linear"], ["zoom"], 10, 1.2, 16, 5],
            lineCap: "round",
            lineJoin: "round",
          } as any
        }
      />

      <Mapbox.LineLayer
        id="driver-primary-roads"
        sourceLayerID="road"
        minZoomLevel={8}
        maxZoomLevel={20}
        filter={
          [
            "in",
            ["get", "class"],
            ["literal", ["motorway", "trunk", "primary"]],
          ] as any
        }
        style={
          {
            lineColor: MAP_CONFIG.colors.property,
            lineOpacity: [
              "interpolate",
              ["linear"],
              ["zoom"],
              8,
              0.42,
              14,
              0.74,
            ],
            lineWidth: ["interpolate", ["linear"], ["zoom"], 8, 1.4, 16, 7],
            lineCap: "round",
            lineJoin: "round",
          } as any
        }
      />

      <Mapbox.SymbolLayer
        id="driver-city-labels"
        sourceLayerID="place_label"
        minZoomLevel={7}
        maxZoomLevel={12}
        filter={["in", ["get", "type"], ["literal", ["city", "town"]]] as any}
        style={
          {
            textField: ["get", "name"],
            textColor: "#0F766E",
            textSize: ["interpolate", ["linear"], ["zoom"], 7, 12, 12, 16],
            textHaloColor: "#FFFFFF",
            textHaloWidth: 1.2,
            textAllowOverlap: false,
          } as any
        }
      />

      <Mapbox.SymbolLayer
        id="driver-neighborhood-labels"
        sourceLayerID="place_label"
        minZoomLevel={11}
        maxZoomLevel={15}
        filter={
          ["in", ["get", "type"], ["literal", ["neighborhood", "suburb"]]] as any
        }
        style={
          {
            textField: ["get", "name"],
            textColor: "#2563EB",
            textSize: ["interpolate", ["linear"], ["zoom"], 11, 11, 15, 14],
            textHaloColor: "#FFFFFF",
            textHaloWidth: 1,
            textAllowOverlap: false,
          } as any
        }
      />

      <Mapbox.CircleLayer
        id="driver-poi-marker-bubbles"
        sourceLayerID="poi_label"
        minZoomLevel={14}
        maxZoomLevel={20}
        filter={POI_FILTER as any}
        style={
          {
            circleColor: POI_MARKER_COLOR,
            circleRadius: ["interpolate", ["linear"], ["zoom"], 14, 14, 18, 18],
            circleStrokeColor: "#FFFFFF",
            circleStrokeOpacity: 0.96,
            circleStrokeWidth: 3,
            circleOpacity: 0.96,
          } as any
        }
      />

      <Mapbox.SymbolLayer
        id="driver-poi-labels"
        sourceLayerID="poi_label"
        minZoomLevel={14}
        maxZoomLevel={20}
        filter={POI_FILTER as any}
        style={
          {
            iconImage: POI_ICON_IMAGE,
            iconColor: "#FFFFFF",
            iconSize: ["interpolate", ["linear"], ["zoom"], 14, 0.92, 18, 1.08],
            iconAllowOverlap: true,
            iconIgnorePlacement: true,
            textField: ["get", "name"],
            textColor: POI_TEXT_COLOR,
            textSize: ["interpolate", ["linear"], ["zoom"], 14, 12, 18, 14],
            textOffset: [1.15, 0],
            textAnchor: "left",
            textHaloColor: "#FFFFFF",
            textHaloWidth: 1.4,
            textAllowOverlap: false,
            textOptional: true,
          } as any
        }
      />

      <Mapbox.FillExtrusionLayer
        id="driver-3d-buildings"
        sourceLayerID="building"
        minZoomLevel={15}
        maxZoomLevel={20}
        filter={["==", ["get", "extrude"], "true"] as any}
        style={
          {
            fillExtrusionColor: "#D8DEE7",
            fillExtrusionHeight: BUILDING_HEIGHT,
            fillExtrusionBase: BUILDING_BASE,
            fillExtrusionOpacity: 0.32,
            fillExtrusionVerticalGradient: true,
          } as any
        }
      />
    </Mapbox.VectorSource>
  );
}
