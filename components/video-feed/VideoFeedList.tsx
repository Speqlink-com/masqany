/**
 * VideoFeedList component — Virtualized container for infinite scrolling video feed
 * 
 * TikTok-style architecture:
 * - FlashList for recycling (not FlatList)
 * - Full-screen paging with snap
 * - Only ONE video plays at a time
 * - Preload window (±2 videos)
 * - Aggressive unloading outside window
 * - Scroll direction prediction
 */

import { useVideoFeedStore } from "@/modules/video-feed";
import type { PropertyVideo } from "@/modules/video-feed/types";
import { FlashList, type FlashListRef } from "@shopify/flash-list";
import { Image as ExpoImage } from "expo-image";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, ViewToken } from "react-native";
import { EndOfFeedState } from "./EndOfFeedState";
import { VideoFeedItem } from "./VideoFeedItem";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const PRELOAD_RANGE = 2; // Preload ±2 videos from current

function collectRemoteImageUrls(video: PropertyVideo): string[] {
  const imageUrls = [
    video.thumbnailUrl,
    video.owner.avatar,
    ...(video.propertyImages ?? []),
  ];

  return imageUrls.filter((source): source is string => typeof source === "string");
}

interface VideoFeedListProps {
  videos: PropertyVideo[];
  onEndReached: () => void;
  isLoading: boolean;
  hasMore: boolean;
  onLike: (videoId: string) => void;
  onShare: (videoId: string) => void;
  onDownload: (videoId: string) => void;
  onBookNow: (propertyId: string) => void;
  onViewListing: (propertyId: string) => void;
  onOwnerPress: (ownerId: string) => void;
  onLocationPress: (coords: [number, number]) => void;
  onSearchPress: () => void;
  onFilterPress: () => void;
  selectedVideoId?: string;
}

export function VideoFeedList({
  videos,
  onEndReached,
  isLoading,
  hasMore,
  onLike,
  onShare,
  onDownload,
  onBookNow,
  onViewListing,
  onOwnerPress,
  onLocationPress,
  onSearchPress,
  onFilterPress,
  selectedVideoId,
}: VideoFeedListProps) {
  const flashListRef = useRef<FlashListRef<PropertyVideo>>(null);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const lastScrollY = useRef(0);
  
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
    minimumViewTime: 100,
  }).current;

  // Zustand store
  const currentVideoIndex = useVideoFeedStore((state) => state.currentVideoIndex);
  const isMuted = useVideoFeedStore((state) => state.isMuted);
  const setCurrentVideoIndex = useVideoFeedStore((state) => state.setCurrentVideoIndex);
  const setVisibleVideos = useVideoFeedStore((state) => state.setVisibleVideos);
  const togglePlayback = useVideoFeedStore((state) => state.togglePlayback);
  const toggleMute = useVideoFeedStore((state) => state.toggleMute);

  const selectedVideoIndex = useMemo(
    () => videos.findIndex((video) => video.id === selectedVideoId),
    [selectedVideoId, videos]
  );

  useEffect(() => {
    if (selectedVideoIndex < 0) return;

    const scrollTimer = setTimeout(() => {
      setCurrentVideoIndex(selectedVideoIndex);
      flashListRef.current?.scrollToIndex({
        index: selectedVideoIndex,
        animated: false,
      });
    }, 120);

    return () => clearTimeout(scrollTimer);
  }, [selectedVideoIndex, setCurrentVideoIndex]);

  useEffect(() => {
    const preloadWindow = videos.slice(
      Math.max(0, currentVideoIndex - 1),
      Math.min(videos.length, currentVideoIndex + PRELOAD_RANGE + 1)
    );
    const urls = Array.from(new Set(preloadWindow.flatMap(collectRemoteImageUrls)));

    if (urls.length === 0) return;

    ExpoImage.prefetch(urls, { cachePolicy: "memory-disk" }).catch((error) => {
      console.warn("[VideoFeedList] Media prefetch skipped:", error);
    });
  }, [currentVideoIndex, videos]);

  // Handle viewable items changed - ONLY ONE VIDEO PLAYS
  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const visibleIds = viewableItems.map((item) => item.item.id);
        setVisibleVideos(visibleIds);

        // Set the FIRST visible item as the ONLY active video
        const firstVisibleIndex = viewableItems[0].index;
        if (firstVisibleIndex !== null && firstVisibleIndex !== currentVideoIndex) {
          setCurrentVideoIndex(firstVisibleIndex);
        }
      }
    },
    [currentVideoIndex, setCurrentVideoIndex, setVisibleVideos]
  );

  // Track scroll direction for predictive preloading
  const handleScroll = useCallback((event: any) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const direction = currentY > lastScrollY.current ? 'down' : 'up';
    if (direction !== scrollDirection) {
      setScrollDirection(direction);
    }
    lastScrollY.current = currentY;
  }, [scrollDirection]);

  // Determine video state: active, preload, or unload
  const getVideoState = useCallback((index: number) => {
    const distance = Math.abs(index - currentVideoIndex);
    
    if (index === currentVideoIndex) {
      return 'active'; // ONLY this video plays
    } else if (distance <= PRELOAD_RANGE) {
      return 'preload'; // Within preload window
    } else {
      return 'unload'; // Outside window - unload to save memory
    }
  }, [currentVideoIndex]);

  // Predictive preloading based on scroll direction
  const shouldPreload = useCallback((index: number) => {
    const state = getVideoState(index);
    if (state === 'unload') return false;
    if (state === 'active') return true;
    
    // Preload in scroll direction first
    if (scrollDirection === 'down') {
      return index > currentVideoIndex && index <= currentVideoIndex + PRELOAD_RANGE;
    } else {
      return index < currentVideoIndex && index >= currentVideoIndex - PRELOAD_RANGE;
    }
  }, [currentVideoIndex, scrollDirection, getVideoState]);

  // Stable keyExtractor
  const keyExtractor = useCallback((item: PropertyVideo) => item.id, []);

  // Memoized renderItem - CRITICAL: Must be stable to prevent re-renders
  const renderItem = useCallback(
    ({ item, index }: { item: PropertyVideo; index: number }) => {
      const videoState = getVideoState(index);
      const isActive = videoState === 'active'; // ONLY ONE
      const shouldPreloadVideo = shouldPreload(index);

      return (
        <VideoFeedItem
          video={item}
          isActive={isActive}
          shouldPreload={shouldPreloadVideo}
          isMuted={isMuted}
          onLike={onLike}
          onShare={onShare}
          onDownload={onDownload}
          onBookNow={onBookNow}
          onViewListing={onViewListing}
          onOwnerPress={onOwnerPress}
          onLocationPress={onLocationPress}
          onSearchPress={onSearchPress}
          onFilterPress={onFilterPress}
          onTogglePlayback={togglePlayback}
          onToggleMute={toggleMute}
        />
      );
    },
    [
      isMuted,
      getVideoState,
      shouldPreload,
      onLike,
      onShare,
      onDownload,
      onBookNow,
      onViewListing,
      onOwnerPress,
      onLocationPress,
      onSearchPress,
      onFilterPress,
      togglePlayback,
      toggleMute,
    ]
  );

  // Handle scroll to top
  const handleScrollToTop = useCallback(() => {
    flashListRef.current?.scrollToIndex({ index: 0, animated: true });
  }, []);

  // Render footer (end of feed state)
  const renderFooter = useCallback(() => {
    if (!hasMore && videos.length > 0) {
      return <EndOfFeedState onScrollToTop={handleScrollToTop} />;
    }
    return null;
  }, [hasMore, videos.length, handleScrollToTop]);

  return (
    <FlashList
      ref={flashListRef}
      data={videos}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      drawDistance={SCREEN_HEIGHT * 2}
      removeClippedSubviews
      onViewableItemsChanged={handleViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      // CRITICAL: Full-screen paging for TikTok effect
      pagingEnabled
      snapToInterval={SCREEN_HEIGHT}
      snapToAlignment="start"
      disableIntervalMomentum
      directionalLockEnabled
      decelerationRate="normal"
      showsVerticalScrollIndicator={false}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      onEndReached={hasMore ? onEndReached : undefined}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
    />
  );
}
