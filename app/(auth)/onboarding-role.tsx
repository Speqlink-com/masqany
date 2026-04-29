/**
 * Onboarding step 2 — Role selection.
 *
 * Everything scrolls and animates together (heading, question, cards, response, button).
 * Only BackButton, ContactUs remain static.
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
// Animated Content — everything that moves together
// ---------------------------------------------------------------------------
interface AnimatedContentProps {
  name: string;
  questionDone: boolean;
  selectedRole: RoleKey | null;
  typedRole: RoleKey | null;
  onQuestionComplete: () => void;
  onRoleSelect: (role: RoleKey) => void;
  onConfirmationComplete: (role: RoleKey) => void;
  contentTranslateY: Animated.Value;
}

const AnimatedContent = memo(function AnimatedContent({
  name,
  questionDone,
  selectedRole,
  typedRole,
  onQuestionComplete,
  onRoleSelect,
  onConfirmationComplete,
  contentTranslateY,
}: AnimatedContentProps) {
  return (
    <Animated.View style={{ transform: [{ translateY: contentTranslateY }] }}>
      {/* Heading */}
      <Animated.Text
        className="font-poppins-bold text-dark-400 mb-5"
        style={{ fontSize: 26 }}
      >
        Hi {name || "there"} 👋
      </Animated.Text>

      {/* Question bubble */}
      <AgentBubble
        message="Which one describes you best?"
        speed={38}
        onComplete={onQuestionComplete}
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
              onPress={() => onRoleSelect(ROLES[0].key)}
            />
            <RoleCard
              title={ROLES[1].title}
              subtitle={ROLES[1].subtitle}
              icon={ROLES[1].icon}
              selected={selectedRole === ROLES[1].key}
              onPress={() => onRoleSelect(ROLES[1].key)}
            />
          </View>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <RoleCard
              title={ROLES[2].title}
              subtitle={ROLES[2].subtitle}
              icon={ROLES[2].icon}
              selected={selectedRole === ROLES[2].key}
              onPress={() => onRoleSelect(ROLES[2].key)}
            />
            <RoleCard
              title={ROLES[3].title}
              subtitle={ROLES[3].subtitle}
              icon={ROLES[3].icon}
              selected={selectedRole === ROLES[3].key}
              onPress={() => onRoleSelect(ROLES[3].key)}
            />
          </View>
        </View>
      )}

      {/* Confirmation bubble */}
      {selectedRole && (
        <View style={{ marginTop: 24 }}>
          <AgentBubble
            key={selectedRole}
            message={ROLE_MESSAGES[selectedRole]}
            speed={18}
            onComplete={() => onConfirmationComplete(selectedRole)}
            style={{ marginBottom: 24 }}
          />
        </View>
      )}
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
  const contentTranslateY = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  function handleRoleSelect(role: RoleKey) {
    if (selectedRole === role) return;
    setSelectedRole(role);
    setTypedRole(null);
    
    // Animate content upward by 60px to make room for response
    Animated.spring(contentTranslateY, {
      toValue: -60,
      useNativeDriver: true,
      tension: 50,
      friction: 10,
    }).start();
    
    // Scroll to show the response
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 400);
  }

  useEffect(() => {
    if (!selectedRole) {
      // Return content to original position
      Animated.spring(contentTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 10,
      }).start();
    }
  }, [selectedRole]);

  // Scroll to bottom when confirmation button appears
  useEffect(() => {
    if (typedRole === selectedRole && selectedRole !== null) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200);
    }
  }, [typedRole, selectedRole]);

  const confirmationDone = typedRole === selectedRole && selectedRole !== null;

  return (
    <AuthLayout>
      <ContactUs />
      <View className="flex-1">
        <View className="px-6 pt-6">
          <BackButton />
        </View>
        
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AnimatedContent
            name={name ?? ""}
            questionDone={questionDone}
            selectedRole={selectedRole}
            typedRole={typedRole}
            onQuestionComplete={() => setQuestionDone(true)}
            onRoleSelect={handleRoleSelect}
            onConfirmationComplete={(role) => setTypedRole(role)}
            contentTranslateY={contentTranslateY}
          />

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
      </View>
    </AuthLayout>
  );
}
