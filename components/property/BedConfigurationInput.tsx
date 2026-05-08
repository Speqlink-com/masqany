/**
 * BedConfigurationInput Component
 * 
 * Input for bed configuration per room (Short-Stay properties)
 * Allows adding multiple rooms with bed types and quantities
 */

import { colors } from "@/constants/tokens";
import type { BedConfiguration } from "@/modules/property";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface BedConfigurationInputProps {
  configurations: BedConfiguration[];
  onChange: (configurations: BedConfiguration[]) => void;
}

const BED_TYPES: { value: BedConfiguration["bedType"]; label: string }[] = [
  { value: "single", label: "Single" },
  { value: "double", label: "Double" },
  { value: "queen", label: "Queen" },
  { value: "king", label: "King" },
  { value: "bunk", label: "Bunk" },
];

export function BedConfigurationInput({
  configurations,
  onChange,
}: BedConfigurationInputProps) {
  const addConfiguration = () => {
    onChange([
      ...configurations,
      { roomName: "", bedType: "single", quantity: 1 },
    ]);
  };

  const removeConfiguration = (index: number) => {
    onChange(configurations.filter((_, i) => i !== index));
  };

  const updateConfiguration = (
    index: number,
    field: keyof BedConfiguration,
    value: any
  ) => {
    const updated = [...configurations];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <View className="mb-4">
      <Text className="font-poppins-semibold text-[15px] text-dark-400 mb-3">
        Bed Configuration
      </Text>

      {configurations.map((config, index) => (
        <View
          key={index}
          className="mb-3 p-4 rounded-lg"
          style={{ backgroundColor: "#E1E6E8" }}
        >
          {/* Room Name */}
          <Text className="font-inter text-[13px] text-dark-400 mb-2">
            Room Name
          </Text>
          <TextInput
            className="font-inter text-[15px] text-dark-400 px-3 py-2 rounded-lg mb-3"
            style={{
              backgroundColor: colors.light[400],
              borderWidth: 1,
              borderColor: colors.light[200],
            }}
            placeholder="e.g., Bedroom 1, Living Room"
            value={config.roomName}
            onChangeText={(text) =>
              updateConfiguration(index, "roomName", text)
            }
          />

          {/* Bed Type */}
          <Text className="font-inter text-[13px] text-dark-400 mb-2">
            Bed Type
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-3">
            {BED_TYPES.map((type) => (
              <TouchableOpacity
                key={type.value}
                onPress={() =>
                  updateConfiguration(index, "bedType", type.value)
                }
                className="px-3 py-2 rounded-full"
                style={{
                  backgroundColor:
                    config.bedType === type.value
                      ? colors.primary[700]
                      : colors.light[300],
                }}
                activeOpacity={0.7}
              >
                <Text
                  className="font-inter text-[13px]"
                  style={{
                    color:
                      config.bedType === type.value
                        ? colors.light[400]
                        : colors.dark[400],
                  }}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quantity */}
          <View className="flex-row items-center justify-between">
            <Text className="font-inter text-[13px] text-dark-400">
              Quantity
            </Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() =>
                  updateConfiguration(
                    index,
                    "quantity",
                    Math.max(1, config.quantity - 1)
                  )
                }
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.light[300] }}
                activeOpacity={0.7}
              >
                <Ionicons name="remove" size={20} color={colors.dark[400]} />
              </TouchableOpacity>
              <Text className="font-inter-semibold text-[17px] text-dark-400 mx-4">
                {config.quantity}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  updateConfiguration(index, "quantity", config.quantity + 1)
                }
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.primary[700] }}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={20} color={colors.light[400]} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Remove Button */}
          {configurations.length > 1 && (
            <TouchableOpacity
              onPress={() => removeConfiguration(index)}
              className="mt-3 flex-row items-center justify-center py-2 rounded-lg"
              style={{ backgroundColor: colors.danger }}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={16} color={colors.light[400]} />
              <Text className="font-inter-medium text-[13px] text-white ml-2">
                Remove Room
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      {/* Add Room Button */}
      <TouchableOpacity
        onPress={addConfiguration}
        className="flex-row items-center justify-center py-3 rounded-lg border-2 border-dashed"
        style={{
          borderColor: colors.primary[700],
          backgroundColor: colors.primary[50],
        }}
        activeOpacity={0.7}
      >
        <Ionicons name="add-circle-outline" size={20} color={colors.primary[700]} />
        <Text
          className="font-inter-medium text-[13px] ml-2"
          style={{ color: colors.primary[700] }}
        >
          Add Room
        </Text>
      </TouchableOpacity>
    </View>
  );
}
