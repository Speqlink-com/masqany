# Video Feed Search and Filters

## Scope

This milestone adds a testable search and filter experience for the video feed while the backend is still pending.

## Current Flow

- `components/video-feed/CTAButtons.tsx` now includes a filter property action.
- The existing feed search icon opens `app/search.tsx`.
- Tapping a search result routes back to `/(tabs)/home` with `videoId`, and the feed scrolls to that video.
- Search results use `assets/data/video-feed.ts` and local images from `assets/prop-images`.

## Filter Behavior

The search screen supports:

- Text search across title, description, type, estate, and county.
- Property type filtering for long-stay and short-stay types.
- Price range filtering.
- Location filtering.
- Availability filtering excludes `occupied` units and displays only:
  - `vacant` as available now.
  - `soon_vacant` as coming soon.

## Backend Handoff

When APIs are ready, replace the local `mockVideoFeedData` filtering in `app/search.tsx` with a TanStack Query hook backed by `modules/search/api.ts`.

Expected backend fields should match the existing `PropertyVideo` contract:

- `id`
- `videoUrl`
- `thumbnailUrl` or image preview URLs
- `propertyType`
- `price`
- `priceUnit`
- `location.estate`
- `unitStatus`
- `availableDate`

Keep the UI availability rule in place: search should not show occupied units.
