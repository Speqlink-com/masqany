import icons from "@/constants/icons";
import { colors, spacing, typography } from "@/constants/tokens";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MoveExecutionScreen() {
  const router = useRouter();
  const { moveId } = useLocalSearchParams<{ moveId: string }>();

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Image source={icons.backArrow} style={styles.backIcon} resizeMode="contain" />
      </TouchableOpacity>

      <View style={styles.card}>
        <Image source={icons.pickupVehicle} style={styles.vehicleIcon} resizeMode="contain" />
        <Text style={styles.title}>Move in progress</Text>
        <Text style={styles.body}>
          Tracking and route controls for {moveId} will live here.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.light[300],
    padding: spacing.base,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  card: {
    marginTop: spacing.xl,
    borderRadius: 8,
    backgroundColor: "#E1E6E8",
    padding: spacing.xl,
    alignItems: "center",
  },
  vehicleIcon: {
    width: 128,
    height: 72,
    marginBottom: spacing.base,
  },
  title: {
    color: colors.dark[400],
    fontFamily: typography.family.headingBold,
    fontSize: typography.size.xl,
    marginBottom: spacing.sm,
  },
  body: {
    color: colors.dark[100],
    fontFamily: typography.family.regular,
    fontSize: typography.size.base,
    lineHeight: 22,
    textAlign: "center",
  },
});
