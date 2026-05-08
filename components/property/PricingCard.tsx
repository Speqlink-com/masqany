/**
 * PricingCard Component
 * 
 * Rental pricing inputs for Long-Stay and Short-Stay properties
 * Handles monthly rent (Long-Stay) or nightly rate (Short-Stay)
 */

import { colors } from "@/constants/tokens";
import React from "react";
import { Text, TextInput, View } from "react-native";

interface PricingCardProps {
  stayType: "long_stay" | "short_stay";
  monthlyRent?: number;
  nightlyRate?: number;
  onMonthlyRentChange?: (value: number) => void;
  onNightlyRateChange?: (value: number) => void;
}

export function PricingCard({
  stayType,
  monthlyRent,
  nightlyRate,
  onMonthlyRentChange,
  onNightlyRateChange,
}: PricingCardProps) {
  return (
    <View className="mb-4 p-4 rounded-lg" style={{ backgroundColor: "#E1E6E8" }}>
      <Text className="font-poppins-semibold text-[15px] text-dark-400 mb-3">
        {stayType === "long_stay" ? "Monthly Rent" : "Base Nightly Rate"}
      </Text>

      <View className="flex-row items-center">
        <Text className="font-inter-semibold text-[17px] text-dark-400 mr-2">
          KES
        </Text>
        <TextInput
          className="flex-1 font-inter text-[19px] text-dark-400 px-3 py-2 rounded-lg"
          style={{
            backgroundColor: colors.light[400],
            borderWidth: 1,
            borderColor: colors.primary[700],
          }}
          placeholder="0"
          keyboardType="numeric"
          value={
            stayType === "long_stay"
              ? monthlyRent?.toString() || ""
              : nightlyRate?.toString() || ""
          }
          onChangeText={(text) => {
            const value = parseFloat(text) || 0;
            if (stayType === "long_stay" && onMonthlyRentChange) {
              onMonthlyRentChange(value);
            } else if (stayType === "short_stay" && onNightlyRateChange) {
              onNightlyRateChange(value);
            }
          }}
        />
      </View>

      {stayType === "short_stay" && (
        <Text className="font-inter text-[11px] text-dark-100 mt-2">
          Per night for standard occupancy
        </Text>
      )}
    </View>
  );
}
