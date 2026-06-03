# Google Sign-In Setup

## ✅ Completed Steps

1. **Installed Package**: `@react-native-google-signin/google-signin`
2. **Environment Variables**: Created `.env` with Google Client IDs
3. **Configuration**: Added plugin to `app.json`
4. **Implementation**: Integrated in `modules/auth/google.ts`
5. **UI Integration**: Added buttons to login and signup screens

## Credentials Used

From backend `.env`:
- **Web Client ID**: `514449379073-nnhiapavrlinl4j6vi0b76ltag0afq35.apps.googleusercontent.com`
- **Mobile Client ID**: `514449379073-236s6nu3okqg9g02rb1ij64siqlb3o0k.apps.googleusercontent.com`

## Testing

### On Android:
1. **Build a development build** (required for native modules):
   ```bash
   npx expo prebuild
   npx expo run:android
   ```

2. **Configure SHA-1 certificate** in Google Cloud Console:
   - Get your debug SHA-1:
     ```bash
     cd android && ./gradlew signingReport
     ```
   - Add to Google Cloud Console → Credentials → Your Android Client ID

### On iOS:
1. **Build a development build**:
   ```bash
   npx expo prebuild
   npx expo run:ios
   ```

2. **Configure URL scheme** (already done in app.json):
   - URL Scheme: `com.googleusercontent.apps.514449379073-236s6nu3okqg9g02rb1ij64siqlb3o0k`

### Testing the Flow:

1. Open the app
2. Go to Login or Sign Up screen
3. Tap "Sign in with Google" or "Sign up with Google"
4. Google Sign-In sheet should appear
5. Select your Google account
6. App should sign you in and route to appropriate screen

## Backend Endpoints

✅ **Sign In**: `POST /api/auth/google/mobile/signin`
- Request: `{ idToken: string }`
- Response: `{ status, message, token, user }`

✅ **Sign Up**: `POST /api/auth/google/mobile/signup`
- Request: `{ idToken: string, fullName: string, role: string }`
- Response: `{ status, message, token, user }`

## Features

- ✅ Native Google Sign-In experience
- ✅ Automatic token management
- ✅ Session storage
- ✅ Role-based routing
- ✅ Comprehensive error handling
- ✅ Loading states

## Troubleshooting

### "Sign-In cancelled"
- User cancelled the Google Sign-In flow
- This is normal user behavior

### "PLAY_SERVICES_NOT_AVAILABLE"
- Android device doesn't have Google Play Services
- Test on a real device or emulator with Play Services

### "DEVELOPER_ERROR"
- SHA-1 certificate not configured in Google Cloud Console
- Make sure you added your debug/release SHA-1 certificates

### "idToken is null"
- Web Client ID might be incorrect
- Check `.env` file has correct `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`

## Files Modified

1. `/modules/auth/google.ts` - Google OAuth implementation
2. `/app/(auth)/login.tsx` - Added Google Sign-In button
3. `/app/(auth)/onboarding-credentials.tsx` - Added Google Sign-Up button
4. `/.env` - Environment variables
5. `/app.json` - Added Google Sign-In plugin
6. `/package.json` - Added dependency

## Additional Features

The module also exports:

```typescript
// Sign out from Google
await signOutFromGoogle();

// Check if user is signed in
const isSignedIn = await isGoogleSignedIn();
```
