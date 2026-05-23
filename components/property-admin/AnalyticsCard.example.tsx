/**
 * AnalyticsCard Example Usage
 * 
 * Demonstrates how to use the AnalyticsCard component in the dashboard.
 * This file shows the 2x2 grid layout with all four analytics cards.
 */

import { spacing } from "@/constants/tokens";
import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import AnalyticsCard from "./AnalyticsCard";

export default function AnalyticsCardExample() {
  return (
    <View style={styles.container}>
      {/* Row 1 */}
      <View style={styles.row}>
        {/* Occupied Card */}
        <View style={styles.cardWrapper}>
          <AnalyticsCard
            icon={require("@/assets/icons/occupied-prop-icon.png")}
            value={35}
            label="Occupied"
            onPress={() => Alert.alert("Analytics", "Occupied units details")}
          />
        </View>

        {/* Vacant Card */}
        <View style={styles.cardWrapper}>
          <AnalyticsCard
            icon={require("@/assets/icons/vaccant-prop-icon.webp")}
            value={5}
            label="Vacant"
            onPress={() => Alert.alert("Analytics", "Vacant units details")}
          />
        </View>
      </View>

      {/* Row 2 */}
      <View style={styles.row}>
        {/* Occupancy Rate Card */}
        <View style={styles.cardWrapper}>
          <AnalyticsCard
            icon={require("@/assets/icons/occupancy-icon.png")}
            value="87.5%"
            label="Occupancy Rate"
            onPress={() => Alert.alert("Analytics", "Occupancy rate details")}
          />
        </View>

        {/* Views Card */}
        <View style={styles.cardWrapper}>
          <AnalyticsCard
            icon={require("@/assets/icons/views-icon.png")}
            value={1234}
            label="Views"
            onPress={() => Alert.alert("Analytics", "Property views details")}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.base,
  },
  row: {
    flexDirection: "row",
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  cardWrapper: {
    flex: 1,
  },
});
