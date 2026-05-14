/**
 * VideoOverlay component — Composes all overlay elements
 * 
 * Features:
 * - Search icon at top-left
 * - Property owner profile on right side (20% from top)
 * - Engagement actions below owner profile
 * - Property info at bottom
 * - CTA buttons (Book Now, View Listing)
 * - All elements have drop shadows for visibility
 */

import type { PropertyVideo } from "@/modules/video-feed/types";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { CTAButtons } from "./CTAButtons";
import { EngagementActions } from "./EngagementActions";
import { PropertyInfo } from "./PropertyInfo";
import { PropertyOwnerProfile } from "./PropertyOwnerProfile";

interface VideoOverlayProps {
  video: PropertyVideo;
  onSearchPress: () => void;
  onOwnerPress: (ownerId: string) => void;
  onLike: () => void;
  onShare: () => void;
  onDownload: () => void;
  onLocationPress: (coords: [number, number]) => void;
  onBookNow: (propertyId: string) => void;
  onViewListing: (propertyId: string) => void;
}

export function VideoOverlay({
  video,
  onSearchPress,
  onOwnerPress,
  onLike,
  onShare,
  onDownload,
  onLocationPress,
  onBookNow,
  onViewListing,
}: VideoOverlayProps) {
  return (
    <View className="absolute inset-0 pointer-events-box-none">
      {/* Search Icon - Top Left (same level as View Listing at top-10) */}
      <View className="absolute top-10 left-4 pointer-events-auto">
        <TouchableOpacity
          onPress={onSearchPress}
          className="bg-black/40 rounded-full p-2"
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
            source={require("@/assets/icons/search.png")}
            className="w-6 h-6"
            resizeMode="contain"
            style={{ tintColor: "#FFFFFF" }}
          />
        </TouchableOpacity>
      </View>

      {/* Right Side - Owner Profile and Engagement Actions (lowered) */}
      <View
        className="absolute right-4 pointer-events-auto"
        style={{ bottom: "35%" }}
      >
        <View className="items-center space-y-6">
          {/* Property Owner Profile */}
          <PropertyOwnerProfile owner={video.owner} onPress={onOwnerPress} />

          {/* Engagement Actions */}
          <EngagementActions
            engagement={video.engagement}
            onLike={onLike}
            onShare={onShare}
            onDownload={onDownload}
          />
        </View>
      </View>

      {/* Bottom - Property Info (positioned after download icon with gap) */}
      <View className="absolute bottom-0 left-0 right-0 pointer-events-auto">
        <PropertyInfo property={video} onLocationPress={onLocationPress} />
      </View>

      {/* CTA Buttons */}
      <View className="pointer-events-auto">
        <CTAButtons
          propertyId={video.id}
          onBookNow={onBookNow}
          onViewListing={onViewListing}
        />
      </View>
    </View>
  );
}
