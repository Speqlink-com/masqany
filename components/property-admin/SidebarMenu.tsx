/**
 * SidebarMenu Component
 * 
 * Role-based navigation sidebar for property admin module.
 * 
 * Features:
 * - Opens from left, occupies 80% screen width
 * - Gradient background (#5DE0E6 to #004AAD)
 * - Masqany logo at top
 * - Close button at top-right
 * - Smooth animation with native driver
 * - Dismissible by tapping outside
 * - Role-based section visibility (Property_Owner vs Property_Agent)
 * - Sections: PROPERTIES, AGENTS, ANALYTICS, FINANCE, SUPPORT
 */

import { colors, spacing, typography } from "@/constants/tokens";
import {
    canAccessAgents,
    canAccessFinance,
    canAccessMarketInsights,
    canAccessTenantDemographics,
    canAddProperty,
    canHireAgent,
} from "@/utils/property-admin/permissions";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    Animated,
    Dimensions,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.8;

type UserRole = "Property_Owner" | "Property_Agent";

interface NavigationItem {
  label: string;
  icon: any;
  onPress: () => void;
  badge?: string;
  hideForAgent?: boolean;
}

interface SidebarMenuProps {
  isOpen: boolean;
  userRole: UserRole;
  agentCount?: number;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

export default function SidebarMenu({
  isOpen,
  userRole,
  agentCount = 0,
  onClose,
  onNavigate,
}: SidebarMenuProps) {
  const slideAnim = React.useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  // Animate sidebar open/close
  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : -SIDEBAR_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen, slideAnim]);

  // Section Header Component
  const SectionHeader = ({ title }: { title: string }) => (
    <Text
      style={{
        fontFamily: typography.family.bold,
        fontSize: 13,
        color: "#000000",
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
        paddingHorizontal: spacing.md,
      }}
    >
      {title}
    </Text>
  );

  // Navigation Item Component
  const NavItem = ({ item }: { item: NavigationItem }) => {
    // Hide item if it's agent-only and user is agent
    if (item.hideForAgent && userRole === "Property_Agent") {
      return null;
    }

    return (
      <TouchableOpacity
        onPress={item.onPress}
        activeOpacity={0.8}
        className="flex-row items-center px-5 py-3"
      >
        <Image
          source={item.icon}
          style={{
            width: 24,
            height: 24,
            marginRight: spacing.sm,
          }}
          contentFit="contain"
          cachePolicy="memory-disk"
          placeholder={item.icon}
          transition={200}
        />
        <Text
          style={{
            fontFamily: typography.family.medium,
            fontSize: 15,
            color: colors.light[400],
            flex: 1,
          }}
        >
          {item.label}
          {item.badge && ` (${item.badge})`}
        </Text>
      </TouchableOpacity>
    );
  };

  // PROPERTIES Section
  const propertiesItems: NavigationItem[] = [
    {
      label: "Add New Property",
      icon: require("@/assets/icons/add-new-property.png"),
      onPress: () => {
        onNavigate("/(registration)/property-registration");
        onClose();
      },
      hideForAgent: !canAddProperty(userRole),
    },
    {
      label: "All Listings",
      icon: require("@/assets/icons/listing-icon.png"),
      onPress: () => {
        onNavigate("/(property-admin)/index");
        onClose();
      },
    },
    {
      label: "Archived",
      icon: require("@/assets/icons/listing-icon.png"),
      onPress: () => {
        // Navigate to archived properties
        onClose();
      },
    },
  ];

  // AGENTS Section
  const agentsItems: NavigationItem[] = [
    {
      label: "My Agents",
      icon: require("@/assets/icons/my-agents-icon.png"),
      badge: agentCount.toString(),
      onPress: () => {
        onNavigate("/(property-admin)/agents");
        onClose();
      },
    },
    {
      label: "Hire New Agent",
      icon: require("@/assets/icons/new-agent.webp"),
      onPress: () => {
        // Navigate to agent hiring flow
        onClose();
      },
      hideForAgent: !canHireAgent(userRole),
    },
  ];

  // ANALYTICS Section
  const analyticsItems: NavigationItem[] = [
    {
      label: "Performance Reports",
      icon: require("@/assets/icons/performance-reports.png"),
      onPress: () => {
        onNavigate("/(property-admin)/analytics");
        onClose();
      },
    },
    {
      label: "Market Insights",
      icon: require("@/assets/icons/market-insights.png"),
      onPress: () => {
        // Navigate to market insights
        onClose();
      },
      hideForAgent: !canAccessMarketInsights(userRole),
    },
    {
      label: "Tenant Demographics",
      icon: require("@/assets/icons/tenant-demographics.png"),
      onPress: () => {
        // Navigate to tenant demographics
        onClose();
      },
      hideForAgent: !canAccessTenantDemographics(userRole),
    },
  ];

  // FINANCE Section
  const financeItems: NavigationItem[] = [
    {
      label: "Transaction History",
      icon: require("@/assets/icons/transaction-history.png"),
      onPress: () => {
        // Navigate to transaction history
        onClose();
      },
    },
    {
      label: "Invoice Generator",
      icon: require("@/assets/icons/invoice-icon.png"),
      onPress: () => {
        // Navigate to invoice generator
        onClose();
      },
    },
  ];

  // SUPPORT Section
  const supportItems: NavigationItem[] = [
    {
      label: "Settings",
      icon: require("@/assets/icons/settings.png"),
      onPress: () => {
        // Navigate to settings
        onClose();
      },
    },
    {
      label: "Support Center",
      icon: require("@/assets/icons/support.png"),
      onPress: () => {
        // Navigate to support center
        onClose();
      },
    },
  ];

  // Check if section should be hidden for agent using permission utilities
  const shouldShowAgentsSection = canAccessAgents(userRole);
  const shouldShowFinanceSection = canAccessFinance(userRole);

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 bg-black/50"
      >
        {/* Sidebar */}
        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: SIDEBAR_WIDTH,
            transform: [{ translateX: slideAnim }],
          }}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <LinearGradient
              colors={[colors.gradient.start, colors.gradient.end]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ height: "100%" }}
            >
              <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="pt-12 pb-6 px-5">
                  {/* Close Button */}
                  <TouchableOpacity
                    onPress={onClose}
                    activeOpacity={0.8}
                    className="absolute top-12 right-5 w-10 h-10 items-center justify-center"
                  >
                    <Image
                      source={require("@/assets/icons/close-icon.webp")}
                      style={{
                        width: 24,
                        height: 24,
                      }}
                      contentFit="contain"
                      cachePolicy="memory-disk"
                      placeholder={require("@/assets/icons/close-icon.webp")}
                      transition={200}
                    />
                  </TouchableOpacity>

                  {/* Masqany Logo */}
                  <View className="items-center mt-8">
                    <Image
                      source={require("@/assets/images/masqany-logo.png")}
                      style={{ width: 140, height: 50 }}
                      contentFit="contain"
                      cachePolicy="memory-disk"
                      placeholder={require("@/assets/images/masqany-logo.png")}
                      transition={200}
                    />
                  </View>
                </View>

                {/* PROPERTIES Section */}
                <View>
                  <SectionHeader title="PROPERTIES" />
                  {propertiesItems.map((item, index) => (
                    <NavItem key={index} item={item} />
                  ))}
                </View>

                {/* AGENTS Section (Owner only) */}
                {shouldShowAgentsSection && (
                  <View>
                    <SectionHeader title="AGENTS" />
                    {agentsItems.map((item, index) => (
                      <NavItem key={index} item={item} />
                    ))}
                  </View>
                )}

                {/* ANALYTICS Section */}
                <View>
                  <SectionHeader title="ANALYTICS" />
                  {analyticsItems.map((item, index) => (
                    <NavItem key={index} item={item} />
                  ))}
                </View>

                {/* FINANCE Section (Owner only) */}
                {shouldShowFinanceSection && (
                  <View>
                    <SectionHeader title="FINANCE" />
                    {financeItems.map((item, index) => (
                      <NavItem key={index} item={item} />
                    ))}
                  </View>
                )}

                {/* SUPPORT Section */}
                <View className="pb-8">
                  <SectionHeader title="SUPPORT" />
                  {supportItems.map((item, index) => (
                    <NavItem key={index} item={item} />
                  ))}
                </View>
              </ScrollView>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}
