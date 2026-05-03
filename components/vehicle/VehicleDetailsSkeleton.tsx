/**
 * VehicleDetailsSkeleton Component
 * 
 * Loading skeleton for vehicle details screen
 * Uses NativeWind for styling
 */

import React from "react";
import { ScrollView, View } from "react-native";

export function VehicleDetailsSkeleton() {
  return (
    <ScrollView className="flex-1 bg-light-400">
      {/* Header Skeleton */}
      <View className="bg-light-300 h-32 mb-4" />

      <View className="px-5">
        {/* Title Skeleton */}
        <View className="bg-light-300 h-8 w-48 rounded mb-4" />

        {/* Info Section */}
        <View className="mb-6">
          {[1, 2, 3, 4, 5].map((index) => (
            <View key={index} className="mb-3">
              {/* Label */}
              <View className="bg-light-300 h-4 w-24 rounded mb-2" />
              {/* Value */}
              <View className="bg-light-300 h-6 w-full rounded" />
            </View>
          ))}
        </View>

        {/* Documents Section */}
        <View className="mb-6">
          <View className="bg-light-300 h-6 w-32 rounded mb-3" />
          <View className="flex-row gap-2">
            {[1, 2, 3].map((index) => (
              <View key={index} className="bg-light-300 h-24 w-24 rounded-lg" />
            ))}
          </View>
        </View>

        {/* Photos Section */}
        <View className="mb-6">
          <View className="bg-light-300 h-6 w-24 rounded mb-3" />
          <View className="flex-row flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <View key={index} className="bg-light-300 h-24 w-24 rounded-lg" />
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-2 mb-6">
          <View className="bg-light-300 h-12 flex-1 rounded-lg" />
          <View className="bg-light-300 h-12 flex-1 rounded-lg" />
        </View>
      </View>
    </ScrollView>
  );
}
