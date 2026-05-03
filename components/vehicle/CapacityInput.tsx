/**
 * CapacityInput Component
 * 
 * Capacity input with unit selector and validation (50-10000 kg)
 * Uses NativeWind for styling
 */

import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface CapacityInputProps {
  value: number;
  unit: "kg" | "cubic_meters";
  onChangeValue: (value: number) => void;
  onChangeUnit: (unit: "kg" | "cubic_meters") => void;
  error?: string;
}

export function CapacityInput({ value, unit, onChangeValue, onChangeUnit, error }: CapacityInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChangeText = (text: string) => {
    const numValue = parseFloat(text);
    if (!isNaN(numValue)) {
      onChangeValue(numValue);
    } else if (text === "") {
      onChangeValue(0);
    }
  };

  const borderColor = error ? "border-danger" : isFocused ? "border-primary-700" : "border-primary-700";

  return (
    <View className="mb-4">
      <View className={`flex-row items-center bg-white border-2 ${borderColor} rounded-lg overflow-hidden`}>
        {/* Weight Icon */}
        <View className="px-4">
          <Ionicons name="scale-outline" size={24} color="#20A6FD" />
        </View>

        {/* Numeric Input */}
        <TextInput
          value={value > 0 ? value.toString() : ""}
          onChangeText={handleChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Capacity"
          placeholderTextColor="#BDBDC0"
          keyboardType="numeric"
          className="flex-1 font-inter text-[15px] text-dark-400 py-3"
        />

        {/* Unit Selector */}
        <View className="flex-row bg-light-200 rounded-lg m-2">
          <TouchableOpacity
            onPress={() => onChangeUnit("kg")}
            className={`px-3 py-2 rounded-lg ${unit === "kg" ? "bg-primary-700" : "bg-transparent"}`}
          >
            <Text className={`font-inter-medium text-[13px] ${unit === "kg" ? "text-light-400" : "text-dark-100"}`}>
              kg
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onChangeUnit("cubic_meters")}
            className={`px-3 py-2 rounded-lg ${unit === "cubic_meters" ? "bg-primary-700" : "bg-transparent"}`}
          >
            <Text className={`font-inter-medium text-[13px] ${unit === "cubic_meters" ? "text-light-400" : "text-dark-100"}`}>
              m³
            </Text>
          </TouchableOpacity>
        </View>
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
          Range: 50 - 10,000 {unit}
        </Text>
      )}
    </View>
  );
}
