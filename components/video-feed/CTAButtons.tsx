/**
 * CTAButtons component — Book Now and View Listing action buttons
 * 
 * Features:
 * - Book Now: Blue background, rounded-full, positioned at bottom-right
 * - View Listing: Semi-transparent white, positioned at top-right
 * - Both have subtle shadows for depth
 * - Navigate to respective screens on tap
 */

import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface CTAButtonsProps {
  propertyId: string;
  onBookNow: (propertyId: string) => void;
  onViewListing: (propertyId: string) => void;
}

export function CTAButtons({ propertyId, onBookNow, onViewListing }: CTAButtonsProps) {
  return (
    <>
      {/* View Listing Button - Top Right */}
      <View className="absolute top-10 right-4">
        <TouchableOpacity
          onPress={() => onViewListing(propertyId)}
          className="bg-white/30 px-4 py-2 rounded-[20px]"
          activeOpacity={0.7}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Text className="text-white text-[13px] font-medium">View Listing</Text>
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
