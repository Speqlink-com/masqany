/**
 * OTP Verification — email verification for signup.
 * Font: Inter throughout. Poppins-Bold for title.
 * Digit boxes: Inter_800ExtraBold — clean, heavy number rendering.
 */
import { AuthLayout } from "@/components/auth/AuthLayout";
import { BackButton } from "@/components/auth/BackButton";
import { ContactUs } from "@/components/auth/ContactUs";
import { PrimaryButton } from "@/components/auth/PrimaryButton";
import { authApi } from "@/modules/auth/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  NativeSyntheticEvent,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TouchableOpacity,
  View,
} from "react-native";

// ---------------------------------------------------------------------------
// Digit box
// ---------------------------------------------------------------------------
interface DigitBoxProps {
  value: string;
  isFocused: boolean;
  hasError: boolean;
  inputRef: React.RefObject<TextInput | null>;
  onChangeText: (t: string) => void;
  onKeyPress: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
  onFocus: () => void;
}

function DigitBox({ value, isFocused, hasError, inputRef, onChangeText, onKeyPress, onFocus }: DigitBoxProps) {
  return (
    <View
      style={{
        width: 50,
        height: 60,
        borderRadius: 14,
        backgroundColor: "#AAAABB",
        borderWidth: isFocused ? 2 : hasError ? 1.5 : 0,
        borderColor: hasError ? "#F75555" : isFocused ? "#28B4FA" : "transparent",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        onKeyPress={onKeyPress}
        onFocus={onFocus}
        keyboardType="numeric"
        maxLength={1}
        selectTextOnFocus
        caretHidden
        style={{
          fontFamily: "Inter_800ExtraBold",
          fontSize: 24,
          color: "#ffffff",
          textAlign: "center",
          width: "100%",
          height: "100%",
          includeFontPadding: false,
        }}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// OTP row — 6 boxes
// ---------------------------------------------------------------------------
function OtpInput({ value, onChange, hasError }: { value: string[]; onChange: (d: string[]) => void; hasError: boolean }) {
  const refs = [
    useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null),
    useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null),
  ];
  const [focused, setFocused] = useState(0);

  useEffect(() => { setTimeout(() => refs[0].current?.focus(), 120); }, []);

  function handleChange(i: number, text: string) {
    if (text.length > 1) {
      const digits = text.replace(/\D/g, "").slice(0, 6).split("");
      const next = [...value];
      digits.forEach((d, j) => { if (i + j < 6) next[i + j] = d; });
      onChange(next);
      refs[Math.min(i + digits.length, 5)].current?.focus();
      return;
    }
    const d = text.replace(/\D/g, "");
    const next = [...value];
    next[i] = d;
    onChange(next);
    if (d && i < 5) refs[i + 1].current?.focus();
  }

  function handleKeyPress(i: number, e: NativeSyntheticEvent<TextInputKeyPressEventData>) {
    if (e.nativeEvent.key === "Backspace" && !value[i] && i > 0) {
      refs[i - 1].current?.focus();
      const next = [...value];
      next[i - 1] = "";
      onChange(next);
    }
  }

  return (
    <View style={{ flexDirection: "row", gap: 10, justifyContent: "center" }}>
      {refs.map((ref, i) => (
        <DigitBox
          key={i}
          inputRef={ref}
          value={value[i] ?? ""}
          isFocused={focused === i}
          hasError={hasError}
          onChangeText={(t) => handleChange(i, t)}
          onKeyPress={(e) => handleKeyPress(i, e)}
          onFocus={() => setFocused(i)}
        />
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Countdown hook
// ---------------------------------------------------------------------------
function useCountdown(initial = 60) {
  const [secs, setSecs] = useState(initial);
  const [active, setActive] = useState(true);
  useEffect(() => {
    if (!active || secs <= 0) { setActive(false); return; }
    const t = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs, active]);
  return { secs, canResend: !active, reset: () => { setSecs(initial); setActive(true); } };
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------
export default function OnboardingOtpScreen() {
  const router = useRouter();
  const { name, role, email, phone } = useLocalSearchParams<{
    name: string; role: string; email: string; phone: string;
  }>();

  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  const cd = useCountdown(60);

  async function handleVerify() {
    if (!digits.every((d) => d)) return;
    setVerifying(true);
    try {
      await authApi.verifyOtp({
        email,
        otp_code: digits.join(""),
        purpose: "verification",
      });

      router.push({
        pathname: "/onboarding-complete" as any,
        params: { name: name ?? "", role: role ?? "", email, phone },
      });
    } catch {
      setError("Incorrect code. Please try again.");
      setDigits(Array(6).fill(""));
    } finally {
      setVerifying(false);
    }
  }

  async function handleResend() {
    if (!email) return;
    try {
      await authApi.sendOtp({ email, purpose: "verification" });
      cd.reset();
      setDigits(Array(6).fill(""));
      setError(null);
    } catch {
      setError("Unable to resend the code. Please try again.");
    }
  }

  const maskedEmail = email?.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + "***" + c) ?? "";

  return (
    <AuthLayout>
      <ContactUs />
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 48 }}>
        <BackButton />

        {/* Step progress */}
        <View style={{ flexDirection: "row", gap: 8, marginTop: 40, marginBottom: 32 }}>
          <View style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: "#28B4FA" }} />
        </View>

        <Text className="font-poppins-bold text-dark-400 mb-2" style={{ fontSize: 26 }}>
          Verify your email
        </Text>
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 15, color: "#4F5C62", lineHeight: 24, marginBottom: 36 }}>
          We sent a 6-digit code to{" "}
          <Text style={{ fontFamily: "Inter_700Bold", color: "#1A2225" }}>{maskedEmail}</Text>.
          {" "}Enter it below.
        </Text>

        <OtpInput
          value={digits}
          onChange={(d) => { setDigits(d); setError(null); }}
          hasError={!!error}
        />

        {error && (
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: "#F75555", textAlign: "center", marginTop: 16 }}>
            {error}
          </Text>
        )}

        {/* Resend */}
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 24, marginBottom: 36 }}>
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: "#4F5C62" }}>
            Didn't receive it?{" "}
          </Text>
          {cd.canResend ? (
            <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
              <Text style={{ fontFamily: "Inter_700Bold", fontSize: 14, color: "#20A6FD", textDecorationLine: "underline" }}>
                Resend code
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 14, color: "#BDBDC0" }}>
              Resend in {cd.secs}s
            </Text>
          )}
        </View>

        {verifying ? (
          <View style={{ alignItems: "center", paddingVertical: 16 }}>
            <ActivityIndicator size="large" color="#28B4FA" />
          </View>
        ) : (
          <PrimaryButton
            label="Verify Email"
            onPress={handleVerify}
            disabled={!digits.every((d) => d)}
          />
        )}

        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "#BDBDC0", textAlign: "center", marginTop: 20 }}>
          Use the code sent to your email.
        </Text>
      </View>
    </AuthLayout>
  );
}
