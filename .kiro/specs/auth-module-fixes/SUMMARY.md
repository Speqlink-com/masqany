# Auth Module Fixes - Specification Summary

**Created**: 2026-04-29  
**Status**: ✅ Ready for Implementation  
**Workflow**: Requirements-First  
**Estimated Time**: 21 hours (~3 days)

---

## 📋 Specification Documents

1. ✅ **requirements.md** - Complete
   - 13 sections covering all issues
   - 8 user stories
   - Clear acceptance criteria
   - API endpoint specifications
   - Mock data requirements

2. ✅ **design.md** - Complete
   - Architecture decisions
   - Component designs
   - Data flow diagrams
   - State management design
   - Security considerations
   - Performance optimizations

3. ✅ **tasks.md** - Complete
   - 200+ implementation tasks
   - 13 major sections
   - Clear task breakdown
   - Testing checklist
   - Deployment preparation

---

## 🎯 Key Issues to Fix

### 1. Font Readability ❌
**Problem**: Blurry fonts, users struggle to read  
**Solution**: Replace with Poppins (headings) + Inter (body text)  
**Impact**: High - affects all screens

### 2. Role Selection Animation ❌
**Problem**: Cards don't move up, response overlaps  
**Solution**: Animated.View with spring animation + proper scroll  
**Impact**: Medium - UX improvement

### 3. Forgot Password ❌
**Problem**: Not implemented  
**Solution**: Complete 3-screen flow with OTP verification  
**Impact**: High - critical feature

### 4. Admin Login ✅
**Problem**: Need hardcoded credentials  
**Solution**: `admin@speqlink.com` with mock response  
**Impact**: Low - testing only

### 5. OTP Auto-Fill ✅
**Problem**: Manual entry only  
**Solution**: iOS/Android auto-fill + paste detection  
**Impact**: Medium - UX improvement

### 6. Session Persistence ❌
**Problem**: Users must login every time  
**Solution**: SecureStore + auto-login on app launch  
**Impact**: High - critical UX

### 7. Google OAuth ❌
**Problem**: Not properly implemented  
**Solution**: expo-auth-session + simulation mode  
**Impact**: Medium - alternative login method

### 8. Terms Acceptance ✅
**Problem**: Shown multiple times  
**Solution**: One-time during sign-up only  
**Impact**: Low - minor UX improvement

---

## 📦 New Dependencies Required

```json
{
  "@expo-google-fonts/poppins": "^0.4.2",
  "@expo-google-fonts/inter": "^0.4.2",
  "expo-secure-store": "~14.0.0",
  "expo-auth-session": "~6.0.0"
}
```

---

## 🗂️ New Files to Create

### Screens
- `app/(auth)/forgot-password.tsx`
- `app/(auth)/forgot-password-otp.tsx`
- `app/(auth)/reset-password.tsx`

### Modules
- `lib/storage/secure.ts` - SecureStore wrapper
- `lib/auth/google.ts` - Google OAuth hook
- `assets/data/auth.ts` - Mock data

---

## 🔄 Files to Modify

### Core Configuration
- `app/_layout.tsx` - Font loading
- `tailwind.config.ts` - Font classes
- `constants/tokens.ts` - Typography tokens

### Auth Screens (Font Updates)
- `app/auth.tsx`
- `app/(auth)/login.tsx`
- `app/(auth)/sign-up.tsx`
- `app/(auth)/google.tsx`
- `app/(auth)/onboarding-name.tsx`
- `app/(auth)/onboarding-role.tsx` - Animation fix
- `app/(auth)/onboarding-credentials.tsx`
- `app/(auth)/onboarding-otp.tsx`
- `app/(auth)/onboarding-complete.tsx`

### Auth Components (Font Updates)
- `components/auth/AgentBubble.tsx`
- `components/auth/PrimaryButton.tsx`
- `components/auth/RoleCard.tsx`

### Auth Module
- `modules/auth/api.ts` - New methods
- `modules/auth/hooks.ts` - New hooks
- `store/auth.store.ts` - Persistence

### App Entry
- `app/index.tsx` - Auto-login logic

---

## ✅ Implementation Order

### Phase 1: Foundation (4 hours)
1. Install font packages
2. Configure font loading
3. Update design tokens
4. Update Tailwind config
5. Update all screens with new fonts

### Phase 2: Animation Fix (2 hours)
1. Fix role selection animation
2. Fix scroll behavior
3. Test on iOS & Android

### Phase 3: Forgot Password (3 hours)
1. Create mock data
2. Update API layer
3. Create 3 new screens
4. Test complete flow

### Phase 4: Session Persistence (3 hours)
1. Install expo-secure-store
2. Create secure storage module
3. Update Zustand store
4. Implement auto-login
5. Test persistence

### Phase 5: Admin & OTP (2 hours)
1. Add admin mock data
2. Update login logic
3. Implement OTP auto-fill
4. Test both features

### Phase 6: Google OAuth (4 hours)
1. Install dependencies
2. Configure OAuth
3. Create Google auth module
4. Update screens
5. Test simulation mode

### Phase 7: Polish & Testing (3 hours)
1. Terms acceptance cleanup
2. Auth landing cleanup
3. Manual testing (iOS & Android)
4. Edge case testing
5. Performance testing

---

## 🧪 Testing Checklist

### Functional Testing
- [ ] All fonts readable (no blur)
- [ ] Role animation smooth
- [ ] Forgot password works end-to-end
- [ ] Admin login routes correctly
- [ ] OTP auto-fills on iOS & Android
- [ ] Session persists between app restarts
- [ ] Google OAuth simulation works
- [ ] Terms shown only once

### Platform Testing
- [ ] iOS simulator
- [ ] iOS physical device
- [ ] Android emulator
- [ ] Android physical device
- [ ] Different screen sizes
- [ ] Different OS versions

### Edge Cases
- [ ] No internet connection
- [ ] Invalid credentials
- [ ] Expired tokens
- [ ] Weak passwords
- [ ] Invalid OTP
- [ ] OAuth cancellation

---

## 📊 Success Metrics

### Performance
- Font load time < 500ms
- Animation frame rate = 60fps
- SecureStore operations < 100ms
- Screen transitions < 300ms

### User Experience
- Zero blurry text
- Smooth animations
- Clear error messages
- Intuitive navigation
- Minimal user input required

---

## 🚀 Deployment Commands

```bash
# 1. Install dependencies
pnpm install

# 2. Check for issues
npx expo-doctor

# 3. Clean build
rm -rf node_modules android .expo
pnpm install
npx expo prebuild --clean

# 4. Build preview
pnpm dlx eas-cli build -p android --profile preview --clear-cache
```

---

## 📝 Environment Variables

Create `.env` file:
```env
EXPO_PUBLIC_API_URL=https://www.masqany.speqlink.com/api/v1/
EXPO_PUBLIC_MOCK_AUTH=true
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_client_id
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your_ios_client_id
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your_android_client_id
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_web_client_id
```

---

## ⚠️ Important Notes

1. **Font Priority**: Must be done first as it affects all screens
2. **Testing**: Test on physical devices, not just simulators
3. **Mock Mode**: Use `EXPO_PUBLIC_MOCK_AUTH=true` for testing
4. **Admin Email**: `admin@speqlink.com` (hardcoded)
5. **OTP Code**: `123456` (hardcoded for testing)
6. **No Breaking Changes**: All changes are additive

---

## 🎯 Next Steps

1. **Review this spec** - Ensure all requirements captured
2. **Get approval** - Confirm approach is correct
3. **Start implementation** - Begin with Phase 1 (Fonts)
4. **Test incrementally** - Test after each phase
5. **Get final approval** - Demo and get sign-off

---

## 📞 Questions to Resolve

Before starting implementation:
- [ ] Confirm font choices (Poppins + Inter)
- [ ] Confirm admin email (`admin@speqlink.com`)
- [ ] Confirm OTP code for testing (`123456`)
- [ ] Confirm Google OAuth simulation is acceptable
- [ ] Confirm session persistence approach

---

**Status**: ✅ Spec Complete - Awaiting User Approval to Start Implementation

**Estimated Completion**: 3 days (21 hours)  
**Risk Level**: Low (all changes are well-defined)  
**Dependencies**: None (self-contained)
