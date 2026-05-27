/**
 * Home — Video Feed Module
 * 
 * vertical video feed for property discovery
 * This is the primary tenant home screen experience
 */

import { EmptyFeedState } from "@/components/video-feed/EmptyFeedState";
import { NoInternetConnection } from "@/components/video-feed/NoInternetConnection";
import { SkeletonLoader } from "@/components/video-feed/SkeletonLoader";
import { VideoFeedList } from "@/components/video-feed/VideoFeedList";
import { useNetworkStatus } from "@/lib/network/useNetworkStatus";
import {
  useDownloadVideo,
  useLikeVideo,
  useShareVideo,
  useVideoFeed,
} from "@/modules/video-feed";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback } from "react";
import { Alert, Linking, Platform, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ videoId?: string }>();
  const networkStatus = useNetworkStatus();
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, refetch } = useVideoFeed();

  // Mutation hooks for engagement actions
  const likeVideoMutation = useLikeVideo();
  const shareVideoMutation = useShareVideo();
  const downloadVideoMutation = useDownloadVideo();

  // Engagement callbacks
  const handleLike = useCallback(
    (videoId: string) => {
      try {
        // Get current like status from the video data
        const video = data?.pages
          .flatMap((page) => page.videos)
          .find((v) => v.id === videoId);
        
        if (video) {
          likeVideoMutation.mutate({
            videoId,
            isLiked: video.engagement.isLiked,
          });
        }
      } catch (error) {
        console.error("[HomeScreen] handleLike error:", error);
      }
    },
    [data, likeVideoMutation]
  );

  const handleShare = useCallback(
    (videoId: string) => {
      // Show share options
      Alert.alert(
        "Share Video",
        "Choose how you want to share this property video",
        [
          {
            text: "WhatsApp",
            onPress: () => {
              shareVideoMutation.mutate({ videoId, channel: "whatsapp" });
              // Open WhatsApp share (implementation depends on video URL)
              // Linking.openURL(`whatsapp://send?text=${videoUrl}`);
            },
          },
          {
            text: "SMS",
            onPress: () => {
              shareVideoMutation.mutate({ videoId, channel: "sms" });
              // Open SMS share
            },
          },
          {
            text: "Email",
            onPress: () => {
              shareVideoMutation.mutate({ videoId, channel: "email" });
              // Open email share
            },
          },
          {
            text: "Copy Link",
            onPress: () => {
              shareVideoMutation.mutate({ videoId, channel: "copy_link" });
              // Copy link to clipboard
              Alert.alert("Link Copied", "Video link copied to clipboard");
            },
          },
          {
            text: "Share to Masqany User",
            onPress: () => {
              shareVideoMutation.mutate({ videoId, channel: "masqany_user" });
              // TODO: Navigate to user selection screen when route exists
              // router.push("/share-to-user" as any);
              Alert.alert("Coming Soon", "Share to Masqany User feature coming soon!");
            },
          },
          { text: "Cancel", style: "cancel" },
        ]
      );
    },
    [shareVideoMutation]
  );

  const handleDownload = useCallback(
    async (videoId: string) => {
      // Request storage permission (implementation depends on platform)
      if (Platform.OS === "android") {
        // Request Android storage permission
        // const granted = await PermissionsAndroid.request(...);
        // if (!granted) return;
      }

      downloadVideoMutation.mutate(videoId);
    },
    [downloadVideoMutation]
  );

  const handleBookNow = useCallback(
    (propertyId: string) => {
      router.push({
        pathname: "/property/[propertyId]",
        params: { propertyId, focus: "payment" },
      } as never);
    },
    [router]
  );

  const handleViewListing = useCallback(
    (propertyId: string) => {
      router.push({
        pathname: "/property/[propertyId]",
        params: { propertyId },
      } as never);
    },
    [router]
  );

  const handleOwnerPress = useCallback(
    (ownerId: string) => {
      console.log("[HomeScreen] owner profile opened:", ownerId);
    },
    []
  );

  const handleLocationPress = useCallback(
    (coords: [number, number]) => {
      // Open map view with property location
      const [longitude, latitude] = coords;
      const url = Platform.select({
        ios: `maps:0,0?q=${latitude},${longitude}`,
        android: `geo:0,0?q=${latitude},${longitude}`,
      });
      if (url) {
        Linking.openURL(url);
      }
    },
    []
  );

  const handleSearchPress = useCallback(() => {
    router.push("/search" as never);
  }, [router]);

  const handleFilterPress = useCallback(() => {
    router.push({
      pathname: "/search",
      params: { openFilters: "1" },
    } as never);
  }, [router]);

  // Show no internet connection screen if network is unavailable
  if (!networkStatus.isConnected) {
    return (
      <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
        <StatusBar style="light" />
        <NoInternetConnection onRetry={refetch} />
      </SafeAreaView>
    );
  }

  // Show skeleton loader during initial load
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
        <StatusBar style="light" />
        <SkeletonLoader />
      </SafeAreaView>
    );
  }

  // Show error state
  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
        <StatusBar style="light" />
        <View className="flex-1 justify-center items-center p-6 bg-black">
          <Text className="font-bold text-xl text-white mb-3 text-center">
            Unable to Load Videos
          </Text>
          <Text className="font-normal text-base text-[#BDBDC0] text-center">
            {error?.message || "Something went wrong. Please try again."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Flatten paginated data
  const videos = data?.pages.flatMap((page) => page.videos) ?? [];

  // Show empty state if no videos available
  if (videos.length === 0 && !isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
        <StatusBar style="light" />
        <EmptyFeedState />
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      
      {/* Top Bar - Blue bar protecting status bar - Fixed position */}
      <View className="absolute top-0 left-0 right-0 h-[3.5%] bg-[#3fbdfd] z-50" />
      
      {/* Video Feed - Takes full screen */}
      <VideoFeedList
        videos={videos}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        isLoading={isLoading}
        hasMore={hasNextPage ?? false}
        onLike={handleLike}
        onShare={handleShare}
        onDownload={handleDownload}
        onBookNow={handleBookNow}
        onViewListing={handleViewListing}
        onOwnerPress={handleOwnerPress}
        onLocationPress={handleLocationPress}
        onSearchPress={handleSearchPress}
        onFilterPress={handleFilterPress}
        selectedVideoId={typeof params.videoId === "string" ? params.videoId : undefined}
      />
      
      {/* Bottom Bar - Blue bar covering entire tab bar area - Fixed position */}
      <View className="absolute bottom-0 left-0 right-0 h-[100px] bg-[#3fbdfd] z-50">
        <View className="h-[1px] bg-black" />
      </View>
    </View>
  );
}
