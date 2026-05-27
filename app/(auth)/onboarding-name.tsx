/**
 * Onboarding step 1 — Agent greeting + name input.
 */
import { AgentBubble } from "@/components/auth/AgentBubble";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { BackButton } from "@/components/auth/BackButton";
import { ContactUs } from "@/components/auth/ContactUs";
import { PrimaryButton } from "@/components/auth/PrimaryButton";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

const GREETING =
  "👋 Hey there! I'm your onboarding & registration guide. I'll help you set up your Masqany account in just a few steps — no matter if you're looking for a home, office, Airbnb, a moving vehicle, and more.";

export default function OnboardingNameScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [greetingDone, setGreetingDone] = useState(false);
  const [name, setName] = useState("");

  const canContinue = name.trim().length >= 2;

  return (
    <AuthLayout>
      <ContactUs />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 24}
      >
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 140 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
        >
          <View className="flex-1 px-6 pt-6 pb-24">
            <BackButton />

            {/* "Hello, I'm Masqany" */}
            <View className="mt-10 mb-6">
              <Text style={{ fontSize: 32, lineHeight: 40 }}>
                <Text className="font-poppins-bold" style={{ color: "#20A6FD" }}>
                  {"Hello, I'm Mas"}
                </Text>
                <Text className="font-poppins-bold text-dark-400">qany</Text>
              </Text>
            </View>

            <AgentBubble
              message={GREETING}
              speed={15}
              onComplete={() => setGreetingDone(true)}
              style={{ marginBottom: 24 }}
            />

            {greetingDone && (
              <>
                {/* Name card */}
                <View
                  className="rounded-[18px] p-5 mb-6"
                  style={{ backgroundColor: "rgba(225,230,232,0.88)" }}
                >
                  <Text className="font-poppins-semibold text-dark-400 mb-3.5" style={{ fontSize: 18 }}>
                    Nice to meet you! 👋
                  </Text>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your full name"
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    autoCapitalize="words"
                    autoCorrect={false}
                    returnKeyType="done"
                    onFocus={() => {
                      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 120);
                    }}
                    className="h-14 px-5 rounded-full font-inter text-white"
                    style={{ backgroundColor: "#AAAABB", fontSize: 16 }}
                  />
                </View>

                <PrimaryButton
                  label="Continue"
                  onPress={() =>
                    router.push({
                      pathname: "/onboarding-role" as any,
                      params: { name: name.trim() },
                    })
                  }
                  disabled={!canContinue}
                />
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthLayout>
  );
}
