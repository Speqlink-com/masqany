/**
 * Auth landing — logo and buttons grouped together, reduced gap between them.
 * Terms pinned to bottom.
 */
import { ContactUs } from "@/components/auth/ContactUs";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthScreen() {
  const router = useRouter();

  return (
    <View className="flex-1">
      <StatusBar style="dark" />
      <ImageBackground
        source={require("../assets/images/app-full-screen.webp")}
        className="flex-1"
        resizeMode="cover"
      >
        <SafeAreaView className="flex-1" edges={["top", "left", "right", "bottom"]}>
          <ContactUs />

          {/* Main content — logo + buttons grouped, terms at bottom */}
          <View className="flex-1 items-center justify-between px-8 pt-10 pb-6">

            {/* Logo + buttons as one unit, vertically centered */}
            <View className="flex-1 items-center justify-center w-full" style={{ gap: 28 }}>
              <Image
                source={require("../assets/images/blue-black-logo.png")}
                className="w-36 h-36"
                resizeMode="contain"
              />

              {/* Buttons */}
              <View className="w-full" style={{ gap: 8 }}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => router.push("/google" as any)}
                >
                  <Image
                    source={require("../assets/images/continue-with-google-btn.png")}
                    className="w-full h-14"
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => router.push("/login" as any)}
                >
                  <Image
                    source={require("../assets/images/continue-with-password-btn.png")}
                    className="w-full h-14"
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => router.push("/sign-up" as any)}
                >
                  <Image
                    source={require("../assets/images/sign-up-btn.png")}
                    className="w-full h-14"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms — pinned to bottom */}
            <Text className="font-cg-regular text-xl text-white text-center leading-5">
              Masqany Finds,Reserves and Alerts. Whether relocating or looking for a stay
             
            </Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
