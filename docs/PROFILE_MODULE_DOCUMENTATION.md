# Profile Module Documentation

## Overview

The Profile Module provides comprehensive user profile management functionality including profile viewing/editing, account settings, security settings, notification preferences, multi-account management, and support access.

**Module Location**: `modules/profile/`  
**Screens Location**: `app/(profile)/`  
**Components Location**: `components/profile/`

---

## Architecture

### Module Structure

```
modules/profile/
├── types.ts          # TypeScript interfaces and types
├── api.ts            # API client methods
├── hooks.ts          # TanStack Query hooks (public API)
└── index.ts          # Barrel exports

app/(profile)/
├── _layout.tsx                    # Stack navigator layout
├── account-settings.tsx           # Read-only profile view
├── edit-profile.tsx               # Profile editing form
├── language-preferences.tsx       # Language selection
├── security-settings.tsx          # Password & 2FA management
├── notification-preferences.tsx   # Notification toggles
├── support.tsx                    # Support contact & FAQs
├── policies.tsx                   # Terms & Privacy viewer
├── switch-account.tsx             # Multi-account switcher
└── add-account.tsx                # Add new account

components/profile/
├── ProfileHeader.tsx      # Avatar, name, email display
├── SettingsCard.tsx       # Reusable settings card
├── ScreenHeader.tsx       # Back button + title header
├── ConfirmDialog.tsx      # Confirmation modal
├── ProfileSkeleton.tsx    # Loading skeleton
├── ErrorView.tsx          # Error state display
└── index.ts               # Barrel exports
```

---

## API Endpoints

### Base URL
All endpoints are relative to the API base URL configured in `lib/api/client.ts`.

### Authentication
All endpoints require authentication via Bearer token in the Authorization header.

---

## Endpoint Specifications

### 1. Get User Profile

**Endpoint**: `GET /user/profile`

**Description**: Retrieves the current user's complete profile information.

**Request Headers**:
```
Authorization: Bearer {access_token}
```

**Response** (200 OK):
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "avatar": "string | null",
  "isHost": "boolean",
  "isVerified": "boolean",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)",
  "language": "en | sw",
  "notificationPreferences": {
    "pushEnabled": "boolean",
    "emailEnabled": "boolean",
    "bookingNotifications": "boolean",
    "chatNotifications": "boolean",
    "promotionalNotifications": "boolean"
  },
  "securitySettings": {
    "twoFactorEnabled": "boolean",
    "twoFactorMethod": "sms | email | authenticator | null",
    "lastPasswordChange": "string (ISO 8601) | null"
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or expired token
- `404 Not Found`: User profile not found
- `500 Internal Server Error`: Server error

**Usage**:
```typescript
import { useProfile } from '@/modules/profile';

function MyComponent() {
  const { data: profile, isLoading, error } = useProfile();
  // Profile data is cached for 5 minutes
}
```

---

### 2. Update User Profile

**Endpoint**: `PUT /user/profile`

**Description**: Updates user profile information (name, email, phone, avatar).

**Request Headers**:
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "string (optional)",
  "email": "string (optional)",
  "phone": "string (optional)",
  "avatar": "string (optional)"
}
```

**Validation Rules**:
- `name`: 2-100 characters
- `email`: Valid email format
- `phone`: Valid phone format (E.164)
- `avatar`: Valid URL or base64 image

**Response** (200 OK):
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "avatar": "string | null",
  "isHost": "boolean",
  "isVerified": "boolean",
  "createdAt": "string",
  "updatedAt": "string"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Invalid or expired token
- `409 Conflict`: Email already in use
- `500 Internal Server Error`: Server error

**Usage**:
```typescript
import { useUpdateProfile } from '@/modules/profile';

function EditProfile() {
  const updateProfile = useUpdateProfile();
  
  const handleSave = async () => {
    await updateProfile.mutateAsync({
      name: "John Doe",
      email: "john@example.com"
    });
    // Profile cache is automatically invalidated
    // Auth store is automatically updated
  };
}
```

---

### 3. Upload Avatar

**Endpoint**: `POST /user/avatar`

**Description**: Uploads a new profile avatar image.

**Request Headers**:
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Request Body** (FormData):
```
avatar: File (image/jpeg, image/png, image/webp)
```

**File Requirements**:
- Max size: 5MB
- Formats: JPEG, PNG, WebP
- Recommended: Square aspect ratio, min 200x200px

**Response** (200 OK):
```json
{
  "avatarUrl": "string"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid file format or size
- `401 Unauthorized`: Invalid or expired token
- `413 Payload Too Large`: File exceeds size limit
- `500 Internal Server Error`: Server error

**Usage**:
```typescript
import { useUploadAvatar } from '@/modules/profile';
import * as ImagePicker from 'expo-image-picker';

function AvatarUpload() {
  const uploadAvatar = useUploadAvatar();
  
  const handleUpload = async () => {
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
      // Profile cache is automatically invalidated
    }
  };
}
```

---

### 4. Update Language Preference

**Endpoint**: `PUT /user/language`

**Description**: Updates the user's preferred language.

**Request Headers**:
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "language": "en | sw"
}
```

**Supported Languages**:
- `en`: English
- `sw`: Kiswahili

**Response** (200 OK):
```json
{
  "language": "en | sw"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid language code
- `401 Unauthorized`: Invalid or expired token
- `500 Internal Server Error`: Server error

**Usage**:
```typescript
import { useUpdateLanguage } from '@/modules/profile';

function LanguageSelector() {
  const updateLanguage = useUpdateLanguage();
  
  const handleLanguageChange = async (language: 'en' | 'sw') => {
    await updateLanguage.mutateAsync({ language });
    // Profile cache is automatically invalidated
  };
}
```

---

### 5. Update Notification Preferences

**Endpoint**: `PUT /user/notifications`

**Description**: Updates user notification preferences.

**Request Headers**:
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "preferences": {
    "pushEnabled": "boolean",
    "emailEnabled": "boolean",
    "bookingNotifications": "boolean",
    "chatNotifications": "boolean",
    "promotionalNotifications": "boolean"
  }
}
```

**Response** (200 OK):
```json
{
  "preferences": {
    "pushEnabled": "boolean",
    "emailEnabled": "boolean",
    "bookingNotifications": "boolean",
    "chatNotifications": "boolean",
    "promotionalNotifications": "boolean"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid preferences data
- `401 Unauthorized`: Invalid or expired token
- `500 Internal Server Error`: Server error

**Usage**:
```typescript
import { useUpdateNotifications } from '@/modules/profile';

function NotificationSettings() {
  const updateNotifications = useUpdateNotifications();
  
  const handleToggle = async (key: string, value: boolean) => {
    await updateNotifications.mutateAsync({
      preferences: {
        ...currentPreferences,
        [key]: value
      }
    });
    // Notifications cache is automatically invalidated
  };
}
```

---

### 6. Change Password

**Endpoint**: `POST /user/password/change`

**Description**: Changes the user's password.

**Request Headers**:
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "currentPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

**Password Requirements**:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

**Response** (200 OK):
```json
{
  "message": "Password changed successfully"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid password format or passwords don't match
- `401 Unauthorized`: Invalid current password or expired token
- `422 Unprocessable Entity`: Password doesn't meet requirements
- `500 Internal Server Error`: Server error

**Usage**:
```typescript
import { useChangePassword } from '@/modules/profile';

function PasswordChange() {
  const changePassword = useChangePassword();
  
  const handleSubmit = async () => {
    await changePassword.mutateAsync({
      currentPassword: "oldPass123!",
      newPassword: "newPass456!",
      confirmPassword: "newPass456!"
    });
  };
}
```

---

### 7. Toggle Two-Factor Authentication

**Endpoint**: `POST /user/2fa/toggle`

**Description**: Enables or disables two-factor authentication.

**Request Headers**:
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "enabled": "boolean",
  "method": "sms | email | authenticator (required if enabled=true)",
  "verificationCode": "string (required if enabled=true)"
}
```

**2FA Methods**:
- `sms`: SMS text message
- `email`: Email verification
- `authenticator`: TOTP authenticator app

**Response** (200 OK):
```json
{
  "twoFactorEnabled": "boolean",
  "twoFactorMethod": "sms | email | authenticator | null",
  "backupCodes": ["string"] // Only returned when enabling 2FA
}
```

**Error Responses**:
- `400 Bad Request`: Invalid method or missing verification code
- `401 Unauthorized`: Invalid or expired token
- `403 Forbidden`: Invalid verification code
- `500 Internal Server Error`: Server error

**Usage**:
```typescript
import { useToggleTwoFactor } from '@/modules/profile';

function TwoFactorSettings() {
  const toggleTwoFactor = useToggleTwoFactor();
  
  const handleEnable = async () => {
    await toggleTwoFactor.mutateAsync({
      enabled: true,
      method: "email",
      verificationCode: "123456"
    });
    // Security cache is automatically invalidated
  };
}
```

---

### 8. Get User Accounts

**Endpoint**: `GET /user/accounts`

**Description**: Retrieves all accounts associated with the current device (multi-account management).

**Request Headers**:
```
Authorization: Bearer {access_token}
```

**Response** (200 OK):
```json
{
  "accounts": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "guest | host",
      "avatar": "string | null"
    }
  ],
  "activeAccountId": "string"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or expired token
- `500 Internal Server Error`: Server error

**Usage**:
```typescript
import { useAccounts } from '@/modules/profile';

function AccountSwitcher() {
  const { data: accountsData } = useAccounts();
  const accounts = accountsData?.accounts || [];
  // Accounts data is cached for 10 minutes
}
```

---

### 9. Switch Account

**Endpoint**: `POST /user/accounts/switch`

**Description**: Switches to a different account.

**Request Headers**:
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "accountId": "string"
}
```

**Response** (200 OK):
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "avatar": "string | null",
    "isHost": "boolean",
    "isVerified": "boolean",
    "createdAt": "string"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid account ID
- `401 Unauthorized`: Invalid or expired token
- `403 Forbidden`: Account not accessible
- `404 Not Found`: Account not found
- `500 Internal Server Error`: Server error

**Usage**:
```typescript
import { useSwitchAccount } from '@/modules/profile';

function AccountList() {
  const switchAccount = useSwitchAccount();
  
  const handleSwitch = async (accountId: string) => {
    await switchAccount.mutateAsync(accountId);
    // Tokens are automatically updated
    // User is automatically updated in auth store
    // All queries are automatically invalidated
  };
}
```

---

### 10. Add Account

**Endpoint**: `POST /user/accounts/add`

**Description**: Adds a new account to the device (max 5 accounts).

**Request Headers**:
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response** (200 OK):
```json
{
  "account": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "guest | host",
    "avatar": "string | null"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid credentials or max accounts reached
- `401 Unauthorized`: Invalid or expired token
- `403 Forbidden`: Account limit reached (5 accounts max)
- `404 Not Found`: Account not found
- `500 Internal Server Error`: Server error

**Usage**:
```typescript
import { useAddAccount } from '@/modules/profile';

function AddAccount() {
  const addAccount = useAddAccount();
  
  const handleAdd = async () => {
    await addAccount.mutateAsync({
      email: "second@example.com",
      password: "password123!"
    });
    // Accounts cache is automatically invalidated
  };
}
```

---

### 11. Logout

**Endpoint**: `POST /auth/logout`

**Description**: Logs out the current user and invalidates tokens.

**Request Headers**:
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "refreshToken": "string"
}
```

**Response** (200 OK):
```json
{
  "message": "Logged out successfully"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or expired token
- `500 Internal Server Error`: Server error

**Usage**:
```typescript
import { useLogout } from '@/modules/profile';

function LogoutButton() {
  const logout = useLogout();
  
  const handleLogout = async () => {
    await logout.mutateAsync();
    // Tokens are automatically cleared
    // Session is automatically cleared
    // All query cache is automatically cleared
    // User is redirected to auth screen
  };
}
```

---

## TypeScript Types

### Core Types

```typescript
// User Profile
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  isHost: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  language: LanguageCode;
  notificationPreferences: NotificationPreferences;
  securitySettings: SecuritySettings;
}

// Language
export type LanguageCode = "en" | "sw";

// Notification Preferences
export interface NotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
  bookingNotifications: boolean;
  chatNotifications: boolean;
  promotionalNotifications: boolean;
}

// Security Settings
export interface SecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorMethod: "sms" | "email" | "authenticator" | null;
  lastPasswordChange: string | null;
}

// Account
export interface Account {
  id: string;
  name: string;
  email: string;
  role: "guest" | "host";
  avatar: string | null;
}

// Multi-Account State
export interface MultiAccountState {
  accounts: Account[];
  activeAccountId: string;
}
```

### Payload Types

```typescript
// Profile Update
export interface ProfileUpdatePayload {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

// Language Update
export interface LanguageUpdatePayload {
  language: LanguageCode;
}

// Notification Update
export interface NotificationUpdatePayload {
  preferences: NotificationPreferences;
}

// Password Change
export interface PasswordChangePayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Two-Factor Toggle
export interface TwoFactorTogglePayload {
  enabled: boolean;
  method?: "sms" | "email" | "authenticator";
  verificationCode?: string;
}
```

---

## TanStack Query Hooks

### Query Hooks

#### useProfile()
Fetches the current user's profile.

**Cache Time**: 5 minutes  
**Returns**: `UseQueryResult<UserProfile>`

```typescript
const { data, isLoading, error, refetch } = useProfile();
```

#### useAccounts()
Fetches all user accounts for multi-account management.

**Cache Time**: 10 minutes  
**Returns**: `UseQueryResult<MultiAccountState>`

```typescript
const { data, isLoading, error } = useAccounts();
```

### Mutation Hooks

#### useUpdateProfile()
Updates user profile information.

**Side Effects**:
- Invalidates profile cache
- Updates auth store with new user data

```typescript
const updateProfile = useUpdateProfile();
await updateProfile.mutateAsync({ name: "New Name" });
```

#### useUploadAvatar()
Uploads a new profile avatar.

**Side Effects**:
- Invalidates profile cache

```typescript
const uploadAvatar = useUploadAvatar();
await uploadAvatar.mutateAsync(formData);
```

#### useUpdateLanguage()
Updates language preference.

**Side Effects**:
- Invalidates profile cache

```typescript
const updateLanguage = useUpdateLanguage();
await updateLanguage.mutateAsync({ language: "sw" });
```

#### useUpdateNotifications()
Updates notification preferences.

**Side Effects**:
- Invalidates notifications cache

```typescript
const updateNotifications = useUpdateNotifications();
await updateNotifications.mutateAsync({ preferences });
```

#### useChangePassword()
Changes user password.

**Side Effects**: None (stateless operation)

```typescript
const changePassword = useChangePassword();
await changePassword.mutateAsync({ currentPassword, newPassword, confirmPassword });
```

#### useToggleTwoFactor()
Toggles two-factor authentication.

**Side Effects**:
- Invalidates security cache

```typescript
const toggleTwoFactor = useToggleTwoFactor();
await toggleTwoFactor.mutateAsync({ enabled: true, method: "email", verificationCode: "123456" });
```

#### useSwitchAccount()
Switches to a different account.

**Side Effects**:
- Updates tokens in token store
- Updates user in auth store
- Invalidates all queries

```typescript
const switchAccount = useSwitchAccount();
await switchAccount.mutateAsync(accountId);
```

#### useAddAccount()
Adds a new account to the device.

**Side Effects**:
- Invalidates accounts cache

```typescript
const addAccount = useAddAccount();
await addAccount.mutateAsync({ email, password });
```

#### useLogout()
Logs out the current user.

**Side Effects**:
- Clears tokens from token store
- Clears session from auth store
- Clears all query cache

```typescript
const logout = useLogout();
await logout.mutateAsync();
```

---

## Components

### ProfileHeader
Displays user avatar, name, and email with edit button.

**Props**:
```typescript
interface ProfileHeaderProps {
  user: UserProfile | User | null;
  isLoading: boolean;
  onEditPress: () => void;
}
```

**Features**:
- Fade-in animation
- Circular avatar with border
- Edit button overlay
- Loading state

### SettingsCard
Reusable card for settings navigation.

**Props**:
```typescript
interface SettingsCardProps {
  icon: ImageSourcePropType;
  label: string;
  onPress: () => void;
  variant?: "default" | "danger";
  delay?: number;
}
```

**Features**:
- Slide-in animation with staggered delays
- Icon + label + chevron layout
- Danger variant for destructive actions
- Background color: #e1e6e8

### ScreenHeader
Header with back button and title.

**Props**:
```typescript
interface ScreenHeaderProps {
  title: string;
}
```

**Features**:
- BackButton component from auth
- Centered title
- Consistent styling

### ConfirmDialog
Modal for confirmation dialogs.

**Props**:
```typescript
interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "default" | "danger";
}
```

### ProfileSkeleton
Loading skeleton for profile data.

**Features**:
- Circular avatar skeleton
- Name and email skeletons
- Pulse animation

### ErrorView
Error state display with retry.

**Props**:
```typescript
interface ErrorViewProps {
  message: string;
  onRetry: () => void;
}
```

---

## Screens

### Main Profile Screen
**Route**: `/(tabs)/profile`

**Features**:
- Profile header with avatar and user info
- Settings cards for navigation
- Logout confirmation dialog
- Conditional Switch Account card (multi-account)

### Account Settings
**Route**: `/(profile)/account-settings`

**Features**:
- Read-only profile display
- Verification and host status badges
- Account creation date
- Edit profile button

### Edit Profile
**Route**: `/(profile)/edit-profile`

**Features**:
- Avatar picker with image upload
- Name, email, phone inputs
- Form validation
- Loading states

### Language Preferences
**Route**: `/(profile)/language-preferences`

**Features**:
- English/Kiswahili radio buttons
- Optimistic updates
- Success alerts

### Security Settings
**Route**: `/(profile)/security-settings`

**Features**:
- Change password modal
- Password strength validation
- 2FA toggle with method selection
- Loading states

### Notification Preferences
**Route**: `/(profile)/notification-preferences`

**Features**:
- 5 notification toggle switches
- Optimistic updates
- Error rollback

### Support
**Route**: `/(profile)/support`

**Features**:
- Contact information (email, phone)
- Submit ticket button
- Expandable FAQ section

### Policies
**Route**: `/(profile)/policies`

**Features**:
- Policy cards (Terms, Privacy, Guidelines)
- Full-screen modal viewer
- Scrollable policy content

### Switch Account
**Route**: `/(profile)/switch-account`

**Features**:
- Account list with avatars
- Active account indicator
- Add account button
- 5 account limit enforcement

### Add Account
**Route**: `/(profile)/add-account`

**Features**:
- Email/password form
- Form validation
- Account limit notice

---

## State Management

### Server State (TanStack Query)
- Profile data
- Accounts data
- All API responses

**Cache Strategy**:
- Profile: 5 minutes stale time
- Accounts: 10 minutes stale time
- Automatic invalidation on mutations

### Client State (Zustand)
- Auth session (tokens, user)
- Managed by auth store

**Integration**:
- Profile mutations update auth store
- Logout clears auth store
- Account switch updates auth store

---

## Error Handling

### API Errors
All hooks handle errors gracefully:
- Network errors
- Validation errors
- Authentication errors
- Server errors

### User Feedback
- Alert dialogs for errors
- Success messages for mutations
- Loading states during operations
- Retry functionality on failures

---

## Performance Optimizations

### Query Caching
- Appropriate stale times per query
- Cache invalidation on mutations
- No unnecessary refetches

### Component Rendering
- React.memo on ProfileHeader and SettingsCard
- useCallback for event handlers
- Optimized re-renders

### Animations
- Native driver for animations
- Staggered delays for smooth UX
- Fade-in and slide-in effects

---

## Security Considerations

### Authentication
- All endpoints require valid Bearer token
- Tokens managed by auth store
- Automatic token refresh

### Data Validation
- Client-side validation before API calls
- Server-side validation enforced
- Type safety with TypeScript

### Sensitive Operations
- Password change requires current password
- 2FA requires verification code
- Logout invalidates tokens server-side

---

## Testing Recommendations

### Unit Tests
- Test hooks with mock API responses
- Test component rendering
- Test form validation logic

### Integration Tests
- Test complete user flows
- Test error scenarios
- Test cache invalidation

### E2E Tests
- Test profile editing flow
- Test account switching
- Test logout flow

---

## Future Enhancements

### Planned Features
- Profile completion percentage
- Avatar cropping tool
- Bulk notification settings
- Account export/import
- Activity log

### API Improvements
- Pagination for accounts
- Profile search
- Batch updates
- WebSocket for real-time updates

---

## Troubleshooting

### Common Issues

**Profile not loading**:
- Check authentication token
- Verify API endpoint configuration
- Check network connectivity

**Avatar upload failing**:
- Verify file size < 5MB
- Check file format (JPEG, PNG, WebP)
- Ensure proper FormData construction

**Cache not updating**:
- Verify mutation success callbacks
- Check query key consistency
- Force refetch if needed

**Multi-account issues**:
- Verify account limit (5 max)
- Check token validity
- Ensure proper account switching

---

## Support

For issues or questions:
- Check API error responses
- Review TypeScript types
- Consult TanStack Query docs
- Contact backend team for API issues

---

**Last Updated**: 2026-05-01  
**Version**: 1.0.0  
**Module Status**: Production Ready
