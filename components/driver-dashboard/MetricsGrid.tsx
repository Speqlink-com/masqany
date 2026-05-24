/**
 * MetricsGrid Component
 * 
 * Container for 4 MetricsCard components displaying driver performance metrics.
 * Arranged in a 2x2 grid layout with responsive spacing.
 * 
 * Metrics displayed:
 * - Total trips (trip-metrics.png icon)
 * - Weekly income (income-metrics.png icon)
 * - Clients served (clients-metrics.png icon)
 * - Distance traveled (location.png icon for km)
 * 
 * Features:
 * - 2x2 grid layout on standard phones
 * - Responsive spacing using design tokens
 * - Formatted values (currency for income, numbers for others)
 */

import icons from "@/constants/icons";
import { spacing } from "@/constants/tokens";
import type { DriverMetrics } from "@/modules/driver-dashboard/types";
import React from "react";
import { StyleSheet, View } from "react-native";
import MetricsCard from "./MetricsCard";

interface MetricsGridProps {
  metrics: DriverMetrics;
}

const MetricsGrid = React.memo(({ metrics }: MetricsGridProps) => {
  // Format weekly income with KES currency
  const formattedIncome = `KES ${metrics.weeklyIncome.toLocaleString()}`;

  return (
    <View style={styles.container}>
      {/* Row 1 */}
      <View style={styles.row}>
        {/* Total Trips */}
        <View style={styles.cardWrapper}>
          <MetricsCard
            icon={icons.tripMetrics}
            label="Total trips"
            value={metrics.totalTrips}
          />
        </View>

        {/* Weekly Income */}
        <View style={styles.cardWrapper}>
          <MetricsCard
            icon={icons.incomeMetrics}
            label="Weekly income"
            value={formattedIncome}
          />
        </View>
      </View>

      {/* Row 2 */}
      <View style={styles.row}>
        {/* Clients Served */}
        <View style={styles.cardWrapper}>
          <MetricsCard
            icon={icons.clientsMetrics}
            label="Clients served"
            value={metrics.totalClients}
          />
        </View>

        {/* Distance Traveled */}
        <View style={styles.cardWrapper}>
          <MetricsCard
            icon={icons.location}
            label="Distance traveled"
            value={metrics.totalDistanceKm}
            unit="km"
          />
        </View>
      </View>
    </View>
  );
});

MetricsGrid.displayName = "MetricsGrid";

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  cardWrapper: {
    flex: 1,
  },
});

export default MetricsGrid;
