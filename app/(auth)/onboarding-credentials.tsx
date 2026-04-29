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
import { PrimaryButton } from "@/components/auth/PrimaryButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
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
const INPUT_SIZE = 16;

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
  prefix,
  maxLength,
  inputRef,
}: InputFieldProps) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          fontFamily: "Inter_600SemiBold",
          fontSize: 13,
          color: "rgba(26,34,37,0.9)",
          marginBottom: 6,
          marginLeft: 4,
        }}
      >
        {label}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 56,
          borderRadius: 16,
          backgroundColor: INPUT_BG,
          borderWidth: error ? 1.5 : 0,
          borderColor: error ? "#F75555" : "transparent",
          overflow: "hidden",
        }}
      >
        {prefix && (
          <View
            style={{
              height: "100%",
              paddingHorizontal: 16,
              alignItems: "center",
              justifyContent: "center",
              borderRightWidth: 1,
              borderRightColor: "rgba(255,255,255,0.3)",
            }}
          >
            <Text style={{ fontFamily: INPUT_FONT, fontSize: INPUT_SIZE, color: "#fff" }}>
              {prefix}
            </Text>
          </View>
        )}

        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.5)"
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
            fontSize: INPUT_SIZE,
            color: "#ffffff",
            paddingHorizontal: 16,
            paddingVertical: 0,
            includeFontPadding: false,
          }}
        />

        {showToggle && (
          <TouchableOpacity
            onPress={onToggleVisible}
            activeOpacity={0.7}
            style={{ paddingRight: 16 }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image
              source={require("@/assets/icons/eye-icon.webp")}
              style={{ width: 20, height: 20, tintColor: "#fff", opacity: showVisible ? 1 : 0.4 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>

      {error ? (
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "#F75555", marginTop: 5, marginLeft: 4 }}>
          {error}
        </Text>
      ) : hint ? (
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "rgba(26,34,37,0.5)", marginTop: 5, marginLeft: 4 }}>
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

  function handleContinue() {
    setSubmitted(true);
    setTouched({ email: true, phone: true, password: true, confirm: true });
    if (!isValid) return;
    router.push({
      pathname: "/onboarding-otp" as any,
      params: { name: name ?? "", role: role ?? "", email: email.trim(), phone: `+254${phoneDigits}`, password },
    });
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
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 80 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
        >
          <BackButton />

          <Text className="font-poppins-bold text-dark-400 mt-10 mb-5" style={{ fontSize: 26 }}>
            Secure your account
          </Text>

          <AgentBubble
            message={AGENT_MESSAGE}
            speed={14}
            onComplete={() => setAgentDone(true)}
            style={{ marginBottom: 28 }}
          />

          {agentDone && (
            <>
              <InputField
                label="Email address"
                value={email}
                onChange={(v) => { setEmail(v); setTouched((t) => ({ ...t, email: true })); }}
                placeholder="you@example.com"
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
                secureTextEntry={!showConfirm}
                showToggle
                showVisible={showConfirm}
                onToggleVisible={() => setShowConfirm((v) => !v)}
                error={confirmErr}
                returnKeyType="done"
                onSubmitEditing={handleContinue}
                inputRef={confirmRef}
              />

              <View style={{ marginTop: 8, marginBottom: 28 }}>
                <PrimaryButton label="Continue" onPress={handleContinue} />
              </View>

              {/* Divider */}
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20, gap: 12 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: "#DEDFE3" }} />
                <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: "#BDBDC0" }}>or</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: "#DEDFE3" }} />
              </View>

              {/* Google sign-up */}
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/onboarding-complete" as any,
                    params: { name: name ?? "", role: role ?? "", email: "", phone: "" },
                  })
                }
                activeOpacity={0.85}
                style={{
                  height: 56,
                  borderRadius: 999,
                  backgroundColor: "#28B4FA",
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
                <Text style={{ fontFamily: "Inter_800ExtraBold", fontSize: 17, color: "#fff" }}>
                  Sign up with Google
                </Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthLayout>
  );
}
