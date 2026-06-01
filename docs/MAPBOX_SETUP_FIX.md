# Mapbox Setup Fix Guide

## 🔴 Current Issue

```
ERROR: @rnmapbox/maps native code not available
```

## 🧠 Root Cause

You're running the app in **Expo Go** or an **old development build** that doesn't include the Mapbox native SDK. The JavaScript package is installed, but the native Android/iOS binaries are missing from the running app.

---

## ✅ THE FIX (Required)

You **MUST** rebuild your development client because `@rnmapbox/maps` is a native module.

### Option 1: EAS Build (Recommended)

```bash
# Build Android development client
pnpm dlx eas-cli build -p android --profile development

# Or for iOS
pnpm dlx eas-cli build -p ios --profile development
```

**Then:**
1. Download and install the generated APK/IPA
2. Start Metro bundler:
   ```bash
   npx expo start --dev-client
   ```
3. Open the app from your **dev build** (NOT Expo Go)

### Option 2: Local Build (If Android Studio configured)

```bash
# Build and run locally
npx expo run:android

# Or for iOS
npx expo run:ios
```

---

## ⚠️ CRITICAL: Do NOT Use Expo Go

**This will NEVER work:**
```bash
npx expo start  # Opens in Expo Go
```

**Why?** Expo Go doesn't include:
- Mapbox native SDK
- Custom native dependencies
- Your specific native modules

---

## 🎯 Correct Development Workflow

```
1. Install native package (already done ✅)
   ↓
2. Rebuild dev client (REQUIRED)
   ↓
3. Install dev build on device
   ↓
4. Start Metro with --dev-client flag
   ↓
5. Open app in dev build (NOT Expo Go)
```

---

## 🔧 Additional Checks

### 1. Verify Mapbox Token

Make sure you have this in your `.env` file:

```env
EXPO_PUBLIC_MAPBOX_TOKEN=pk.your_actual_token_here
```

### 2. Check EAS Configuration

Verify `eas.json` has the development profile:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    }
  }
}
```

### 3. Verify app.json/app.config.js

Make sure Mapbox plugin is configured:

```json
{
  "expo": {
    "plugins": [
      [
        "@rnmapbox/maps",
        {
          "RNMapboxMapsDownloadToken": "YOUR_DOWNLOAD_TOKEN"
        }
      ]
    ]
  }
}
```

---

## 🚀 Quick Start Commands

```bash
# 1. Build development client (one-time, or when native deps change)
pnpm dlx eas-cli build -p android --profile development

# 2. After installing the APK, start Metro
npx expo start --dev-client

# 3. Open the app from your dev build
```

---

## 🧠 Understanding Native Modules

### What Happens When You Install a Native Module:

1. **JavaScript Package** - Installed via npm/pnpm ✅
2. **Native Code** - Needs to be compiled into app binary ❌ (missing)

### Metro Restart vs Native Rebuild:

| Change Type | Requires |
|-------------|----------|
| JavaScript code | Metro restart only |
| TypeScript types | Metro restart only |
| Native module install | **Full native rebuild** |
| Native module config | **Full native rebuild** |

---

## 📱 How to Know You're in Dev Build vs Expo Go

**Expo Go:**
- App icon says "Expo Go"
- Purple/blue branding
- Generic Expo splash screen

**Dev Build:**
- Your app icon (Masqany logo)
- Your app name
- Your custom splash screen
- Includes all native modules

---

## 🐛 Troubleshooting

### Issue: "Still getting Mapbox error after rebuild"

**Check:**
1. Did you install the NEW APK/IPA?
2. Are you opening the dev build (not Expo Go)?
3. Is Metro running with `--dev-client` flag?
4. Is your Mapbox token valid?

### Issue: "Build fails"

**Check:**
1. Mapbox download token in app.json
2. EAS CLI is up to date: `pnpm dlx eas-cli@latest`
3. Check EAS build logs for specific errors

### Issue: "Can't find dev build on device"

**Solution:**
- Check your email for EAS build link
- Or download from EAS dashboard: https://expo.dev
- Or use QR code from build completion

---

## ✅ Success Checklist

Before running the app:

- [ ] Development build created with EAS or local build
- [ ] APK/IPA installed on device/emulator
- [ ] `.env` file has `EXPO_PUBLIC_MAPBOX_TOKEN`
- [ ] Metro started with `--dev-client` flag
- [ ] Opening app from dev build (NOT Expo Go)

---

## 🎯 Expected Result

After following these steps, you should see:

✅ Map loads successfully  
✅ No Mapbox native code errors  
✅ Move screen displays properly  
✅ All map interactions work  

---

## 📚 Additional Resources

- [Expo Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [RNMapbox Installation](https://rnmapbox.github.io/docs/install)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)

---

## 🚨 Remember

**Every time you install a new native module, you MUST rebuild your development client.**

This is not a bug—it's how React Native works with native code.
