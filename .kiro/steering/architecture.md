---
inclusion: always
---

# Masqany Mobile — Architecture Guide

## Core Principle: Two-Layer State

| Layer | Owner | Examples |
|---|---|---|
| Server state | TanStack Query | Properties, search results, bookings, chat history |
| Client state | Zustand | Auth session, video mute/play, active filters, map viewport |

Never mix these. A component that needs both imports from both — they do not share a store.

## Folder Structure

```
app/                    Expo Router screens (file-based routing only)
  (auth)/               Auth group: sign-up, forgot-password
  (tabs)/               Main tab navigator: home, chat-agent, move, profile
  (registration)/       Host flows: property-registration, vehicle-registration
  _layout.tsx           Root layout — QueryClientProvider lives here

modules/                Feature domains (the core of the app)
  auth/                 api.ts · hooks.ts · index.ts
  property/             api.ts · hooks.ts · types.ts · index.ts
  booking/              api.ts · hooks.ts · types.ts · index.ts
  chat/                 api.ts · hooks.ts · types.ts · index.ts
  search/               api.ts · hooks.ts · types.ts · index.ts
  move/                 api.ts · hooks.ts · types.ts · index.ts

lib/
  api/client.ts         Single Axios instance — auth interceptors, error normalization
  query/client.ts       Single QueryClient — mobile-optimized defaults
  ws/client.ts          WebSocket placeholder (real-time chat, live updates)
  offline/index.ts      Offline queue placeholder (mutation replay on reconnect)
  analytics/index.ts    Analytics placeholder
  permissions/index.ts  Device permissions placeholder

store/
  auth.store.ts         Zustand: session tokens + user profile
  ui.store.ts           Zustand: feed playback, search filters, map viewport

constants/
  tokens.ts             Design tokens (colors, typography, spacing, shadows)
  icons.ts              All icon asset imports
  images.ts             All image asset imports
  data.ts               Static mock data

types/
  index.ts              Shared global types (User) + re-exports from modules
```

## Module Pattern

Every module follows the same internal contract:

```
modules/[domain]/
  types.ts    TypeScript interfaces for this domain
  api.ts      Axios calls — no component imports this directly
  hooks.ts    TanStack Query hooks — the only public API for data
  index.ts    Re-exports everything (import from modules/property, not modules/property/hooks)
```

## API Layer Rules

- **No component ever calls `apiClient` directly.** All HTTP calls go through a module's `api.ts`.
- **No component ever calls `api.ts` directly.** All data access goes through a module's `hooks.ts`.
- The `apiClient` in `lib/api/client.ts` is the single Axios instance. Never create another.

## TanStack Query Conventions

- Query keys are defined as `const` arrays in each module's `hooks.ts` (e.g., `propertyKeys`).
- Use `useInfiniteQuery` for paginated feeds (property feed, chat messages).
- Use `useMutation` + `queryClient.invalidateQueries` for writes.
- `staleTime` defaults to 5 min (set in `lib/query/client.ts`). Override per-query for fresher data (e.g., chat: 30s).

## Design Tokens

All colors, spacing, typography, and shadows are defined in `constants/tokens.ts` and mirrored in `tailwind.config.ts`. Never hardcode a hex value in a component. Use:
- Tailwind classes (`className="bg-primary-700"`) for NativeWind-compatible components
- Token values (`colors.primary[700]`) for StyleSheet.create() or props that don't accept className

## Brand Palette

| Token | Value | Use |
|---|---|---|
| `primary-700` | `#20A6FD` | Primary actions, active states |
| `primary-600` | `#28B4FA` | Hover/pressed states |
| `primary-800` | `#004AAD` | Deep navy, gradient end |
| `gradient-start` | `#5DE0E6` | Gradient teal start |
| `secondary` | `#FFCB1A` | Highlights, badges |
| `danger` | `#F75555` | Errors, destructive actions |

## Placeholders (implement when ready)

- `lib/ws/client.ts` — WebSocket for real-time chat and live updates
- `lib/offline/index.ts` — Mutation queue + NetInfo for offline resilience
- `lib/analytics/index.ts` — Event tracking (screen views, feed engagement)
- `lib/permissions/index.ts` — Camera, location, notifications
