/**
 * Axios HTTP client — single instance for the entire app.
 *
 * All modules import from here. No component ever calls axios directly.
 * This gives us one place to:
 *   - Set the base URL (swap staging ↔ production via env)
 *   - Attach auth tokens
 *   - Handle 401 token refresh
 *   - Normalize error shapes before they reach query hooks
 *   - Implement exponential backoff for network errors
 */

import { tokenStore } from "@/store/auth.store";
import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

// ---------------------------------------------------------------------------
// Base URL — swap via environment variable in EAS build profiles
// ---------------------------------------------------------------------------
const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.0.100:8080/api/v1";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ---------------------------------------------------------------------------
// Exponential backoff retry configuration
// ---------------------------------------------------------------------------
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

interface RetryConfig extends AxiosRequestConfig {
  __retryCount?: number;
}

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
// Response interceptor — normalize errors + handle 401 refresh + retry logic
// ---------------------------------------------------------------------------
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig;
    
    // Check if error is retryable (network errors, 5xx errors)
    const isRetryable = 
      !error.response || // Network error
      (error.response.status >= 500 && error.response.status < 600); // Server error
    
    // Initialize retry count
    if (!config.__retryCount) {
      config.__retryCount = 0;
    }
    
    // Retry with exponential backoff if retryable and under max retries
    if (isRetryable && config.__retryCount < MAX_RETRIES) {
      config.__retryCount += 1;
      
      // Calculate delay with exponential backoff
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, config.__retryCount - 1);
      
      console.log(`[API] Retrying request (attempt ${config.__retryCount}/${MAX_RETRIES}) after ${delay}ms`);
      
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
      
      // Retry the request
      return apiClient(config);
    }
    
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
