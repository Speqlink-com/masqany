// Temporary test file to verify all exports are accessible
// This file will be deleted after verification

import {
    // API
    profileApi,

    // Hooks
    profileKeys,
    type Account,
    type LanguageCode,
    type LanguageUpdatePayload,
    type MultiAccountState,
    type NotificationPreferences,
    type NotificationUpdatePayload,
    type PasswordChangePayload,
    type ProfileUpdatePayload,
    type SecuritySettings,
    type TwoFactorTogglePayload,
    // Types
    type UserProfile
} from "./index";

// Verify API is exported
const api = profileApi;

// Verify hooks are exported
const keys = profileKeys;

// Verify types are exported (type-only check)
type TestProfile = UserProfile;
type TestLanguage = LanguageCode;
type TestNotifications = NotificationPreferences;
type TestSecurity = SecuritySettings;
type TestProfileUpdate = ProfileUpdatePayload;
type TestLanguageUpdate = LanguageUpdatePayload;
type TestNotificationUpdate = NotificationUpdatePayload;
type TestPasswordChange = PasswordChangePayload;
type TestTwoFactorToggle = TwoFactorTogglePayload;
type TestAccount = Account;
type TestMultiAccount = MultiAccountState;

export { };

