/**
 * Analytics — PLACEHOLDER.
 *
 * Will track:
 *   - Screen views (via Expo Router navigation events)
 *   - Property impressions and clicks (feed engagement)
 *   - Search queries and filter usage
 *   - Booking funnel drop-off
 *   - AI agent interaction quality
 *
 * Candidate: Expo Analytics, Segment, or a self-hosted PostHog instance.
 * All events should be anonymized and GDPR/Kenya Data Protection Act compliant.
 *
 * TODO: implement when analytics provider is selected.
 */

export const analytics = {
  track: (_event: string, _properties?: Record<string, unknown>) => {
    // TODO: send event to analytics provider
  },
  screen: (_name: string, _properties?: Record<string, unknown>) => {
    // TODO: track screen view
  },
  identify: (_userId: string, _traits?: Record<string, unknown>) => {
    // TODO: identify user
  },
};
