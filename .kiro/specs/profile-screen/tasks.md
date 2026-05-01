# Implementation Plan: Profile Screen Feature

## Overview

This implementation plan breaks down the Profile Screen feature into discrete, sequential tasks. The feature follows the established Masqany mobile architecture with a two-layer state pattern (TanStack Query for server state, Zustand for client state) and the module pattern with api.ts, hooks.ts, types.ts, and index.ts files.

The implementation uses TypeScript, React Native, Expo Router, TanStack Query, Zustand, and NativeWind (Tailwind CSS). All styling uses design tokens from `constants/tokens.ts`.

## Tasks

- [x] 1. Set up profile module structure
  - Create `modules/profile/` directory
  - Create placeholder files: `types.ts`, `api.ts`, `hooks.ts`, `index.ts`
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [x] 2. Implement profile module types
  - [x] 2.1 Define core TypeScript interfaces in `modules/profile/types.ts`
    - Implement `UserProfile` interface with all fields (id, name, email, phone, avatar, isHost, isVerified, createdAt, updatedAt, language, notificationPreferences, securitySettings)
    - Implement `LanguageCode` type ("en" | "sw")
    - Implement `NotificationPreferences` interface (pushEnabled, emailEnabled, bookingNotifications, chatNotifications, promotionalNotifications)
    - Implement `SecuritySettings` interface (twoFactorEnabled, twoFactorMethod, lastPasswordChange)
    - Implement `ProfileUpdatePayload` interface (name, email, phone, avatar - all optional)
    - Implement `LanguageUpdatePayload` interface (language)
    - Implement `NotificationUpdatePayload` interface (preferences)
    - Implement `PasswordChangePayload` interface (currentPassword, newPassword, confirmPassword)
    - Implement `TwoFactorTogglePayload` interface (enabled, method, verificationCode)
    - Implement `Account` interface (id, name, email, role, avatar)
    - Implement `MultiAccountState` interface (accounts, activeAccountId)
    - _Requirements: 4.1, 5.1, 7.1, 8.1, 9.1, 10.1, 14.1, 15.4_

- [x] 3. Implement profile API layer
  - [x] 3.1 Create `modules/profile/api.ts` with profileApi object
    - Import apiClient from `lib/api/client.ts`
    - Implement `getProfile()` - GET /user/profile
    - Implement `updateProfile(payload)` - PUT /user/profile
    - Implement `uploadAvatar(formData)` - POST /user/avatar with multipart/form-data
    - Implement `updateLanguage(payload)` - PUT /user/language
    - Implement `updateNotifications(payload)` - PUT /user/notifications
    - Implement `changePassword(payload)` - POST /user/password/change
    - Implement `toggleTwoFactor(payload)` - POST /user/2fa/toggle
    - Implement `getAccounts()` - GET /user/accounts
    - Implement `switchAccount(accountId)` - POST /user/accounts/switch
    - Implement `addAccount(credentials)` - POST /user/accounts/add
    - Implement `logout()` - POST /auth/logout
    - All methods should extract `.data` from Axios response
    - _Requirements: 4.1, 4.2, 5.6, 7.5, 8.5, 9.4, 10.3, 11.4, 14.9, 15.2, 15.8_

- [x] 4. Implement profile TanStack Query hooks
  - [x] 4.1 Create query keys in `modules/profile/hooks.ts`
    - Define `profileKeys` object with: `all`, `detail()`, `notifications()`, `security()`, `accounts()`
    - _Requirements: 15.9_
  
  - [x] 4.2 Implement data fetching hooks
    - Implement `useProfile()` hook using `useQuery` with `profileKeys.detail()` and `profileApi.getProfile()`
    - Set staleTime to 5 minutes (1000 * 60 * 5)
    - Implement `useAccounts()` hook using `useQuery` with `profileKeys.accounts()` and `profileApi.getAccounts()`
    - Set staleTime to 10 minutes for accounts
    - _Requirements: 4.1, 4.2, 9.2, 15.3, 15.10_
  
  - [x] 4.3 Implement profile mutation hooks
    - Implement `useUpdateProfile()` hook using `useMutation` with `profileApi.updateProfile()`
    - On success: invalidate `profileKeys.detail()` and update auth store with `setUser(data)`
    - Implement `useUploadAvatar()` hook using `useMutation` with `profileApi.uploadAvatar()`
    - On success: invalidate `profileKeys.detail()`
    - _Requirements: 5.6, 5.7, 5.8, 15.10_
  
  - [x] 4.4 Implement settings mutation hooks
    - Implement `useUpdateLanguage()` hook using `useMutation` with `profileApi.updateLanguage()`
    - On success: invalidate `profileKeys.detail()`
    - Implement `useUpdateNotifications()` hook using `useMutation` with `profileApi.updateNotifications()`
    - On success: invalidate `profileKeys.notifications()`
    - Implement `useChangePassword()` hook using `useMutation` with `profileApi.changePassword()`
    - Implement `useToggleTwoFactor()` hook using `useMutation` with `profileApi.toggleTwoFactor()`
    - On success: invalidate `profileKeys.security()`
    - _Requirements: 7.5, 7.6, 8.5, 8.6, 14.9, 15.10_
  
  - [x] 4.5 Implement account management mutation hooks
    - Implement `useSwitchAccount()` hook using `useMutation` with `profileApi.switchAccount()`
    - On success: update tokens with `setTokens()`, update user with `setUser()`, invalidate all queries
    - Implement `useAddAccount()` hook using `useMutation` with `profileApi.addAccount()`
    - On success: invalidate `profileKeys.accounts()`
    - Implement `useLogout()` hook using `useMutation` with `profileApi.logout()`
    - On success: clear tokens with `clearTokens()`, clear session with `clearSession()`, clear all query cache with `queryClient.clear()`
    - _Requirements: 9.4, 9.5, 9.6, 10.3, 10.4, 11.4, 11.5, 11.6, 15.10, 15.11_

- [x] 5. Create module index and exports
  - [x] 5.1 Implement `modules/profile/index.ts`
    - Re-export all types from `types.ts`
    - Re-export all hooks from `hooks.ts`
    - Re-export profileApi from `api.ts`
    - _Requirements: 15.5_

- [x] 6. Create reusable profile components
  - [x] 6.1 Create `components/profile/` directory
    - Create placeholder files for all profile components
    - _Requirements: 1.1, 2.1, 3.1_
  
  - [x] 6.2 Implement ProfileHeader component
    - Create `components/profile/ProfileHeader.tsx`
    - Accept props: `user`, `isLoading`, `onEditPress`
    - Display circular avatar (80x80) with 3px border using `colors.primary[700]`
    - Display edit icon (24x24) positioned absolute top-right of avatar
    - Display user name using Poppins SemiBold, size xl, color dark-400
    - Display user email using Inter Regular, size base, color dark-100
    - Show loading indicator when `isLoading` is true
    - Use design tokens from `constants/tokens.ts` for all styling
    - _Requirements: 1.3, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 4.3, 4.4_
  
  - [x] 6.3 Implement SettingsCard component
    - Create `components/profile/SettingsCard.tsx`
    - Accept props: `icon`, `label`, `onPress`, `variant` (default | danger)
    - Use background color #e1e6e8, border radius 14px, padding 16px
    - Display icon (24x24) on left, label in center, chevron (16x16) on right
    - Use Inter Medium font, size base, color dark-400 for label
    - Apply red color for danger variant (logout)
    - Use NativeWind classes and design tokens
    - _Requirements: 1.4, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_
  
  - [x] 6.4 Implement ConfirmDialog component
    - Create `components/profile/ConfirmDialog.tsx`
    - Accept props: `visible`, `title`, `message`, `confirmText`, `cancelText`, `onConfirm`, `onCancel`, `variant`
    - Use React Native Modal component
    - Display centered dialog with title, message, and two buttons
    - Apply danger styling for destructive actions
    - Use design tokens for all styling
    - _Requirements: 11.1, 11.2, 11.3_
  
  - [x] 6.5 Implement ProfileSkeleton component
    - Create `components/profile/ProfileSkeleton.tsx`
    - Display skeleton loading state for avatar (80x80 circle)
    - Display skeleton for name (width 128, height 24)
    - Display skeleton for email (width 192, height 16)
    - Use light-200 background with pulse animation
    - _Requirements: 2.5_
  
  - [x] 6.6 Implement ErrorView component
    - Create `components/profile/ErrorView.tsx`
    - Accept props: `message`, `onRetry`
    - Display error icon, error message, and retry button
    - Use danger color for error state
    - Use design tokens for styling
    - _Requirements: 2.6, 5.9_

- [x] 7. Checkpoint - Verify module and components setup
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Implement main profile screen
  - [x] 8.1 Update `app/(tabs)/profile.tsx` with full implementation
    - Import `useProfile` hook from `modules/profile`
    - Import ProfileHeader, SettingsCard, ConfirmDialog components
    - Use ImageBackground with `app-full-screen.webp`
    - Add SafeAreaView with edges: ["top", "left", "right"]
    - Add ScrollView with paddingBottom: 100 for tab bar clearance
    - _Requirements: 1.1, 1.2, 1.5, 1.6, 1.7, 4.1, 15.6, 15.7_
  
  - [x] 8.2 Implement profile header section
    - Render ProfileHeader component with user data from `useProfile()`
    - Pass `isLoading` state from query
    - Handle edit button press to navigate to edit-profile screen
    - _Requirements: 1.3, 2.1, 2.2, 2.3, 2.4, 4.3, 4.4, 5.1_
  
  - [x] 8.3 Implement settings cards list
    - Render SettingsCard for Account Settings with profile.webp icon
    - Render SettingsCard for Language Preferences with language.png icon
    - Render SettingsCard for Security Settings with security.png icon
    - Render SettingsCard for Notifications with notificattion-icon.webp icon
    - Render SettingsCard for Support with support.png icon
    - Render SettingsCard for Terms and Policies with policies.png icon
    - Render SettingsCard for Logout with logout.png icon and danger variant
    - Each card navigates to appropriate screen on press
    - _Requirements: 1.4, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 6.1, 7.1, 8.1, 13.1, 13.2, 14.1, 14.2_
  
  - [x] 8.4 Implement logout confirmation flow
    - Show ConfirmDialog when logout card is pressed
    - Dialog displays "Are you sure you want to log out?" message
    - On confirm: call `useLogout()` mutation
    - On success: navigate to auth screen using `router.replace('/auth')`
    - On error: display error message using Alert
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8_
  
  - [x] 8.5 Implement loading and error states
    - Show ProfileSkeleton when profile data is loading
    - Show ErrorView when profile fetch fails
    - Provide retry functionality on error
    - _Requirements: 2.5, 2.6, 5.9_

- [x] 9. Create profile screens group layout
  - [x] 9.1 Create `app/(profile)/` directory
    - Create `app/(profile)/_layout.tsx` with Stack navigator
    - Configure header styles using design tokens
    - Set up back button navigation
    - _Requirements: 5.1, 6.1, 7.1, 8.1, 12.1, 13.3, 14.3_

- [x] 10. Implement edit profile screen
  - [x] 10.1 Create `app/(profile)/edit-profile.tsx`
    - Import `useProfile`, `useUpdateProfile`, `useUploadAvatar` hooks
    - Create form with controlled inputs for name, email, phone
    - Add avatar picker using expo-image-picker
    - Display current profile data in form fields
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [x] 10.2 Implement form validation and submission
    - Validate email format, phone format, name length
    - Handle avatar upload separately if image is selected
    - Call `useUpdateProfile()` mutation with form data
    - Show loading state on save button during mutation
    - On success: show success message and navigate back
    - On error: display error message
    - _Requirements: 5.6, 5.7, 5.8, 5.9_

- [x] 11. Implement account settings screen
  - [x] 11.1 Create `app/(profile)/account-settings.tsx`
    - Import `useProfile` hook
    - Display all profile fields (name, email, phone, avatar)
    - Display account status (verified badge, host badge)
    - Display account creation date formatted
    - Provide navigation to edit profile screen
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 12. Implement language preferences screen
  - [x] 12.1 Create `app/(profile)/language-preferences.tsx`
    - Import `useProfile`, `useUpdateLanguage` hooks
    - Display English option with radio button
    - Display Kiswahili option with radio button
    - Indicate currently selected language from profile data
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [x] 12.2 Implement language selection logic
    - Handle language option press
    - Call `useUpdateLanguage()` mutation with selected language
    - Show loading state during mutation
    - On success: update UI to reflect new language selection
    - Display success message
    - _Requirements: 7.5, 7.6, 7.7_

- [x] 13. Implement security settings screen
  - [x] 13.1 Create `app/(profile)/security-settings.tsx`
    - Import `useProfile`, `useChangePassword`, `useToggleTwoFactor` hooks
    - Display "Change Password" option with navigation
    - Display "Two-Factor Authentication" toggle with current status
    - Show 2FA method if enabled (SMS, Email, Authenticator)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.7_
  
  - [x] 13.2 Implement password change flow
    - Create modal or navigate to password change form
    - Display inputs for current password, new password, confirm password
    - Validate password strength and confirmation match
    - Call `useChangePassword()` mutation
    - On success: show success message
    - _Requirements: 8.5, 8.6_
  
  - [x] 13.3 Implement 2FA toggle logic
    - Handle 2FA toggle switch press
    - If enabling: show method selection (SMS, Email, Authenticator)
    - Call `useToggleTwoFactor()` mutation with selected method
    - Show loading state during mutation
    - On success: update UI to reflect new 2FA status
    - _Requirements: 8.3, 8.4, 8.7_

- [x] 14. Implement notification preferences screen
  - [x] 14.1 Create `app/(profile)/notification-preferences.tsx`
    - Import `useProfile`, `useUpdateNotifications` hooks
    - Display toggle for push notifications
    - Display toggle for email notifications
    - Display toggle for booking notifications
    - Display toggle for chat notifications
    - Display toggle for promotional notifications
    - Load current preferences from profile data
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8_
  
  - [x] 14.2 Implement notification toggle logic
    - Handle toggle switch changes
    - Call `useUpdateNotifications()` mutation with updated preferences
    - Use optimistic updates for immediate UI feedback
    - On success: show confirmation message
    - On error: revert optimistic update and show error
    - _Requirements: 14.9, 14.10_

- [x] 15. Implement support screen
  - [x] 15.1 Create `app/(profile)/support.tsx`
    - Display customer support contact information (email, phone)
    - Display "Submit a Support Ticket" button
    - Display FAQ section with expandable questions
    - Use design tokens for styling
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7_
  
  - [x] 15.2 Implement support ticket submission
    - Create form with subject, description, category fields
    - Add optional attachment picker
    - Validate form inputs
    - Submit ticket to support API endpoint
    - Show success confirmation on submission
    - _Requirements: 13.5_

- [x] 16. Implement policies viewer screen
  - [x] 16.1 Create `app/(profile)/policies.tsx`
    - Display list of policy documents (Terms of Service, Privacy Policy)
    - Each policy is a pressable card
    - Navigate to policy detail view on press
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.7_
  
  - [x] 16.2 Implement policy document viewer
    - Create policy detail screen or modal
    - Fetch policy content from API or display static content
    - Display policy text in scrollable view
    - Format policy text with proper typography
    - Add back button to return to policy list
    - _Requirements: 12.5, 12.6, 12.7_

- [x] 17. Checkpoint - Verify all screens are functional
  - Ensure all tests pass, ask the user if questions arise.

- [x] 18. Implement multi-account management (conditional feature)
  - [x] 18.1 Add Switch Account option to profile screen
    - Check if user has multiple accounts using `useAccounts()` hook
    - Only display Switch Account card if accounts.length > 1
    - Navigate to account switcher screen on press
    - _Requirements: 9.1, 9.2, 9.7_
  
  - [x] 18.2 Create account switcher screen
    - Create `app/(profile)/switch-account.tsx`
    - Display list of all user accounts from `useAccounts()`
    - Each account shows name, email, role, and avatar
    - Indicate currently active account
    - Handle account selection
    - _Requirements: 9.2, 9.3_
  
  - [x] 18.3 Implement account switching logic
    - Call `useSwitchAccount()` mutation with selected account ID
    - Show loading state during switch
    - On success: update auth store, invalidate queries, navigate back to profile
    - Display success message
    - _Requirements: 9.4, 9.5, 9.6_
  
  - [x] 18.4 Implement add account flow
    - Add "Add Account" button to account switcher screen
    - Navigate to add account screen
    - Create login form for new account credentials
    - Call `useAddAccount()` mutation with credentials
    - On success: add account to list, switch to new account
    - Enforce maximum of 5 accounts per device
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

- [x] 19. Add loading animations and polish
  - [x] 19.1 Add smooth transitions between screens
    - Configure screen transition animations in navigation
    - Add fade-in animations for profile header
    - Add slide-in animations for settings cards
    - _Requirements: 1.1_
  
  - [x] 19.2 Implement success and error toasts
    - Create toast notification component or use library
    - Show success toast on profile update
    - Show success toast on settings changes
    - Show error toast on API failures
    - _Requirements: 5.8, 5.9, 7.6, 8.6, 11.8, 14.10_
  
  - [x] 19.3 Optimize images and icons
    - Ensure all icons are properly sized (24x24 for cards, 16x16 for chevrons)
    - Optimize avatar image loading with placeholder
    - Add image caching for avatars
    - _Requirements: 2.1, 3.3, 3.4, 3.5_

- [x] 20. Test offline behavior and error handling
  - [x] 20.1 Test offline scenarios
    - Verify profile screen shows cached data when offline
    - Verify mutations are queued when offline (if offline queue is implemented)
    - Test error messages when network is unavailable
    - _Requirements: 4.2, 5.9, 11.8_
  
  - [x] 20.2 Test error recovery
    - Test retry functionality on failed requests
    - Test error boundary catches component errors
    - Verify user-friendly error messages are displayed
    - Test navigation after errors
    - _Requirements: 2.6, 5.9, 11.8_

- [x] 21. Performance optimization
  - [x] 21.1 Optimize query caching
    - Verify staleTime is set appropriately for each query
    - Test cache invalidation after mutations
    - Ensure no unnecessary refetches occur
    - _Requirements: 4.2, 15.10_
  
  - [x] 21.2 Optimize component rendering
    - Add React.memo to ProfileHeader, SettingsCard components
    - Use useCallback for event handlers
    - Verify no unnecessary re-renders occur
    - Test scroll performance with React DevTools Profiler
    - _Requirements: 1.4_

- [x] 22. Final checkpoint - Complete feature verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- All tasks reference specific requirements for traceability
- The design document does not include a "Correctness Properties" section, so property-based tests are not included
- Unit tests and integration tests should be written for components and hooks but are not included as separate tasks per the workflow guidelines
- The feature follows the established module pattern with api.ts, hooks.ts, types.ts, and index.ts
- All API calls go through the profile module hooks, never directly to apiClient
- TanStack Query manages all server state, Zustand manages client state (auth session)
- All styling uses design tokens from constants/tokens.ts and NativeWind classes
- Multi-account management (tasks 18.x) is conditional based on user having multiple accounts
- Checkpoints are included at reasonable breaks to ensure incremental validation
