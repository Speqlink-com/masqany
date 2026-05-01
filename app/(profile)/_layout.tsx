/**
 * Profile group layout — Stack navigator for all profile sub-screens.
 * Configures consistent header styling using design tokens.
 */
import { Stack } from "expo-router";

export default function ProfileGroupLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide default headers to avoid duplication
        animation: "slide_from_right",
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="account-settings" />
      <Stack.Screen name="language-preferences" />
      <Stack.Screen name="security-settings" />
      <Stack.Screen name="notification-preferences" />
      <Stack.Screen name="support" />
      <Stack.Screen name="policies" />
      <Stack.Screen name="switch-account" />
      <Stack.Screen name="add-account" />
    </Stack>
  );
}
