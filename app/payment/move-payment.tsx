/**
 * Move Payment Screen
 * Handles M-Pesa and card payment for move bookings
 * Uses NativeWind styling exclusively
 */

import { useCreateBooking, type Location as MoveLocation, type VehicleType } from "@/modules/move"
import { useLocalSearchParams, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import React, { useState } from "react"
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

type PaymentMethod = "mpesa" | "card"

export default function MovePaymentScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{
    vehicleId: string
    pickupLocation: string
    dropoffLocation: string
    vehicleType: string
    estimatedPrice: string
  }>()

  const [phoneNumber, setPhoneNumber] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatusText, setPaymentStatusText] = useState("")

  const createBooking = useCreateBooking()

  // Parse locations from params
  const pickupLocation: MoveLocation = JSON.parse(params.pickupLocation)
  const dropoffLocation: MoveLocation = JSON.parse(params.dropoffLocation)
  const estimatedPrice = parseFloat(params.estimatedPrice)

  const handlePayment = async () => {
    // Validate phone number for M-Pesa
    if (paymentMethod === "mpesa") {
      const formattedPhone = formatKenyanPhone(phoneNumber)
      if (!validateKenyanPhone(formattedPhone)) {
        Alert.alert(
          "Invalid Phone Number",
          "Please enter a valid Kenyan phone number (e.g., 0712345678 or +254712345678)"
        )
        return
      }
    }

    setIsProcessing(true)
    setPaymentStatusText("Creating booking...")

    try {
      // Create booking first
      const booking = await createBooking.mutateAsync({
        pickupLocation,
        dropoffLocation,
        vehicleType: params.vehicleType as VehicleType,
        scheduledAt: new Date().toISOString(),
      })

      setPaymentStatusText("Initiating payment...")

      // Initiate payment based on method
      let paymentId: string

      if (paymentMethod === "mpesa") {
        const formattedPhone = formatKenyanPhone(phoneNumber)
        const { paymentId: mpesaPaymentId } = await initiateMpesaPayment(
          booking.id,
          formattedPhone,
          estimatedPrice
        )
        paymentId = mpesaPaymentId

        setPaymentStatusText("Check your phone for M-Pesa prompt...")
      } else {
        // Card payment - not implemented yet
        Alert.alert(
          "Coming Soon",
          "Card payment integration is coming soon. Please use M-Pesa for now."
        )
        setIsProcessing(false)
        return
      }

      // Poll payment status
      setPaymentStatusText("Waiting for payment confirmation...")
      const paymentResult = await pollPaymentStatus(paymentId)

      if (paymentResult.status === "completed") {
        // Payment successful
        Alert.alert(
          "Payment Successful!",
          `Your move has been booked successfully.\n\nBooking ID: ${booking.id}\nTransaction ID: ${paymentResult.transactionId || "N/A"}`,
          [
            {
              text: "OK",
              onPress: () => {
                router.replace({
                  pathname: "/(tabs)/move",
                  params: { bookingId: booking.id, paymentSuccess: "true" },
                } as never)
              },
            },
          ]
        )
      } else if (paymentResult.status === "failed") {
        // Payment failed
        Alert.alert(
          "Payment Failed",
          getPaymentStatusMessage(paymentResult.status, paymentResult.message),
          [{ text: "Try Again" }]
        )
      } else if (paymentResult.status === "timeout") {
        // Payment timeout
        Alert.alert(
          "Payment Verification Timeout",
          getPaymentStatusMessage(paymentResult.status, paymentResult.message),
          [
            { text: "Contact Support", onPress: () => router.push("/(profile)/support" as never) },
            { text: "OK" },
          ]
        )
      }
    } catch (error: any) {
      console.error("Payment error:", error)
      Alert.alert(
        "Payment Failed",
        error?.message || "Failed to process payment. Please try again."
      )
    } finally {
      setIsProcessing(false)
      setPaymentStatusText("")
    }
  }

  const handleCancel = () => {
    Alert.alert("Cancel Move", "Are you sure you want to cancel this move?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => router.back(),
      },
    ])
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="items-center py-8 border-b border-gray-200">
          <Image
            source={require("@/assets/icons/prompt-masqany.webp")}
            className="w-24 h-24 mb-3"
            resizeMode="contain"
          />
          <Text className="text-2xl font-bold text-dark-400">Complete Payment</Text>
          <Text className="text-sm text-gray-600 mt-1">Secure your move booking</Text>
        </View>

        {/* Booking Summary */}
        <View className="px-4 py-6 border-b border-gray-200">
          <Text className="text-xs font-semibold text-gray-600 mb-3">BOOKING SUMMARY</Text>

          <View className="bg-gray-50 p-4 rounded-xl">
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-gray-600">From:</Text>
              <Text className="text-sm font-semibold text-dark-400 flex-1 text-right ml-2">
                {pickupLocation.name}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-gray-600">To:</Text>
              <Text className="text-sm font-semibold text-dark-400 flex-1 text-right ml-2">
                {dropoffLocation.name}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-600">Vehicle:</Text>
              <Text className="text-sm font-semibold text-dark-400">
                {params.vehicleType === "pickup"
                  ? "Pickup Truck"
                  : params.vehicleType === "mini_truck"
                  ? "Mini Truck"
                  : "Large Truck"}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Method Selection */}
        <View className="px-4 py-6 border-b border-gray-200">
          <Text className="text-xs font-semibold text-gray-600 mb-3">PAYMENT METHOD</Text>

          <View className="flex-row">
            <TouchableOpacity
              onPress={() => setPaymentMethod("mpesa")}
              className={`flex-1 mr-2 p-4 rounded-xl border-2 items-center ${
                paymentMethod === "mpesa"
                  ? "border-primary-700 bg-blue-50"
                  : "border-gray-200 bg-white"
              }`}
              activeOpacity={0.7}
            >
              <Image
                source={require("@/assets/icons/mpesa.png")}
                className="w-12 h-12 mb-2"
                resizeMode="contain"
              />
              <Text
                className={`text-sm font-semibold ${
                  paymentMethod === "mpesa" ? "text-primary-700" : "text-gray-600"
                }`}
              >
                M-Pesa
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setPaymentMethod("card")}
              className={`flex-1 ml-2 p-4 rounded-xl border-2 items-center ${
                paymentMethod === "card"
                  ? "border-primary-700 bg-blue-50"
                  : "border-gray-200 bg-white"
              }`}
              activeOpacity={0.7}
            >
              <Image
                source={require("@/assets/icons/card-pay-icon.webp")}
                className="w-12 h-12 mb-2"
                resizeMode="contain"
              />
              <Text
                className={`text-sm font-semibold ${
                  paymentMethod === "card" ? "text-primary-700" : "text-gray-600"
                }`}
              >
                Card
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Phone Number Input (M-Pesa) */}
        {paymentMethod === "mpesa" && (
          <View className="px-4 py-6">
            <Text className="text-xs font-semibold text-gray-600 mb-2">PHONE NUMBER</Text>
            <View className="flex-row items-center px-4 py-3 border border-gray-300 rounded-lg">
              <Image
                source={require("@/assets/icons/i-phone-icon.webp")}
                className="w-5 h-5 mr-2"
                resizeMode="contain"
              />
              <TextInput
                className="flex-1 text-base text-dark-400"
                placeholder="0712345678 or +254712345678"
                placeholderTextColor="#9CA3AF"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                editable={!isProcessing}
              />
            </View>
            <Text className="text-xs text-gray-500 mt-2">
              You will receive an M-Pesa prompt on this number
            </Text>
          </View>
        )}

        {/* Card Payment (Placeholder) */}
        {paymentMethod === "card" && (
          <View className="px-4 py-6">
            <View className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
              <Text className="text-sm text-yellow-800">
                Card payment integration coming soon. Please use M-Pesa for now.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Actions */}
      <View className="px-4 py-4 border-t border-gray-200">
        {/* Payment Status Text */}
        {paymentStatusText && (
          <View className="mb-3 p-3 bg-blue-50 rounded-lg">
            <Text className="text-sm text-primary-700 text-center">{paymentStatusText}</Text>
          </View>
        )}

        <TouchableOpacity
          onPress={handlePayment}
          disabled={isProcessing || (paymentMethod === "mpesa" && !phoneNumber.trim())}
          className={`py-4 rounded-lg items-center mb-3 ${
            isProcessing || (paymentMethod === "mpesa" && !phoneNumber.trim())
              ? "bg-gray-300"
              : "bg-primary-700"
          }`}
          activeOpacity={0.8}
        >
          {isProcessing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white text-lg font-semibold">
              Pay KES {estimatedPrice.toLocaleString()}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCancel}
          disabled={isProcessing}
          className="border border-gray-300 py-4 rounded-lg items-center"
          activeOpacity={0.8}
        >
          <Text className="text-gray-700 text-base font-semibold">Cancel Move</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
