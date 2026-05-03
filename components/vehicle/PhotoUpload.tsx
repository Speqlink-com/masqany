/**
 * PhotoUpload Component
 * 
 * Multiple photo upload with grid display (3-10 photos, 5MB each)
 * Accepts: JPEG, PNG, HEIC
 * Uses NativeWind for styling
 */

import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

interface PhotoUploadProps {
  photos: string[]; // Array of photo URIs
  onAddPhoto: (file: { uri: string; type: string; name: string }) => void;
  onRemovePhoto: (index: number) => void;
  minPhotos?: number;
  maxPhotos?: number;
  error?: string;
}

export function PhotoUpload({
  photos,
  onAddPhoto,
  onRemovePhoto,
  minPhotos = 3,
  maxPhotos = 10,
  error,
}: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleAddPhoto = async () => {
    if (photos.length >= maxPhotos) {
      Alert.alert("Maximum Photos", `You can only upload up to ${maxPhotos} photos.`);
      return;
    }

    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Please grant camera roll permissions to upload photos.");
        return;
      }

      // Show picker options
      Alert.alert(
        "Add Photo",
        "Choose upload method",
        [
          {
            text: "Take Photo",
            onPress: handleTakePhoto,
          },
          {
            text: "Choose from Library",
            onPress: handleChooseFromLibrary,
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
    } catch (error) {
      console.error("Error adding photo:", error);
      Alert.alert("Error", "Failed to open photo picker");
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Please grant camera permissions.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const file = {
          uri: asset.uri,
          type: "image/jpeg",
          name: `vehicle_photo_${Date.now()}.jpg`,
        };

        setIsUploading(true);
        onAddPhoto(file);
        setIsUploading(false);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const handleChooseFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const file = {
          uri: asset.uri,
          type: "image/jpeg",
          name: `vehicle_photo_${Date.now()}.jpg`,
        };

        setIsUploading(true);
        onAddPhoto(file);
        setIsUploading(false);
      }
    } catch (error) {
      console.error("Error choosing from library:", error);
      Alert.alert("Error", "Failed to choose photo");
    }
  };

  const handleRemovePhoto = (index: number) => {
    Alert.alert(
      "Remove Photo",
      "Are you sure you want to remove this photo?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => onRemovePhoto(index),
        },
      ]
    );
  };

  return (
    <View className="mb-4">
      {/* Label */}
      <Text className="font-inter-medium text-[15px] text-dark-400 mb-2">
        Vehicle Photos <Text className="text-danger">*</Text>
      </Text>

      <Text className="font-inter text-[13px] text-dark-100 mb-3">
        Upload {minPhotos}-{maxPhotos} photos ({photos.length}/{maxPhotos})
      </Text>

      {/* Photo Grid */}
      <View className="flex-row flex-wrap gap-2">
        {/* Existing Photos */}
        {photos.map((photo, index) => (
          <View key={index} className="relative">
            <Image
              source={{ uri: photo }}
              className="w-24 h-24 rounded-lg"
              resizeMode="cover"
            />
            {/* Remove Button */}
            <TouchableOpacity
              onPress={() => handleRemovePhoto(index)}
              className="absolute -top-2 -right-2 bg-danger rounded-full p-1"
            >
              <Ionicons name="close" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ))}

        {/* Add Photo Button */}
        {photos.length < maxPhotos && (
          <TouchableOpacity
            onPress={handleAddPhoto}
            disabled={isUploading}
            className="w-24 h-24 border-2 border-dashed border-primary-700 rounded-lg items-center justify-center bg-primary-50"
          >
            <Ionicons name="camera-outline" size={32} color="#20A6FD" />
            <Text className="font-inter text-[11px] text-primary-700 mt-1">
              Add Photo
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Error Message */}
      {error && (
        <Text className="font-inter text-[13px] text-danger mt-2">
          {error}
        </Text>
      )}

      {/* Helper Text */}
      {!error && photos.length < minPhotos && (
        <Text className="font-inter text-[11px] text-dark-100 mt-2">
          Minimum {minPhotos} photos required. Add {minPhotos - photos.length} more.
        </Text>
      )}
    </View>
  );
}
