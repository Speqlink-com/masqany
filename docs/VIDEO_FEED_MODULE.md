# Video Feed Module Documentation

## Overview

The Video Feed Module is a TikTok-style vertical video feed for property discovery. It provides an immersive, full-screen video browsing experience with infinite scrolling, auto-playing videos, and rich engagement features.

## Architecture

### Technology Stack
- **State Management**: TanStack Query (server state) + Zustand (client state)
- **Virtualization**: FlashList (@shopify/flash-list)
- **Video Playback**: Expo AV (expo-av)
- **Animations**: React Native Reanimated
- **Networking**: Axios

### Module Structure
```
modules/video-feed/
├── types.ts          # TypeScript interfaces
├── api.ts            # API bindings
├── hooks.ts          # TanStack Query hooks
├── store.ts          # Zustand client state
└── index.ts          # Public API exports

components/video-feed/
├── VideoPlayer.tsx           # Video playback component
├── VideoFeedList.tsx         # Virtualized list container
├── VideoFeedItem.tsx         # Individual video item
├── VideoOverlay.tsx          # UI overlay container
├── PropertyInfo.tsx          # Property details display
├── PropertyOwnerProfile.tsx  # Owner profile display
├── EngagementActions.tsx     # Like/share/download buttons
├── CTAButtons.tsx            # Book Now / View Listing buttons
├── SkeletonLoader.tsx        # Loading state
├── EmptyFeedState.tsx        # Empty state
├── EndOfFeedState.tsx        # End of feed state
└── NoInternetConnection.tsx  # Network error state

assets/data/
└── video-feed.ts     # Mock data for development
```

## API Endpoints

### Base URL
```
https://api.masqany.com/v1
```

### Authentication
All endpoints require Bearer token authentication:
```
Authorization: Bearer {access_token}
```

### Endpoints

#### 1. Get Video Feed
**GET** `/video-feed`

Retrieves paginated property videos for the feed.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Page number (1-indexed) |
| pageSize | integer | No | 10 | Number of videos per page (max: 50) |
| filters | object | No | {} | Filter criteria (see below) |

**Filter Options:**
```typescript
{
  propertyType?: "bedsitter" | "1BR" | "2BR" | "3BR" | "4BR+" | "studio" | "penthouse";
  priceMin?: number;
  priceMax?: number;
  priceUnit?: "month" | "night";
  unitStatus?: "vacant" | "soon_vacant";
  county?: string;
  estate?: string;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  isNew?: boolean;
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "videos": [
      {
        "id": "video-001",
        "videoUrl": "https://cdn.masqany.com/videos/property-001.mp4",
        "thumbnailUrl": "https://cdn.masqany.com/thumbnails/property-001.jpg",
        "title": "Modern 2BR Apartment in Kilimani",
        "description": "Spacious 2-bedroom apartment...",
        "propertyType": "2BR",
        "price": 45000,
        "priceUnit": "month",
        "location": {
          "estate": "Kilimani",
          "county": "Nairobi",
          "coordinates": [36.7821, -1.2921]
        },
        "unitStatus": "vacant",
        "availableDate": null,
        "isNew": true,
        "owner": {
          "id": "owner-001",
          "name": "Jane Wanjiku",
          "avatar": "https://cdn.masqany.com/avatars/owner-001.jpg",
          "isVerified": true
        },
        "engagement": {
          "likes": 1234,
          "shares": 89,
          "downloads": 45,
          "views": 5678,
          "isLiked": false,
          "isShared": false,
          "isDownloaded": false
        },
        "bedrooms": 2,
        "bathrooms": 2,
        "size": 1200,
        "amenities": ["WiFi", "Parking", "Security", "Backup Generator", "Water"],
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 150,
      "hasMore": true
    }
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PAGE",
    "message": "Page number must be greater than 0"
  }
}
```

#### 2. Like Video
**POST** `/video-feed/{videoId}/like`

Likes or unlikes a property video.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| videoId | string | Yes | Video ID |

**Request Body:**
```json
{
  "isLiked": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "videoId": "video-001",
    "isLiked": true,
    "likes": 1235
  }
}
```

#### 3. Share Video
**POST** `/video-feed/{videoId}/share`

Records a video share action.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| videoId | string | Yes | Video ID |

**Request Body:**
```json
{
  "channel": "whatsapp"
}
```

**Channels:**
- `whatsapp`
- `sms`
- `email`
- `copy_link`
- `masqany_user`

**Response:**
```json
{
  "success": true,
  "data": {
    "videoId": "video-001",
    "shares": 90,
    "shareUrl": "https://masqany.com/property/video-001"
  }
}
```

#### 4. Download Video
**POST** `/video-feed/{videoId}/download`

Generates a download URL for the video.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| videoId | string | Yes | Video ID |

**Response:**
```json
{
  "success": true,
  "data": {
    "videoId": "video-001",
    "downloadUrl": "https://cdn.masqany.com/downloads/video-001.mp4?token=xyz",
    "expiresAt": "2024-01-15T11:30:00Z"
  }
}
```

#### 5. Track Video View
**POST** `/video-feed/{videoId}/view`

Records a video view with duration.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| videoId | string | Yes | Video ID |

**Request Body:**
```json
{
  "duration": 15.5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "videoId": "video-001",
    "views": 5679
  }
}
```

## Client Implementation

### 1. Setup

Install dependencies:
```bash
npm install @tanstack/react-query @shopify/flash-list expo-av react-native-reanimated zustand axios
```

### 2. Initialize Query Client

```typescript
// lib/query/client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});
```

### 3. Use Video Feed Hook

```typescript
import { useVideoFeed } from '@/modules/video-feed';

function HomeScreen() {
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    fetchNextPage, 
    hasNextPage 
  } = useVideoFeed();

  const videos = data?.pages.flatMap((page) => page.videos) ?? [];

  return (
    <VideoFeedList
      videos={videos}
      onEndReached={() => hasNextPage && fetchNextPage()}
      isLoading={isLoading}
      hasMore={hasNextPage ?? false}
      // ... other props
    />
  );
}
```

### 4. Use Engagement Hooks

```typescript
import { useLikeVideo, useShareVideo, useDownloadVideo } from '@/modules/video-feed';

function VideoActions({ videoId, isLiked }) {
  const likeVideoMutation = useLikeVideo();
  const shareVideoMutation = useShareVideo();
  const downloadVideoMutation = useDownloadVideo();

  const handleLike = () => {
    likeVideoMutation.mutate({ videoId, isLiked });
  };

  const handleShare = (channel) => {
    shareVideoMutation.mutate({ videoId, channel });
  };

  const handleDownload = () => {
    downloadVideoMutation.mutate(videoId);
  };

  return (
    // ... UI components
  );
}
```

## Features

### Video Playback
- **Auto-play**: Only one video plays at a time
- **Preloading**: Preloads ±2 videos from current position
- **Lifecycle Management**: Aggressive unloading of videos outside viewport
- **Adaptive Streaming**: Supports HLS/DASH formats
- **Thumbnail Preloading**: Shows thumbnail before video loads
- **Buffering Indicator**: Shows loading state during buffering
- **Error Handling**: Graceful error display with retry option

### Interactions
- **Single Tap**: Play/pause video
- **Double Tap**: Like video with heart animation
- **Swipe Up/Down**: Navigate between videos
- **Pull to Refresh**: Refresh feed (at top)

### Engagement Actions
- **Like**: Optimistic updates with revert on error
- **Share**: Multiple channels (WhatsApp, SMS, Email, Copy Link, Masqany User)
- **Download**: Request storage permission, show progress, save to device

### Property Information
- **Title**: Property name with "...more" to expand
- **Status Badge**: Vacant (green) or Soon Vacant (yellow)
- **Brand New Badge**: Orange badge for new listings
- **Location**: Tappable to open map
- **Property Type**: Bedsitter, 1BR, 2BR, etc.
- **Price**: Prominently displayed
- **Expandable Description**: Modal with full details

### CTA Buttons
- **Book Now**: Navigate to booking flow
- **View Listing**: Navigate to property details

### Performance Optimizations
- **FlashList Virtualization**: Efficient recycling of video items
- **Memoization**: Aggressive memoization of components
- **UI Thread Animations**: All animations run on UI thread
- **Memory Management**: Keeps usage below 60MB
- **60fps Scrolling**: Smooth scrolling performance

### Accessibility
- **VoiceOver/TalkBack**: Full screen reader support
- **Dynamic Text Sizing**: Respects system font size
- **Color Contrast**: WCAG AA compliant
- **Touch Targets**: Minimum 44x44 points

## Analytics Events

### Video Events
```typescript
// Video view started
analytics.track('video_view_started', {
  videoId: string,
  propertyId: string,
  position: number, // Position in feed
});

// Video view completed
analytics.track('video_view_completed', {
  videoId: string,
  propertyId: string,
  duration: number, // Seconds watched
  completionRate: number, // Percentage watched
});

// Video buffering
analytics.track('video_buffering', {
  videoId: string,
  duration: number, // Buffering duration in ms
});
```

### Engagement Events
```typescript
// Like action
analytics.track('video_liked', {
  videoId: string,
  propertyId: string,
  isLiked: boolean,
});

// Share action
analytics.track('video_shared', {
  videoId: string,
  propertyId: string,
  channel: string,
});

// Download action
analytics.track('video_downloaded', {
  videoId: string,
  propertyId: string,
});
```

### Navigation Events
```typescript
// Book Now clicked
analytics.track('book_now_clicked', {
  videoId: string,
  propertyId: string,
  price: number,
});

// View Listing clicked
analytics.track('view_listing_clicked', {
  videoId: string,
  propertyId: string,
});

// Search clicked
analytics.track('search_clicked', {
  source: 'video_feed',
});
```

## Error Handling

### Network Errors
- **No Internet**: Shows "No Internet Connection" screen with retry button
- **Network Lost During Playback**: Pauses video, shows "Reconnecting..." overlay
- **Request Timeout**: Retries with exponential backoff (3 attempts)

### Video Errors
- **Load Failure**: Shows error message with retry button
- **Unsupported Format**: Shows format error message
- **Missing Thumbnail**: Shows placeholder icon

### Engagement Errors
- **Like Failure**: Reverts optimistic update, shows error toast
- **Share Failure**: Shows error toast
- **Download Failure**: Shows error with retry option

## Testing

### Unit Tests
```bash
npm test modules/video-feed
```

### Integration Tests
```bash
npm test components/video-feed
```

### E2E Tests
```bash
npm run test:e2e -- --spec video-feed
```

## Performance Metrics

### Target Metrics
- **Video Start Time**: < 500ms
- **Scrolling FPS**: 60fps
- **Memory Usage**: < 60MB
- **Battery Drain**: < 10% per hour
- **Network Usage**: Optimized with caching
- **App Size Increase**: < 5MB

### Monitoring
```typescript
// Track performance metrics
analytics.track('video_performance', {
  videoId: string,
  loadTime: number, // ms
  bufferingTime: number, // ms
  fps: number,
  memoryUsage: number, // MB
});
```

## Troubleshooting

### Video Not Playing
1. Check network connection
2. Verify video URL is accessible
3. Check video format (MP4, HLS, DASH supported)
4. Verify expo-av is installed correctly

### Slow Performance
1. Check memory usage (should be < 60MB)
2. Verify FlashList is being used (not FlatList)
3. Check if too many videos are loaded (should unload videos > 3 positions away)
4. Verify animations are running on UI thread

### Crashes on Touch
1. Ensure TouchableWithoutFeedback is used (not GestureDetector)
2. Check for unhandled promise rejections
3. Verify all async operations have error handling

## Future Enhancements

### Planned Features
- [ ] Video captions/subtitles
- [ ] Picture-in-picture mode
- [ ] Offline video caching
- [ ] Advanced filters (price range, amenities, etc.)
- [ ] Personalized recommendations
- [ ] Video quality selection
- [ ] Playback speed control
- [ ] Save to favorites
- [ ] Report inappropriate content

### API Improvements
- [ ] GraphQL support
- [ ] WebSocket for real-time updates
- [ ] CDN optimization
- [ ] Video transcoding pipeline
- [ ] Thumbnail generation service

## Support

For issues or questions:
- **Email**: dev@masqany.com
- **Slack**: #video-feed-module
- **Documentation**: https://docs.masqany.com/video-feed

## License

Proprietary - Masqany Mobile App
