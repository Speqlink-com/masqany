import { getStoredSession } from "@/modules/auth/storage";
import { tokenStore, useAuthStore } from "@/store/auth.store";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    // Wait for router to be ready
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    checkAuthAndNavigate();
  }, [isReady, router]);

  const checkAuthAndNavigate = async () => {
    try {
      console.log("[SPLASH] Checking for stored session...");
      
      // Check for stored session
      const session = await getStoredSession();
      
      if (session) {
        console.log("[SPLASH] ✅ Found stored session for user:", session.user.fullName);
        console.log("[SPLASH] User role:", session.user.role);
        
        // Restore tokens and user to app state
        tokenStore.getState().setTokens(session.tokens.accessToken, session.tokens.refreshToken);
        setUser(session.user);
        
        // Wait a moment for UI
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Route based on user role
        routeByRole(session.user.role);
      } else {
        console.log("[SPLASH] ❌ No stored session found, showing auth screen");
        
        // No session, show auth screen after splash
        await new Promise(resolve => setTimeout(resolve, 2500));
        router.replace("/auth");
      }
    } catch (error) {
      console.error("[SPLASH] Error checking auth:", error);
      
      // On error, show auth screen
      await new Promise(resolve => setTimeout(resolve, 2500));
      router.replace("/auth");
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const routeByRole = (role: string) => {
    console.log("[SPLASH] Routing user based on role:", role);
    
    switch (role) {
      case "admin":
      case "superadmin":
      case "super_admin":
        console.log("[SPLASH] -> Routing to super-admin dashboard");
        router.replace("/(super-admin)/dashboard" as any);
        break;
      case "property_owner":
      case "property_agent":
        console.log("[SPLASH] -> Routing to property-admin");
        router.replace("/(property-admin)" as any);
        break;
      case "relocation_driver":
        console.log("[SPLASH] -> Routing to driver dashboard");
        router.replace("/(driver)/dashboard" as any);
        break;
      case "tenant":
      default:
        console.log("[SPLASH] -> Routing to tenant home");
        router.replace("/(tabs)/home" as any);
    }
  };

  return (
    <View style={styles.root}>
      <Image
        source={require("../assets/images/splash-screen.png")}
        style={styles.image}
        resizeMode="cover"
      />
      
      {/* Loading indicator */}
      {isCheckingAuth && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#3fbdfd",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  loadingOverlay: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
  },
});
