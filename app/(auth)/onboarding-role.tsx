/**
 * Onboarding step 2 — Role selection.
 *
 * User selects their role and is immediately taken to confirmation screen.
 */
import { AgentBubble } from "@/components/auth/AgentBubble";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { BackButton } from "@/components/auth/BackButton";
import { ContactUs } from "@/components/auth/ContactUs";
import { RoleCard } from "@/components/auth/RoleCard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    ImageSourcePropType,
    ScrollView,
    Text,
    View,
} from "react-native";

type RoleKey = "tenant" | "property_owner" | "property_agent" | "relocation_driver";

interface RoleDef {
  key: RoleKey;
  title: string;
  subtitle: string;
  icon: ImageSourcePropType;
}

const ROLES: RoleDef[] = [
  {
    key: "property_owner",
    title: "Property Owner/Agent",
    subtitle: "List, manage & market properties",
    icon: require("@/assets/icons/house-icon.webp"),
  },
  {
    key: "relocation_driver",
    title: "Relocation Driver",
    subtitle: "Offer pickup, van & truck services",
    icon: require("@/assets/icons/pickup.webp"),
  },
  {
    key: "tenant",
    title: "Tenant",
    subtitle: "Find, reserve & move to a property",
    icon: require("@/assets/icons/tenant.webp"),
  },
];

export default function OnboardingRoleScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name: string }>();

  const [questionDone, setQuestionDone] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleKey | null>(null);

  function handleRoleSelect(role: RoleKey) {
    if (selectedRole === role) return;
    setSelectedRole(role);
    
    // Navigate to confirmation screen immediately
    router.push({
      pathname: "/onboarding-role-confirmation" as any,
      params: { name: name ?? "", role },
    });
  }

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
            Hi {name || "there"} 👋
          </Text>

          {/* Question bubble */}
          <AgentBubble
            message="Which one describes you best?"
            speed={38}
            onComplete={() => setQuestionDone(true)}
            style={{ marginBottom: 20 }}
          />

          {/* Role cards */}
          {questionDone && (
            <View style={{ gap: 12, marginBottom: 16 }}>
              {ROLES.map((role) => (
                <RoleCard
                  key={role.key}
                  title={role.title}
                  subtitle={role.subtitle}
                  icon={role.icon}
                  selected={selectedRole === role.key}
                  onPress={() => handleRoleSelect(role.key)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </AuthLayout>
  );
}
