/**
 * CTAButtons component — Filter, Book Now and View Listing action buttons
 * 
 * Features:
 * - Book Now: Blue background, rounded-full, positioned at bottom-right
 * - View Listing: Semi-transparent white, positioned at top-right
 * - Both have subtle shadows for depth
 * - Navigate to respective screens on tap
 */

import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface CTAButtonsProps {
  propertyId: string;
  onBookNow: (propertyId: string) => void;
  onViewListing: (propertyId: string) => void;
  onFilterPress: () => void;
}

export function CTAButtons({
  propertyId,
  onBookNow,
  onViewListing,
  onFilterPress,
}: CTAButtonsProps) {
  return (
    <>
      {/* Listing and Filter Buttons - Top Right */}
      <View className="absolute top-10 right-4 flex-row items-center gap-2">
        <TouchableOpacity
          onPress={() => onViewListing(propertyId)}
          className="bg-[#e1e6e8]/95 rounded-[22px] px-3 py-2 flex-row items-center"
          activeOpacity={0.78}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 8,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.7)",
          }}
        >
          <View className="w-8 h-8 rounded-full bg-[#3fbdfd] items-center justify-center mr-2">
            <Image
              source={require("@/assets/icons/view-listing-icon.png")}
              className="w-4 h-4"
              resizeMode="contain"
            />
          </View>
          <View>
            <Text className="text-black text-[12px] font-bold">View Listing</Text>
            <Text className="text-black/60 text-[10px] font-medium">
              Details • Units
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onFilterPress}
          activeOpacity={0.78}
          className="bg-[#e1e6e8]/95 rounded-[22px] px-3 py-2 flex-row items-center"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 8,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.7)",
          }}
        >
          <View className="w-8 h-8 rounded-full bg-[#3fbdfd] items-center justify-center">
            <Image
              source={require("@/assets/icons/filter.png")}
              className="w-4 h-4"
              resizeMode="contain"
              style={{ tintColor: "#FFFFFF" }}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Book Now Button - Above bottom bar */}
      <View className="absolute bottom-10 right-4">
        <TouchableOpacity
          onPress={() => onBookNow(propertyId)}
          className="bg-[#20A6FD] px-6 py-3 rounded-full"
          activeOpacity={0.8}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Text className="text-white text-[15px] font-semibold">Book Now</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
