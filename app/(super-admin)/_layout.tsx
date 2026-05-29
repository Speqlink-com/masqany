/**
 * Super Admin Group Layout
 * 
 * Tab navigator for super admin screens with custom sidebar
 */

import { Tabs } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

interface TabIconProps {
  icon: any;
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
          focused ? { tintColor: "#ffffff" } : { tintColor: "#a0a0a0" },
        ]}
        resizeMode="contain"
      />
      <Text style={[styles.label, { color: focused ? "#ffffff" : "#a0a0a0" }]}>
        {label}
      </Text>
    </View>
  );
}

export default function SuperAdminLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="dashboard"
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
        name="admins"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={require("@/assets/icons/sa-admin-tab-icon.png")}
              label="Admins"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={require("@/assets/icons/chat-icon.webp")}
              label="Chat"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={require("@/assets/icons/sa-users-tab-icon.png")}
              label="Users"
              focused={focused}
            />
          ),
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
    height: 90,
    paddingBottom: 10,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  icon: {
    width: 26,
    height: 26,
  },
  label: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 11,
  },
});
