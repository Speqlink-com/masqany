/**
 * PlateNumberInput Component
 * 
 * License plate input with Kenyan format validation and auto-uppercase
 * Format: KEA 100Q (3 letters, space, 3 digits, 1 letter)
 * Uses NativeWind for styling
 */

import { normalizePlateNumber } from "@/modules/vehicle";
import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";

interface PlateNumberInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  editable?: boolean;
}

export function PlateNumberInput({ value, onChangeText, error, editable = true }: PlateNumberInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChangeText = (text: string) => {
    const normalized = normalizePlateNumber(text);
    onChangeText(normalized);
  };

  const borderColor = error ? "border-danger" : isFocused ? "border-primary-700" : "border-primary-700";

  return (
    <View className="mb-4">
      <View className={`flex-row items-center bg-white border-2 ${borderColor} rounded-lg px-4 py-3`}>
        {/* License Plate Icon */}
        <View className="w-6 h-6 bg-primary-700/10 rounded items-center justify-center mr-3">
          <Text className="text-primary-700 font-inter-bold text-[11px]">LP</Text>
        </View>

        {/* Input */}
        <TextInput
          value={value}
          onChangeText={handleChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="KEA 100Q"
          placeholderTextColor="#BDBDC0"
          autoCapitalize="characters"
          editable={editable}
          className="flex-1 font-inter text-[15px] text-dark-400"
        />
      </View>

      {/* Error Message */}
      {error && (
        <Text className="font-inter text-[13px] text-danger mt-1">
          {error}
        </Text>
      )}

      {/* Helper Text */}
      {!error && (
        <Text className="font-inter text-[11px] text-dark-100 mt-1">
          Format: 3 letters, space, 3 digits, 1 letter (e.g., KEA 100Q)
        </Text>
      )}
    </View>
  );
}
