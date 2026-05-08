/**
 * CancellationPolicySelector Component
 * 
 * Selector for cancellation policies (Short-Stay properties)
 * Includes Flexible, Moderate, Firm, Strict, Super Strict, Custom
 */

import { colors } from "@/constants/tokens";
import type { CancellationPolicy } from "@/modules/property";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface CancellationPolicySelectorProps {
  selectedPolicy: CancellationPolicy;
  customPolicy?: string;
  notes?: string;
  onPolicyChange: (policy: CancellationPolicy) => void;
  onCustomPolicyChange?: (text: string) => void;
  onNotesChange?: (text: string) => void;
}

const POLICIES: {
  value: CancellationPolicy;
  label: string;
  description: string;
}[] = [
  {
    value: "flexible",
    label: "Flexible",
    description: "Full refund 24+ hours before, 50% within 24 hours",
  },
  {
    value: "moderate",
    label: "Moderate",
    description: "Full refund 5+ days before, 50% within 5 days",
  },
  {
    value: "firm",
    label: "Firm",
    description: "Full refund 30+ days, 50% 7-30 days, No refund within 7 days",
  },
  {
    value: "strict",
    label: "Strict",
    description: "50% refund 60+ days before, No refund within 60 days",
  },
  {
    value: "super_strict",
    label: "Super Strict",
    description: "No refund unless property rebooked",
  },
  {
    value: "custom",
    label: "Custom",
    description: "Define your own cancellation terms",
  },
];

export function CancellationPolicySelector({
  selectedPolicy,
  customPolicy,
  notes,
  onPolicyChange,
  onCustomPolicyChange,
  onNotesChange,
}: CancellationPolicySelectorProps) {
  return (
    <View className="mb-4">
      <Text className="font-poppins-semibold text-[15px] text-dark-400 mb-3">
        Cancellation Policy
      </Text>

      {POLICIES.map((policy) => (
        <TouchableOpacity
          key={policy.value}
          onPress={() => onPolicyChange(policy.value)}
          className="mb-3 p-4 rounded-lg"
          style={{
            backgroundColor:
              selectedPolicy === policy.value
                ? colors.primary[50]
                : "#E1E6E8",
            borderWidth: selectedPolicy === policy.value ? 2 : 0,
            borderColor: colors.primary[700],
          }}
          activeOpacity={0.7}
        >
          <View className="flex-row items-center mb-1">
            <View
              className="w-5 h-5 rounded-full items-center justify-center mr-3"
              style={{
                backgroundColor:
                  selectedPolicy === policy.value
                    ? colors.primary[700]
                    : colors.light[300],
              }}
            >
              {selectedPolicy === policy.value && (
                <View
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.light[400] }}
                />
              )}
            </View>
            <Text
              className="font-inter-semibold text-[15px]"
              style={{
                color:
                  selectedPolicy === policy.value
                    ? colors.primary[700]
                    : colors.dark[400],
              }}
            >
              {policy.label}
            </Text>
          </View>
          <Text className="font-inter text-[13px] text-dark-100 ml-8">
            {policy.description}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Custom Policy Input */}
      {selectedPolicy === "custom" && (
        <View className="mt-2">
          <Text className="font-inter text-[13px] text-dark-400 mb-2">
            Describe Your Cancellation Policy
          </Text>
          <TextInput
            className="font-inter text-[15px] text-dark-400 px-3 py-2 rounded-lg"
            style={{
              backgroundColor: colors.light[400],
              borderWidth: 1,
              borderColor: colors.light[200],
              minHeight: 100,
              textAlignVertical: "top",
            }}
            placeholder="Enter your custom cancellation policy..."
            multiline
            numberOfLines={4}
            value={customPolicy}
            onChangeText={onCustomPolicyChange}
          />
        </View>
      )}

      {/* Additional Notes */}
      <View className="mt-4">
        <Text className="font-inter text-[13px] text-dark-400 mb-2">
          Additional Cancellation Notes (Optional)
        </Text>
        <TextInput
          className="font-inter text-[15px] text-dark-400 px-3 py-2 rounded-lg"
          style={{
            backgroundColor: colors.light[400],
            borderWidth: 1,
            borderColor: colors.light[200],
            minHeight: 80,
            textAlignVertical: "top",
          }}
          placeholder="e.g., Special circumstances like travel bans, natural disasters..."
          multiline
          numberOfLines={3}
          value={notes}
          onChangeText={onNotesChange}
        />
      </View>
    </View>
  );
}
