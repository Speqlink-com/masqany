/**
 * Video Feed module — TanStack Query hooks.
 * These are the only entry points for video feed data in the UI layer.
 */

import { queryClient } from "@/lib/query/client";
import { toast } from "@/lib/ui/toast";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { videoFeedApi } from "./api";
import type {
    ShareVideoParams,
    TrackVideoViewParams,
    VideoFeedResponse,
} from "./types";

// ---------------------------------------------------------------------------
// Query keys — centralized to avoid typos and enable targeted invalidation
// ---------------------------------------------------------------------------
export const videoFeedKeys = {
  all: ["video-feed"] as const,
  lists: () => [...videoFeedKeys.all, "list"] as const,
  list: (page: number) => [...videoFeedKeys.lists(), page] as const,
};

// ---------------------------------------------------------------------------
// Infinite query for video feed
// ---------------------------------------------------------------------------
export function useVideoFeed() {
  return useInfiniteQuery({
    queryKey: videoFeedKeys.lists(),
    queryFn: ({ pageParam = 1 }) =>
      videoFeedApi.getVideoFeed({ page: pageParam, pageSize: 10 }),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}

// ---------------------------------------------------------------------------
// Helper function to update video engagement in cached data
// ---------------------------------------------------------------------------
function updateVideoEngagement(
  oldData: any,
  videoId: string,
  isLiked: boolean
): any {
  if (!oldData?.pages) return oldData;

  return {
    ...oldData,
    pages: oldData.pages.map((page: VideoFeedResponse) => ({
      ...page,
      videos: page.videos.map((video) => {
        if (video.id === videoId) {
          return {
            ...video,
            engagement: {
              ...video.engagement,
              likes: isLiked
                ? video.engagement.likes - 1
                : video.engagement.likes + 1,
              isLiked: !isLiked,
            },
          };
        }
        return video;
      }),
    })),
  };
}

// ---------------------------------------------------------------------------
// Like video mutation with optimistic updates
// ---------------------------------------------------------------------------
export function useLikeVideo() {
  return useMutation({
    mutationFn: ({ videoId, isLiked }: { videoId: string; isLiked: boolean }) =>
      isLiked ? videoFeedApi.unlikeVideo(videoId) : videoFeedApi.likeVideo(videoId),
    onMutate: async ({ videoId, isLiked }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: videoFeedKeys.lists() });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(videoFeedKeys.lists());

      // Optimistically update to the new value
      queryClient.setQueryData(videoFeedKeys.lists(), (old: any) => {
        return updateVideoEngagement(old, videoId, isLiked);
      });

      // Return context with the previous data
      return { previousData };
    },
    onError: (err, variables, context) => {
      // Revert optimistic update on error
      if (context?.previousData) {
        queryClient.setQueryData(videoFeedKeys.lists(), context.previousData);
      }
      
      // Show error toast
      toast.error("Failed to update like. Please try again.");
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: videoFeedKeys.lists() });
    },
  });
}

// ---------------------------------------------------------------------------
// Share video mutation
// ---------------------------------------------------------------------------
export function useShareVideo() {
  return useMutation({
    mutationFn: (params: ShareVideoParams) => videoFeedApi.shareVideo(params),
    onSuccess: (_, variables) => {
      console.log(`Video ${variables.videoId} shared via ${variables.channel}`);
      toast.success("Video shared successfully!");
    },
    onError: () => {
      toast.error("Failed to share video. Please try again.");
    },
  });
}

// ---------------------------------------------------------------------------
// Download video mutation
// ---------------------------------------------------------------------------
export function useDownloadVideo() {
  return useMutation({
    mutationFn: (videoId: string) => videoFeedApi.downloadVideo(videoId),
    onSuccess: () => {
      toast.success("Video downloaded successfully!");
    },
    onError: (_, videoId) => {
      toast.errorWithRetry(
        "Failed to download video. Please try again.",
        () => {
          // Retry download
          videoFeedApi.downloadVideo(videoId);
        },
        "Download Failed"
      );
    },
  });
}

// ---------------------------------------------------------------------------
// Track video view mutation
// ---------------------------------------------------------------------------
export function useTrackVideoView() {
  return useMutation({
    mutationFn: (params: TrackVideoViewParams) =>
      videoFeedApi.trackVideoView(params),
  });
}
