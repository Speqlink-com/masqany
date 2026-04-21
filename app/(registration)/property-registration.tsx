/**
 * Property Registration — owner/agent profile & listing setup.
 * Full-screen app-full-screen.webp, custom transparent tab bar.
 * Tabs: Home · AI Chat · Move
 * Icons gray when inactive, white when active. Labels always shown.
 * TODO: implement full multi-step form when backend is ready.
 */
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Image, ImageBackground, ImageSourcePropType, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TabKey = "home" | "ai-chat" | "move";

interface TabDef {
  key: TabKey;
  label: string;
  icon: ImageSourcePropType;
}

const TABS: TabDef[] = [
  { key: "home",    label: "Home",    icon: require("@/assets/icons/home-tab-icon.png") },
  { key: "ai-chat", label: "AI Chat", icon: require("@/assets/icons/ai-chat-tab-icon.webp") },
  { key: "move",    label: "Move",    icon: require("@/assets/icons/move-tab-icon.webp") },
];

function TabContent({ tab }: { tab: TabKey }) {
  const content: Record<TabKey, { title: string; body: string }> = {
    "home": {
      title: "Property Dashboard",
      body: "Your listed properties, booking requests, and revenue overview will appear here. Complete your property registration to go live.",
    },
    "ai-chat": {
      title: "AI Assistant",
      body: "Your Masqany AI agent will help you manage inquiries, draft listing descriptions, and respond to tenants. Available after profile completion.",
    },
    "move": {
      title: "Move Services",
      body: "Offer relocation assistance to your tenants — connect them with verified drivers for a seamless move-in experience.",
    },
  };

  const { title, body } = content[tab];

  return (
    <View className="flex-1 items-center justify-center px-8">
      <Text className="font-cg-bold text-dark-400 text-center mb-3" style={{ fontSize: 24 }}>
        {title}
      </Text>
      <Text
        className="font-nunito-regular text-dark-200 text-center leading-6"
        style={{ fontSize: 15, maxWidth: 300 }}
      >
        {body}
      </Text>
    </View>
  );
}

export default function PropertyRegistrationScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>("home");

  return (
    <View className="flex-1">
      <StatusBar style="dark" />
      <ImageBackground
        source={require("@/assets/images/app-full-screen.webp")}
        className="flex-1"
        resizeMode="cover"
      >
        <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>

          {/* Header */}
          <View className="px-6 pt-5 pb-4">
            <Text className="font-cg-bold text-dark-400 mb-1" style={{ fontSize: 28 }}>
              List a Property
            </Text>
            <Text className="font-nunito-regular text-dark-200 leading-5" style={{ fontSize: 14 }}>
              Set up your property profile to start receiving booking requests
            </Text>
          </View>

          {/* Content */}
          <View className="flex-1">
            <TabContent tab={activeTab} />
          </View>

          {/* Custom transparent tab bar */}
          <View className="flex-row px-2 pt-3 pb-7">
            {TABS.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                  activeOpacity={0.8}
                  className="flex-1 items-center justify-center"
                  style={{ gap: 3 }}
                >
                  <Image
                    source={tab.icon}
                    className="w-6 h-6"
                    resizeMode="contain"
                    style={active ? { tintColor: "#ffffff" } : undefined}
                  />
                  <Text
                    className="font-nunito-semibold"
                    style={{ fontSize: 11, color: active ? "#ffffff" : "transparent" }}
                  >
                    {tab.label}
                  </Text>
                  {active && (
                    <View className="w-1 h-1 rounded-full bg-white mt-0.5" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
