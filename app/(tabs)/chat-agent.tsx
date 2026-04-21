/**
 * AI Chat — property assistant.
 * Full-screen app-full-screen.webp. Tab bar floats transparently over it.
 * TODO: AI agent chat with useSendAgentMessage().
 */
import { StatusBar } from "expo-status-bar";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatAgentScreen() {
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
            <Text style={styles.title}>AI Agent</Text>
            <Text style={styles.sub}>Property assistant — coming soon</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  bg: { flex: 1 },
  safe: { flex: 1, paddingBottom: 100 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: "CG-Bold", fontSize: 26, color: "#000000" },
  sub: { fontFamily: "Nunito_400Regular", fontSize: 15, color: "#2C3539", marginTop: 8 },
});
