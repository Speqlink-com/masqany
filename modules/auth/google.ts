/**
 * Google OAuth integration for mobile
 * 
 * Backend endpoints:
 * - POST /api/auth/google/mobile/signin - For existing users
 * - POST /api/auth/google/mobile/signup - For new users
 * 
 * Note: Requires development build - won't work with Expo Go
 */

import { apiClient } from "@/lib/api/client";
import { saveSession } from "./storage";
import { tokenStore, useAuthStore, User } from "@/store/auth.store";

// Lazy load GoogleSignin to avoid errors in Expo Go
let GoogleSignin: any = null;
try {
  GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
  
  // Configure Google Sign-In only if module is available
  const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "";
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    offlineAccess: false,
  });
} catch (error) {
  console.log('[GOOGLE] Native module not available - requires development build');
}

export interface GoogleAuthResponse {
  status: "success";
  message: string;
  token: string;
  user: User;
}

/**
 * Sign in with Google (for existing users)
 * Uses Google ID Token obtained from Google Sign-In
 */
export async function signInWithGoogle(): Promise<GoogleAuthResponse> {
  console.log("=".repeat(50));
  console.log("[GOOGLE SIGNIN] Starting Google Sign-In...");
  console.log("=".repeat(50));

  try {
    // Get ID token from Google
    const idToken = await promptGoogleSignIn();
    
    if (!idToken) {
      throw new Error("Failed to get Google ID token");
    }

    console.log("[GOOGLE SIGNIN] Got ID token, calling backend...");
    console.log("[GOOGLE SIGNIN] Calling POST /api/auth/google/mobile/signin");

    // Call backend with ID token
    const response = await apiClient.post<GoogleAuthResponse>(
      "/api/auth/google/mobile/signin",
      { idToken }
    );

    console.log("[GOOGLE SIGNIN] ✅ Response:", JSON.stringify(response.data, null, 2));
    console.log("=".repeat(50));

    const { token, user } = response.data;

    // Save session
    await saveSession(token, token, user);
    tokenStore.getState().setTokens(token, token);
    useAuthStore.getState().setUser(user);

    return response.data;
  } catch (err: any) {
    console.log("[GOOGLE SIGNIN] ❌ Error:");
    console.error("[GOOGLE SIGNIN] Full error:", err);
    console.error("[GOOGLE SIGNIN] Error message:", err.message);
    console.error("[GOOGLE SIGNIN] Error status:", err.status);
    console.log("=".repeat(50));
    throw err;
  }
}

/**
 * Sign up with Google (for new users)
 */
export async function signUpWithGoogle(
  fullName: string,
  role: "property_owner" | "tenant" | "relocation_driver"
): Promise<GoogleAuthResponse> {
  console.log("=".repeat(50));
  console.log("[GOOGLE SIGNUP] Starting Google Sign-Up...");
  console.log("[GOOGLE SIGNUP] Full Name:", fullName);
  console.log("[GOOGLE SIGNUP] Role:", role);
  console.log("=".repeat(50));

  try {
    // Get ID token from Google
    const idToken = await promptGoogleSignIn();
    
    if (!idToken) {
      throw new Error("Failed to get Google ID token");
    }

    console.log("[GOOGLE SIGNUP] Got ID token, calling backend...");
    console.log("[GOOGLE SIGNUP] Calling POST /api/auth/google/mobile/signup");

    // Call backend with ID token, fullName, and role
    const response = await apiClient.post<GoogleAuthResponse>(
      "/api/auth/google/mobile/signup",
      { idToken, fullName, role }
    );

    console.log("[GOOGLE SIGNUP] ✅ Response:", JSON.stringify(response.data, null, 2));
    console.log("=".repeat(50));

    const { token, user } = response.data;

    // Save session
    await saveSession(token, token, user);
    tokenStore.getState().setTokens(token, token);
    useAuthStore.getState().setUser(user);

    return response.data;
  } catch (err: any) {
    console.log("[GOOGLE SIGNUP] ❌ Error:");
    console.error("[GOOGLE SIGNUP] Full error:", err);
    console.error("[GOOGLE SIGNUP] Error message:", err.message);
    console.error("[GOOGLE SIGNUP] Error status:", err.status);
    console.log("=".repeat(50));
    throw err;
  }
}

/**
 * Prompt Google Sign-In and return ID token
 * Uses @react-native-google-signin/google-signin
 */
async function promptGoogleSignIn(): Promise<string | null> {
  if (!GoogleSignin) {
    throw new Error(
      "Google Sign-In requires a development build. It won't work with Expo Go.\n\n" +
      "To use Google Sign-In:\n" +
      "1. Run: npx expo prebuild\n" +
      "2. Run: npx expo run:android or npx expo run:ios"
    );
  }

  try {
    console.log("[GOOGLE] Checking Play Services...");
    await GoogleSignin.hasPlayServices();
    
    console.log("[GOOGLE] Prompting user to sign in...");
    const userInfo = await GoogleSignin.signIn();
    
    console.log("[GOOGLE] ✅ User signed in:", userInfo.user.email);
    
    if (!userInfo.data?.idToken) {
      console.error("[GOOGLE] ❌ No ID token received");
      return null;
    }
    
    return userInfo.data.idToken;
  } catch (error: any) {
    console.error('[GOOGLE] ❌ Sign-In error:', error);
    
    if (error.code === 'SIGN_IN_CANCELLED') {
      console.log('[GOOGLE] User cancelled sign-in');
    } else if (error.code === 'IN_PROGRESS') {
      console.log('[GOOGLE] Sign-in already in progress');
    } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
      console.error('[GOOGLE] Play Services not available');
    }
    
    return null;
  }
}

/**
 * Sign out from Google (optional - call when user logs out)
 */
export async function signOutFromGoogle() {
  if (!GoogleSignin) {
    console.log("[GOOGLE] Native module not available");
    return;
  }
  
  try {
    await GoogleSignin.signOut();
    console.log("[GOOGLE] User signed out");
  } catch (error) {
    console.error("[GOOGLE] Sign-out error:", error);
  }
}

/**
 * Check if user is currently signed in to Google
 */
export async function isGoogleSignedIn(): Promise<boolean> {
  if (!GoogleSignin) {
    return false;
  }
  
  try {
    return await GoogleSignin.isSignedIn();
  } catch (error) {
    console.error("[GOOGLE] Error checking sign-in status:", error);
    return false;
  }
}

/**
 * Check if Google Sign-In is available (native module loaded)
 */
export function isGoogleSignInAvailable(): boolean {
  return GoogleSignin !== null;
}
