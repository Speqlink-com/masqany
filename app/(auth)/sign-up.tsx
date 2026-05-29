/**
 * Sign-up — terms acceptance before agent onboarding.
 */
import { AuthLayout } from "@/components/auth/AuthLayout";
import { BackButton } from "@/components/auth/BackButton";
import { ContactUs } from "@/components/auth/ContactUs";
import { PrimaryButton } from "@/components/auth/PrimaryButton";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function SignUpScreen() {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);

  return (
    <AuthLayout>
      <ContactUs />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 pt-6 pb-12">
          <BackButton />

          <Text className="font-poppins-bold text-dark-400 mt-10 mb-1.5" style={{ fontSize: 28 }}>
            Create your account
          </Text>
          <Text className="font-inter text-dark-200 mb-6 leading-6" style={{ fontSize: 16 }}>
            Before we get started, please review and accept our terms.
          </Text>

          {/* Terms card — rgba kept in style */}
          <View
            className="rounded-[18px] p-5 mb-6"
            style={{ backgroundColor: "rgba(225,230,232,0.88)" }}
          >
            <Text className="font-poppins-semibold text-dark-300 mb-2.5" style={{ fontSize: 17 }}>
              Terms of Use & Privacy Policy
            </Text>
            <Text className="font-inter text-dark-200 leading-6" style={{ fontSize: 15 }}>
              By creating an account you agree to Masqany's Terms of Use and
              Privacy Policy. We collect and process your data to provide
              property search, booking, and relocation services. Your data is
              stored securely and never sold to third parties.{"\n\n"}
              You can delete your account and data at any time from your profile
              settings.
            </Text>
            <View className="flex-row mt-3.5" style={{ gap: 16 }}>
              <TouchableOpacity activeOpacity={0.7}>
                <Text className="font-inter-semibold text-primary-700 underline" style={{ fontSize: 14 }}>
                  Terms of Use
                </Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7}>
                <Text className="font-inter-semibold text-primary-700 underline" style={{ fontSize: 14 }}>
                  Privacy Policy
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Checkbox row */}
          <TouchableOpacity
            onPress={() => setAccepted((v) => !v)}
            activeOpacity={0.8}
            className="flex-row items-center mb-9"
            style={{ gap: 12 }}
          >
            <View
              className="w-6 h-6 rounded-md items-center justify-center"
              style={{
                borderWidth: 2,
                borderColor: accepted ? "#28B4FA" : "#BDBDC0",
                backgroundColor: accepted ? "#28B4FA" : "transparent",
              }}
            >
              {accepted && (
                <Text className="font-inter-bold text-white text-xs">✓</Text>
              )}
            </View>
            <Text className="flex-1 font-inter text-dark-200 leading-6" style={{ fontSize: 15 }}>
              I have read and agree to the Terms of Use and Privacy Policy
            </Text>
          </TouchableOpacity>

          <PrimaryButton
            label="Continue"
            onPress={() => router.push("/onboarding-name" as any)}
            disabled={!accepted}
          />
        </View>
      </ScrollView>
    </AuthLayout>
  );
}
