import { Stack } from "expo-router";

export default function AuthGroupLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="login-otp" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="forgot-password-otp" />
      <Stack.Screen name="reset-password" />
      <Stack.Screen name="onboarding-name" />
      <Stack.Screen name="onboarding-role" />
      <Stack.Screen name="onboarding-credentials" />
      <Stack.Screen name="onboarding-otp" />
      <Stack.Screen name="onboarding-complete" />
    </Stack>
  );
}
