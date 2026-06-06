/**
 * Video Feed store — Zustand slice for client-side video playback state.
 *
 * Owns: current video index, playback state, mute state, visible video IDs.
 * Does NOT own: server data like video feed data or engagement counts (TanStack Query owns those).
 *
 * This store manages UI state that changes on user interaction (scroll, tap, swipe).
 */

import { create } from "zustand";
import type { VideoFeedStore } from "./types";

// ---------------------------------------------------------------------------
// Video Feed Store — client state for video playback and UI
// ---------------------------------------------------------------------------

export const useVideoFeedStore = create<VideoFeedStore>((set, get) => ({
  // State
  currentVideoIndex: 0,
  isPlaying: true,
  isMuted: false,
  visibleVideoIds: [],

  // Actions
  setCurrentVideoIndex: (index) => set({ currentVideoIndex: index }),
  togglePlayback: () => set((state) => ({ isPlaying: !state.isPlaying })),
  pauseVideo: () => set({ isPlaying: false }),
  resumeVideo: () => set({ isPlaying: true }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setVisibleVideos: (ids) => set({ visibleVideoIds: ids }),
}));

// ---------------------------------------------------------------------------
// Selectors — use these to access state in components
// ---------------------------------------------------------------------------

/**
 * Get the currently active video ID
 */
export const selectCurrentVideo = (state: VideoFeedStore): string | null => {
  return state.visibleVideoIds[state.currentVideoIndex] ?? null;
};

/**
 * Check if a specific video is visible
 */
export const selectIsVideoVisible = (videoId: string) => (state: VideoFeedStore): boolean => {
  return state.visibleVideoIds.includes(videoId);
};
