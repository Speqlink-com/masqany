/**
 * PaymentMethodSelector Component
 * 
 * Radio buttons with conditional fields for payment methods
 * Methods: M-Pesa, Bank Transfer, Cash
 * Uses NativeWind for styling
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export type PaymentMethod = "mpesa" | "bank_transfer" | "cash";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  // M-Pesa fields
  mpesaNumber?: string;
  onMpesaNumberChange?: (number: string) => void;
  // Bank fields
  bankName?: string;
  onBankNameChange?: (name: string) => void;
  accountNumber?: string;
  onAccountNumberChange?: (number: string) => void;
  accountName?: string;
  onAccountNameChange?: (name: string) => void;
  // Errors
  error?: string;
  mpesaError?: string;
  bankError?: string;
}

export function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
  mpesaNumber,
  onMpesaNumberChange,
  bankName,
  onBankNameChange,
  accountNumber,
  onAccountNumberChange,
  accountName,
  onAccountNameChange,
  error,
  mpesaError,
  bankError,
}: PaymentMethodSelectorProps) {
  const formatMpesaNumber = (text: string) => {
    // Remove non-digits
    const digits = text.replace(/\D/g, "");
    
    // Auto-add +254 prefix if not present
    if (digits.length > 0 && !digits.startsWith("254")) {
      return `+254${digits}`;
    }
    
    if (digits.startsWith("254")) {
      return `+${digits}`;
    }
    
    return text;
  };

  const handleMpesaNumberChange = (text: string) => {
    const formatted = formatMpesaNumber(text);
    onMpesaNumberChange?.(formatted);
  };

  return (
    <View className="mb-4">
      {/* Label */}
      <Text className="font-inter-medium text-[15px] text-dark-400 mb-2">
        Payment Method <Text className="text-danger">*</Text>
      </Text>

      <Text className="font-inter text-[13px] text-dark-100 mb-3">
        How would you like to receive payments?
      </Text>

      {/* M-Pesa Option */}
      <TouchableOpacity
        onPress={() => onMethodChange("mpesa")}
        className={`
          border-2 rounded-lg p-4 mb-3 flex-row items-center
          ${selectedMethod === "mpesa" ? "border-primary-700 bg-primary-50" : "border-light-200"}
        `}
      >
        <View
          className={`
            w-6 h-6 rounded-full border-2 items-center justify-center mr-3
            ${selectedMethod === "mpesa" ? "border-primary-700" : "border-light-100"}
          `}
        >
          {selectedMethod === "mpesa" && (
            <View className="w-3 h-3 rounded-full bg-primary-700" />
          )}
        </View>
        <View className="flex-1">
          <Text className="font-inter-semibold text-[15px] text-dark-400">
            M-Pesa
          </Text>
          <Text className="font-inter text-[13px] text-dark-100">
            Instant mobile money transfer
          </Text>
        </View>
        <Ionicons name="phone-portrait-outline" size={24} color="#20A6FD" />
      </TouchableOpacity>

      {/* M-Pesa Number Field */}
      {selectedMethod === "mpesa" && (
        <View className="ml-9 mb-3">
          <Text className="font-inter-medium text-[13px] text-dark-400 mb-2">
            M-Pesa Number
          </Text>
          <View
            className={`
              flex-row items-center border-2 rounded-lg px-4 py-3
              ${mpesaError ? "border-danger" : "border-primary-700"}
            `}
          >
            <Ionicons name="call-outline" size={20} color="#20A6FD" />
            <TextInput
              value={mpesaNumber}
              onChangeText={handleMpesaNumberChange}
              placeholder="+254XXXXXXXXX"
              placeholderTextColor="#BDBDC0"
              keyboardType="phone-pad"
              className="flex-1 ml-2 font-inter text-[15px] text-dark-400"
            />
          </View>
          {mpesaError && (
            <Text className="font-inter text-[13px] text-danger mt-1">
              {mpesaError}
            </Text>
          )}
          <Text className="font-inter text-[11px] text-dark-100 mt-1">
            Format: +254XXXXXXXXX (10 digits after +254)
          </Text>
        </View>
      )}

      {/* Bank Transfer Option */}
      <TouchableOpacity
        onPress={() => onMethodChange("bank_transfer")}
        className={`
          border-2 rounded-lg p-4 mb-3 flex-row items-center
          ${selectedMethod === "bank_transfer" ? "border-primary-700 bg-primary-50" : "border-light-200"}
        `}
      >
        <View
          className={`
            w-6 h-6 rounded-full border-2 items-center justify-center mr-3
            ${selectedMethod === "bank_transfer" ? "border-primary-700" : "border-light-100"}
          `}
        >
          {selectedMethod === "bank_transfer" && (
            <View className="w-3 h-3 rounded-full bg-primary-700" />
          )}
        </View>
        <View className="flex-1">
          <Text className="font-inter-semibold text-[15px] text-dark-400">
            Bank Transfer
          </Text>
          <Text className="font-inter text-[13px] text-dark-100">
            Direct bank account deposit
          </Text>
        </View>
        <Ionicons name="business-outline" size={24} color="#20A6FD" />
      </TouchableOpacity>

      {/* Bank Transfer Fields */}
      {selectedMethod === "bank_transfer" && (
        <View className="ml-9 mb-3 gap-3">
          {/* Bank Name */}
          <View>
            <Text className="font-inter-medium text-[13px] text-dark-400 mb-2">
              Bank Name
            </Text>
            <View
              className={`
                flex-row items-center border-2 rounded-lg px-4 py-3
                ${bankError ? "border-danger" : "border-primary-700"}
              `}
            >
              <Ionicons name="business-outline" size={20} color="#20A6FD" />
              <TextInput
                value={bankName}
                onChangeText={onBankNameChange}
                placeholder="e.g., Equity Bank"
                placeholderTextColor="#BDBDC0"
                className="flex-1 ml-2 font-inter text-[15px] text-dark-400"
              />
            </View>
          </View>

          {/* Account Number */}
          <View>
            <Text className="font-inter-medium text-[13px] text-dark-400 mb-2">
              Account Number
            </Text>
            <View
              className={`
                flex-row items-center border-2 rounded-lg px-4 py-3
                ${bankError ? "border-danger" : "border-primary-700"}
              `}
            >
              <Ionicons name="card-outline" size={20} color="#20A6FD" />
              <TextInput
                value={accountNumber}
                onChangeText={onAccountNumberChange}
                placeholder="Enter account number"
                placeholderTextColor="#BDBDC0"
                keyboardType="number-pad"
                className="flex-1 ml-2 font-inter text-[15px] text-dark-400"
              />
            </View>
          </View>

          {/* Account Name */}
          <View>
            <Text className="font-inter-medium text-[13px] text-dark-400 mb-2">
              Account Name
            </Text>
            <View
              className={`
                flex-row items-center border-2 rounded-lg px-4 py-3
                ${bankError ? "border-danger" : "border-primary-700"}
              `}
            >
              <Ionicons name="person-outline" size={20} color="#20A6FD" />
              <TextInput
                value={accountName}
                onChangeText={onAccountNameChange}
                placeholder="Account holder name"
                placeholderTextColor="#BDBDC0"
                className="flex-1 ml-2 font-inter text-[15px] text-dark-400"
              />
            </View>
          </View>

          {bankError && (
            <Text className="font-inter text-[13px] text-danger">
              {bankError}
            </Text>
          )}
        </View>
      )}

      {/* Cash Option */}
      <TouchableOpacity
        onPress={() => onMethodChange("cash")}
        className={`
          border-2 rounded-lg p-4 flex-row items-center
          ${selectedMethod === "cash" ? "border-primary-700 bg-primary-50" : "border-light-200"}
        `}
      >
        <View
          className={`
            w-6 h-6 rounded-full border-2 items-center justify-center mr-3
            ${selectedMethod === "cash" ? "border-primary-700" : "border-light-100"}
          `}
        >
          {selectedMethod === "cash" && (
            <View className="w-3 h-3 rounded-full bg-primary-700" />
          )}
        </View>
        <View className="flex-1">
          <Text className="font-inter-semibold text-[15px] text-dark-400">
            Cash
          </Text>
          <Text className="font-inter text-[13px] text-dark-100">
            Collect payment in cash
          </Text>
        </View>
        <Ionicons name="cash-outline" size={24} color="#20A6FD" />
      </TouchableOpacity>

      {/* General Error Message */}
      {error && (
        <Text className="font-inter text-[13px] text-danger mt-2">
          {error}
        </Text>
      )}
    </View>
  );
}
