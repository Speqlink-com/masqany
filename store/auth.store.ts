/**
 * Auth store — Zustand slice for client-side session state.
 *
 * Owns: access token, refresh token, authenticated user profile, session flags.
 * Does NOT own: server data like property listings or search results (TanStack Query owns those).
 *
 * The tokenStore is exported separately so the API client interceptor can read
 * the token without importing the full auth store (avoids circular deps).
 */

import { create } from "zustand";

// ---------------------------------------------------------------------------
// User type matching backend response
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Token store — minimal slice used by the API client interceptor
// ---------------------------------------------------------------------------
interface TokenState {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (access: string, refresh: string) => void;
  clearTokens: () => void;
}

export const tokenStore = create<TokenState>((set) => ({
  accessToken: null,
  refreshToken: null,
  setTokens: (access, refresh) =>
    set({ accessToken: access, refreshToken: refresh }),
  clearTokens: () => set({ accessToken: null, refreshToken: null }),
}));

// ---------------------------------------------------------------------------
// Auth store — full session state consumed by screens and hooks
// ---------------------------------------------------------------------------
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  // Actions
  setUser: (user: User) => void;
  clearSession: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: true, isLoading: false }),
  clearSession: () =>
    set({ user: null, isAuthenticated: false, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}));
