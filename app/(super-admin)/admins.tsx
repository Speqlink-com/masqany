/**
 * Super Admin - Admins Management Screen
 * Full admin control: creation, deletion, suspension, performance monitoring
 */

import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock admin data
const mockAdmins = [
  {
    id: "1",
    name: "John Doe",
    email: "john@masqany.com",
    role: "Senior Admin",
    status: "active",
    tasksCompleted: 145,
    tasksApproved: 132,
    tasksPending: 13,
    performance: 91,
    joinedDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@masqany.com",
    role: "Admin",
    status: "active",
    tasksCompleted: 98,
    tasksApproved: 89,
    tasksPending: 9,
    performance: 88,
    joinedDate: "2024-03-20",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@masqany.com",
    role: "Admin",
    status: "suspended",
    tasksCompleted: 67,
    tasksApproved: 54,
    tasksPending: 13,
    performance: 75,
    joinedDate: "2024-02-10",
  },
];

export default function AdminsScreen() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState<string | null>(null);

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
                Admin Management
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
                placeholder="Search admins..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 text-base"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
            {/* Quick Stats */}
            <View className="mb-5">
              <Text className="text-gray-900 font-bold text-lg mb-3">
                Overview
              </Text>
              <View className="flex-row justify-between" style={{ gap: 12 }}>
                {/* Total Admins Card */}
                <LinearGradient
                  colors={["#cdffd8", "#94b9ff"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="flex-1 p-4"
                  style={{
                    borderRadius: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <Image
                    source={require("@/assets/icons/sa-user-name.png")}
                    className="w-12 h-12 mb-2"
                    resizeMode="contain"
                  />
                  <Text className="text-gray-700 text-sm mb-1">Total Admins</Text>
                  <Text className="text-gray-900 font-bold text-3xl">12</Text>
                </LinearGradient>

                {/* Active Admins Card */}
                <View
                  className="flex-1 p-4"
                  style={{
                    backgroundColor: "#f5f5f5",
                    borderRadius: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <Image
                    source={require("@/assets/icons/sa-active-icon.webp")}
                    className="w-12 h-12 mb-2"
                    resizeMode="contain"
                  />
                  <Text className="text-gray-700 text-sm mb-1">Active</Text>
                  <Text className="text-gray-900 font-bold text-3xl">9</Text>
                </View>

                {/* Suspended Admins Card */}
                <LinearGradient
                  colors={["#00CED1", "#004AAD"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="flex-1 p-4"
                  style={{
                    borderRadius: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <Image
                    source={require("@/assets/icons/sa-suspend-icon.png")}
                    className="w-12 h-12 mb-2"
                    resizeMode="contain"
                  />
                  <Text className="text-white text-sm mb-1">Suspended</Text>
                  <Text className="text-white font-bold text-3xl">3</Text>
                </LinearGradient>
              </View>
            </View>

            {/* Create New Admin Button */}
            <TouchableOpacity className="mb-5">
              <LinearGradient
                colors={["#333333", "#898989"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="flex-row items-center justify-center p-4"
                style={{
                  borderRadius: 16,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Image
                  source={require("@/assets/icons/add-user-icon.webp")}
                  className="w-6 h-6 mr-2"
                  resizeMode="contain"
                  style={{ tintColor: "#ffffff" }}
                />
                <Text className="text-white font-semibold text-base">
                  Create New Admin
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Admin List */}
            <View className="mb-20">
              <Text className="text-gray-900 font-bold text-lg mb-3">
                Admin List
              </Text>
              {mockAdmins.map((admin) => (
                <TouchableOpacity
                  key={admin.id}
                  onPress={() =>
                    setSelectedAdmin(selectedAdmin === admin.id ? null : admin.id)
                  }
                  className="mb-3"
                >
                  <View
                    className="p-4"
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: 16,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    {/* Admin Header */}
                    <View className="flex-row items-center justify-between mb-2">
                      <View className="flex-row items-center flex-1">
                        <Image
                          source={require("@/assets/icons/user-profile-icon.webp")}
                          className="w-12 h-12 mr-3"
                          resizeMode="contain"
                        />
                        <View className="flex-1">
                          <Text className="text-gray-900 font-semibold text-base">
                            {admin.name}
                          </Text>
                          <Text className="text-gray-600 text-sm">
                            {admin.email}
                          </Text>
                          <Text className="text-gray-500 text-xs">
                            {admin.role}
                          </Text>
                        </View>
                      </View>
                      <View
                        className="px-3 py-1 rounded-full"
                        style={{
                          backgroundColor:
                            admin.status === "active" ? "#4CAF50" : "#FF9800",
                        }}
                      >
                        <Text className="text-white text-xs font-semibold">
                          {admin.status.toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    {/* Performance Metrics */}
                    {selectedAdmin === admin.id && (
                      <View className="mt-3 pt-3 border-t border-gray-200">
                        <Text className="text-gray-900 font-semibold text-sm mb-2">
                          Performance Metrics
                        </Text>
                        <View className="flex-row justify-between mb-2">
                          <View className="flex-1 mr-2">
                            <Text className="text-gray-600 text-xs">
                              Tasks Completed
                            </Text>
                            <Text className="text-gray-900 font-bold text-lg">
                              {admin.tasksCompleted}
                            </Text>
                          </View>
                          <View className="flex-1 mx-1">
                            <Text className="text-gray-600 text-xs">
                              Approved
                            </Text>
                            <Text className="text-green-600 font-bold text-lg">
                              {admin.tasksApproved}
                            </Text>
                          </View>
                          <View className="flex-1 ml-2">
                            <Text className="text-gray-600 text-xs">
                              Pending
                            </Text>
                            <Text className="text-orange-600 font-bold text-lg">
                              {admin.tasksPending}
                            </Text>
                          </View>
                        </View>

                        {/* Performance Score */}
                        <View className="mb-3">
                          <View className="flex-row justify-between mb-1">
                            <Text className="text-gray-600 text-xs">
                              Performance Score
                            </Text>
                            <Text className="text-gray-900 font-semibold text-xs">
                              {admin.performance}%
                            </Text>
                          </View>
                          <View
                            className="h-2 rounded-full"
                            style={{ backgroundColor: "#e0e0e0" }}
                          >
                            <View
                              className="h-2 rounded-full"
                              style={{
                                width: `${admin.performance}%`,
                                backgroundColor:
                                  admin.performance >= 90
                                    ? "#4CAF50"
                                    : admin.performance >= 75
                                    ? "#FF9800"
                                    : "#F44336",
                              }}
                            />
                          </View>
                        </View>

                        {/* Action Buttons */}
                        <View className="flex-row justify-between" style={{ gap: 8 }}>
                          <TouchableOpacity
                            className="flex-1 py-2 rounded-lg"
                            style={{ backgroundColor: "#20A6FD" }}
                          >
                            <Text className="text-white text-center text-sm font-semibold">
                              View Details
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            className="flex-1 py-2 rounded-lg"
                            style={{
                              backgroundColor:
                                admin.status === "active" ? "#FF9800" : "#4CAF50",
                            }}
                          >
                            <Text className="text-white text-center text-sm font-semibold">
                              {admin.status === "active" ? "Suspend" : "Activate"}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            className="flex-1 py-2 rounded-lg"
                            style={{ backgroundColor: "#F44336" }}
                          >
                            <Text className="text-white text-center text-sm font-semibold">
                              Delete
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
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
