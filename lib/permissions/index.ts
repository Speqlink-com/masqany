/**
 * Permissions — PLACEHOLDER.
 *
 * Permissions required by Masqany:
 *   - Camera: property photo/video upload
 *   - Media library: selecting existing photos/videos
 *   - Location: map-based property search, "near me" filter
 *   - Notifications: booking updates, chat messages, price alerts
 *   - Microphone: future voice search / AI agent voice input
 *
 * Pattern: request permissions lazily (at the point of use), not on app boot.
 * Always explain why the permission is needed before requesting it.
 *
 * TODO: implement using expo-camera, expo-media-library,
 *       expo-location, expo-notifications.
 */

export const permissions = {
  requestCamera: async (): Promise<boolean> => {
    // TODO: implement
    return false;
  },
  requestLocation: async (): Promise<boolean> => {
    // TODO: implement
    return false;
  },
  requestNotifications: async (): Promise<boolean> => {
    // TODO: implement
    return false;
  },
};
