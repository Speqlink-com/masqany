/**
 * PropertyOwnerProfile component — Display property owner with verification badge
 * 
 * Features:
 * - Circular avatar (44x44px)
 * - Owner name below avatar (truncated with ellipsis)
 * - Verified badge overlay (bottom-right, 16x16px)
 * - Positioned 20% from top of screen
 * - Tappable to navigate to owner profile screen
 */

import type { PropertyOwner } from "@/modules/video-feed/types";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface PropertyOwnerProfileProps {
  owner: PropertyOwner;
  onPress: (ownerId: string) => void;
}

export function PropertyOwnerProfile({ owner, onPress }: PropertyOwnerProfileProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress(owner.id)}
      className="items-center"
      activeOpacity={0.7}
    >
      {/* Avatar with Verified Badge */}
      <View className="relative">
        <Image
          source={{ uri: owner.avatar }}
          className="w-11 h-11 rounded-full border-2 border-white"
        />
        
        {/* Verified Badge */}
        <View className="absolute -bottom-0.5 -right-0.5">
          <Image
            source={require("@/assets/icons/verified-check-icon.webp")}
            className="w-4 h-4"
          />
        </View>
      </View>

      {/* Owner Name */}
      <Text
        className="text-white text-[13px] font-semibold mt-1 max-w-[60px]"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {owner.name}
      </Text>
    </TouchableOpacity>
  );
}
