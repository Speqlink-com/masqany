import { useRouter } from "expo-router";
import { Image, TouchableOpacity } from "react-native";

interface BackButtonProps {
  onPress?: () => void;
}

export function BackButton({ onPress }: BackButtonProps) {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={onPress ?? (() => router.back())}
      activeOpacity={0.8}
      className="w-10 h-10 rounded-full items-center justify-center"
      style={{ backgroundColor: "#85C9FF" }}
    >
      <Image
        source={require("@/assets/icons/left-chevron.webp")}
        style={{ width: 14, height: 14 }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}
