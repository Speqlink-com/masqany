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
          focused && activeTint ? { tintColor: "#ffffff" } : undefined,
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
              activeIcon={require("@/assets/icons/home-tab-icon.png")}
              label="Home"
              focused={focused}
               activeTint={false}
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
               activeIcon={require("@/assets/icons/ai-chat-tab-icon.webp")}
              label="Chat"
              focused={focused}
              activeTint={false}
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
              activeIcon={require("@/assets/icons/move-tab-icon.webp")}
              label="Move"
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
