/**
 * AnimatedInput Component
 * 
 * Input field with floating label and focus animations
 * Uses NativeWind for styling with React Native Animated API
 */

import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, TextInput, TextInputProps, View } from "react-native";

interface AnimatedInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  icon?: React.ReactNode;
}

export function AnimatedInput({ 
  label, 
  value, 
  onChangeText, 
  error, 
  icon,
  ...textInputProps 
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const labelPosition = useRef(new Animated.Value(value ? 1 : 0)).current;
  const borderColor = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(labelPosition, {
      toValue: isFocused || value ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  useEffect(() => {
    Animated.timing(borderColor, {
      toValue: isFocused ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const labelStyle = {
    top: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [16, -8],
    }),
    fontSize: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [15, 12],
    }),
  };

  const animatedBorderColor = borderColor.interpolate({
    inputRange: [0, 1],
    outputRange: ["#20A6FD", "#20A6FD"],
  });

  const borderColorClass = error ? "border-danger" : "";

  return (
    <View className="mb-4">
      <Animated.View 
        className={`flex-row items-center bg-white border-2 rounded-lg px-4 ${borderColorClass}`}
        style={{ borderColor: error ? undefined : animatedBorderColor }}
      >
        {/* Icon */}
        {icon && (
          <View className="mr-3">
            {icon}
          </View>
        )}

        {/* Input Container */}
        <View className="flex-1 py-3">
          {/* Floating Label */}
          <Animated.Text
            className="absolute font-inter-medium text-dark-100 bg-white px-1"
            style={labelStyle}
          >
            {label}
          </Animated.Text>

          {/* Input */}
          <TextInput
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholderTextColor="#BDBDC0"
            className="font-inter text-[15px] text-dark-400"
            {...textInputProps}
          />
        </View>
      </Animated.View>

      {/* Error Message */}
      {error && (
        <Text className="font-inter text-[13px] text-danger mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}
