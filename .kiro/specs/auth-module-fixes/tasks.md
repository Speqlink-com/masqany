# Auth Module Fixes - Implementation Tasks

**Feature**: Auth Module Improvements & Fixes  
**Status**: Ready for Implementation  
**Created**: 2026-04-29

---

## Task Status Legend
- `[ ]` Not started
- `[-]` In progress
- `[x]` Completed
- `[~]` Queued

---

## 1. Font System Implementation

### 1.1 Install Font Packages
- [ ] Install `@expo-google-fonts/poppins`
- [ ] Install `@expo-google-fonts/inter`
- [ ] Verify packages in `package.json`

### 1.2 Configure Font Loading
- [ ] Update `app/_layout.tsx` with Poppins imports
- [ ] Update `app/_layout.tsx` with Inter imports
- [ ] Remove unused Cormorant Garamond imports (keep CG-Bold for branding)
- [ ] Test font loading on iOS
- [ ] Test font loading on Android

### 1.3 Update Design Tokens
- [ ] Update `constants/tokens.ts` typography section
- [ ] Add Poppins font family tokens
- [ ] Add Inter font family tokens
- [ ] Update font size scale if needed

### 1.4 Update Tailwind Configuration
- [ ] Update `tailwind.config.ts` with Poppins classes
- [ ] Update `tailwind.config.ts` with Inter classes
- [ ] Test Tailwind classes in components

### 1.5 Update Auth Screens with New Fonts
- [ ] Update `app/auth.tsx` - headings to Poppins, body to Inter
- [ ] Update `app/(auth)/login.tsx` - headings to Poppins, body to Inter
- [ ] Update `app/(auth)/sign-up.tsx` - headings to Poppins, body to Inter
- [ ] Update `app/(auth)/google.tsx` - headings to Poppins, body to Inter
- [ ] Update `app/(auth)/onboarding-name.tsx` - headings to Poppins, body to Inter
- [ ] Update `app/(auth)/onboarding-role.tsx` - headings to Poppins, body to Inter
- [ ] Update `app/(auth)/onboarding-credentials.tsx` - headings to Poppins, body to Inter
- [ ] Update `app/(auth)/onboarding-otp.tsx` - headings to Poppins, body to Inter
- [ ] Update `app/(auth)/onboarding-complete.tsx` - headings to Poppins, body to Inter

### 1.6 Update Auth Components with New Fonts
- [ ] Update `components/auth/AgentBubble.tsx` - use Inter
- [ ] Update `components/auth/PrimaryButton.tsx` - use Inter Bold
- [ ] Update `components/auth/RoleCard.tsx` - title Poppins, subtitle Inter
- [ ] Update `components/auth/BackButton.tsx` if needed
- [ ] Update `components/auth/ContactUs.tsx` if needed

### 1.7 Test Font Readability
- [ ] Test on iPhone (various sizes)
- [ ] Test on Android (various sizes)
- [ ] Test on iPad/tablet
- [ ] Verify no blurry text
- [ ] Verify proper font weights

---

## 2. Role Selection Animation Fix

### 2.1 Update Onboarding Role Screen
- [ ] Import `Animated` from `react-native`
- [ ] Create `gridTranslateY` animated value
- [ ] Wrap RoleGrid in `Animated.View`
- [ ] Implement spring animation on role select
- [ ] Implement spring animation on role deselect
- [ ] Add `marginBottom` to create space for response

### 2.2 Fix ScrollView Behavior
- [ ] Remove `flexGrow: 1` from contentContainerStyle
- [ ] Add proper padding to contentContainerStyle
- [ ] Implement `scrollToEnd` when response appears
- [ ] Test scroll behavior on iOS
- [ ] Test scroll behavior on Android

### 2.3 Test Animation
- [ ] Test animation smoothness (60fps)
- [ ] Test on slow devices
- [ ] Test with keyboard open
- [ ] Verify no overlap between cards and response
- [ ] Verify cards remain visible during typing

---

## 3. Forgot Password Implementation

### 3.1 Create Mock Data
- [ ] Create `assets/data/auth.ts` if not exists
- [ ] Add mock OTP code (`123456`)
- [ ] Add mock reset token
- [ ] Add mock API responses

### 3.2 Update API Layer
- [ ] Add `forgotPassword` method to `modules/auth/api.ts`
- [ ] Add `verifyResetOTP` method to `modules/auth/api.ts`
- [ ] Add `resetPassword` method to `modules/auth/api.ts`
- [ ] Implement mock mode logic
- [ ] Test API methods

### 3.3 Create Query Hooks
- [ ] Add `useForgotPassword` hook to `modules/auth/hooks.ts`
- [ ] Add `useVerifyResetOTP` hook to `modules/auth/hooks.ts`
- [ ] Add `useResetPassword` hook to `modules/auth/hooks.ts`
- [ ] Add query keys for forgot password flow
- [ ] Test hooks

### 3.4 Create Forgot Password Screen
- [ ] Create `app/(auth)/forgot-password.tsx`
- [ ] Add email/phone input
- [ ] Add type toggle (email/phone)
- [ ] Add validation
- [ ] Add "Send OTP" button
- [ ] Implement navigation to OTP screen
- [ ] Add loading state
- [ ] Add error handling
- [ ] Test screen

### 3.5 Create Forgot Password OTP Screen
- [ ] Create `app/(auth)/forgot-password-otp.tsx`
- [ ] Reuse `OtpInput` component
- [ ] Add OTP verification logic
- [ ] Add resend OTP functionality
- [ ] Add countdown timer
- [ ] Implement navigation to reset password screen
- [ ] Add loading state
- [ ] Add error handling
- [ ] Test screen

### 3.6 Create Reset Password Screen
- [ ] Create `app/(auth)/reset-password.tsx`
- [ ] Add password input with toggle
- [ ] Add confirm password input
- [ ] Add password strength indicator
- [ ] Add validation
- [ ] Add "Reset Password" button
- [ ] Implement success navigation to login
- [ ] Add loading state
- [ ] Add error handling
- [ ] Test screen

### 3.7 Update Login Screen
- [ ] Add "Forgot Password?" link
- [ ] Style link properly
- [ ] Implement navigation to forgot password screen
- [ ] Test navigation

### 3.8 Test Complete Flow
- [ ] Test forgot password flow end-to-end
- [ ] Test with email
- [ ] Test with phone
- [ ] Test invalid OTP
- [ ] Test weak password
- [ ] Test success case

---

## 4. Admin Login Implementation

### 4.1 Create Mock Admin Data
- [ ] Add admin credentials to `assets/data/auth.ts`
- [ ] Email: `admin@speqlink.com`
- [ ] Password: any (for testing)
- [ ] Add admin user object

### 4.2 Update Login Logic
- [ ] Update `modules/auth/api.ts` login method
- [ ] Check for admin email
- [ ] Return mock admin response
- [ ] Add role to user object

### 4.3 Update Role-Based Routing
- [ ] Update `routeByRole` function in login screen
- [ ] Handle `admin` role
- [ ] Handle `super_admin` role
- [ ] Route to `/(admin)/dashboard`
- [ ] Test routing

### 4.4 Test Admin Login
- [ ] Test login with `admin@speqlink.com`
- [ ] Verify routing to admin dashboard
- [ ] Test regular user login
- [ ] Verify routing to home

---

## 5. OTP Auto-Fill Implementation

### 5.1 Update OTP Input Component
- [ ] Add `textContentType="oneTimeCode"` for iOS
- [ ] Add `autoComplete="sms-otp"` for Android
- [ ] Test auto-fill on iOS
- [ ] Test auto-fill on Android

### 5.2 Implement Paste Detection
- [ ] Update `handleChange` in `OtpInput`
- [ ] Detect multi-digit paste
- [ ] Parse and fill all boxes
- [ ] Focus last filled box
- [ ] Test paste functionality

### 5.3 Test Auto-Fill
- [ ] Test on iOS with real SMS
- [ ] Test on Android with real SMS
- [ ] Test paste from clipboard
- [ ] Test manual entry still works

---

## 6. Session Persistence Implementation

### 6.1 Install Dependencies
- [ ] Install `expo-secure-store`
- [ ] Verify package in `package.json`

### 6.2 Create Secure Storage Module
- [ ] Create `lib/storage/secure.ts`
- [ ] Implement `setTokens` method
- [ ] Implement `getTokens` method
- [ ] Implement `setUser` method
- [ ] Implement `getUser` method
- [ ] Implement `clearAll` method
- [ ] Add error handling
- [ ] Test methods

### 6.3 Update Zustand Token Store
- [ ] Add `persist` middleware to `tokenStore`
- [ ] Create SecureStore adapter
- [ ] Configure persistence
- [ ] Test persistence

### 6.4 Update Auth Hooks
- [ ] Update `useLogin` to store tokens in SecureStore
- [ ] Update `useRegister` to store tokens in SecureStore
- [ ] Update `useGoogleLogin` to store tokens in SecureStore
- [ ] Update `useLogout` to clear SecureStore
- [ ] Test hooks

### 6.5 Implement Auto-Login
- [ ] Update `app/index.tsx`
- [ ] Check for tokens on app launch
- [ ] Verify tokens with API
- [ ] Route to appropriate screen
- [ ] Handle invalid tokens
- [ ] Test auto-login

### 6.6 Test Session Persistence
- [ ] Test login and close app
- [ ] Reopen app - verify still logged in
- [ ] Test logout - verify tokens cleared
- [ ] Test uninstall/reinstall - verify must login again
- [ ] Test token expiration handling

---

## 7. Google OAuth Implementation

### 7.1 Install Dependencies
- [ ] Install `expo-auth-session` (if not installed)
- [ ] Verify `expo-web-browser` installed
- [ ] Verify packages in `package.json`

### 7.2 Configure OAuth
- [ ] Create `.env` file if not exists
- [ ] Add `EXPO_PUBLIC_GOOGLE_CLIENT_ID`
- [ ] Add `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`
- [ ] Add `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`
- [ ] Add `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
- [ ] Add `EXPO_PUBLIC_MOCK_AUTH=true` for testing

### 7.3 Create Google Auth Module
- [ ] Create `lib/auth/google.ts`
- [ ] Implement `useGoogleAuth` hook
- [ ] Configure OAuth request
- [ ] Test hook

### 7.4 Create Mock Google Data
- [ ] Add mock Google user to `assets/data/auth.ts`
- [ ] Add mock Google response

### 7.5 Update API Layer
- [ ] Update `loginWithGoogle` in `modules/auth/api.ts`
- [ ] Add simulation mode logic
- [ ] Return mock response in simulation mode
- [ ] Test API method

### 7.6 Update Google Auth Screen
- [ ] Update `app/(auth)/google.tsx`
- [ ] Integrate `useGoogleAuth` hook
- [ ] Handle OAuth response
- [ ] Handle success case
- [ ] Handle cancellation
- [ ] Handle errors
- [ ] Add loading state
- [ ] Test screen

### 7.7 Test Google OAuth
- [ ] Test simulation mode
- [ ] Test OAuth cancellation
- [ ] Test OAuth errors
- [ ] Test success flow
- [ ] Verify token storage
- [ ] Verify routing

---

## 8. Terms Acceptance - One Time

### 8.1 Update Sign-Up Screen
- [ ] Verify terms acceptance checkbox exists
- [ ] Verify terms links work
- [ ] Test acceptance flow

### 8.2 Update Onboarding Complete Screen
- [ ] Remove duplicate terms acceptance
- [ ] Keep only final confirmation
- [ ] Update button text
- [ ] Test screen

### 8.3 Add Terms Acceptance Flag
- [ ] Add `termsAcceptedAt` to User type
- [ ] Add `termsVersion` to User type
- [ ] Update mock user data

### 8.4 Implement Conditional Terms Display
- [ ] Create `TermsModal` component (future)
- [ ] Check `termsAcceptedAt` on login
- [ ] Show modal if not accepted
- [ ] Store acceptance timestamp

### 8.5 Test Terms Flow
- [ ] Test sign-up shows terms
- [ ] Test subsequent logins don't show terms
- [ ] Test terms accessible from settings

---

## 9. Auth Landing Page Cleanup

### 9.1 Review Current Implementation
- [ ] Check for duplicate `app/auth.tsx`
- [ ] Identify any repeated code
- [ ] Review navigation flow

### 9.2 Consolidate Auth Landing
- [ ] Ensure single `app/auth.tsx` exists
- [ ] Add "or" text between buttons
- [ ] Update button spacing
- [ ] Test navigation from landing

### 9.3 Test Auth Landing
- [ ] Test all button navigation
- [ ] Test layout on different screen sizes
- [ ] Verify no duplicates

---

## 10. Testing & Quality Assurance

### 10.1 Manual Testing - iOS
- [ ] Test all auth screens
- [ ] Test font readability
- [ ] Test animations
- [ ] Test OTP auto-fill
- [ ] Test session persistence
- [ ] Test Google OAuth
- [ ] Test forgot password flow
- [ ] Test admin login

### 10.2 Manual Testing - Android
- [ ] Test all auth screens
- [ ] Test font readability
- [ ] Test animations
- [ ] Test OTP auto-fill
- [ ] Test session persistence
- [ ] Test Google OAuth
- [ ] Test forgot password flow
- [ ] Test admin login

### 10.3 Edge Case Testing
- [ ] Test no internet connection
- [ ] Test invalid credentials
- [ ] Test expired tokens
- [ ] Test weak passwords
- [ ] Test invalid OTP
- [ ] Test OAuth cancellation
- [ ] Test rapid button taps
- [ ] Test keyboard behavior

### 10.4 Performance Testing
- [ ] Measure font load time
- [ ] Measure animation frame rate
- [ ] Measure SecureStore operations
- [ ] Measure screen transitions
- [ ] Check for memory leaks

### 10.5 Accessibility Testing
- [ ] Test with VoiceOver (iOS)
- [ ] Test with TalkBack (Android)
- [ ] Test font scaling
- [ ] Test color contrast
- [ ] Test touch target sizes

---

## 11. Documentation

### 11.1 Update Module Documentation
- [ ] Document new API methods
- [ ] Document new hooks
- [ ] Document mock data structure
- [ ] Document environment variables

### 11.2 Create User Guide
- [ ] Document forgot password flow
- [ ] Document admin login
- [ ] Document Google OAuth setup
- [ ] Document testing procedures

### 11.3 Update README
- [ ] Add new dependencies
- [ ] Add environment setup
- [ ] Add testing instructions

---

## 12. Deployment Preparation

### 12.1 Pre-Deployment Checks
- [ ] Run `npx expo-doctor`
- [ ] Fix any warnings
- [ ] Run `pnpm lint`
- [ ] Fix linting errors

### 12.2 Clean Build
- [ ] Remove `node_modules`
- [ ] Remove `android` folder
- [ ] Remove `.expo` folder
- [ ] Run `pnpm install`
- [ ] Run `npx expo prebuild --clean`

### 12.3 Build Preview
- [ ] Build Android preview
- [ ] Build iOS preview
- [ ] Test preview builds
- [ ] Verify all features work

### 12.4 Final Testing
- [ ] Test on physical iOS device
- [ ] Test on physical Android device
- [ ] Test all auth flows
- [ ] Verify no regressions

---

## 13. Module Completion

### 13.1 Final Review
- [ ] Review all requirements met
- [ ] Review all acceptance criteria passed
- [ ] Review code quality
- [ ] Review documentation

### 13.2 User Acceptance
- [ ] Demo to user
- [ ] Get feedback
- [ ] Make adjustments if needed
- [ ] Get final approval

### 13.3 Mark Complete
- [ ] Update module status
- [ ] Archive spec documents
- [ ] Celebrate! 🎉

---

## Task Summary

**Total Tasks**: 200+  
**Estimated Time**: 21 hours (~3 days)  
**Priority**: High  
**Dependencies**: None (all self-contained)

---

## Notes

- Tasks can be executed in parallel where possible
- Font implementation should be done first (affects all screens)
- Session persistence can be done independently
- Google OAuth can be done last (simulation mode)
- Test thoroughly after each major section

---

**Status**: ✅ Tasks Ready - Ready to Start Implementation

**Next Step**: Begin with Task 1 (Font System Implementation)
