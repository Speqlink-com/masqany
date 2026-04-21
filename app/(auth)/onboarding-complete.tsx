/**
 * Onboarding final step — terms acceptance + role-based routing.
 *
 * Routing logic:
 *  - property_owner | property_agent → /(registration)/property-prompt
 *  - relocation_driver → /(registration)/vehicle-prompt
 *  - tenant → /(tabs)/home
 */
import { AgentBubble } from "@/components/auth/AgentBubble";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { BackButton } from "@/components/auth/BackButton";
import { ContactUs } from "@/components/auth/ContactUs";
import { PrimaryButton } from "@/components/auth/PrimaryButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const CLOSING_MESSAGE =
  "You're all set! 🎉 Your account is ready. Before you dive in, please confirm that you've read and agree to Masqany's Terms of Use and Privacy Policy. Tap the button below to finish and start exploring.";

function getNextRoute(role: string): string {
  switch (role) {
    case "property_owner":
    case "property_agent":
      return "/(registration)/property-prompt";
    case "relocation_driver":
      return "/(registration)/vehicle-prompt";
    case "tenant":
    default:
      return "/(tabs)/home";
  }
}

export default function OnboardingCompleteScreen() {
  const router = useRouter();
  const { name, role, email, phone } = useLocalSearchParams<{
    name: string;
    role: string;
    email?: string;
    phone?: string;
  }>();

  const [closingDone, setClosingDone] = useState(false);
  const [accepted, setAccepted] = useState(false);

  return (
    <AuthLayout>
      <ContactUs />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 60 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <BackButton />

        <Text className="font-cg-bold text-dark-400 mt-10 mb-5" style={{ fontSize: 24 }}>
          Almost there, {name || "friend"}! 🚀
        </Text>

        <AgentBubble
          message={CLOSING_MESSAGE}
          speed={18}
          onComplete={() => setClosingDone(true)}
          style={{ marginBottom: 24 }}
        />

        {closingDone && (
          <>
            <View
              className="rounded-[18px] p-5 mb-6"
              style={{ backgroundColor: "rgba(225,230,232,0.88)" }}
            >
              <Text className="font-cg-semibold text-dark-300 mb-2.5" style={{ fontSize: 17 }}>
                Terms & Privacy
              </Text>
              <Text className="font-cg-regular text-dark-100 leading-6" style={{ fontSize: 15 }}>
                By finishing registration you confirm that you have read and
                agree to Masqany's Terms of Use and Privacy Policy.
              </Text>
              <View className="flex-row mt-3" style={{ gap: 16 }}>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text className="font-cg-medium text-primary-700 underline" style={{ fontSize: 15 }}>
                    Terms of Use
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text className="font-cg-medium text-primary-700 underline" style={{ fontSize: 15 }}>
                    Privacy Policy
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

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
                  <Text className="font-cg-bold text-white text-xs">✓</Text>
                )}
              </View>
              <Text className="flex-1 font-cg-regular text-dark-200 leading-6" style={{ fontSize: 15 }}>
                I confirm I have read and agree to the Terms of Use and Privacy Policy
              </Text>
            </TouchableOpacity>

            <PrimaryButton
              label="Acknowledge & Finish"
              onPress={() => {
                // TODO: call useRegister() with { name, role, email, phone }
                router.replace(getNextRoute(role ?? "") as never);
              }}
              disabled={!accepted}
            />
          </>
        )}
      </ScrollView>
    </AuthLayout>
  );
}
