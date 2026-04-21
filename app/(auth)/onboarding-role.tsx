/**
 * Onboarding step 2 — Role selection.
 *
 * Scroll fix: contentContainerStyle uses paddingBottom only — no flexGrow.
 * The inner View has no flex-1 so content height is natural.
 * When the confirmation bubble appears below the grid, the ScrollView
 * can scroll to show it without the keyboard interfering.
 *
 * Animation: grid slides up 20px when a role is selected, creating
 * visual breathing room for the agent response below.
 */
import { AgentBubble } from "@/components/auth/AgentBubble";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { BackButton } from "@/components/auth/BackButton";
import { ContactUs } from "@/components/auth/ContactUs";
import { PrimaryButton } from "@/components/auth/PrimaryButton";
import { RoleCard } from "@/components/auth/RoleCard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { memo, useEffect, useRef, useState } from "react";
import {
  Animated,
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

// ---------------------------------------------------------------------------
// RoleGrid — memo so it never re-renders during bubble typing ticks.
// ---------------------------------------------------------------------------
interface RoleGridProps {
  selectedRole: RoleKey | null;
  onSelect: (role: RoleKey) => void;
  translateY: Animated.Value;
}

const RoleGrid = memo(function RoleGrid({ selectedRole, onSelect, translateY }: RoleGridProps) {
  return (
    <Animated.View style={{ transform: [{ translateY }], marginBottom: 16 }}>
      <View style={{ gap: 12 }}>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <RoleCard
            title={ROLES[0].title}
            subtitle={ROLES[0].subtitle}
            icon={ROLES[0].icon}
            selected={selectedRole === ROLES[0].key}
            onPress={() => onSelect(ROLES[0].key)}
          />
          <RoleCard
            title={ROLES[1].title}
            subtitle={ROLES[1].subtitle}
            icon={ROLES[1].icon}
            selected={selectedRole === ROLES[1].key}
            onPress={() => onSelect(ROLES[1].key)}
          />
        </View>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <RoleCard
            title={ROLES[2].title}
            subtitle={ROLES[2].subtitle}
            icon={ROLES[2].icon}
            selected={selectedRole === ROLES[2].key}
            onPress={() => onSelect(ROLES[2].key)}
          />
          <RoleCard
            title={ROLES[3].title}
            subtitle={ROLES[3].subtitle}
            icon={ROLES[3].icon}
            selected={selectedRole === ROLES[3].key}
            onPress={() => onSelect(ROLES[3].key)}
          />
        </View>
      </View>
    </Animated.View>
  );
});

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------
export default function OnboardingRoleScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name: string }>();

  const [questionDone, setQuestionDone] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleKey | null>(null);
  const [typedRole, setTypedRole] = useState<RoleKey | null>(null);
  const gridTranslateY = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  function handleRoleSelect(role: RoleKey) {
    if (selectedRole === role) return;
    setSelectedRole(role);
    setTypedRole(null);
    Animated.spring(gridTranslateY, {
      toValue: -20,
      useNativeDriver: true,
      tension: 60,
      friction: 10,
    }).start();
    // Scroll down slightly so the confirmation bubble is visible
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200);
  }

  useEffect(() => {
    if (!selectedRole) {
      Animated.spring(gridTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 60,
        friction: 10,
      }).start();
    }
  }, [selectedRole]);

  // Scroll to bottom when confirmation button appears
  useEffect(() => {
    if (typedRole === selectedRole && selectedRole !== null) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [typedRole, selectedRole]);

  const confirmationDone = typedRole === selectedRole && selectedRole !== null;

  return (
    <AuthLayout>
      <ContactUs />
      {/* KEY FIX: no flexGrow:1 — content height is natural so scroll works */}
      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 60 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <BackButton />

        {/* Static — never moves */}
        <Text
          className="font-cg-bold text-dark-400 mt-10 mb-5"
          style={{ fontSize: 26 }}
        >
          Hi {name || "there"} 👋
        </Text>

        <AgentBubble
          message="Which one describes you best?"
          speed={38}
          onComplete={() => setQuestionDone(true)}
          style={{ marginBottom: 20 }}
        />

        {questionDone && (
          <RoleGrid
            selectedRole={selectedRole}
            onSelect={handleRoleSelect}
            translateY={gridTranslateY}
          />
        )}

        {selectedRole && (
          <AgentBubble
            key={selectedRole}
            message={ROLE_MESSAGES[selectedRole]}
            speed={18}
            onComplete={() => setTypedRole(selectedRole)}
            style={{ marginBottom: 24 }}
          />
        )}

        {confirmationDone && (
          <PrimaryButton
            label="Acknowledge & Continue"
            onPress={() =>
              router.push({
                pathname: "/onboarding-credentials" as any,
                params: { name: name ?? "", role: selectedRole ?? "" },
              })
            }
          />
        )}
      </ScrollView>
    </AuthLayout>
  );
}
