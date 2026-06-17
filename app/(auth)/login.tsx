/**
 * Login with password or OTP.
 * User can toggle between password and OTP login methods.
 */
import { AuthLayout } from "@/components/auth/AuthLayout";
import { BackButton } from "@/components/auth/BackButton";
import { ContactUs } from "@/components/auth/ContactUs";
import { PrimaryButton } from "@/components/auth/PrimaryButton";
import { apiClient } from "@/lib/api/client";
import { isGoogleSignInAvailable, signInWithGoogle } from "@/modules/auth/google";
import { saveSession } from "@/modules/auth/storage";
import { tokenStore, useAuthStore, User } from "@/store/auth.store";
import { useRouter } from "expo-router";
import { useState } from "react";
import type { ImageSourcePropType } from "react-native";
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const INPUT_BG = "#AAAABB";

type LoginMethod = "password" | "otp";

interface LoginInputProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  icon: ImageSourcePropType;
  keyboardType?: "default" | "email-address" | "phone-pad";
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  passwordVisible?: boolean;
  onTogglePassword?: () => void;
  containerClassName?: string;
}

function LoginInput({
  value,
  onChangeText,
  placeholder,
  icon,
  keyboardType = "default",
  secureTextEntry,
  showPasswordToggle,
  passwordVisible,
  onTogglePassword,
  containerClassName = "mb-4",
}: LoginInputProps) {
  return (
    <View
      className={`h-14 flex-row items-center rounded-full px-4 ${containerClassName}`}
      style={{
        backgroundColor: INPUT_BG,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 5,
        elevation: 2,
      }}
    >
      <View
        className="w-9 h-9 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
      >
        <Image
          source={icon}
          className="w-5 h-5"
          resizeMode="contain"
          style={{ tintColor: "#FFFFFF" }}
        />
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.72)"
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        autoCorrect={false}
        className="flex-1 font-inter text-white"
        style={{ fontSize: 16 }}
      />
      {showPasswordToggle && (
        <TouchableOpacity
          onPress={onTogglePassword}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="pl-3"
        >
          <Image
            source={require("@/assets/icons/eye-icon.webp")}
            className="w-6 h-6"
            resizeMode="contain"
            style={{ tintColor: "#ffffff", opacity: passwordVisible ? 1 : 0.45 }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("password");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const canSubmit = identifier.trim().length > 0 && 
    (loginMethod === "otp" || password.length >= 6);

  async function handleLogin() {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);

    console.log("=".repeat(50));
    console.log("[LOGIN] Starting login attempt...");
    console.log("[LOGIN] Identifier:", identifier.trim());
    console.log("[LOGIN] Password length:", password.length);
    console.log("[LOGIN] API Base URL:", process.env.EXPO_PUBLIC_API_URL || "http://masqany.speqlink.com");
    console.log("=".repeat(50));

    if (loginMethod === "password") {
      try {
        // Call the EXACT endpoint that works with curl
        console.log("[LOGIN] Calling POST /api/auth/signin/password");
        
        const response = await apiClient.post("/api/auth/signin/password", {
          identifier: identifier.trim(),
          password: password,
        });

        console.log("[LOGIN] ✅ Response received:", JSON.stringify(response.data, null, 2));

        const { accessToken, refreshToken, user } = response.data;

        // Save tokens and user to secure storage
        console.log("[LOGIN] Saving session to secure storage...");
        await saveSession(accessToken, refreshToken, user);
        
        // Update app state
        console.log("[LOGIN] Updating app state...");
        tokenStore.getState().setTokens(accessToken, refreshToken);
        setUser(user);

        console.log("[LOGIN] ✅ Login successful! User:", user.fullName, "Role:", user.role);
        console.log("=".repeat(50));

        setLoading(false);
        
        // Route based on role
        routeByRole(user.role, router);
        
      } catch (err: any) {
        console.log("[LOGIN] ❌ Error occurred:");
        console.error("[LOGIN] Full error:", err);
        console.error("[LOGIN] Error message:", err.message);
        console.error("[LOGIN] Error status:", err.status);
        console.error("[LOGIN] Response data:", err.response?.data);
        console.log("=".repeat(50));
        
        // Normalize error message
        let errorMsg = err.message || err.response?.data?.message || "Login failed";
        
        // User-friendly messages based on error type
        if (err.status === 401 || errorMsg.toLowerCase().includes("invalid") || errorMsg.toLowerCase().includes("incorrect")) {
          errorMsg = "Invalid email or password. Please try again.";
        } else if (err.status === 404) {
          errorMsg = "No account found with this email or phone.";
        } else if (err.status === 429) {
          errorMsg = "Too many login attempts. Please try again later.";
        } else if (!err.status && err.code === "ERR_NETWORK") {
          errorMsg = "Network error. Please check your connection.";
        }
        
        setError(errorMsg);
        setLoading(false);
      }
    } else {
      // OTP Login
      console.log("=".repeat(50));
      console.log("[LOGIN OTP] Requesting OTP...");
      console.log("[LOGIN OTP] Identifier:", identifier.trim());
      console.log("=".repeat(50));

      try {
        console.log("[LOGIN OTP] Calling POST /api/auth/signin/otp/request");
        
        const response = await apiClient.post("/api/auth/signin/otp/request", {
          identifier: identifier.trim(),
        });

        console.log("[LOGIN OTP] ✅ OTP sent:", JSON.stringify(response.data, null, 2));
        console.log("=".repeat(50));

        setLoading(false);
        setOtpSent(true);
        
        // Navigate to OTP screen
        router.push({
          pathname: "/login-otp" as any,
          params: { identifier: identifier.trim() },
        });
      } catch (err: any) {
        console.log("[LOGIN OTP] ❌ Error:");
        console.error("[LOGIN OTP] Full error:", err);
        console.error("[LOGIN OTP] Error message:", err.message);
        console.error("[LOGIN OTP] Error status:", err.status);
        console.log("=".repeat(50));
        
        const errorMsg = err.message || err.response?.data?.message || "Unable to send OTP";
        setError(errorMsg);
        setLoading(false);
      }
    }
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    setError(null);

    console.log("=".repeat(50));
    console.log("[LOGIN GOOGLE] Starting Google Sign-In...");
    console.log("=".repeat(50));

    try {
      const result = await signInWithGoogle();
      
      console.log("[LOGIN GOOGLE] ✅ Success! User:", result.user.fullName);
      console.log("=".repeat(50));

      setGoogleLoading(false);
      
      // Route based on role
      routeByRole(result.user.role, router);
    } catch (err: any) {
      console.log("[LOGIN GOOGLE] ❌ Error:");
      console.error("[LOGIN GOOGLE] Full error:", err);
      console.error("[LOGIN GOOGLE] Error message:", err.message);
      console.error("[LOGIN GOOGLE] Error status:", err.status);
      console.log("=".repeat(50));

      let errorMsg = err.message || "Google Sign-In failed";
      
      if (err.status === 404) {
        errorMsg = "No account found. Please sign up first.";
      } else if (errorMsg.includes("not yet configured")) {
        errorMsg = "Google Sign-In is not configured yet. Use email/password instead.";
      }
      
      setError(errorMsg);
      setGoogleLoading(false);
    }
  }

  function handleDevAccess() {
    console.log("[LOGIN] Dev Access - Bypassing authentication");
    // Set mock user with Property_Owner role matching backend format
    const mockUser: User = {
      id: "dev-user-001",
      fullName: "Dev Property Owner",
      email: "dev@masqany.com",
      phone: "+254700000000",
      role: "property_owner",
    };
    
    setUser(mockUser);
    router.replace("/(property-admin)" as any);
  }

  return (
    <AuthLayout>
      <ContactUs />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 pt-6 pb-12">
            <BackButton />

            <Text
              className="font-poppins-bold text-dark-400 mt-10 mb-3"
              style={{ fontSize: 28 }}
            >
              Welcome back
            </Text>
            <Text
              className="font-inter-regular text-dark-200 mb-6"
              style={{ fontSize: 16, lineHeight: 24 }}
            >
              Sign in to your Masqany account
            </Text>

            {/* Toggle between password and OTP */}
            <View
              className="flex-row rounded-full p-1 mb-6"
              style={{ backgroundColor: "#E5E7EB" }}
            >
              <TouchableOpacity
                onPress={() => setLoginMethod("password")}
                activeOpacity={0.8}
                className="flex-1 py-3 rounded-full items-center"
                style={{
                  backgroundColor: loginMethod === "password" ? "#28B4FA" : "transparent",
                }}
              >
                <Text
                  className="font-inter-semibold"
                  style={{
                    fontSize: 15,
                    color: loginMethod === "password" ? "#FFFFFF" : "#6B7280",
                  }}
                >
                  Password
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setLoginMethod("otp")}
                activeOpacity={0.8}
                className="flex-1 py-3 rounded-full items-center"
                style={{
                  backgroundColor: loginMethod === "otp" ? "#28B4FA" : "transparent",
                }}
              >
                <Text
                  className="font-inter-semibold"
                  style={{
                    fontSize: 15,
                    color: loginMethod === "otp" ? "#FFFFFF" : "#6B7280",
                  }}
                >
                  OTP
                </Text>
              </TouchableOpacity>
            </View>

            <LoginInput
              value={identifier}
              onChangeText={(v) => {
                setIdentifier(v);
                setError(null);
              }}
              icon={require("@/assets/icons/i-email-icon.webp")}
              placeholder="Email or +254 phone"
              keyboardType="email-address"
            />

            {/* Password (only for password login) */}
            {loginMethod === "password" && (
              <>
                <LoginInput
                  value={password}
                  onChangeText={(v) => {
                    setPassword(v);
                    setError(null);
                  }}
                  icon={require("@/assets/icons/password.webp")}
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  showPasswordToggle
                  passwordVisible={showPassword}
                  onTogglePassword={() => setShowPassword((v) => !v)}
                  containerClassName="mb-3"
                />

                {/* Forgot password */}
                <TouchableOpacity 
                  onPress={() => router.push("/forgot-password" as any)}
                  activeOpacity={0.7} 
                  className="self-start mb-6"
                >
                  <Text
                    className="font-inter-semibold text-primary-700 underline"
                    style={{ fontSize: 16 }}
                  >
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {loginMethod === "otp" && (
              <Text
                className="font-inter-regular text-dark-200 mb-6"
                style={{ fontSize: 14, lineHeight: 20 }}
              >
                We will send a 6-digit code to verify your identity
              </Text>
            )}

            {error && (
              <Text
                className="font-inter-regular text-center mb-4"
                style={{ fontSize: 14, color: "#F75555" }}
              >
                {error}
              </Text>
            )}

            {loading ? (
              <View className="items-center py-4 mb-4">
                <ActivityIndicator size="large" color="#28B4FA" />
                <Text className="font-inter-regular text-dark-200 mt-2" style={{ fontSize: 14 }}>
                  Signing in...
                </Text>
              </View>
            ) : (
              <PrimaryButton
                label={loginMethod === "password" ? "Login" : "Send OTP"}
                onPress={handleLogin}
                disabled={!canSubmit}
              />
            )}

            {/* Google Sign-In - Only show if native module is available */}
            {isGoogleSignInAvailable() && (
              <>
                {/* Divider */}
                <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 20, gap: 12 }}>
                  <View style={{ flex: 1, height: 1, backgroundColor: "#DEDFE3" }} />
                  <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: "#BDBDC0" }}>or</Text>
                  <View style={{ flex: 1, height: 1, backgroundColor: "#DEDFE3" }} />
                </View>

                {/* Google Sign-In */}
                {googleLoading ? (
                  <View className="items-center py-4 mb-4">
                    <ActivityIndicator size="large" color="#28B4FA" />
                    <Text className="font-inter-regular text-dark-200 mt-2" style={{ fontSize: 14 }}>
                      Signing in with Google...
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={handleGoogleSignIn}
                    activeOpacity={0.85}
                    style={{
                      height: 56,
                      borderRadius: 999,
                      backgroundColor: "#FFFFFF",
                      borderWidth: 1.5,
                      borderColor: "#E5E7EB",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      marginBottom: 16,
                    }}
                  >
                    <Image
                      source={require("@/assets/icons/google.webp")}
                      style={{ width: 22, height: 22 }}
                      resizeMode="contain"
                    />
                    <Text style={{ fontFamily: "Inter_700Bold", fontSize: 16, color: "#1A2225" }}>
                      Sign in with Google
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthLayout>
  );
}

function routeByRole(role: string, router: ReturnType<typeof useRouter>) {
  console.log("[LOGIN] Routing user based on role:", role);
  
  switch (role) {
    case "admin":
    case "superadmin":
      console.log("[LOGIN] -> Routing to super-admin dashboard");
      router.replace("/(super-admin)/dashboard" as any);
      break;
    case "property_owner":
    case "property_agent":
      console.log("[LOGIN] -> Routing to property-admin");
      router.replace("/(property-admin)" as any);
      break;
    case "relocation_driver":
      console.log("[LOGIN] -> Routing to driver dashboard");
      router.replace("/(driver)/dashboard" as any);
      break;
    case "tenant":
    default:
      console.log("[LOGIN] -> Routing to home");
      router.replace("/(tabs)/home" as any);
  }
}
