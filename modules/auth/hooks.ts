/**
 * Auth module — TanStack Query hooks.
 * These are the only entry points for auth data in the UI layer.
 */

import { queryClient } from "@/lib/query/client";
import { tokenStore, useAuthStore } from "@/store/auth.store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authApi, LoginPayload, RegisterPayload } from "./api";

// ---------------------------------------------------------------------------
// Query keys — centralized to avoid typos and enable targeted invalidation
// ---------------------------------------------------------------------------
export const authKeys = {
  me: ["auth", "me"] as const,
};

// ---------------------------------------------------------------------------
// Fetch current user (runs on app boot to restore session)
// ---------------------------------------------------------------------------
export function useCurrentUser() {
  const setUser = useAuthStore((s) => s.setUser);
  const clearSession = useAuthStore((s) => s.clearSession);

  const query = useQuery({
    queryKey: authKeys.me,
    queryFn: async () => {
      try {
        const user = await authApi.me();
        setUser(user);
        return user;
      } catch {
        clearSession();
        throw new Error("Session expired");
      }
    },
    enabled: !!tokenStore.getState().accessToken,
    retry: false,
  });

  return query;
}

// ---------------------------------------------------------------------------
// Login mutation
// ---------------------------------------------------------------------------
export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);
  const setTokens = tokenStore((s) => s.setTokens);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      queryClient.setQueryData(authKeys.me, data.user);
    },
  });
}

// ---------------------------------------------------------------------------
// Register mutation
// ---------------------------------------------------------------------------
export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.signup(payload),
  });
}

// ---------------------------------------------------------------------------
// Google login mutation
// ---------------------------------------------------------------------------
export function useGoogleLogin() {
  const setUser = useAuthStore((s) => s.setUser);
  const setTokens = tokenStore((s) => s.setTokens);

  return useMutation({
    mutationFn: (idToken: string) => authApi.loginWithGoogle(idToken),
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      queryClient.setQueryData(authKeys.me, data.user);
    },
  });
}

// ---------------------------------------------------------------------------
// Logout mutation
// ---------------------------------------------------------------------------
export function useLogout() {
  const clearSession = useAuthStore((s) => s.clearSession);
  const clearTokens = tokenStore((s) => s.clearTokens);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      clearTokens();
      clearSession();
      queryClient.clear();
    },
  });
}
