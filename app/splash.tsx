import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for router to be ready
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    // Navigate to auth screen after 4 seconds
    const timer = setTimeout(() => {
      router.replace("/auth");
    }, 4000);

    return () => clearTimeout(timer);
  }, [isReady, router]);

  return (
    <View className="flex-1">
      <Image
        source={require("../assets/images/splash-screen.webp")}
        className="w-full h-full"
        resizeMode="cover"
      />
    </View>
  );
}
