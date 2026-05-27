/**
 * AI Chat Agent — Masqany AI assistant for property search and booking.
 * Features: Chat interface, sidebar with chat history, smart scheduling, typing effect.
 */
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { memo, useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    PanResponder,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.6;

// Typing effect component for AI messages
interface TypingMessageProps {
  message: string;
  speed?: number;
  onComplete?: () => void;
}

const TypingMessage = memo(function TypingMessage({
  message,
  speed = 15,
  onComplete,
}: TypingMessageProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const cursorOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (done) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, { toValue: 0, duration: 380, useNativeDriver: true }),
        Animated.timing(cursorOpacity, { toValue: 1, duration: 380, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [done]);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed("");
    setDone(false);
    const interval = setInterval(() => {
      indexRef.current += 1;
      setDisplayed(message.slice(0, indexRef.current));
      if (indexRef.current >= message.length) {
        clearInterval(interval);
        setDone(true);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [message]);

  return (
    <View className="flex-row items-start mb-5 gap-3">
      <Image
        source={require("@/assets/icons/masqany-agent.webp")}
        className="w-11 h-11 rounded-full"
        resizeMode="cover"
      />
      <View className="flex-1 rounded-2xl px-4 py-3 bg-white/80" style={{ borderTopLeftRadius: 4 }}>
        <Text className="font-inter-regular text-dark-300 text-[17px] leading-7">
          {displayed}
          {!done && (
            <Animated.Text
              className="font-inter-regular text-[17px] text-primary-700"
              style={{ opacity: cursorOpacity }}
            >
              |
            </Animated.Text>
          )}
        </Text>
      </View>
    </View>
  );
});

// Mock chat history data
const MOCK_CHATS = [
  { id: "1", title: "2BR Apartment in Kilimani", date: "Today, 2:30 PM", isPinned: false },
  { id: "2", title: "Short stay near JKIA", date: "Yesterday, 5:45 PM", isPinned: true },
  { id: "3", title: "Office space Westlands", date: "Dec 15, 2024", isPinned: false },
  { id: "4", title: "Student hostel Ngara", date: "Dec 14, 2024", isPinned: false },
  { id: "5", title: "Villa in Karen", date: "Dec 10, 2024", isPinned: false },
];

export default function ChatAgentScreen() {
  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [chatOptionsVisible, setChatOptionsVisible] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [inChatMode, setInChatMode] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: "user" | "ai"; text: string }>>([]);
  const [showTyping, setShowTyping] = useState(false);
  
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const toggleSidebar = () => {
    const toValue = sidebarVisible ? -SIDEBAR_WIDTH : 0;
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setSidebarVisible(!sidebarVisible);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return !sidebarVisible && gestureState.dx > 10 && Math.abs(gestureState.dy) < 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 0 && !sidebarVisible) {
          const newValue = Math.min(0, -SIDEBAR_WIDTH + gestureState.dx);
          slideAnim.setValue(newValue);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50 && !sidebarVisible) {
          toggleSidebar();
        } else {
          Animated.spring(slideAnim, {
            toValue: -SIDEBAR_WIDTH,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const startNewChat = () => {
    setInChatMode(true);
    setMessages([]);
    setShowTyping(false);
    setSidebarVisible(false);
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput.trim();
    setMessages((prev) => [...prev, { type: "user", text: userMessage }]);
    setChatInput("");
    
    setTimeout(() => {
      setShowTyping(true);
    }, 500);
  };

  const handleAIComplete = () => {
    setShowTyping(false);
  };

  useEffect(() => {
    if (scrollViewRef.current && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, showTyping]);

  return (
    <View className="flex-1">
      <StatusBar style="dark" />
      <ImageBackground
        source={require("@/assets/images/app-full-screen.webp")}
        className="flex-1"
        resizeMode="cover"
      >
        {/* Top Bar - Blue bar protecting status bar - Fixed position */}
        <View className="absolute top-0 left-0 right-0 h-[3.5%] bg-[#20A6FD] z-50" />
        
        <SafeAreaView className="flex-1" edges={["top"]}>
          {/* Main Content */}
          <View className="flex-1" {...panResponder.panHandlers}>
            {/* Header with Menu Icon */}
            <View className="px-5 py-3">
              <TouchableOpacity onPress={toggleSidebar} className="w-10 h-10 justify-center items-center">
                <Image
                  source={require("@/assets/icons/menu.png")}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            {!inChatMode ? (
              <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {/* Two Cards */}
                <View className="flex-row gap-3 mb-6">
                  {/* Prompt Masqany Card */}
                  <TouchableOpacity className="flex-1 rounded-2xl overflow-hidden shadow-md" activeOpacity={0.8} onPress={startNewChat}>
                    <LinearGradient
                      colors={["#A6A6A6", "#FFFFFF"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      className="p-3 items-center"
                      style={{ minHeight: 140 }}
                    >
                      <Text className="font-inter-semibold text-[11px] text-dark-400 text-center mb-2">
                        Prompt Masqany
                      </Text>
                      <Image
                        source={require("@/assets/icons/prompt-masqany.webp")}
                        className="w-[50px] h-[50px] mb-2"
                        resizeMode="contain"
                      />
                      <Text className="font-inter-bold text-[13px] text-primary-700">
                        Start Now!!
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Smart Scheduling Card */}
                  <TouchableOpacity className="flex-1 rounded-2xl overflow-hidden shadow-md" activeOpacity={0.8} onPress={startNewChat}>
                    <LinearGradient
                      colors={["#A6A6A6", "#FFFFFF"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      className="p-3 items-center"
                      style={{ minHeight: 140 }}
                    >
                      <Text className="font-inter-semibold text-[11px] text-dark-400 text-center mb-2">
                        Smart Scheduling and Discovery Engine
                      </Text>
                      <Image
                        source={require("@/assets/icons/ai-analytics.webp")}
                        className="w-[50px] h-[50px] mb-2"
                        resizeMode="contain"
                      />
                      <Text className="font-inter-bold text-[13px] text-primary-700">
                        Plan Now!!
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                {/* AI Description Section */}
                <View className="mt-5">
                  <View className="flex-row items-center mb-5">
                    <Image
                      source={require("@/assets/icons/location.png")}
                      className="w-5 h-5 mr-2"
                      resizeMode="contain"
                    />
                    <Text className="font-inter-semibold text-[15px]">
                      <Text className="text-primary-700">MASQANY AI</Text>
                      <Text className="text-dark-400"> Finds, Reserves and Reminds</Text>
                    </Text>
                  </View>

                  {/* Masqany Agent Image */}
                  <View className="items-center my-6">
                    <Image
                      source={require("@/assets/icons/masqany-agent.webp")}
                      style={{ width: SCREEN_WIDTH * 0.7, height: SCREEN_WIDTH * 0.5 }}
                      resizeMode="contain"
                    />
                  </View>

                  {/* Just Ask It */}
                  <View className="flex-row items-center justify-center mb-5">
                    <Text className="font-inter-semibold text-[19px] text-dark-400 mr-2">
                      Just Ask it
                    </Text>
                    <Image
                      source={require("@/assets/icons/thumbs-up.png")}
                      className="w-6 h-6"
                      resizeMode="contain"
                    />
                  </View>
                </View>
              </ScrollView>
            ) : (
              // Chat Mode
              <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={100}
              >
                <ScrollView
                  ref={scrollViewRef}
                  className="flex-1"
                  contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 }}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  {/* Empty State */}
                  {messages.length === 0 && !showTyping && (
                    <View className="flex-1 items-center justify-center py-16">
                      <Image
                        source={require("@/assets/icons/masqany-agent.webp")}
                        className="w-[120px] h-[120px] mb-6"
                        resizeMode="contain"
                      />
                      <Text className="font-inter-medium text-[15px] text-dark-100 text-center">
                        Start a conversation with Masqany AI
                      </Text>
                    </View>
                  )}

                  {/* Messages */}
                  {messages.map((msg, index) => (
                    <View key={index}>
                      {msg.type === "user" ? (
                        <View className="flex-row justify-end mb-5">
                          <View className="max-w-[80%] bg-primary-700 rounded-2xl px-4 py-3" style={{ borderTopRightRadius: 4 }}>
                            <Text className="font-inter-regular text-[17px] leading-6 text-white">
                              {msg.text}
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <TypingMessage message={msg.text} speed={15} />
                      )}
                    </View>
                  ))}

                  {/* Show typing for AI response */}
                  {showTyping && messages.length > 0 && (
                    <TypingMessage
                      message="I can help you with that! Let me search for available properties matching your criteria..."
                      speed={15}
                      onComplete={handleAIComplete}
                    />
                  )}
                </ScrollView>
              </KeyboardAvoidingView>
            )}

            {/* Chat Input Field */}
            <View className="px-5 py-3" style={{ paddingBottom: 350 }}>
              <View className="flex-row items-center bg-dark-400 rounded-full px-5 py-2 shadow-md">
                <TextInput
                  className="flex-1 font-inter text-[15px] text-white max-h-[100px]"
                  placeholder="Type your message..."
                  placeholderTextColor="#BDBDC0"
                  value={chatInput}
                  onChangeText={setChatInput}
                  multiline
                  maxLength={500}
                />
                <View className="flex-row gap-2 ml-2">
                  <TouchableOpacity className="w-8 h-8 justify-center items-center">
                    <Image
                      source={require("@/assets/icons/upload.webp")}
                      className="w-5 h-5"
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="w-8 h-8 justify-center items-center"
                    onPress={sendMessage}
                    disabled={!chatInput.trim()}
                  >
                    <Image
                      source={require("@/assets/icons/send-icon.png")}
                      className="w-5 h-5"
                      style={{ opacity: chatInput.trim() ? 1 : 0.3 }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Sidebar */}
          <Animated.View
            className="absolute left-0 top-0 bottom-0 z-[1000]"
            style={{
              width: SIDEBAR_WIDTH,
              transform: [{ translateX: slideAnim }],
            }}
            pointerEvents={sidebarVisible ? "auto" : "none"}
          >
            <LinearGradient
              colors={["#5DE0E6", "#004AAD"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="flex-1"
            >
              <SafeAreaView className="flex-1 px-5" edges={["top", "bottom"]}>
                {/* Search Bar and New Chat */}
                <View className="flex-row items-center gap-2 mb-5 mt-3">
                  <View className="flex-1 flex-row items-center bg-dark-400 rounded-full px-3 py-2">
                    <Image
                      source={require("@/assets/icons/search.png")}
                      className="w-4 h-4 mr-2"
                      resizeMode="contain"
                    />
                    <TextInput
                      className="flex-1 font-inter text-[13px] text-white"
                      placeholder="Search"
                      placeholderTextColor="#666666"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                  </View>
                  <TouchableOpacity 
                    className="w-10 h-10 justify-center items-center bg-white/20 rounded-full"
                    onPress={startNewChat}
                  >
                    <Image
                      source={require("@/assets/icons/message.webp")}
                      className="w-5 h-5"
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>

                {/* New Chat Option */}
                <TouchableOpacity className="flex-row items-center py-3 px-2" onPress={startNewChat}>
                  <Image
                    source={require("@/assets/icons/message.webp")}
                    className="w-5 h-5 mr-3"
                    resizeMode="contain"
                  />
                  <Text className="font-inter-medium text-[15px] text-white">
                    New Chat
                  </Text>
                </TouchableOpacity>

                {/* Current Location */}
                <TouchableOpacity className="flex-row items-center py-3 px-2">
                  <Image
                    source={require("@/assets/icons/location.png")}
                    className="w-5 h-5 mr-3"
                    resizeMode="contain"
                  />
                  <Text className="font-inter-medium text-[15px] text-white">
                    Current Location
                  </Text>
                </TouchableOpacity>

                {/* My Chats Section */}
                <Text className="font-inter-bold text-[17px] text-white mt-5 mb-3">
                  My Chats
                </Text>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                  {MOCK_CHATS.map((chat) => (
                    <View key={chat.id}>
                      <TouchableOpacity
                        className={`flex-row items-center justify-between py-3 px-2 rounded-xl mb-1 ${
                          selectedChat === chat.id ? "bg-white" : ""
                        }`}
                        onPress={() => setSelectedChat(chat.id)}
                      >
                        <View className="flex-1">
                          <Text
                            className={`font-inter-semibold text-[15px] mb-1 ${
                              selectedChat === chat.id ? "text-primary-700" : "text-dark-400"
                            }`}
                            numberOfLines={1}
                          >
                            {chat.title}
                          </Text>
                          <Text
                            className={`font-inter text-[11px] ${
                              selectedChat === chat.id ? "text-dark-100" : "text-dark-100"
                            }`}
                          >
                            {chat.date}
                          </Text>
                        </View>
                        <TouchableOpacity
                          className="p-1"
                          onPress={() =>
                            setChatOptionsVisible(
                              chatOptionsVisible === chat.id ? null : chat.id
                            )
                          }
                        >
                          <Image
                            source={require("@/assets/icons/ellipsis.png")}
                            className="w-4 h-4"
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      </TouchableOpacity>

                      {/* Chat Options Menu */}
                      {chatOptionsVisible === chat.id && (
                        <View 
                          className="rounded-xl overflow-hidden mb-2"
                          style={{ marginLeft: SIDEBAR_WIDTH * 0.15, marginRight: 8 }}
                        >
                          <LinearGradient
                            colors={["#5DE0E6", "#3fbdfd"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="py-1"
                          >
                            <TouchableOpacity className="flex-row items-center py-2 px-3">
                              <Image
                                source={require("@/assets/icons/rename.png")}
                                className="w-4 h-4 mr-2"
                                resizeMode="contain"
                              />
                              <Text className="font-inter-medium text-[13px] text-white">
                                Rename
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-row items-center py-2 px-3">
                              <Image
                                source={require("@/assets/icons/archive-chat-icon.webp")}
                                className="w-4 h-4 mr-2"
                                resizeMode="contain"
                              />
                              <Text className="font-inter-medium text-[13px] text-white">
                                Archive
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-row items-center py-2 px-3">
                              <Image
                                source={require("@/assets/icons/pin-chart.webp")}
                                className="w-4 h-4 mr-2"
                                resizeMode="contain"
                              />
                              <Text className="font-inter-medium text-[13px] text-white">
                                {chat.isPinned ? "Unpin" : "Pin"} Chat
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-row items-center py-2 px-3">
                              <Image
                                source={require("@/assets/icons/delete.webp")}
                                className="w-4 h-4 mr-2"
                                resizeMode="contain"
                              />
                              <Text className="font-inter-medium text-[13px] text-white">
                                Delete
                              </Text>
                            </TouchableOpacity>
                          </LinearGradient>
                        </View>
                      )}
                    </View>
                  ))}
                </ScrollView>
              </SafeAreaView>
            </LinearGradient>
          </Animated.View>

          {/* Overlay when sidebar is open */}
          {sidebarVisible && (
            <TouchableOpacity
              className="absolute z-[999] bg-black/50"
              style={{ left: SIDEBAR_WIDTH, right: 0, top: 0, bottom: 0 }}
              activeOpacity={1}
              onPress={toggleSidebar}
            />
          )}
        </SafeAreaView>
        
        {/* Bottom Bar - Blue bar covering entire tab bar area - Fixed position */}
        <View className="absolute bottom-0 left-0 right-0 h-[100px] bg-[#20A6FD] z-50">
          <View className="h-[1px] bg-black" />
        </View>
      </ImageBackground>
    </View>
  );
}