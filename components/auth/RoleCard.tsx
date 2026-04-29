/**
 * RoleCard — rounded card with white background, Poppins title + Inter subtitle.
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
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} className="flex-1">
      <View
        className="flex-1 rounded-2xl items-center justify-center px-3 py-5"
        style={{
          minHeight: 140,
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
        <Image
          source={icon}
          className="w-10 h-10 mb-3"
          resizeMode="contain"
        />
        <Text
          className="font-poppins-bold text-center mb-1"
          style={{ fontSize: 14, color: selected ? "#28B4FA" : "#1A2225" }}
        >
          {title}
        </Text>
        <Text
          className="font-inter-medium text-center"
          style={{ fontSize: 11, lineHeight: 16, color: "#6B7280" }}
        >
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
});
