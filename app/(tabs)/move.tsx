/**
 * Move — relocation services with map interface.
 */
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function MoveScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E6F4FE' }}>
      <StatusBar style="dark" />
      <Text style={{ fontSize: 18, fontWeight: '600', color: '#004AAD' }}>
        Map Coming Soon
      </Text>
      <Text style={{ fontSize: 14, color: '#666', marginTop: 8 }}>
        Available in production build
      </Text>
    </View>
  );
}
