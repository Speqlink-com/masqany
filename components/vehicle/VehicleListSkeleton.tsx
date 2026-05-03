/**
 * VehicleListSkeleton Component
 * 
 * Loading skeleton for vehicle list
 * Uses NativeWind for styling
 */

import React from "react";
import { View } from "react-native";

export function VehicleListSkeleton() {
  return (
    <View className="px-5 py-4">
      {/* Render 3 skeleton cards */}
      {[1, 2, 3].map((index) => (
        <View
          key={index}
          className="bg-light-400 rounded-lg p-4 mb-3 border border-light-200"
        >
          {/* Header Row */}
          <View className="flex-row items-center justify-between mb-3">
            {/* Plate Number Skeleton */}
            <View className="bg-light-300 h-6 w-24 rounded" />
            {/* Status Badge Skeleton */}
            <View className="bg-light-300 h-6 w-20 rounded-full" />
          </View>

          {/* Info Row */}
          <View className="flex-row items-center justify-between">
            {/* Vehicle Type Skeleton */}
            <View className="bg-light-300 h-4 w-16 rounded" />
            {/* Verification Badge Skeleton */}
            <View className="bg-light-300 h-4 w-16 rounded" />
          </View>
        </View>
      ))}
    </View>
  );
}
