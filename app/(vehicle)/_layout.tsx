/**
 * Vehicle Group Layout
 * 
 * Stack navigator for vehicle management screens
 */

import { Stack } from "expo-router";

export default function VehicleGroupLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="vehicle-list" />
      <Stack.Screen name="vehicle-details" />
      <Stack.Screen name="edit-vehicle" />
      <Stack.Screen name="vehicle-history" />
    </Stack>
  );
}
