import React from 'react';
import { StyleSheet, View } from 'react-native';

/**
 * TabBarProtection Component
 * 
 * Provides a protective blue bar at the bottom of the screen to prevent
 * content from overlapping with the tab bar navigation icons.
 * 
 * Design Specs:
 * - Height: 100px (fixed)
 * - Background: #3fbdfd (light blue)
 * - Position: Absolute at bottom
 * - Z-index: 50 (ensures it stays above content but below tab bar)
 */
export const TabBarProtection: React.FC = () => {
  return (
    <View style={styles.container} />
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: '#3fbdfd',
    zIndex: 50,
  },
});
