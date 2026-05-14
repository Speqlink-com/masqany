/**
 * Video Feed module — TypeScript type definitions.
 * All video feed-related interfaces and types.
 */

// ---------------------------------------------------------------------------
// Property Video Types
// ---------------------------------------------------------------------------

export type PropertyType = 
  | "bedsitter" 
  | "1BR" 
  | "2BR" 
  | "3BR" 
  | "4BR+" 
  | "studio" 
  | "penthouse";

export type UnitStatus = "vacant" | "soon_vacant";

export type PriceUnit = "month" | "night";

// ---------------------------------------------------------------------------
// Video Engagement Interface
// ---------------------------------------------------------------------------

export interface VideoEngagement {
  likes: number;
  shares: number;
  downloads: number;
  views: number;
  isLiked: boolean; // Current user's like status
  isShared: boolean;
  isDownloaded: boolean;
}

// ---------------------------------------------------------------------------
// Property Owner Interface
// ---------------------------------------------------------------------------

export interface PropertyOwner {
  id: string;
  name: string;
  avatar: string;
  isVerified: boolean;
}

// ---------------------------------------------------------------------------
// Property Location Interface
// ---------------------------------------------------------------------------

export interface PropertyLocation {
  estate: string;
  county: string;
  coordinates: [number, number]; // [longitude, latitude]
}

// ---------------------------------------------------------------------------
// Property Video Interface
// ---------------------------------------------------------------------------

export interface PropertyVideo {
  id: string;
  videoUrl: string | number; // string for URLs, number for require() assets
  thumbnailUrl: string;
  
  // Property Information
  title: string;
  description: string;
  propertyType: PropertyType;
  
  // Pricing
  price: number;
  priceUnit: PriceUnit;
  
  // Location
  location: PropertyLocation;
  
  // Availability
  unitStatus: UnitStatus;
  availableDate?: string; // ISO date string
  isNew?: boolean; // Brand new property listing
  
  // Property Owner
  owner: PropertyOwner;
  
  // Engagement
  engagement: VideoEngagement;
  
  // Property Details
  bedrooms: number;
  bathrooms: number;
  size?: number; // square feet
  amenities: string[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Video Feed Response Interface
// ---------------------------------------------------------------------------

export interface VideoFeedPagination {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

export interface VideoFeedResponse {
  videos: PropertyVideo[];
  pagination: VideoFeedPagination;
}

// ---------------------------------------------------------------------------
// Video Feed Store Interface (Zustand)
// ---------------------------------------------------------------------------

export interface VideoFeedStore {
  // State
  currentVideoIndex: number;
  isPlaying: boolean;
  isMuted: boolean;
  visibleVideoIds: string[];
  
  // Actions
  setCurrentVideoIndex: (index: number) => void;
  togglePlayback: () => void;
  toggleMute: () => void;
  setVisibleVideos: (ids: string[]) => void;
}

// ---------------------------------------------------------------------------
// API Request/Response Types
// ---------------------------------------------------------------------------

export interface GetVideoFeedParams {
  page: number;
  pageSize: number;
}

export interface ShareVideoParams {
  videoId: string;
  channel: "whatsapp" | "sms" | "email" | "copy_link" | "masqany_user";
}

export interface TrackVideoViewParams {
  videoId: string;
  duration: number; // seconds
}

export interface DownloadVideoResponse {
  downloadUrl: string;
}
