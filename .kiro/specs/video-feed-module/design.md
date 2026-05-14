# Video Feed Module - Design Document

## Overview

The Video Feed Module implements a TikTok-style vertical video feed for property discovery, serving as the primary tenant home screen experience. The module delivers a full-screen, immersive video browsing experience with infinite scrolling, auto-playing videos, and rich property information overlays.

### Key Design Goals

1. **Performance First**: Achieve 60fps scrolling with <60MB memory usage through aggressive virtualization and lifecycle management
2. **Immersive Experience**: Full-screen video with minimal UI chrome, gesture-driven navigation
3. **Engagement**: Rich interaction layer (like, share, download, book) without disrupting video playback
4. **Scalability**: Handle 100+ videos in feed without performance degradation
5. **Offline Resilience**: Graceful degradation with cached content and clear network status feedback

### Technical Stack

- **Virtualization**: Shopify FlashList for efficient list rendering
- **Animations**: React Native Reanimated (UI thread animations)
- **Gestures**: React Native Gesture Handler (smooth swipe interactions)
- **Video**: Expo AV with HLS/DASH adaptive streaming
- **Server State**: TanStack Query (video feed data, engagement actions)
- **Client State**: Zustand (playback state, current video index, UI toggles)
- **Networking**: Single Axios instance from lib/api/client.ts

## Architecture

### Module Structure

Following the Masqany module pattern:

```
modules/video-feed/
  ├── types.ts       # TypeScript interfaces (PropertyVideo, VideoEngagement, etc.)
  ├── api.ts         # API bindings (getVideoFeed, likeVideo, shareVideo, etc.)
  ├── hooks.ts       # TanStack Query hooks (useVideoFeed, useLikeVideo, etc.)
  ├── store.ts       # Zustand client state (playback, current index, visibility)
  └── index.ts       # Public API re-exports
```

### State Management Architecture

**Two-Layer State Separation**:

| Layer | Owner | Responsibilities |
|---|---|---|
| **Server State** | TanStack Query | Video feed data, engagement counts, property details, pagination |
| **Client State** | Zustand | Current video index, playback state (playing/paused), mute state, visible video IDs |

**Why This Separation?**
- Server state changes when backend data updates (new videos, like counts)
- Client state changes on user interaction (scroll, tap, swipe)
- Never mix: a component imports from both when it needs both

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        Home Screen                           │
│                     (app/(tabs)/home.tsx)                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ├─────────────────┐
                     │                 │
                     ▼                 ▼
         ┌──────────────────┐  ┌──────────────────┐
         │  TanStack Query  │  │  Zustand Store   │
         │  (Server State)  │  │ (Client State)   │
         └────────┬─────────┘  └────────┬─────────┘
                  │                     │
                  │                     │
         ┌────────▼─────────┐  ┌────────▼─────────┐
         │ useVideoFeed()   │  │ currentVideoIndex│
         │ useLikeVideo()   │  │ isPlaying        │
         │ useShareVideo()  │  │ isMuted          │
         │ useDownloadVideo │  │ visibleVideoIds  │
         └──────────────────┘  └──────────────────┘
                  │                     │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌──────────────────┐
                  │   VideoFeedList  │
                  │   (FlashList)    │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │  VideoFeedItem   │
                  │  (Memoized)      │
                  └────────┬─────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
      ┌──────────┐  ┌──────────┐  ┌──────────┐
      │  Video   │  │ Overlay  │  │ Actions  │
      │ Player   │  │  Info    │  │  Panel   │
      └──────────┘  └──────────┘  └──────────┘
```

## Components and Interfaces

### Component Hierarchy

```
HomeScreen (app/(tabs)/home.tsx)
├── SafeAreaView (top/bottom bars)
├── VideoFeedList (FlashList container)
│   └── VideoFeedItem (per video, memoized)
│       ├── VideoPlayer (Expo AV)
│       ├── VideoOverlay
│       │   ├── TopBar (search icon)
│       │   ├── PropertyOwnerProfile
│       │   ├── EngagementActions (like, share, download)
│       │   ├── PropertyInfo (title, status, location, price)
│       │   └── CTAButtons (Book Now, View Listing)
│       └── VideoControls (play/pause, mute, zoom)
└── SkeletonLoader (loading state)
```

### Core Components

#### 1. VideoFeedList

**Purpose**: Virtualized container for infinite scrolling video feed

**Props**:
```typescript
interface VideoFeedListProps {
  videos: PropertyVideo[];
  onEndReached: () => void;
  onViewableItemsChanged: (info: ViewableItemsChangedInfo) => void;
  isLoading: boolean;
  hasMore: boolean;
}
```

**Key Features**:
- Uses FlashList for virtualization
- Implements `onViewableItemsChanged` with 80% threshold
- Handles pagination via `onEndReached`
- Vertical scrolling with snap-to-item behavior
- Stable `keyExtractor` using video ID

**Performance Optimizations**:
- `estimatedItemSize` set to screen height
- `drawDistance` limited to 2 items above/below
- `removeClippedSubviews={true}`
- Memoized `renderItem` callback

#### 2. VideoFeedItem

**Purpose**: Individual video card with player and overlay

**Props**:
```typescript
interface VideoFeedItemProps {
  video: PropertyVideo;
  isVisible: boolean;
  isActive: boolean;
  onLike: (videoId: string) => void;
  onShare: (videoId: string) => void;
  onDownload: (videoId: string) => void;
  onBookNow: (propertyId: string) => void;
  onViewListing: (propertyId: string) => void;
}
```

**Lifecycle Management**:
- `isVisible`: Video is in viewport (80% threshold)
- `isActive`: Video is the currently playing video
- Auto-play when `isActive` becomes true
- Pause when `isActive` becomes false
- Unload video when more than 3 positions away

**Memoization Strategy**:
```typescript
export const VideoFeedItem = React.memo(
  VideoFeedItemComponent,
  (prev, next) => {
    return (
      prev.video.id === next.video.id &&
      prev.isVisible === next.isVisible &&
      prev.isActive === next.isActive &&
      prev.video.engagement.isLiked === next.video.engagement.isLiked &&
      prev.video.engagement.likes === next.video.engagement.likes
    );
  }
);
```

#### 3. VideoPlayer

**Purpose**: Expo AV video player with lifecycle management

**Props**:
```typescript
interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl: string;
  isActive: boolean;
  isMuted: boolean;
  onPlaybackStatusUpdate: (status: AVPlaybackStatus) => void;
  onLoad: () => void;
  onError: (error: string) => void;
}
```

**Features**:
- HLS/DASH adaptive streaming support
- Thumbnail preloading before video
- Automatic loop on completion
- Pinch-to-zoom gesture support
- Aspect ratio preservation (9:16)
- Buffering indicator overlay

**Video Lifecycle**:
```typescript
useEffect(() => {
  if (isActive) {
    videoRef.current?.playAsync();
  } else {
    videoRef.current?.pauseAsync();
  }
}, [isActive]);

useEffect(() => {
  if (shouldUnload) {
    videoRef.current?.unloadAsync();
  }
}, [shouldUnload]);
```

#### 4. VideoOverlay

**Purpose**: Semi-transparent UI layer with property info and actions

**Structure**:
- Top bar: Search icon (top-left)
- Right side: Owner profile + engagement actions
- Bottom: Property info + CTAs
- All elements have drop shadows for visibility

**Interaction Zones**:
- Center tap: Play/pause toggle
- Volume icon tap: Mute/unmute
- Pinch gesture: Zoom in/out
- Swipe up/down: Navigate videos

#### 5. PropertyOwnerProfile

**Purpose**: Display property owner with verification badge

**Props**:
```typescript
interface PropertyOwnerProfileProps {
  owner: {
    id: string;
    name: string;
    avatar: string;
    isVerified: boolean;
  };
  onPress: (ownerId: string) => void;
}
```

**Layout**:
- Circular avatar (44x44px)
- Owner name below (truncated with ellipsis)
- Verified badge overlay (bottom-right, 16x16px)
- Positioned 20% from top of screen

#### 6. EngagementActions

**Purpose**: Like, share, download action buttons

**Props**:
```typescript
interface EngagementActionsProps {
  engagement: VideoEngagement;
  onLike: () => void;
  onShare: () => void;
  onDownload: () => void;
}
```

**Features**:
- Vertical stack with 24px spacing
- Icon + count below each action
- Like animation: scale 1.0 → 1.3 → 1.0 (300ms)
- Optimistic updates for like action
- Share sheet integration (WhatsApp, SMS, Email, Copy Link)
- Download with progress indicator

#### 7. PropertyInfo

**Purpose**: Display property details with expandable description

**Props**:
```typescript
interface PropertyInfoProps {
  property: {
    title: string;
    description: string;
    propertyType: string;
    unitStatus: 'vacant' | 'soon_vacant';
    availableDate?: string;
    location: { estate: string; county: string };
    price: number;
    priceUnit: 'month' | 'night';
  };
  onLocationPress: (coords: [number, number]) => void;
  onExpandDescription: () => void;
}
```

**Layout**:
- Semi-transparent black background (rgba(0,0,0,0.6))
- Property name with "...more" suffix (2 lines max)
- Unit status badge (green for vacant, yellow for soon vacant)
- Location badge with icon (tappable to open map)
- Property type with house icon
- Price prominently displayed

#### 8. SkeletonLoader

**Purpose**: Loading state with animated Masqany agent icon

**Features**:
- Full-screen placeholder
- Masqany agent icon (assets/icons/masqany-agent.webp)
- Smooth rotation or pulse animation
- Displayed during initial load and pagination

## Data Models

### PropertyVideo Interface

```typescript
interface PropertyVideo {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  
  // Property Information
  title: string;
  description: string;
  propertyType: 'bedsitter' | '1BR' | '2BR' | '3BR' | '4BR+' | 'studio' | 'penthouse';
  
  // Pricing
  price: number;
  priceUnit: 'month' | 'night';
  
  // Location
  location: {
    estate: string;
    county: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  
  // Availability
  unitStatus: 'vacant' | 'soon_vacant';
  availableDate?: string; // ISO date string
  
  // Property Owner
  owner: {
    id: string;
    name: string;
    avatar: string;
    isVerified: boolean;
  };
  
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
```

### VideoEngagement Interface

```typescript
interface VideoEngagement {
  likes: number;
  shares: number;
  downloads: number;
  views: number;
  isLiked: boolean; // Current user's like status
  isShared: boolean;
  isDownloaded: boolean;
}
```

### VideoFeedResponse Interface

```typescript
interface VideoFeedResponse {
  videos: PropertyVideo[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
  };
}
```

### VideoFeedStore Interface

```typescript
interface VideoFeedStore {
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
  
  // Selectors
  getCurrentVideo: () => string | null;
  isVideoVisible: (id: string) => boolean;
}
```

## API Integration

### Module API (modules/video-feed/api.ts)

```typescript
export const videoFeedApi = {
  /**
   * Get paginated video feed
   */
  getVideoFeed: (params: { page: number; pageSize: number }) =>
    apiClient
      .get<VideoFeedResponse>('/video-feed', { params })
      .then((r) => r.data),
  
  /**
   * Like a video
   */
  likeVideo: (videoId: string) =>
    apiClient
      .post<VideoEngagement>(`/video-feed/${videoId}/like`)
      .then((r) => r.data),
  
  /**
   * Unlike a video
   */
  unlikeVideo: (videoId: string) =>
    apiClient
      .delete<VideoEngagement>(`/video-feed/${videoId}/like`)
      .then((r) => r.data),
  
  /**
   * Share a video
   */
  shareVideo: (videoId: string, channel: string) =>
    apiClient
      .post<void>(`/video-feed/${videoId}/share`, { channel })
      .then((r) => r.data),
  
  /**
   * Download a video
   */
  downloadVideo: (videoId: string) =>
    apiClient
      .get<{ downloadUrl: string }>(`/video-feed/${videoId}/download`)
      .then((r) => r.data),
  
  /**
   * Track video view
   */
  trackVideoView: (videoId: string, duration: number) =>
    apiClient
      .post<void>(`/video-feed/${videoId}/view`, { duration })
      .then((r) => r.data),
};
```

### TanStack Query Hooks (modules/video-feed/hooks.ts)

```typescript
// Query keys
export const videoFeedKeys = {
  all: ['video-feed'] as const,
  lists: () => [...videoFeedKeys.all, 'list'] as const,
  list: (page: number) => [...videoFeedKeys.lists(), page] as const,
};

// Infinite query for video feed
export function useVideoFeed() {
  return useInfiniteQuery({
    queryKey: videoFeedKeys.lists(),
    queryFn: ({ pageParam = 1 }) =>
      videoFeedApi.getVideoFeed({ page: pageParam, pageSize: 10 }),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Like video mutation
export function useLikeVideo() {
  return useMutation({
    mutationFn: ({ videoId, isLiked }: { videoId: string; isLiked: boolean }) =>
      isLiked ? videoFeedApi.unlikeVideo(videoId) : videoFeedApi.likeVideo(videoId),
    onMutate: async ({ videoId, isLiked }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: videoFeedKeys.lists() });
      const previousData = queryClient.getQueryData(videoFeedKeys.lists());
      
      queryClient.setQueryData(videoFeedKeys.lists(), (old: any) => {
        // Update engagement in cached data
        return updateVideoEngagement(old, videoId, isLiked);
      });
      
      return { previousData };
    },
    onError: (err, variables, context) => {
      // Revert optimistic update on error
      if (context?.previousData) {
        queryClient.setQueryData(videoFeedKeys.lists(), context.previousData);
      }
    },
  });
}

// Share video mutation
export function useShareVideo() {
  return useMutation({
    mutationFn: ({ videoId, channel }: { videoId: string; channel: string }) =>
      videoFeedApi.shareVideo(videoId, channel),
  });
}

// Download video mutation
export function useDownloadVideo() {
  return useMutation({
    mutationFn: (videoId: string) => videoFeedApi.downloadVideo(videoId),
  });
}
```

### Zustand Store (modules/video-feed/store.ts)

```typescript
import { create } from 'zustand';

interface VideoFeedStore {
  currentVideoIndex: number;
  isPlaying: boolean;
  isMuted: boolean;
  visibleVideoIds: string[];
  
  setCurrentVideoIndex: (index: number) => void;
  togglePlayback: () => void;
  toggleMute: () => void;
  setVisibleVideos: (ids: string[]) => void;
}

export const useVideoFeedStore = create<VideoFeedStore>((set, get) => ({
  currentVideoIndex: 0,
  isPlaying: true,
  isMuted: false,
  visibleVideoIds: [],
  
  setCurrentVideoIndex: (index) => set({ currentVideoIndex: index }),
  togglePlayback: () => set((state) => ({ isPlaying: !state.isPlaying })),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setVisibleVideos: (ids) => set({ visibleVideoIds: ids }),
}));

// Selectors
export const selectCurrentVideo = (state: VideoFeedStore) => 
  state.visibleVideoIds[state.currentVideoIndex] ?? null;

export const selectIsVideoVisible = (videoId: string) => (state: VideoFeedStore) =>
  state.visibleVideoIds.includes(videoId);
```

## Mock Data Implementation

### Mock Video Feed Data (assets/data/video-feed.ts)

```typescript
import { PropertyVideo } from '@/modules/video-feed/types';

export const mockVideoFeedData: PropertyVideo[] = [
  {
    id: 'video-001',
    videoUrl: require('@/assets/video/property-1.mp4'),
    thumbnailUrl: require('@/assets/video/property-1-thumb.jpg'),
    title: 'Modern 2BR Apartment in Kilimani',
    description: 'Spacious 2-bedroom apartment with modern finishes, open kitchen, and balcony. Located in a secure gated community with 24/7 security, backup generator, and ample parking.',
    propertyType: '2BR',
    price: 45000,
    priceUnit: 'month',
    location: {
      estate: 'Kilimani',
      county: 'Nairobi',
      coordinates: [36.7821, -1.2921],
    },
    unitStatus: 'vacant',
    owner: {
      id: 'owner-001',
      name: 'Jane Wanjiku',
      avatar: 'https://i.pravatar.cc/150?img=1',
      isVerified: true,
    },
    engagement: {
      likes: 1234,
      shares: 89,
      downloads: 45,
      views: 5678,
      isLiked: false,
      isShared: false,
      isDownloaded: false,
    },
    bedrooms: 2,
    bathrooms: 2,
    size: 1200,
    amenities: ['WiFi', 'Parking', 'Security', 'Backup Generator', 'Water'],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  // Duplicate with variations for testing infinite scroll
  // ... (repeat with different IDs and slight variations)
];

// Mock API with simulated network delay
export const mockVideoFeedApi = {
  getVideoFeed: async (params: { page: number; pageSize: number }) => {
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));
    
    const start = (params.page - 1) * params.pageSize;
    const end = start + params.pageSize;
    const videos = mockVideoFeedData.slice(start, end);
    
    return {
      videos,
      pagination: {
        page: params.page,
        pageSize: params.pageSize,
        total: mockVideoFeedData.length,
        hasMore: end < mockVideoFeedData.length,
      },
    };
  },
};
```

## Performance Optimizations

### 1. Video Lifecycle Management

**Preloading Strategy**:
- Preload next 2 videos in scroll direction
- Use thumbnail as placeholder before video loads
- Cache video metadata (duration, dimensions)

**Unloading Strategy**:
- Unload videos more than 3 positions away from current
- Release video memory immediately on unload
- Keep thumbnails in cache for instant display on scroll back

**Implementation**:
```typescript
const getVideosToPreload = (currentIndex: number, direction: 'up' | 'down') => {
  if (direction === 'down') {
    return [currentIndex + 1, currentIndex + 2];
  } else {
    return [currentIndex - 1, currentIndex - 2];
  }
};

const getVideosToUnload = (currentIndex: number, allIndices: number[]) => {
  return allIndices.filter((index) => Math.abs(index - currentIndex) > 3);
};
```

### 2. FlashList Configuration

```typescript
<FlashList
  data={videos}
  renderItem={renderVideoItem}
  estimatedItemSize={screenHeight}
  drawDistance={screenHeight * 2}
  removeClippedSubviews={true}
  onViewableItemsChanged={handleViewableItemsChanged}
  viewabilityConfig={{
    itemVisiblePercentThreshold: 80,
    minimumViewTime: 100,
  }}
  keyExtractor={(item) => item.id}
  getItemType={() => 'video'}
  onEndReached={loadMore}
  onEndReachedThreshold={0.5}
/>
```

### 3. Memoization Strategy

**Component Memoization**:
```typescript
const VideoFeedItem = React.memo(
  VideoFeedItemComponent,
  (prev, next) => {
    // Only re-render if these specific props change
    return (
      prev.video.id === next.video.id &&
      prev.isActive === next.isActive &&
      prev.video.engagement.isLiked === next.video.engagement.isLiked
    );
  }
);
```

**Callback Memoization**:
```typescript
const handleLike = useCallback((videoId: string) => {
  likeVideoMutation.mutate({ videoId, isLiked: false });
}, [likeVideoMutation]);

const handleShare = useCallback((videoId: string) => {
  shareVideoMutation.mutate({ videoId, channel: 'whatsapp' });
}, [shareVideoMutation]);
```

### 4. Animation Performance

**Use Reanimated for UI Thread Animations**:
```typescript
const scale = useSharedValue(1);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));

const handleLikePress = () => {
  scale.value = withSequence(
    withTiming(1.3, { duration: 150 }),
    withTiming(1.0, { duration: 150 })
  );
};
```

### 5. Network Optimization

**Caching Strategy**:
- Cache video thumbnails indefinitely
- Cache video metadata for 10 minutes
- Cache engagement data for 5 minutes
- Use stale-while-revalidate pattern

**Bandwidth Management**:
- Use HLS adaptive streaming
- Adjust quality based on network speed
- Preload only on WiFi (configurable)
- Pause preloading on low battery

## Error Handling

### Network Errors

**No Internet Connection**:
```typescript
if (!isConnected) {
  return (
    <View style={styles.errorContainer}>
      <Image source={require('@/assets/icons/no-internet.png')} />
      <Text style={styles.errorTitle}>No Internet Connection</Text>
      <Text style={styles.errorMessage}>
        Please check your connection and try again
      </Text>
      <Button onPress={retry}>Retry</Button>
    </View>
  );
}
```

**Video Load Failure**:
```typescript
const handleVideoError = (error: string) => {
  setVideoError(error);
  // Log to analytics
  analytics.logError('video_load_failed', { videoId, error });
};

// Show retry button overlay
{videoError && (
  <View style={styles.errorOverlay}>
    <Text style={styles.errorText}>Failed to load video</Text>
    <Button onPress={retryVideo}>Retry</Button>
  </View>
)}
```

### Engagement Action Errors

**Like Action Failure**:
```typescript
const { mutate: likeVideo } = useLikeVideo({
  onError: (error, variables, context) => {
    // Revert optimistic update
    queryClient.setQueryData(videoFeedKeys.lists(), context.previousData);
    
    // Show error toast
    Toast.show({
      type: 'error',
      text1: 'Failed to like video',
      text2: 'Please try again',
    });
  },
});
```

**Download Failure**:
```typescript
const handleDownloadError = (error: Error) => {
  Alert.alert(
    'Download Failed',
    'Unable to download video. Please check your storage and try again.',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Retry', onPress: retryDownload },
    ]
  );
};
```

### Empty States

**No Videos Available**:
```typescript
if (videos.length === 0 && !isLoading) {
  return (
    <View style={styles.emptyState}>
      <Image source={require('@/assets/illustrations/empty-feed.png')} />
      <Text style={styles.emptyTitle}>No videos yet</Text>
      <Text style={styles.emptyMessage}>
        Check back later for new property videos
      </Text>
    </View>
  );
}
```

**End of Feed**:
```typescript
if (!hasMore && videos.length > 0) {
  return (
    <View style={styles.endOfFeed}>
      <Text style={styles.endOfFeedText}>You're all caught up! 🎉</Text>
      <Button onPress={scrollToTop}>Back to Top</Button>
    </View>
  );
}
```

## Testing Strategy

### Property-Based Testing Assessment

**PBT is NOT applicable for this feature** because:

1. **UI-Heavy Feature**: The video feed is primarily a UI rendering and interaction feature (video playback, animations, gestures)
2. **Side-Effect Operations**: Core actions are side-effect-only (download video, share to external apps, navigate to other screens)
3. **External Dependencies**: Video streaming, network requests, and device permissions are external dependencies that don't benefit from property-based testing
4. **No Pure Functions**: The module doesn't contain pure transformation logic suitable for universal properties

**Testing Approach**: This feature will use unit tests for component logic, integration tests for video lifecycle, snapshot tests for UI rendering, and performance tests for benchmarks.

### Unit Tests

**Component Tests**:
- VideoFeedItem renders correctly with mock data
- VideoPlayer handles play/pause/mute correctly
- EngagementActions triggers callbacks on press
- PropertyInfo displays all required fields
- SkeletonLoader animates correctly

**Hook Tests**:
- useVideoFeed fetches and paginates correctly
- useLikeVideo performs optimistic updates
- useShareVideo calls API with correct params
- useDownloadVideo handles permissions

**Store Tests**:
- setCurrentVideoIndex updates state
- togglePlayback toggles isPlaying
- toggleMute toggles isMuted
- setVisibleVideos updates visibleVideoIds

### Integration Tests

**Video Lifecycle**:
- Video auto-plays when becoming visible
- Video pauses when scrolling away
- Video unloads when 3+ positions away
- Preloading works for next 2 videos

**Engagement Flow**:
- Like action updates UI optimistically
- Like action reverts on error
- Share sheet opens with correct options
- Download requests storage permission

**Navigation**:
- Book Now navigates to booking flow
- View Listing navigates to property details
- Search icon navigates to search screen
- Owner profile navigates to owner details

### Performance Tests

**Benchmarks**:
- Scrolling maintains 60fps
- Memory usage stays below 60MB
- Video starts within 500ms
- App doesn't crash with 100+ videos

**Load Testing**:
- Feed handles 1000+ videos
- Pagination works correctly
- Cache doesn't grow unbounded
- Network errors don't crash app

### Accessibility Tests

**VoiceOver/TalkBack**:
- All interactive elements have labels
- Video player announces playback state
- Engagement actions announce counts
- Property info is readable

**Visual**:
- Color contrast meets WCAG AA
- Text is readable at all sizes
- Touch targets are 44x44 minimum
- Focus indicators are visible

## Summary

The Video Feed Module delivers a high-performance, TikTok-style property discovery experience through:

1. **Aggressive Performance Optimization**: FlashList virtualization, video lifecycle management, UI thread animations
2. **Clean Architecture**: Two-layer state separation (TanStack Query + Zustand), module pattern, single API client
3. **Rich Engagement**: Like, share, download, book, view listing actions with optimistic updates
4. **Offline Resilience**: Caching, graceful degradation, clear error states
5. **Scalability**: Handles 100+ videos without performance degradation

**Key Technical Decisions**:
- FlashList over FlatList for better performance
- Reanimated over Animated for UI thread animations
- Expo AV over react-native-video for better Expo integration
- Zustand over Context API for client state (better performance)
- TanStack Query over Redux for server state (less boilerplate)

**Next Steps**:
1. Implement mock API and data
2. Build core components (VideoFeedList, VideoFeedItem, VideoPlayer)
3. Integrate TanStack Query hooks
4. Add Zustand store for client state
5. Implement engagement actions
6. Add error handling and loading states
7. Performance testing and optimization
8. Accessibility audit
