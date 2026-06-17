/**
 * Onboarding — Credentials screen.
 *
 * Scroll fix:
 *  - NO flexGrow:1 on contentContainerStyle — content is naturally sized.
 *  - KeyboardAvoidingView behavior="padding" on iOS shrinks the available
 *    space above the keyboard; the ScrollView fills that space and scrolls.
 *  - automaticallyAdjustKeyboardInsets (iOS 15+) handles insets natively.
 *  - keyboardDismissMode="interactive" lets user swipe keyboard away.
 *  - Each field has onSubmitEditing to advance focus (no need to scroll manually).
 *
 * Font: Nunito throughout. CG-Bold for the page title only.
 * Input text: Nunito_700Bold — heavy weight, no superscript rendering.
 * +254 prefix: always visible, non-editable, separated by a divider.
 */
import { AgentBubble } from "@/components/auth/AgentBubble";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { BackButton } from "@/components/auth/BackButton";
import { ContactUs } from "@/components/auth/ContactUs";
import { apiClient } from "@/lib/api/client";
import { PrimaryButton } from "@/components/auth/PrimaryButton";
import { signUpWithGoogle, isGoogleSignInAvailable } from "@/modules/auth/google";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import type { ImageSourcePropType } from "react-native";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------
export function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export function isValidPhoneDigits(digits: string) {
  return /^(7|1)\d{8}$/.test(digits.replace(/\s/g, ""));
}

export function passwordStrength(v: string): 0 | 1 | 2 | 3 {
  if (!v) return 0;
  let s = 0;
  if (v.length >= 8) s++;
  if (/[A-Z]/.test(v) && /[0-9]/.test(v)) s++;
  if (v.length >= 12 && /[^A-Za-z0-9]/.test(v)) s++;
  return s as 0 | 1 | 2 | 3;
}

export function isStrongPassword(v: string) {
  return passwordStrength(v) >= 2;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const INPUT_BG = "#AAAABB";
// Nunito_700Bold: heavy sans-serif — clean number rendering, no superscripts
const INPUT_FONT = "Nunito_700Bold";
const INPUT_SIZE = 18;

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
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2, marginBottom: 0, paddingHorizontal: 4 }}>
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

// ---------------------------------------------------------------------------
// InputField
// ---------------------------------------------------------------------------
interface InputFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  hint?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric";
  onSubmitEditing?: () => void;
  returnKeyType?: "next" | "done";
  showToggle?: boolean;
  showVisible?: boolean;
  onToggleVisible?: () => void;
  icon?: ImageSourcePropType;
  prefix?: string;
  maxLength?: number;
  inputRef?: React.RefObject<TextInput | null>;
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  error,
  hint,
  secureTextEntry,
  keyboardType = "default",
  onSubmitEditing,
  returnKeyType = "next",
  showToggle,
  showVisible,
  onToggleVisible,
  icon,
  prefix,
  maxLength,
  inputRef,
}: InputFieldProps) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text
        style={{
          fontFamily: "Inter_600SemiBold",
          fontSize: 13,
          color: "rgba(26,34,37,0.9)",
          marginBottom: 4,
          marginLeft: 4,
        }}
      >
        {label}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 46,
          borderRadius: 999,
          backgroundColor: INPUT_BG,
          borderWidth: error ? 1.5 : 0,
          borderColor: error ? "#F75555" : "transparent",
          paddingHorizontal: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 5,
          elevation: 2,
        }}
      >
        {icon && (
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
              backgroundColor: "rgba(255,255,255,0.18)",
            }}
          >
            <Image
              source={icon}
              style={{ width: 20, height: 20, tintColor: "#FFFFFF" }}
              resizeMode="contain"
            />
          </View>
        )}

        {prefix && (
          <View
            style={{
              height: 28,
              paddingRight: 12,
              marginRight: 12,
              alignItems: "center",
              justifyContent: "center",
              borderRightWidth: 1,
              borderRightColor: "rgba(255,255,255,0.3)",
            }}
          >
            <Text style={{ fontFamily: INPUT_FONT, fontSize: INPUT_SIZE, color: "#000000" }}>
              {prefix}
            </Text>
          </View>
        )}

        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="rgba(0,0,0,0.45)"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="off"
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType}
          maxLength={maxLength}
          style={{
            flex: 1,
            fontFamily: INPUT_FONT,
            fontSize: value ? INPUT_SIZE : 14,
            color: "#000000",
            paddingHorizontal: 0,
            paddingVertical: 0,
            includeFontPadding: false,
          }}
        />

        {showToggle && (
          <TouchableOpacity
            onPress={onToggleVisible}
            activeOpacity={0.7}
            style={{ paddingLeft: 12 }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image
              source={require("@/assets/icons/eye-icon.webp")}
              style={{ width: 20, height: 20, tintColor: "#000", opacity: showVisible ? 1 : 0.45 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>

      {error ? (
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "#F75555", marginTop: 4, marginLeft: 4 }}>
          {error}
        </Text>
      ) : hint ? (
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "rgba(26,34,37,0.5)", marginTop: 4, marginLeft: 4 }}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------
const AGENT_MESSAGE =
  "Almost there! I need your email, Kenyan phone number, and a strong password to secure your account.";

export default function OnboardingCredentialsScreen() {
  const router = useRouter();
  const { name, role } = useLocalSearchParams<{ name: string; role: string }>();

  const [agentDone, setAgentDone] = useState(false);
  const [email, setEmail] = useState("");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, phone: false, password: false, confirm: false });

  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const show = (f: keyof typeof touched) => touched[f] || submitted;

  const emailErr = show("email")
    ? !email ? "Email is required"
    : !isValidEmail(email) ? "Enter a valid email address"
    : undefined
    : undefined;

  const phoneErr = show("phone")
    ? !phoneDigits ? "Phone number is required"
    : !isValidPhoneDigits(phoneDigits) ? "Enter 9 digits starting with 7 or 1"
    : undefined
    : undefined;

  const pwdErr = show("password")
    ? !password ? "Password is required"
    : !isStrongPassword(password) ? "8+ chars, 1 uppercase, 1 number"
    : undefined
    : undefined;

  const confirmErr = show("confirm")
    ? !confirm ? "Please confirm your password"
    : password !== confirm ? "Passwords do not match"
    : undefined
    : undefined;

  const isValid = isValidEmail(email) && isValidPhoneDigits(phoneDigits) && isStrongPassword(password) && password === confirm;

  async function handleContinue() {
    setSubmitted(true);
    setTouched({ email: true, phone: true, password: true, confirm: true });
    if (!isValid) return;

    setLoading(true);
    
    console.log("=".repeat(50));
    console.log("[SIGNUP] Starting signup...");
    console.log("[SIGNUP] Name:", name);
    console.log("[SIGNUP] Role:", role);
    console.log("[SIGNUP] Email:", email.trim());
    console.log("[SIGNUP] Phone:", `+254${phoneDigits}`);
    console.log("=".repeat(50));

    try {
      console.log("[SIGNUP] Calling POST /api/auth/signup/start");
      
      const response = await apiClient.post("/api/auth/signup/start", {
        fullName: name ?? "",
        role: role ?? "tenant",
        email: email.trim(),
        phone: `+254${phoneDigits}`,
        password,
        confirmPassword: confirm,
      });

      console.log("[SIGNUP] ✅ Response received:", JSON.stringify(response.data, null, 2));
      console.log("[SIGNUP] Next step:", response.data.nextStep);
      console.log("=".repeat(50));

      setLoading(false);

      router.push({
        pathname: "/onboarding-otp" as any,
        params: { 
          name: name ?? "", 
          role: role ?? "", 
          email: email.trim(), 
          phone: `+254${phoneDigits}` 
        },
      });
    } catch (err: any) {
      console.log("[SIGNUP] ❌ Error occurred:");
      console.error("[SIGNUP] Full error:", err);
      console.error("[SIGNUP] Error message:", err.message);
      console.error("[SIGNUP] Error status:", err.status);
      console.error("[SIGNUP] Response data:", err.response?.data);
      console.log("=".repeat(50));
      
      // Error can be in err.message (normalized by apiClient) or err.response?.data?.message
      const errorMsg = err.message || err.response?.data?.message || "Signup failed. Please try again.";
      
      setLoading(false);
      
      // Show user-friendly error
      if (err.status === 409 || errorMsg.toLowerCase().includes("already exists")) {
        alert("An account with this email or phone already exists. Please try logging in instead.");
      } else if (err.status === 400) {
        alert(errorMsg);
      } else {
        alert("Signup failed. Please check your details and try again.");
      }
    }
  }

  return (
    <AuthLayout>
      <ContactUs />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* KEY FIX: no flexGrow — natural content height enables real scrolling */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 64 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
        >
          <BackButton />

          <Text className="font-poppins-bold text-dark-400 mt-6 mb-4" style={{ fontSize: 26 }}>
            Secure your account
          </Text>

          <AgentBubble
            message={AGENT_MESSAGE}
            speed={14}
            onComplete={() => setAgentDone(true)}
            style={{ marginBottom: 20 }}
          />

          {agentDone && (
            <>
              <InputField
                label="Email address"
                value={email}
                onChange={(v) => { setEmail(v); setTouched((t) => ({ ...t, email: true })); }}
                placeholder="you@example.com"
                icon={require("@/assets/icons/i-email-icon.webp")}
                keyboardType="email-address"
                error={emailErr}
                returnKeyType="next"
                onSubmitEditing={() => phoneRef.current?.focus()}
              />

              <InputField
                label="Phone number"
                value={phoneDigits}
                onChange={(v) => {
                  setPhoneDigits(v.replace(/\D/g, "").slice(0, 9));
                  setTouched((t) => ({ ...t, phone: true }));
                }}
                placeholder="7XX XXX XXX"
                icon={require("@/assets/icons/i-phone-icon.webp")}
                keyboardType="numeric"
                prefix="+254"
                maxLength={9}
                error={phoneErr}
                hint="Safaricom · Airtel · Telkom"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                inputRef={phoneRef}
              />

              <InputField
                label="Password"
                value={password}
                onChange={(v) => { setPassword(v); setTouched((t) => ({ ...t, password: true })); }}
                placeholder="Create a strong password"
                icon={require("@/assets/icons/password.webp")}
                secureTextEntry={!showPwd}
                showToggle
                showVisible={showPwd}
                onToggleVisible={() => setShowPwd((v) => !v)}
                error={pwdErr}
                returnKeyType="next"
                onSubmitEditing={() => confirmRef.current?.focus()}
                inputRef={passwordRef}
              />
              <StrengthBar value={password} />

              <InputField
                label="Confirm password"
                value={confirm}
                onChange={(v) => { setConfirm(v); setTouched((t) => ({ ...t, confirm: true })); }}
                placeholder="Re-enter your password"
                icon={require("@/assets/icons/lock-icon.png")}
                secureTextEntry={!showConfirm}
                showToggle
                showVisible={showConfirm}
                onToggleVisible={() => setShowConfirm((v) => !v)}
                error={confirmErr}
                returnKeyType="done"
                onSubmitEditing={handleContinue}
                inputRef={confirmRef}
              />

              <View style={{ marginTop: 2, marginBottom: 16 }}>
                <PrimaryButton 
                  label="Continue" 
                  onPress={() => {
                    console.log("=".repeat(50));
                    console.log("[SIGNUP BUTTON] Button pressed!");
                    console.log("[SIGNUP BUTTON] Loading state:", loading);
                    console.log("[SIGNUP BUTTON] isValid:", isValid);
                    console.log("[SIGNUP BUTTON] Email valid:", isValidEmail(email));
                    console.log("[SIGNUP BUTTON] Phone valid:", isValidPhoneDigits(phoneDigits));
                    console.log("[SIGNUP BUTTON] Password strong:", isStrongPassword(password));
                    console.log("[SIGNUP BUTTON] Passwords match:", password === confirm);
                    console.log("=".repeat(50));
                    handleContinue();
                  }} 
                  loading={loading}
                  disabled={loading}
                />
              </View>

              {/* Divider */}
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14, gap: 12 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: "#DEDFE3" }} />
                <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: "#BDBDC0" }}>or</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: "#DEDFE3" }} />
              </View>

              {/* Google sign-up - Only show if native module is available */}
              {isGoogleSignInAvailable() ? (
                googleLoading ? (
                  <View style={{ alignItems: "center", paddingVertical: 16 }}>
                    <ActivityIndicator size="large" color="#28B4FA" />
                    <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: "#4F5C62", marginTop: 8 }}>
                      Signing up with Google...
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleGoogleSignup(name, role, router, setGoogleLoading)}
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
                    }}
                  >
                    <Image
                      source={require("@/assets/icons/google.webp")}
                      style={{ width: 22, height: 22 }}
                      resizeMode="contain"
                    />
                    <Text style={{ fontFamily: "Inter_800ExtraBold", fontSize: 17, color: "#1A2225" }}>
                      Sign up with Google
                    </Text>
                  </TouchableOpacity>
                )
              ) : (
                <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "#BDBDC0", textAlign: "center", marginTop: 8 }}>
                  Google Sign-In requires a development build
                </Text>
              )}
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthLayout>
  );
}

async function handleGoogleSignup(
  name: string | undefined,
  role: string | undefined,
  router: ReturnType<typeof useRouter>,
  setGoogleLoading: (loading: boolean) => void
) {
  if (!name || !role) {
    Alert.alert("Missing Information", "Please go back and select your name and role first.");
    return;
  }

  setGoogleLoading(true);

  console.log("=".repeat(50));
  console.log("[GOOGLE SIGNUP] Starting Google Sign-Up...");
  console.log("[GOOGLE SIGNUP] Name:", name);
  console.log("[GOOGLE SIGNUP] Role:", role);
  console.log("=".repeat(50));

  try {
    const result = await signUpWithGoogle(name, role as any);
    
    console.log("[GOOGLE SIGNUP] ✅ Success! User:", result.user.fullName);
    console.log("=".repeat(50));

    setGoogleLoading(false);
    
    // Navigate based on role
    switch (result.user.role) {
      case "property_owner":
      case "property_agent":
        router.replace("/(registration)/property-prompt" as any);
        break;
      case "relocation_driver":
        router.replace("/(registration)/vehicle-prompt" as any);
        break;
      case "tenant":
      default:
        router.replace("/(tabs)/home" as any);
    }
  } catch (err: any) {
    console.log("[GOOGLE SIGNUP] ❌ Error:");
    console.error("[GOOGLE SIGNUP] Full error:", err);
    console.error("[GOOGLE SIGNUP] Error message:", err.message);
    console.error("[GOOGLE SIGNUP] Error status:", err.status);
    console.log("=".repeat(50));

    let errorMsg = err.message || "Google Sign-Up failed";
    
    if (err.status === 409) {
      // Account already exists - show alert with option to sign in
      setGoogleLoading(false);
      Alert.alert(
        "Account Already Exists",
        "An account with this Google email already exists. Would you like to sign in instead?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Sign In", 
            onPress: () => router.push("/google-login" as any)
          }
        ]
      );
      return;
    } else if (errorMsg.includes("not yet configured") || errorMsg.includes("requires a development build")) {
      errorMsg = "Google Sign-Up requires a development build. Use email/password instead.";
    } else if (errorMsg.includes("cancelled")) {
      // User cancelled - don't show error
      setGoogleLoading(false);
      return;
    }
    
    setGoogleLoading(false);
    Alert.alert("Sign-Up Failed", errorMsg);
  }
}
