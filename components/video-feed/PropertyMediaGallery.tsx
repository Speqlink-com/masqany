import type { PropertyVideo } from "@/modules/video-feed/types";
import { Image as ExpoImage } from "expo-image";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageSourcePropType,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function imageSource(source: string | number): ImageSourcePropType {
  return typeof source === "number" ? source : { uri: source };
}

interface PropertyMediaGalleryProps {
  video: PropertyVideo;
  visible?: boolean;
  presentation?: "screen" | "modal";
  onClose?: () => void;
}

function GalleryImage({
  source,
  title,
  countLabel,
}: {
  source: string | number;
  title: string;
  countLabel: string;
}) {
  const [isLoading, setIsLoading] = useState(typeof source === "string");

  return (
    <View className="h-full bg-black" style={{ width: SCREEN_WIDTH }}>
      <ExpoImage
        source={imageSource(source)}
        style={{ flex: 1, width: SCREEN_WIDTH }}
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={180}
        onLoadStart={() => setIsLoading(typeof source === "string")}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />

      {isLoading && (
        <View className="absolute inset-0 items-center justify-center bg-black/40">
          <ActivityIndicator size="large" color="#3fbdfd" />
          <Text className="text-white/80 text-[12px] font-semibold mt-3">
            Loading media
          </Text>
        </View>
      )}

      <View className="absolute inset-0 bg-black/10" />
      <View className="absolute left-4 right-4 bottom-56">
        <Text className="text-white text-[22px] font-bold" numberOfLines={2}>
          {title}
        </Text>
        <Text className="text-white/85 text-[13px] font-medium mt-2">
          {countLabel}
        </Text>
      </View>
    </View>
  );
}

function GalleryContent({
  video,
  presentation = "screen",
  onClose,
}: Omit<PropertyMediaGalleryProps, "visible">) {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = useMemo(
    () => (video.propertyImages?.length ? video.propertyImages : [video.thumbnailUrl]),
    [video.propertyImages, video.thumbnailUrl]
  );

  return (
    <View className="flex-1 bg-black">
      <FlatList
        data={images}
        keyExtractor={(_, index) => `${video.id}-image-${index}`}
        horizontal
        pagingEnabled
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
        removeClippedSubviews
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          setActiveIndex(Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH));
        }}
        renderItem={({ item, index }) => (
          <GalleryImage
            source={item}
            title={video.title}
            countLabel={`${index + 1} of ${images.length} property photos`}
          />
        )}
      />

      <View className="absolute top-10 left-4 right-4 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.78}
          className="bg-black/50 rounded-full px-4 py-2"
        >
          <Text className="text-white text-[13px] font-semibold">
            {presentation === "modal" ? "Close" : "Back to video"}
          </Text>
        </TouchableOpacity>

        <View className="bg-black/50 rounded-full px-3 py-2 flex-row items-center">
          <Image
            source={require("@/assets/icons/gallery-icon.webp")}
            className="w-4 h-4 mr-2"
            resizeMode="contain"
            style={{ tintColor: "#FFFFFF" }}
          />
          <Text className="text-white text-[12px] font-semibold">
            {activeIndex + 1}/{images.length}
          </Text>
        </View>
      </View>

      <View className="absolute bottom-44 left-0 right-0 flex-row justify-center gap-2">
        {images.map((_, index) => (
          <View
            key={`${video.id}-dot-${index}`}
            className={`h-2 rounded-full ${index === activeIndex ? "w-6 bg-[#3fbdfd]" : "w-2 bg-white/60"}`}
          />
        ))}
      </View>

      <View className="absolute bottom-28 left-4 right-4 flex-row items-center justify-between rounded-[24px] bg-black/60 px-4 py-3">
        <View className="flex-1 pr-3">
          <Text className="text-white text-[13px] font-bold" numberOfLines={1}>
            {video.owner.name}
          </Text>
          <Text className="text-white/70 text-[11px] font-medium" numberOfLines={1}>
            KES {video.price.toLocaleString()}/{video.priceUnit} • {video.location.estate}
          </Text>
        </View>
        <Image
          source={require("@/assets/icons/verified-check-icon.webp")}
          className="w-5 h-5"
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

export function PropertyMediaGallery({
  video,
  visible = true,
  presentation = "screen",
  onClose,
}: PropertyMediaGalleryProps) {
  if (presentation === "modal") {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <GalleryContent video={video} presentation={presentation} onClose={onClose} />
      </Modal>
    );
  }

  return <GalleryContent video={video} presentation={presentation} onClose={onClose} />;
}
