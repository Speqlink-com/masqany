# Move Map Implementation

Implemented the Move tab as a build-ready RNMapbox map experience that follows the map implementation guide.

## What changed

- `app/(tabs)/move.tsx` now renders Mapbox as the base layer, centers on the user's current location after permission, and keeps a Locate Me control above the active bottom sheet.
- `constants/mapConfig.ts` now uses `mapbox://styles/mapbox/light-v11` for the clean white map style requested in the guide.
- `components/map/MoveMapLayers.tsx` registers local map icons from `assets/icons`, renders a dummy route line, a pickup vehicle marker, and a destination pin until the backend is ready.
- `components/map/PropertyMarkers.tsx` keeps clustered property rendering and now relies on `Mapbox.Images` registration for the house icon.
- `components/map/MoveBottomSheet.tsx` adds the rounded Reanimated sheet over the map with 70%, 50%, and 30% snap positions within the usable area above the tab bar. It uses FlashList for the property cards as recommended by the guide.
- `app/(tabs)/_layout.tsx` gives the Move tab a visible active icon from `assets/icons/active-move.png`.
- `app/_layout.tsx` now loads the Nunito font weights used by the map and tab UI, avoiding missing font warnings.
- `app.json` uses the RNMapbox plugin without embedding the deprecated download-token option. The download token is loaded from `RNMAPBOX_MAPS_DOWNLOAD_TOKEN` in `.env`.
- `components/map/mapbox.ts` safely loads RNMapbox so Expo Go can show a build-required fallback instead of crashing the `move` route before its default export is registered.

## Build notes

RNMapbox is a native module, so the map will render in an Expo development build or EAS build, not Expo Go. The relevant tokens remain configured in `.env` and `app.json`.

Recommended build flow:

```bash
npx expo-doctor
rm -rf node_modules android .expo
pnpm install
npx expo prebuild --clean
pnpm dlx eas-cli build -p android --profile preview --clear-cache
```
