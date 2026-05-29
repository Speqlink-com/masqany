/**
 * Login with password or OTP.
 * User can toggle between password and OTP login methods.
 */
import { AuthLayout } from "@/components/auth/AuthLayout";
import { BackButton } from "@/components/auth/BackButton";
import { ContactUs } from "@/components/auth/ContactUs";
import { PrimaryButton } from "@/components/auth/PrimaryButton";
import { authApi } from "@/modules/auth/api";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "expo-router";
import { useState } from "react";
import type { ImageSourcePropType } from "react-native";
import {
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

  const canSubmit = identifier.trim().length > 0 && 
    (loginMethod === "otp" || password.length >= 6);

  async function handleLogin() {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);

    if (loginMethod === "password") {
      try {
        const response = await authApi.login({
          email: identifier.trim(),
          password,
          device_info: `${Platform.OS}`,
        });
        setLoading(false);
        routeByRole(response.user.role, router);
      } catch (err) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }
    } else {
      try {
        await authApi.sendOtp({ email: identifier.trim(), purpose: "login" });
        setLoading(false);
        router.push({
          pathname: "/login-otp" as any,
          params: { identifier: identifier.trim() },
        });
      } catch (err) {
        setError("Unable to send OTP. Please try again.");
        setLoading(false);
      }
    }
  }

  function handleDevAccess() {
    // Set mock user with Property_Owner role
    const mockUser = {
      id: "dev-user-001",
      name: "Dev Property Owner",
      email: "dev@masqany.com",
      phone: "+254700000000",
      role: "property_owner" as const,
      isHost: true,
      isVerified: true,
      createdAt: new Date().toISOString(),
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

            <PrimaryButton
              label={loginMethod === "password" ? "Login" : "Send OTP"}
              onPress={handleLogin}
              disabled={!canSubmit}
              loading={loading}
            />

            {/* Development Access Button */}
            {__DEV__ && (
              <TouchableOpacity
                onPress={handleDevAccess}
                activeOpacity={0.8}
                className="mt-4 py-4 px-6 rounded-full items-center"
                style={{ backgroundColor: "#f3f4f3" }}
              >
                <Text
                  className="font-inter-semibold"
                  style={{ fontSize: 16, color: "#000000" }}
                >
                  Property Admin (Dev)
                </Text>
                <Text
                  className="font-inter-regular mt-1"
                  style={{ fontSize: 12, color: "#545454" }}
                >
                  Development Only
                </Text>
              </TouchableOpacity>
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
      router.replace("/(tabs)/home"); // TODO: Change to /(admin)/dashboard when ready
      break;
    case "super_admin":
      router.replace("/(tabs)/home"); // TODO: Change to /(admin)/dashboard when ready
      break;
    case "property_owner":
    case "property_agent":
      router.replace("/(tabs)/home");
      break;
    case "relocation_driver":
      router.replace("/(tabs)/home");
      break;
    case "tenant":
    default:
      router.replace("/(tabs)/home");
  }
}
