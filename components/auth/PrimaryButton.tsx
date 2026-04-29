/**
 * PrimaryButton — fully rounded pill, Inter ExtraBold label.
 */
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      className="w-full h-14 rounded-full items-center justify-center"
      style={{ backgroundColor: disabled ? "#A8D8FA" : "#28B4FA" }}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text
          className="font-inter-extrabold text-white"
          style={{ fontSize: 17, letterSpacing: 0.2 }}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
