/**
 * Login with password or OTP.
 * User can toggle between password and OTP login methods.
 */
import { mockLogin } from "@/assets/data/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { BackButton } from "@/components/auth/BackButton";
import { ContactUs } from "@/components/auth/ContactUs";
import { PrimaryButton } from "@/components/auth/PrimaryButton";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "expo-router";
import { useState } from "react";
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

    await new Promise((r) => setTimeout(r, 1200));

    if (loginMethod === "password") {
      // Password login
      const response = mockLogin(identifier.trim(), password);
      if (!response) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }
      setLoading(false);
      routeByRole(response.user.role, router);
    } else {
      // OTP login - navigate to OTP screen
      setLoading(false);
      router.push({
        pathname: "/login-otp" as any,
        params: { identifier: identifier.trim() },
      });
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

            {/* Email / Phone */}
            <TextInput
              value={identifier}
              onChangeText={(v) => {
                setIdentifier(v);
                setError(null);
              }}
              placeholder="Email or +254 phone"
              placeholderTextColor="rgba(255,255,255,0.7)"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              className="h-14 px-5 rounded-full font-inter text-white mb-4"
              style={{ backgroundColor: INPUT_BG, fontSize: 16 }}
            />

            {/* Password (only for password login) */}
            {loginMethod === "password" && (
              <>
                <View
                  className="h-14 flex-row items-center px-5 rounded-full mb-3"
                  style={{ backgroundColor: INPUT_BG }}
                >
                  <TextInput
                    value={password}
                    onChangeText={(v) => {
                      setPassword(v);
                      setError(null);
                    }}
                    placeholder="Password"
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    className="flex-1 font-inter text-white"
                    style={{ fontSize: 16 }}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword((v) => !v)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Image
                      source={require("@/assets/icons/eye-icon.webp")}
                      className="w-6 h-6"
                      resizeMode="contain"
                      style={{ tintColor: "#ffffff", opacity: showPassword ? 1 : 0.45 }}
                    />
                  </TouchableOpacity>
                </View>

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
                We'll send a 6-digit code to verify your identity
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
