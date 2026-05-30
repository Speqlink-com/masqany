/**
 * AI Chat Agent — Masqany AI assistant for property discovery and planning.
 */
import { mockVideoFeedData } from "@/assets/data/video-feed";
import { AgentBubble } from "@/components/auth/AgentBubble";
import type { PropertyVideo } from "@/modules/video-feed/types";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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

const initialChats: ChatSession[] = [
  {
    id: "chat-1",
    title: "2BR Apartment in Kilimani",
    date: "Today, 2:30 PM",
    isPinned: true,
    isArchived: false,
    mode: "start",
    messages: [
      {
        id: "msg-1",
        role: "assistant",
        text: "I found active and coming-soon homes around Kilimani. You can open any listing, ask for safer routes, or compare total move-in cost.",
        resultIds: ["video-001", "video-008", "video-010"],
        suggestions: ["Compare deposits", "Show only vacant now", "Add relocation driver"],
      },
    ],
  },
  {
    id: "chat-2",
    title: "Short stay near JKIA",
    date: "Yesterday, 5:45 PM",
    isPinned: false,
    isArchived: false,
    mode: "plan",
    messages: [
      {
        id: "msg-2",
        role: "assistant",
        text: "I can run this as a discovery plan. Tell me your dates, guest count, and whether you prefer hotel, Airbnb, or serviced apartment.",
        suggestions: ["Hotel room", "Airbnb entire place", "Budget under 8k/night"],
      },
    ],
  },
  {
    id: "chat-3",
    title: "Student hostel Ngara",
    date: "May 21, 11:10 AM",
    isPinned: false,
    isArchived: false,
    mode: "start",
    messages: [],
  },
];

function getMatchedProperties(prompt: string) {
  const normalized = prompt.toLowerCase();
  const matches = mockVideoFeedData.filter((property) => {
    if (property.unitStatus === "occupied") return false;
    const searchable = [
      property.title,
      property.description,
      property.propertyType,
      property.location.estate,
      property.location.county,
      property.amenities.join(" "),
    ]
      .join(" ")
      .toLowerCase();

    return normalized
      .split(/\s+/)
      .filter((word) => word.length > 2)
      .some((word) => searchable.includes(word));
  });

  return (matches.length ? matches : mockVideoFeedData.filter((p) => p.unitStatus !== "occupied")).slice(0, 4);
}

function buildAgentReply(prompt: string, mode: ChatMode) {
  const matches = getMatchedProperties(prompt);

  if (mode === "plan") {
    return {
      text:
        "Sawa. I will treat this like a spec-driven search plan. I will evaluate your budget, preferred areas, stay type, amenities, availability, and whether a relocation driver is needed. To make the match sharper, answer these first:\n\n" +
        planQuestions.map((question, index) => `${index + 1}. ${question}`).join("\n") +
        "\n\nOnce the plan is running, I can add strong matches daily and notify you with links that open the listing page.",
      resultIds: matches.map((item) => item.id),
      suggestions: ["Budget is 20k-40k", "I need a driver", "Only available now"],
    };
  }

  return {
    text:
      "I have checked active Masqany listings for that request. Here are strong matches and a few next steps you can ask in English, Kiswahili, or Sheng.",
    resultIds: matches.map((item) => item.id),
    suggestions: ["Show exact location", "Book physical viewing", "Compare with cheaper homes"],
  };
}

export default function ChatAgentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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

  const createNewChat = (mode: ChatMode = "start") => {
    const id = makeId("chat");
    const newChat: ChatSession = {
      id,
      title: mode === "plan" ? "New discovery plan" : "New Masqany chat",
      date: "Now",
      isPinned: false,
      isArchived: false,
      mode,
      messages: [],
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(id);
    setChatInput("");
    setChatOptionsVisible(null);
    closeSidebar();
  };

  const startFlow = (mode: ChatMode) => {
    const id = makeId("chat");
    const intro =
      mode === "plan"
        ? "Plan Now activated. Tell me the property type, area, budget, move date, must-have amenities, and whether you need a relocation driver. I will ask smart follow-up questions and keep finding matches."
        : "Start Now activated. Ask me anything about Masqany properties, areas, prices, viewing, short stays, long stays, or moving support.";

    setChats((prev) => [
      {
        id,
        title: mode === "plan" ? "Smart discovery plan" : "Instant Masqany query",
        date: "Now",
        isPinned: false,
        isArchived: false,
        mode,
        messages: [
          {
            id: makeId("msg"),
            role: "assistant",
            text: intro,
            suggestions: mode === "plan" ? planQuestions : starterSuggestions,
          },
        ],
      },
      ...prev,
    ]);
    setActiveChatId(id);
    setChatInput("");
  };

  const selectChat = (chatId: string) => {
    setActiveChatId(chatId);
    setChatOptionsVisible(null);
    closeSidebar();
  };

  const sendMessage = (preset?: string) => {
    const value = (preset ?? chatInput).trim();
    if (!value) return;

    let chatId = activeChatId;
    const mode: ChatMode = activeChat?.mode ?? "start";

    if (!chatId) {
      chatId = makeId("chat");
      const newChat: ChatSession = {
        id: chatId,
        title: value.slice(0, 34),
        date: "Now",
        isPinned: false,
        isArchived: false,
        mode,
        messages: [],
      };
      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(chatId);
    }

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
    setChatInput("");
    setIsAgentTyping(true);

    const reply = buildAgentReply(value, mode);
    setTimeout(() => {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    id: makeId("msg"),
                    role: "assistant",
                    text: reply.text,
                    resultIds: reply.resultIds,
                    suggestions: reply.suggestions,
                  },
                ],
              }
            : chat
        )
      );
      setIsAgentTyping(false);
    }, 650);
  };

  const openRename = (chat: ChatSession) => {
    setRenameChatId(chat.id);
    setRenameValue(chat.title);
    setChatOptionsVisible(null);
  };

  const saveRename = () => {
    if (!renameChatId || !renameValue.trim()) return;
    updateChat(renameChatId, (chat) => ({ ...chat, title: renameValue.trim() }));
    setRenameChatId(null);
    setRenameValue("");
  };

  const archiveChat = (chatId: string) => {
    updateChat(chatId, (chat) => ({ ...chat, isArchived: true }));
    if (activeChatId === chatId) setActiveChatId(null);
    setChatOptionsVisible(null);
  };

  const pinChat = (chatId: string) => {
    updateChat(chatId, (chat) => ({ ...chat, isPinned: !chat.isPinned }));
    setChatOptionsVisible(null);
  };

  const deleteChat = (chatId: string) => {
    Alert.alert("Delete chat", "Remove this chat from My Chats?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setChats((prev) => prev.filter((chat) => chat.id !== chatId));
          if (activeChatId === chatId) setActiveChatId(null);
          setChatOptionsVisible(null);
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

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ImageBackground
        source={require("@/assets/images/app-full-screen.webp")}
        style={styles.background}
        resizeMode="cover"
      >
        <View pointerEvents="none" style={styles.topBlueBar} />
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
                <Text style={styles.headerSubtitle}>English • Kiswahili • Sheng</Text>
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

            {activeChat ? <SessionStatusStrip chat={activeChat} /> : null}

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
                {!activeChat ? (
                  <WelcomePanel onStart={startFlow} />
                ) : (
                  <>
                    {activeChat.messages.length === 0 ? (
                      <ChatStarter mode={activeChat.mode} onStart={startFlow} />
                    ) : null}

                    {activeChat.messages.map((message, index) => (
                      <MessageBlock
                        key={message.id}
                        message={message}
                        animate={message.role === "assistant" && index === activeChat.messages.length - 1}
                        onPropertyPress={openProperty}
                        onSuggestionPress={sendMessage}
                      />
                    ))}

                    {isAgentTyping ? (
                      <View style={styles.typingRow}>
                        <Image
                          source={require("@/assets/icons/masqany-agent.webp")}
                          style={styles.typingAvatar}
                          resizeMode="cover"
                        />
                        <View style={styles.typingBubble}>
                          <Text style={styles.typingText}>Masqany AI is thinking</Text>
                          <View style={styles.typingDots}>
                            <View style={styles.typingDot} />
                            <View style={styles.typingDot} />
                            <View style={styles.typingDot} />
                          </View>
                        </View>
                      </View>
                    ) : null}
                  </>
                )}
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

          {sidebarVisible ? (
            <Pressable style={[styles.overlay, { left: SIDEBAR_WIDTH }]} onPress={closeSidebar} />
          ) : null}

          <Animated.View
            style={[
              styles.sidebar,
              {
                width: SIDEBAR_WIDTH,
                transform: [{ translateX: slideAnim }],
              },
            ]}
            pointerEvents={sidebarVisible ? "auto" : "none"}
            {...sidebarPanResponder.panHandlers}
	          >
	            <LinearGradient
	              colors={["#66E3EA", "#1588D6", "#004AAD"]}
	              start={{ x: 0, y: 0 }}
	              end={{ x: 1, y: 1 }}
	              style={styles.sidebarGradient}
	            >
              <SafeAreaView style={styles.sidebarSafeArea} edges={["top", "bottom"]}>
                <View style={styles.sidebarHeader}>
                  <View style={styles.sidebarBrandMark}>
                    <Image
                      source={require("@/assets/icons/masqany-agent.webp")}
                      style={styles.sidebarBrandIcon}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={styles.sidebarHeaderCopy}>
                    <Text style={styles.sidebarEyebrow}>Masqany AI</Text>
                    <Text style={styles.sidebarTitle}>Chat workspace</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.sidebarCloseButton}
                    onPress={closeSidebar}
                    activeOpacity={0.78}
                  >
                    <Image
                      source={require("@/assets/icons/close-icon.webp")}
                      style={styles.sidebarCloseIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.sidebarStats}>
                  <View style={styles.sidebarStatItem}>
                    <Text style={styles.sidebarStatValue}>{filteredChats.length}</Text>
                    <Text style={styles.sidebarStatLabel}>Active</Text>
                  </View>
                  <View style={styles.sidebarStatDivider} />
                  <View style={styles.sidebarStatItem}>
                    <Text style={styles.sidebarStatValue}>
                      {chats.filter((chat) => chat.isPinned && !chat.isArchived).length}
                    </Text>
                    <Text style={styles.sidebarStatLabel}>Pinned</Text>
                  </View>
                  <View style={styles.sidebarStatDivider} />
                  <View style={styles.sidebarStatItem}>
                    <Text style={styles.sidebarStatValue}>
                      {chats.filter((chat) => chat.mode === "plan" && !chat.isArchived).length}
                    </Text>
                    <Text style={styles.sidebarStatLabel}>Plans</Text>
                  </View>
                </View>

                <View style={styles.sidebarSearchRow}>
                  <View style={styles.sidebarSearch}>
                    <Image
                      source={require("@/assets/icons/search.png")}
                      style={styles.sidebarSearchIcon}
                      resizeMode="contain"
                    />
                    <TextInput
                      style={styles.sidebarSearchInput}
                      placeholder="Search chats"
                      placeholderTextColor="rgba(255,255,255,0.58)"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.sidebarNewButton}
                    onPress={() => createNewChat("start")}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={require("@/assets/icons/message.webp")}
                      style={styles.sidebarNewIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.sidebarCommandGrid}>
                  <TouchableOpacity style={styles.sidebarCommand} onPress={() => createNewChat("start")}>
                    <View style={styles.sidebarCommandIconWrap}>
                      <Image
                        source={require("@/assets/icons/new-agent.webp")}
                        style={styles.sidebarCommandIcon}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={styles.sidebarCommandText}>New Chat</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.sidebarCommand} onPress={() => createNewChat("plan")}>
                    <View style={styles.sidebarCommandIconWrap}>
                      <Image
                        source={require("@/assets/icons/ai-analytics.webp")}
                        style={styles.sidebarCommandIcon}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={styles.sidebarCommandText}>Discovery Plan</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.myChatsHeader}>
                  <Text style={styles.myChatsTitle}>My Chats</Text>
                  <Text style={styles.myChatsCount}>{filteredChats.length}</Text>
                </View>

                <ScrollView style={styles.chatList} showsVerticalScrollIndicator={false}>
                  {filteredChats.length === 0 ? (
                    <View style={styles.noChats}>
                      <Text style={styles.noChatsText}>No chats match your search.</Text>
                    </View>
                  ) : null}

                  {filteredChats.map((chat) => {
                    const lastMessage = chat.messages[chat.messages.length - 1];
                    const resultCount = chat.messages.reduce(
                      (total, message) => total + (message.resultIds?.length ?? 0),
                      0
                    );
                    const isActive = activeChatId === chat.id;

                    return (
                    <View key={chat.id} style={styles.chatListItemWrap}>
                      <TouchableOpacity
                        style={[
                          styles.chatListItem,
                          isActive ? styles.activeChatItem : undefined,
                        ]}
                        onPress={() => selectChat(chat.id)}
                        activeOpacity={0.82}
                      >
                        <View style={[styles.chatModeRail, chat.mode === "plan" ? styles.planModeRail : undefined]} />
                        <View style={styles.chatTitleWrap}>
                          <View style={styles.chatTitleRow}>
                            {chat.isPinned ? (
                              <Image
                                source={require("@/assets/icons/pin-chart.webp")}
                                style={styles.pinIcon}
                                resizeMode="contain"
                              />
                            ) : null}
                            <Text
                              style={[
                                styles.chatTitle,
                                isActive ? styles.activeChatTitle : undefined,
                              ]}
                              numberOfLines={1}
                            >
                              {chat.title}
                            </Text>
                          </View>
                          <Text
                            style={[
                              styles.chatPreview,
                              isActive ? styles.activeChatPreview : undefined,
                            ]}
                            numberOfLines={1}
                          >
                            {lastMessage?.text || (chat.mode === "plan" ? "Discovery plan ready" : "Start a fresh property chat")}
                          </Text>
                          <View style={styles.chatMetaRow}>
                            <Text style={[styles.chatDate, isActive ? styles.activeChatDate : undefined]}>
                              {chat.date}
                            </Text>
                            <View style={[styles.chatModePill, isActive ? styles.activeChatModePill : undefined]}>
                              <Text style={[styles.chatModeText, isActive ? styles.activeChatModeText : undefined]}>
                                {chat.mode === "plan" ? "Plan" : "Chat"}
                              </Text>
                            </View>
                            {resultCount > 0 ? (
                              <Text style={[styles.chatResultCount, isActive ? styles.activeChatDate : undefined]}>
                                {resultCount} matches
                              </Text>
                            ) : null}
                          </View>
                        </View>
                        <TouchableOpacity
                          style={styles.chatMenuButton}
                          onPress={() =>
                            setChatOptionsVisible((current) => (current === chat.id ? null : chat.id))
                          }
                          activeOpacity={0.75}
                        >
                          <Image
                            source={require("@/assets/icons/ellipsis.png")}
                            style={styles.chatMenuIcon}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      </TouchableOpacity>

                      {chatOptionsVisible === chat.id ? (
                        <View style={styles.optionsMenu}>
                          <OptionRow
                            icon={require("@/assets/icons/rename.png")}
                            label="Rename"
                            onPress={() => openRename(chat)}
                          />
                          <OptionRow
                            icon={require("@/assets/icons/archive-chat-icon.webp")}
                            label="Archive"
                            onPress={() => archiveChat(chat.id)}
                          />
                          <OptionRow
                            icon={require("@/assets/icons/pin-chart.webp")}
                            label={chat.isPinned ? "Unpin Chat" : "Pin Chat"}
                            onPress={() => pinChat(chat.id)}
                          />
                          <OptionRow
                            icon={require("@/assets/icons/delete.png")}
                            label="Delete"
                            danger
                            onPress={() => deleteChat(chat.id)}
                          />
                        </View>
                      ) : null}
                    </View>
                    );
                  })}
                </ScrollView>
              </SafeAreaView>
            </LinearGradient>
          </Animated.View>
        </SafeAreaView>

        <View
          pointerEvents="none"
          style={[styles.bottomBlueBar, isKeyboardVisible ? styles.bottomBlueBarHidden : undefined]}
        >
          <View style={styles.bottomDivider} />
        </View>
      </ImageBackground>

      <Modal visible={!!renameChatId} transparent animationType="fade" onRequestClose={() => setRenameChatId(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.renameCard}>
            <Text style={styles.renameTitle}>Rename chat</Text>
            <TextInput
              value={renameValue}
              onChangeText={setRenameValue}
              style={styles.renameInput}
              placeholder="Chat title"
              placeholderTextColor="#7B858A"
              autoFocus
            />
            <View style={styles.renameActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setRenameChatId(null)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveRename}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function WelcomePanel({
  onStart,
}: {
  onStart: (mode: ChatMode) => void;
}) {
  return (
    <View>
      <View style={styles.cardRow}>
        <ActionCard
          title="Prompt Masqany"
          subtitle="Start Now"
          icon={require("@/assets/icons/prompt-masqany.webp")}
          onPress={() => onStart("start")}
        />
        <ActionCard
          title="Smart Scheduling and Discovery Engine"
          subtitle="Plan Now"
          icon={require("@/assets/icons/ai-analytics.webp")}
          onPress={() => onStart("plan")}
        />
      </View>

      <View style={styles.aiIntro}>
        <View style={styles.introTitleRow}>
          <Image source={require("@/assets/icons/location.png")} style={styles.introIcon} resizeMode="contain" />
          <Text style={styles.introTitle}>
            <Text style={styles.blueText}>MASQANY AI</Text> Finds, Reserves and Reminds
          </Text>
        </View>
        <Image
          source={require("@/assets/icons/masqany-agent.webp")}
          style={styles.agentHero}
          resizeMode="contain"
        />
        <Text style={styles.justAsk}>Just ask it</Text>
        <View style={styles.enterprisePanel}>
          <CapabilityMetric value="24/7" label="AI concierge" />
          <CapabilityMetric value="KES 0" label="Initial access" />
          <CapabilityMetric value="Live" label="Match alerts" />
        </View>
      </View>
    </View>
  );
}

function ChatStarter({
  mode,
  onStart,
}: {
  mode: ChatMode;
  onStart: (mode: ChatMode) => void;
}) {
  return (
    <View style={styles.chatStarter}>
      <Image source={require("@/assets/icons/masqany-agent.webp")} style={styles.starterAgent} resizeMode="contain" />
      <Text style={styles.chatStarterTitle}>
        {mode === "plan" ? "Build a property discovery plan" : "Start a Masqany query"}
      </Text>
      <Text style={styles.chatStarterText}>
        {mode === "plan"
          ? "Tell me the specs and I will ask smart follow-up questions, track matches, and remind you."
          : "Ask for properties, prices, places, viewing, short stays, or moving help."}
      </Text>
      <View style={styles.cardRow}>
        <SmallFlowButton label="Start Now" onPress={() => onStart("start")} />
        <SmallFlowButton label="Plan Now" onPress={() => onStart("plan")} />
      </View>
    </View>
  );
}

function SessionStatusStrip({ chat }: { chat: ChatSession }) {
  const matchCount = chat.messages.reduce(
    (total, message) => total + (message.resultIds?.length ?? 0),
    0
  );

  return (
    <View style={styles.sessionStrip}>
      <View style={styles.sessionModeBadge}>
        <Image
          source={
            chat.mode === "plan"
              ? require("@/assets/icons/ai-analytics.webp")
              : require("@/assets/icons/prompt-masqany.webp")
          }
          style={styles.sessionModeIcon}
          resizeMode="contain"
        />
        <Text style={styles.sessionModeText}>
          {chat.mode === "plan" ? "Discovery plan" : "Instant chat"}
        </Text>
      </View>
      <View style={styles.sessionMetrics}>
        <Text style={styles.sessionMetricText}>Verified intelligence</Text>
        <View style={styles.sessionDot} />
        <Text style={styles.sessionMetricText}>{matchCount} matches</Text>
      </View>
    </View>
  );
}

function CapabilityMetric({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.capabilityMetric}>
      <Text style={styles.capabilityValue}>{value}</Text>
      <Text style={styles.capabilityLabel}>{label}</Text>
    </View>
  );
}

function ActionCard({
  title,
  subtitle,
  icon,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: number;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.actionCard} activeOpacity={0.84} onPress={onPress}>
      <LinearGradient
        colors={["rgba(225,230,232,0.96)", "#FFFFFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.actionCardGradient}
      >
        <Text style={styles.actionCardTitle}>{title}</Text>
        <Image source={icon} style={styles.actionCardIcon} resizeMode="contain" />
        <Text style={styles.actionCardSubtitle}>{subtitle}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

function SmallFlowButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.smallFlowButton} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.smallFlowButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

function MessageBlock({
  message,
  animate,
  onPropertyPress,
  onSuggestionPress,
}: {
  message: ChatMessage;
  animate: boolean;
  onPropertyPress: (propertyId: string) => void;
  onSuggestionPress: (text: string) => void;
}) {
  const properties = useMemo(
    () =>
      message.resultIds
        ? message.resultIds
            .map((id) => mockVideoFeedData.find((property) => property.id === id))
            .filter((item): item is PropertyVideo => !!item)
        : [],
    [message.resultIds]
  );

  if (message.role === "user") {
    return (
      <View style={styles.userRow}>
        <View style={styles.userBubble}>
          <Text style={styles.userText}>{message.text}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.assistantBlock}>
      {animate ? (
        <AgentBubble message={message.text} speed={10} style={styles.agentBubbleSpacing} />
      ) : (
        <View style={styles.agentStaticRow}>
          <Image
            source={require("@/assets/icons/masqany-agent.webp")}
            style={styles.agentAvatar}
            resizeMode="cover"
          />
          <View style={styles.agentStaticBubble}>
            <Text style={styles.agentStaticText}>{message.text}</Text>
          </View>
        </View>
      )}

      {properties.length > 0 ? (
        <FlatList
          horizontal
          data={properties}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.propertyList}
          renderItem={({ item, index }) => (
            <PropertyResultCard property={item} index={index} onPress={onPropertyPress} />
          )}
        />
      ) : null}

      {message.suggestions?.length ? (
        <View style={styles.suggestionWrap}>
          {message.suggestions.map((suggestion) => (
            <TouchableOpacity
              key={suggestion}
              style={styles.suggestionChip}
              onPress={() => onSuggestionPress(suggestion)}
              activeOpacity={0.8}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function PropertyResultCard({
  property,
  index,
  onPress,
}: {
  property: PropertyVideo;
  index: number;
  onPress: (propertyId: string) => void;
}) {
  return (
    <TouchableOpacity style={styles.propertyCard} onPress={() => onPress(property.id)} activeOpacity={0.84}>
      <Image source={imageFor(index)} style={styles.propertyImage} resizeMode="cover" />
      <View style={styles.propertyInfo}>
        <Text style={styles.propertyTitle} numberOfLines={1}>
          {property.title}
        </Text>
        <View style={styles.propertyMetaRow}>
          <Image source={require("@/assets/icons/i-payment-icon.webp")} style={styles.propertyMetaIcon} />
          <Text style={styles.propertyMetaText}>{formatPrice(property)}</Text>
        </View>
        <View style={styles.propertyMetaRow}>
          <Image source={require("@/assets/icons/i-location-icon.webp")} style={styles.propertyMetaIcon} />
          <Text style={styles.propertyMetaText}>{property.location.estate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function OptionRow({
  icon,
  label,
  danger,
  onPress,
}: {
  icon: number;
  label: string;
  danger?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.optionRow} onPress={onPress} activeOpacity={0.75}>
      <Image source={icon} style={styles.optionIcon} resizeMode="contain" />
      <Text style={[styles.optionText, danger ? styles.dangerText : undefined]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  topBlueBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "3.5%",
    backgroundColor: THEME_BLUE,
    zIndex: 50,
  },
  bottomBlueBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: THEME_BLUE,
    zIndex: 50,
  },
  bottomBlueBarHidden: {
    opacity: 0,
  },
  bottomDivider: {
    height: 1,
    backgroundColor: "#000",
  },
  main: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 10,
  },
  menuButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: THEME_BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  menuIcon: {
    width: 22,
    height: 22,
    tintColor: "#FFFFFF",
  },
  headerCopy: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    color: "#000",
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
  },
  headerSubtitle: {
    color: "rgba(0,0,0,0.58)",
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    marginTop: -2,
  },
  sessionStrip: {
    marginHorizontal: 18,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "rgba(225,230,232,0.9)",
    minHeight: 46,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.72)",
  },
  sessionModeBadge: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  sessionModeIcon: {
    width: 21,
    height: 21,
    marginRight: 7,
  },
  sessionModeText: {
    color: "#111",
    fontFamily: "Inter_700Bold",
    fontSize: 12,
  },
  sessionMetrics: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  sessionMetricText: {
    color: "rgba(0,0,0,0.58)",
    fontFamily: "Inter_700Bold",
    fontSize: 10,
  },
  sessionDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: THEME_BLUE,
    marginHorizontal: 6,
  },
  newHeaderButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  newHeaderIcon: {
    width: 20,
    height: 20,
  },
  chatShell: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 18,
  },
  composerWrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 110,
  },
  composerWrapKeyboard: {
    paddingBottom: 10,
  },
  composer: {
    minHeight: 54,
    maxHeight: 118,
    borderRadius: 28,
    backgroundColor: "#111",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 18,
    paddingRight: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 5,
  },
  composerInput: {
    flex: 1,
    maxHeight: 96,
    color: "#FFFFFF",
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    paddingVertical: 12,
  },
  composerIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  composerIcon: {
    width: 20,
    height: 20,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME_BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.4,
  },
  sendIcon: {
    width: 18,
    height: 18,
  },
  cardRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },
  actionCard: {
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 5,
  },
  actionCardGradient: {
    minHeight: 148,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 13,
  },
  actionCardTitle: {
    color: "#111",
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
  actionCardIcon: {
    width: 58,
    height: 58,
  },
  actionCardSubtitle: {
    color: THEME_BLUE,
    fontFamily: "Poppins_700Bold",
    fontSize: 14,
  },
  aiIntro: {
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: "rgba(225,230,232,0.86)",
    padding: 18,
  },
  introTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  introIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  introTitle: {
    flex: 1,
    color: "#111",
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    lineHeight: 20,
  },
  blueText: {
    color: THEME_BLUE,
  },
  agentHero: {
    alignSelf: "center",
    width: SCREEN_WIDTH * 0.62,
    height: SCREEN_WIDTH * 0.42,
    marginVertical: 18,
  },
  justAsk: {
    color: "#111",
    textAlign: "center",
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    marginBottom: 12,
  },
  enterprisePanel: {
    flexDirection: "row",
    gap: 8,
  },
  capabilityMetric: {
    flex: 1,
    minHeight: 58,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  capabilityValue: {
    color: THEME_BLUE,
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
  },
  capabilityLabel: {
    color: "rgba(0,0,0,0.62)",
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    textAlign: "center",
    marginTop: 2,
  },
  suggestionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  suggestionChip: {
    minHeight: 34,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  suggestionText: {
    color: "#111",
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
  },
  chatStarter: {
    alignItems: "center",
    backgroundColor: "rgba(225,230,232,0.9)",
    borderRadius: 8,
    padding: 18,
  },
  starterAgent: {
    width: 110,
    height: 110,
    marginBottom: 12,
  },
  chatStarterTitle: {
    color: "#111",
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    textAlign: "center",
  },
  chatStarterText: {
    color: "rgba(0,0,0,0.62)",
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 6,
    marginBottom: 14,
  },
  smallFlowButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: THEME_BLUE,
  },
  smallFlowButtonText: {
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    fontSize: 13,
  },
  userRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 16,
  },
  userBubble: {
    maxWidth: "82%",
    backgroundColor: THEME_BLUE,
    borderRadius: 18,
    borderTopRightRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 11,
  },
  userText: {
    color: "#FFFFFF",
    fontFamily: "Inter_500Medium",
    fontSize: 16,
    lineHeight: 23,
  },
  assistantBlock: {
    marginBottom: 18,
  },
  agentBubbleSpacing: {
    marginBottom: 8,
  },
  agentStaticRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 8,
  },
  agentAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  agentStaticBubble: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.78)",
    borderRadius: 18,
    borderTopLeftRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 11,
  },
  agentStaticText: {
    color: "#1A2225",
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    lineHeight: 24,
  },
  propertyList: {
    paddingLeft: 56,
    paddingRight: 18,
    gap: 12,
  },
  propertyCard: {
    width: 214,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: CARD_BG,
  },
  propertyImage: {
    width: "100%",
    height: 118,
  },
  propertyInfo: {
    padding: 10,
  },
  propertyTitle: {
    color: "#111",
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    marginBottom: 7,
  },
  propertyMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  propertyMetaIcon: {
    width: 14,
    height: 14,
    marginRight: 6,
  },
  propertyMetaText: {
    color: "rgba(0,0,0,0.7)",
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
  },
  typingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  typingAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    borderTopLeftRadius: 5,
    backgroundColor: "rgba(255,255,255,0.78)",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  typingText: {
    color: "#111",
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    marginRight: 8,
  },
  typingDots: {
    flexDirection: "row",
    gap: 4,
  },
  typingDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: THEME_BLUE,
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    zIndex: 80,
    backgroundColor: "rgba(0,0,0,0.38)",
  },
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
  },
  sidebarGradient: {
    flex: 1,
  },
  sidebarSafeArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sidebarHeader: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 12,
  },
  sidebarBrandMark: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  sidebarBrandIcon: {
    width: 34,
    height: 34,
  },
  sidebarHeaderCopy: {
    flex: 1,
  },
  sidebarEyebrow: {
    color: "rgba(255,255,255,0.72)",
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    textTransform: "uppercase",
  },
  sidebarTitle: {
    color: "#FFFFFF",
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    marginTop: 1,
  },
  sidebarCloseButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0,0,0,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  sidebarCloseIcon: {
    width: 13,
    height: 13,
    tintColor: "#FFFFFF",
  },
  sidebarStats: {
    minHeight: 58,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  sidebarStatItem: {
    flex: 1,
    alignItems: "center",
  },
  sidebarStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  sidebarStatValue: {
    color: "#FFFFFF",
    fontFamily: "Poppins_700Bold",
    fontSize: 17,
  },
  sidebarStatLabel: {
    color: "rgba(255,255,255,0.68)",
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    marginTop: 1,
  },
  sidebarSearchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 12,
  },
  sidebarSearch: {
    flex: 1,
    minHeight: 44,
    borderRadius: 22,
    backgroundColor: "rgba(26,34,37,0.88)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  sidebarSearchIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    tintColor: "#FFFFFF",
  },
  sidebarSearchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    paddingVertical: 8,
  },
  sidebarNewButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  sidebarNewIcon: {
    width: 20,
    height: 20,
  },
  sidebarCommandGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  sidebarCommand: {
    flex: 1,
    minHeight: 78,
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  sidebarCommandIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.24)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  sidebarCommandIcon: {
    width: 19,
    height: 19,
  },
  sidebarCommandText: {
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    lineHeight: 15,
  },
  myChatsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
    marginBottom: 10,
  },
  myChatsTitle: {
    color: "#FFFFFF",
    fontFamily: "Poppins_700Bold",
    fontSize: 17,
  },
  myChatsCount: {
    minWidth: 28,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    overflow: "hidden",
    textAlign: "center",
    color: "#004AAD",
    backgroundColor: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    fontSize: 12,
  },
  chatList: {
    flex: 1,
  },
  noChats: {
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.14)",
    padding: 14,
  },
  noChatsText: {
    color: "#FFFFFF",
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  chatListItemWrap: {
    marginBottom: 8,
  },
  chatListItem: {
    minHeight: 86,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 0,
    paddingRight: 7,
    paddingVertical: 9,
    backgroundColor: "rgba(255,255,255,0.13)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  activeChatItem: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
  },
  chatModeRail: {
    width: 4,
    alignSelf: "stretch",
    borderRadius: 4,
    backgroundColor: "#5DE0E6",
    marginLeft: 8,
    marginRight: 9,
  },
  planModeRail: {
    backgroundColor: "#FFFFFF",
  },
  chatTitleWrap: {
    flex: 1,
  },
  chatTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 20,
  },
  pinIcon: {
    width: 13,
    height: 13,
    marginRight: 5,
  },
  chatTitle: {
    flex: 1,
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    fontSize: 13,
  },
  activeChatTitle: {
    color: "#004AAD",
  },
  chatPreview: {
    color: "rgba(255,255,255,0.68)",
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    marginTop: 3,
  },
  activeChatPreview: {
    color: "rgba(0,74,173,0.62)",
  },
  chatMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 5,
    marginTop: 7,
  },
  chatDate: {
    color: "rgba(255,255,255,0.66)",
    fontFamily: "Inter_500Medium",
    fontSize: 10,
  },
  activeChatDate: {
    color: "rgba(0,74,173,0.58)",
  },
  chatModePill: {
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  activeChatModePill: {
    backgroundColor: "rgba(63,189,253,0.16)",
  },
  chatModeText: {
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    fontSize: 9,
  },
  activeChatModeText: {
    color: "#004AAD",
  },
  chatResultCount: {
    color: "rgba(255,255,255,0.66)",
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
  },
  chatMenuButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    marginLeft: 6,
  },
  chatMenuIcon: {
    width: 16,
    height: 16,
  },
  optionsMenu: {
    marginTop: 6,
    marginLeft: 42,
    marginRight: 8,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "rgba(63,189,253,0.92)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
  },
  optionRow: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  optionIcon: {
    width: 17,
    height: 17,
    marginRight: 10,
  },
  optionText: {
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    fontSize: 13,
  },
  dangerText: {
    color: "#FFE0E0",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.42)",
    justifyContent: "center",
    padding: 22,
  },
  renameCard: {
    borderRadius: 8,
    backgroundColor: CARD_BG,
    padding: 18,
  },
  renameTitle: {
    color: "#111",
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    marginBottom: 12,
  },
  renameInput: {
    minHeight: 48,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    color: "#111",
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    paddingHorizontal: 12,
  },
  renameActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 14,
  },
  cancelButton: {
    minHeight: 42,
    borderRadius: 21,
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  cancelButtonText: {
    color: "#111",
    fontFamily: "Inter_700Bold",
    fontSize: 13,
  },
  saveButton: {
    minHeight: 42,
    borderRadius: 21,
    justifyContent: "center",
    paddingHorizontal: 18,
    backgroundColor: THEME_BLUE,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    fontSize: 13,
  },
});
