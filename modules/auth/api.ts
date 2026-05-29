/**
 * Auth module — API bindings.
 * No component calls these directly; they are wrapped by hooks in hooks.ts.
 *
 * The backend returns snake_case fields and nests auth payloads under `data`.
 * This file normalizes responses into the camelCase shapes used by the app.
 */

import { apiClient } from "@/lib/api/client";
import type { User, UserRole } from "@/types";

type BackendRole = "TENANT" | "PROPERTY_OWNER" | "PROPERTY_AGENT" | "DRIVER" | "ADMIN" | "SUPERADMIN";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data?: T;
}

interface BackendUser {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  role: BackendRole;
  is_active?: boolean;
  is_verified?: boolean;
  email_verified?: boolean;
  phone_verified?: boolean;
  last_login_at?: string;
  created_at: string;
}

interface AuthData {
  access_token: string;
  refresh_token: string;
  token_type?: string;
  expires_in?: number;
  user: BackendUser;
}

export interface LoginPayload {
  email: string;
  password?: string;
  otp_code?: string;
  device_info?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone_number: string;
  role: "TENANT" | "PROPERTY_OWNER" | "DRIVER";
  password: string;
}

export interface SendOtpPayload {
  email: string;
  purpose: "verification" | "login" | "password_reset";
}

export interface VerifyOtpPayload {
  email: string;
  otp_code: string;
  purpose: "verification" | "login" | "password_reset";
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  new_password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  expiresIn?: number;
}

export interface RegisterResponse {
  email: string;
  role: string;
  requiresVerification: boolean;
}

export interface OtpResponse {
  email: string;
  purpose: string;
  otp?: string;
}

export interface VerifyOtpResponse {
  email: string;
  role: string;
  isVerified: boolean;
}

const ROLE_MAP: Record<BackendRole, UserRole> = {
  TENANT: "tenant",
  PROPERTY_OWNER: "property_owner",
  PROPERTY_AGENT: "property_agent",
  DRIVER: "relocation_driver",
  ADMIN: "admin",
  SUPERADMIN: "super_admin",
};

type SignupRoleInput = RegisterPayload["role"] | "tenant" | "property_owner" | "property_agent" | "relocation_driver";

function normalizeSignupRole(role: SignupRoleInput): RegisterPayload["role"] {
  switch (role) {
    case "tenant":
      return "TENANT";
    case "property_owner":
    case "property_agent":
      return "PROPERTY_OWNER";
    case "relocation_driver":
      return "DRIVER";
    default:
      return role;
  }
}

function normalizeUser(user: BackendUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone_number,
    role: ROLE_MAP[user.role],
    isHost: user.role === "PROPERTY_OWNER" || user.role === "PROPERTY_AGENT",
    isVerified: Boolean(user.is_verified ?? user.email_verified),
    createdAt: user.created_at,
  };
}

function unwrapAuthResponse(response: ApiEnvelope<AuthData>): AuthResponse {
  if (!response.data) {
    throw new Error(response.message || "Authentication failed");
  }

  return {
    user: normalizeUser(response.data.user),
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token,
    tokenType: response.data.token_type,
    expiresIn: response.data.expires_in,
  };
}

export const authApi = {
  signup: (payload: RegisterPayload) =>
    apiClient
      .post<ApiEnvelope<RegisterResponse>>("/auth/signup", {
        ...payload,
        role: normalizeSignupRole(payload.role),
      })
      .then((r) => r.data.data ?? { email: payload.email, role: payload.role, requiresVerification: true }),

  sendOtp: (payload: SendOtpPayload) =>
    apiClient
      .post<ApiEnvelope<OtpResponse>>("/auth/send-otp", payload)
      .then((r) => r.data.data ?? { email: payload.email, purpose: payload.purpose }),

  verifyOtp: (payload: VerifyOtpPayload) =>
    apiClient
      .post<ApiEnvelope<VerifyOtpResponse>>("/auth/verify-otp", payload)
      .then((r) => r.data.data ?? { email: payload.email, role: "TENANT", isVerified: true }),

  login: (payload: LoginPayload) =>
    apiClient.post<ApiEnvelope<AuthData>>("/auth/login", payload).then((r) => unwrapAuthResponse(r.data)),

  forgotPassword: (payload: ForgotPasswordPayload) =>
    apiClient
      .post<ApiEnvelope<null>>("/auth/forgot-password", payload)
      .then((r) => r.data),

  resetPassword: (payload: ResetPasswordPayload) =>
    apiClient
      .post<ApiEnvelope<{ email: string }>>("/auth/reset-password", payload)
      .then((r) => r.data),

  loginWithGoogle: (idToken: string) =>
    apiClient
      .post<ApiEnvelope<AuthData>>("/auth/google", { idToken })
      .then((r) => unwrapAuthResponse(r.data)),

  logout: () => apiClient.post("/auth/logout").then((r) => r.data),

  refreshToken: (refreshToken: string) =>
    apiClient
      .post<ApiEnvelope<AuthData>>("/auth/refresh-token", { refresh_token: refreshToken })
      .then((r) => unwrapAuthResponse(r.data)),

  me: () => apiClient.get<BackendUser>("/auth/me").then((r) => normalizeUser(r.data)),
};
