# Login Testing Guide

## What I Fixed

I've updated the login screen to:
1. ✅ Call the EXACT endpoint: `POST /api/auth/signin/password`
2. ✅ Use the EXACT payload format: `{identifier, password}`
3. ✅ Handle the EXACT response: `{status, message, refreshToken, user}`
4. ✅ Add comprehensive console logging
5. ✅ Add a button to fill test credentials automatically
6. ✅ Save tokens to secure storage
7. ✅ Route based on user role

## How to Test

### Step 1: Open the App
- Make sure Metro bundler is running
- Open the app on your device/simulator

### Step 2: Navigate to Login
- Go to the login screen: `/(auth)/login`

### Step 3: Fill Credentials

**Option A: Use the auto-fill button (DEV mode only)**
- Tap the "Fill Test Credentials" button at the bottom
- This will fill: `speqlink@gmail.com` and `@Speqlink1240.,,.`

**Option B: Type manually**
- Email: `speqlink@gmail.com`
- Password: `@Speqlink1240.,,.`

### Step 4: Tap Login Button

### Step 5: Watch the Console

You should see detailed logs like this:

```
==================================================
[LOGIN] Starting login attempt...
[LOGIN] Identifier: speqlink@gmail.com
[LOGIN] Password length: 17
[LOGIN] API Base URL: http://192.168.0.100
==================================================
[LOGIN] Calling POST /api/auth/signin/password
[LOGIN] ✅ Response received: {
  "status": "success",
  "message": "Signed in",
  "refreshToken": "164bbcc8efef312f1a68453caec18e31f81110c518db0c0f752cc3d0e098fe80",
  "user": {
    "id": "aaba6b8c-b74b-4542-8267-3dcc26df0836",
    "fullName": "Siwende Comfortine",
    "role": "superadmin",
    "email": "speqlink@gmail.com",
    "phone": "+254796218073"
  }
}
[LOGIN] Saving session to secure storage...
[LOGIN] Updating app state...
[LOGIN] ✅ Login successful! User: Siwende Comfortine Role: superadmin
==================================================
[LOGIN] Routing user based on role: superadmin
[LOGIN] -> Routing to super-admin dashboard
```

### Step 6: Verify Success

After successful login:
- You should be redirected to the super-admin dashboard (for superadmin role)
- Or to property-admin (for property_owner role)
- Or to home (for tenant role)

## Troubleshooting

### No console logs appearing

**Check:**
1. Is Metro bundler running?
2. Are you viewing the correct console?
   - For Android: `adb logcat | grep -i expo`
   - For iOS: Xcode console or `npx react-native log-ios`
3. Try reloading the app: Shake device → Reload

### Error: "Network request failed"

**This means the app cannot reach the backend**

**Check:**
1. Is your backend running?
   ```bash
   docker ps | grep masqany
   ```

2. Is Kong healthy?
   ```bash
   curl http://192.168.0.100/api/auth/health
   ```

3. Are you on the same network?
   - Device and server must be on the same WiFi
   - Check your IP: `ifconfig | grep "inet 192"`

4. Update the IP if needed:
   - In `.env`: `EXPO_PUBLIC_API_URL=http://YOUR_IP`
   - Or in `lib/api/client.ts`: Change the default BASE_URL

### Error from backend

If you see an error response in console:

```
[LOGIN] ❌ Error occurred:
[LOGIN] Error response: { message: "Invalid credentials" }
```

**This means:**
- ✅ Network is working (app reached backend)
- ❌ Credentials are wrong

**Try:**
1. Copy/paste the exact password (it has special characters)
2. Use the "Fill Test Credentials" button
3. Test with curl first:
   ```bash
   curl -X POST http://192.168.0.100/api/auth/signin/password \
     -H "Content-Type: application/json" \
     -d '{"identifier":"speqlink@gmail.com","password":"@Speqlink1240.,,."}'
   ```

### App redirects to home immediately

**This happens if:**
- Session is already saved (from previous login)
- Dev bypass is triggering

**Fix:**
1. Clear app data
2. Or logout first
3. Or uninstall and reinstall

### Still not working?

**Debug steps:**

1. **Test backend directly:**
   ```bash
   curl -X POST http://192.168.0.100/api/auth/signin/password \
     -H "Content-Type: application/json" \
     -d '{"identifier":"speqlink@gmail.com","password":"@Speqlink1240.,,."}' \
     | python3 -m json.tool
   ```

2. **Check backend logs:**
   ```bash
   docker logs masqany-auth-service --tail 50
   docker logs masqany-kong --tail 50
   ```

3. **Verify network:**
   ```bash
   # From your computer
   ping 192.168.0.100
   
   # Test Kong
   curl http://192.168.0.100:8001/status
   ```

4. **Check apiClient config:**
   ```typescript
   // In lib/api/client.ts
   console.log("API Base URL:", apiClient.defaults.baseURL);
   ```

## Expected Behavior

### ✅ Success Flow
1. User fills credentials
2. Taps "Login"
3. Loading indicator shows
4. Console logs show API call
5. Response received and logged
6. Session saved to secure storage
7. User redirected based on role
8. Can close/reopen app and stay logged in

### ❌ Error Flow
1. User fills wrong credentials
2. Taps "Login"
3. Loading indicator shows
4. Console logs show API call
5. Error response logged
6. Error message shown to user
7. User can try again

## Next Steps After Login Works

Once login is working:
1. ✅ Test session persistence (close/reopen app)
2. ✅ Test logout
3. ✅ Fix forgot password flow
4. ✅ Fix signup flow
5. ✅ Implement Google OAuth properly
6. ✅ Add token refresh logic

## File Changed

- `/app/(auth)/login.tsx` - Complete rewrite with:
  - Direct apiClient call
  - Comprehensive logging
  - Test credentials button
  - Proper error handling
  - Session storage
  - Role-based routing
