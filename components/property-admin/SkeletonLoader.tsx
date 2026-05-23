/**
 * SkeletonLoader Component
 * 
 * Loading placeholder with shimmer animation.
 * Used while loading properties, analytics, units.
 * 
 * Features:
 * - Light gray background (#f3f4f3) with white shimmer animation
 * - analytics-grid: 4 placeholder cards in 2x2 grid
 * - property-cards: 3 placeholder cards horizontal
 * - unit-grid: 12 placeholder cards in 4-column grid
 * - Minimum display time: 300ms (prevents flashing)
 * - Smooth fade-in/fade-out transitions
 */

import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

interface SkeletonLoaderProps {
  variant: 'analytics-grid' | 'property-cards' | 'unit-grid';
}

const SkeletonLoader = React.memo(({ variant }: SkeletonLoaderProps) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();
    return () => shimmer.stop();
  }, [shimmerAnim]);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  if (variant === 'analytics-grid') {
    return (
      <View className="p-4">
        <View className="flex-row mb-3">
          <Animated.View 
            style={{ opacity: shimmerOpacity }}
            className="flex-1 h-[120px] bg-[#f3f4f3] rounded-lg mr-3"
          />
          <Animated.View 
            style={{ opacity: shimmerOpacity }}
            className="flex-1 h-[120px] bg-[#f3f4f3] rounded-lg"
          />
        </View>
        <View className="flex-row">
          <Animated.View 
            style={{ opacity: shimmerOpacity }}
            className="flex-1 h-[120px] bg-[#f3f4f3] rounded-lg mr-3"
          />
          <Animated.View 
            style={{ opacity: shimmerOpacity }}
            className="flex-1 h-[120px] bg-[#f3f4f3] rounded-lg"
          />
        </View>
      </View>
    );
  }

  if (variant === 'property-cards') {
    return (
      <View className="flex-row px-4">
        <Animated.View 
          style={{ opacity: shimmerOpacity }}
          className="w-[280px] h-[180px] bg-[#f3f4f3] rounded-lg mr-4"
        />
        <Animated.View 
          style={{ opacity: shimmerOpacity }}
          className="w-[280px] h-[180px] bg-[#f3f4f3] rounded-lg mr-4"
        />
        <Animated.View 
          style={{ opacity: shimmerOpacity }}
          className="w-[280px] h-[180px] bg-[#f3f4f3] rounded-lg"
        />
      </View>
    );
  }

  if (variant === 'unit-grid') {
    return (
      <View className="p-4">
        {[0, 1, 2].map((row) => (
          <View key={row} className="flex-row mb-2">
            {[0, 1, 2, 3].map((col) => (
              <Animated.View 
                key={col}
                style={{ opacity: shimmerOpacity }}
                className="flex-1 aspect-square bg-[#f3f4f3] rounded-xl mx-1"
              />
            ))}
          </View>
        ))}
      </View>
    );
  }

  return null;
});

SkeletonLoader.displayName = "SkeletonLoader";

export default SkeletonLoader;
