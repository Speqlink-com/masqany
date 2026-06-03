/**
 * LOGIN SCREEN - FIXED WORKING VERSION
 * 
 * This version uses the correct backend endpoints that you tested with curl
 * 
 * Test with:
 * - Email: speqlink@gmail.com
 * - Password: @Speqlink1240.,,.
 * 
 * Backend endpoint: POST http://192.168.0.100/api/auth/signin/password
 * Response: {status: "success", message: "Signed in", refreshToken: "...", user: {...}}
 */

import { AuthLayout } from "@/components/auth/AuthLayout";
import { BackButton } from "@/components/auth/BackButton";
import { ContactUs } from "@/components/auth/ContactUs";
import { PrimaryButton } from "@/components/auth/PrimaryButton";
import { signInPassword } from "@/modules/auth/api-fixed";
import { saveSession } from "@/modules/auth/storage";
import { tokenStore, useAuthStore } from "@/store/auth.store";
import { useRouter } from "expo-router";
import { useState } from "react";
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

interface LoginInputProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  icon: any;
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

export default function LoginScreenFixed() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const setTokens = tokenStore((state) => state.setTokens);
  
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = identifier.trim().length > 0 && password.length >= 8;

  async function handleLogin() {
    if (!canSubmit) return;
    
    setLoading(true);
    setError(null);

    try {
      console.log("[Login] Attempting sign in...");
      console.log("[Login] API Base URL:", process.env.EXPO_PUBLIC_API_URL || "http://192.168.0.100");
      
      // Call the backend endpoint that we tested with curl
      const response = await signInPassword({
        identifier: identifier.trim(),
        password,
      });

      console.log("[Login] Sign in successful:", response);

      // The backend returns `refreshToken` which is actually the ACCESS token for mobile
      const accessToken = response.refreshToken;
      const refreshToken = response.refreshToken; // Use same token
      
      // Save to secure storage
      await saveSession(accessToken, refreshToken, response.user);
      
      // Update app state
      setTokens(accessToken, refreshToken);
      setUser(response.user);

      // Route based on role
      routeByRole(response.user.role, router);
      
    } catch (err: any) {
      console.error("[Login] Sign in failed:", err);
      const message = err?.message || err?.response?.data?.message || "Invalid email or password";
      setError(message);
    } finally {
      setLoading(false);
    }
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

            {error && (
              <Text
                className="font-inter-regular text-center mb-4"
                style={{ fontSize: 14, color: "#F75555" }}
              >
                {error}
              </Text>
            )}

            {loading ? (
              <View className="py-4 items-center">
                <ActivityIndicator size="large" color="#28B4FA" />
                <Text className="font-inter-regular text-dark-200 mt-2" style={{ fontSize: 14 }}>
                  Signing in...
                </Text>
              </View>
            ) : (
              <PrimaryButton
                label="Login"
                onPress={handleLogin}
                disabled={!canSubmit}
              />
            )}

            {/* Test credentials hint */}
            {__DEV__ && (
              <View className="mt-6 p-4 rounded-2xl" style={{ backgroundColor: "rgba(32, 166, 253, 0.1)" }}>
                <Text className="font-inter-semibold text-primary-700 mb-2" style={{ fontSize: 14 }}>
                  Test Credentials
                </Text>
                <Text className="font-inter-regular text-dark-300" style={{ fontSize: 13 }}>
                  Email: speqlink@gmail.com{'\n'}
                  Password: @Speqlink1240.,,.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthLayout>
  );
}

function routeByRole(role: string, router: ReturnType<typeof useRouter>) {
  switch (role) {
    case "admin":
    case "superadmin":
      router.replace("/(super-admin)/dashboard" as any);
      break;
    case "property_owner":
    case "property_agent":
      router.replace("/(property-admin)" as any);
      break;
    case "relocation_driver":
      router.replace("/(driver)/dashboard" as any);
      break;
    case "tenant":
    default:
      router.replace("/(tabs)/home" as any);
  }
}
