# Auth Module Fixes - Design Document

**Feature**: Auth Module Improvements & Fixes  
**Type**: Enhancement & Bug Fixes  
**Status**: Design Phase  
**Created**: 2026-04-29

---

## 1. Design Overview

This document outlines the technical design for implementing all auth module fixes identified in the requirements document. The design follows enterprise standards and maintains the existing architecture patterns.

---

## 2. Architecture Decisions

### 2.1 Font System Architecture

**Decision**: Replace Cormorant Garamond with Poppins + Inter for better readability.

**Implementation**:
```typescript
// app/_layout.tsx - Font Loading
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins';

const [fontsLoaded] = useFonts({
  // Inter for body text
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  // Poppins for headings
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  // Keep CG for branding only
  "CG-Bold": require("../assets/fonts/CormorantGaramond-Bold.ttf"),
});
```

**Tailwind Configuration**:
```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        // Poppins for headings
        'poppins': ['Poppins_400Regular'],
        'poppins-medium': ['Poppins_500Medium'],
        'poppins-semibold': ['Poppins_600SemiBold'],
        'poppins-bold': ['Poppins_700Bold'],
        'poppins-extrabold': ['Poppins_800ExtraBold'],
        // Inter for body
        'inter': ['Inter_400Regular'],
        'inter-medium': ['Inter_500Medium'],
        'inter-semibold': ['Inter_600SemiBold'],
        'inter-bold': ['Inter_700Bold'],
        // CG for branding
        'cg-bold': ['CG-Bold'],
      }
    }
  }
}
```

**Design Tokens Update**:
```typescript
// constants/tokens.ts
export const typography = {
  family: {
    // Body text - Inter
    regular: "Inter_400Regular",
    medium: "Inter_500Medium",
    semibold: "Inter_600SemiBold",
    bold: "Inter_700Bold",
    // Headings - Poppins
    headingRegular: "Poppins_400Regular",
    headingMedium: "Poppins_500Medium",
    headingSemiBold: "Poppins_600SemiBold",
    headingBold: "Poppins_700Bold",
    headingExtraBold: "Poppins_800ExtraBold",
    // Branding
    brandBold: "CG-Bold",
  },
  // ... rest
}
```

---

### 2.2 Role Selection Animation Architecture

**Problem**: Cards don't move up when role selected, agent response overlaps.

**Solution**: Use `react-native-reanimated` with proper layout management.

**Component Structure**:
```
OnboardingRoleScreen
├── ScrollView (flex: 1, no flexGrow)
│   ├── BackButton
│   ├── Greeting Text (static)
│   ├── AgentBubble (question)
│   ├── Animated.View (RoleGrid)
│   │   └── translateY animation
│   ├── AgentBubble (confirmation)
│   └── PrimaryButton
```

**Animation Logic**:
```typescript
// When role selected
Animated.spring(gridTranslateY, {
  toValue: -40, // Move up 40px
  useNativeDriver: true,
  tension: 60,
  friction: 10,
}).start();

// Scroll to show response
setTimeout(() => {
  scrollRef.current?.scrollToEnd({ animated: true });
}, 200);

// When role deselected
Animated.spring(gridTranslateY, {
  toValue: 0, // Return to original position
  useNativeDriver: true,
}).start();
```

**Key Changes**:
1. Remove `flexGrow: 1` from ScrollView contentContainerStyle
2. Use `Animated.View` wrapper around RoleGrid
3. Add `marginBottom` to create space for response
4. Scroll to end when response appears

---

### 2.3 Forgot Password Flow Architecture

**Flow Diagram**:
```
Login Screen
    ↓ (tap "Forgot Password")
ForgotPasswordScreen
    ↓ (enter email/phone)
ForgotPasswordOTPScreen
    ↓ (verify OTP)
ResetPasswordScreen
    ↓ (create new password)
Success → Login Screen
```

**New Screens Required**:
1. `app/(auth)/forgot-password.tsx` - Enter email/phone
2. `app/(auth)/forgot-password-otp.tsx` - Verify OTP
3. `app/(auth)/reset-password.tsx` - Create new password

**State Management**:
```typescript
// No global state needed - use navigation params
router.push({
  pathname: "/forgot-password-otp",
  params: { 
    identifier: email, // or phone
    type: "email" // or "phone"
  }
});
```

**API Integration** (Mock):
```typescript
// modules/auth/api.ts
export const authApi = {
  // ... existing methods
  
  forgotPassword: (identifier: string) =>
    apiClient.post("/auth/forgot-password", { identifier }),
  
  verifyResetOTP: (identifier: string, otp: string) =>
    apiClient.post("/auth/verify-reset-otp", { identifier, otp }),
  
  resetPassword: (resetToken: string, newPassword: string) =>
    apiClient.post("/auth/reset-password", { resetToken, newPassword }),
};

// modules/auth/hooks.ts
export function useForgotPassword() {
  return useMutation({
    mutationFn: (identifier: string) => authApi.forgotPassword(identifier),
  });
}

export function useVerifyResetOTP() {
  return useMutation({
    mutationFn: ({ identifier, otp }: { identifier: string; otp: string }) =>
      authApi.verifyResetOTP(identifier, otp),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ resetToken, newPassword }: { resetToken: string; newPassword: string }) =>
      authApi.resetPassword(resetToken, newPassword),
  });
}
```

---

### 2.4 Admin Login Architecture

**Decision**: Use hardcoded admin credentials for testing.

**Implementation**:
```typescript
// assets/data/auth.ts
export const MOCK_CREDENTIALS = {
  admin: {
    email: "admin@speqlink.com",
    password: "admin123", // or any password
    role: "admin",
    user: {
      id: "admin_001",
      name: "Admin User",
      email: "admin@speqlink.com",
      phone: "+254712345678",
      avatar: null,
      isHost: false,
      isVerified: true,
      createdAt: new Date().toISOString(),
    },
  },
};

// modules/auth/api.ts - Mock login logic
export const authApi = {
  login: async (payload: LoginPayload) => {
    // Check if admin
    if (payload.email === MOCK_CREDENTIALS.admin.email) {
      return {
        user: { ...MOCK_CREDENTIALS.admin.user, role: "admin" },
        accessToken: "mock_admin_token",
        refreshToken: "mock_admin_refresh",
      };
    }
    
    // Regular API call
    return apiClient.post<AuthResponse>("/auth/login", payload)
      .then((r) => r.data);
  },
};
```

**Role-Based Routing**:
```typescript
// app/(auth)/login.tsx
function routeByRole(user: User, router: ReturnType<typeof useRouter>) {
  const role = (user as any).role;
  
  switch (role) {
    case "admin":
    case "super_admin":
      router.replace("/(admin)/dashboard" as never);
      break;
    default:
      router.replace("/(tabs)/home");
  }
}
```

---

### 2.5 OTP Auto-Fill Architecture

**Platform-Specific Implementation**:

**iOS**:
```typescript
<TextInput
  textContentType="oneTimeCode" // iOS auto-fill
  keyboardType="numeric"
  autoComplete="sms-otp" // iOS 12+
  // ... other props
/>
```

**Android**:
```typescript
// Use SMS Retriever API (future enhancement)
// For now, rely on keyboard suggestions
<TextInput
  autoComplete="sms-otp" // Android auto-fill
  keyboardType="numeric"
  // ... other props
/>
```

**Paste Detection**:
```typescript
function OtpInput({ value, onChange }: Props) {
  function handleChange(i: number, text: string) {
    // Detect paste (multiple digits)
    if (text.length > 1) {
      const digits = text.replace(/\D/g, "").slice(0, 6).split("");
      const next = [...value];
      digits.forEach((d, j) => {
        if (i + j < 6) next[i + j] = d;
      });
      onChange(next);
      // Focus last filled box
      refs[Math.min(i + digits.length, 5)].current?.focus();
      return;
    }
    
    // Single digit entry
    // ... existing logic
  }
  
  return (
    // ... OTP boxes
  );
}
```

---

### 2.6 Session Persistence Architecture

**Token Storage Strategy**:
```typescript
// lib/storage/secure.ts
import * as SecureStore from 'expo-secure-store';

const KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  USER_DATA: 'auth_user_data',
};

export const secureStorage = {
  async setTokens(accessToken: string, refreshToken: string) {
    await Promise.all([
      SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, accessToken),
      SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, refreshToken),
    ]);
  },
  
  async getTokens() {
    const [accessToken, refreshToken] = await Promise.all([
      SecureStore.getItemAsync(KEYS.ACCESS_TOKEN),
      SecureStore.getItemAsync(KEYS.REFRESH_TOKEN),
    ]);
    return { accessToken, refreshToken };
  },
  
  async setUser(user: User) {
    await SecureStore.setItemAsync(KEYS.USER_DATA, JSON.stringify(user));
  },
  
  async getUser(): Promise<User | null> {
    const data = await SecureStore.getItemAsync(KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  },
  
  async clearAll() {
    await Promise.all([
      SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN),
      SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN),
      SecureStore.deleteItemAsync(KEYS.USER_DATA),
    ]);
  },
};
```

**Zustand Integration**:
```typescript
// store/auth.store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { secureStorage } from '@/lib/storage/secure';

// Custom storage adapter for SecureStore
const secureStoreAdapter = {
  getItem: async (name: string) => {
    const value = await SecureStore.getItemAsync(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: async (name: string, value: any) => {
    await SecureStore.setItemAsync(name, JSON.stringify(value));
  },
  removeItem: async (name: string) => {
    await SecureStore.deleteItemAsync(name);
  },
};

export const tokenStore = create(
  persist<TokenState>(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      setTokens: (access, refresh) =>
        set({ accessToken: access, refreshToken: refresh }),
      clearTokens: () =>
        set({ accessToken: null, refreshToken: null }),
    }),
    {
      name: 'auth-tokens',
      storage: createJSONStorage(() => secureStoreAdapter),
    }
  )
);
```

**Auto-Login on App Launch**:
```typescript
// app/index.tsx
export default function IndexScreen() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    async function checkAuth() {
      const { accessToken } = await secureStorage.getTokens();
      
      if (accessToken) {
        // Verify token is still valid
        try {
          const user = await authApi.me();
          useAuthStore.getState().setUser(user);
          routeByRole(user, router);
        } catch {
          // Token invalid, clear and show auth
          await secureStorage.clearAll();
          router.replace('/auth');
        }
      } else {
        router.replace('/auth');
      }
      
      setIsReady(true);
    }
    
    checkAuth();
  }, []);
  
  if (!isReady) return <SplashScreen />;
  return null;
}
```

---

### 2.7 Google OAuth Architecture

**Configuration**:
```typescript
// lib/auth/google.ts
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });
  
  return { request, response, promptAsync };
}
```

**Simulation Mode** (for testing):
```typescript
// assets/data/auth.ts
export const MOCK_GOOGLE_USER = {
  id: "google_123456",
  name: "Google Test User",
  email: "testuser@gmail.com",
  avatar: "https://lh3.googleusercontent.com/a/default-user",
  isHost: false,
  isVerified: true,
  createdAt: new Date().toISOString(),
};

// modules/auth/api.ts
export const authApi = {
  loginWithGoogle: async (idToken: string) => {
    // Simulation mode
    if (process.env.EXPO_PUBLIC_MOCK_AUTH === 'true') {
      await new Promise(r => setTimeout(r, 1000));
      return {
        user: MOCK_GOOGLE_USER,
        accessToken: "mock_google_token",
        refreshToken: "mock_google_refresh",
      };
    }
    
    // Real API call
    return apiClient
      .post<AuthResponse>("/auth/google", { idToken })
      .then((r) => r.data);
  },
};
```

**Integration in Screens**:
```typescript
// app/(auth)/google.tsx
export default function GoogleAuthScreen() {
  const router = useRouter();
  const { promptAsync } = useGoogleAuth();
  const googleLogin = useGoogleLogin();
  
  async function handleGoogleSignIn() {
    try {
      const result = await promptAsync();
      
      if (result.type === 'success') {
        const { id_token } = result.params;
        const data = await googleLogin.mutateAsync(id_token);
        routeByRole(data.user, router);
      }
    } catch (error) {
      // Handle error
    }
  }
  
  return (
    // ... UI
  );
}
```

---

### 2.8 Terms Acceptance Architecture

**One-Time Acceptance Strategy**:

**Backend Flag** (when API ready):
```typescript
interface User {
  // ... existing fields
  termsAcceptedAt?: string; // ISO timestamp
  termsVersion?: string; // e.g., "1.0"
}
```

**Frontend Logic**:
```typescript
// app/(auth)/sign-up.tsx
// Show terms acceptance (already implemented)

// app/(auth)/onboarding-complete.tsx
// Remove terms acceptance (already shown in sign-up)
// Just show final confirmation

// Future logins
// Check user.termsAcceptedAt
// If null, show terms modal
// If set, skip terms
```

**Conditional Rendering**:
```typescript
function TermsModal({ user }: { user: User }) {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Show if user hasn't accepted latest terms
    if (!user.termsAcceptedAt || needsReacceptance(user.termsVersion)) {
      setVisible(true);
    }
  }, [user]);
  
  if (!visible) return null;
  
  return (
    <Modal>
      {/* Terms content */}
      <Button onPress={async () => {
        await authApi.acceptTerms();
        setVisible(false);
      }}>
        Accept
      </Button>
    </Modal>
  );
}
```

---

## 3. Component Design

### 3.1 New Components

#### ForgotPasswordScreen
```typescript
// app/(auth)/forgot-password.tsx
interface Props {}

export default function ForgotPasswordScreen() {
  const [identifier, setIdentifier] = useState("");
  const [type, setType] = useState<"email" | "phone">("email");
  const forgotPassword = useForgotPassword();
  
  async function handleSendOTP() {
    await forgotPassword.mutateAsync(identifier);
    router.push({
      pathname: "/forgot-password-otp",
      params: { identifier, type },
    });
  }
  
  return (
    <AuthLayout>
      {/* Email/Phone input */}
      {/* Type toggle */}
      {/* Send OTP button */}
    </AuthLayout>
  );
}
```

#### ForgotPasswordOTPScreen
```typescript
// app/(auth)/forgot-password-otp.tsx
export default function ForgotPasswordOTPScreen() {
  const { identifier, type } = useLocalSearchParams();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const verifyOTP = useVerifyResetOTP();
  
  async function handleVerify() {
    const { resetToken } = await verifyOTP.mutateAsync({
      identifier,
      otp: otp.join(""),
    });
    
    router.push({
      pathname: "/reset-password",
      params: { resetToken },
    });
  }
  
  return (
    <AuthLayout>
      {/* OTP input (reuse OtpInput component) */}
      {/* Verify button */}
      {/* Resend OTP */}
    </AuthLayout>
  );
}
```

#### ResetPasswordScreen
```typescript
// app/(auth)/reset-password.tsx
export default function ResetPasswordScreen() {
  const { resetToken } = useLocalSearchParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const resetPassword = useResetPassword();
  
  async function handleReset() {
    await resetPassword.mutateAsync({ resetToken, newPassword: password });
    router.replace("/login");
  }
  
  return (
    <AuthLayout>
      {/* Password input with strength indicator */}
      {/* Confirm password */}
      {/* Reset button */}
    </AuthLayout>
  );
}
```

### 3.2 Modified Components

#### Login Screen
```typescript
// app/(auth)/login.tsx
// Add forgot password link
<TouchableOpacity 
  onPress={() => router.push("/forgot-password")}
  activeOpacity={0.7} 
  className="self-start mb-10"
>
  <Text className="font-inter-medium text-primary-700 underline" style={{ fontSize: 16 }}>
    Forgot password?
  </Text>
</TouchableOpacity>
```

#### Onboarding Role Screen
```typescript
// app/(auth)/onboarding-role.tsx
// Wrap RoleGrid in Animated.View
<Animated.View style={{ transform: [{ translateY: gridTranslateY }] }}>
  <RoleGrid
    selectedRole={selectedRole}
    onSelect={handleRoleSelect}
  />
</Animated.View>

// Add spacing for response
{selectedRole && (
  <View style={{ marginTop: 24 }}>
    <AgentBubble
      message={ROLE_MESSAGES[selectedRole]}
      onComplete={() => setTypedRole(selectedRole)}
    />
  </View>
)}
```

---

## 4. Data Flow Diagrams

### 4.1 Forgot Password Flow
```
User (Login Screen)
    ↓ tap "Forgot Password"
ForgotPasswordScreen
    ↓ enter email/phone
    ↓ tap "Send OTP"
API: POST /auth/forgot-password
    ↓ OTP sent
ForgotPasswordOTPScreen
    ↓ enter OTP
    ↓ tap "Verify"
API: POST /auth/verify-reset-otp
    ↓ resetToken received
ResetPasswordScreen
    ↓ enter new password
    ↓ tap "Reset Password"
API: POST /auth/reset-password
    ↓ success
Login Screen (with success message)
```

### 4.2 Session Persistence Flow
```
App Launch
    ↓
Check SecureStore for tokens
    ↓
    ├─ Tokens found
    │   ↓
    │   Verify with API: GET /auth/me
    │   ↓
    │   ├─ Valid → Route to appropriate screen
    │   └─ Invalid → Clear tokens → Auth Screen
    │
    └─ No tokens → Auth Screen
```

### 4.3 Google OAuth Flow
```
User taps "Continue with Google"
    ↓
expo-auth-session opens Google OAuth
    ↓
User authorizes
    ↓
Receive id_token
    ↓
API: POST /auth/google { idToken }
    ↓
Receive { user, accessToken, refreshToken }
    ↓
Store in SecureStore
    ↓
Update Zustand store
    ↓
Route to appropriate screen
```

---

## 5. State Management Design

### 5.1 Zustand Stores (No Changes)
- `tokenStore` - Already handles tokens
- `useAuthStore` - Already handles user state

### 5.2 TanStack Query Keys
```typescript
// modules/auth/hooks.ts
export const authKeys = {
  me: ["auth", "me"] as const,
  forgotPassword: ["auth", "forgot-password"] as const,
  verifyResetOTP: ["auth", "verify-reset-otp"] as const,
  resetPassword: ["auth", "reset-password"] as const,
};
```

---

## 6. API Integration Design

### 6.1 Mock Data Structure
```typescript
// assets/data/auth.ts
export const mockAuthData = {
  admin: {
    email: "admin@speqlink.com",
    password: "any",
    user: { /* ... */ },
  },
  
  otpCode: "123456",
  
  googleUser: { /* ... */ },
  
  // Simulate API responses
  responses: {
    forgotPassword: { message: "OTP sent", otpSent: true },
    verifyResetOTP: { resetToken: "mock_reset_token_123" },
    resetPassword: { message: "Password reset successful" },
  },
};
```

### 6.2 API Client Updates
```typescript
// modules/auth/api.ts
export const authApi = {
  // ... existing methods
  
  forgotPassword: (identifier: string) => {
    // Mock mode
    if (process.env.EXPO_PUBLIC_MOCK_AUTH === 'true') {
      return Promise.resolve(mockAuthData.responses.forgotPassword);
    }
    return apiClient.post("/auth/forgot-password", { identifier });
  },
  
  // ... other new methods
};
```

---

## 7. Performance Considerations

### 7.1 Font Loading
- Load fonts in parallel
- Show splash screen until fonts ready
- Use font display swap strategy

### 7.2 Animation Performance
- Use `useNativeDriver: true` for all animations
- Keep animations under 300ms
- Use spring animations for natural feel
- Avoid layout animations (use transform only)

### 7.3 SecureStore Performance
- Batch read/write operations
- Cache tokens in memory (Zustand)
- Only read from SecureStore on app launch

---

## 8. Security Considerations

### 8.1 Token Storage
- Use SecureStore (encrypted on device)
- Never log tokens
- Clear tokens on logout
- Implement token refresh

### 8.2 OTP Security
- 6-digit codes only
- Expire after 5 minutes
- Rate limit resend (60 seconds)
- Clear OTP after verification

### 8.3 Password Security
- Minimum 8 characters
- Require uppercase + number
- Show strength indicator
- Never store plain text

---

## 9. Error Handling Design

### 9.1 Network Errors
```typescript
try {
  await authApi.login(credentials);
} catch (error) {
  if (error.status === 401) {
    showError("Invalid credentials");
  } else if (error.status === 429) {
    showError("Too many attempts. Try again later.");
  } else {
    showError("Network error. Please try again.");
  }
}
```

### 9.2 Validation Errors
- Show inline errors below inputs
- Highlight invalid fields
- Clear errors on input change
- Prevent submission if invalid

---

## 10. Testing Strategy

### 10.1 Manual Testing Checklist
- [ ] Font readability on all screens
- [ ] Role selection animation smooth
- [ ] Forgot password flow complete
- [ ] Admin login works
- [ ] OTP auto-fill works (iOS & Android)
- [ ] Session persists between app restarts
- [ ] Google OAuth simulation works
- [ ] Terms shown only once

### 10.2 Edge Cases
- [ ] No internet connection
- [ ] Invalid OTP
- [ ] Expired tokens
- [ ] OAuth cancellation
- [ ] Weak passwords
- [ ] Duplicate emails

---

## 11. Migration Plan

### 11.1 Font Migration
1. Install new font packages
2. Update `_layout.tsx`
3. Update `tailwind.config.ts`
4. Update `constants/tokens.ts`
5. Update all auth screens (find/replace)
6. Test on iOS & Android

### 11.2 Backward Compatibility
- Existing auth flow continues to work
- New features are additive
- No breaking changes to API contracts

---

## 12. Deployment Checklist

- [ ] Install dependencies (`pnpm install`)
- [ ] Configure environment variables
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Test on physical devices
- [ ] Run `npx expo-doctor`
- [ ] Run `npx expo prebuild --clean`
- [ ] Build preview

---

## 13. Success Metrics

### 13.1 Performance
- Font load time < 500ms
- Animation frame rate = 60fps
- SecureStore read/write < 100ms
- Screen transition < 300ms

### 13.2 User Experience
- Zero blurry text
- Smooth animations
- Clear error messages
- Intuitive navigation

---

**Status**: ✅ Design Complete - Ready for Task Breakdown

**Next Phase**: Create `tasks.md` with implementation tasks
