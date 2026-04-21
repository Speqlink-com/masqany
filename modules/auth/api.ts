/**
 * Auth module — API bindings.
 * No component calls these directly; they are wrapped by hooks in hooks.ts.
 */

import { apiClient } from "@/lib/api/client";
import type { User } from "@/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>("/auth/login", payload).then((r) => r.data),

  register: (payload: RegisterPayload) =>
    apiClient.post<AuthResponse>("/auth/register", payload).then((r) => r.data),

  loginWithGoogle: (idToken: string) =>
    apiClient
      .post<AuthResponse>("/auth/google", { idToken })
      .then((r) => r.data),

  logout: () => apiClient.post("/auth/logout").then((r) => r.data),

  refreshToken: (refreshToken: string) =>
    apiClient
      .post<{ accessToken: string }>("/auth/refresh", { refreshToken })
      .then((r) => r.data),

  me: () => apiClient.get<User>("/auth/me").then((r) => r.data),
};
