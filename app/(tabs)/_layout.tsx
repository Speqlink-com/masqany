/**
 * Main tab navigator.
 * - Tab icons are pre-designed gray assets — no tintColor when inactive.
 * - On active: white tintColor applied to show selection.
 * - Labels shown, white when active, transparent when inactive (icon speaks for itself).
 * - Transparent tab bar — app-full-screen.webp bleeds through.
 */
import { Tabs } from "expo-router";
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
          // Icons are already gray by design — only tint white when active
          focused ? { tintColor: "#ffffff" } : undefined,
        ]}
        resizeMode="contain"
      />
      <Text style={[styles.label, { color: focused ? "#ffffff" : "transparent" }]}>
        {label}
      </Text>
      {focused && <View style={styles.dot} />}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={require("@/assets/icons/home-tab-icon.png")}
              label="Home"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat-agent"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={require("@/assets/icons/ai-chat-tab-icon.webp")}
              label="Chat"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="move"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={require("@/assets/icons/move-tab-icon.webp")}
              label="Move"
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
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ffffff",
    marginTop: 1,
  },
});
