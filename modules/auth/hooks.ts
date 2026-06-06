/**
 * Auth module — TanStack Query hooks
 * Enterprise-grade React Query hooks for all authentication operations
 */

import { queryClient } from "@/lib/query/client";
import { tokenStore, useAuthStore } from "@/store/auth.store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authApi } from "./api";
import { saveSession, clearSession, getStoredSession, saveTokens } from "./storage";
import type {
  SignupStartPayload,
  VerifyEmailPayload,
  VerifyPhonePayload,
  CompleteSignupPayload,
  SignInPasswordPayload,
  SignInOtpRequestPayload,
  SignInOtpVerifyPayload,
  ForgotPasswordRequestPayload,
  ForgotPasswordCompletePayload,
  ChangePasswordPayload,
  GoogleMobileSignInPayload,
  GoogleMobileSignUpPayload,
  CreateAdminPayload,
  CreatePropertyAgentPayload,
  User,
} from "./types";

// ============================================================================
// QUERY KEYS
// ============================================================================

export const authKeys = {
  session: ["auth", "session"] as const,
  user: ["auth", "user"] as const,
};

// ============================================================================
// SESSION RESTORATION
// ============================================================================

/**
 * Restore session from secure storage on app launch
 * Automatically attempts token refresh if needed
 */
export function useRestoreSession() {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);
  const clearAuthSession = useAuthStore((s) => s.clearSession);
  const setTokens = tokenStore((s) => s.setTokens);
  const clearTokens = tokenStore((s) => s.clearTokens);

  return useQuery({
    queryKey: authKeys.session,
    queryFn: async () => {
      try {
        const session = await getStoredSession();
        
        if (!session) {
          clearAuthSession();
          return null;
        }

        // Try to refresh the token
        try {
          const refreshResponse = await authApi.refreshToken({
            refreshToken: session.tokens.refreshToken,
          });

          // Save new tokens
          await saveTokens(refreshResponse.refreshToken, session.tokens.refreshToken);
          setTokens(refreshResponse.refreshToken, session.tokens.refreshToken);
          setUser(session.user);

          return session.user;
        } catch (refreshError) {
          // Refresh failed, clear session
          console.log("[Auth] Token refresh failed, clearing session");
          await clearSession();
          clearTokens();
          clearAuthSession();
          return null;
        }
      } catch (error) {
        console.error("[Auth] Session restoration failed:", error);
        clearAuthSession();
        return null;
      }
    },
    retry: false,
    staleTime: Infinity, // Only run once on app launch
  });
}

// ============================================================================
// SIGNUP FLOW HOOKS
// ============================================================================

/**
 * Start signup process
 * Returns nextStep: "verify_email"
 */
export function useSignupStart() {
  return useMutation({
    mutationFn: (payload: SignupStartPayload) => authApi.signup.start(payload),
  });
}

/**
 * Verify email with OTP
 * Returns nextStep: "verify_phone"
 */
export function useVerifyEmail() {
  return useMutation({
    mutationFn: (payload: VerifyEmailPayload) => authApi.signup.verifyEmail(payload),
  });
}

/**
 * Verify phone with OTP
 * Returns nextStep: "accept_terms"
 */
export function useVerifyPhone() {
  return useMutation({
    mutationFn: (payload: VerifyPhonePayload) => authApi.signup.verifyPhone(payload),
  });
}

/**
 * Complete signup by accepting terms
 * Automatically saves tokens and user data to secure storage
 */
export function useCompleteSignup() {
  const setUser = useAuthStore((s) => s.setUser);
  const setTokens = tokenStore ((s) => s.setTokens);

  return useMutation({
    mutationFn: (payload: CompleteSignupPayload) => authApi.signup.complete(payload),
    onSuccess: async (data) => {
      const accessToken = data.accessToken;
      const refreshToken = data.refreshToken;

      // Save to secure storage
      await saveSession(accessToken, refreshToken, data.user);

      // Update app state
      setTokens(accessToken, refreshToken);
      setUser(data.user);

      // Cache user data
      queryClient.setQueryData(authKeys.user, data.user);
    },
  });
}

/**
 * Resend email OTP
 */
export function useResendEmailOtp() {
  return useMutation({
    mutationFn: (email: string) => authApi.signup.resendEmailOtp({ email }),
  });
}

/**
 * Resend phone OTP
 */
export function useResendPhoneOtp() {
  return useMutation({
    mutationFn: (email: string) => authApi.signup.resendPhoneOtp({ email }),
  });
}

// ============================================================================
// SIGN IN HOOKS
// ============================================================================

/**
 * Sign in with password
 * Automatically saves tokens and user data to secure storage
 */
export function useSignInPassword() {
  const setUser = useAuthStore((s) => s.setUser);
  const setTokens = tokenStore((s) => s.setTokens);

  return useMutation({
    mutationFn: (payload: SignInPasswordPayload) => authApi.signin.withPassword(payload),
    onSuccess: async (data) => {
      const accessToken = data.accessToken;
      const refreshToken = data.refreshToken;

      await saveSession(accessToken, refreshToken, data.user);
      setTokens(accessToken, refreshToken);
      setUser(data.user);
      queryClient.setQueryData(authKeys.user, data.user);
    },
  });
}

/**
 * Request OTP for sign in
 */
export function useSignInOtpRequest() {
  return useMutation({
    mutationFn: (payload: SignInOtpRequestPayload) => authApi.signin.requestOtp(payload),
  });
}

/**
 * Verify OTP and sign in
 * Automatically saves tokens and user data to secure storage
 */
export function useSignInOtpVerify() {
  const setUser = useAuthStore((s) => s.setUser);
  const setTokens = tokenStore((s) => s.setTokens);

  return useMutation({
    mutationFn: (payload: SignInOtpVerifyPayload) => authApi.signin.verifyOtp(payload),
    onSuccess: async (data) => {
      const accessToken = data.accessToken;
      const refreshToken = data.refreshToken;

      await saveSession(accessToken, refreshToken, data.user);
      setTokens(accessToken, refreshToken);
      setUser(data.user);
      queryClient.setQueryData(authKeys.user, data.user);
    },
  });
}

// ============================================================================
// PASSWORD MANAGEMENT HOOKS
// ============================================================================

/**
 * Request password reset OTP
 */
export function useForgotPasswordRequest() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordRequestPayload) =>
      authApi.password.forgotRequest(payload),
  });
}

/**
 * Complete password reset with OTP
 */
export function useForgotPasswordComplete() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordCompletePayload) =>
      authApi.password.forgotComplete(payload),
  });
}

/**
 * Change password (requires authentication)
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => authApi.password.change(payload),
  });
}

// ============================================================================
// GOOGLE OAUTH HOOKS
// ============================================================================

/**
 * Sign in with Google (for existing users)
 * Automatically saves tokens and user data to secure storage
 */
export function useGoogleSignIn() {
  const setUser = useAuthStore((s) => s.setUser);
  const setTokens = tokenStore((s) => s.setTokens);

  return useMutation({
    mutationFn: (payload: GoogleMobileSignInPayload) => authApi.google.signin(payload),
    onSuccess: async (data) => {
      const accessToken = data.token;
      const refreshToken = data.token; // Use same token for refresh

      await saveSession(accessToken, refreshToken, data.user);
      setTokens(accessToken, refreshToken);
      setUser(data.user);
      queryClient.setQueryData(authKeys.user, data.user);
    },
  });
}

/**
 * Sign up with Google (for new users)
 * Automatically saves tokens and user data to secure storage
 */
export function useGoogleSignUp() {
  const setUser = useAuthStore((s) => s.setUser);
  const setTokens = tokenStore((s) => s.setTokens);

  return useMutation({
    mutationFn: (payload: GoogleMobileSignUpPayload) => authApi.google.signup(payload),
    onSuccess: async (data) => {
      const accessToken = data.token;
      const refreshToken = data.token; // Use same token for refresh

      await saveSession(accessToken, refreshToken, data.user);
      setTokens(accessToken, refreshToken);
      setUser(data.user);
      queryClient.setQueryData(authKeys.user, data.user);
    },
  });
}

// ============================================================================
// SESSION MANAGEMENT HOOKS
// ============================================================================

/**
 * Logout user
 * Clears all stored data and resets app state
 */
export function useLogout() {
  const clearAuthSession = useAuthStore((s) => s.clearSession);
  const clearTokens = tokenStore((s) => s.clearTokens);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: async () => {
      // Clear secure storage
      await clearSession();
      
      // Clear app state
      clearTokens();
      clearAuthSession();
      
      // Clear all cached data
      queryClient.clear();
    },
  });
}

/**
 * Refresh access token
 * Used internally by API client interceptor
 */
export async function refreshAccessToken(refreshToken: string): Promise<string> {
  const response = await authApi.refreshToken({ refreshToken });
  const newAccessToken = response.refreshToken;

  // Save new tokens
  await saveTokens(newAccessToken, refreshToken);
  tokenStore.getState().setTokens(newAccessToken, refreshToken);

  return newAccessToken;
}

// ============================================================================
// ADMIN HOOKS
// ============================================================================

/**
 * Create admin user (superadmin only)
 */
export function useCreateAdmin() {
  return useMutation({
    mutationFn: (payload: CreateAdminPayload) => authApi.admin.createAdmin(payload),
  });
}

/**
 * Create property agent (property_owner only)
 */
export function useCreatePropertyAgent() {
  return useMutation({
    mutationFn: (payload: CreatePropertyAgentPayload) =>
      authApi.admin.createPropertyAgent(payload),
  });
}

// ============================================================================
// HELPER HOOKS
// ============================================================================

/**
 * Get current authenticated user from state
 */
export function useCurrentUser(): User | null {
  return useAuthStore((s) => s.user);
}

/**
 * Check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  return useAuthStore((s) => s.isAuthenticated);
}

/**
 * Check if auth is loading (during session restoration)
 */
export function useAuthLoading(): boolean {
  return useAuthStore((s) => s.isLoading);
}
