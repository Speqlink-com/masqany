# Auth Module Fixes - Summary

## Date: May 14, 2026

## Issues Identified

### 1. ✅ Role Confirmation Flow
**Problem**: Confirmation message and "Acknowledge & Continue" button were shown inline on the role selection screen, making it cluttered.

**Solution**: Created a new screen `onboarding-role-confirmation.tsx` that shows the confirmation message separately.

**Changes Made**:
- Created `/app/(auth)/onboarding-role-confirmation.tsx` - New screen for role confirmation
- Updated `/app/(auth)/onboarding-role.tsx` - Simplified to only show role selection, navigates to confirmation screen immediately

**Flow**:
1. User selects role → Immediately navigates to confirmation screen
2. Confirmation screen shows role-specific message
3. User clicks "Acknowledge & Continue" → Goes to credentials screen

### 2. ⚠️ Driver Role Not Saved (NEEDS BACKEND FIX)
**Problem**: When user selects "Relocation Driver" role, the vehicle registration screen shows "you do not have permission to register vehicle, only drivers can register vehicles"

**Root Cause**: The role is passed through navigation params but never saved to the user profile in the auth store. The `onboarding-complete.tsx` has a TODO comment indicating `useRegister()` should be called.

**Current Code** (onboarding-complete.tsx line 104):
```typescript
<PrimaryButton
  label="Acknowledge & Finish"
  onPress={() => {
    // TODO: call useRegister() with { name, role, email, phone }
    router.replace(getNextRoute(role ?? "") as never);
  }}
  disabled={!accepted}
/>
```

**What Needs to be Done**:
1. Create `useRegister()` hook in `modules/auth/hooks.ts`
2. Call the registration API endpoint with user data including role
3. Save the user object (with role) to auth store
4. Only then navigate to the next screen

**Temporary Workaround** (for testing):
You can manually set the user role in the auth store after registration for testing purposes.

### 3. ⚠️ Move Tab - Map Module (NEEDS IMPLEMENTATION)
**Problem**: Move tab currently shows a placeholder "coming soon" message

**Solution Needed**: Implement a map-based relocation service booking interface

**Suggested Implementation**:
- Use `react-native-maps` or `expo-location` + map provider
- Show driver locations on map
- Allow users to request pickup/delivery
- Integrate with relocation booking API

**Current State**: Placeholder screen with background image

## Files Created

1. `/app/(auth)/onboarding-role-confirmation.tsx` - New confirmation screen
2. `/docs/VIDEO_FEED_MODULE.md` - Complete video feed documentation with API endpoints

## Files Modified

1. `/app/(auth)/onboarding-role.tsx` - Simplified role selection screen

## Remaining Tasks

### High Priority
1. **Implement useRegister() hook**
   - Location: `modules/auth/hooks.ts`
   - Should call POST `/auth/register` endpoint
   - Should save user data (including role) to auth store
   - Should handle errors gracefully

2. **Fix onboarding-complete.tsx**
   - Replace TODO with actual `useRegister()` call
   - Show loading state during registration
   - Handle registration errors
   - Only navigate after successful registration

### Medium Priority
3. **Implement Move Tab Map Module**
   - Install map dependencies
   - Create map component
   - Implement driver location tracking
   - Add booking interface
   - Connect to relocation API

### Low Priority
4. **Add role persistence**
   - Save role to AsyncStorage
   - Restore role on app restart
   - Sync with backend on login

## API Endpoints Needed

### 1. User Registration
**POST** `/auth/register`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+254712345678",
  "password": "SecurePass123",
  "role": "relocation_driver"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-001",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+254712345678",
      "role": "relocation_driver",
      "isHost": false,
      "isVerified": false,
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc..."
    }
  }
}
```

### 2. Get Current User
**GET** `/auth/me`

**Headers**:
```
Authorization: Bearer {accessToken}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "user-001",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+254712345678",
    "role": "relocation_driver",
    "isHost": false,
    "isVerified": false,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

## Testing Checklist

### Role Selection Flow
- [ ] Select "Property Owner" → See confirmation message → Continue to credentials
- [ ] Select "Property Agent" → See confirmation message → Continue to credentials
- [ ] Select "Relocation Driver" → See confirmation message → Continue to credentials
- [ ] Select "Tenant" → See confirmation message → Continue to credentials
- [ ] Back button works on confirmation screen
- [ ] Confirmation message types out correctly
- [ ] "Acknowledge & Continue" button appears after typing completes

### Driver Role Registration (After Backend Fix)
- [ ] Select "Relocation Driver" role
- [ ] Complete credentials and OTP
- [ ] Accept terms and finish registration
- [ ] Should navigate to vehicle registration prompt
- [ ] Should NOT show "permission denied" error
- [ ] Should be able to complete vehicle registration

### Role Persistence
- [ ] Register as driver
- [ ] Close app
- [ ] Reopen app
- [ ] Role should still be "relocation_driver"
- [ ] Should be able to access vehicle registration

## Code Examples

### Example: useRegister Hook Implementation

```typescript
// modules/auth/hooks.ts
import { useMutation } from '@tanstack/react-query';
import { authApi } from './api';
import { useAuthStore, tokenStore } from '@/store/auth.store';

export function useRegister() {
  const setUser = useAuthStore((s) => s.setUser);
  const setTokens = tokenStore((s) => s.setTokens);

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      // Save tokens
      setTokens(data.tokens.accessToken, data.tokens.refreshToken);
      
      // Save user to store
      setUser(data.user);
    },
    onError: (error) => {
      console.error('[useRegister] Error:', error);
    },
  });
}
```

### Example: Updated onboarding-complete.tsx

```typescript
import { useRegister } from '@/modules/auth/hooks';

export default function OnboardingCompleteScreen() {
  const router = useRouter();
  const { name, role, email, phone, password } = useLocalSearchParams();
  const registerMutation = useRegister();

  const handleFinish = async () => {
    try {
      await registerMutation.mutateAsync({
        name: name ?? '',
        email: email ?? '',
        phone: phone ?? '',
        password: password ?? '',
        role: role as UserRole,
      });
      
      // Navigate after successful registration
      router.replace(getNextRoute(role ?? '') as never);
    } catch (error) {
      Alert.alert('Registration Failed', 'Please try again');
    }
  };

  return (
    // ... UI code
    <PrimaryButton
      label={registerMutation.isPending ? "Registering..." : "Acknowledge & Finish"}
      onPress={handleFinish}
      disabled={!accepted || registerMutation.isPending}
    />
  );
}
```

## Notes

- The role selection flow has been improved with a separate confirmation screen
- The driver role permission issue is a backend integration problem, not a UI bug
- The permissions check in `lib/permissions/index.ts` is working correctly
- The issue is that the role is never saved to the user object in the auth store
- Once the backend registration is implemented, the driver role will work correctly

## Next Steps

1. **Immediate**: Test the new role confirmation flow
2. **Short-term**: Implement `useRegister()` hook and fix registration
3. **Medium-term**: Implement map module in move tab
4. **Long-term**: Add comprehensive error handling and offline support

## Support

For questions or issues:
- **Email**: dev@masqany.com
- **Slack**: #auth-module
- **Documentation**: https://docs.masqany.com/auth
