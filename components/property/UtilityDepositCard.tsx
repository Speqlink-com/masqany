/**
 * UtilityDepositCard Component
 * 
 * Kenya-specific utility deposit configuration
 * Handles water, electricity, WiFi, security, garbage, house maintenance
 */

import { colors } from "@/constants/tokens";
import type { UtilityConfig } from "@/modules/property";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Switch, Text, TextInput, View } from "react-native";

interface UtilityDepositCardProps {
  utilityName: string;
  icon: keyof typeof Ionicons.glyphMap;
  config: UtilityConfig;
  onChange: (config: UtilityConfig) => void;
  showProvider?: boolean;
  showBillingMethod?: boolean;
  showMeterType?: boolean;
}

export function UtilityDepositCard({
  utilityName,
  icon,
  config,
  onChange,
  showProvider = false,
  showBillingMethod = false,
  showMeterType = false,
}: UtilityDepositCardProps) {
  return (
    <View
      className="mb-4 p-4 rounded-lg"
      style={{ backgroundColor: "#E1E6E8" }}
    >
      {/* Header */}
      <View className="flex-row items-center mb-3">
        <Ionicons name={icon} size={24} color={colors.primary[700]} />
        <Text className="font-poppins-semibold text-[15px] text-dark-400 ml-2">
          {utilityName}
        </Text>
      </View>

      {/* Available Toggle */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="font-inter text-[13px] text-dark-400">Available</Text>
        <Switch
          value={config.available}
          onValueChange={(value) => onChange({ ...config, available: value })}
          trackColor={{ false: colors.light[200], true: colors.primary[700] }}
          thumbColor={colors.light[400]}
        />
      </View>

      {config.available && (
        <>
          {/* Provider (Water only) */}
          {showProvider && (
            <View className="mb-3">
              <Text className="font-inter text-[13px] text-dark-400 mb-2">
                Provider
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {["Nairobi Water", "County Water", "Borehole", "Tank"].map(
                  (provider) => (
                    <Text
                      key={provider}
                      className="font-inter text-[11px] px-3 py-1 rounded-full"
                      style={{
                        backgroundColor:
                          config.provider === provider
                            ? colors.primary[700]
                            : colors.light[300],
                        color:
                          config.provider === provider
                            ? colors.light[400]
                            : colors.dark[400],
                      }}
                      onPress={() => onChange({ ...config, provider })}
                    >
                      {provider}
                    </Text>
                  )
                )}
              </View>
            </View>
          )}

          {/* Billing Method */}
          {showBillingMethod && (
            <View className="mb-3">
              <Text className="font-inter text-[13px] text-dark-400 mb-2">
                Billing Method
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {[
                  { label: "Per Unit", value: "per_unit" },
                  { label: "Fixed Monthly", value: "fixed_monthly" },
                  { label: "Included in Rent", value: "included_in_rent" },
                ].map((method) => (
                  <Text
                    key={method.value}
                    className="font-inter text-[11px] px-3 py-1 rounded-full"
                    style={{
                      backgroundColor:
                        config.billingMethod === method.value
                          ? colors.primary[700]
                          : colors.light[300],
                      color:
                        config.billingMethod === method.value
                          ? colors.light[400]
                          : colors.dark[400],
                    }}
                    onPress={() =>
                      onChange({
                        ...config,
                        billingMethod: method.value as any,
                      })
                    }
                  >
                    {method.label}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* Meter Type (Electricity only) */}
          {showMeterType && (
            <View className="mb-3">
              <Text className="font-inter text-[13px] text-dark-400 mb-2">
                Meter Type
              </Text>
              <View className="flex-row gap-2">
                {[
                  { label: "Prepaid Token", value: "prepaid_token" },
                  { label: "Postpaid Bill", value: "postpaid_bill" },
                ].map((type) => (
                  <Text
                    key={type.value}
                    className="font-inter text-[11px] px-3 py-1 rounded-full"
                    style={{
                      backgroundColor:
                        config.meterNumber === type.value
                          ? colors.primary[700]
                          : colors.light[300],
                      color:
                        config.meterNumber === type.value
                          ? colors.light[400]
                          : colors.dark[400],
                    }}
                    onPress={() =>
                      onChange({ ...config, meterNumber: type.value })
                    }
                  >
                    {type.label}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* Monthly Cost */}
          <View className="mb-3">
            <Text className="font-inter text-[13px] text-dark-400 mb-2">
              Monthly Cost (KES)
            </Text>
            <TextInput
              className="font-inter text-[15px] text-dark-400 px-3 py-2 rounded-lg"
              style={{
                backgroundColor: colors.light[400],
                borderWidth: 1,
                borderColor: colors.light[200],
              }}
              placeholder="0"
              keyboardType="numeric"
              value={config.monthlyCost?.toString() || ""}
              onChangeText={(text) =>
                onChange({ ...config, monthlyCost: parseFloat(text) || 0 })
              }
            />
          </View>

          {/* Included in Rent Toggle */}
          <View className="flex-row items-center justify-between mb-3">
            <Text className="font-inter text-[13px] text-dark-400">
              Included in Rent
            </Text>
            <Switch
              value={config.includedInRent}
              onValueChange={(value) =>
                onChange({ ...config, includedInRent: value })
              }
              trackColor={{
                false: colors.light[200],
                true: colors.primary[700],
              }}
              thumbColor={colors.light[400]}
            />
          </View>

          {/* Deposit Required Toggle */}
          <View className="flex-row items-center justify-between mb-3">
            <Text className="font-inter text-[13px] text-dark-400">
              Deposit Required
            </Text>
            <Switch
              value={config.depositRequired}
              onValueChange={(value) =>
                onChange({ ...config, depositRequired: value })
              }
              trackColor={{
                false: colors.light[200],
                true: colors.primary[700],
              }}
              thumbColor={colors.light[400]}
            />
          </View>

          {/* Deposit Amount */}
          {config.depositRequired && (
            <View>
              <Text className="font-inter text-[13px] text-dark-400 mb-2">
                Deposit Amount (KES)
              </Text>
              <TextInput
                className="font-inter text-[15px] text-dark-400 px-3 py-2 rounded-lg"
                style={{
                  backgroundColor: colors.light[400],
                  borderWidth: 1,
                  borderColor: colors.light[200],
                }}
                placeholder="0"
                keyboardType="numeric"
                value={config.depositAmount?.toString() || ""}
                onChangeText={(text) =>
                  onChange({ ...config, depositAmount: parseFloat(text) || 0 })
                }
              />
            </View>
          )}
        </>
      )}
    </View>
  );
}
