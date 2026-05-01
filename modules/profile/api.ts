// Profile module API layer
// All HTTP calls for profile operations go through this file

import { apiClient } from "@/lib/api/client";
import type {
    LanguageUpdatePayload,
    MultiAccountState,
    NotificationPreferences,
    NotificationUpdatePayload,
    PasswordChangePayload,
    ProfileUpdatePayload,
    SecuritySettings,
    TwoFactorTogglePayload,
    UserProfile,
} from "./types";

export const profileApi = {
  // Get current user profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>("/user/profile");
    return response.data;
  },

  // Update profile information
  updateProfile: async (
    payload: ProfileUpdatePayload
  ): Promise<UserProfile> => {
    const response = await apiClient.put<UserProfile>(
      "/user/profile",
      payload
    );
    return response.data;
  },

  // Upload avatar image
  uploadAvatar: async (formData: FormData): Promise<{ avatarUrl: string }> => {
    const response = await apiClient.post<{ avatarUrl: string }>(
      "/user/avatar",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  // Update language preference
  updateLanguage: async (
    payload: LanguageUpdatePayload
  ): Promise<UserProfile> => {
    const response = await apiClient.put<UserProfile>(
      "/user/language",
      payload
    );
    return response.data;
  },

  // Update notification preferences
  updateNotifications: async (
    payload: NotificationUpdatePayload
  ): Promise<NotificationPreferences> => {
    const response = await apiClient.put<NotificationPreferences>(
      "/user/notifications",
      payload
    );
    return response.data;
  },

  // Change password
  changePassword: async (
    payload: PasswordChangePayload
  ): Promise<{ success: boolean }> => {
    const response = await apiClient.post<{ success: boolean }>(
      "/user/password/change",
      payload
    );
    return response.data;
  },

  // Toggle 2FA
  toggleTwoFactor: async (
    payload: TwoFactorTogglePayload
  ): Promise<SecuritySettings> => {
    const response = await apiClient.post<SecuritySettings>(
      "/user/2fa/toggle",
      payload
    );
    return response.data;
  },

  // Get multi-account list
  getAccounts: async (): Promise<MultiAccountState> => {
    const response = await apiClient.get<MultiAccountState>("/user/accounts");
    return response.data;
  },

  // Switch account
  switchAccount: async (
    accountId: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: UserProfile;
  }> => {
    const response = await apiClient.post<{
      accessToken: string;
      refreshToken: string;
      user: UserProfile;
    }>("/user/accounts/switch", { accountId });
    return response.data;
  },

  // Add new account
  addAccount: async (credentials: {
    email: string;
    password: string;
  }): Promise<{
    accessToken: string;
    refreshToken: string;
    user: UserProfile;
  }> => {
    const response = await apiClient.post<{
      accessToken: string;
      refreshToken: string;
      user: UserProfile;
    }>("/user/accounts/add", credentials);
    return response.data;
  },

  // Logout
  logout: async (): Promise<{ success: boolean }> => {
    const response = await apiClient.post<{ success: boolean }>(
      "/auth/logout"
    );
    return response.data;
  },
};
