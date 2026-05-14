/**
 * PropertyInfo component — Display property details with expandable description
 * 
 * Features:
 * - Semi-transparent black background
 * - Property name with "...more" suffix (2 lines max)
 * - Unit status badge (green for vacant, yellow for soon vacant)
 * - Location badge with icon (tappable to open map)
 * - Property type with house icon
 * - Price prominently displayed
 * - Expandable description modal
 */

import type { PropertyVideo } from "@/modules/video-feed/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface PropertyInfoProps {
  property: PropertyVideo;
  onLocationPress: (coords: [number, number]) => void;
}

export function PropertyInfo({ property, onLocationPress }: PropertyInfoProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Format available date
  const formatAvailableDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <View className="bg-black/60 p-4 rounded-t-2xl mb-8">
        {/* Property Title */}
        <TouchableOpacity onPress={() => setShowFullDescription(true)}>
          <Text className="text-white text-[17px] font-semibold" numberOfLines={2}>
            {property.title}
            <Text className="text-white/70"> ...more</Text>
          </Text>
        </TouchableOpacity>

        {/* Unit Status and Brand New Badge */}
        <View className="flex-row items-center mt-2">
          <View
            className={`px-3 py-1 rounded-full ${
              property.unitStatus === "vacant" ? "bg-green-500" : "bg-yellow-500"
            }`}
          >
            <Text className="text-white text-[13px] font-medium">
              {property.unitStatus === "vacant" ? "Vacant" : "Soon Vacant"}
            </Text>
          </View>
          {property.unitStatus === "soon_vacant" && property.availableDate && (
            <Text className="text-white text-[13px] ml-2">
              Available: {formatAvailableDate(property.availableDate)}
            </Text>
          )}
          {property.isNew && (
            <View className="px-3 py-1 rounded-full bg-[#F97316] ml-2">
              <Text className="text-white text-[13px] font-medium">
                Brand New
              </Text>
            </View>
          )}
        </View>

        {/* Location and Property Type */}
        <View className="flex-row items-center mt-3 space-x-4">
          {/* Location */}
          <TouchableOpacity
            onPress={() => onLocationPress(property.location.coordinates)}
            className="flex-row items-center"
            activeOpacity={0.7}
          >
            <Image
              source={require("@/assets/icons/location.png")}
              className="w-4 h-4 mr-2"
              resizeMode="contain"
              style={{ tintColor: "#FFFFFF" }}
            />
            <Text className="text-white text-[13px] font-medium">
              {property.location.estate}, {property.location.county}
            </Text>
          </TouchableOpacity>

          {/* Property Type */}
          <View className="flex-row items-center">
            <Image
              source={require("@/assets/icons/house-icon.webp")}
              className="w-4 h-4 mr-1"
            />
            <Text className="text-white text-[13px] font-medium">
              {property.propertyType}
            </Text>
          </View>
        </View>

        {/* Price */}
        <Text className="text-blue-500 text-[19px] font-bold mt-3">
          KES {property.price.toLocaleString()}/{property.priceUnit}
        </Text>
      </View>

      {/* Full Description Modal */}
      <Modal
        visible={showFullDescription}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFullDescription(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowFullDescription(false)}
          className="flex-1 bg-black/50 justify-end"
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
              {/* Close Button */}
              <TouchableOpacity
                onPress={() => setShowFullDescription(false)}
                className="absolute top-4 right-4 z-10"
              >
                <Ionicons name="close-circle" size={32} color="#000" />
              </TouchableOpacity>

              {/* Title */}
              <Text className="text-black text-xl font-bold mb-4 pr-10">
                {property.title}
              </Text>

              {/* Description */}
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text className="text-gray-700 text-base leading-6 mb-4">
                  {property.description}
                </Text>

                {/* Property Details */}
                <View className="space-y-2">
                  <Text className="text-gray-900 font-semibold">Property Details:</Text>
                  <Text className="text-gray-700">
                    • Bedrooms: {property.bedrooms}
                  </Text>
                  <Text className="text-gray-700">
                    • Bathrooms: {property.bathrooms}
                  </Text>
                  {property.size && (
                    <Text className="text-gray-700">
                      • Size: {property.size} sqft
                    </Text>
                  )}
                </View>

                {/* Amenities */}
                {property.amenities.length > 0 && (
                  <View className="mt-4">
                    <Text className="text-gray-900 font-semibold mb-2">Amenities:</Text>
                    <View className="flex-row flex-wrap">
                      {property.amenities.map((amenity, index) => (
                        <View
                          key={index}
                          className="bg-blue-100 px-3 py-1 rounded-full mr-2 mb-2"
                        >
                          <Text className="text-blue-700 text-sm">{amenity}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
