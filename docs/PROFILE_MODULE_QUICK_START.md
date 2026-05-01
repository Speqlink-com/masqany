# Profile Module - Quick Start Guide

## 🚀 Getting Started

This guide helps you quickly integrate and use the Profile Module in your application.

---

## Installation

The Profile Module is already integrated. No additional installation required.

---

## Basic Usage

### 1. Display User Profile

```typescript
import { useProfile } from '@/modules/profile';
import { ProfileHeader } from '@/components/profile';

function MyScreen() {
  const { data: profile, isLoading } = useProfile();
  
  return (
    <ProfileHeader
      user={profile}
      isLoading={isLoading}
      onEditPress={() => router.push('/(profile)/edit-profile')}
    />
  );
}
```

### 2. Update Profile

```typescript
import { useUpdateProfile } from '@/modules/profile';

function EditProfile() {
  const updateProfile = useUpdateProfile();
  
  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890"
      });
      Alert.alert("Success", "Profile updated!");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
}
```

### 3. Upload Avatar

```typescript
import { useUploadAvatar } from '@/modules/profile';
import * as ImagePicker from 'expo-image-picker';

function AvatarPicker() {
  const uploadAvatar = useUploadAvatar();
  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      const formData = new FormData();
      formData.append('avatar', {
        uri: result.assets[0].uri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      } as any);
      
      await uploadAvatar.mutateAsync(formData);
    }
  };
}
```

### 4. Change Language

```typescript
import { useUpdateLanguage } from '@/modules/profile';

function LanguageSelector() {
  const updateLanguage = useUpdateLanguage();
  
  const changeLanguage = async (lang: 'en' | 'sw') => {
    await updateLanguage.mutateAsync({ language: lang });
  };
}
```

### 5. Update Notifications

```typescript
import { useUpdateNotifications } from '@/modules/profile';

function NotificationToggle() {
  const updateNotifications = useUpdateNotifications();
  
  const toggleNotification = async (key: string, value: boolean) => {
    await updateNotifications.mutateAsync({
      preferences: {
        ...currentPreferences,
        [key]: value
      }
    });
  };
}
```

### 6. Logout

```typescript
import { useLogout } from '@/modules/profile';

function LogoutButton() {
  const logout = useLogout();
  
  const handleLogout = async () => {
    await logout.mutateAsync();
    router.replace('/auth');
  };
}
```

---

## Common Patterns

### Loading States

```typescript
const { data, isLoading, error } = useProfile();

if (isLoading) {
  return <ProfileSkeleton />;
}

if (error) {
  return <ErrorView message={error.message} onRetry={refetch} />;
}

return <ProfileContent data={data} />;
```

### Optimistic Updates

```typescript
const updateNotifications = useUpdateNotifications();

const handleToggle = async (key: string, value: boolean) => {
  // Update UI immediately
  setLocalState({ ...localState, [key]: value });
  
  try {
    await updateNotifications.mutateAsync({ preferences: newPreferences });
  } catch (error) {
    // Revert on error
    setLocalState(previousState);
    Alert.alert("Error", "Failed to update");
  }
};
```

### Form Validation

```typescript
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

const handleSubmit = () => {
  if (!validateEmail(email)) {
    setErrors({ email: "Invalid email format" });
    return;
  }
  // Proceed with submission
};
```

---

## Navigation

### Navigate to Profile Screens

```typescript
import { router } from 'expo-router';

// Edit Profile
router.push('/(profile)/edit-profile');

// Account Settings
router.push('/(profile)/account-settings');

// Language Preferences
router.push('/(profile)/language-preferences');

// Security Settings
router.push('/(profile)/security-settings');

// Notification Preferences
router.push('/(profile)/notification-preferences');

// Support
router.push('/(profile)/support');

// Policies
router.push('/(profile)/policies');

// Switch Account
router.push('/(profile)/switch-account');

// Add Account
router.push('/(profile)/add-account');
```

---

## Components

### Use Profile Components

```typescript
import {
  ProfileHeader,
  SettingsCard,
  ScreenHeader,
  ConfirmDialog,
  ProfileSkeleton,
  ErrorView
} from '@/components/profile';

// Profile Header
<ProfileHeader
  user={profile}
  isLoading={false}
  onEditPress={() => {}}
/>

// Settings Card
<SettingsCard
  icon={require('@/assets/icons/profile.webp')}
  label="Account Settings"
  onPress={() => {}}
  variant="default"
  delay={0}
/>

// Screen Header
<ScreenHeader title="Edit Profile" />

// Confirm Dialog
<ConfirmDialog
  visible={showDialog}
  title="Logout"
  message="Are you sure?"
  confirmText="Logout"
  cancelText="Cancel"
  onConfirm={() => {}}
  onCancel={() => {}}
  variant="danger"
/>

// Loading Skeleton
<ProfileSkeleton />

// Error View
<ErrorView
  message="Failed to load profile"
  onRetry={() => {}}
/>
```

---

## Multi-Account Management

### Get Accounts

```typescript
import { useAccounts } from '@/modules/profile';

function AccountList() {
  const { data: accountsData } = useAccounts();
  const accounts = accountsData?.accounts || [];
  const activeId = accountsData?.activeAccountId;
  
  return accounts.map(account => (
    <AccountCard
      key={account.id}
      account={account}
      isActive={account.id === activeId}
    />
  ));
}
```

### Switch Account

```typescript
import { useSwitchAccount } from '@/modules/profile';

function AccountSwitcher() {
  const switchAccount = useSwitchAccount();
  
  const handleSwitch = async (accountId: string) => {
    await switchAccount.mutateAsync(accountId);
    // Tokens and user are automatically updated
    // All queries are automatically invalidated
  };
}
```

### Add Account

```typescript
import { useAddAccount } from '@/modules/profile';

function AddAccountForm() {
  const addAccount = useAddAccount();
  
  const handleAdd = async () => {
    await addAccount.mutateAsync({
      email: "second@example.com",
      password: "password123"
    });
    // Accounts cache is automatically invalidated
  };
}
```

---

## Error Handling

### Handle API Errors

```typescript
const updateProfile = useUpdateProfile();

try {
  await updateProfile.mutateAsync(data);
  Alert.alert("Success", "Profile updated!");
} catch (error: any) {
  if (error.response?.status === 401) {
    Alert.alert("Error", "Session expired. Please login again.");
    router.replace('/auth');
  } else if (error.response?.status === 409) {
    Alert.alert("Error", "Email already in use.");
  } else {
    Alert.alert("Error", error.message || "Something went wrong.");
  }
}
```

### Handle Network Errors

```typescript
const { data, error, refetch } = useProfile();

if (error) {
  if (error.message.includes('Network')) {
    return (
      <ErrorView
        message="No internet connection"
        onRetry={refetch}
      />
    );
  }
  return (
    <ErrorView
      message="Failed to load profile"
      onRetry={refetch}
    />
  );
}
```

---

## TypeScript Tips

### Type Your Components

```typescript
import type { UserProfile } from '@/modules/profile';

interface ProfileCardProps {
  profile: UserProfile;
  onEdit: () => void;
}

function ProfileCard({ profile, onEdit }: ProfileCardProps) {
  // TypeScript will autocomplete profile properties
  return <Text>{profile.name}</Text>;
}
```

### Use Payload Types

```typescript
import type { ProfileUpdatePayload } from '@/modules/profile';

const [formData, setFormData] = useState<ProfileUpdatePayload>({
  name: "",
  email: "",
  phone: ""
});
```

---

## Performance Tips

### Memoize Components

```typescript
import React, { memo } from 'react';

const ProfileCard = memo(({ profile }: { profile: UserProfile }) => {
  return <View>...</View>;
});
```

### Use Callbacks

```typescript
import { useCallback } from 'react';

const handlePress = useCallback(() => {
  router.push('/(profile)/edit-profile');
}, []);
```

### Optimize Queries

```typescript
// Profile is cached for 5 minutes
const { data } = useProfile();

// Force refetch if needed
const { refetch } = useProfile();
await refetch();
```

---

## Styling

### Use Design Tokens

```typescript
import { colors, spacing, typography } from '@/constants/tokens';

<View style={{ 
  backgroundColor: colors.primary[700],
  padding: spacing.lg,
  borderRadius: 12
}}>
  <Text style={{
    fontFamily: typography.family.headingSemiBold,
    fontSize: typography.size.lg,
    color: colors.dark[400]
  }}>
    Profile
  </Text>
</View>
```

### Use NativeWind

```typescript
<View className="bg-primary-700 p-6 rounded-xl">
  <Text className="font-poppins-semibold text-lg text-dark-400">
    Profile
  </Text>
</View>
```

### Card Background Color

```typescript
// Always use #e1e6e8 for cards
<View style={{ backgroundColor: "#e1e6e8" }}>
  {/* Card content */}
</View>

// Or with NativeWind
<View className="rounded-lg p-4" style={{ backgroundColor: "#e1e6e8" }}>
  {/* Card content */}
</View>
```

---

## Testing

### Test Hooks

```typescript
import { renderHook, waitFor } from '@testing-library/react-native';
import { useProfile } from '@/modules/profile';

test('useProfile fetches profile data', async () => {
  const { result } = renderHook(() => useProfile());
  
  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });
  
  expect(result.current.data).toBeDefined();
});
```

### Test Components

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { SettingsCard } from '@/components/profile';

test('SettingsCard calls onPress', () => {
  const onPress = jest.fn();
  const { getByText } = render(
    <SettingsCard
      icon={mockIcon}
      label="Account Settings"
      onPress={onPress}
    />
  );
  
  fireEvent.press(getByText('Account Settings'));
  expect(onPress).toHaveBeenCalled();
});
```

---

## Debugging

### Check Query Cache

```typescript
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

// Get cached profile data
const cachedProfile = queryClient.getQueryData(['profile', 'detail']);
console.log('Cached profile:', cachedProfile);

// Invalidate cache
queryClient.invalidateQueries({ queryKey: ['profile'] });
```

### Log API Calls

```typescript
const updateProfile = useUpdateProfile();

updateProfile.mutate(data, {
  onSuccess: (data) => {
    console.log('Profile updated:', data);
  },
  onError: (error) => {
    console.error('Update failed:', error);
  }
});
```

---

## Best Practices

### ✅ Do's

- Use hooks from `modules/profile` for all data access
- Use design tokens for styling
- Handle loading and error states
- Validate forms before submission
- Use TypeScript types
- Memoize components and callbacks
- Cache data appropriately

### ❌ Don'ts

- Don't call API directly (use hooks)
- Don't hardcode colors (use tokens)
- Don't ignore error states
- Don't skip validation
- Don't use `any` types
- Don't create unnecessary re-renders
- Don't bypass cache invalidation

---

## Quick Reference

### Hooks
```typescript
// Queries
useProfile()          // Get profile (5 min cache)
useAccounts()         // Get accounts (10 min cache)

// Mutations
useUpdateProfile()    // Update profile
useUploadAvatar()     // Upload avatar
useUpdateLanguage()   // Update language
useUpdateNotifications() // Update notifications
useChangePassword()   // Change password
useToggleTwoFactor()  // Toggle 2FA
useSwitchAccount()    // Switch account
useAddAccount()       // Add account
useLogout()           // Logout
```

### Components
```typescript
ProfileHeader         // Avatar + name + email
SettingsCard          // Icon + label + chevron
ScreenHeader          // Back button + title
ConfirmDialog         // Confirmation modal
ProfileSkeleton       // Loading skeleton
ErrorView             // Error display
```

### Routes
```typescript
/(tabs)/profile                      // Main profile
/(profile)/edit-profile              // Edit form
/(profile)/account-settings          // Read-only view
/(profile)/language-preferences      // Language selector
/(profile)/security-settings         // Password + 2FA
/(profile)/notification-preferences  // Notification toggles
/(profile)/support                   // Support info
/(profile)/policies                  // Terms + Privacy
/(profile)/switch-account            // Account switcher
/(profile)/add-account               // Add account form
```

---

## Support

Need help? Check:
1. Full documentation: `docs/PROFILE_MODULE_DOCUMENTATION.md`
2. Module summary: `docs/PROFILE_MODULE_SUMMARY.md`
3. TanStack Query docs: https://tanstack.com/query
4. Expo Router docs: https://docs.expo.dev/router

---

**Happy Coding! 🚀**
