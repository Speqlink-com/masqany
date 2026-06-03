/**
 * Auth API - Fixed version matching EXACTLY the working backend endpoints
 * Base URL: http://192.168.0.100 (set in apiClient)
 * All paths start with /api/auth/
 */

import { apiClient } from "@/lib/api/client";
import type {
  SignupStartPayload,
  SignupStartResponse,
  VerifyEmailPayload,
  VerifyEmailResponse,
  VerifyPhonePayload,
  VerifyPhoneResponse,
  CompleteSignupPayload,
  AuthSuccessResponse,
  ResendOtpPayload,
  SignInPasswordPayload,
  SignInOtpRequestPayload,
  SignInOtpVerifyPayload,
  OtpRequestResponse,
  ForgotPasswordRequestPayload,
  ForgotPasswordCompletePayload,
  PasswordResetResponse,
  GoogleMobileSignInPayload,
  GoogleMobileSignUpPayload,
  GoogleAuthResponse,
  RefreshTokenPayload,
  RefreshTokenResponse,
  LogoutResponse,
} from "./types";

// All endpoints start with /api/auth
const BASE = "/api/auth";

// ============================================================================
// WORKING ENDPOINTS (tested with curl)
// ============================================================================

/**
 * Sign in with password
 * Tested: ✅ Working
 * curl -X POST http://localhost/api/auth/signin/password \
 *   -H "Content-Type: application/json" \
 *   -d '{"identifier":"speqlink@gmail.com","password":"@Speqlink1240.,,."}' 
 * 
 * Response: {status, message, refreshToken, user}
 */
export function signInPassword(payload: SignInPasswordPayload) {
  return apiClient
    .post<AuthSuccessResponse>(`${BASE}/signin/password`, payload)
    .then((res) => res.data);
}

/**
 * Start signup
 * Tested: ✅ Working
 * curl -X POST http://localhost/api/auth/signup/start \
 *   -H "Content-Type: application/json" \
 *   -d '{"fullName":"Test User","role":"tenant","email":"test@example.com",
 *        "phone":"+254712345678","password":"TestPass123","confirmPassword":"TestPass123"}'
 * 
 * Response: {status, nextStep: "verify_email", message, user}
 */
export function signupStart(payload: SignupStartPayload) {
  return apiClient
    .post<SignupStartResponse>(`${BASE}/signup/start`, payload)
    .then((res) => res.data);
}

/**
 * Verify email OTP
 * Endpoint: POST /api/auth/signup/verify-email
 * Payload: {email, code}
 * Response: {status, nextStep: "verify_phone", message}
 */
export function verifyEmail(payload: VerifyEmailPayload) {
  return apiClient
    .post<VerifyEmailResponse>(`${BASE}/signup/verify-email`, payload)
    .then((res) => res.data);
}

/**
 * Verify phone OTP
 * Endpoint: POST /api/auth/signup/verify-phone  
 * Payload: {email, code}
 * Response: {status, nextStep: "accept_terms", message}
 */
export function verifyPhone(payload: VerifyPhonePayload) {
  return apiClient
    .post<VerifyPhoneResponse>(`${BASE}/signup/verify-phone`, payload)
    .then((res) => res.data);
}

/**
 * Complete signup (accept terms)
 * Endpoint: POST /api/auth/signup/complete
 * Payload: {email, termsAccepted: true}
 * Response: {status, nextStep: "done", message, refreshToken, user}
 */
export function completeSignup(payload: CompleteSignupPayload) {
  return apiClient
    .post<AuthSuccessResponse>(`${BASE}/signup/complete`, payload)
    .then((res) => res.data);
}

/**
 * Resend email OTP
 * Endpoint: POST /api/auth/signup/resend-email-otp
 * Payload: {email}
 */
export function resendEmailOtp(payload: ResendOtpPayload) {
  return apiClient
    .post<OtpRequestResponse>(`${BASE}/signup/resend-email-otp`, payload)
    .then((res) => res.data);
}

/**
 * Resend phone OTP
 * Endpoint: POST /api/auth/signup/resend-phone-otp
 * Payload: {email}
 */
export function resendPhoneOtp(payload: ResendOtpPayload) {
  return apiClient
    .post<OtpRequestResponse>(`${BASE}/signup/resend-phone-otp`, payload)
    .then((res) => res.data);
}

/**
 * Request OTP for sign in
 * Endpoint: POST /api/auth/signin/otp/request
 * Payload: {identifier}
 */
export function signInOtpRequest(payload: SignInOtpRequestPayload) {
  return apiClient
    .post<OtpRequestResponse>(`${BASE}/signin/otp/request`, payload)
    .then((res) => res.data);
}

/**
 * Verify OTP and sign in
 * Endpoint: POST /api/auth/signin/otp/verify
 * Payload: {identifier, code}
 * Response: {status, message, refreshToken, user}
 */
export function signInOtpVerify(payload: SignInOtpVerifyPayload) {
  return apiClient
    .post<AuthSuccessResponse>(`${BASE}/signin/otp/verify`, payload)
    .then((res) => res.data);
}

/**
 * Request password reset OTP
 * Endpoint: POST /api/auth/password/forgot/request
 * Payload: {identifier}
 */
export function forgotPasswordRequest(payload: ForgotPasswordRequestPayload) {
  return apiClient
    .post<OtpRequestResponse>(`${BASE}/password/forgot/request`, payload)
    .then((res) => res.data);
}

/**
 * Complete password reset
 * Endpoint: POST /api/auth/password/forgot/complete
 * Payload: {identifier, code, newPassword, confirmPassword}
 */
export function forgotPasswordComplete(payload: ForgotPasswordCompletePayload) {
  return apiClient
    .post<PasswordResetResponse>(`${BASE}/password/forgot/complete`, payload)
    .then((res) => res.data);
}

/**
 * Google mobile sign in
 * Endpoint: POST /api/auth/google/mobile/signin
 * Payload: {idToken}
 * Response: {status, message, token, user}
 */
export function googleSignIn(payload: GoogleMobileSignInPayload) {
  return apiClient
    .post<GoogleAuthResponse>(`${BASE}/google/mobile/signin`, payload)
    .then((res) => res.data);
}

/**
 * Google mobile sign up
 * Endpoint: POST /api/auth/google/mobile/signup
 * Payload: {idToken, fullName, role}
 * Response: {status, message, token, user}
 */
export function googleSignUp(payload: GoogleMobileSignUpPayload) {
  return apiClient
    .post<GoogleAuthResponse>(`${BASE}/google/mobile/signup`, payload)
    .then((res) => res.data);
}

/**
 * Refresh access token
 * Endpoint: POST /api/auth/refresh
 * Payload: {refreshToken}
 * Response: {message, refreshToken}
 */
export function refreshToken(payload: RefreshTokenPayload) {
  return apiClient
    .post<RefreshTokenResponse>(`${BASE}/refresh`, payload)
    .then((res) => res.data);
}

/**
 * Logout
 * Endpoint: POST /api/auth/logout
 */
export function logout() {
  return apiClient
    .post<LogoutResponse>(`${BASE}/logout`)
    .then((res) => res.data);
}

// ============================================================================
// SIMPLIFIED EXPORT - Direct functions, no nested objects
// ============================================================================

export const authApiFunctions = {
  // Sign in
  signInPassword,
  signInOtpRequest,
  signInOtpVerify,
  
  // Sign up
  signupStart,
  verifyEmail,
  verifyPhone,
  completeSignup,
  resendEmailOtp,
  resendPhoneOtp,
  
  // Password
  forgotPasswordRequest,
  forgotPasswordComplete,
  
  // Google
  googleSignIn,
  googleSignUp,
  
  // Session
  refreshToken,
  logout,
};
