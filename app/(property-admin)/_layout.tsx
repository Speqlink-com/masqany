/**
 * Property Admin Tab Navigator Layout
 * 
 * Tab navigator with 5 tabs matching main app styling:
 * - home (Dashboard)
 * - agents
 * - units
 * - analytics
 * - profile
 */

import { Tabs } from "expo-router";
import React from "react";
import { Image, ImageSourcePropType, StyleSheet, Text, View } from "react-native";

interface TabIconProps {
  icon: ImageSourcePropType;
  label: string;
  focused: boolean;
}

function TabIcon({ icon, label, focused }: TabIconProps) {
  return (
    <View style={styles.tabItem}>
      <Image
        source={icon}
        style={[
          styles.icon,
          focused ? { tintColor: "#28b4f9" } : { tintColor: "#9CA3AF" },
        ]}
        resizeMode="contain"
      />
      <Text style={[styles.label, { color: focused ? "#28b4f9" : "#9CA3AF" }]}>
        {label}
      </Text>
    </View>
  );
}

export default function PropertyAdminLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={require("@/assets/icons/home.png")}
              label="Home"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="agents"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={require("@/assets/icons/my-agents-icon.png")}
              label="Agents"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="units"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={require("@/assets/icons/house-icon.webp")}
              label="Units"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={require("@/assets/icons/occupancy-icon.png")}
              label="Analytics"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={require("@/assets/icons/profile-tab-icon.webp")}
              label="Profile"
              focused={focused}
            />
          ),
        }}
      />
      {/* Hide dynamic routes from tab bar */}
      <Tabs.Screen
        name="units/[propertyId]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    elevation: 0,
    height: 100,
    paddingBottom: 8,
    paddingTop: 8,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  icon: {
    width: 24,
    height: 24,
  },
  label: {
    fontFamily: "Inter-Medium",
    fontSize: 11,
  },
});
