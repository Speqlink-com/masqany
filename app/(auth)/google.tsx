/**
 * Continue with Google — primary blue buttons with icon + label.
 * google.webp and password.webp used as leading icons inside the button.
 */
import { AuthLayout } from "@/components/auth/AuthLayout";
import { BackButton } from "@/components/auth/BackButton";
import { ContactUs } from "@/components/auth/ContactUs";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Image, ImageSourcePropType, Text, TouchableOpacity, View } from "react-native";

/** Reusable icon-button — blue pill with left icon and label */
function IconButton({
  icon,
  label,
  onPress,
  disabled = false,
  loading = false,
}: {
  icon: ImageSourcePropType;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      className="w-full h-14 rounded-full flex-row items-center justify-center"
      style={{ backgroundColor: disabled ? "#A8D8FA" : "#28B4FA", gap: 12 }}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          <Image
            source={icon}
            className="w-6 h-6"
            resizeMode="contain"
          />
          <Text className="font-cg-semibold text-white" style={{ fontSize: 18 }}>
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

export default function GoogleAuthScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleGoogleSignIn() {
    setLoading(true);
    // TODO: expo-auth-session Google OAuth
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    router.replace("/(tabs)/home");
  }

  return (
    <AuthLayout>
      <ContactUs />
      <View className="flex-1 px-6 pt-6 pb-12">
        <BackButton />

        {/* Header */}
        <View className="items-center mt-10 mb-12">
          <Image
            source={require("@/assets/images/blue-black-logo.png")}
            className="w-24 h-24 mb-6"
            resizeMode="contain"
          />
          <Text className="font-cg-bold text-dark-400 text-center mb-3" style={{ fontSize: 28 }}>
            Welcome back
          </Text>
          <Text className="font-cg-regular text-dark-200 text-center leading-6" style={{ fontSize: 16 }}>
            Choose how you'd like to sign in to your Masqany account.
          </Text>
        </View>

        {/* Google sign-in button */}
        <IconButton
          icon={require("@/assets/icons/google.webp")}
          label="Continue with Google"
          onPress={handleGoogleSignIn}
          loading={loading}
        />

        {/* Divider */}
        <View className="flex-row items-center my-6">
          <View className="flex-1 h-px bg-light-200" />
          <Text className="font-cg-regular text-dark-100 mx-4" style={{ fontSize: 15 }}>or</Text>
          <View className="flex-1 h-px bg-light-200" />
        </View>

        {/* Password sign-in button */}
        <IconButton
          icon={require("@/assets/icons/password.webp")}
          label="Continue with Password"
          onPress={() => router.replace("/login" as any)}
          disabled={loading}
        />
      </View>
    </AuthLayout>
  );
}
