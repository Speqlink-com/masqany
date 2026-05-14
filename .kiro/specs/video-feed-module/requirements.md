# Video Feed Module (Module 005) - Requirements Document

## ⚠️ MODULE STATUS
**CONFIRMED MODULE** - This is the primary tenant home screen experience.

## Introduction

The Video Feed Module (Module 005) provides a TikTok-style vertical video feed for property discovery. This is the first screen tenant users see when they open the app. The module implements infinite scrolling, auto-playing videos, and rich property information overlays with engagement features (like, share, download, book).

The module follows the Masqany mobile architecture with TanStack Query for server state management, Zustand for client state (video playback, UI interactions), and the established module pattern. The UI implements full-screen video playback with performance optimizations including virtualization (FlashList), aggressive memory management, and smooth gesture-based navigation.

## Glossary

- **Video_Feed_Module**: The feature module containing API bindings, hooks, and types for video feed operations
- **Property_Video**: Short-form video showcasing a property (15-60 seconds)
- **Video_Feed**: Infinite scrolling vertical list of property videos
- **Auto_Play**: Automatic video playback when video becomes visible
- **Virtualization**: Rendering only visible items using FlashList for performance
- **Preloading**: Loading next videos before they become visible
- **Video_Lifecycle**: Managing video play/pause/unload based on visibility
- **Engagement_Overlay**: UI layer showing likes, shares, downloads, property info
- **Property_Owner_Profile**: Owner avatar, name, verification badge
- **Like_Action**: User can like/unlike a property video
- **Share_Action**: User can share video to WhatsApp, other apps, or Masqany users
- **Download_Action**: User can download video to device
- **Book_Now_Button**: CTA button to initiate booking flow
- **View_Listing_Button**: Opens detailed property view with map
- **Property_Description**: Expandable text showing full property details
- **Unit_Status**: Vacant or Soon Vacant with date
- **Location_Badge**: Shows property location, opens map on tap
- **Verified_Badge**: Checkmark icon for verified property owners
- **Top_Bar**: Blue bar (3% height) protecting status bar area
- **Bottom_Bar**: Blue bar protecting tab navigation area
- **Search_Icon**: Opens property search interface
- **Skeleton_Loader**: Loading state animation using Masqany agent icon
- **Network_Connectivity**: Check network before loading videos
- **HLS_Streaming**: Adaptive bitrate streaming for video delivery
- **Video_Cache**: Local caching of viewed videos
- **Gesture_Handler**: React Native Gesture Handler for smooth swipes
- **Reanimated**: React Native Reanimated for UI thread animations
- **FlashList**: Shopify FlashList for virtualized scrolling
- **Visibility_Tracking**: onViewableItemsChanged to determine active video
- **Memory_Management**: Aggressive unloading of off-screen videos

## Requirements

### Requirement 1: Screen Layout and Safe Areas

**User Story:** As a tenant user, I want a full-screen video experience with protected areas for system UI and navigation, so that content doesn't overlap with important controls.

#### Acceptance Criteria

1. THE Video_Feed_Module SHALL be the default home screen for tenant users
2. THE screen SHALL display a blue bar (#20A6FD) at the top occupying 3% of screen height
3. THE top bar SHALL protect the status bar and system icons area
4. THE screen SHALL display a blue bar (#20A6FD) at the bottom protecting the tab navigation
5. THE bottom bar SHALL have a black line (1px) at the top edge for clear indication
6. THE video content SHALL fill the space between top and bottom bars
7. THE layout SHALL NOT interfere with tab bar height defined in `app/(tabs)/_layout.tsx`
8. THE safe areas SHALL remain visible during video playback
9. THE bars SHALL have fixed positioning and NOT scroll with content

### Requirement 2: Video Feed Architecture and Performance

**User Story:** As a tenant user, I want smooth, responsive video scrolling without lag or battery drain, so that I can browse properties efficiently.

#### Acceptance Criteria

1. THE Video_Feed SHALL use Shopify FlashList for virtualized scrolling
2. THE feed SHALL implement infinite scrolling with automatic pagination
3. ONLY the currently visible video SHALL play at any time
4. THE system SHALL preload the next 2 videos in the scroll direction
5. ALL off-screen videos SHALL be paused immediately
6. THE system SHALL unload videos more than 3 positions away from current
7. THE feed SHALL use onViewableItemsChanged for visibility tracking
8. THE viewability threshold SHALL be 80% of video height
9. THE system SHALL implement video caching for viewed content
10. THE feed SHALL support HLS/DASH adaptive bitrate streaming
11. THE system SHALL use React Native Reanimated for animations
12. THE system SHALL use React Native Gesture Handler for swipe gestures
13. THE swipe gesture SHALL feel instantaneous (< 16ms response)
14. THE system SHALL run animations on the UI thread
15. THE system SHALL implement memo for video components
16. THE system SHALL use stable callbacks to prevent re-renders
17. THE system SHALL maintain < 60MB memory usage for feed
18. THE system SHALL achieve 60fps during scrolling

### Requirement 3: Network Connectivity and Loading States

**User Story:** As a tenant user, I want clear feedback when loading videos and graceful handling of network issues, so that I understand what's happening.

#### Acceptance Criteria

1. THE system SHALL test network connectivity before loading videos
2. WHEN network is unavailable, THE system SHALL display "No Internet Connection" message
3. THE system SHALL show skeleton loader during initial video load
4. THE skeleton loader SHALL animate the Masqany agent icon (assets/icons/masqany-agent.webp)
5. THE animation SHALL be a smooth rotation or pulse effect
6. THE system SHALL display loading progress for video buffering
7. WHEN video fails to load, THE system SHALL show retry button
8. THE system SHALL implement exponential backoff for failed requests
9. THE system SHALL cache video thumbnails for instant display
10. THE system SHALL lazy load thumbnails before video playback
11. THE system SHALL show buffering indicator during playback
12. THE buffering indicator SHALL NOT block video controls

### Requirement 4: Video Playback Controls

**User Story:** As a tenant user, I want simple controls to play/pause videos, so that I can control my viewing experience.

#### Acceptance Criteria

1. THE video SHALL auto-play when it becomes 80% visible
2. THE video SHALL pause when user taps the center of the screen
3. THE video SHALL resume when user taps again
4. THE video SHALL display a play/pause icon overlay on tap
5. THE play/pause icon SHALL fade out after 1 second
6. THE video SHALL loop continuously when it reaches the end
7. THE video SHALL mute/unmute on tap of volume icon
8. THE volume icon SHALL be positioned in bottom-left corner
9. THE video SHALL maintain aspect ratio (9:16 portrait)
10. THE video SHALL fill the available screen space
11. THE video SHALL NOT show default video controls
12. THE video SHALL support pinch-to-zoom gesture
13. THE zoom SHALL be smooth and responsive
14. THE video SHALL reset zoom when scrolling to next video

### Requirement 5: Property Owner Profile Display

**User Story:** As a tenant user, I want to see who owns the property, so that I can assess credibility and trust.

#### Acceptance Criteria

1. THE profile SHALL display on the right side of the screen
2. THE profile avatar SHALL be circular, 44x44 pixels
3. THE profile avatar SHALL be positioned 20% from the top
4. THE owner name SHALL display below the avatar
5. THE owner name SHALL be white text, 13px, semibold
6. THE owner name SHALL truncate with ellipsis if too long
7. WHEN property owner is verified, THE system SHALL display verified badge
8. THE verified badge SHALL use assets/icons/verified-check-icon.webp
9. THE verified badge SHALL be positioned at bottom-right of avatar
10. THE verified badge SHALL be 16x16 pixels
11. THE profile SHALL be tappable to view owner details
12. WHEN profile is tapped, THE system SHALL navigate to owner profile screen

### Requirement 6: Engagement Actions (Like, Share, Download)

**User Story:** As a tenant user, I want to like, share, and download property videos, so that I can save and share interesting properties.

#### Acceptance Criteria

1. THE engagement actions SHALL display vertically on the right side
2. THE actions SHALL be positioned below the owner profile
3. THE actions SHALL have 24px spacing between each item
4. THE like icon SHALL use assets/icons/like.png
5. THE like icon SHALL be 28x28 pixels
6. THE like icon SHALL be white when not liked
7. THE like icon SHALL be blue (#20A6FD) when liked
8. THE like count SHALL display below the icon
9. THE like count SHALL be white text, 13px, semibold
10. THE like count SHALL format large numbers (5.9k, 1.2M)
11. WHEN user taps like, THE icon SHALL animate (scale 1.0 → 1.3 → 1.0)
12. THE animation SHALL take 300ms
13. THE share icon SHALL use assets/icons/share.png
14. THE share icon SHALL be 28x28 pixels, white
15. THE share count SHALL display below share icon
16. WHEN user taps share, THE system SHALL show share sheet
17. THE share sheet SHALL include: WhatsApp, SMS, Email, Copy Link, Share to Masqany User
18. THE download icon SHALL use assets/icons/download.webp
19. THE download icon SHALL be 28x28 pixels, white
20. WHEN user taps download, THE system SHALL request storage permission
21. WHEN permission granted, THE system SHALL download video to device
22. THE system SHALL show download progress indicator
23. WHEN download completes, THE system SHALL show success message
24. THE engagement actions SHALL have subtle drop shadow for visibility

### Requirement 7: Property Information Display

**User Story:** As a tenant user, I want to see key property details overlaid on the video, so that I can quickly assess if it meets my needs.

#### Acceptance Criteria

1. THE property info SHALL display at the bottom of the screen
2. THE property info SHALL have semi-transparent black background (rgba(0,0,0,0.6))
3. THE property name SHALL display with "...more" suffix
4. THE property name SHALL be white text, 17px, semibold
5. THE property name SHALL truncate to 2 lines maximum
6. WHEN user taps "...more", THE system SHALL expand full description
7. THE expanded description SHALL show in a modal overlay
8. THE modal SHALL have white background with rounded corners
9. THE modal SHALL be dismissible by tapping outside or close button
10. THE unit status SHALL display below property name
11. THE unit status SHALL show "Vacant" in green (#22C55E) or "Soon Vacant" in yellow (#F59E0B)
12. WHEN status is "Soon Vacant", THE system SHALL display the date
13. THE date format SHALL be "Available: Dec 25, 2024"
14. THE location badge SHALL display below unit status
15. THE location badge SHALL use assets/icons/location.png icon
16. THE location icon SHALL be 16x16 pixels, white
17. THE location text SHALL be white, 13px, medium
18. THE location text SHALL show "Estate, County" format
19. WHEN user taps location, THE system SHALL open map view
20. THE property type SHALL display (Bedsitter, 1BR, 2BR, etc.)
21. THE property type SHALL use assets/icons/house-icon.webp icon
22. THE property type icon SHALL be 16x16 pixels, white
23. THE price SHALL display prominently
24. THE price SHALL be white text, 19px, bold
25. THE price format SHALL be "KES 25,000/month" or "KES 3,500/night"

### Requirement 8: Book Now and View Listing Actions

**User Story:** As a tenant user, I want clear CTAs to book or view more details, so that I can take action on properties I like.

#### Acceptance Criteria

1. THE "Book Now" button SHALL display at the bottom-right of property info
2. THE button SHALL have blue background (#20A6FD)
3. THE button SHALL be rounded-full (pill shape)
4. THE button SHALL have white text, 15px, semibold
5. THE button SHALL have padding: 12px horizontal, 8px vertical
6. THE button SHALL have subtle shadow for depth
7. WHEN user taps "Book Now", THE system SHALL navigate to booking flow
8. THE "View Listing" button SHALL display at the top-right
9. THE button SHALL have semi-transparent white background (rgba(255,255,255,0.3))
10. THE button SHALL have white text, 13px, medium
11. THE button SHALL have rounded corners (radius: 20px)
12. THE button SHALL have padding: 8px horizontal, 6px vertical
13. WHEN user taps "View Listing", THE system SHALL navigate to property details screen
14. THE property details screen SHALL show map, photos, full description, amenities
15. THE navigation SHALL preserve video feed state for back navigation

### Requirement 9: Search Functionality

**User Story:** As a tenant user, I want to search for specific properties, so that I can find what I'm looking for quickly.

#### Acceptance Criteria

1. THE search icon SHALL display at the top-left of the screen
2. THE search icon SHALL use assets/icons/search.png
3. THE search icon SHALL be 24x24 pixels, white
4. THE search icon SHALL have circular background (rgba(0,0,0,0.4))
5. THE search icon SHALL have padding: 8px
6. WHEN user taps search, THE system SHALL navigate to search screen
7. THE search screen SHALL be a separate module (not implemented in this spec)
8. THE navigation SHALL preserve video feed state

### Requirement 10: Video Feed Data Structure

**User Story:** As a developer, I want a clear data structure for video feed items, so that I can implement the UI consistently.

#### Acceptance Criteria

1. THE PropertyVideo interface SHALL include: id, videoUrl, thumbnailUrl, title, description
2. THE PropertyVideo interface SHALL include: propertyType, price, priceUnit (month/night)
3. THE PropertyVideo interface SHALL include: location (estate, county, coordinates)
4. THE PropertyVideo interface SHALL include: unitStatus (vacant/soon_vacant), availableDate
5. THE PropertyVideo interface SHALL include: owner (id, name, avatar, isVerified)
6. THE PropertyVideo interface SHALL include: engagement (likes, shares, downloads, isLiked)
7. THE PropertyVideo interface SHALL include: bedrooms, bathrooms, size, amenities
8. THE PropertyVideo interface SHALL include: createdAt, updatedAt
9. THE system SHALL use TypeScript strict mode for all types
10. THE system SHALL export types from modules/video-feed/types.ts

### Requirement 11: Mock API and Data

**User Story:** As a developer, I want mock data to test the video feed, so that I can develop without backend dependency.

#### Acceptance Criteria

1. THE system SHALL create mock API endpoints in modules/video-feed/api.ts
2. THE mock API SHALL simulate network delay (500-1000ms)
3. THE mock API SHALL return paginated results (10 items per page)
4. THE mock API SHALL use the 3 videos from assets/video/ directory
5. THE mock API SHALL duplicate videos to simulate infinite feed
6. THE mock data SHALL include realistic property information
7. THE mock data SHALL include varied engagement numbers
8. THE mock data SHALL include mix of vacant and soon vacant properties
9. THE mock data SHALL include verified and unverified owners
10. THE system SHALL store mock data in assets/data/video-feed.ts

### Requirement 12: Video Feed Module Architecture

**User Story:** As a developer, I want the video feed module to follow the established architecture, so that the codebase remains consistent and maintainable.

#### Acceptance Criteria

1. THE Video_Feed_Module SHALL be located in modules/video-feed/
2. THE Video_Feed_Module SHALL contain api.ts for all API calls
3. THE Video_Feed_Module SHALL contain hooks.ts for all TanStack Query hooks
4. THE Video_Feed_Module SHALL contain types.ts for all TypeScript interfaces
5. THE Video_Feed_Module SHALL contain store.ts for Zustand client state
6. THE Video_Feed_Module SHALL contain index.ts that re-exports all public APIs
7. THE home screen SHALL NOT call apiClient directly
8. THE home screen SHALL only use hooks from Video_Feed_Module for data access
9. THE Video_Feed_Module SHALL use the single Axios instance from lib/api/client.ts
10. THE Video_Feed_Module SHALL define query keys as const arrays in hooks.ts
11. THE Video_Feed_Module SHALL use TanStack Query for all server state management
12. THE Video_Feed_Module SHALL use Zustand for client state (current video index, playback state, UI toggles)

### Requirement 13: Video Feed Store (Zustand)

**User Story:** As a developer, I want centralized client state for video playback, so that I can manage UI state efficiently.

#### Acceptance Criteria

1. THE Video_Feed_Store SHALL manage currentVideoIndex (number)
2. THE Video_Feed_Store SHALL manage isPlaying (boolean)
3. THE Video_Feed_Store SHALL manage isMuted (boolean)
4. THE Video_Feed_Store SHALL manage visibleVideoIds (string[])
5. THE Video_Feed_Store SHALL provide setCurrentVideoIndex action
6. THE Video_Feed_Store SHALL provide togglePlayback action
7. THE Video_Feed_Store SHALL provide toggleMute action
8. THE Video_Feed_Store SHALL provide setVisibleVideos action
9. THE store SHALL use selectors pattern for all access
10. THE store SHALL keep state flat (no deep nesting)

### Requirement 14: Analytics and Monitoring

**User Story:** As a product manager, I want to track video engagement metrics, so that I can optimize the feed algorithm.

#### Acceptance Criteria

1. THE system SHALL track video view duration
2. THE system SHALL track video completion rate
3. THE system SHALL track like/unlike actions
4. THE system SHALL track share actions and channels
5. THE system SHALL track download actions
6. THE system SHALL track "Book Now" button taps
7. THE system SHALL track "View Listing" button taps
8. THE system SHALL track search icon taps
9. THE system SHALL track buffering events and duration
10. THE system SHALL track video load time
11. THE system SHALL track scroll velocity
12. THE system SHALL track device performance metrics
13. THE analytics SHALL be sent asynchronously
14. THE analytics SHALL NOT block UI interactions

### Requirement 15: Error Handling and Edge Cases

**User Story:** As a tenant user, I want graceful error handling, so that I have a smooth experience even when things go wrong.

#### Acceptance Criteria

1. WHEN video fails to load, THE system SHALL show error message with retry button
2. WHEN network is lost during playback, THE system SHALL pause and show reconnecting message
3. WHEN video format is unsupported, THE system SHALL show format error
4. WHEN feed reaches end, THE system SHALL show "You're all caught up" message
5. WHEN no videos are available, THE system SHALL show empty state with illustration
6. THE empty state SHALL suggest actions (adjust filters, check back later)
7. WHEN like action fails, THE system SHALL revert optimistic update
8. WHEN share action fails, THE system SHALL show error toast
9. WHEN download fails, THE system SHALL show error with retry option
10. THE system SHALL log errors to monitoring service
11. THE system SHALL handle video aspect ratio mismatches gracefully
12. THE system SHALL handle missing thumbnails with placeholder

### Requirement 16: Accessibility

**User Story:** As a user with accessibility needs, I want the video feed to be usable, so that I can browse properties independently.

#### Acceptance Criteria

1. THE video player SHALL have accessibility labels
2. THE engagement buttons SHALL have accessibility labels
3. THE system SHALL support VoiceOver/TalkBack
4. THE system SHALL support dynamic text sizing
5. THE system SHALL provide captions/subtitles option
6. THE system SHALL have sufficient color contrast (WCAG AA)
7. THE interactive elements SHALL have minimum touch target size (44x44)

### Requirement 17: Performance Benchmarks

**User Story:** As a developer, I want clear performance targets, so that I can optimize the feed effectively.

#### Acceptance Criteria

1. THE feed SHALL achieve 60fps during scrolling
2. THE video SHALL start playing within 500ms of becoming visible
3. THE memory usage SHALL stay below 60MB for feed
4. THE app SHALL NOT crash with 100+ videos in feed
5. THE battery drain SHALL be < 10% per hour of usage
6. THE network usage SHALL be optimized with caching
7. THE app size increase SHALL be < 5MB for video feed module

## Summary

This requirements document defines a high-performance, TikTok-style video feed for property discovery. The module implements infinite scrolling with aggressive performance optimizations, rich engagement features, and seamless navigation to booking and property details. The implementation follows the Masqany mobile architecture with TanStack Query for server state, Zustand for client state, FlashList for virtualization, and React Native Reanimated for smooth animations.

**Key Differentiators:**
- Full-screen immersive video experience
- Aggressive memory and performance optimization
- Rich property information overlay
- Seamless booking and listing navigation
- Mock API for development without backend
- Enterprise-grade error handling and analytics
