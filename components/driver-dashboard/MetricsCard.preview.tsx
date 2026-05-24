/**
 * MetricsCard Preview
 * 
 * Preview component to test MetricsCard with all metric types.
 */

import icons from '@/constants/icons';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import MetricsCard from './MetricsCard';

export default function MetricsCardPreview() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.grid}>
        {/* Trip Metrics */}
        <View style={styles.cardWrapper}>
          <MetricsCard
            icon={icons.tripMetrics}
            label="Total Trips"
            value={247}
          />
        </View>

        {/* Income Metrics */}
        <View style={styles.cardWrapper}>
          <MetricsCard
            icon={icons.incomeMetrics}
            label="Weekly Income"
            value="45,000"
            unit="KES"
          />
        </View>

        {/* Clients Metrics */}
        <View style={styles.cardWrapper}>
          <MetricsCard
            icon={icons.clientsMetrics}
            label="Clients Served"
            value={189}
          />
        </View>

        {/* Distance Metrics - using location icon as fallback for km-icon */}
        <View style={styles.cardWrapper}>
          <MetricsCard
            icon={icons.location}
            label="Distance Traveled"
            value="3,420"
            unit="km"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cardWrapper: {
    width: '48%',
    height: 120,
  },
});
