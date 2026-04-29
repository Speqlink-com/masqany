/**
 * Forgot Password — Request OTP via email or phone.
 * User can toggle between email and phone input.
 */
import { AuthLayout } from "@/components/auth/AuthLayout";
import { BackButton } from "@/components/auth/BackButton";
import { ContactUs } from "@/components/auth/ContactUs";
import { PrimaryButton } from "@/components/auth/PrimaryButton";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const INPUT_BG = "#AAAABB";

type ContactType = "email" | "phone";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [contactType, setContactType] = useState<ContactType>("email");
  const [email, setEmail] = useState("");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const isValidPhone = (v: string) => /^(7|1)\d{8}$/.test(v.replace(/\s/g, ""));

  const canSubmit =
    contactType === "email" ? isValidEmail(email) : isValidPhone(phoneDigits);

  async function handleSendOTP() {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);

    const contact = contactType === "email" ? email.trim() : `+254${phoneDigits}`;

    router.push({
      pathname: "/forgot-password-otp" as any,
      params: { contact, contactType },
    });
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
              Forgot password?
            </Text>
            <Text
              className="font-inter-regular text-dark-200 mb-8"
              style={{ fontSize: 16, lineHeight: 24 }}
            >
              No worries! Enter your email or phone number and we'll send you a code to
              reset your password.
            </Text>

            {/* Toggle between email and phone */}
            <View
              className="flex-row rounded-full p-1 mb-6"
              style={{ backgroundColor: "#E5E7EB" }}
            >
              <TouchableOpacity
                onPress={() => setContactType("email")}
                activeOpacity={0.8}
                className="flex-1 py-3 rounded-full items-center"
                style={{
                  backgroundColor: contactType === "email" ? "#28B4FA" : "transparent",
                }}
              >
                <Text
                  className="font-inter-semibold"
                  style={{
                    fontSize: 15,
                    color: contactType === "email" ? "#FFFFFF" : "#6B7280",
                  }}
                >
                  Email
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setContactType("phone")}
                activeOpacity={0.8}
                className="flex-1 py-3 rounded-full items-center"
                style={{
                  backgroundColor: contactType === "phone" ? "#28B4FA" : "transparent",
                }}
              >
                <Text
                  className="font-inter-semibold"
                  style={{
                    fontSize: 15,
                    color: contactType === "phone" ? "#FFFFFF" : "#6B7280",
                  }}
                >
                  Phone
                </Text>
              </TouchableOpacity>
            </View>

            {/* Email input */}
            {contactType === "email" && (
              <View className="mb-6">
                <Text
                  className="font-inter-semibold text-dark-300 mb-2 ml-1"
                  style={{ fontSize: 14 }}
                >
                  Email address
                </Text>
                <TextInput
                  value={email}
                  onChangeText={(v) => {
                    setEmail(v);
                    setError(null);
                  }}
                  placeholder="you@example.com"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="h-14 px-5 rounded-full font-inter text-white"
                  style={{ backgroundColor: INPUT_BG, fontSize: 16 }}
                />
              </View>
            )}

            {/* Phone input */}
            {contactType === "phone" && (
              <View className="mb-6">
                <Text
                  className="font-inter-semibold text-dark-300 mb-2 ml-1"
                  style={{ fontSize: 14 }}
                >
                  Phone number
                </Text>
                <View
                  className="h-14 flex-row items-center rounded-full overflow-hidden"
                  style={{ backgroundColor: INPUT_BG }}
                >
                  <View
                    className="h-full px-4 items-center justify-center"
                    style={{ borderRightWidth: 1, borderRightColor: "rgba(255,255,255,0.3)" }}
                  >
                    <Text className="font-inter-bold text-white" style={{ fontSize: 16 }}>
                      +254
                    </Text>
                  </View>
                  <TextInput
                    value={phoneDigits}
                    onChangeText={(v) => {
                      setPhoneDigits(v.replace(/\D/g, "").slice(0, 9));
                      setError(null);
                    }}
                    placeholder="7XX XXX XXX"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    keyboardType="numeric"
                    maxLength={9}
                    className="flex-1 px-4 font-inter text-white"
                    style={{ fontSize: 16 }}
                  />
                </View>
                <Text
                  className="font-inter-regular text-dark-200 mt-2 ml-1"
                  style={{ fontSize: 12 }}
                >
                  Safaricom · Airtel · Telkom
                </Text>
              </View>
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
              label="Send OTP"
              onPress={handleSendOTP}
              disabled={!canSubmit}
              loading={loading}
            />

            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              className="mt-6 items-center"
            >
              <Text
                className="font-inter-semibold text-dark-300"
                style={{ fontSize: 15 }}
              >
                Back to login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthLayout>
  );
}
