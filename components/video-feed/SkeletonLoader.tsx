/**
 * SkeletonLoader component — Loading state with animated Masqany agent icon
 * 
 * Features:
 * - Full-screen placeholder during initial load
 * - Masqany agent icon with smooth rotation animation
 * - Uses React Native Reanimated for UI thread animations
 */

import React, { useEffect } from "react";
import { Image, View } from "react-native";
import Reanimated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

export function SkeletonLoader() {
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Start rotation animation
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1, // Infinite repeat
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View className="flex-1 bg-black items-center justify-center">
      <Reanimated.View style={animatedStyle}>
        <Image
          source={require("@/assets/icons/masqany-agent.webp")}
          className="w-24 h-24"
          resizeMode="contain"
        />
      </Reanimated.View>
    </View>
  );
}
