/**
 * Property Admin Profile Tab
 * Redirects to the main profile screen
 */

import { Redirect } from "expo-router";

export default function PropertyAdminProfile() {
  return <Redirect href="/(tabs)/profile" />;
}
