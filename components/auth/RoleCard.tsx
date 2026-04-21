/**
 * RoleCard — gradient #333 → #898989, Nunito fonts, no icon ring.
 */
import { LinearGradient } from "expo-linear-gradient";
import { memo } from "react";
import { Image, ImageSourcePropType, Text, TouchableOpacity } from "react-native";

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
      <LinearGradient
        colors={["#333333", "#898989"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="flex-1 rounded-2xl items-center justify-center px-3 py-5"
        style={{
          minHeight: 140,
          borderWidth: selected ? 1.5 : 0,
          borderColor: selected ? "#28B4FA" : "transparent",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.18,
          shadowRadius: 6,
          elevation: 4,
        }}
      >
        <Image
          source={icon}
          className="w-9 h-9 mb-3"
          resizeMode="contain"
          style={{ tintColor: selected ? "#28B4FA" : "#ffffff" }}
        />
        <Text
          className="font-nunito-bold text-center mb-1"
          style={{ fontSize: 14, color: selected ? "#28B4FA" : "#ffffff" }}
        >
          {title}
        </Text>
        <Text
          className="font-nunito-medium text-primary-600 text-center"
          style={{ fontSize: 11, lineHeight: 16 }}
        >
          {subtitle}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
});
