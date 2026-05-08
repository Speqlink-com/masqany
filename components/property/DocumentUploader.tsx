/**
 * DocumentUploader Component
 * 
 * PDF document uploader with validation
 * Max 10MB per document
 */

import { colors } from "@/constants/tokens";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

interface DocumentUploaderProps {
  label: string;
  documentUrl?: string;
  onUpload: (uri: string) => void;
  onRemove: () => void;
  required?: boolean;
  maxSizeMB?: number;
}

export function DocumentUploader({
  label,
  documentUrl,
  onUpload,
  onRemove,
  required = false,
  maxSizeMB = 10,
}: DocumentUploaderProps) {
  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      const size = result.assets[0].size || 0;

      // Validate size
      if (size > maxSizeMB * 1024 * 1024) {
        Alert.alert(
          "File Too Large",
          `Document must be under ${maxSizeMB}MB.`
        );
        return;
      }

      onUpload(uri);
    }
  };

  return (
    <View className="mb-4">
      <Text className="font-poppins-semibold text-[15px] text-dark-400 mb-2">
        {label} {required && <Text style={{ color: colors.danger }}>*</Text>}
      </Text>

      {documentUrl ? (
        <View
          className="flex-row items-center justify-between p-4 rounded-lg"
          style={{ backgroundColor: colors.primary[50] }}
        >
          <View className="flex-row items-center flex-1">
            <Ionicons
              name="document-text"
              size={24}
              color={colors.primary[700]}
            />
            <Text
              className="font-inter text-[13px] ml-2 flex-1"
              style={{ color: colors.primary[700] }}
              numberOfLines={1}
            >
              Document uploaded
            </Text>
          </View>
          <TouchableOpacity
            onPress={onRemove}
            className="w-8 h-8 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.danger }}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={18} color={colors.light[400]} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={pickDocument}
          className="flex-row items-center justify-center p-4 rounded-lg border-2 border-dashed"
          style={{
            borderColor: colors.primary[700],
            backgroundColor: colors.primary[50],
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name="cloud-upload-outline"
            size={24}
            color={colors.primary[700]}
          />
          <Text
            className="font-inter-medium text-[13px] ml-2"
            style={{ color: colors.primary[700] }}
          >
            Upload PDF (Max {maxSizeMB}MB)
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
