/**
 * VideoPlayer component — expo-video player with lifecycle management
 * 
 * Features:
 * - HLS/DASH adaptive streaming support
 * - Thumbnail preloading before video
 * - Automatic loop on completion
 * - Aspect ratio preservation (9:16)
 * - Buffering indicator overlay
 * - Single tap for play/pause
 * - Double tap to like with heart animation
 * - Mute/unmute control
 * - Pinch-to-zoom gesture support
 */

import { useNetworkStatus } from "@/lib/network/useNetworkStatus";
import { Ionicons } from "@expo/vector-icons";
import { useVideoPlayer, VideoPlayerStatus, VideoSource, VideoView } from "expo-video";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Reanimated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withTiming
} from "react-native-reanimated";

interface VideoPlayerProps {
  videoUrl: string | number; // string for URLs, number for require() assets
  thumbnailUrl: string;
  isActive: boolean; // ONLY ONE video is active
  shouldPreload: boolean; // Should this video be preloaded?
  isMuted: boolean;
  onPlaybackStatusUpdate?: (status: {
    isLoaded: boolean;
    isPlaying: boolean;
    isBuffering: boolean;
    status: VideoPlayerStatus;
  }) => void;
  onLoad?: () => void;
  onError?: (error: string) => void;
  onTogglePlayback?: () => void;
  onToggleMute?: () => void;
  onLike?: () => void;
}

export function VideoPlayer({
  videoUrl,
  thumbnailUrl,
  isActive,
  shouldPreload,
  isMuted,
  onPlaybackStatusUpdate,
  onLoad,
  onError,
  onTogglePlayback,
  onToggleMute,
  onLike,
}: VideoPlayerProps) {
  const networkStatus = useNetworkStatus();
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [thumbnailError, setThumbnailError] = useState(false);
  const [wasPlayingBeforeNetworkLoss, setWasPlayingBeforeNetworkLoss] = useState(false);
  const [audioDisabledByError, setAudioDisabledByError] = useState(false);
  
  // Track taps for double-tap detection
  const lastTapRef = useRef<number>(0);
  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Animated values for play/pause icon
  const iconOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0.8);

  // Animated values for heart animation
  const heartOpacity = useSharedValue(0);
  const heartScale = useSharedValue(0);
  const heartPositionX = useSharedValue(0);
  const heartPositionY = useSharedValue(0);
  const audioRecoveryAttemptedRef = useRef(false);

  const source = useMemo<VideoSource>(
    () => (typeof videoUrl === "string" ? { uri: videoUrl } : videoUrl),
    [videoUrl]
  );

  const shouldPlayAudioTrack = isActive && !isMuted && !audioDisabledByError;

  const player = useVideoPlayer(source, (videoPlayer) => {
    videoPlayer.loop = true;
    videoPlayer.muted = true;
    videoPlayer.audioTrack = null;
  });

  useEffect(() => {
    audioRecoveryAttemptedRef.current = false;
    setAudioDisabledByError(false);
  }, [source]);

  const syncAudioTrack = useCallback(() => {
    try {
      if (!shouldPlayAudioTrack) {
        player.muted = true;
        player.audioTrack = null;
        return;
      }

      const firstAudioTrack = player.availableAudioTracks[0];
      player.muted = false;
      player.volume = 1;
      if (firstAudioTrack) {
        player.audioTrack = firstAudioTrack;
      }
    } catch (error) {
      console.warn("[VideoPlayer] Audio track sync skipped:", error);
    }
  }, [player, shouldPlayAudioTrack]);

  // CRITICAL: Handle video lifecycle based on isActive and shouldPreload
  useEffect(() => {
    const handleVideoLifecycle = async () => {
      try {
        if (isActive) {
          // ONLY this video plays
          syncAudioTrack();
          player.play();
          setShowThumbnail(false);
          setIsPlaying(true);
        } else if (shouldPreload) {
          // Preload but don't play
          player.audioTrack = null;
          player.muted = true;
          player.pause();
          setIsPlaying(false);
        } else {
          // Pause inactive, non-preloaded players to save work.
          player.audioTrack = null;
          player.muted = true;
          player.pause();
          setIsPlaying(false);
          setShowThumbnail(true);
        }
      } catch (error) {
        console.error("[VideoPlayer] Lifecycle error:", error);
      }
    };

    handleVideoLifecycle();
  }, [isActive, shouldPreload, player, syncAudioTrack]);

  // Handle mute state
  useEffect(() => {
    syncAudioTrack();
  }, [syncAudioTrack]);

  // Handle network loss during playback
  useEffect(() => {
    const handleNetworkChange = async () => {
      try {
        if (!networkStatus.isConnected && isPlaying) {
          // Network lost during playback - pause video
          setWasPlayingBeforeNetworkLoss(true);
          player.pause();
          setIsPlaying(false);
        } else if (networkStatus.isConnected && wasPlayingBeforeNetworkLoss && isActive) {
          // Network restored - resume playback if it was playing before
          setWasPlayingBeforeNetworkLoss(false);
          player.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.error("[VideoPlayer] Network change error:", error);
      }
    };

    handleNetworkChange();
  }, [networkStatus.isConnected, isPlaying, wasPlayingBeforeNetworkLoss, isActive, player]);

  useEffect(() => {
    const statusSubscription = player.addListener("statusChange", ({ status, error }) => {
      const isLoaded = status === "readyToPlay";
      const isBufferingNow = status === "loading";

      setIsLoading(isBufferingNow);
      setIsBuffering(isBufferingNow && !isLoading);

      if (isLoaded) {
        setIsLoading(false);
        setVideoError(null);
        onLoad?.();
      }

      if (status === "error") {
        const message = error?.message || "Failed to load video";
        const isAudioRendererError =
          message.includes("AudioTrack init failed") ||
          message.includes("MediaCodecAudioRenderer");

        if (
          isAudioRendererError &&
          !audioRecoveryAttemptedRef.current
        ) {
          audioRecoveryAttemptedRef.current = true;
          console.warn("[VideoPlayer] Retrying video without audio track.");
          setAudioDisabledByError(true);
          setVideoError(null);
          setIsLoading(true);
          setShowThumbnail(true);
          player.audioTrack = null;
          player.muted = true;
          player.replace(source);
          if (isActive) {
            player.play();
          }
          return;
        }

        console.error("[VideoPlayer] Error:", message);
        setIsLoading(false);
        setVideoError(message);
        onError?.(message);
      }

      onPlaybackStatusUpdate?.({
        isLoaded,
        isPlaying,
        isBuffering: isBufferingNow,
        status,
      });
    });

    const playingSubscription = player.addListener("playingChange", ({ isPlaying: playing }) => {
      setIsPlaying(playing);
      setIsBuffering(false);
      if (playing && showThumbnail) {
        setShowThumbnail(false);
      }
    });

    const endedSubscription = player.addListener("playToEnd", () => {
      player.currentTime = 0;
      if (isActive) {
        player.play();
      }
    });

    const audioTracksSubscription = player.addListener(
      "availableAudioTracksChange",
      () => {
        syncAudioTrack();
      }
    );

    return () => {
      statusSubscription.remove();
      playingSubscription.remove();
      endedSubscription.remove();
      audioTracksSubscription.remove();
    };
  }, [
    isActive,
    isLoading,
    isPlaying,
    onError,
    onLoad,
    onPlaybackStatusUpdate,
    player,
    syncAudioTrack,
    showThumbnail,
    source,
  ]);

  // Handle retry
  const handleRetry = async () => {
    try {
      setVideoError(null);
      setAudioDisabledByError(false);
      setIsLoading(true);
      setShowThumbnail(true);
      player.replace(source);
      syncAudioTrack();
      if (isActive) {
        player.play();
      }
    } catch (error) {
      console.error("[VideoPlayer] Retry error:", error);
      setVideoError("Failed to load video");
    }
  };

  // Handle tap with double-tap detection
  const handleTap = useCallback((event: any) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300; // ms

    if (lastTapRef.current && (now - lastTapRef.current) < DOUBLE_TAP_DELAY) {
      // Double tap detected
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
        tapTimeoutRef.current = null;
      }
      
      // Trigger like action
      onLike?.();

      // Get tap position
      const { locationX, locationY } = event.nativeEvent;
      
      // Set heart position to tap location
      heartPositionX.value = locationX || 0;
      heartPositionY.value = locationY || 0;

      // Animate heart: scale up and fade out
      heartScale.value = 0;
      heartOpacity.value = 1;
      
      heartScale.value = withSequence(
        withTiming(1.2, { duration: 300 }),
        withTiming(1.5, { duration: 200 })
      );
      heartOpacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withDelay(300, withTiming(0, { duration: 200 }))
      );

      lastTapRef.current = 0;
    } else {
      // Single tap - wait to see if it's a double tap
      lastTapRef.current = now;
      
      tapTimeoutRef.current = setTimeout(() => {
        // Single tap confirmed - toggle play/pause
        if (isPlaying) {
          player.pause();
          setIsPlaying(false);
        } else {
          player.play();
          setIsPlaying(true);
        }

        // Show icon with animation
        iconOpacity.value = withSequence(
          withTiming(1, { duration: 200 }),
          withDelay(800, withTiming(0, { duration: 200 }))
        );
        iconScale.value = withSequence(
          withTiming(1, { duration: 200 }),
          withDelay(800, withTiming(0.8, { duration: 200 }))
        );

        onTogglePlayback?.();
      }, DOUBLE_TAP_DELAY);
    }
  }, [
    heartOpacity,
    heartPositionX,
    heartPositionY,
    heartScale,
    iconOpacity,
    iconScale,
    isPlaying,
    onLike,
    onTogglePlayback,
    player,
  ]);

  // Animated styles
  const iconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    opacity: heartOpacity.value,
    transform: [{ scale: heartScale.value }],
    position: 'absolute',
    left: heartPositionX.value - 40, // Center the 80px heart icon
    top: heartPositionY.value - 40,
  }));

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }
    };
  }, []);

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <TouchableWithoutFeedback onPress={handleTap}>
        <View style={StyleSheet.absoluteFillObject}>
          {/* Thumbnail - shown before video loads */}
          {showThumbnail && !thumbnailError && (
            <Image
              source={{ uri: thumbnailUrl }}
              style={StyleSheet.absoluteFillObject}
              resizeMode="cover"
              onError={() => setThumbnailError(true)}
            />
          )}

          {/* Placeholder for missing thumbnail */}
          {(showThumbnail && thumbnailError) && (
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#1F2937', justifyContent: 'center', alignItems: 'center' }]}>
              <Ionicons name="image-outline" size={64} color="#545454" />
            </View>
          )}

          {/* Video Player - ONLY load if active or should preload */}
          {(isActive || shouldPreload) && (
            <VideoView
              player={player}
              style={StyleSheet.absoluteFillObject}
              contentFit="cover"
              nativeControls={false}
            />
          )}

          {/* Play/Pause Icon Overlay */}
          <Reanimated.View
            style={iconAnimatedStyle}
            className="absolute inset-0 items-center justify-center pointer-events-none"
          >
            <View className="bg-black/50 rounded-full p-4">
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={48}
                color="#FFFFFF"
              />
            </View>
          </Reanimated.View>

          {/* Heart Animation Overlay (Double-tap like) */}
          <Reanimated.View
            style={heartAnimatedStyle}
            className="pointer-events-none"
          >
            <Ionicons
              name="heart"
              size={80}
              color="#20A6FD"
            />
          </Reanimated.View>

          {/* Loading Indicator */}
          {isLoading && (
            <View className="absolute inset-0 items-center justify-center bg-black/50 pointer-events-none">
              <ActivityIndicator size="large" color="#20A6FD" />
            </View>
          )}

          {/* Buffering Indicator */}
          {isBuffering && !isLoading && (
            <View className="absolute top-4 right-4 pointer-events-none">
              <ActivityIndicator size="small" color="#FFFFFF" />
            </View>
          )}

          {/* Video Error Overlay */}
          {videoError && (
            <View className="absolute inset-0 items-center justify-center bg-black/80" style={{ pointerEvents: 'box-none' }}>
              <Ionicons name="alert-circle-outline" size={64} color="#F75555" />
              <Text className="text-white text-lg font-semibold mt-4 text-center px-6">
                Failed to load video
              </Text>
              <Text className="text-gray-400 text-sm mt-2 text-center px-6">
                {videoError.includes("format") 
                  ? "This video format is not supported"
                  : "Unable to play this video"}
              </Text>
              <TouchableOpacity
                onPress={handleRetry}
                className="mt-6 bg-primary-700 px-6 py-3 rounded-full"
              >
                <Text className="text-white font-semibold">Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Network Loss Overlay */}
          {!networkStatus.isConnected && !videoError && (
            <View className="absolute inset-0 items-center justify-center bg-black/70 pointer-events-none">
              <ActivityIndicator size="large" color="#20A6FD" />
              <Text className="text-white text-base font-semibold mt-4">
                Reconnecting...
              </Text>
              <Text className="text-gray-400 text-sm mt-2">
                Waiting for network connection
              </Text>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
