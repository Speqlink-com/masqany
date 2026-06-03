# Authentication Fix Guide

## What Was Wrong

The auth module I created had **incorrect API paths**. The backend endpoints all start with `/api/auth/` but my API client was using `/auth/` (missing the `/api` prefix).

### Wrong Paths (Original)
```typescript
.post("/auth/signin/password", payload)         // ❌ Wrong
.post("/auth/signup/start", payload)            // ❌ Wrong
```

### Correct Paths (Fixed)
```typescript
.post("/api/auth/signin/password", payload)     // ✅ Correct
.post("/api/auth/signup/start", payload)        // ✅ Correct
```

## Quick Fix - Test Login Screen

I've created a working login screen example that you can test immediately:

**File:** `/app/(auth)/login-FIXED-EXAMPLE.tsx`

This screen:
- ✅ Uses correct API path: `/api/auth/signin/password`
- ✅ Handles the response correctly
- ✅ Saves tokens to secure storage
- ✅ Routes based on user role
- ✅ Has proper error handling
- ✅ Shows loading states

### Test It Now

1. **Update your router** to use the fixed screen temporarily:

In `/app/(auth)/_layout.tsx` or wherever you define routes, add:
```typescript
// Test route
<Stack.Screen name="login-FIXED-EXAMPLE" />
```

2. **Navigate to it** from your current login screen or directly:
```typescript
router.push("/(auth)/login-FIXED-EXAMPLE");
```

3. **Test with your credentials:**
   - Email: `speqlink@gmail.com`
   - Password: `@Speqlink1240.,,.`

4. **Check console logs** - The screen logs all API calls so you can see exactly what's happening

## What to Fix in Your Existing Screens

### Option 1: Replace paths in `modules/auth/api.ts`

Find and replace all instances:
```typescript
// Find this:
"/auth/

// Replace with:
"/api/auth/
```

### Option 2: Use the new `api-fixed.ts`

I created a new file `/modules/auth/api-fixed.ts` with correct paths.

**In any screen, replace:**
```typescript
import { authApi } from "@/modules/auth/api";
await authApi.signup.start(...)
```

**With:**
```typescript
import { signupStart } from "@/modules/auth/api-fixed";
await signupStart(...)
```

### Option 3: Update hooks to use fixed API

Update `/modules/auth/hooks.ts` to import from `api-fixed.ts` instead of `api.ts`:

```typescript
// At the top of hooks.ts
import { 
  signInPassword,
  signupStart,
  verifyEmail,
  // ... etc
} from "./api-fixed";

// Then in useSignInPassword:
export function useSignInPassword() {
  return useMutation({
    mutationFn: (payload) => signInPassword(payload),  // Use direct function
    onSuccess: async (data) => {
      // ... save session ...
    },
  });
}
```

## Backend Response Format (Confirmed Working)

### Sign In Response
```json
{
  "status": "success",
  "message": "Signed in",
  "refreshToken": "24d73861a99b9c...",  // This IS the access token for mobile
  "user": {
    "id": "aaba6b8c-b74b-4542-8267-3dcc26df0836",
    "fullName": "Siwende Comfortine",
    "role": "superadmin",
    "email": "speqlink@gmail.com",
    "phone": "+254796218073"
  }
}
```

### Sign Up Start Response
```json
{
  "status": "success",
  "nextStep": "verify_email",
  "message": "Email OTP sent",
  "user": {
    "id": "d54f70d7-14ad-403d-b990-4cd056c089c9",
    "fullName": "Test User",
    "role": "tenant",
    "email": "test@example.com",
    "phone": "+254712345678"
  }
}
```

## All Backend Endpoints (Confirmed)

| Endpoint | Method | Works? |
|----------|--------|--------|
| `/api/auth/signin/password` | POST | ✅ Tested |
| `/api/auth/signup/start` | POST | ✅ Tested |
| `/api/auth/signup/verify-email` | POST | ⚠️ Not tested yet |
| `/api/auth/signup/verify-phone` | POST | ⚠️ Not tested yet |
| `/api/auth/signup/complete` | POST | ⚠️ Not tested yet |
| `/api/auth/signin/otp/request` | POST | ⚠️ Not tested yet |
| `/api/auth/signin/otp/verify` | POST | ⚠️ Not tested yet |
| `/api/auth/password/forgot/request` | POST | ⚠️ Not tested yet |
| `/api/auth/password/forgot/complete` | POST | ⚠️ Not tested yet |
| `/api/auth/google/mobile/signin` | POST | ⚠️ Not tested yet |
| `/api/auth/google/mobile/signup` | POST | ⚠️ Not tested yet |
| `/api/auth/refresh` | POST | ⚠️ Not tested yet |
| `/api/auth/logout` | POST | ⚠️ Not tested yet |

## Testing Checklist

- [ ] Test login with your credentials
- [ ] Check console logs for API calls
- [ ] Verify tokens are saved (check `saveSession` logs)
- [ ] Verify user is set in state
- [ ] Verify routing works based on role
- [ ] Test wrong password (should show error)
- [ ] Test network error (turn off wifi)
- [ ] Close and reopen app (should restore session)

## Quick Verification Commands

Test any endpoint from terminal:

```bash
# Test login
curl -X POST http://192.168.0.100/api/auth/signin/password \
  -H "Content-Type: application/json" \
  -d '{"identifier":"speqlink@gmail.com","password":"@Speqlink1240.,,."}' \
  | python3 -m json.tool

# Test signup start
curl -X POST http://192.168.0.100/api/auth/signup/start \
  -H "Content-Type: application/json" \
  -d '{
    "fullName":"Test User",
    "role":"tenant",
    "email":"newuser@test.com",
    "phone":"+254712345678",
    "password":"TestPass123",
    "confirmPassword":"TestPass123"
  }' \
  | python3 -m json.tool
```

## Next Steps

1. **Test the fixed login screen** - Confirm it works with your credentials
2. **Choose a fix option** - Either update paths in existing API or use the new one
3. **Update one screen at a time** - Start with login, then signup
4. **Test each screen** - Verify the backend responses match expectations
5. **Update remaining screens** - Once you confirm the pattern works

## Need Help?

If the login screen doesn't work:

1. Check console logs - Look for API call details
2. Check network tab - See actual HTTP requests
3. Verify base URL - Should be `http://192.168.0.100`
4. Test with curl first - Confirm backend is responding
5. Check Kong logs - `docker logs masqany-kong`
6. Check auth service logs - `docker logs masqany-auth-service`

## Important Notes

- The `refreshToken` field in responses IS the access token for mobile
- All paths must start with `/api/auth/`
- Phone numbers must be in format `+254XXXXXXXXX`
- Backend returns Zurich roles exactly: "superadmin", "admin", "property_owner", "property_agent", "tenant", "relocation_driver"
- The `apiClient` base URL should be just `http://192.168.0.100` (no `/api` suffix)

## Summary

The issue was simple: wrong API paths. The fix is also simple: add `/api` prefix to all auth endpoints.

Test the provided login screen example first to confirm everything works, then update your other screens one by one.
