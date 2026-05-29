/**
 * Driver Group Layout
 * 
 * Tab navigator for driver screens
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

export default function DriverLayout() {
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
        name="maps"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={require("@/assets/icons/location.png")}
              label="Maps"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="move-execution/[moveId]"
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
