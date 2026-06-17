/**
 * Google Login Screen
 * Handles Google OAuth sign-in flow
 */
import { AuthLayout } from "@/components/auth/AuthLayout";
import { BackButton } from "@/components/auth/BackButton";
import { ContactUs } from "@/components/auth/ContactUs";
import { isGoogleSignInAvailable, signInWithGoogle } from "@/modules/auth/google";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function GoogleLoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleGoogleSignIn() {
    if (!isGoogleSignInAvailable()) {
      Alert.alert(
        "Development Build Required",
        "Google Sign-In requires a development build. It won't work with Expo Go.\n\nPlease use email/password login instead.",
        [{ text: "OK", onPress: () => router.back() }]
      );
      return;
    }

    setLoading(true);
    
    console.log("=".repeat(50));
    console.log("[GOOGLE LOGIN] Starting Google Sign-In...");
    console.log("=".repeat(50));

    try {
      const response = await signInWithGoogle();
      
      console.log("[GOOGLE LOGIN] ✅ Sign-in successful!");
      console.log("[GOOGLE LOGIN] User:", response.user.fullName);
      console.log("[GOOGLE LOGIN] Role:", response.user.role);
      console.log("=".repeat(50));
      
      setLoading(false);
      
      // Route based on user role
      routeByRole(response.user.role, router);
    } catch (err: any) {
      console.log("[GOOGLE LOGIN] ❌ Sign-in failed:");
      console.error("[GOOGLE LOGIN] Error:", err);
      console.log("=".repeat(50));
      
      setLoading(false);
      
      let errorMsg = err.message || "Google Sign-In failed";
      
      if (err.status === 404) {
        errorMsg = "No account found with this Google email. Please sign up first.";
      } else if (errorMsg.includes("cancelled")) {
        // User cancelled - don't show error
        return;
      }
      
      Alert.alert("Sign-In Failed", errorMsg);
    }
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

        {!isGoogleSignInAvailable() && (
          <View className="mt-8 p-4 rounded-2xl" style={{ backgroundColor: "rgba(245, 85, 85, 0.1)" }}>
            <Text className="font-inter-semibold mb-2" style={{ fontSize: 14, color: "#F75555" }}>
              Development Build Required
            </Text>
            <Text className="font-inter-regular text-dark-300" style={{ fontSize: 13, lineHeight: 20 }}>
              Google Sign-In requires a development build and won't work with Expo Go. Please use email/password login instead.
            </Text>
          </View>
        )}
      </View>
    </AuthLayout>
  );
}

function routeByRole(role: string, router: ReturnType<typeof useRouter>) {
  console.log("[GOOGLE LOGIN] Routing user based on role:", role);
  
  switch (role) {
    case "admin":
    case "superadmin":
    case "super_admin":
      console.log("[GOOGLE LOGIN] -> Routing to super-admin dashboard");
      router.replace("/(super-admin)/dashboard" as any);
      break;
    case "property_owner":
    case "property_agent":
      console.log("[GOOGLE LOGIN] -> Routing to property-admin");
      router.replace("/(property-admin)" as any);
      break;
    case "relocation_driver":
      console.log("[GOOGLE LOGIN] -> Routing to driver dashboard");
      router.replace("/(driver)/dashboard" as any);
      break;
    case "tenant":
    default:
      console.log("[GOOGLE LOGIN] -> Routing to tenant home");
      router.replace("/(tabs)/home" as any);
  }
}
