# Map Module Setup Guide

## Quick Start

The Mapbox module is now installed and configured. However, **it requires a dev build** to run because it uses native code.

## Why Dev Build is Required

Mapbox Maps SDK (`@rnmapbox/maps`) is a native module that:
- Uses native Android/iOS code
- Cannot run in Expo Go
- Requires compilation with the native project

## Option 1: Local Dev Build (Fastest for Testing)

### Android

```bash
# Build and run on connected device/emulator
pnpm expo run:android
```

### iOS

```bash
# Build and run on connected device/simulator
pnpm expo run:ios
```

**Requirements:**
- Android Studio (for Android)
- Xcode (for iOS, macOS only)
- Connected device or emulator/simulator

## Option 2: EAS Build (For Distribution)

### Preview Build

```bash
# Build APK for Android
pnpm dlx eas-cli build -p android --profile preview

# Build for iOS
pnpm dlx eas-cli build -p ios --profile preview
```

### Production Build

```bash
# Build for Google Play Store
pnpm dlx eas-cli build -p android --profile production

# Build for App Store
pnpm dlx eas-cli build -p ios --profile production
```

## Environment Variables

The `.env` file has been updated with the correct variable names:

```env
RNMAPBOX_MAPS_DOWNLOAD_TOKEN=sk.eyJ1...  # Secret token for downloads
EXPO_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...      # Public token for runtime
```

## Configuration Files Updated

1. **app.json** - Mapbox plugin added
2. **.env** - Environment variables updated
3. **components/map/** - All map components created
4. **constants/mapConfig.ts** - Map configuration
5. **constants/mockProperties.ts** - Mock data

## Testing in Expo Go

When you run `pnpm expo start` and scan the QR code with Expo Go, you'll see a helpful error message explaining that a dev build is required. This is expected behavior.

## What You'll See After Building

Once you build and run the app, the home screen will show:

1. **Interactive Map** - Kenya-bounded map with light theme
2. **Property Markers** - 9 clustered properties
   - 🟢 Green = Vacant
   - 🔴 Red = Occupied
3. **Search Bar** - Filter properties by location
4. **Property Cards** - Horizontal scrolling cards at bottom
5. **Locate Me Button** - Floating button (right side)

## Mock Data Locations

- **Nairobi CBD** - 2 properties
- **Westlands** - 1 property
- **Kilimani** - 1 property
- **Rongai** - 4 properties
- **Ngong** - 1 property

## Troubleshooting

### "Native code not available" Error

This is expected in Expo Go. Build the app using one of the options above.

### Build Fails

1. Check that `.env` file exists with correct tokens
2. Verify `app.json` has the Mapbox plugin
3. Run `pnpm install` to ensure all dependencies are installed
4. Clear cache: `pnpm expo start -c`

### Map Not Showing After Build

1. Check that public token is correct in `.env`
2. Verify internet connection (map tiles need to download)
3. Check device logs for errors

### Markers Not Appearing

1. Zoom in closer (markers appear at certain zoom levels)
2. Check that you're viewing Kenya region
3. Verify mock data coordinates are correct

## Next Steps

After building and testing:

1. **Add Real Data** - Replace mock properties with API calls
2. **User Location** - Request location permissions
3. **Route Display** - Add Mapbox Directions API
4. **Property Details** - Navigate to property detail screen on card tap
5. **Filters** - Add price, bedrooms, vacancy filters

## Resources

- [Expo Dev Builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Mapbox Maps SDK](https://github.com/rnmapbox/maps)
- [Mapbox Documentation](https://docs.mapbox.com/)

## Support

If you encounter issues:

1. Check the [Mapbox SDK Issues](https://github.com/rnmapbox/maps/issues)
2. Review [Expo Forums](https://forums.expo.dev/)
3. Check build logs in EAS dashboard
