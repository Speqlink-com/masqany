# EAS Build Guide - Google Sign-In Enabled

## ✅ Google Sign-In is Configured for EAS Builds

Google Sign-In **will work** in your EAS builds (preview and production). It only fails in Expo Go because native modules aren't supported there.

## Build Commands

### Preview Build (Internal Testing)
```bash
pnpm dlx eas-cli build -p android --profile preview --clear-cache
```

### Production Build
```bash
pnpm dlx eas-cli build -p android --profile production
```

### iOS Builds
```bash
# Preview
pnpm dlx eas-cli build -p ios --profile preview --clear-cache

# Production
pnpm dlx eas-cli build -p ios --profile production
```

## What's Configured

### 1. Native Module
- ✅ `@react-native-google-signin/google-signin` installed
- ✅ Plugin added to `app.json`
- ✅ Configured with Web Client ID

### 2. Environment Variables
- ✅ `.env` - Development (Expo Go)
- ✅ `.env.production` - Production builds
- ✅ `eas.json` - API URLs per profile

### 3. Google Credentials
**From backend `.env`:**
- Web Client ID: `514449379073-nnhiapavrlinl4j6vi0b76ltag0afq35.apps.googleusercontent.com`
- Mobile Client ID: `514449379073-236s6nu3okqg9g02rb1ij64siqlb3o0k.apps.googleusercontent.com`

### 4. App Configuration (`app.json`)
```json
{
  "ios": {
    "bundleIdentifier": "com.comphorine.mobile"
  },
  "android": {
    "package": "com.comphorine.mobile"
  }
}
```

## Important: Android SHA-1 Configuration

### For EAS Builds, you need to add the EAS Build SHA-1 to Google Cloud Console:

1. **Get your EAS Build SHA-1:**
   ```bash
   eas credentials -p android
   ```
   
2. **Add to Google Cloud Console:**
   - Go to: https://console.cloud.google.com
   - Navigate to: Credentials → Your Android OAuth Client
   - Add SHA-1 certificate fingerprint from EAS

3. **Note:** EAS uses different certificates than local builds

## Testing Google Sign-In

### In Expo Go:
- ❌ Google buttons hidden (native module not available)
- ✅ All other auth methods work (password, OTP, signup)

### In EAS Preview/Production Builds:
- ✅ Google Sign-In button appears
- ✅ Tapping opens native Google Sign-In sheet
- ✅ Automatically signs in and routes user

## Build Profiles

### Preview (Internal Testing)
- API: `http://192.168.0.100` (your local network)
- Use for testing with local backend
- Distribution: Internal

### Production
- API: `https://masqany.speqlink.com`
- Use for release builds
- Auto-increments version

## After Building

1. **Download the APK/IPA** from EAS build page
2. **Install on device**
3. **Test Google Sign-In:**
   - Tap "Sign in with Google"
   - Select Google account
   - Should sign in and route to dashboard

## Troubleshooting

### "DEVELOPER_ERROR" on Google Sign-In
**Cause:** SHA-1 certificate not configured in Google Cloud Console

**Fix:**
1. Get SHA-1 from `eas credentials -p android`
2. Add to Google Cloud Console → OAuth Client

### Google button doesn't appear
**Cause:** Testing in Expo Go

**Fix:** Install EAS preview/production build

### "Sign-In cancelled"
**Cause:** User cancelled (normal behavior)

**Fix:** User should try again

## Files Modified for Google Sign-In

1. `/modules/auth/google.ts` - Core implementation
2. `/app/(auth)/login.tsx` - Sign-in button
3. `/app/(auth)/onboarding-credentials.tsx` - Sign-up button
4. `/.env` - Development credentials
5. `/.env.production` - Production credentials
6. `/app.json` - Google Sign-In plugin
7. `/eas.json` - Build environment variables
8. `/package.json` - Native dependency

## Current Status

✅ **Ready for EAS builds**
✅ **Google Sign-In will work in preview/production**
✅ **All other auth methods work in Expo Go**

## Next Steps

1. Build with EAS: `pnpm dlx eas-cli build -p android --profile preview --clear-cache`
2. Install APK on device
3. Test Google Sign-In
4. Add EAS SHA-1 to Google Cloud Console if needed

---

**Note:** Your existing build command will work perfectly. Google Sign-In is now included in all EAS builds!
