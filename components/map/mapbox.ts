import type MapboxModule from "@rnmapbox/maps";

type MapboxType = typeof MapboxModule;

let Mapbox: MapboxType | null = null;
let mapboxLoadError: unknown = null;

try {
  // RNMapbox throws at require-time in Expo Go, so this must stay guarded.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mapboxModule = require("@rnmapbox/maps");
  Mapbox = mapboxModule.default ?? mapboxModule;
  Mapbox?.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN || "");
} catch (error) {
  mapboxLoadError = error;
}

export { Mapbox, mapboxLoadError };

export const isMapboxAvailable = Mapbox !== null;

export const mapboxUnavailableMessage =
  "@rnmapbox/maps native code is not available in this runtime. Use a development build or EAS build to render the map.";
