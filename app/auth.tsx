/**
 * Auth landing — logo and buttons grouped together, reduced gap between them.
 * Terms pinned to bottom.
 */
import { ContactUs } from "@/components/auth/ContactUs";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthScreen() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);



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

          {/* Beta Disclaimer - Below ContactUs (which is absolute positioned) */}
          <View className="w-full px-8" style={{ marginTop: 60 }}>
            <View className="w-full bg-[#FFF9E6] border border-[#FFD700] rounded-lg px-4 py-3" style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }}>
              <Text className="font-inter-semibold text-[#B8860B] text-center" style={{ fontSize: 14 }}>
                🚧 Beta Version
              </Text>
              <Text className="font-inter-regular text-[#000000] text-center mt-1" style={{ fontSize: 12 }}>
                Secure your account now. Full version coming soon!
              </Text>
            </View>
          </View>

          {/* Main content — logo + buttons grouped, terms at bottom */}
          <View className="flex-1 items-center justify-between px-8 pt-4 pb-4">

            {/* Logo + buttons as one unit, vertically centered */}
            <View className="flex-1 items-center justify-center w-full" style={{ gap: 2 }}>
              <Image
                source={require("../assets/images/blue-black-logo.png")}
                className="w-36 h-36"
                resizeMode="contain"
              />
                   <Text className="font-poppins-bold text-dark-400 text-center mt-0" style={{ fontSize: 28 }}>
            Welcome back
          </Text>
          <Text className="font-inter-regular text-dark-200 text-center leading-6 pb-2" style={{ fontSize: 16 }}>
            Choose how you would like to sign in to your Masqany account.
          </Text>
      

              {/* Buttons with "or" separators */}
              <View className="w-full" style={{ gap: 2 }}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => router.push("/google-login" as any)}
                >
                  <Image
                    source={require("../assets/images/continue-with-google-btn.png")}
                    className="w-full h-14"
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                {/* "or" separator */}
                <View className="flex-row items-center my-2">
                  <View className="flex-1 h-px bg-light-200" />
                  <Text className="font-inter-regular text-dark-100 mx-4" style={{ fontSize: 15 }}>or</Text>
                  <View className="flex-1 h-px bg-light-200" />
                </View>

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

                {/* "or" separator */}
                <View className="flex-row items-center my-2">
                  <View className="flex-1 h-px bg-light-200" />
                  <Text className="font-inter-regular text-dark-100 mx-4" style={{ fontSize: 15 }}>or</Text>
                  <View className="flex-1 h-px bg-light-200" />
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => router.push("/onboarding-name" as any)}
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
            <Text className="font-inter text-[#000000] text-center leading-5" style={{ fontSize: 15 }}>
              Masqany Finds, Reserves and Alerts.
            </Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
