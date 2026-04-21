/**
 * Admin / Super Admin dashboard — app-full-screen.webp background.
 * Role is determined from JWT on login. No registration flow for admins.
 */
import { StatusBar } from "expo-status-bar";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdminDashboard() {
  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ImageBackground
        source={require("@/assets/images/app-full-screen.webp")}
        style={styles.bg}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
          <View style={styles.center}>
            <Text style={styles.title}>Admin Dashboard</Text>
            <Text style={styles.sub}>
              Admin & Super Admin panel — coming soon.{"\n"}
              Role is determined from JWT on login.
            </Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  bg: { flex: 1 },
  safe: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
  title: { fontFamily: "CG-Bold", fontSize: 26, color: "#000000", marginBottom: 10 },
  sub: {
    fontFamily: "CG-Regular",
    fontSize: 16,
    color: "#2C3539",
    textAlign: "center",
    lineHeight: 24,
  },
});
