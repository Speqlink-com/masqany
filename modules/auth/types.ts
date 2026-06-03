/**
 * Auth module — TypeScript types and interfaces
 * Comprehensive type definitions for the authentication system
 */

// ============================================================================
// USER & ROLE TYPES
// ============================================================================

export type UserRole =
  | "property_owner"
  | "tenant"
  | "relocation_driver"
  | "admin"
  | "superadmin"
  | "property_agent";

export interface User {
  id: string;
  fullName: string;
  role: UserRole;
  email: string;
  phone: string | null;
}

// ============================================================================
// API REQUEST PAYLOADS
// ============================================================================

export interface SignupStartPayload {
  fullName: string;
  role: "property_owner" | "tenant" | "relocation_driver";
  email: string;
  phone: string; // Must be +254XXXXXXXXX format
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailPayload {
  email: string;
  code: string; // 6-digit OTP
}

export interface VerifyPhonePayload {
  email: string;
  code: string; // 6-digit OTP
}

export interface CompleteSignupPayload {
  email: string;
  termsAccepted: true;
}

export interface ResendOtpPayload {
  email: string;
}

export interface SignInPasswordPayload {
  identifier: string; // Email or phone
  password: string;
}

export interface SignInOtpRequestPayload {
  identifier: string; // Email or phone
}

export interface SignInOtpVerifyPayload {
  identifier: string;
  code: string; // 6-digit OTP
}

export interface ForgotPasswordRequestPayload {
  identifier: string; // Email or phone
}

export interface ForgotPasswordCompletePayload {
  identifier: string;
  code: string; // 6-digit OTP
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordPayload {
  password: string;
  confirmPassword: string;
}

export interface GoogleMobileSignInPayload {
  idToken: string; // Google ID token from mobile SDK
}

export interface GoogleMobileSignUpPayload {
  idToken: string; // Google ID token from mobile SDK
  fullName: string;
  role: "property_owner" | "tenant" | "relocation_driver";
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface CreateSuperadminPayload {
  secretKey: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface CreateAdminPayload {
  fullName: string;
  email: string;
  phone: string;
}

export interface CreatePropertyAgentPayload {
  fullName: string;
  email: string;
  phone: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export type SignupNextStep = "verify_email" | "verify_phone" | "accept_terms" | "done";

export interface SignupStartResponse {
  status: "success";
  nextStep: SignupNextStep;
  message: string;
  user: {
    id: string;
    fullName: string;
    role: UserRole;
    email: string;
    phone: string;
  };
}

export interface VerifyEmailResponse {
  status: "success";
  nextStep: "verify_phone";
  message: string;
}

export interface VerifyPhoneResponse {
  status: "success";
  nextStep: "accept_terms";
  message: string;
}

export interface AuthSuccessResponse {
  status: "success";
  message: string;
  refreshToken: string;
  user: User;
}

export interface OtpRequestResponse {
  status: "success";
  nextStep: string;
  message: string;
}

export interface PasswordResetResponse {
  status: "success";
  message: string;
}

export interface PasswordChangeResponse {
  status: "success";
  message: string;
}

export interface GoogleAuthResponse {
  status: "success";
  message: string;
  token: string;
  user: User;
}

export interface RefreshTokenResponse {
  message: string;
  refreshToken: string;
}

export interface LogoutResponse {
  status: "success";
  message: string;
}

export interface AdminCreatedResponse {
  status: "success";
  message: string;
  user: {
    id: string;
    fullName: string;
    role: UserRole;
    email: string;
    phone: string;
  };
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface AuthError {
  message: string;
  status: number | null;
  code: string | null;
}

// ============================================================================
// TOKEN STORAGE TYPES
// ============================================================================

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt?: number;
}

export interface SessionData {
  tokens: StoredTokens;
  user: User;
}
