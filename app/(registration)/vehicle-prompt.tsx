/**
 * Vehicle registration prompt.
 * Full-screen: vehicle-registration-full-screen.webp
 * One button at 60% from top → vehicle-registration form.
 */
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, ImageBackground, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VehiclePromptScreen() {
  const router = useRouter();

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <ImageBackground
        source={require("@/assets/images/vehicle-registration-full-screen.webp")}
        className="flex-1"
        resizeMode="cover"
      >
        <SafeAreaView className="flex-1" edges={["top", "left", "right", "bottom"]}>
          {/* Absolutely positioned at 60% from top */}
          <View
            className="absolute left-0 right-0 px-8 items-center"
            style={{ top: "55%" }}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              className="w-full"
              onPress={() =>
                router.replace("/(registration)/vehicle-registration" as never)
              }
            >
              <Image
                source={require("@/assets/images/vehicle-registration-btn.webp")}
                className="w-full h-14"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
