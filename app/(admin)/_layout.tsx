/**
 * Admin Group Layout
 * 
 * Stack navigator for admin screens
 */

import { Stack } from "expo-router";

export default function AdminGroupLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="admin-vehicles" />
      <Stack.Screen name="admin-vehicle-review" />
    </Stack>
  );
}
