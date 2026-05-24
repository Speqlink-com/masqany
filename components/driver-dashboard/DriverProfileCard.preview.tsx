/**
 * DriverProfileCard Preview
 * 
 * Visual test/preview file for the DriverProfileCard component.
 * This file can be used to verify the component renders correctly with mock data.
 */

import { mockDriverProfile } from '@/constants/data/driver-dashboard';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import DriverProfileCard from './DriverProfileCard';

export default function DriverProfileCardPreview() {
  return (
    <View style={styles.container}>
      <DriverProfileCard profile={mockDriverProfile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
});
