/**
 * Root layout — font loading, providers.
 * Font stack: Nunito (UI) + Cormorant Garamond (display headings).
 * Rubik removed entirely.
 */
import { queryClient } from "@/lib/query/client";
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
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
    // Nunito — all UI text
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    // Cormorant Garamond — display headings & agent bubbles
    "CG-Regular":  require("../assets/fonts/CormorantGaramond-Regular.ttf"),
    "CG-Medium":   require("../assets/fonts/CormorantGaramond-Medium.ttf"),
    "CG-SemiBold": require("../assets/fonts/CormorantGaramond-SemiBold.ttf"),
    "CG-Bold":     require("../assets/fonts/CormorantGaramond-Bold.ttf"),
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
          <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="splash" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(registration)" />
            <Stack.Screen name="(admin)" />
          </Stack>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
