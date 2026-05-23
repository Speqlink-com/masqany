import React from "react";
import { ImageBackground, Text, View } from "react-native";

export default function AllUnitsScreen() {
  return (
    <ImageBackground
      source={require("@/assets/images/app-full-screen.webp")}
      className="flex-1"
      resizeMode="cover"
    >
      <View className="absolute top-0 left-0 right-0 h-[3.5%] bg-[#20A6FD] z-50" />
      
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-[24px] font-poppins-semibold text-black mb-4 text-center">
          All Units
        </Text>
        <Text className="text-[16px] font-inter text-[#545454] text-center">
          View all units across all properties
        </Text>
        <Text className="text-[14px] font-inter text-[#9CA3AF] text-center mt-4">
          Coming Soon
        </Text>
      </View>

      <View className="absolute bottom-0 left-0 right-0 h-[100px] bg-[#20A6FD] z-40">
        <View className="h-[1px] bg-black" />
      </View>
    </ImageBackground>
  );
}
