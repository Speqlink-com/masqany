/**
 * Google Login Screen
 * Simulates Google OAuth flow - ready for expo-auth-session integration
 */
import { mockGoogleLogin } from "@/assets/data/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { BackButton } from "@/components/auth/BackButton";
import { ContactUs } from "@/components/auth/ContactUs";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Image,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function GoogleLoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleGoogleSignIn() {
    setLoading(true);
    
    // Simulate Google OAuth flow
    // TODO: Replace with expo-auth-session when ready
    await new Promise((r) => setTimeout(r, 1500));
    
    // Mock Google login
    const response = mockGoogleLogin("mock-google-token");
    
    setLoading(false);
    
    // Route based on user role
    routeByRole(response.user.role, router);
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
          <Text className="font-poppins-bold text-dark-400 text-center mb-3" style={{ fontSize: 28 }}>
            Sign in with Google
          </Text>
          <Text className="font-inter-regular text-dark-200 text-center leading-6" style={{ fontSize: 16 }}>
            Quick and secure access to your Masqany account
          </Text>
        </View>

        {/* Google sign-in button */}
        <TouchableOpacity
          onPress={handleGoogleSignIn}
          disabled={loading}
          activeOpacity={0.85}
          className="w-full h-14 rounded-full flex-row items-center justify-center mb-6"
          style={{ backgroundColor: loading ? "#A8D8FA" : "#28B4FA", gap: 12 }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Image
                source={require("@/assets/icons/google.webp")}
                className="w-6 h-6"
                resizeMode="contain"
              />
              <Text className="font-inter-bold text-white" style={{ fontSize: 18 }}>
                Continue with Google
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Info text */}
        <View className="items-center px-4">
          <Text className="font-inter-regular text-dark-200 text-center leading-6" style={{ fontSize: 14 }}>
            By continuing, you agree to Masqany's Terms of Service and Privacy Policy
          </Text>
        </View>

        {/* Demo note */}
        <View className="mt-8 p-4 rounded-2xl" style={{ backgroundColor: "rgba(32, 166, 253, 0.1)" }}>
          <Text className="font-inter-semibold text-primary-700 mb-2" style={{ fontSize: 14 }}>
            Demo Mode
          </Text>
          <Text className="font-inter-regular text-dark-300" style={{ fontSize: 13, lineHeight: 20 }}>
            This is a simulated Google login. In production, this will use Google OAuth for secure authentication.
          </Text>
        </View>
      </View>
    </AuthLayout>
  );
}

function routeByRole(role: string, router: ReturnType<typeof useRouter>) {
  switch (role) {
    case "admin":
    case "super_admin":
      router.replace("/(tabs)/home"); // TODO: Change to /(admin)/dashboard when ready
      break;
    case "property_owner":
    case "property_agent":
      router.replace("/(tabs)/home");
      break;
    case "relocation_driver":
      router.replace("/(tabs)/home");
      break;
    case "tenant":
    default:
      router.replace("/(tabs)/home");
  }
}
