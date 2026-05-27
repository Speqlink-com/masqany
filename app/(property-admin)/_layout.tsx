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
  activeIcon?: ImageSourcePropType;
  label: string;
  focused: boolean;
  activeTint?: boolean;
}

function TabIcon({ icon, activeIcon, label, focused, activeTint = true }: TabIconProps) {
  return (
    <View style={styles.tabItem}>
      <Image
        source={focused && activeIcon ? activeIcon : icon}
        style={[
          styles.icon,
          // Icons are already gray by design — only tint white when active
          focused && activeTint ? { tintColor: "#28b4f9" } : undefined,
        ]}
        resizeMode="contain"
      />
      <Text style={[styles.label, { color: focused ? "#28b4f9" : "#9CA3AF" }]}>
        {label}
      </Text>
      {focused && <View style={styles.dot} />}
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
              icon={require("@/assets/icons/home-tab-icon.png")}
              activeIcon={require("@/assets/icons/home-tab-icon.png")}
              label="Home"
              focused={focused}
              activeTint={false}
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
              activeIcon={require("@/assets/icons/my-agents-icon.png")}
              label="Agents"
              focused={focused}
              activeTint={false}
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
              activeIcon={require("@/assets/icons/house-icon.webp")}
              label="Units"
              focused={focused}
              activeTint={false}
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
              activeIcon={require("@/assets/icons/occupancy-icon.png")}
              label="Analytics"
              focused={focused}
              activeTint={false}
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
              activeIcon={require("@/assets/icons/profile-tab-icon.webp")}
              label="Profile"
              focused={focused}
              activeTint={false}
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
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#28b4f9",
    marginTop: 1,
  },
});