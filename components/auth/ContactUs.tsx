import { Linking, Text, TouchableOpacity } from "react-native";

export function ContactUs() {
  return (
    <TouchableOpacity
      onPress={() => Linking.openURL("mailto:masqany@speqlink.com")}
      activeOpacity={0.7}
      className="absolute top-14 right-6 z-20"
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Text className="font-nunito-semibold text-sm text-primary-700 underline">
        Contact us
      </Text>
    </TouchableOpacity>
  );
}
