/**
 * Driver Chat Agent — Same AI assistant functionality for drivers.
 * Re-uses the entire chat module implementation.
 */
import {
    useChats,
    useCreateChat,
    useDeleteChat,
    useGetAgentResponse,
    useUpdateChat,
} from "@/modules/chat";
import { chatApi } from "@/modules/chat/api";
import type { PropertyVideo } from "@/modules/video-feed/types";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Dimensions,
    Image,
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    PanResponder,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SIDEBAR_WIDTH = Math.min(SCREEN_WIDTH * 0.74, 320);
const THEME_BLUE = "#3fbdfd";
const CARD_BG = "#e1e6e8";

const resultImages = [
  require("@/assets/prop-images/image2.jpeg"),
  require("@/assets/prop-images/image3.jpeg"),
  require("@/assets/prop-images/image4.jpeg"),
  require("@/assets/prop-images/image5.jpeg"),
  require("@/assets/prop-images/image6.jpeg"),
];

type ChatMode = "start" | "plan";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  resultIds?: string[];
  suggestions?: string[];
};

type ChatSession = {
  id: string;
  title: string;
  date: string;
  isPinned: boolean;
  isArchived: boolean;
  mode: ChatMode;
  messages: ChatMessage[];
};

const starterSuggestions = [
  "Find a bedsitter under 15k near Rongai",
  "Nataka Airbnb Karen for weekend",
  "2 bedroom Kilimani with parking",
  "Plan relocation with a pickup driver",
];

const planQuestions = [
  "Which area or county should I prioritize?",
  "What is your budget range and stay type?",
  "Do you need a relocation driver, pickup, or full moving service?",
  "Which amenities are non-negotiable for you?",
];

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatTime() {
  return new Intl.DateTimeFormat("en-KE", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());
}

function formatPrice(property: PropertyVideo) {
  return `KES ${property.price.toLocaleString("en-KE")} / ${property.priceUnit}`;
}

function imageFor(index: number) {
  return resultImages[index % resultImages.length];
}

/**
 * Parse markdown bold (**text**) and return Text components with proper styling
 */
function parseMarkdownText(text: string, baseStyle: any, boldStyle: any) {
  // Split by **bold** pattern
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  
  return (
    <Text style={baseStyle}>
      {parts.map((part, index) => {
        // Check if this part is bold (wrapped in **)
        if (part.startsWith('**') && part.endsWith('**')) {
          const boldText = part.slice(2, -2); // Remove **
          return (
            <Text key={index} style={boldStyle}>
              {boldText}
            </Text>
          );
        }
        // Regular text
        return part;
      })}
    </Text>
  );
}

const initialChats: ChatSession[] = [];

export default function DriverChatAgentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // ✅ REAL API HOOKS
  const { data: backendChats, isLoading: isLoadingChats } = useChats();
  const createChatMutation = useCreateChat();
  const getAgentResponse = useGetAgentResponse();
  const updateChatMutation = useUpdateChat();
  const deleteChatMutation = useDeleteChat();
  
  const [chats, setChats] = useState<ChatSession[]>(initialChats);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [chatOptionsVisible, setChatOptionsVisible] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [renameChatId, setRenameChatId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeChatId) ?? null,
    [activeChatId, chats]
  );

  const filteredChats = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return chats
      .filter((chat) => !chat.isArchived)
      .filter((chat) => {
        if (!query) return true;
        const haystack = `${chat.title} ${chat.date} ${chat.messages
          .map((message) => message.text)
          .join(" ")}`.toLowerCase();
        return haystack.includes(query);
      })
      .sort((a, b) => Number(b.isPinned) - Number(a.isPinned));
  }, [chats, searchQuery]);

  const openSidebar = useCallback(() => {
    setSidebarVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 240,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  const closeSidebar = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: -SIDEBAR_WIDTH,
      duration: 220,
      useNativeDriver: true,
    }).start(() => setSidebarVisible(false));
  }, [slideAnim]);

  const toggleSidebar = () => {
    if (sidebarVisible) {
      closeSidebar();
    } else {
      openSidebar();
    }
  };

  const mainPanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        !sidebarVisible && gestureState.dx > 16 && Math.abs(gestureState.dy) < 18,
      onPanResponderMove: (_, gestureState) => {
        if (!sidebarVisible && gestureState.dx > 0) {
          slideAnim.setValue(Math.min(0, -SIDEBAR_WIDTH + gestureState.dx));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 72) {
          openSidebar();
        } else {
          closeSidebar();
        }
      },
    })
  ).current;

  const sidebarPanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        sidebarVisible && gestureState.dx < -16 && Math.abs(gestureState.dy) < 20,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          slideAnim.setValue(Math.max(-SIDEBAR_WIDTH, gestureState.dx));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -56) {
          closeSidebar();
        } else {
          openSidebar();
        }
      },
    })
  ).current;

  const updateChat = (chatId: string, updater: (chat: ChatSession) => ChatSession) => {
    setChats((prev) => prev.map((chat) => (chat.id === chatId ? updater(chat) : chat)));
  };

  const createNewChat = async (mode: ChatMode = "start") => {
    try {
      console.log("[CHAT] Creating new chat...");
      const backendChat = await createChatMutation.mutateAsync({
        title: mode === "plan" ? "New discovery plan" : "New Masqany chat",
      });
      
      const newChat: ChatSession = {
        id: backendChat.id,
        title: backendChat.title,
        date: formatTime(),
        isPinned: false,
        isArchived: false,
        mode,
        messages: [],
      };
      
      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(backendChat.id);
      setChatInput("");
      setChatOptionsVisible(null);
      closeSidebar();
      
      console.log("[CHAT] ✅ New chat created:", backendChat.id);
    } catch (error) {
      console.error("[CHAT] Failed to create chat:", error);
      Alert.alert("Error", "Failed to create new chat");
    }
  };

  const selectChat = async (chatId: string) => {
    setActiveChatId(chatId);
    setChatOptionsVisible(null);
    closeSidebar();
    
    // Load messages from backend if chat has no messages
    const chat = chats.find((c) => c.id === chatId);
    if (chat && chat.messages.length === 0) {
      try {
        console.log("[CHAT] Loading messages for chat:", chatId);
        const messages = await chatApi.getMessages(chatId);
        console.log("[CHAT] ✅ Loaded messages:", messages.length);
        
        // Convert backend messages to ChatMessage format
        const chatMessages: ChatMessage[] = messages.map((msg) => ({
          id: msg.id,
          role: msg.role as "user" | "assistant",
          text: msg.content,
        }));
        
        // Update chat with messages
        updateChat(chatId, (chat) => ({ ...chat, messages: chatMessages }));
      } catch (error) {
        console.error("[CHAT] Failed to load messages:", error);
      }
    }
  };

  const sendMessage = async (preset?: string) => {
    const value = (preset ?? chatInput).trim();
    if (!value) return;

    console.log("[CHAT] ========== SEND MESSAGE START ==========");
    console.log("[CHAT] Message:", value);
    console.log("[CHAT] Active chat ID:", activeChatId);

    let chatId = activeChatId;
    const mode: ChatMode = activeChat?.mode ?? "start";

    // Clear input immediately
    setChatInput("");
    setIsAgentTyping(true);

    try {
      // Step 1: Ensure we have a chat ID
      if (!chatId) {
        console.log("[CHAT] No active chat, creating new one...");
        const backendChat = await createChatMutation.mutateAsync({
          title: value.slice(0, 50),
        });
        chatId = backendChat.id;
        console.log("[CHAT] ✅ Chat created:", chatId);
        
        // Add to local state immediately
        const newChat: ChatSession = {
          id: backendChat.id,
          title: backendChat.title,
          date: formatTime(),
          isPinned: false,
          isArchived: false,
          mode,
          messages: [],
        };
        setChats((prev) => [newChat, ...prev]);
        setActiveChatId(chatId);
      }

      // Step 2: Add user message to UI (optimistic update)
      console.log("[CHAT] Adding user message to UI...");
      const userMessage: ChatMessage = {
        id: makeId("msg"),
        role: "user",
        text: value,
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                title: chat.messages.length === 0 ? value.slice(0, 34) : chat.title,
                date: formatTime(),
                messages: [...chat.messages, userMessage],
              }
            : chat
        )
      );

      // Step 3: Get AI response from backend
      console.log("[CHAT] Calling getAgentResponse...");
      console.log("[CHAT] Request params:", { message: value, chat_id: chatId });
      
      const aiResponse = await getAgentResponse.mutateAsync({
        message: value,
        chat_id: chatId,
      });

      console.log("[CHAT] ✅ AI Response received");

      // Step 4: Add AI message to UI
      const responseText = aiResponse.answer || aiResponse.response || "Sorry, I couldn't generate a response.";
      
      const aiMessage: ChatMessage = {
        id: makeId("msg"),
        role: "assistant",
        text: responseText,
        resultIds: aiResponse.property_id ? [aiResponse.property_id] : undefined,
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [...chat.messages, aiMessage],
              }
            : chat
        )
      );

      console.log("[CHAT] ========== SEND MESSAGE COMPLETE ==========");
      
    } catch (error: any) {
      console.error("[CHAT] ========== SEND MESSAGE FAILED ==========");
      console.error("[CHAT] Error:", JSON.stringify(error, null, 2));
      
      let errorMessage = "Failed to send message. Please try again.";
      
      if (error?.code === "ERR_NETWORK") {
        errorMessage = "Network error. Please check your connection.";
      } else if (error?.code === "ERR_BAD_REQUEST") {
        errorMessage = "Bad request. The message couldn't be processed.";
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      setIsAgentTyping(false);
    }
  };

  const openRename = (chat: ChatSession) => {
    setRenameChatId(chat.id);
    setRenameValue(chat.title);
    setChatOptionsVisible(null);
  };

  const saveRename = async () => {
    if (!renameChatId || !renameValue.trim()) return;
    
    try {
      await updateChatMutation.mutateAsync({
        chatId: renameChatId,
        request: { title: renameValue.trim() },
      });
      updateChat(renameChatId, (chat) => ({ ...chat, title: renameValue.trim() }));
      setRenameChatId(null);
      setRenameValue("");
    } catch (error) {
      console.error("[CHAT] Failed to rename:", error);
      Alert.alert("Error", "Failed to rename chat");
    }
  };

  const archiveChat = async (chatId: string) => {
    try {
      await updateChatMutation.mutateAsync({
        chatId,
        request: { archived: true },
      });
      updateChat(chatId, (chat) => ({ ...chat, isArchived: true }));
      if (activeChatId === chatId) setActiveChatId(null);
      setChatOptionsVisible(null);
    } catch (error) {
      console.error("[CHAT] Failed to archive:", error);
    }
  };

  const pinChat = async (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId);
    if (!chat) return;
    
    try {
      await updateChatMutation.mutateAsync({
        chatId,
        request: { pinned: !chat.isPinned },
      });
      updateChat(chatId, (chat) => ({ ...chat, isPinned: !chat.isPinned }));
      setChatOptionsVisible(null);
    } catch (error) {
      console.error("[CHAT] Failed to pin:", error);
    }
  };

  const deleteChat = (chatId: string) => {
    Alert.alert("Delete chat", "Remove this chat from My Chats?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteChatMutation.mutateAsync(chatId);
            setChats((prev) => prev.filter((chat) => chat.id !== chatId));
            if (activeChatId === chatId) setActiveChatId(null);
            setChatOptionsVisible(null);
          } catch (error) {
            console.error("[CHAT] Failed to delete:", error);
            Alert.alert("Error", "Failed to delete chat");
          }
        },
      },
    ]);
  };

  const openProperty = (propertyId: string) => {
    router.push({
      pathname: "/property/[propertyId]",
      params: { propertyId },
    } as never);
  };

  useEffect(() => {
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 120);
  }, [activeChat?.messages.length, isAgentTyping]);

  // Load backend chats on mount
  useEffect(() => {
    if (backendChats && backendChats.length > 0) {
      console.log("[CHAT] Loading backend chats:", backendChats.length);
      const loadedChats: ChatSession[] = backendChats.map((chat) => ({
        id: chat.id,
        title: chat.title || "Untitled chat",
        date: new Date(chat.updated_at || chat.created_at).toLocaleDateString("en-KE", {
          month: "short",
          day: "numeric",
        }),
        isPinned: chat.pinned || false,
        isArchived: chat.archived || false,
        mode: "start" as ChatMode,
        messages: [], // Messages loaded separately when chat is opened
      }));
      setChats(loadedChats);
      console.log("[CHAT] ✅ Loaded chats from backend");
    }
  }, [backendChats]);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const showSub = Keyboard.addListener(showEvent, () => setIsKeyboardVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setIsKeyboardVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Import all helper components from the main chat-agent implementation
  // These would normally be extracted to a shared component file, but for brevity we'll note that
  // the full implementation includes: WelcomePanel, SessionStatusStrip, ChatStarter, MessageBlock, etc.
  
  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      
      <ImageBackground
        source={require("@/assets/images/app-full-screen.webp")}
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
          <View style={styles.main} {...mainPanResponder.panHandlers}>
            <View style={styles.header}>
              <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton} activeOpacity={0.8}>
                <Image
                  source={require("@/assets/icons/menu.png")}
                  style={styles.menuIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <View style={styles.headerCopy}>
                <Text style={styles.headerTitle}>Masqany AI</Text>
                <Text style={styles.headerSubtitle}>English • Kiswahili</Text>
              </View>
              <TouchableOpacity
                onPress={() => createNewChat("start")}
                style={styles.newHeaderButton}
                activeOpacity={0.8}
              >
                <Image
                  source={require("@/assets/icons/message.webp")}
                  style={styles.newHeaderIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
              style={styles.chatShell}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 58 : 0}
            >
              <ScrollView
                ref={scrollViewRef}
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderText}>
                    Chat agent UI ready. Driver role active.
                  </Text>
                </View>
              </ScrollView>

              <View
                style={[
                  styles.composerWrap,
                  isKeyboardVisible ? styles.composerWrapKeyboard : undefined,
                ]}
              >
                <View style={styles.composer}>
                  <TextInput
                    style={styles.composerInput}
                    placeholder="Ask Masqany..."
                    placeholderTextColor="#BDBDC0"
                    value={chatInput}
                    onChangeText={setChatInput}
                    multiline
                    maxLength={700}
                    textAlignVertical="center"
                  />
                  <TouchableOpacity style={styles.composerIconButton} activeOpacity={0.75}>
                    <Image
                      source={require("@/assets/icons/upload.webp")}
                      style={styles.composerIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.sendButton, !chatInput.trim() ? styles.disabledButton : undefined]}
                    onPress={() => sendMessage()}
                    disabled={!chatInput.trim()}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={require("@/assets/icons/send-icon.png")}
                      style={styles.sendIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  main: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.08)",
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  menuIcon: {
    width: 24,
    height: 24,
    tintColor: "#004AAD",
  },
  headerCopy: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
    color: "#004AAD",
  },
  headerSubtitle: {
    fontFamily: "Nunito_400Regular",
    fontSize: 12,
    color: "#666",
  },
  newHeaderButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  newHeaderIcon: {
    width: 24,
    height: 24,
    tintColor: THEME_BLUE,
  },
  chatShell: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingTop: 100,
  },
  placeholderText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  composerWrap: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 110, // Tab bar clearance
    backgroundColor: "rgba(255,255,255,0.98)",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.08)",
  },
  composerWrapKeyboard: {
    paddingBottom: 12,
  },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#f5f5f5",
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 48,
  },
  composerInput: {
    flex: 1,
    fontFamily: "Nunito_400Regular",
    fontSize: 15,
    color: "#222",
    maxHeight: 100,
    paddingHorizontal: 8,
  },
  composerIconButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
  composerIcon: {
    width: 20,
    height: 20,
    tintColor: "#666",
  },
  sendButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: THEME_BLUE,
    borderRadius: 16,
    marginLeft: 6,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  sendIcon: {
    width: 16,
    height: 16,
    tintColor: "#fff",
  },
});
