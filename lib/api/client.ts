/**
 * Axios HTTP client — single instance for the entire app.
 *
 * All modules import from here. No component ever calls axios directly.
 * This gives us one place to:
 *   - Set the base URL (swap staging ↔ production via env)
 *   - Attach auth tokens
 *   - Handle 401 token refresh
 *   - Normalize error shapes before they reach query hooks
 */

import { tokenStore } from "@/store/auth.store";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// ---------------------------------------------------------------------------
// Base URL — swap via environment variable in EAS build profiles
// ---------------------------------------------------------------------------
const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "https://api.masqany.com/v1";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ---------------------------------------------------------------------------
// Request interceptor — attach Bearer token on every request
// ---------------------------------------------------------------------------
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------------------------------------------------------------------
// Response interceptor — normalize errors + handle 401 refresh (placeholder)
// ---------------------------------------------------------------------------
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // TODO: implement token refresh flow when auth service is ready
    // if (error.response?.status === 401) { ... }
    return Promise.reject(normalizeApiError(error));
  }
);

// ---------------------------------------------------------------------------
// Normalized error type — every module receives this shape
// ---------------------------------------------------------------------------
export interface ApiError {
  message: string;
  status: number | null;
  code: string | null;
}

function normalizeApiError(error: AxiosError): ApiError {
  return {
    message:
      (error.response?.data as { message?: string })?.message ??
      error.message ??
      "An unexpected error occurred",
    status: error.response?.status ?? null,
    code: error.code ?? null,
  };
}
