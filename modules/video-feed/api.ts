/**
 * Video Feed module — API bindings.
 * No component calls these directly; they are wrapped by hooks in hooks.ts.
 * 
 * NOTE: This is a MOCK implementation for development.
 * Uses mock data from assets/data/video-feed.ts with simulated network delay.
 */

import { mockVideoFeedData } from "@/assets/data/video-feed";
import type {
    DownloadVideoResponse,
    GetVideoFeedParams,
    ShareVideoParams,
    TrackVideoViewParams,
    VideoEngagement,
    VideoFeedResponse,
} from "./types";

// ---------------------------------------------------------------------------
// Mock API Helper — Simulates network delay
// ---------------------------------------------------------------------------

function simulateNetworkDelay(): Promise<void> {
  const delay = 500 + Math.random() * 500; // 500-1000ms
  return new Promise((resolve) => setTimeout(resolve, delay));
}

// ---------------------------------------------------------------------------
// Video Feed API — all HTTP calls for video feed operations
// ---------------------------------------------------------------------------

export const videoFeedApi = {
  /**
   * Get paginated video feed
   * MOCK: Returns data from mockVideoFeedData with simulated pagination
   */
  getVideoFeed: async (params: GetVideoFeedParams): Promise<VideoFeedResponse> => {
    await simulateNetworkDelay();
    
    const { page, pageSize } = params;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const videos = mockVideoFeedData.slice(start, end);
    
    return {
      videos,
      pagination: {
        page,
        pageSize,
        total: mockVideoFeedData.length,
        hasMore: end < mockVideoFeedData.length,
      },
    };
    
    // PRODUCTION: Uncomment when backend is ready
    // return apiClient
    //   .get<VideoFeedResponse>("/video-feed", { params })
    //   .then((r) => r.data);
  },

  /**
   * Like a video
   * MOCK: Returns updated engagement with incremented like count
   */
  likeVideo: async (videoId: string): Promise<VideoEngagement> => {
    await simulateNetworkDelay();
    
    const video = mockVideoFeedData.find((v) => v.id === videoId);
    if (!video) {
      throw new Error("Video not found");
    }
    
    return {
      ...video.engagement,
      likes: video.engagement.likes + 1,
      isLiked: true,
    };
    
    // PRODUCTION: Uncomment when backend is ready
    // return apiClient
    //   .post<VideoEngagement>(`/video-feed/${videoId}/like`)
    //   .then((r) => r.data);
  },

  /**
   * Unlike a video
   * MOCK: Returns updated engagement with decremented like count
   */
  unlikeVideo: async (videoId: string): Promise<VideoEngagement> => {
    await simulateNetworkDelay();
    
    const video = mockVideoFeedData.find((v) => v.id === videoId);
    if (!video) {
      throw new Error("Video not found");
    }
    
    return {
      ...video.engagement,
      likes: Math.max(0, video.engagement.likes - 1),
      isLiked: false,
    };
    
    // PRODUCTION: Uncomment when backend is ready
    // return apiClient
    //   .delete<VideoEngagement>(`/video-feed/${videoId}/like`)
    //   .then((r) => r.data);
  },

  /**
   * Share a video
   * MOCK: Simulates share action with delay
   */
  shareVideo: async (params: ShareVideoParams): Promise<void> => {
    await simulateNetworkDelay();
    
    const { videoId, channel } = params;
    console.log(`[MOCK] Sharing video ${videoId} via ${channel}`);
    
    // PRODUCTION: Uncomment when backend is ready
    // return apiClient
    //   .post<void>(`/video-feed/${videoId}/share`, { channel })
    //   .then((r) => r.data);
  },

  /**
   * Download a video
   * MOCK: Returns the video URL from mock data
   */
  downloadVideo: async (videoId: string): Promise<DownloadVideoResponse> => {
    await simulateNetworkDelay();
    
    const video = mockVideoFeedData.find((v) => v.id === videoId);
    if (!video) {
      throw new Error("Video not found");
    }
    
    return {
      downloadUrl: video.videoUrl,
    };
    
    // PRODUCTION: Uncomment when backend is ready
    // return apiClient
    //   .get<DownloadVideoResponse>(`/video-feed/${videoId}/download`)
    //   .then((r) => r.data);
  },

  /**
   * Track video view
   * MOCK: Logs view tracking to console
   */
  trackVideoView: async (params: TrackVideoViewParams): Promise<void> => {
    await simulateNetworkDelay();
    
    const { videoId, duration } = params;
    console.log(`[MOCK] Tracking view for video ${videoId}, duration: ${duration}s`);
    
    // PRODUCTION: Uncomment when backend is ready
    // return apiClient
    //   .post<void>(`/video-feed/${videoId}/view`, { duration })
    //   .then((r) => r.data);
  },
};
