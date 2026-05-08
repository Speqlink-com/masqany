/**
 * MediaUploader Component
 * 
 * Upload photos and video with validation
 * - Max 6 photos, 4MB total
 * - Max 1 video, 100MB, 60 seconds
 */

import { colors, shadow } from "@/constants/tokens";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

interface MediaUploaderProps {
  photos: string[];
  videoUrl?: string;
  onAddPhoto: (uri: string) => void;
  onRemovePhoto: (index: number) => void;
  onAddVideo: (uri: string) => void;
  onRemoveVideo: () => void;
  maxPhotos?: number;
  maxPhotosSizeMB?: number;
  maxVideoSizeMB?: number;
  maxVideoDurationSeconds?: number;
  errors?: string[];
}

export function MediaUploader({
  photos,
  videoUrl,
  onAddPhoto,
  onRemovePhoto,
  onAddVideo,
  onRemoveVideo,
  maxPhotos = 6,
  maxPhotosSizeMB = 4,
  maxVideoSizeMB = 100,
  maxVideoDurationSeconds = 60,
  errors = [],
}: MediaUploaderProps) {
  // Request permissions
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant camera roll permissions to upload photos."
      );
      return false;
    }
    return true;
  };

  // Pick photo
  const pickPhoto = async () => {
    if (photos.length >= maxPhotos) {
      Alert.alert("Limit Reached", `You can only upload ${maxPhotos} photos.`);
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      // TODO: Validate file size (4MB total for all photos)
      onAddPhoto(uri);
    }
  };

  // Pick video
  const pickVideo = async () => {
    if (videoUrl) {
      Alert.alert("Video Exists", "Please remove the existing video first.");
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await DocumentPicker.getDocumentAsync({
      type: ["video/mp4", "video/quicktime"],
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      const size = result.assets[0].size || 0;

      // Validate size
      if (size > maxVideoSizeMB * 1024 * 1024) {
        Alert.alert(
          "File Too Large",
          `Video must be under ${maxVideoSizeMB}MB.`
        );
        return;
      }

      // TODO: Validate duration (60 seconds)
      onAddVideo(uri);
    }
  };

  return (
    <View>
      {/* Photos Section */}
      <View className="mb-6">
        <Text className="font-poppins-semibold text-[15px] text-dark-400 mb-3">
          Photos ({photos.length}/{maxPhotos})
        </Text>

        <View className="flex-row flex-wrap gap-2">
          {/* Photo Thumbnails */}
          {photos.map((uri, index) => (
            <View key={index} className="relative">
              <Image
                source={{ uri }}
                className="w-[100px] h-[100px] rounded-lg"
                resizeMode="cover"
              />
              {/* Delete Button */}
              <TouchableOpacity
                onPress={() => onRemovePhoto(index)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full items-center justify-center"
                style={{
                  backgroundColor: colors.danger,
                  ...shadow.sm,
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={16} color={colors.light[400]} />
              </TouchableOpacity>
            </View>
          ))}

          {/* Add Photo Button */}
          {photos.length < maxPhotos && (
            <TouchableOpacity
              onPress={pickPhoto}
              className="w-[100px] h-[100px] rounded-lg border-2 border-dashed items-center justify-center"
              style={{
                borderColor: colors.primary[700],
                backgroundColor: colors.primary[50],
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name="add-circle-outline"
                size={32}
                color={colors.primary[700]}
              />
              <Text
                className="font-inter text-[11px] mt-1"
                style={{ color: colors.primary[700] }}
              >
                Add Photo
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Minimum Photos Note */}
        <Text className="font-inter text-[11px] text-dark-100 mt-2">
          Minimum 3 photos required. Total size: {maxPhotosSizeMB}MB max.
        </Text>
      </View>

      {/* Video Section */}
      <View className="mb-4">
        <Text className="font-poppins-semibold text-[15px] text-dark-400 mb-3">
          Video (Optional)
        </Text>

        {videoUrl ? (
          <View className="relative">
            <View
              className="w-full h-[180px] rounded-lg items-center justify-center"
              style={{ backgroundColor: colors.dark[300] }}
            >
              <Ionicons
                name="play-circle"
                size={64}
                color={colors.light[400]}
              />
              <Text className="font-inter text-[13px] text-light-400 mt-2">
                Video Selected
              </Text>
            </View>
            {/* Delete Button */}
            <TouchableOpacity
              onPress={onRemoveVideo}
              className="absolute top-2 right-2 w-8 h-8 rounded-full items-center justify-center"
              style={{
                backgroundColor: colors.danger,
                ...shadow.sm,
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color={colors.light[400]} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={pickVideo}
            className="w-full h-[120px] rounded-lg border-2 border-dashed items-center justify-center"
            style={{
              borderColor: colors.primary[700],
              backgroundColor: colors.primary[50],
            }}
            activeOpacity={0.7}
          >
            <Ionicons
              name="videocam-outline"
              size={40}
              color={colors.primary[700]}
            />
            <Text
              className="font-inter-medium text-[13px] mt-2"
              style={{ color: colors.primary[700] }}
            >
              Add Video
            </Text>
          </TouchableOpacity>
        )}

        <Text className="font-inter text-[11px] text-dark-100 mt-2">
          Max {maxVideoSizeMB}MB, {maxVideoDurationSeconds} seconds. Formats:
          MP4, MOV.
        </Text>
      </View>

      {/* Error Messages */}
      {errors.length > 0 && (
        <View className="mt-2">
          {errors.map((error, index) => (
            <Text
              key={index}
              className="font-inter text-[13px] mb-1"
              style={{ color: colors.danger }}
            >
              • {error}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}
