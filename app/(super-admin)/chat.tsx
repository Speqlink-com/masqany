/**
 * Super Admin - Chat with Admins Screen
 * Communication channel between super admins and admins
 */

import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    FlatList,
    Image,
    ImageBackground,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock chat data
const mockChats = [
  {
    id: "1",
    adminName: "John Doe",
    adminEmail: "john@masqany.com",
    lastMessage: "I've completed the property verification tasks",
    timestamp: "2 min ago",
    unreadCount: 2,
    online: true,
  },
  {
    id: "2",
    adminName: "Jane Smith",
    adminEmail: "jane@masqany.com",
    lastMessage: "Need clarification on the new policy",
    timestamp: "15 min ago",
    unreadCount: 0,
    online: true,
  },
  {
    id: "3",
    adminName: "Mike Johnson",
    adminEmail: "mike@masqany.com",
    lastMessage: "Thanks for the update!",
    timestamp: "1 hour ago",
    unreadCount: 0,
    online: false,
  },
];

export default function ChatScreen() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const renderChatItem = ({ item }: { item: typeof mockChats[0] }) => (
    <TouchableOpacity
      className="mb-2"
      style={{
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View className="flex-row items-center">
        {/* Avatar with online indicator */}
        <View className="mr-3">
          <Image
            source={require("@/assets/icons/user-profile-icon.webp")}
            className="w-14 h-14"
            resizeMode="contain"
          />
          {item.online && (
            <View
              className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white"
              style={{ backgroundColor: "#4CAF50" }}
            />
          )}
        </View>

        {/* Chat Info */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-gray-900 font-semibold text-base">
              {item.adminName}
            </Text>
            <Text className="text-gray-500 text-xs">{item.timestamp}</Text>
          </View>
          <Text className="text-gray-600 text-sm mb-1" numberOfLines={1}>
            {item.lastMessage}
          </Text>
          <Text className="text-gray-400 text-xs">{item.adminEmail}</Text>
        </View>

        {/* Unread Badge */}
        {item.unreadCount > 0 && (
          <View
            className="ml-2 w-6 h-6 rounded-full items-center justify-center"
            style={{ backgroundColor: "#20A6FD" }}
          >
            <Text className="text-white text-xs font-bold">
              {item.unreadCount}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <ImageBackground
        source={require("@/assets/images/app-full-screen.webp")}
        className="flex-1"
        resizeMode="cover"
      >
        <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
          {/* Header */}
          <View className="px-5 pt-3 pb-4">
            <View className="flex-row items-center justify-between mb-4">
              <TouchableOpacity
                onPress={() => setSidebarVisible(!sidebarVisible)}
                className="p-2"
              >
                <Image
                  source={require("@/assets/icons/menu.png")}
                  className="w-7 h-7"
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <Text className="text-2xl font-bold text-gray-900">
                Admin Chat
              </Text>

              <TouchableOpacity className="p-2">
                <Image
                  source={require("@/assets/icons/sa-notification.webp")}
                  className="w-7 h-7"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View
              className="flex-row items-center px-4 py-3 rounded-full"
              style={{ backgroundColor: "#f5f5f5" }}
            >
              <Image
                source={require("@/assets/icons/search.png")}
                className="w-5 h-5 mr-2"
                resizeMode="contain"
              />
              <TextInput
                placeholder="Search conversations..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 text-base"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Chat List */}
          <View className="flex-1 px-5">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-gray-900 font-bold text-lg">
                Conversations
              </Text>
              <View className="flex-row items-center">
                <View
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: "#4CAF50" }}
                />
                <Text className="text-gray-600 text-sm">
                  {mockChats.filter((c) => c.online).length} Online
                </Text>
              </View>
            </View>

            <FlatList
              data={mockChats}
              renderItem={renderChatItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 120 }}
            />
          </View>
        </SafeAreaView>

        {/* Bottom Bar */}
        <View className="absolute bottom-0 left-0 right-0 h-[100px] bg-[#3fbdfd] z-50">
          <View className="h-[1px] bg-black" />
        </View>

        {/* Sidebar */}
        {sidebarVisible && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setSidebarVisible(false)}
            className="absolute inset-0 bg-black/50 z-40"
          >
            <View className="w-64 h-full bg-white">
              <Image
                source={require("@/assets/images/side-bar.png")}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>
        )}
      </ImageBackground>
    </View>
  );
}
