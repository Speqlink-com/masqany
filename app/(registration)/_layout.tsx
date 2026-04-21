import { Stack } from "expo-router";

export default function RegistrationGroupLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="vehicle-prompt" />
      <Stack.Screen name="vehicle-registration" />
      <Stack.Screen name="property-prompt" />
      <Stack.Screen name="property-registration" />
    </Stack>
  );
}
