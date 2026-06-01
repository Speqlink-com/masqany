import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";

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
    <View style={styles.root}>
      <Image
        source={require("../assets/images/splash-screen.png")}
        style={styles.image}
        resizeMode="cover"
      />
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
});
