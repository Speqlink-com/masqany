// Profile module TanStack Query hooks
// This is the public API for data access - components import from here

import { tokenStore, useAuthStore } from "@/store/auth.store";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { profileApi } from "./api";
import type {
  LanguageUpdatePayload,
  NotificationUpdatePayload,
  PasswordChangePayload,
  ProfileUpdatePayload,
  TwoFactorTogglePayload,
} from "./types";

// ---------------------------------------------------------------------------
// Query keys — centralized for cache management
// ---------------------------------------------------------------------------
export const profileKeys = {
  all: ["profile"] as const,
  detail: () => [...profileKeys.all, "detail"] as const,
  notifications: () => [...profileKeys.all, "notifications"] as const,
  security: () => [...profileKeys.all, "security"] as const,
  accounts: () => [...profileKeys.all, "accounts"] as const,
};

// ---------------------------------------------------------------------------
// Data fetching hooks
// ---------------------------------------------------------------------------

/**
 * Fetch current user profile
 * Stale time: 5 minutes
 */
export function useProfile() {
  return useQuery({
    queryKey: profileKeys.detail(),
    queryFn: () => profileApi.getProfile(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch user accounts for multi-account management
 * Stale time: 10 minutes
 */
export function useAccounts() {
  return useQuery({
    queryKey: profileKeys.accounts(),
    queryFn: () => profileApi.getAccounts(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// ---------------------------------------------------------------------------
// Profile mutation hooks
// ---------------------------------------------------------------------------

/**
 * Update user profile (name, email, phone, avatar)
 * On success: invalidates profile cache and updates auth store
 */
export function useUpdateProfile() {
  const qc = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (payload: ProfileUpdatePayload) =>
      profileApi.updateProfile(payload),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: profileKeys.detail() });
      setUser(data);
    },
  });
}

/**
 * Upload user avatar image
 * On success: invalidates profile cache
 */
export function useUploadAvatar() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => profileApi.uploadAvatar(formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileKeys.detail() });
    },
  });
}

// ---------------------------------------------------------------------------
// Settings mutation hooks
// ---------------------------------------------------------------------------

/**
 * Update language preference
 * On success: invalidates profile cache
 */
export function useUpdateLanguage() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: LanguageUpdatePayload) =>
      profileApi.updateLanguage(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileKeys.detail() });
    },
  });
}

/**
 * Update notification preferences
 * On success: invalidates notifications cache
 */
export function useUpdateNotifications() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: NotificationUpdatePayload) =>
      profileApi.updateNotifications(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileKeys.notifications() });
    },
  });
}

/**
 * Change user password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: PasswordChangePayload) =>
      profileApi.changePassword(payload),
  });
}

/**
 * Toggle two-factor authentication
 * On success: invalidates security cache
 */
export function useToggleTwoFactor() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: TwoFactorTogglePayload) =>
      profileApi.toggleTwoFactor(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileKeys.security() });
    },
  });
}

// ---------------------------------------------------------------------------
// Account management mutation hooks
// ---------------------------------------------------------------------------

/**
 * Switch to a different account
 * On success: updates tokens, updates user, invalidates all queries
 */
export function useSwitchAccount() {
  const qc = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const setTokens = tokenStore((s) => s.setTokens);

  return useMutation({
    mutationFn: (accountId: string) => profileApi.switchAccount(accountId),
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      qc.invalidateQueries(); // Invalidate all queries
    },
  });
}

/**
 * Add a new account
 * On success: invalidates accounts cache
 */
export function useAddAccount() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      profileApi.addAccount(credentials),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileKeys.accounts() });
    },
  });
}

/**
 * Logout current user
 * On success: clears tokens, clears session, clears all query cache
 */
export function useLogout() {
  const qc = useQueryClient();
  const clearSession = useAuthStore((s) => s.clearSession);
  const clearTokens = tokenStore((s) => s.clearTokens);

  return useMutation({
    mutationFn: () => profileApi.logout(),
    onSuccess: () => {
      clearTokens();
      clearSession();
      qc.clear(); // Clear all cached data
    },
  });
}
