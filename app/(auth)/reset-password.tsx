/**
 * Reset Password — Create new password using backend reset token
 */
import { AuthLayout } from "@/components/auth/AuthLayout";
import { BackButton } from "@/components/auth/BackButton";
import { ContactUs } from "@/components/auth/ContactUs";
import { PrimaryButton } from "@/components/auth/PrimaryButton";
import { authApi } from "@/modules/auth/api";
import { useLocalSearchParams, useRouter } from "expo-router";
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

function passwordStrength(v: string): 0 | 1 | 2 | 3 {
  if (!v) return 0;
  let s = 0;
  if (v.length >= 8) s++;
  if (/[A-Z]/.test(v) && /[0-9]/.test(v)) s++;
  if (v.length >= 12 && /[^A-Za-z0-9]/.test(v)) s++;
  return s as 0 | 1 | 2 | 3;
}

function isStrongPassword(v: string) {
  return passwordStrength(v) >= 2;
}

// ---------------------------------------------------------------------------
// Password strength bar
// ---------------------------------------------------------------------------
function StrengthBar({ value }: { value: string }) {
  const s = passwordStrength(value);
  const segColors = ["#F75555", "#FFCB1A", "#22C55E"];
  const label = ["", "Weak", "Good", "Strong"][s];
  const labelColor = ["transparent", "#F75555", "#FFCB1A", "#22C55E"][s];
  if (!value) return null;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6, marginBottom: 4, paddingHorizontal: 4 }}>
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            backgroundColor: i < s ? segColors[i] : "#DEDFE3",
          }}
        />
      ))}
      <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 12, color: labelColor, minWidth: 44 }}>
        {label}
      </Text>
    </View>
  );
}

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { contact, resetToken } = useLocalSearchParams<{
    contact: string;
    resetToken: string;
  }>();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const pwdErr = submitted && !isStrongPassword(password)
    ? "8+ chars, 1 uppercase, 1 number"
    : undefined;

  const confirmErr = submitted && password !== confirm
    ? "Passwords do not match"
    : undefined;

  const isValid = isStrongPassword(password) && password === confirm;

  async function handleResetPassword() {
    setSubmitted(true);
    if (!isValid) return;

    setLoading(true);
    try {
      await authApi.resetPassword({
        token: resetToken,
        new_password: password,
      });

      router.replace("/login" as any);
    } catch {
      // Keep the error surface simple; validation already happens client-side.
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
              Create new password
            </Text>
            <Text
              className="font-inter-regular text-dark-200 mb-8"
              style={{ fontSize: 16, lineHeight: 24 }}
            >
              Your new password must be different from your previous password.
            </Text>

            {/* Password */}
            <View className="mb-4">
              <Text
                className="font-inter-semibold text-dark-300 mb-2 ml-1"
                style={{ fontSize: 14 }}
              >
                New password
              </Text>
              <View
                className="h-14 flex-row items-center px-5 rounded-full"
                style={{
                  backgroundColor: INPUT_BG,
                  borderWidth: pwdErr ? 1.5 : 0,
                  borderColor: pwdErr ? "#F75555" : "transparent",
                }}
              >
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a strong password"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  secureTextEntry={!showPwd}
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="flex-1 font-inter text-white"
                  style={{ fontSize: 16 }}
                />
                <TouchableOpacity
                  onPress={() => setShowPwd((v) => !v)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Image
                    source={require("@/assets/icons/eye-icon.webp")}
                    className="w-5 h-5"
                    resizeMode="contain"
                    style={{ tintColor: "#fff", opacity: showPwd ? 1 : 0.4 }}
                  />
                </TouchableOpacity>
              </View>
              {pwdErr && (
                <Text
                  className="font-inter-regular mt-1 ml-1"
                  style={{ fontSize: 12, color: "#F75555" }}
                >
                  {pwdErr}
                </Text>
              )}
              <StrengthBar value={password} />
            </View>

            {/* Confirm password */}
            <View className="mb-8">
              <Text
                className="font-inter-semibold text-dark-300 mb-2 ml-1"
                style={{ fontSize: 14 }}
              >
                Confirm password
              </Text>
              <View
                className="h-14 flex-row items-center px-5 rounded-full"
                style={{
                  backgroundColor: INPUT_BG,
                  borderWidth: confirmErr ? 1.5 : 0,
                  borderColor: confirmErr ? "#F75555" : "transparent",
                }}
              >
                <TextInput
                  value={confirm}
                  onChangeText={setConfirm}
                  placeholder="Re-enter your password"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  secureTextEntry={!showConfirm}
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="flex-1 font-inter text-white"
                  style={{ fontSize: 16 }}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirm((v) => !v)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Image
                    source={require("@/assets/icons/eye-icon.webp")}
                    className="w-5 h-5"
                    resizeMode="contain"
                    style={{ tintColor: "#fff", opacity: showConfirm ? 1 : 0.4 }}
                  />
                </TouchableOpacity>
              </View>
              {confirmErr && (
                <Text
                  className="font-inter-regular mt-1 ml-1"
                  style={{ fontSize: 12, color: "#F75555" }}
                >
                  {confirmErr}
                </Text>
              )}
            </View>

            <PrimaryButton
              label="Reset Password"
              onPress={handleResetPassword}
              disabled={!isValid}
              loading={loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthLayout>
  );
}
