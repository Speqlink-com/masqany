/**
 * SectionHeader Preview
 * 
 * Visual test/preview file for the SectionHeader component.
 * This file can be used to verify the component renders correctly with different configurations.
 */

import icons from '@/constants/icons';
import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import SectionHeader from './SectionHeader';

export default function SectionHeaderPreview() {
  const handleRefresh = () => {
    Alert.alert('Refresh', 'Refresh action triggered');
  };

  const handleViewAll = () => {
    Alert.alert('View All', 'View all action triggered');
  };

  return (
    <View style={styles.container}>
      {/* Active Moves Section Header */}
      <SectionHeader
        icon={icons.activeMove}
        title="Active moves!!"
        actionText="refresh"
        onActionPress={handleRefresh}
      />

      {/* Upcoming Moves Section Header */}
      <SectionHeader
        icon={icons.upcomingMoves}
        title="Upcoming moves"
        actionText="view all"
        onActionPress={handleViewAll}
      />

      {/* Section Header without action */}
      <SectionHeader
        icon={icons.activeMove}
        title="Section without action"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
});
