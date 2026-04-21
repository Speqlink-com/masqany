/**
 * UI store — Zustand slice for ephemeral client-side UI state.
 *
 * Owns: feed video playback state, modal visibility, active filters,
 * map viewport, bottom sheet state, and other transient UI concerns.
 *
 * Rule: if it comes from the server, it belongs in TanStack Query.
 *       If it's purely a UI concern, it belongs here.
 */

import { create } from "zustand";

// ---------------------------------------------------------------------------
// Feed / video playback state (TikTok-style property feed)
// ---------------------------------------------------------------------------
interface FeedState {
  activeVideoId: string | null;
  isMuted: boolean;
  setActiveVideo: (id: string | null) => void;
  toggleMute: () => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  activeVideoId: null,
  isMuted: false,
  setActiveVideo: (id) => set({ activeVideoId: id }),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
}));

// ---------------------------------------------------------------------------
// Search / filter state
// ---------------------------------------------------------------------------
interface SearchState {
  query: string;
  activeCategory: string;
  priceRange: [number, number] | null;
  setQuery: (q: string) => void;
  setCategory: (cat: string) => void;
  setPriceRange: (range: [number, number] | null) => void;
  resetFilters: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: "",
  activeCategory: "All",
  priceRange: null,
  setQuery: (query) => set({ query }),
  setCategory: (activeCategory) => set({ activeCategory }),
  setPriceRange: (priceRange) => set({ priceRange }),
  resetFilters: () =>
    set({ query: "", activeCategory: "All", priceRange: null }),
}));

// ---------------------------------------------------------------------------
// Map viewport state
// ---------------------------------------------------------------------------
interface MapState {
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  setRegion: (region: MapState["region"]) => void;
}

// Default center: Nairobi, Kenya
export const useMapStore = create<MapState>((set) => ({
  region: {
    latitude: -1.2921,
    longitude: 36.8219,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  setRegion: (region) => set({ region }),
}));
