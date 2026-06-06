// Profile module TanStack Query hooks
// This is the public API for data access - components import from here

import { tokenStore, useAuthStore } from "@/store/auth.store";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import * as profileApi from "./api";

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
 * Only runs when user is authenticated
 */
export function useProfile() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const accessToken = tokenStore((s) => s.accessToken);
  
  return useQuery({
    queryKey: profileKeys.detail(),
    queryFn: async () => {
      const response = await profileApi.getProfile();
      // Transform to match component expectations
      return {
        id: response.profile.userId,
        name: response.profile.fullName,
        email: response.profile.email,
        phone: response.profile.phone || undefined,
        avatar: response.profile.avatarUrl || undefined,
      };
    },
    enabled: isAuthenticated && !!accessToken,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch user accounts for multi-account management
 * Stale time: 10 minutes
 * Only runs when user is authenticated
 */
export function useAccounts() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const accessToken = tokenStore((s) => s.accessToken);
  
  return useQuery({
    queryKey: profileKeys.accounts(),
    queryFn: async () => {
      const response = await profileApi.getAccounts();
      return response;
    },
    enabled: isAuthenticated && !!accessToken,
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
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async (payload: { name?: string; email?: string; phone?: string; avatar?: string }) => {
      return await profileApi.updateProfile(payload);
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: profileKeys.detail() });
      // Update auth store with new profile data
      if (user) {
        setUser({
          ...user,
          fullName: data.name,
          email: data.email,
          phone: data.phone || null,
        });
      }
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
    mutationFn: async (formData: FormData) => {
      return await profileApi.uploadAvatarImage(formData);
    },
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
    mutationFn: async (payload: { language: "en" | "sw" }) => {
      return await profileApi.updateLanguagePreference(payload);
    },
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
    mutationFn: async (payload: { preferences: any }) => {
      return await profileApi.updateNotificationPreferences(payload);
    },
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
    mutationFn: async (payload: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
      return await profileApi.changeUserPassword(payload);
    },
  });
}

/**
 * Toggle two-factor authentication
 * On success: invalidates security cache
 */
export function useToggleTwoFactor() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { enabled: boolean }) => {
      return await profileApi.toggleTwoFactorAuth(payload);
    },
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
    mutationFn: async (accountId: string) => {
      return await profileApi.switchAccount(accountId);
    },
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      setUser({
        id: data.user.id,
        fullName: data.user.name,
        email: data.user.email,
        phone: data.user.phone || null,
        role: "tenant",
      });
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
    mutationFn: async (credentials: { email: string; password: string }) => {
      return await profileApi.addAccount(credentials);
    },
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
    mutationFn: async () => {
      return await profileApi.logout();
    },
    onSuccess: () => {
      clearTokens();
      clearSession();
      qc.clear(); // Clear all cached data
    },
  });
}
