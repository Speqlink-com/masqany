# Authentication Module Integration Guide

Complete guide for integrating the Masqany authentication system with the mobile app.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Available Hooks](#available-hooks)
4. [Usage Examples](#usage-examples)
5. [Session Management](#session-management)
6. [Error Handling](#error-handling)
7. [Testing](#testing)

## Overview

The authentication module provides enterprise-grade auth integration with:

- ✅ Secure token storage using expo-secure-store
- ✅ Automatic token refresh on expiry
- ✅ Persistent sessions (users stay logged in)
- ✅ Comprehensive error handling
- ✅ Network retry logic with exponential backoff
- ✅ TanStack Query for optimal state management
- ✅ TypeScript types for everything
- ✅ Multi-step signup flow with OTP verification
- ✅ Password and OTP sign-in options
- ✅ Google OAuth for mobile
- ✅ Password reset flow
- ✅ Admin user creation

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Mobile App                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Screens    │──│    Hooks     │──│   API Client │     │
│  │  (UI Layer)  │  │ (TanStack Q) │  │   (Axios)    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │             │
│         │                  │                  │             │
│         ▼                  ▼                  ▼             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Auth Store  │  │   Storage    │  │   Refresh    │     │
│  │   (Zustand)  │  │ (SecureStore)│  │ Interceptor  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Kong Gateway)                     │
│                                                              │
│  /api/auth/signup/*      - Multi-step signup                │
│  /api/auth/signin/*      - Password & OTP sign in           │
│  /api/auth/password/*    - Password management              │
│  /api/auth/google/*      - Google OAuth                     │
│  /api/auth/refresh       - Token refresh                    │
│  /api/auth/logout        - Session termination              │
│  /api/auth/admin/*       - Admin operations                 │
└─────────────────────────────────────────────────────────────┘
```

## Available Hooks

### Session Management

```typescript
// Restore session on app launch (call in root _layout.tsx)
const { isLoading } = useRestoreSession();

// Get current user
const user = useCurrentUser();

// Check auth status
const isAuthenticated = useIsAuthenticated();
const isLoading = useAuthLoading();

// Logout
const { mutate: logout } = useLogout();
```

### Signup Flow

```typescript
// 1. Start signup
const { mutate: startSignup, isPending, error } = useSignupStart();

startSignup({
  fullName: "John Doe",
  role: "tenant",
  email: "john@example.com",
  phone: "+254712345678",
  password: "SecurePass123",
  confirmPassword: "SecurePass123",
});

// 2. Verify email OTP
const { mutate: verifyEmail } = useVerifyEmail();
verifyEmail({ email: "john@example.com", code: "123456" });

// 3. Verify phone OTP
const { mutate: verifyPhone } = useVerifyPhone();
verifyPhone({ email: "john@example.com", code: "654321" });

// 4. Complete signup
const { mutate: completeSignup } = useCompleteSignup();
completeSignup({ email: "john@example.com", termsAccepted: true });

// Resend OTPs
const { mutate: resendEmailOtp } = useResendEmailOtp();
const { mutate: resendPhoneOtp } = useResendPhoneOtp();
```

### Sign In

```typescript
// Password sign in
const { mutate: signIn, isPending, error } = useSignInPassword();

signIn({
  identifier: "john@example.com", // or +254712345678
  password: "SecurePass123",
});

// OTP sign in
const { mutate: requestOtp } = useSignInOtpRequest();
const { mutate: verifyOtp } = useSignInOtpVerify();

// 1. Request OTP
requestOtp({ identifier: "john@example.com" });

// 2. Verify OTP
verifyOtp({
  identifier: "john@example.com",
  code: "123456",
});
```

### Password Management

```typescript
// Forgot password
const { mutate: requestReset } = useForgotPasswordRequest();
const { mutate: completeReset } = useForgotPasswordComplete();

// 1. Request reset OTP
requestReset({ identifier: "john@example.com" });

// 2. Complete reset with OTP
completeReset({
  identifier: "john@example.com",
  code: "123456",
  newPassword: "NewSecurePass123",
  confirmPassword: "NewSecurePass123",
});

// Change password (authenticated)
const { mutate: changePassword } = useChangePassword();

changePassword({
  password: "NewPassword123",
  confirmPassword: "NewPassword123",
});
```

### Google OAuth

```typescript
// Sign in with Google
const { mutate: googleSignIn } = useGoogleSignIn();

googleSignIn({
  idToken: "google-id-token-from-sdk",
});

// Sign up with Google
const { mutate: googleSignUp } = useGoogleSignUp();

googleSignUp({
  idToken: "google-id-token-from-sdk",
  fullName: "John Doe",
  role: "tenant",
});
```

### Admin Operations

```typescript
// Create admin (superadmin only)
const { mutate: createAdmin } = useCreateAdmin();

createAdmin({
  fullName: "Jane Admin",
  email: "jane@masqany.com",
  phone: "+254712345678",
});

// Create property agent (property_owner only)
const { mutate: createAgent } = useCreatePropertyAgent();

createAgent({
  fullName: "Bob Agent",
  email: "bob@masqany.com",
  phone: "+254712345678",
});
```

## Usage Examples

### Complete Login Screen Example

```typescript
import { useSignInPassword } from "@/modules/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: signIn, isPending, error } = useSignInPassword();

  function handleLogin() {
    signIn(
      { identifier, password },
      {
        onSuccess: (data) => {
          // Route based on user role
          switch (data.user.role) {
            case "superadmin":
            case "admin":
              router.replace("/(super-admin)/dashboard");
              break;
            case "property_owner":
            case "property_agent":
              router.replace("/(property-admin)");
              break;
            case "tenant":
            default:
              router.replace("/(tabs)/home");
          }
        },
        onError: (err) => {
          console.error("Login failed:", err);
        },
      }
    );
  }

  return (
    <View>
      <TextInput
        value={identifier}
        onChangeText={setIdentifier}
        placeholder="Email or phone"
        autoCapitalize="none"
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />

      {error && (
        <Text style={{ color: "red" }}>
          {error.message || "Login failed"}
        </Text>
      )}

      <TouchableOpacity onPress={handleLogin} disabled={isPending}>
        <Text>{isPending ? "Signing in..." : "Sign In"}</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Multi-Step Signup Example

```typescript
import { useSignupStart, useVerifyEmail, useVerifyPhone, useCompleteSignup } from "@/modules/auth";
import { useState } from "react";

export default function SignupFlow() {
  const [step, setStep] = useState<"details" | "email" | "phone" | "terms">("details");
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({...});

  const { mutate: startSignup } = useSignupStart();
  const { mutate: verifyEmail } = useVerifyEmail();
  const { mutate: verifyPhone } = useVerifyPhone();
  const { mutate: completeSignup } = useCompleteSignup();

  function handleStart() {
    startSignup(formData, {
      onSuccess: () => setStep("email"),
    });
  }

  function handleVerifyEmail(code: string) {
    verifyEmail(
      { email, code },
      {
        onSuccess: () => setStep("phone"),
      }
    );
  }

  function handleVerifyPhone(code: string) {
    verifyPhone(
      { email, code },
      {
        onSuccess: () => setStep("terms"),
      }
    );
  }

  function handleComplete() {
    completeSignup(
      { email, termsAccepted: true },
      {
        onSuccess: () => {
          // User is now logged in, route to app
          router.replace("/(tabs)/home");
        },
      }
    );
  }

  // Render based on step...
}
```

### Session Restoration in Root Layout

```typescript
// app/_layout.tsx
import { useRestoreSession } from "@/modules/auth";
import { useEffect } from "react";
import { Slot, useRouter, useSegments } from "expo-router";

export default function RootLayout() {
  const { data: user, isLoading } = useRestoreSession();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      // Redirect to app if authenticated and on auth screen
      router.replace("/(tabs)/home");
    }
  }, [user, isLoading, segments]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <Slot />;
}
```

## Session Management

### How Sessions Work

1. **Sign In**: User enters credentials → Backend returns `refreshToken` → Saved to secure storage
2. **API Requests**: Access token attached to all requests as `Bearer {token}`
3. **Token Expiry**: When access token expires (401 response) → Automatic refresh using refresh token
4. **App Restart**: On launch → Check secure storage → Auto-refresh token → Restore session
5. **Logout**: Clear secure storage → Clear app state → Redirect to login

### Persistent Sessions

Users stay logged in across app restarts. The auth system automatically:
- Stores tokens in encrypted device storage
- Restores session on app launch
- Refreshes expired tokens silently
- Only requires re-login if refresh token is revoked or expired (30 days)

## Error Handling

All auth hooks return normalized errors:

```typescript
interface AuthError {
  message: string;
  status: number | null;
  code: string | null;
}
```

### Common Error Scenarios

```typescript
const { mutate, error } = useSignInPassword();

if (error) {
  switch (error.status) {
    case 401:
      // Invalid credentials
      showError("Invalid email or password");
      break;
    case 404:
      // Account not found
      showError("Account does not exist");
      break;
    case 409:
      // Conflict (e.g., account already exists)
      showError("Account already exists");
      break;
    case 429:
      // Rate limited
      showError("Too many attempts. Try again later");
      break;
    default:
      showError(error.message || "Something went wrong");
  }
}
```

### Network Resilience

The API client automatically:
- Retries failed requests (max 3 attempts)
- Uses exponential backoff (1s, 2s, 4s)
- Works offline-first (serves from cache when possible)
- Queues requests when offline and retries when online

## Testing

### Development Mode

For development/testing, you can bypass authentication:

```typescript
if (__DEV__) {
  const mockUser = {
    id: "dev-user",
    fullName: "Dev User",
    role: "property_owner" as const,
    email: "dev@masqany.com",
    phone: "+254700000000",
  };

  useAuthStore.getState().setUser(mockUser);
  router.replace("/(property-admin)");
}
```

### Testing Signup Flow

Use a test email that you control to receive OTP codes during development.

### Testing Google OAuth

Integrate `@react-native-google-signin/google-signin` or `expo-auth-session` for full Google OAuth testing.

## API Endpoints Reference

### Base URLs

- **Development**: `http://192.168.0.100/api/auth`
- **Production**: `https://masqany.speqlink.com/api/auth`

### All Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/signup/start` | POST | Start signup process |
| `/signup/verify-email` | POST | Verify email OTP |
| `/signup/verify-phone` | POST | Verify phone OTP |
| `/signup/complete` | POST | Complete signup (accept terms) |
| `/signup/resend-email-otp` | POST | Resend email OTP |
| `/signup/resend-phone-otp` | POST | Resend phone OTP |
| `/signin/password` | POST | Sign in with password |
| `/signin/otp/request` | POST | Request OTP for sign in |
| `/signin/otp/verify` | POST | Verify OTP and sign in |
| `/password/forgot/request` | POST | Request password reset OTP |
| `/password/forgot/complete` | POST | Complete password reset |
| `/password/change` | PUT | Change password (authenticated) |
| `/google/mobile/signin` | POST | Sign in with Google |
| `/google/mobile/signup` | POST | Sign up with Google |
| `/refresh` | POST | Refresh access token |
| `/logout` | POST | Logout and invalidate tokens |
| `/admin/create` | POST | Create admin (superadmin only) |
| `/property-agent/create` | POST | Create agent (property_owner only) |

## Role-Based Routing

Route users based on their role after successful authentication:

```typescript
function routeByRole(role: string, router: Router) {
  switch (role) {
    case "superadmin":
    case "admin":
      router.replace("/(super-admin)/dashboard");
      break;
    case "property_owner":
    case "property_agent":
      router.replace("/(property-admin)");
      break;
    case "relocation_driver":
      router.replace("/(driver)/dashboard");
      break;
    case "tenant":
    default:
      router.replace("/(tabs)/home");
  }
}
```

## Security Best Practices

1. ✅ Never log tokens in production
2. ✅ Always use HTTPS in production
3. ✅ Tokens stored in encrypted device storage (expo-secure-store)
4. ✅ Automatic token refresh prevents man-in-the-middle attacks
5. ✅ Short-lived access tokens (7 days)
6. ✅ Refresh tokens have 30-day expiry
7. ✅ All sensitive operations require re-authentication
8. ✅ Rate limiting on auth endpoints

## Troubleshooting

### "Failed to save tokens" error

- Check that app has necessary permissions
- Ensure device supports secure storage
- Try uninstalling and reinstalling the app

### "Session expired" on app launch

- Refresh token may have expired (30 days)
- User needs to log in again
- This is expected behavior for security

### Network errors during auth

- Check device network connection
- Verify API base URL is correct
- Check Kong gateway is running

### Token refresh loop

- Clear app data and secure storage
- Re-authenticate
- Check backend refresh token implementation

## Next Steps

1. Implement all auth screens using the provided hooks
2. Add role-based navigation guards
3. Implement Google OAuth with expo-auth-session
4. Add biometric authentication option
5. Add "Remember Me" functionality
6. Implement account deletion flow

## Support

For issues or questions:
- Check this documentation
- Review backend API documentation
- Check service logs: `docker logs masqany-auth-service`
- Test endpoints with Postman/Thunder Client
