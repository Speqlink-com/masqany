/**
 * Auth module — API client
 * Comprehensive authentication API bindings for all backend endpoints
 * 
 * Base URL: 
 * - Dev: http://masqany.speqlink.com/api/auth
 * - Prod: https://masqany.speqlink.com/api/auth
 */

import { apiClient } from "@/lib/api/client";
import type {
    AdminCreatedResponse,
    AuthSuccessResponse,
    ChangePasswordPayload,
    CompleteSignupPayload,
    CreateAdminPayload,
    CreatePropertyAgentPayload,
    CreateSuperadminPayload,
    ForgotPasswordCompletePayload,
    ForgotPasswordRequestPayload,
    GoogleAuthResponse,
    GoogleMobileSignInPayload,
    GoogleMobileSignUpPayload,
    LogoutResponse,
    OtpRequestResponse,
    PasswordChangeResponse,
    PasswordResetResponse,
    RefreshTokenPayload,
    RefreshTokenResponse,
    ResendOtpPayload,
    SignInOtpRequestPayload,
    SignInOtpVerifyPayload,
    SignInPasswordPayload,
    SignupStartPayload,
    SignupStartResponse,
    VerifyEmailPayload,
    VerifyEmailResponse,
    VerifyPhonePayload,
    VerifyPhoneResponse,
} from "./types";

// ============================================================================
// SIGNUP FLOW
// ============================================================================

export const signup = {
  /**
   * Start the signup process
   * Returns nextStep: "verify_email"
   */
  start: (payload: SignupStartPayload) =>
    apiClient
      .post<SignupStartResponse>("/auth/signup/start", payload)
      .then((res) => res.data),

  /**
   * Verify email with OTP code
   * Returns nextStep: "verify_phone"
   */
  verifyEmail: (payload: VerifyEmailPayload) =>
    apiClient
      .post<VerifyEmailResponse>("/auth/signup/verify-email", payload)
      .then((res) => res.data),

  /**
   * Verify phone with OTP code
   * Returns nextStep: "accept_terms"
   */
  verifyPhone: (payload: VerifyPhonePayload) =>
    apiClient
      .post<VerifyPhoneResponse>("/auth/signup/verify-phone", payload)
      .then((res) => res.data),

  /**
   * Complete signup by accepting terms
   * Returns access token, refresh token, and user data
   */
  complete: (payload: CompleteSignupPayload) =>
    apiClient
      .post<AuthSuccessResponse>("/auth/signup/complete", payload)
      .then((res) => res.data),

  /**
   * Resend email OTP
   */
  resendEmailOtp: (payload: ResendOtpPayload) =>
    apiClient
      .post<OtpRequestResponse>("/auth/signup/resend-email-otp", payload)
      .then((res) => res.data),

  /**
   * Resend phone OTP
   */
  resendPhoneOtp: (payload: ResendOtpPayload) =>
    apiClient
      .post<OtpRequestResponse>("/auth/signup/resend-phone-otp", payload)
      .then((res) => res.data),
};

// ============================================================================
// SIGN IN
// ============================================================================

export const signin = {
  /**
   * Sign in with password
   * Returns access token, refresh token, and user data
   */
  withPassword: (payload: SignInPasswordPayload) =>
    apiClient
      .post<AuthSuccessResponse>("/auth/signin/password", payload)
      .then((res) => res.data),

  /**
   * Request OTP for sign in
   * Sends OTP to email or phone
   */
  requestOtp: (payload: SignInOtpRequestPayload) =>
    apiClient
      .post<OtpRequestResponse>("/auth/signin/otp/request", payload)
      .then((res) => res.data),

  /**
   * Verify OTP and sign in
   * Returns access token, refresh token, and user data
   */
  verifyOtp: (payload: SignInOtpVerifyPayload) =>
    apiClient
      .post<AuthSuccessResponse>("/auth/signin/otp/verify", payload)
      .then((res) => res.data),
};

// ============================================================================
// PASSWORD MANAGEMENT
// ============================================================================

export const password = {
  /**
   * Request password reset OTP
   * Sends OTP to email or phone
   */
  forgotRequest: (payload: ForgotPasswordRequestPayload) =>
    apiClient
      .post<OtpRequestResponse>("/auth/password/forgot/request", payload)
      .then((res) => res.data),

  /**
   * Complete password reset with OTP
   * Verifies OTP and sets new password
   */
  forgotComplete: (payload: ForgotPasswordCompletePayload) =>
    apiClient
      .post<PasswordResetResponse>("/auth/password/forgot/complete", payload)
      .then((res) => res.data),

  /**
   * Change password (requires authentication)
   * Note: Requires X-User-Email header (handled by API client interceptor)
   */
  change: (payload: ChangePasswordPayload) =>
    apiClient
      .put<PasswordChangeResponse>("/auth/password/change", payload)
      .then((res) => res.data),
};

// ============================================================================
// GOOGLE OAUTH (MOBILE)
// ============================================================================

export const google = {
  /**
   * Sign in with Google ID token (for existing users)
   * Returns JWT access token and user data
   */
  signin: (payload: GoogleMobileSignInPayload) =>
    apiClient
      .post<GoogleAuthResponse>("/auth/google/mobile/signin", payload)
      .then((res) => res.data),

  /**
   * Sign up with Google ID token (for new users)
   * Returns JWT access token and user data
   */
  signup: (payload: GoogleMobileSignUpPayload) =>
    apiClient
      .post<GoogleAuthResponse>("/auth/google/mobile/signup", payload)
      .then((res) => res.data),
};

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

/**
 * Refresh access token using refresh token
 * Returns new access token and refresh token
 */
export const refreshToken = (payload: RefreshTokenPayload) =>
  apiClient
    .post<RefreshTokenResponse>("/auth/refresh", payload)
    .then((res) => res.data);

/**
 * Logout user and invalidate tokens
 */
export const logout = () =>
  apiClient
    .post<LogoutResponse>("/auth/logout")
    .then((res) => res.data);

// ============================================================================
// ADMIN ENDPOINTS
// ============================================================================

export const admin = {
  /**
   * Create superadmin account (requires secret key)
   * Only used for initial system setup
   */
  createSuperadmin: (payload: CreateSuperadminPayload) =>
    apiClient
      .post<AdminCreatedResponse>("/auth/superadmin/create", payload)
      .then((res) => res.data),

  /**
   * Create admin user (superadmin only)
   * Requires authentication with superadmin role
   */
  createAdmin: (payload: CreateAdminPayload) =>
    apiClient
      .post<AdminCreatedResponse>("/auth/admin/create", payload)
      .then((res) => res.data),

  /**
   * Create property agent (property_owner only)
   * Requires authentication with property_owner role
   */
  createPropertyAgent: (payload: CreatePropertyAgentPayload) =>
    apiClient
      .post<AdminCreatedResponse>("/auth/property-agent/create", payload)
      .then((res) => res.data),
};

// ============================================================================
// UNIFIED EXPORT
// ============================================================================

export const authApi = {
  signup,
  signin,
  password,
  google,
  refreshToken,
  logout,
  admin,
};
