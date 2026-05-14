# Implementation Plan: Video Feed Module

## Overview

This implementation plan breaks down the Video Feed Module into discrete, incremental coding tasks. The module implements a TikTok-style vertical video feed for property discovery with infinite scrolling, auto-playing videos, and rich engagement features. The implementation follows the Masqany mobile architecture with TanStack Query for server state, Zustand for client state, FlashList for virtualization, and React Native Reanimated for animations.

**Key Implementation Priorities:**
1. Module foundation (types, API, hooks, store)
2. Core video feed with virtualization and lifecycle management
3. Video player with auto-play and controls
4. Property information overlay and engagement actions
5. Performance optimization and error handling
6. Testing and polish

## Tasks

- [x] 1. Set up Video Feed Module foundation
  - Create `modules/video-feed/` directory structure
  - Define TypeScript interfaces in `types.ts` (PropertyVideo, VideoEngagement, VideoFeedResponse, VideoFeedStore)
  - Create module index.ts that re-exports all public APIs
  - _Requirements: 10, 12_

- [x] 2. Implement mock data and API layer
  - [x] 2.1 Create mock video feed data
    - Create `assets/data/video-feed.ts` with realistic PropertyVideo mock data
    - Use the 3 videos from `assets/video/` directory (duplicate with variations for infinite scroll)
    - Include varied engagement numbers, verified/unverified owners, vacant/soon vacant properties
    - _Requirements: 11.1, 11.4, 11.5, 11.6, 11.7, 11.8, 11.9_
  
  - [x] 2.2 Implement video feed API bindings
    - Create `modules/video-feed/api.ts` with videoFeedApi object
    - Implement getVideoFeed, likeVideo, unlikeVideo, shareVideo, downloadVideo, trackVideoView functions
    - Use single Axios instance from `lib/api/client.ts`
    - Add simulated network delay (500-1000ms) for mock API
    - Return paginated results (10 items per page)
    - _Requirements: 11.1, 11.2, 11.3, 12.3, 12.9_

- [x] 3. Implement TanStack Query hooks
  - [x] 3.1 Create query keys and useVideoFeed hook
    - Define videoFeedKeys constant in `modules/video-feed/hooks.ts`
    - Implement useVideoFeed with useInfiniteQuery for pagination
    - Configure staleTime (5 minutes) and gcTime (10 minutes)
    - Implement getNextPageParam for infinite scrolling
    - _Requirements: 2.2, 12.4, 12.10, 12.11_
  
  - [x] 3.2 Create engagement mutation hooks
    - Implement useLikeVideo with optimistic updates
    - Implement useShareVideo mutation
    - Implement useDownloadVideo mutation
    - Add error handling with revert logic for optimistic updates
    - _Requirements: 6.11, 6.12, 12.4, 12.11_

- [x] 4. Implement Zustand client state store
  - Create `modules/video-feed/store.ts` with useVideoFeedStore
  - Define state: currentVideoIndex, isPlaying, isMuted, visibleVideoIds
  - Implement actions: setCurrentVideoIndex, togglePlayback, toggleMute, setVisibleVideos
  - Create selectors: selectCurrentVideo, selectIsVideoVisible
  - _Requirements: 12.5, 12.6, 12.12, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9, 13.10_

- [x] 5. Checkpoint - Ensure module foundation is complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement VideoPlayer component
  - [x] 6.1 Create VideoPlayer with Expo AV
    - Create `components/video-feed/VideoPlayer.tsx`
    - Implement video playback with Expo AV Video component
    - Add thumbnail preloading before video loads
    - Implement video lifecycle (play/pause based on isActive prop)
    - Support HLS/DASH adaptive streaming
    - Maintain 9:16 aspect ratio and fill available space
    - _Requirements: 2.10, 4.1, 4.6, 4.9, 4.10, 4.11_
  
  - [x] 6.2 Add video controls and interactions
    - Implement center tap for play/pause toggle
    - Add play/pause icon overlay with fade-out animation (1 second)
    - Implement volume icon in bottom-left corner for mute/unmute
    - Add pinch-to-zoom gesture support with React Native Gesture Handler
    - Reset zoom when scrolling to next video
    - Add buffering indicator overlay
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.7, 4.8, 4.12, 4.13, 4.14_
  
  - [x] 6.3 Implement video unloading logic
    - Add logic to unload video when more than 3 positions away from current
    - Release video memory immediately on unload
    - Keep thumbnails cached for instant display
    - _Requirements: 2.6_

- [x] 7. Implement PropertyOwnerProfile component
  - Create `components/video-feed/PropertyOwnerProfile.tsx`
  - Display circular avatar (44x44px) positioned 20% from top
  - Show owner name below avatar (white, 13px, semibold, truncated with ellipsis)
  - Add verified badge overlay (bottom-right, 16x16px) when owner is verified
  - Use `assets/icons/verified-check-icon.webp` for verified badge
  - Make profile tappable to navigate to owner profile screen
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 5.11, 5.12_

- [x] 8. Implement EngagementActions component
  - [x] 8.1 Create EngagementActions UI
    - Create `components/video-feed/EngagementActions.tsx`
    - Display like, share, download icons vertically with 24px spacing
    - Position below owner profile on right side
    - Use icons from assets: like.png (28x28), share.png (28x28), download.webp (28x28)
    - Display counts below each icon (white, 13px, semibold)
    - Format large numbers (5.9k, 1.2M)
    - Add subtle drop shadow for visibility
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10, 6.13, 6.14, 6.15, 6.18, 6.19, 6.24_
  
  - [x] 8.2 Implement like action with animation
    - Connect like button to useLikeVideo hook
    - Implement scale animation (1.0 → 1.3 → 1.0) over 300ms using Reanimated
    - Change icon color to blue (#20A6FD) when liked, white when not liked
    - Update count optimistically
    - _Requirements: 6.6, 6.7, 6.11, 6.12_
  
  - [x] 8.3 Implement share action
    - Connect share button to useShareVideo hook
    - Show share sheet with options: WhatsApp, SMS, Email, Copy Link, Share to Masqany User
    - Track share channel in analytics
    - _Requirements: 6.16, 6.17_
  
  - [x] 8.4 Implement download action
    - Connect download button to useDownloadVideo hook
    - Request storage permission before download
    - Show download progress indicator
    - Display success message on completion
    - _Requirements: 6.20, 6.21, 6.22, 6.23_

- [x] 9. Implement PropertyInfo component
  - Create `components/video-feed/PropertyInfo.tsx`
  - Add semi-transparent black background (rgba(0,0,0,0.6))
  - Display property name with "...more" suffix (white, 17px, semibold, 2 lines max)
  - Show unit status badge (green #22C55E for vacant, yellow #F59E0B for soon vacant)
  - Display available date when status is "Soon Vacant" (format: "Available: Dec 25, 2024")
  - Add location badge with icon (assets/icons/location.png, 16x16px) and text (estate, county)
  - Make location tappable to open map view
  - Display property type with house icon (assets/icons/house-icon.webp, 16x16px)
  - Show price prominently (white, 19px, bold, format: "KES 25,000/month" or "KES 3,500/night")
  - Implement expandable description modal (white background, rounded corners, dismissible)
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 7.10, 7.11, 7.12, 7.13, 7.14, 7.15, 7.16, 7.17, 7.18, 7.19, 7.20, 7.21, 7.22, 7.23, 7.24, 7.25_

- [x] 10. Implement CTA buttons (Book Now and View Listing)
  - [x] 10.1 Create Book Now button
    - Position at bottom-right of property info
    - Style: blue background (#20A6FD), rounded-full, white text (15px, semibold)
    - Padding: 12px horizontal, 8px vertical
    - Add subtle shadow for depth
    - Navigate to booking flow on tap
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_
  
  - [x] 10.2 Create View Listing button
    - Position at top-right of screen
    - Style: semi-transparent white background (rgba(255,255,255,0.3)), white text (13px, medium)
    - Rounded corners (radius: 20px), padding: 8px horizontal, 6px vertical
    - Navigate to property details screen on tap
    - Preserve video feed state for back navigation
    - _Requirements: 8.8, 8.9, 8.10, 8.11, 8.12, 8.13, 8.14, 8.15_

- [x] 11. Implement VideoOverlay component
  - Create `components/video-feed/VideoOverlay.tsx` as container
  - Compose PropertyOwnerProfile, EngagementActions, PropertyInfo, and CTA buttons
  - Add search icon at top-left (assets/icons/search.png, 24x24px, circular background rgba(0,0,0,0.4), padding: 8px)
  - Navigate to search screen on search icon tap
  - Ensure all elements have drop shadows for visibility over video
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8_

- [x] 12. Checkpoint - Ensure all components are complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. Implement VideoFeedItem component
  - Create `components/video-feed/VideoFeedItem.tsx`
  - Compose VideoPlayer and VideoOverlay
  - Accept props: video, isVisible, isActive, engagement callbacks
  - Implement memoization with custom comparison function (check video.id, isVisible, isActive, engagement.isLiked)
  - Handle video lifecycle: auto-play when isActive, pause when not active, unload when far away
  - _Requirements: 2.3, 2.4, 2.5, 2.6, 4.1_

- [x] 14. Implement VideoFeedList with FlashList
  - [x] 14.1 Create VideoFeedList component
    - Create `components/video-feed/VideoFeedList.tsx`
    - Use Shopify FlashList for virtualized scrolling
    - Configure estimatedItemSize to screen height
    - Set drawDistance to 2 items above/below
    - Enable removeClippedSubviews
    - Implement stable keyExtractor using video.id
    - _Requirements: 2.1, 2.7, 12.1_
  
  - [x] 14.2 Implement visibility tracking
    - Configure onViewableItemsChanged with 80% threshold
    - Set minimumViewTime to 100ms
    - Update Zustand store with visible video IDs
    - Determine active video (currently playing)
    - _Requirements: 2.7, 2.8_
  
  - [x] 14.3 Implement infinite scrolling
    - Configure onEndReached callback
    - Set onEndReachedThreshold to 0.5
    - Call fetchNextPage from useVideoFeed hook
    - _Requirements: 2.2_
  
  - [x] 14.4 Implement video preloading
    - Preload next 2 videos in scroll direction
    - Use thumbnail as placeholder before video loads
    - Cache video metadata (duration, dimensions)
    - _Requirements: 2.4_

- [x] 15. Implement SkeletonLoader component
  - Create `components/video-feed/SkeletonLoader.tsx`
  - Display full-screen placeholder during initial load
  - Animate Masqany agent icon (assets/icons/masqany-agent.webp)
  - Use smooth rotation or pulse animation with Reanimated
  - _Requirements: 3.3, 3.4, 3.5_

- [x] 16. Implement network connectivity handling
  - [x] 16.1 Add network status check
    - Test network connectivity before loading videos
    - Display "No Internet Connection" message when network unavailable
    - Show retry button on network error
    - _Requirements: 3.1, 3.2_
  
  - [x] 16.2 Add loading and buffering states
    - Show skeleton loader during initial video load
    - Display loading progress for video buffering
    - Show buffering indicator during playback (non-blocking)
    - Cache video thumbnails for instant display
    - Lazy load thumbnails before video playback
    - _Requirements: 3.3, 3.6, 3.9, 3.10, 3.11, 3.12_

- [x] 17. Implement error handling
  - [x] 17.1 Add video error handling
    - Show error message with retry button when video fails to load
    - Display format error for unsupported video formats
    - Handle video aspect ratio mismatches gracefully
    - Use placeholder for missing thumbnails
    - Log errors to monitoring service
    - _Requirements: 3.7, 15.1, 15.3, 15.11, 15.12_
  
  - [x] 17.2 Add network error handling
    - Pause and show reconnecting message when network is lost during playback
    - Implement exponential backoff for failed requests
    - _Requirements: 3.8, 15.2_
  
  - [x] 17.3 Add engagement error handling
    - Revert optimistic update when like action fails
    - Show error toast when share action fails
    - Show error with retry option when download fails
    - _Requirements: 15.7, 15.8, 15.9, 15.10_
  
  - [x] 17.4 Add empty states
    - Show "You're all caught up" message when feed reaches end
    - Display empty state with illustration when no videos available
    - Suggest actions in empty state (adjust filters, check back later)
    - _Requirements: 15.4, 15.5, 15.6_

- [x] 18. Implement home screen with safe areas
  - [x] 18.1 Create home screen layout
    - Update `app/(tabs)/home.tsx` to use VideoFeedList
    - Add blue bar (#20A6FD) at top (3% screen height) to protect status bar
    - Add blue bar (#20A6FD) at bottom with 1px black line at top edge
    - Ensure video content fills space between bars
    - Use SafeAreaView for proper safe area handling
    - Ensure bars have fixed positioning and don't scroll
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9_
  
  - [x] 18.2 Wire up data and state
    - Import useVideoFeed hook from modules/video-feed
    - Import useVideoFeedStore from modules/video-feed
    - Connect engagement callbacks to mutation hooks
    - Handle loading, error, and empty states
    - _Requirements: 12.7, 12.8_

- [x] 19. Checkpoint - Ensure core functionality is complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 20. Implement performance optimizations
  - [x] 20.1 Optimize component memoization
    - Memoize VideoFeedItem with custom comparison
    - Memoize all callbacks with useCallback
    - Use stable references for all props
    - _Requirements: 2.15, 2.16_
  
  - [x] 20.2 Optimize animations
    - Use React Native Reanimated for all animations
    - Run animations on UI thread (useSharedValue, useAnimatedStyle)
    - Implement smooth like animation with withSequence
    - _Requirements: 2.11, 2.14_
  
  - [x] 20.3 Optimize memory management
    - Implement aggressive video unloading (3+ positions away)
    - Release video memory immediately on unload
    - Keep memory usage below 60MB
    - _Requirements: 2.6, 2.17_

- [x] 21. Implement accessibility features
  - Add accessibility labels to video player
  - Add accessibility labels to engagement buttons
  - Support VoiceOver/TalkBack
  - Support dynamic text sizing
  - Provide captions/subtitles option
  - Ensure sufficient color contrast (WCAG AA)
  - Verify minimum touch target size (44x44) for all interactive elements
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7_

- [x] 22. Implement analytics tracking
  - Track video view duration
  - Track video completion rate
  - Track like/unlike actions
  - Track share actions and channels
  - Track download actions
  - Track "Book Now" button taps
  - Track "View Listing" button taps
  - Track search icon taps
  - Track buffering events and duration
  - Track video load time
  - Track scroll velocity
  - Track device performance metrics
  - Send analytics asynchronously without blocking UI
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8, 14.9, 14.10, 14.11, 14.12, 14.13, 14.14_

- [x] 23. Final performance validation
  - Verify 60fps during scrolling
  - Verify video starts within 500ms of becoming visible
  - Verify memory usage stays below 60MB
  - Test with 100+ videos in feed (no crashes)
  - Measure battery drain (< 10% per hour target)
  - Verify network usage optimization with caching
  - Verify app size increase < 5MB for module
  - _Requirements: 2.18, 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7_

- [x] 24. Final checkpoint - Complete implementation
  - Ensure all tests pass, ask the user if questions arise.

- [x] 25. Add double-tap to like functionality
  - Add double-tap gesture detector to VideoPlayer component
  - Trigger like action on double-tap (call onLike callback)
  - Show heart animation on double-tap (scale + fade out)
  - Ensure double-tap doesn't interfere with single tap play/pause
  - Use React Native Gesture Handler TapGesture with numberOfTaps={2}

- [x] 26. Add "Brand New" property status display
  - Update PropertyInfo component to show "Brand New" badge
  - Display "Brand New" badge when property.isNew is true
  - Style: orange background (#F97316), white text, rounded-full
  - Position alongside or replace unit status badge when applicable
  - Ensure proper spacing and visibility

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- The implementation follows the Masqany mobile architecture with TanStack Query for server state and Zustand for client state
- All components use TypeScript strict mode
- All API calls go through the video-feed module (never call apiClient directly from components)
- FlashList is used for virtualization instead of FlatList for better performance
- React Native Reanimated is used for UI thread animations
- Video lifecycle management is critical for performance (aggressive unloading)
