/**
 * Login with password.
 * Inputs: #AAAABB fill, fully rounded pill, Cormorant Garamond.
 */
import { AuthLayout } from "@/components/auth/AuthLayout";
import { BackButton } from "@/components/auth/BackButton";
import { ContactUs } from "@/components/auth/ContactUs";
import { PrimaryButton } from "@/components/auth/PrimaryButton";
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

export default function LoginScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = identifier.trim().length > 0 && password.length >= 6;

  async function handleLogin() {
    if (!canSubmit) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    routeByRole("tenant", router);
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
              className="font-cg-bold text-dark-400 mt-10 mb-8"
              style={{ fontSize: 28 }}
            >
              Login with password
            </Text>

            {/* Email / Phone */}
            <TextInput
              value={identifier}
              onChangeText={setIdentifier}
              placeholder="Email / +254 phone"
              placeholderTextColor="rgba(255,255,255,0.7)"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              className="h-14 px-5 rounded-full font-cg-regular text-white mb-4"
              style={{ backgroundColor: INPUT_BG, fontSize: 19 }}
            />

            {/* Password */}
            <View
              className="h-14 flex-row items-center px-5 rounded-full mb-3"
              style={{ backgroundColor: INPUT_BG }}
            >
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="rgba(255,255,255,0.7)"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                className="flex-1 font-cg-regular text-white"
                style={{ fontSize: 19 }}
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
            <TouchableOpacity activeOpacity={0.7} className="self-start mb-10">
              <Text
                className="font-cg-medium text-primary-700 underline"
                style={{ fontSize: 18 }}
              >
                Forgot password?
              </Text>
            </TouchableOpacity>

            <PrimaryButton
              label="Login"
              onPress={handleLogin}
              disabled={!canSubmit}
              loading={loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthLayout>
  );
}

function routeByRole(role: string, router: ReturnType<typeof useRouter>) {
  switch (role) {
    case "admin":
    case "super_admin":
      router.replace("/(admin)/dashboard" as never);
      break;
    default:
      router.replace("/(tabs)/home");
  }
}
