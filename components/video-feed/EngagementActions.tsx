/**
 * EngagementActions component — Like, share, download action buttons
 * 
 * Features:
 * - Vertical stack with 24px spacing
 * - Icon + count below each action
 * - Like animation: scale 1.0 → 1.3 → 1.0 (300ms)
 * - Optimistic updates for like action
 * - Share sheet integration
 * - Download with progress indicator
 */

import { formatCount } from "@/assets/data/video-feed";
import type { VideoEngagement } from "@/modules/video-feed/types";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface EngagementActionsProps {
  engagement: VideoEngagement;
  onLike: () => void;
  onShare: () => void;
  onDownload: () => void;
}

export function EngagementActions({
  engagement,
  onLike,
  onShare,
  onDownload,
}: EngagementActionsProps) {
  // Animated value for like button
  const likeScale = useSharedValue(1);

  const likeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: likeScale.value }],
  }));

  const handleLike = () => {
    // Trigger animation
    likeScale.value = withSequence(
      withTiming(1.3, { duration: 150 }),
      withTiming(1.0, { duration: 150 })
    );

    onLike();
  };

  return (
    <View className="items-center space-y-10">
      {/* Like Action */}
      <TouchableOpacity
        onPress={handleLike}
        className="items-center"
        activeOpacity={0.7}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Reanimated.View style={likeAnimatedStyle}>
          <Image
            source={require("@/assets/icons/like.png")}
            className="w-9 h-9"
            resizeMode="contain"
            style={{
              tintColor: engagement.isLiked ? "#20A6FD" : "#FFFFFF",
            }}
          />
        </Reanimated.View>
        <Text className="text-white text-[13px] font-semibold mt-1">
          {formatCount(engagement.likes)}
        </Text>
      </TouchableOpacity>

      {/* Share Action */}
      <TouchableOpacity
        onPress={onShare}
        className="items-center"
        activeOpacity={0.7}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Image
          source={require("@/assets/icons/share.png")}
          className="w-9 h-9"
          resizeMode="contain"
          style={{ tintColor: "#FFFFFF" }}
        />
        <Text className="text-white text-[13px] font-semibold mt-1">
          {formatCount(engagement.shares)}
        </Text>
      </TouchableOpacity>

      {/* Download Action */}
      <TouchableOpacity
        onPress={onDownload}
        className="items-center"
        activeOpacity={0.7}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Image
          source={require("@/assets/icons/download.png")}
          className="w-9 h-9"
          resizeMode="contain"
          
        />
        <Text className="text-white text-[13px] font-semibold mt-1">
          {formatCount(engagement.downloads)}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
