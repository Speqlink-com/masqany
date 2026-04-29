# Auth Module Fixes - Requirements Document

**Feature**: Auth Module Improvements & Fixes  
**Type**: Enhancement & Bug Fixes  
**Priority**: High  
**Status**: Requirements Phase  
**Created**: 2026-04-29

---

## 1. Executive Summary

The auth module has been implemented but requires several critical fixes and enhancements to meet production standards. This document outlines all required changes based on user feedback and testing.

---

## 2. Current Issues & Requirements

### 2.1 Duplicate Auth Landing Page ❌

**Issue**: `app/auth.tsx` is duplicated/repeated and needs consolidation.

**Requirements**:
- Remove duplicate auth landing page
- Use `app/auth.tsx` as the single entry point
- Add descriptive text between buttons (e.g., "or" separator)
- Ensure clean navigation flow

**Acceptance Criteria**:
- [ ] Only one auth landing page exists
- [ ] Text separators between buttons are visible
- [ ] Navigation works correctly from landing page

---

### 2.2 Font Readability Issues ❌

**Issue**: Current fonts appear blurry and users struggle to read text.

**Requirements**:
- **Headings & Titles**: Use **Poppins** font family
- **Body Text**: Use **Inter** font family
- Remove Cormorant Garamond from UI text (keep only for branding if needed)
- Ensure all text is crisp and readable on all screen sizes

**Font Hierarchy**:
```
Headings/Titles → Poppins (Bold, SemiBold, Medium)
Body Text → Inter (Regular, Medium, SemiBold)
Buttons → Inter Bold
Input Fields → Inter Regular
```

**Acceptance Criteria**:
- [ ] Poppins installed and configured
- [ ] Inter installed and configured
- [ ] All headings use Poppins
- [ ] All body text uses Inter
- [ ] Text is crisp and readable
- [ ] No blurry text on any screen

---

### 2.3 Onboarding Role Selection UX Issue ❌

**Issue**: When user selects a role, the typing effect displays content on the cards instead of pushing them upwards. Cards appear static.

**Requirements**:
- When role is selected, cards should animate upward
- Agent response bubble should appear below the cards
- Cards should not overlap with typing text
- Smooth animation transition
- Content should scroll naturally to show the response

**Acceptance Criteria**:
- [ ] Role cards animate upward when role selected
- [ ] Agent response appears below cards
- [ ] No overlap between cards and response
- [ ] Smooth animation (spring/ease-out)
- [ ] ScrollView scrolls to show full response
- [ ] Cards remain visible during typing

---

### 2.4 Forgot Password Not Working ❌

**Issue**: Forgot password functionality is not implemented.

**Requirements**:
- Implement forgot password flow
- User enters email or phone number
- System sends OTP to email/phone
- User enters OTP (6 digits)
- User creates new password
- Password strength validation
- Success confirmation

**Flow**:
```
Login Screen → Forgot Password
  ↓
Enter Email/Phone
  ↓
Send OTP
  ↓
Verify OTP (6 digits)
  ↓
Create New Password
  ↓
Confirm Password
  ↓
Success → Login
```

**Acceptance Criteria**:
- [ ] Forgot password link works on login screen
- [ ] User can enter email or phone
- [ ] OTP sent to email/phone
- [ ] OTP verification (6 digits)
- [ ] New password creation with strength indicator
- [ ] Password confirmation
- [ ] Success message and redirect to login

---

### 2.5 Admin Login with Hardcoded Credentials ✅

**Issue**: Admin login needs hardcoded email for testing.

**Requirements**:
- Hardcoded admin email: `admin@speqlink.com`
- Any password should work for testing (or specific test password)
- Admin users route to `/(admin)/dashboard`
- Regular users route to `/(tabs)/home`

**Acceptance Criteria**:
- [ ] `admin@speqlink.com` recognized as admin
- [ ] Admin routes to admin dashboard
- [ ] Regular users route to home
- [ ] Role-based routing works correctly

---

### 2.6 OTP Auto-Fill & Verification ✅

**Issue**: OTP verification should be more user-friendly.

**Requirements**:
- **Auto-fill OTP**: When OTP arrives via SMS, automatically detect and fill the 6-digit code
- **Email Verification**: User verifies email with OTP
- **Phone Verification**: User verifies phone with OTP
- Smooth UX with minimal user input

**Acceptance Criteria**:
- [ ] OTP auto-fills from SMS (iOS & Android)
- [ ] Email verification works
- [ ] Phone verification works
- [ ] 6-digit code validation
- [ ] Clear error messages
- [ ] Resend OTP functionality

---

### 2.7 Persistent Login (Session Management) ✅

**Issue**: Users should not sign in every time they open the app.

**Requirements**:
- **First Time**: User signs up/logs in
- **Subsequent Opens**: User stays logged in
- **After Uninstall/Reinstall**: User must log in again
- **Session Persistence**: Use Expo SecureStore for tokens
- **Auto-login**: Check for valid token on app launch
- **Token Refresh**: Refresh expired tokens automatically

**Login Options After Reinstall**:
1. Email + OTP
2. Phone + OTP
3. Email + Password
4. Google OAuth

**Acceptance Criteria**:
- [ ] Tokens stored in SecureStore
- [ ] User stays logged in between app opens
- [ ] Auto-login on app launch if token valid
- [ ] Token refresh works automatically
- [ ] After uninstall, user must log in again
- [ ] Multiple login options available

---

### 2.8 Google OAuth Implementation ✅

**Issue**: Google authentication needs proper implementation.

**Requirements**:
- Implement Google OAuth using `expo-auth-session`
- Google Sign-In button on auth landing
- Google Sign-Up during onboarding
- Handle Google OAuth flow
- Store user data from Google
- Simulate for testing (until API ready)

**Flow**:
```
User taps "Continue with Google"
  ↓
Google OAuth popup
  ↓
User authorizes
  ↓
Receive Google ID token
  ↓
Send to backend (or simulate)
  ↓
Receive auth tokens
  ↓
Store tokens
  ↓
Route to appropriate screen
```

**Acceptance Criteria**:
- [ ] Google OAuth configured
- [ ] Google Sign-In works
- [ ] Google Sign-Up works
- [ ] User data extracted from Google
- [ ] Tokens stored securely
- [ ] Simulation mode for testing
- [ ] Error handling for OAuth failures

---

### 2.9 Terms & Conditions - One-Time Acceptance ✅

**Issue**: Terms should only be shown once during sign-up.

**Requirements**:
- Terms shown during sign-up flow only
- User must accept to continue
- Acceptance stored in user profile
- Never shown again after acceptance
- Link to view terms anytime in settings

**Acceptance Criteria**:
- [ ] Terms shown only during sign-up
- [ ] User must accept to proceed
- [ ] Acceptance stored in backend
- [ ] Terms not shown on subsequent logins
- [ ] Terms accessible from settings/profile

---

### 2.10 Layout & Positioning ✅

**Issue**: Layout and positioning are okay but need minor adjustments.

**Requirements**:
- Maintain current layout structure
- Ensure consistent spacing
- Responsive to different screen sizes
- Safe area handling
- Keyboard avoidance working correctly

**Acceptance Criteria**:
- [ ] Layout consistent across screens
- [ ] Spacing follows design tokens
- [ ] Responsive on all screen sizes
- [ ] Safe areas respected
- [ ] Keyboard doesn't cover inputs

---

## 3. User Stories

### US-1: As a user, I want clear font readability
**Given** I am on any auth screen  
**When** I view text content  
**Then** I should see crisp, readable text using Poppins for headings and Inter for body text

### US-2: As a user, I want smooth role selection
**Given** I am on the role selection screen  
**When** I select a role  
**Then** The cards should animate upward and the agent response should appear below without overlap

### US-3: As a user, I want to reset my password
**Given** I forgot my password  
**When** I tap "Forgot Password" on login  
**Then** I should receive an OTP and be able to create a new password

### US-4: As an admin, I want to login with my admin email
**Given** I am an admin user  
**When** I login with `admin@speqlink.com`  
**Then** I should be routed to the admin dashboard

### US-5: As a user, I want OTP auto-fill
**Given** I am verifying my phone number  
**When** I receive an OTP via SMS  
**Then** The OTP should auto-fill in the input fields

### US-6: As a user, I want to stay logged in
**Given** I have logged in once  
**When** I close and reopen the app  
**Then** I should remain logged in without re-entering credentials

### US-7: As a user, I want to sign in with Google
**Given** I am on the auth landing page  
**When** I tap "Continue with Google"  
**Then** I should be able to authenticate with my Google account

### US-8: As a user, I want to accept terms only once
**Given** I am signing up for the first time  
**When** I accept the terms and conditions  
**Then** I should never be asked to accept them again

---

## 4. Technical Requirements

### 4.1 Font Installation
- Install `@expo-google-fonts/poppins`
- Install `@expo-google-fonts/inter`
- Configure in `app/_layout.tsx`
- Update `tailwind.config.ts` with new font families
- Update `constants/tokens.ts` with new font tokens

### 4.2 Animation Requirements
- Use `react-native-reanimated` for smooth animations
- Spring animation for role card movement
- Easing for scroll behavior
- 60fps performance target

### 4.3 OTP Auto-Fill
- iOS: Use `textContentType="oneTimeCode"`
- Android: Use SMS Retriever API or similar
- Fallback to manual entry

### 4.4 Secure Storage
- Use `expo-secure-store` for token storage
- Encrypt sensitive data
- Handle storage errors gracefully

### 4.5 OAuth Implementation
- Use `expo-auth-session` for Google OAuth
- Configure OAuth client IDs (iOS, Android, Web)
- Handle OAuth errors and cancellations
- Implement simulation mode for testing

---

## 5. API Endpoints Required

### 5.1 Forgot Password
```
POST /auth/forgot-password
Body: { email: string } | { phone: string }
Response: { message: "OTP sent", otpSent: true }

POST /auth/verify-reset-otp
Body: { identifier: string, otp: string }
Response: { resetToken: string }

POST /auth/reset-password
Body: { resetToken: string, newPassword: string }
Response: { message: "Password reset successful" }
```

### 5.2 OTP Verification
```
POST /auth/send-otp
Body: { type: "email" | "phone", value: string }
Response: { message: "OTP sent", expiresIn: 300 }

POST /auth/verify-otp
Body: { type: "email" | "phone", value: string, otp: string }
Response: { verified: true }
```

### 5.3 Google OAuth
```
POST /auth/google
Body: { idToken: string }
Response: { user: User, accessToken: string, refreshToken: string }
```

### 5.4 Token Refresh
```
POST /auth/refresh
Body: { refreshToken: string }
Response: { accessToken: string }
```

---

## 6. Mock Data for Testing

### 6.1 Admin Credentials
```typescript
// assets/data/auth.ts
export const MOCK_ADMIN = {
  email: "admin@speqlink.com",
  password: "any", // any password works
  role: "admin",
  user: {
    id: "admin_001",
    name: "Admin User",
    email: "admin@speqlink.com",
    isHost: false,
    isVerified: true,
  }
}
```

### 6.2 OTP Codes
```typescript
export const MOCK_OTP = "123456" // Always works for testing
```

### 6.3 Google OAuth Simulation
```typescript
export const MOCK_GOOGLE_USER = {
  id: "google_001",
  name: "Google User",
  email: "user@gmail.com",
  avatar: "https://...",
  isHost: false,
  isVerified: true,
}
```

---

## 7. Success Criteria

### 7.1 Functional Requirements
- [ ] All fonts are readable (Poppins + Inter)
- [ ] Role selection animation works smoothly
- [ ] Forgot password flow complete
- [ ] Admin login works with hardcoded email
- [ ] OTP auto-fill works on iOS & Android
- [ ] Users stay logged in between sessions
- [ ] Google OAuth works (simulated)
- [ ] Terms shown only once

### 7.2 Non-Functional Requirements
- [ ] All animations run at 60fps
- [ ] No memory leaks
- [ ] Secure token storage
- [ ] Error handling for all edge cases
- [ ] Loading states for all async operations
- [ ] Accessibility compliance (contrast, touch targets)

### 7.3 Testing Requirements
- [ ] Manual testing on iOS
- [ ] Manual testing on Android
- [ ] Test all auth flows
- [ ] Test role-based routing
- [ ] Test session persistence
- [ ] Test forgot password flow
- [ ] Test OTP verification
- [ ] Test Google OAuth simulation

---

## 8. Out of Scope

- Backend API implementation (using mocks)
- Biometric authentication (Face ID, Touch ID)
- Social login beyond Google (Facebook, Apple)
- Multi-factor authentication (MFA)
- Account deletion flow
- Email verification links (using OTP only)

---

## 9. Dependencies

### 9.1 New Packages Required
```json
{
  "@expo-google-fonts/poppins": "^0.4.2",
  "@expo-google-fonts/inter": "^0.4.2",
  "expo-secure-store": "~14.0.0",
  "expo-auth-session": "~6.0.0",
  "expo-web-browser": "~15.0.0" // Already installed
}
```

### 9.2 Existing Packages
- `react-native-reanimated` ✅
- `zustand` ✅
- `@tanstack/react-query` ✅
- `axios` ✅

---

## 10. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| OTP auto-fill not working on Android | Medium | Provide clear manual entry UX |
| Google OAuth configuration issues | High | Use simulation mode for testing |
| Token refresh failures | High | Implement retry logic + fallback to login |
| Font loading delays | Low | Use font loading indicators |
| Animation performance issues | Medium | Optimize animations, use native driver |

---

## 11. Timeline Estimate

| Phase | Duration | Tasks |
|-------|----------|-------|
| Font Setup | 1 hour | Install fonts, configure, update tokens |
| Role Animation Fix | 2 hours | Fix animation, test scroll behavior |
| Forgot Password | 3 hours | Implement full flow with OTP |
| Admin Login | 1 hour | Add hardcoded credentials, routing |
| OTP Auto-Fill | 2 hours | Implement iOS & Android auto-fill |
| Session Persistence | 3 hours | SecureStore integration, auto-login |
| Google OAuth | 4 hours | Configure OAuth, implement simulation |
| Terms One-Time | 1 hour | Add acceptance flag, conditional rendering |
| Testing & Polish | 4 hours | Manual testing, bug fixes, polish |
| **Total** | **21 hours** | **~3 days** |

---

## 12. Approval & Sign-Off

**Requirements Approved By**: Pending User Review  
**Date**: 2026-04-29  
**Next Phase**: Design Document

---

## 13. Notes

- All changes must follow the Implementation Guide
- Maintain existing architecture patterns
- Use TypeScript strict mode
- Follow enterprise specifications
- Document all changes
- Test thoroughly before marking complete

---

**Status**: ✅ Requirements Complete - Awaiting User Approval
