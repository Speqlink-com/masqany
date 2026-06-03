# Authentication Migration Guide

Quick reference for migrating existing auth screens to the new authentication system.

## Import Changes

### Old (Remove)
```typescript
import { authApi } from "@/modules/auth/api";
```

### New (Use)
```typescript
import {
  useSignInPassword,
  useSignupStart,
  useVerifyEmail,
  useGoogleSignIn,
  // ... other hooks
} from "@/modules/auth";
```

## Login Screen Migration

### Old Implementation
```typescript
const [loading, setLoading] = useState(false);

async function handleLogin() {
  setLoading(true);
  try {
    const response = await authApi.login({
      email: identifier,
      password,
      device_info: Platform.OS,
    });
    setUser(response.user);
    router.replace("/(tabs)/home");
  } catch (err) {
    setError("Invalid credentials");
  } finally {
    setLoading(false);
  }
}
```

### New Implementation
```typescript
const { mutate: signIn, isPending, error } = useSignInPassword();

function handleLogin() {
  signIn(
    { identifier, password },
    {
      onSuccess: (data) => {
        // User automatically saved to state and secure storage
        routeByRole(data.user.role);
      },
    }
  );
}

// Error handling
{error && <Text>{error.message}</Text>}

// Loading state
{isPending && <ActivityIndicator />}
```

## Signup Flow Migration

### Old Multi-Screen Approach
```typescript
// signup-name.tsx
const [name, setName] = useState("");
// Navigate to next screen with params

// signup-credentials.tsx
const [email, setEmail] = useState("");
// Navigate to next screen with params

// signup-otp.tsx
const [otp, setOtp] = useState("");
// Call API manually
```

### New Hook-Based Approach
```typescript
// Step 1: Start Signup
const { mutate: startSignup } = useSignupStart();

startSignup({
  fullName,
  role,
  email,
  phone,
  password,
  confirmPassword,
}, {
  onSuccess: () => router.push("/onboarding-otp?step=email"),
});

// Step 2: Verify Email
const { mutate: verifyEmail } = useVerifyEmail();

verifyEmail({ email, code: emailOtp }, {
  onSuccess: () => router.push("/onboarding-otp?step=phone"),
});

// Step 3: Verify Phone
const { mutate: verifyPhone } = useVerifyPhone();

verifyPhone({ email, code: phoneOtp }, {
  onSuccess: () => router.push("/onboarding-complete"),
});

// Step 4: Complete
const { mutate: completeSignup } = useCompleteSignup();

completeSignup({ email, termsAccepted: true }, {
  onSuccess: (data) => {
    // User automatically logged in
    routeByRole(data.user.role);
  },
});
```

## Google Login Migration

### Old Mock Implementation
```typescript
async function handleGoogleSignIn() {
  setLoading(true);
  await new Promise((r) => setTimeout(r, 1500));
  const response = mockGoogleLogin("mock-token");
  setUser(response.user);
  router.replace("/(tabs)/home");
}
```

### New Real Implementation
```typescript
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useGoogleSignIn } from "@/modules/auth";

const { mutate: googleSignIn, isPending } = useGoogleSignIn();

async function handleGoogleSignIn() {
  try {
    // Get Google ID token from SDK
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const idToken = userInfo.idToken;

    // Sign in with backend
    googleSignIn(
      { idToken },
      {
        onSuccess: (data) => {
          routeByRole(data.user.role);
        },
      }
    );
  } catch (error) {
    console.error("Google sign in failed:", error);
  }
}
```

## Forgot Password Migration

### Old Two-Screen Approach
```typescript
// forgot-password.tsx
async function handleSubmit() {
  try {
    await authApi.forgotPassword({ email });
    router.push("/forgot-password-otp");
  } catch (err) {
    setError(err.message);
  }
}

// forgot-password-otp.tsx
async function handleSubmit() {
  try {
    await authApi.resetPassword({ token: otp, new_password });
    router.push("/login");
  } catch (err) {
    setError(err.message);
  }
}
```

### New Hook Approach
```typescript
// forgot-password.tsx
const { mutate: requestReset } = useForgotPasswordRequest();

requestReset(
  { identifier },
  {
    onSuccess: () => router.push({
      pathname: "/forgot-password-otp",
      params: { identifier },
    }),
  }
);

// forgot-password-otp.tsx
const { mutate: completeReset } = useForgotPasswordComplete();

completeReset(
  {
    identifier,
    code,
    newPassword,
    confirmPassword,
  },
  {
    onSuccess: () => {
      // Show success message
      router.push("/login");
    },
  }
);
```

## OTP Login Migration

### Old Approach
```typescript
async function handleRequestOtp() {
  try {
    await authApi.sendOtp({ email, purpose: "login" });
    router.push("/login-otp");
  } catch (err) {
    setError(err.message);
  }
}

async function handleVerifyOtp() {
  try {
    const response = await authApi.verifyOtp({ email, otp_code, purpose: "login" });
    setUser(response.user);
    router.replace("/(tabs)/home");
  } catch (err) {
    setError(err.message);
  }
}
```

### New Hook Approach
```typescript
// Request OTP
const { mutate: requestOtp } = useSignInOtpRequest();

requestOtp(
  { identifier },
  {
    onSuccess: () => router.push({
      pathname: "/login-otp",
      params: { identifier },
    }),
  }
);

// Verify OTP
const { mutate: verifyOtp } = useSignInOtpVerify();

verifyOtp(
  { identifier, code },
  {
    onSuccess: (data) => {
      routeByRole(data.user.role);
    },
  }
);
```

## Resend OTP Migration

### Old Approach
```typescript
const [canResend, setCanResend] = useState(false);
const [countdown, setCountdown] = useState(60);

async function handleResend() {
  try {
    await authApi.sendOtp({ email, purpose: "verification" });
    setCountdown(60);
    setCanResend(false);
    // Start countdown timer
  } catch (err) {
    setError(err.message);
  }
}
```

### New Hook Approach
```typescript
const { mutate: resendOtp, isPending } = useResendEmailOtp();
// or useResendPhoneOtp() for phone OTP

const [canResend, setCanResend] = useState(false);
const [countdown, setCountdown] = useState(60);

function handleResend() {
  resendOtp(email, {
    onSuccess: () => {
      setCountdown(60);
      setCanResend(false);
      // Show success toast
    },
  });
}

// Countdown timer (unchanged)
useEffect(() => {
  if (countdown > 0) {
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  } else {
    setCanResend(true);
  }
}, [countdown]);
```

## Logout Migration

### Old Approach
```typescript
async function handleLogout() {
  try {
    await authApi.logout();
    clearUser();
    router.replace("/login");
  } catch (err) {
    // Still logout locally
    clearUser();
    router.replace("/login");
  }
}
```

### New Hook Approach
```typescript
const { mutate: logout } = useLogout();

function handleLogout() {
  logout(undefined, {
    onSettled: () => {
      // Automatically clears storage and state
      router.replace("/login");
    },
  });
}
```

## Session Restoration

### Add to Root Layout (`app/_layout.tsx`)

```typescript
import { useRestoreSession, useIsAuthenticated } from "@/modules/auth";
import { useEffect } from "react";
import { useRouter, useSegments, Slot } from "expo-router";

export default function RootLayout() {
  const { isLoading } = useRestoreSession();
  const isAuthenticated = useIsAuthenticated();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to app
      router.replace("/(tabs)/home");
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return <Slot />;
}
```

## Role-Based Routing Helper

Create a shared utility:

```typescript
// utils/routing.ts
import { Router } from "expo-router";

export function routeByRole(role: string, router: Router) {
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

Use in all auth success handlers:

```typescript
import { routeByRole } from "@/utils/routing";

signIn(credentials, {
  onSuccess: (data) => {
    routeByRole(data.user.role, router);
  },
});
```

## Error Display Pattern

### Old Approach
```typescript
const [error, setError] = useState<string | null>(null);

{error && <Text style={{ color: "red" }}>{error}</Text>}
```

### New Hook Approach
```typescript
const { mutate, error } = useSignInPassword();

{error && (
  <Text style={{ color: "red" }}>
    {error.message || "Something went wrong"}
  </Text>
)}
```

## Loading State Pattern

### Old Approach
```typescript
const [loading, setLoading] = useState(false);

<TouchableOpacity disabled={loading}>
  <Text>{loading ? "Loading..." : "Submit"}</Text>
</TouchableOpacity>
```

### New Hook Approach
```typescript
const { mutate, isPending } = useSignInPassword();

<TouchableOpacity disabled={isPending}>
  {isPending ? (
    <ActivityIndicator color="#fff" />
  ) : (
    <Text>Submit</Text>
  )}
</TouchableOpacity>
```

## Complete Screen Example

Here's a complete migrated login screen:

```typescript
import { useSignInPassword } from "@/modules/auth";
import { routeByRole } from "@/utils/routing";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: signIn, isPending, error } = useSignInPassword();

  function handleLogin() {
    if (!identifier || !password) return;

    signIn(
      { identifier, password },
      {
        onSuccess: (data) => {
          routeByRole(data.user.role, router);
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
        editable={!isPending}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        editable={!isPending}
      />

      {error && (
        <Text style={{ color: "red" }}>
          {error.message || "Login failed"}
        </Text>
      )}

      <TouchableOpacity
        onPress={handleLogin}
        disabled={isPending || !identifier || !password}
      >
        {isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text>Sign In</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
```

## Migration Checklist

- [ ] Update `_layout.tsx` with session restoration
- [ ] Create `utils/routing.ts` with role-based routing
- [ ] Update `/login.tsx`
- [ ] Update `/sign-up.tsx` (or create new onboarding flow)
- [ ] Update `/onboarding-*.tsx` screens
- [ ] Update `/forgot-password.tsx`
- [ ] Update `/forgot-password-otp.tsx`
- [ ] Update `/login-otp.tsx`
- [ ] Update `/google-login.tsx`
- [ ] Remove old `/modules/auth/api.ts` (if different)
- [ ] Remove mock data imports
- [ ] Test each flow end-to-end
- [ ] Update environment variables
- [ ] Remove development bypass code (optional)

## Common Pitfalls

### ❌ Don't do this
```typescript
// Calling API directly
const response = await authApi.signin.withPassword({ ... });

// Manual token management
await SecureStore.setItemAsync("token", response.token);

// Manual state updates
setUser(response.user);
```

### ✅ Do this instead
```typescript
// Use hooks - they handle everything
const { mutate: signIn } = useSignInPassword();

signIn(credentials, {
  onSuccess: (data) => {
    // Token already saved to secure storage
    // User already set in state
    // Just route to the right place
    routeByRole(data.user.role, router);
  },
});
```

## Testing After Migration

1. **Clean install** - Remove app and reinstall
2. **Test signup** - Complete full flow with OTP
3. **Test login** - Password and OTP methods
4. **Test persistence** - Close app, reopen (should stay logged in)
5. **Test logout** - Should clear everything
6. **Test forgot password** - Complete flow
7. **Test errors** - Invalid credentials, network offline
8. **Test token refresh** - Wait for token expiry (or force it)

## Need Help?

Check the complete integration guide:
- `/docs/AUTH_INTEGRATION.md`

Or the backend summary:
- `/masqany_servers/docs/MOBILE_AUTH_INTEGRATION_SUMMARY.md`
