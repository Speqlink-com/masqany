/**
 * Onboarding — Role Confirmation Screen
 * 
 * Shows the confirmation message after role selection
 * User acknowledges and continues to credentials
 */
import { AgentBubble } from "@/components/auth/AgentBubble";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { BackButton } from "@/components/auth/BackButton";
import { ContactUs } from "@/components/auth/ContactUs";
import { PrimaryButton } from "@/components/auth/PrimaryButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

type RoleKey = "tenant" | "property_owner" | "property_agent" | "relocation_driver";

const ROLE_MESSAGES: Record<RoleKey, string> = {
  property_owner:
    "Great choice! 🏠 As a Property Owner on Masqany, you'll list your apartments, Airbnb spaces, hotel rooms, and more — reaching thousands of verified tenants. Let's get you set up!",
  property_agent:
    "Excellent! 📋 As a Property Agent, you'll manage and market properties on behalf of owners, track inquiries, and close deals — all from one dashboard. Let's go!",
  relocation_driver:
    "Awesome! 🚛 As a Relocation Driver, you'll connect with people who need help moving — pickup, van, or truck jobs. Masqany will match you with clients nearby.",
  tenant:
    "Welcome! 🏡 Masqany will help you find, reserve, and move into a property — whether it's a long stay, short stay, or you just need help relocating. We've got you covered.",
};

const ROLE_TITLES: Record<RoleKey, string> = {
  property_owner: "Property Owner",
  property_agent: "Property Agent",
  relocation_driver: "Relocation Driver",
  tenant: "Tenant",
};

export default function OnboardingRoleConfirmationScreen() {
  const router = useRouter();
  const { name, role } = useLocalSearchParams<{ name: string; role: string }>();
  const [typingDone, setTypingDone] = useState(false);

  const roleKey = role as RoleKey;
  const message = ROLE_MESSAGES[roleKey] || ROLE_MESSAGES.tenant;
  const roleTitle = ROLE_TITLES[roleKey] || "Tenant";

  return (
    <AuthLayout>
      <ContactUs />
      <View className="flex-1">
        <View className="px-6 pt-6">
          <BackButton />
        </View>
        
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Heading */}
          <Text
            className="font-poppins-bold text-dark-400 mb-5"
            style={{ fontSize: 26 }}
          >
            You selected - {roleTitle}
          </Text>

          {/* Confirmation message */}
          <AgentBubble
            message={message}
            speed={18}
            onComplete={() => setTypingDone(true)}
            style={{ marginBottom: 24 }}
          />

          {/* Continue button */}
          {typingDone && (
            <PrimaryButton
              label="Acknowledge & Continue"
              onPress={() =>
                router.push({
                  pathname: "/onboarding-credentials" as any,
                  params: { name: name ?? "", role: roleKey },
                })
              }
            />
          )}
        </ScrollView>
      </View>
    </AuthLayout>
  );
}
