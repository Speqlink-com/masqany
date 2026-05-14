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
    title: "Property Owner",
    subtitle: "List apartments, Airbnb, hotel rooms",
    icon: require("@/assets/icons/house-icon.webp"),
  },
  {
    key: "property_agent",
    title: "Property Agent",
    subtitle: "Manage & market properties for owners",
    icon: require("@/assets/icons/agent-icon.webp"),
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
              <View style={{ flexDirection: "row", gap: 12 }}>
                <RoleCard
                  title={ROLES[0].title}
                  subtitle={ROLES[0].subtitle}
                  icon={ROLES[0].icon}
                  selected={selectedRole === ROLES[0].key}
                  onPress={() => handleRoleSelect(ROLES[0].key)}
                />
                <RoleCard
                  title={ROLES[1].title}
                  subtitle={ROLES[1].subtitle}
                  icon={ROLES[1].icon}
                  selected={selectedRole === ROLES[1].key}
                  onPress={() => handleRoleSelect(ROLES[1].key)}
                />
              </View>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <RoleCard
                  title={ROLES[2].title}
                  subtitle={ROLES[2].subtitle}
                  icon={ROLES[2].icon}
                  selected={selectedRole === ROLES[2].key}
                  onPress={() => handleRoleSelect(ROLES[2].key)}
                />
                <RoleCard
                  title={ROLES[3].title}
                  subtitle={ROLES[3].subtitle}
                  icon={ROLES[3].icon}
                  selected={selectedRole === ROLES[3].key}
                  onPress={() => handleRoleSelect(ROLES[3].key)}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </AuthLayout>
  );
}
