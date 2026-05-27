/**
 * RoleCard - rounded horizontal card with white background.
 * Icons keep their original colors (no tint).
 */
import { memo } from "react";
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from "react-native";

interface RoleCardProps {
  title: string;
  subtitle: string;
  icon: ImageSourcePropType;
  selected: boolean;
  onPress: () => void;
}

export const RoleCard = memo(function RoleCard({
  title,
  subtitle,
  icon,
  selected,
  onPress,
}: RoleCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <View
        className="rounded-2xl flex-row items-center px-4 py-4"
        style={{
          minHeight: 92,
          backgroundColor: "#FFFFFF",
          borderWidth: selected ? 2 : 1,
          borderColor: selected ? "#28B4FA" : "#E5E7EB",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <View
          className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
          style={{ backgroundColor: selected ? "rgba(40,180,250,0.12)" : "#F3F4F6" }}
        >
          <Image
            source={icon}
            className="w-9 h-9"
            resizeMode="contain"
          />
        </View>
        <View className="flex-1">
          <Text
            className="font-poppins-bold mb-1"
            style={{ fontSize: 16, color: selected ? "#28B4FA" : "#1A2225" }}
          >
            {title}
          </Text>
          <Text
            className="font-inter-medium"
            style={{ fontSize: 13, lineHeight: 18, color: "#6B7280" }}
          >
            {subtitle}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});
