/**
 * Sign-up entry - starts onboarding at the Masqany greeting.
 */
import { Redirect } from "expo-router";

export default function SignUpScreen() {
  return <Redirect href="/onboarding-name" />;
}
