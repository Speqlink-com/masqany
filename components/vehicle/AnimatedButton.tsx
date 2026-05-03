/**
 * AnimatedButton Component
 * 
 * Button with scale animation on press (0.95)
 * Uses NativeWind for styling and Animated API for animations
 */

import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import {
    ActivityIndicator,
    Animated,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: "primary" | "secondary" | "danger" | "outline";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export function AnimatedButton({
  title,
  onPress,
  icon,
  variant = "primary",
  disabled = false,
  loading = false,
  fullWidth = true,
}: AnimatedButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const getButtonStyles = () => {
    const baseStyles = "rounded-lg py-4 px-6 flex-row items-center justify-center";
    
    if (disabled || loading) {
      return `${baseStyles} bg-light-200`;
    }

    switch (variant) {
      case "primary":
        return `${baseStyles} bg-primary-700`;
      case "secondary":
        return `${baseStyles} bg-secondary`;
      case "danger":
        return `${baseStyles} bg-danger`;
      case "outline":
        return `${baseStyles} bg-transparent border-2 border-primary-700`;
      default:
        return `${baseStyles} bg-primary-700`;
    }
  };

  const getTextStyles = () => {
    if (disabled || loading) {
      return "font-inter-semibold text-[15px] text-dark-100";
    }

    switch (variant) {
      case "primary":
      case "secondary":
      case "danger":
        return "font-inter-semibold text-[15px] text-light-400";
      case "outline":
        return "font-inter-semibold text-[15px] text-primary-700";
      default:
        return "font-inter-semibold text-[15px] text-light-400";
    }
  };

  const getIconColor = () => {
    if (disabled || loading) {
      return "#4F5C62"; // dark-100
    }

    switch (variant) {
      case "primary":
      case "secondary":
      case "danger":
        return "#FFFFFF"; // light-400
      case "outline":
        return "#20A6FD"; // primary-700
      default:
        return "#FFFFFF";
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          width: fullWidth ? "100%" : undefined,
        }}
      >
        <View className={getButtonStyles()}>
          {loading ? (
            <ActivityIndicator size="small" color={getIconColor()} />
          ) : (
            <>
              {icon && (
                <Ionicons
                  name={icon}
                  size={20}
                  color={getIconColor()}
                  style={{ marginRight: 8 }}
                />
              )}
              <Text className={getTextStyles()}>{title}</Text>
            </>
          )}
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}
