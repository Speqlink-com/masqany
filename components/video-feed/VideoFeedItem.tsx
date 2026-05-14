/**
 * VideoFeedItem component — Individual video card with player and overlay
 * 
 * TikTok-style architecture:
 * - Video layer (absolute positioned)
 * - Overlay layer (separate, independent)
 * - Aggressive memoization
 * - Only renders when necessary
 */

import type { PropertyVideo } from "@/modules/video-feed/types";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { VideoOverlay } from "./VideoOverlay";
import { VideoPlayer } from "./VideoPlayer";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface VideoFeedItemProps {
  video: PropertyVideo;
  isActive: boolean; // ONLY ONE video is active
  shouldPreload: boolean; // Should this video be preloaded?
  isMuted: boolean;
  onLike: (videoId: string) => void;
  onShare: (videoId: string) => void;
  onDownload: (videoId: string) => void;
  onBookNow: (propertyId: string) => void;
  onViewListing: (propertyId: string) => void;
  onOwnerPress: (ownerId: string) => void;
  onLocationPress: (coords: [number, number]) => void;
  onSearchPress: () => void;
  onTogglePlayback: () => void;
  onToggleMute: () => void;
}

function VideoFeedItemComponent({
  video,
  isActive,
  shouldPreload,
  isMuted,
  onLike,
  onShare,
  onDownload,
  onBookNow,
  onViewListing,
  onOwnerPress,
  onLocationPress,
  onSearchPress,
  onTogglePlayback,
  onToggleMute,
}: VideoFeedItemProps) {
  return (
    <View style={styles.container}>
      {/* VIDEO LAYER - Absolute positioned, fills entire space */}
      <VideoPlayer
        videoUrl={video.videoUrl}
        thumbnailUrl={video.thumbnailUrl}
        isActive={isActive}
        shouldPreload={shouldPreload}
        isMuted={isMuted}
        onTogglePlayback={onTogglePlayback}
        onToggleMute={onToggleMute}
        onLike={() => onLike(video.id)}
      />

      {/* UI LAYER - Overlay, rendered independently */}
      <VideoOverlay
        video={video}
        onSearchPress={onSearchPress}
        onOwnerPress={onOwnerPress}
        onLike={() => onLike(video.id)}
        onShare={() => onShare(video.id)}
        onDownload={() => onDownload(video.id)}
        onLocationPress={onLocationPress}
        onBookNow={onBookNow}
        onViewListing={onViewListing}
      />
    </View>
  );
}

// AGGRESSIVE MEMOIZATION - Only re-render when these specific props change
export const VideoFeedItem = React.memo(
  VideoFeedItemComponent,
  (prev, next) => {
    return (
      prev.video.id === next.video.id &&
      prev.isActive === next.isActive &&
      prev.shouldPreload === next.shouldPreload &&
      prev.isMuted === next.isMuted &&
      prev.video.engagement.isLiked === next.video.engagement.isLiked &&
      prev.video.engagement.likes === next.video.engagement.likes
    );
  }
);

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: '#000000',
  },
});
