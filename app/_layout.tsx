/**
 * Root layout — font loading, providers.
 * Font stack: Inter (body text) + Poppins (headings) + CG-Bold (branding only).
 */
import { queryClient } from "@/lib/query/client";
import {
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
} from "@expo-google-fonts/poppins";
import {
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
} from "@expo-google-fonts/nunito";
import { FontAwesome5, Foundation, Ionicons } from "@expo/vector-icons";
import { QueryClientProvider } from "@tanstack/react-query";
import * as Font from "expo-font";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Inter — body text
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    // Poppins — headings
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    // Nunito — existing UI labels and controls
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    // Cormorant Garamond — branding only
    "CG-Bold": require("../assets/fonts/CormorantGaramond-Bold.ttf"),
  });

  const [iconsLoaded, setIconsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      ...Ionicons.font,
      ...FontAwesome5.font,
      ...Foundation.font,
    })
      .catch((e) => console.warn("[RootLayout] icon fonts:", e))
      .finally(() => setIconsLoaded(true));
  }, []);

  useEffect(() => {
    if (fontsLoaded && iconsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, iconsLoaded]);

  if (!fontsLoaded || !iconsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar style="auto" />
          <Stack screenOptions={{  headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
        animationDuration: 260}}>
            <Stack.Screen name="index" />
            <Stack.Screen name="splash" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(registration)" />
            <Stack.Screen name="(profile)" />
            <Stack.Screen name="(admin)" />
            <Stack.Screen name="(driver)" />
            <Stack.Screen name="(property-admin)" />
            <Stack.Screen name="search" />
            <Stack.Screen name="property/[propertyId]" />
          </Stack>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
