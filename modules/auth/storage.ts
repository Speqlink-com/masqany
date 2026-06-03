/**
 * Auth module — Secure token storage
 * Uses expo-secure-store for encrypted storage on device
 */

import * as SecureStore from "expo-secure-store";
import type { StoredTokens, User } from "./types";

const KEYS = {
  ACCESS_TOKEN: "masqany_access_token",
  REFRESH_TOKEN: "masqany_refresh_token",
  USER_DATA: "masqany_user_data",
  TOKEN_EXPIRES_AT: "masqany_token_expires_at",
} as const;

// ============================================================================
// TOKEN STORAGE
// ============================================================================

export async function saveTokens(accessToken: string, refreshToken: string): Promise<void> {
  try {
    await Promise.all([
      SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, accessToken),
      SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, refreshToken),
      SecureStore.setItemAsync(KEYS.TOKEN_EXPIRES_AT, Date.now().toString()),
    ]);
  } catch (error) {
    console.error("[Auth Storage] Failed to save tokens:", error);
    throw new Error("Failed to save authentication tokens");
  }
}

export async function getAccessToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error("[Auth Storage] Failed to get access token:", error);
    return null;
  }
}

export async function getRefreshToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error("[Auth Storage] Failed to get refresh token:", error);
    return null;
  }
}

export async function getStoredTokens(): Promise<StoredTokens | null> {
  try {
    const [accessToken, refreshToken, expiresAtStr] = await Promise.all([
      SecureStore.getItemAsync(KEYS.ACCESS_TOKEN),
      SecureStore.getItemAsync(KEYS.REFRESH_TOKEN),
      SecureStore.getItemAsync(KEYS.TOKEN_EXPIRES_AT),
    ]);

    if (!accessToken || !refreshToken) {
      return null;
    }

    return {
      accessToken,
      refreshToken,
      expiresAt: expiresAtStr ? parseInt(expiresAtStr, 10) : undefined,
    };
  } catch (error) {
    console.error("[Auth Storage] Failed to get stored tokens:", error);
    return null;
  }
}

export async function clearTokens(): Promise<void> {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN),
      SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN),
      SecureStore.deleteItemAsync(KEYS.TOKEN_EXPIRES_AT),
    ]);
  } catch (error) {
    console.error("[Auth Storage] Failed to clear tokens:", error);
  }
}

// ============================================================================
// USER DATA STORAGE
// ============================================================================

export async function saveUser(user: User): Promise<void> {
  try {
    await SecureStore.setItemAsync(KEYS.USER_DATA, JSON.stringify(user));
  } catch (error) {
    console.error("[Auth Storage] Failed to save user data:", error);
    throw new Error("Failed to save user data");
  }
}

export async function getStoredUser(): Promise<User | null> {
  try {
    const userData = await SecureStore.getItemAsync(KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("[Auth Storage] Failed to get stored user:", error);
    return null;
  }
}

export async function clearUser(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(KEYS.USER_DATA);
  } catch (error) {
    console.error("[Auth Storage] Failed to clear user data:", error);
  }
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

export async function saveSession(accessToken: string, refreshToken: string, user: User): Promise<void> {
  try {
    await Promise.all([
      saveTokens(accessToken, refreshToken),
      saveUser(user),
    ]);
  } catch (error) {
    console.error("[Auth Storage] Failed to save session:", error);
    throw new Error("Failed to save session");
  }
}

export async function getStoredSession(): Promise<{ tokens: StoredTokens; user: User } | null> {
  try {
    const [tokens, user] = await Promise.all([
      getStoredTokens(),
      getStoredUser(),
    ]);

    if (!tokens || !user) {
      return null;
    }

    return { tokens, user };
  } catch (error) {
    console.error("[Auth Storage] Failed to get stored session:", error);
    return null;
  }
}

export async function clearSession(): Promise<void> {
  try {
    await Promise.all([
      clearTokens(),
      clearUser(),
    ]);
  } catch (error) {
    console.error("[Auth Storage] Failed to clear session:", error);
  }
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export function isTokenExpired(expiresAt?: number): boolean {
  if (!expiresAt) {
    // If no expiry time, assume token is valid for 7 days (default JWT expiry)
    return false;
  }
  
  // Token is expired if current time is past expiry time
  return Date.now() > expiresAt;
}

export async function hasValidSession(): Promise<boolean> {
  try {
    const tokens = await getStoredTokens();
    
    if (!tokens) {
      return false;
    }

    // Check if access token is expired
    if (tokens.expiresAt && isTokenExpired(tokens.expiresAt)) {
      // Token expired, but we can try refresh
      return !!tokens.refreshToken;
    }

    return true;
  } catch (error) {
    console.error("[Auth Storage] Failed to check session validity:", error);
    return false;
  }
}
