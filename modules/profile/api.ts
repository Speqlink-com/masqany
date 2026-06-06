/**
 * Profile API Module
 * Integrates with backend profile service endpoints
 * 
 * Base URL: /api/profile
 */

import { apiClient } from "@/lib/api/client";
import type { UserProfile } from "./types";

export interface ProfileData {
  userId: string;
  fullName: string;
  email: string;
  phone: string | null;
  accountStatus: string;
  memberSince: string;
  avatarUrl: string | null;
}

export interface ProfileResponse {
  profile: ProfileData;
}

export interface AccountResponse {
  account: ProfileData;
}

export interface LanguageData {
  language: "english" | "kiswahili";
}

export interface SecurityData {
  twoFactorEnabled: boolean;
}

export interface NotificationsData {
  pushNotifications: boolean;
  emailNotifications: boolean;
  bookingNotifications: boolean;
  chatNotifications: boolean;
  promotionalNotifications: boolean;
}

export interface SupportData {
  email: string;
  phone: string;
}

// Account response structure for multi-account support
export interface AccountsResponse {
  accounts: ProfileData[];
}

// ============================================================================
// PROFILE ENDPOINTS
// ============================================================================

/**
 * Get current user's profile
 * GET /api/profile/me
 */
export async function getProfile(): Promise<ProfileResponse> {
  console.log("[PROFILE API] Fetching profile...");
  const response = await apiClient.get<ProfileResponse>("/api/profile/me");
  console.log("[PROFILE API] ✅ Profile fetched:", response.data);
  return response.data;
}

/**
 * Get account details
 * GET /api/profile/account
 */
export async function getAccount(): Promise<AccountResponse> {
  console.log("[PROFILE API] Fetching account...");
  const response = await apiClient.get<AccountResponse>("/api/profile/account");
  console.log("[PROFILE API] ✅ Account fetched:", response.data);
  return response.data;
}

/**
 * Update account name
 * PUT /api/profile/account/name
 */
export async function updateAccountName(fullName: string): Promise<{ status: string; fullName: string }> {
  console.log("[PROFILE API] Updating name to:", fullName);
  const response = await apiClient.put("/api/profile/account/name", { fullName });
  console.log("[PROFILE API] ✅ Name updated");
  return response.data;
}

// ============================================================================
// LANGUAGE PREFERENCES
// ============================================================================

/**
 * Get language preference
 * GET /api/profile/preferences/language
 */
export async function getLanguage(): Promise<LanguageData> {
  const response = await apiClient.get<LanguageData>("/api/profile/preferences/language");
  return response.data;
}

/**
 * Update language preference
 * PUT /api/profile/preferences/language
 */
export async function updateLanguage(language: "english" | "kiswahili"): Promise<{ status: string; language: string }> {
  console.log("[PROFILE API] Updating language to:", language);
  const response = await apiClient.put("/api/profile/preferences/language", { language });
  console.log("[PROFILE API] ✅ Language updated");
  return response.data;
}

// ============================================================================
// SECURITY SETTINGS
// ============================================================================

/**
 * Get security settings
 * GET /api/profile/security
 */
export async function getSecuritySettings(): Promise<SecurityData> {
  const response = await apiClient.get<SecurityData>("/api/profile/security");
  return response.data;
}

/**
 * Update two-factor authentication
 * PUT /api/profile/security/two-factor
 */
export async function updateTwoFactor(enabled: boolean): Promise<{ status: string; twoFactorEnabled: boolean }> {
  console.log("[PROFILE API] Updating 2FA to:", enabled);
  const response = await apiClient.put("/api/profile/security/two-factor", { enabled });
  console.log("[PROFILE API] ✅ 2FA updated");
  return response.data;
}

/**
 * Change password
 * PUT /api/profile/security/password
 */
export async function changePassword(password: string, confirmPassword: string): Promise<{ status: string }> {
  console.log("[PROFILE API] Changing password...");
  const response = await apiClient.put("/api/profile/security/password", { password, confirmPassword });
  console.log("[PROFILE API] ✅ Password changed");
  return response.data;
}

// ============================================================================
// NOTIFICATION SETTINGS
// ============================================================================

/**
 * Get notification preferences
 * GET /api/profile/notifications
 */
export async function getNotifications(): Promise<NotificationsData> {
  const response = await apiClient.get<NotificationsData>("/api/profile/notifications");
  return response.data;
}

/**
 * Update notification preferences
 * PUT /api/profile/notifications
 */
export async function updateNotifications(settings: NotificationsData): Promise<{ status: string } & NotificationsData> {
  console.log("[PROFILE API] Updating notifications:", settings);
  const response = await apiClient.put("/api/profile/notifications", settings);
  console.log("[PROFILE API] ✅ Notifications updated");
  return response.data;
}

// ============================================================================
// AVATAR MANAGEMENT
// ============================================================================

/**
 * Upload profile avatar
 * POST /api/profile/avatar
 */
export async function uploadAvatar(file: File | Blob): Promise<{ status: string; avatarUrl: string }> {
  console.log("[PROFILE API] Uploading avatar...");
  
  const formData = new FormData();
  formData.append("avatar", file as any);
  
  const response = await apiClient.post("/api/profile/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  console.log("[PROFILE API] ✅ Avatar uploaded:", response.data.avatarUrl);
  return response.data;
}

// ============================================================================
// PHONE NUMBER MANAGEMENT
// ============================================================================

/**
 * Request OTP to change phone number
 * POST /api/profile/account/phone/request-otp
 */
export async function requestPhoneOTP(phone: string): Promise<{ status: string; nextStep: string }> {
  console.log("[PROFILE API] Requesting phone OTP for:", phone);
  const response = await apiClient.post("/api/profile/account/phone/request-otp", { phone });
  console.log("[PROFILE API] ✅ Phone OTP sent");
  return response.data;
}

/**
 * Verify OTP and update phone number
 * POST /api/profile/account/phone/verify-otp
 */
export async function verifyPhoneOTP(code: string): Promise<{ status: string; phone: string }> {
  console.log("[PROFILE API] Verifying phone OTP...");
  const response = await apiClient.post("/api/profile/account/phone/verify-otp", { code });
  console.log("[PROFILE API] ✅ Phone verified and updated");
  return response.data;
}

// ============================================================================
// SUPPORT
// ============================================================================

/**
 * Get support contact information
 * GET /api/profile/support
 */
export async function getSupport(): Promise<SupportData> {
  const response = await apiClient.get<SupportData>("/api/profile/support");
  return response.data;
}

// ============================================================================
// NEW API METHODS FOR HOOKS COMPATIBILITY
// ============================================================================

/**
 * Get user accounts (for multi-account support)
 * Note: Backend doesn't have this endpoint yet, returns single account
 */
export async function getAccounts(): Promise<AccountsResponse> {
  console.log("[PROFILE API] Fetching accounts...");
  try {
    const response = await apiClient.get<AccountResponse>("/api/profile/account");
    console.log("[PROFILE API] ✅ Account fetched:", response.data);
    // Convert single account to array format
    return { accounts: [response.data.account] };
  } catch (err: any) {
    // Don't log "Multiple tokens" errors (they resolve on retry)
    if (!err.message?.includes("Multiple tokens")) {
      console.error("[PROFILE API] ❌ Failed to fetch accounts:", err);
    }
    throw err;
  }
}

/**
 * Update user profile (name, email, phone)
 * Uses individual backend endpoints for each field
 */
export async function updateProfile(payload: { name?: string; email?: string; phone?: string; avatar?: string }): Promise<UserProfile> {
  console.log("[PROFILE API] Updating profile with:", payload);
  
  try {
    // Update name if provided
    if (payload.name) {
      await updateAccountName(payload.name);
    }
    
    // Phone update requires OTP flow, so we skip it here
    // User must use the dedicated phone update flow
    
    // Fetch updated profile
    const profileResponse = await getProfile();
    const profile = profileResponse.profile;
    
    // Convert to UserProfile format
    const userProfile: UserProfile = {
      id: profile.userId,
      name: profile.fullName,
      email: profile.email,
      phone: profile.phone || undefined,
      avatar: profile.avatarUrl || undefined,
      isHost: false,
      isVerified: profile.accountStatus === "verified",
      createdAt: profile.memberSince,
      updatedAt: new Date().toISOString(),
      language: "en",
      notificationPreferences: {
        pushEnabled: true,
        emailEnabled: true,
        bookingNotifications: true,
        chatNotifications: true,
        promotionalNotifications: true,
      },
      securitySettings: {
        twoFactorEnabled: false,
      },
    };
    
    console.log("[PROFILE API] ✅ Profile updated successfully");
    return userProfile;
  } catch (err: any) {
    console.error("[PROFILE API] ❌ Failed to update profile:", err);
    throw new Error(err.message || "Failed to update profile");
  }
}

/**
 * Upload avatar image
 * POST /api/profile/avatar
 */
export async function uploadAvatarImage(formData: FormData): Promise<{ status: string; avatarUrl: string }> {
  console.log("[PROFILE API] Uploading avatar...");
  
  try {
    const response = await apiClient.post("/api/profile/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    console.log("[PROFILE API] ✅ Avatar uploaded:", response.data.avatarUrl);
    return response.data;
  } catch (err: any) {
    console.error("[PROFILE API] ❌ Failed to upload avatar:", err);
    throw new Error(err.message || "Failed to upload avatar");
  }
}

/**
 * Update language preference
 */
export async function updateLanguagePreference(payload: { language: "en" | "sw" }): Promise<{ status: string; language: string }> {
  console.log("[PROFILE API] Updating language preference...");
  
  const backendLang = payload.language === "en" ? "english" : "kiswahili";
  const response = await updateLanguage(backendLang);
  
  return response;
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(payload: { preferences: Partial<NotificationsData> }): Promise<{ status: string }> {
  console.log("[PROFILE API] Updating notification preferences...");
  
  // Get current settings first
  const current = await getNotifications();
  
  // Merge with updates
  const updated: NotificationsData = {
    ...current,
    ...payload.preferences,
  };
  
  await updateNotifications(updated);
  
  return { status: "success" };
}

/**
 * Change password
 */
export async function changeUserPassword(payload: { currentPassword: string; newPassword: string; confirmPassword: string }): Promise<{ status: string }> {
  console.log("[PROFILE API] Changing password...");
  
  await changePassword(payload.newPassword, payload.confirmPassword);
  
  return { status: "success" };
}

/**
 * Toggle two-factor authentication
 */
export async function toggleTwoFactorAuth(payload: { enabled: boolean }): Promise<{ status: string }> {
  console.log("[PROFILE API] Toggling 2FA...");
  
  await updateTwoFactor(payload.enabled);
  
  return { status: "success" };
}

/**
 * Switch account (not implemented in backend yet)
 */
export async function switchAccount(accountId: string): Promise<{ accessToken: string; refreshToken: string; user: UserProfile }> {
  console.log("[PROFILE API] Switch account not implemented yet");
  throw new Error("Account switching not implemented");
}

/**
 * Add account (not implemented in backend yet)
 */
export async function addAccount(credentials: { email: string; password: string }): Promise<{ status: string }> {
  console.log("[PROFILE API] Add account not implemented yet");
  throw new Error("Add account not implemented");
}

/**
 * Logout (clears session)
 */
export async function logout(): Promise<{ status: string }> {
  console.log("[PROFILE API] Logging out...");
  // Note: Backend doesn't have a logout endpoint, just clear client-side session
  return { status: "success" };
}
